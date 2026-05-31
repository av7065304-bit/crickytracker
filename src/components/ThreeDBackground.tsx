/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}

export default function ThreeDBackground({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create 3D vertices for a rotating sphere (cricket ball representation) and surrounding field orbit
    const points: Point3D[] = [];
    const numPoints = 140;

    const isDark = theme === 'dark';

    // 1. Generate the seam of a cricket ball (3D sine wave wrapped on a sphere)
    for (let i = 0; i < numPoints; i++) {
      const theta = (i / numPoints) * Math.PI * 2;
      const radius = 170;
      
      // Basic sphere coords
      let sx = radius * Math.cos(theta);
      let sy = radius * Math.sin(theta);
      let sz = 25 * Math.sin(theta * 6); // Wavy seam pattern

      // Tilt the seam slightly
      const tiltAngle = Math.PI / 4;
      const x = sx;
      const y = sy * Math.cos(tiltAngle) - sz * Math.sin(tiltAngle);
      const z = sy * Math.sin(tiltAngle) + sz * Math.cos(tiltAngle);

      points.push({
        x,
        y,
        z,
        color: i % 2 === 0 
          ? (isDark ? 'rgba(52, 211, 153, 0.7)' : 'rgba(16, 185, 129, 0.45)') 
          : (isDark ? 'rgba(167, 139, 250, 0.75)' : 'rgba(139, 92, 246, 0.45)'), 
        size: 3
      });
    }

    // 2. Generate ambient stadium dust/constellation points floating in 3D space
    const fieldPoints: Point3D[] = [];
    for (let i = 0; i < 90; i++) {
      // Outer orbits
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 280 + Math.random() * 200;

      fieldPoints.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        color: isDark 
          ? (Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(241, 245, 249, 0.3)') 
          : (Math.random() > 0.5 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(226, 232, 240, 0.25)'),
        size: Math.random() * 2 + 1
      });
    }

    let angleX = 0.0015;
    let angleY = 0.0025;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Track mouse coordinates normalized around center
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) * 0.00015;
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) * 0.00015;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate mouse tilt for rich parallax feel
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const currentAngleX = angleX + mouseRef.current.y;
      const currentAngleY = angleY + mouseRef.current.x;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // Center offset
      const cx = width * 0.85; // Float nicely in the right sector of high-resolution monitors
      const cy = height * 0.55;

      const renderList: { px: number; py: number; size: number; color: string; depth: number }[] = [];

      // Project and rotate all points
      const rotateAndProject = (pList: Point3D[]) => {
        pList.forEach((p) => {
          // 3D rotations
          // Rotate around X
          let y1 = p.y * cosX - p.z * sinX;
          let z1 = p.z * cosX + p.y * sinX;

          // Rotate around Y
          let x2 = p.x * cosY - z1 * sinY;
          let z2 = z1 * cosY + p.x * sinY;

          // Save modified values back so rotation accumulates over frames
          p.x = x2;
          p.y = y1;
          p.z = z2;

          // Perspective projection
          const fov = 450;
          const distance = 450;
          
          // Prevent division by zero or negative perspective scaling for points behind the camera view
          if (distance + z2 <= 50) return;
          
          const scale = fov / (distance + z2);
          const px = cx + x2 * scale;
          const py = cy + y1 * scale;

          if (px > 0 && px < width && py > 0 && py < height) {
            renderList.push({
              px,
              py,
              size: Math.max(0.1, p.size * scale),
              color: p.color,
              depth: z2
            });
          }
        });
      };

      rotateAndProject(points);
      rotateAndProject(fieldPoints);

      // Depth sort to ensure front-facing entities overlap background elements
      renderList.sort((a, b) => b.depth - a.depth);

      // Render seam connections for complete wireframe high-fidelity visuals
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.15)';
      
      // Render individual coordinate vertices
      renderList.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Add ambient glowing halos for front-facing vertices
        if (p.depth < -80) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, Math.max(0.5, p.size * 3.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(/[\d\.]+\)$/, '0.08)');
          ctx.fill();
        }
      });

      // Ambient connecting dust filaments
      for (let i = 0; i < renderList.length; i += 7) {
        const p1 = renderList[i];
        for (let j = i + 1; j < Math.min(i + 4, renderList.length); j++) {
          const p2 = renderList[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = isDark
              ? `rgba(167, 139, 250, ${Math.max(0, 0.06 - dist / 1800)})`
              : `rgba(139, 92, 246, ${Math.max(0, 0.05 - dist / 2200)})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }}
    />
  );
}
