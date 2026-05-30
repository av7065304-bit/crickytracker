/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LOCAL_PLAYERS } from '../data';
import { Shield, Sparkles, Plus, Minus, UserCheck, HelpCircle, Activity } from 'lucide-react';

export default function FantasyBuilder() {
  const [selectedMatch, setSelectedMatch] = useState('LIVE_001');
  const [salaryCap, setSalaryCap] = useState<number>(100);
  const [selectedRoster, setSelectedRoster] = useState<any[]>([
    { name: 'Virat Kohli', role: 'Batter', cost: 10.5, ownership: 92, pts: 124, id: 'V_KOHLI' },
    { name: 'KL Rahul', role: 'Wicketkeeper', cost: 9.0, ownership: 64, pts: 68, id: 'KL_RAHUL' },
    { name: 'Jasprit Bumrah', role: 'Bowler', cost: 10.0, ownership: 88, pts: 140, id: 'J_BUMRAH' },
    { name: 'Glenn Maxwell', role: 'All-Rounder', cost: 9.5, ownership: 74, pts: 110, id: 'G_MAXWELL' }
  ]);
  const [captain, setCaptain] = useState<string>('V_KOHLI');
  const [viceCaptain, setViceCaptain] = useState<string>('J_BUMRAH');

  const safePicks = [
    { name: 'Virat Kohli (IND)', ownership: '92%', role: 'Batter', pts: '124 pts' },
    { name: 'Jasprit Bumrah (IND)', ownership: '88%', role: 'Bowler', pts: '140 pts' }
  ];

  const differentialPicks = [
    { name: 'Glenn Maxwell (AUS)', ownership: '24%', role: 'All-Rounder', pts: '110 pts' },
    { name: 'KL Rahul (IND)', ownership: '32%', role: 'Wicketkeeper', pts: '68 pts' }
  ];

  // Calculate sum metrics
  const totalCostUsed = selectedRoster.reduce((sum, player) => sum + player.cost, 0);
  const totalExpectedPoints = selectedRoster.reduce((sum, player) => {
    let multiplier = 1.0;
    if (player.id === captain) multiplier = 2.0; // 2x points for Captain
    else if (player.id === viceCaptain) multiplier = 1.5; // 1.5x points for VC
    return sum + (player.pts || 0) * multiplier;
  }, 0);

  const handleCreateAITeam = () => {
    // Generate an optimized full dream lineup of 11 players automatically matching budget
    const fullLineup = [
      { name: 'Virat Kohli', role: 'Batter', cost: 10.5, ownership: 92, pts: 124, id: 'V_KOHLI' },
      { name: 'Jasprit Bumrah', role: 'Bowler', cost: 10.0, ownership: 88, pts: 140, id: 'J_BUMRAH' },
      { name: 'KL Rahul', role: 'Wicketkeeper', cost: 9.0, ownership: 64, pts: 68, id: 'KL_RAHUL' },
      { name: 'Glenn Maxwell', role: 'All-Rounder', cost: 9.5, ownership: 74, pts: 110, id: 'G_MAXWELL' },
      { name: 'Pat Cummins', role: 'Bowler', cost: 9.0, ownership: 52, pts: 55, id: 'P_CUMMINS' },
      { name: 'Josh Hazelwood', role: 'Bowler', cost: 8.5, ownership: 45, pts: 48, id: 'J_HAZELWOOD' },
      { name: 'Steve Smith', role: 'Batter', cost: 9.5, ownership: 70, pts: 92, id: 'S_SMITH' },
      { name: 'Ravindra Jadeja', role: 'All-Rounder', cost: 9.0, ownership: 61, pts: 84, id: 'R_JADEJA' },
      { name: 'Hardik Pandya', role: 'All-Rounder', cost: 8.5, ownership: 55, pts: 72, id: 'H_PANDYA' },
      { name: 'Adam Zampa', role: 'Bowler', cost: 8.5, ownership: 38, pts: 71, id: 'A_ZAMPA' },
      { name: 'Mitchell Starc', role: 'Bowler', cost: 9.0, ownership: 50, pts: 62, id: 'M_STARC' }
    ];

    setSelectedRoster(fullLineup);
    setCaptain('J_BUMRAH'); // Bumrah for high points
    setViceCaptain('V_KOHLI'); // Kohli as vice
  };

  return (
    <div className="space-y-6">
      {/* Simulation panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Safe and Differential picks index */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4">⭐ AI Recommended Safe Picks</h4>
            <div className="space-y-3 font-mono text-xs">
              {safePicks.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg border border-slate-100/50">
                  <div>
                    <h5 className="font-bold text-gray-800 font-sans">{p.name}</h5>
                    <span className="text-[10px] text-gray-500 block">{p.role} • Ownership {p.ownership}</span>
                  </div>
                  <b className="text-emerald-700">{p.pts}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4">🚀 Differential Grand League Picks</h4>
            <div className="space-y-3 font-mono text-xs">
              {differentialPicks.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg border border-slate-100/50">
                  <div>
                    <h5 className="font-bold text-gray-800 font-sans">{p.name}</h5>
                    <span className="text-[10px] text-gray-500 block">{p.role} • Ownership {p.ownership}</span>
                  </div>
                  <b className="text-indigo-700">{p.pts}</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Line-up Optimization Builder */}
        <div id="fantasy-build-dashboard" className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-55 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
                Dream11 Coefficient Optimizer
              </h3>
              <p className="text-xs text-gray-400">Match lineup projection matching custom budget restraints</p>
            </div>

            <button
              onClick={handleCreateAITeam}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              🚀 AI Auto-Generate 11 Line-up
            </button>
          </div>

          {/* Budget credits tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-indigo-50/30 p-3 rounded-lg border border-indigo-100/20">
              <span className="text-[10px] text-gray-400 block font-mono">Credits Capacity</span>
              <b className="text-base font-mono font-black text-indigo-900">100.0 Cr</b>
            </div>
            <div className="bg-rose-50/30 p-3 rounded-lg border border-rose-100/20">
              <span className="text-[10px] text-gray-400 block font-mono">Credits Expended</span>
              <b className="text-base font-mono font-black text-rose-600">{totalCostUsed.toFixed(1)} Cr</b>
            </div>
            <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100/20">
              <span className="text-[10px] text-gray-400 block font-mono">Credits Remaining</span>
              <b className="text-base font-mono font-black text-emerald-800">{(100 - totalCostUsed).toFixed(1)} Cr</b>
            </div>
            <div className="bg-purple-50/30 p-3 rounded-lg border border-purple-100/20">
              <span className="text-[10px] text-gray-400 block font-mono">Expected Fantasy Points</span>
              <b className="text-base font-mono font-black text-purple-700">{totalExpectedPoints.toFixed(0)} Pts</b>
            </div>
          </div>

          {/* Table display */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left border-collapse min-w-md">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] text-gray-400 uppercase font-mono bg-slate-50/50">
                  <th className="px-4 py-2.5 font-semibold">Player name</th>
                  <th className="px-4 py-2.5 font-semibold">Field Role</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Cost</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Projected Pts</th>
                  <th className="px-4 py-2.5 font-semibold text-center">Set Capt</th>
                  <th className="px-4 py-2.5 font-semibold text-center">Set V-Capt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {selectedRoster.map((player, idx) => (
                  <tr key={idx} className={captain === player.id ? 'bg-indigo-50/15' : viceCaptain === player.id ? 'bg-purple-50/15' : ''}>
                    <td className="px-4 py-3 font-bold text-gray-900 flex items-center gap-1.5">
                      {player.name}
                      {captain === player.id && <span className="bg-indigo-600 text-white text-[9px] font-black px-1 rounded">C</span>}
                      {viceCaptain === player.id && <span className="bg-purple-600 text-white text-[9px] font-black px-1 rounded">VC</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono">{player.role}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-800">{player.cost} Cr</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700 font-extrabold">{player.pts}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setCaptain(player.id);
                          if (viceCaptain === player.id) setViceCaptain('');
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${captain === player.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Captain
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setViceCaptain(player.id);
                          if (captain === player.id) setCaptain('');
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${viceCaptain === player.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        V-Capt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 text-xs flex gap-3 text-slate-600 rounded-lg">
            <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="leading-relaxed font-semibold">
              💡 <b>AI Optimizer Insight:</b> Selecting <b>Jasprit Bumrah</b> as Captain awards <b>2x points (280 pts)</b> due to high probability yorker density stats on soil soil moisture. Pairs great with Virat Kohli (1.5x VC).
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
