/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect, useState } from 'react';
import { InAppNotification } from '../utils/notificationService';
import { Bell, X, Compass, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NotificationOverlay() {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    const handlePush = (e: Event) => {
      const customEvent = e as CustomEvent<InAppNotification>;
      if (customEvent.detail) {
        const newNotif = customEvent.detail;
        setNotifications((prev) => [newNotif, ...prev].slice(0, 5)); // Keep last 5

        // Auto-remove after 6 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
        }, 6500);
      }
    };

    window.addEventListener('cricedge-in-app-push', handlePush);
    return () => {
      window.removeEventListener('cricedge-in-app-push', handlePush);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div id="cricedge-notification-portal" className="fixed top-6 right-6 z-[9999] w-full max-w-sm flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl border border-slate-800 p-4 shadow-2xl flex gap-3 relative overflow-hidden"
          >
            {/* Status gradient light bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-sky-500"></div>

            <div className="flex-1 pl-1.5 space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 bg-slate-800 rounded-lg text-emerald-450 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Bell className="h-3.5 w-3.5 text-emerald-400" />
                    Push Alert
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                </div>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              <div className="flex items-start gap-2.5 pt-1.5">
                {notif.teamLogo && (
                  <span className="text-3xl select-none shrink-0" role="img" aria-label="team">
                    {notif.teamLogo}
                  </span>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-100 leading-tight">
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-medium mt-1 leading-relaxed">
                    {notif.body}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
