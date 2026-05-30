/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, HelpCircle, Activity, Sparkles, TrendingUp } from 'lucide-react';

export default function OddsAnalytics() {
  const [oddsDecimal, setOddsDecimal] = useState<number>(1.65);
  const [activeOddsMatch, setActiveOddsMatch] = useState('LIVE_001');

  // Calculate implied rates
  const impliedWinProbValue = oddsDecimal > 0 ? (100 / oddsDecimal).toFixed(1) : '0';

  const simulatedOddsHistory = [
    { time: 'Over 10', teamA_odds: 1.82, teamB_odds: 1.95, scenario: 'Opening stand remains intact, batsmen consolidating.' },
    { time: 'Over 20', teamA_odds: 1.65, teamB_odds: 2.15, scenario: 'Kohli achieves half century on red soil deck.' },
    { time: 'Over 30', teamA_odds: 1.40, teamB_odds: 2.80, scenario: 'Starc concedes 14 runs in a single over.' },
    { time: 'Over 40 (Current)', teamA_odds: 1.22, teamB_odds: 4.10, scenario: 'India require less than 6 runs per over to achieve grand win.' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs">
        <h3 className="font-bold text-gray-901 border-b border-gray-50 pb-3 mb-6 flex items-center gap-2 text-gray-800">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          Pro-Odds Sentiment & Probabilities tracker
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Implied Probability Calculator Inputs */}
          <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 space-y-4">
            <span className="text-[10px] text-gray-400 font-mono tracking-wider font-bold uppercase block">Implied win Odds Calculator</span>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Enter Decimal Win Odds (e.g. 1.65)</label>
              <input
                type="number"
                step="0.01"
                min="1.01"
                value={oddsDecimal}
                onChange={(e) => setOddsDecimal(Math.max(1.01, parseFloat(e.target.value) || 0))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-xs font-mono focus:outline-emerald-600 block mt-1 bg-white font-black"
              />
            </div>

            <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
              <span className="text-[9px] block text-emerald-800 font-bold uppercase tracking-wide">Implied Win Probability</span>
              <b className="text-xl font-mono text-emerald-950 mt-1 block">{impliedWinProbValue}%</b>
            </div>
          </div>

          {/* Market Sentiment meter */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400">Match Momentum Odds Index changes</h4>
            
            <div className="space-y-3 max-h-56 overflow-y-auto">
              {simulatedOddsHistory.map((h, i) => (
                <div key={i} className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono font-bold block">{h.time}</span>
                    <p className="text-xs text-gray-700 leading-relaxed font-semibold">{h.scenario}</p>
                  </div>

                  <div className="flex gap-3 text-center font-mono">
                    <div className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded">
                      <span className="text-[9px] text-indigo-700 block">IND odds</span>
                      <b className="text-xs">{h.teamA_odds}</b>
                    </div>
                    <div className="px-2 py-1 bg-rose-50 border border-rose-100 rounded">
                      <span className="text-[9px] text-rose-700 block">AUS odds</span>
                      <b className="text-xs">{h.teamB_odds}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informative notification block */}
        <div className="mt-8 p-4 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-800 flex gap-3">
          <span className="h-5 w-5 shrink-0 rounded bg-amber-550 bg-amber-600 text-white flex items-center justify-center font-black">!</span>
          <div>
            <b className="block">Legal Disclaimer / Platform Compliance Notice</b>
            <p className="text-[11px] text-amber-705 leading-relaxed font-semibold mt-0.5">
              CricEdge AI tracks implied probability coefficients and market odds changes purely for mathematical analytics and sports intelligence comparison. <b>Real-money gambling/betting is strictly prohibited on this platform.</b> All values serve informational purposes to enhance fantasy sports roster building and toss assessment logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
