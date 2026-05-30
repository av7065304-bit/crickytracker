/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, ShieldCheck, Compass, HelpCircle, Activity, Sparkles, Loader } from 'lucide-react';

export default function AIPredictor() {
  const [teamA, setTeamA] = useState('India');
  const [teamB, setTeamB] = useState('Australia');
  const [venue, setVenue] = useState('Wankhede Stadium');
  const [format, setFormat] = useState('ODI');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>({
    predictedWinner: 'India',
    confidence: 76,
    tossPrediction: 'Win toss & choose to bowl first',
    topBatter: 'Virat Kohli',
    topBowler: 'Jasprit Bumrah',
    explanation: 'India is projected with a clear home-ground chasing coefficient of 74% win probability. Wankhede pitch density supports batting inside powerplays, offset by bowler Jasprit Bumrah\'s bowling index which restricts late death blocks.',
    historicalSupport: 'In the last 5 bilateral matches at this venue, teams chasing first-innings scores of under 290 achieved victory 4 times.'
  });

  const handleGeneratePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamA === teamB) return;
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamA, teamB, venueName: venue, format })
      });

      const data = await response.json();
      if (data.success && data.prediction) {
        setPrediction(data.prediction);
      }
    } catch (error) {
      console.error("AI Predictor Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation form input block */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
          CricEdge AI Predictor & Projections Console
        </h3>

        <form onSubmit={handleGeneratePrediction} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          <div>
            <label className="text-xs text-slate-500 font-bold mb-1.5 block">Team Alpha</label>
            <select
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-purple-500/50 hover:bg-slate-100/40 transition cursor-pointer"
            >
              <option value="India">🇮🇳 India</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="England">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</option>
              <option value="Pakistan">🇵🇰 Pakistan</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 font-bold mb-1.5 block">Team Beta</label>
            <select
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-purple-500/50 hover:bg-slate-100/40 transition cursor-pointer"
            >
              <option value="Australia">🇦🇺 Australia</option>
              <option value="India">🇮🇳 India</option>
              <option value="England">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</option>
              <option value="Pakistan">🇵🇰 Pakistan</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 font-bold mb-1.5 block">Stadium venue</label>
            <select
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-purple-500/50 hover:bg-slate-100/40 transition cursor-pointer"
            >
              <option value="Wankhede Stadium">Wankhede Stadium (Mumbai)</option>
              <option value="Lords Grounds London">Lord's Grounds (London)</option>
              <option value="Melbourne Cricket Ground">MCG (Melbourne)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || teamA === teamB}
            className="w-full bg-gradient-to-r from-purple-600 to-sky-500 hover:opacity-95 font-bold text-white px-5 py-3.5 rounded-xl text-xs transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer h-11 shadow-sm active:scale-95"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
            Generate AI Projection
          </button>
        </form>

        {teamA === teamB && (
          <p className="text-[10px] text-red-500 font-mono font-bold mt-2">
            ⚠️ Alert: Please select two distinct teams to compute head-to-head parameters.
          </p>
        )}
      </div>

      {/* Prediction Output Results Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expected Winner Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-950 p-6 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-[-15px] bottom-[-15px] opacity-10">
            <ShieldCheck className="h-48 w-48" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] uppercase font-mono tracking-widest font-black bg-emerald-555 text-white bg-emerald-500 px-2 py-0.5 rounded">
                FORECAST OUTCOME
              </span>
              <span className="text-xs font-mono font-bold text-indigo-305">Confidence: {prediction.confidence}%</span>
            </div>

            <span className="text-[11px] block uppercase font-mono text-slate-400">PROJECTED WINNER</span>
            <h1 className="text-3xl font-black mt-2 tracking-tight text-white mb-4">
              {prediction.predictedWinner}
            </h1>

            <div className="w-full bg-indigo-950 h-2 rounded-full overflow-hidden mt-6 relative">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>
          </div>

          <p className="text-[10px] text-indigo-250 font-mono mt-4 border-t border-white/5 pt-4">
            ⚠️ Simulated risk tolerance: Moderate. Values updated in real time via Gemini.
          </p>
        </div>

        {/* Explainable report card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Explainable AI Analysis</h3>
            <p className="text-xs text-gray-400">Data variables, dew, and bounce coefficients leveraged in calculation:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-100/50">
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Top Projected Batter</span>
              <b className="text-sm text-slate-800 font-extrabold mt-1 block">{prediction.topBatter}</b>
            </div>
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-100/50">
              <span className="text-[10px] text-gray-450 block uppercase font-mono tracking-wider">Top Projected Bowler</span>
              <b className="text-sm text-slate-800 font-extrabold mt-1 block">{prediction.topBowler}</b>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 text-slate-700">
              <b className="text-[10px] uppercase font-mono text-indigo-805 tracking-wider block mb-1">Reasoning Analysis</b>
              <p className="leading-relaxed font-semibold">{prediction.explanation}</p>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 text-slate-750">
              <b className="text-[10px] uppercase font-mono text-emerald-805 tracking-wider block mb-1">Historical Evidence Support</b>
              <p className="font-medium">{prediction.historicalSupport}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
