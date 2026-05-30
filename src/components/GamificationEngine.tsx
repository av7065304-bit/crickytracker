/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOCK_USER } from '../data';
import { Award, ShieldAlert, Zap, Calendar, TrendingUp, Trophy, Compass } from 'lucide-react';

export default function GamificationEngine() {
  const [streakCount, setStreakCount] = useState<number>(4); // 4 consecutive correct predictions
  const [globalLeaderboard, setGlobalLeaderboard] = useState([
    { rank: 1, name: 'MumbaiIndians_Fan1', accuracy: 89.2, level: 32, xp: 9500 },
    { rank: 2, name: 'AussieSmack_99', accuracy: 87.5, level: 25, xp: 8100 },
    { rank: 3, name: 'CricEdge_Pro99', accuracy: 84.6, level: 18, xp: 4200 }, // User is third!
    { rank: 4, name: 'LordsDewMaster', accuracy: 81.4, level: 20, xp: 5120 },
    { rank: 5, name: 'T20PowerHitter', accuracy: 78.9, level: 14, xp: 3500 }
  ]);

  const [quests, setQuests] = useState([
    { name: 'Predictor Streak Master', desc: 'Predict 5 consecutive match winners', progress: '4/5', status: 'In-Progress' },
    { name: 'Fantasy Optimizer Scholar', desc: 'Generate 3 optimal Dream11 lineups', progress: '3/3', status: 'Completed' },
    { name: 'Stadium Slope Analyst', desc: 'InspectLord\'s grass slope dimensions', progress: '1/1', status: 'Completed' }
  ]);

  return (
    <div className="space-y-6">
      {/* Level Summary Grid Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-[-15px] bottom-[-15px] opacity-10">
          <Trophy className="h-44 w-44" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-widest font-black bg-white/20 text-white px-2 py-0.5 rounded">
              CURRENT LEVEL & XP
            </span>
            <h1 className="text-3xl font-black mt-2 font-mono flex items-center gap-1.5">
              Rank: {MOCK_USER.rank} <span className="text-sm font-semibold opacity-80">(Lvl {MOCK_USER.level})</span>
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
              Expended {MOCK_USER.xp} XP points. Keep scoring correct predictions to unlock Platinum!
            </p>
          </div>

          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0 px-4 text-center">
            <span className="text-xs text-emerald-200 uppercase font-mono font-bold tracking-widest">Prediction Accuracy</span>
            <span className="text-4xl font-black mt-2 font-mono">{MOCK_USER.accuracy}%</span>
            <span className="text-[10px] text-emerald-200 mt-1">Global Percentile: Top 4.8%</span>
          </div>

          <div className="flex flex-col items-end text-right justify-center">
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg border border-white/10">
              <Zap className="h-4 w-4 text-amber-300 animate-bounce" />
              <b className="text-xs font-mono font-bold">{streakCount} Predictor Streak</b>
            </div>
            <p className="text-[10px] text-emerald-100/70 mt-2">Next reward: 150 bonus XP</p>
          </div>
        </div>
      </div>

      {/* Quests lists & Leaderboard split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Quests achievements list */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-gray-901 border-b border-gray-50 pb-3 flex items-center gap-2 text-gray-800">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Weekly Challenges
          </h3>

          <div className="space-y-3">
            {quests.map((q, idx) => (
              <div key={idx} className="p-3 bg-slate-50/70 border border-slate-100/55 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <b className="font-bold text-gray-800">{q.name}</b>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${q.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-semibold">{q.desc}</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span>Progress Ratio</span>
                  <span>{q.progress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Competitions accuracy Leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-emerald-600" /> Global Predictor Accuracy ranks
            </h3>
            <span className="text-[10px] text-gray-400 font-mono font-medium">Updated 10m ago</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-mono bg-slate-50/50">
                  <th className="px-4 py-2 font-semibold">Rank</th>
                  <th className="px-4 py-2 font-semibold">Username</th>
                  <th className="px-4 py-2 font-semibold text-right">Accuracy Ratio</th>
                  <th className="px-4 py-2 font-semibold text-right">User level</th>
                  <th className="px-4 py-2 font-semibold text-right">XP Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {globalLeaderboard.map((u, i) => (
                  <tr key={i} className={u.name === 'CricEdge_Pro99' ? 'bg-emerald-50/20 font-medium' : ''}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {u.rank === 1 ? '🥇 1st' : u.rank === 2 ? '🥈 2nd' : u.rank === 3 ? '🥉 3rd' : `#${u.rank}`}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-1">
                      {u.name}
                      {u.name === 'CricEdge_Pro99' && <span className="bg-emerald-600 text-white text-[8px] px-1 rounded">You</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700 font-black">{u.accuracy}%</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">Lvl {u.level}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-purple-700">{u.xp} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
