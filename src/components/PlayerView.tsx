/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LOCAL_PLAYERS } from '../data';
import { Users, TrendingUp, HelpCircle, Activity, Award, RefreshCw, BarChart2 } from 'lucide-react';

export default function PlayerView() {
  const [selectedPlayer, setSelectedPlayer] = useState(LOCAL_PLAYERS[0]);
  const [pvpBatter, setPvpBatter] = useState(LOCAL_PLAYERS[0]); // Virat Kohli
  const [pvpBowler, setPvpBowler] = useState(LOCAL_PLAYERS[1]); // Jasprit Bumrah
  const [pvpFormat, setPvpFormat] = useState<'ODI' | 'T20' | 'TEST'>('ODI');

  // Let's create a simulated matchup data dictionary
  const getMatchupData = (batterId: string, bowlerId: string, format: string) => {
    if (batterId === 'V_KOHLI' && bowlerId === 'J_BUMRAH') {
      return {
        innings: 18,
        runs: 142,
        balls: 114,
        dismissals: 4,
        strikeRate: 124.5,
        average: 35.5,
        fours: 14,
        sixes: 3,
        dots: 48, // 48 dots
        expectedOutcome: "High Friction Duel. Bumrah limits late room, forcing Kohli to utilize mid-wicket deflections. Predictable strike rate containment."
      };
    }
    // Generic generator for other matches
    return {
      innings: 12,
      runs: 84,
      balls: 72,
      dismissals: 2,
      strikeRate: 116.6,
      average: 42.0,
      fours: 8,
      sixes: 1,
      dots: 32,
      expectedOutcome: "Balanced game. Batter plays with a standard cover offset. Moderate risk boundary ratio."
    };
  };

  const matchup = getMatchupData(pvpBatter.id, pvpBowler.id, pvpFormat);

  return (
    <div className="space-y-6">
      {/* 2 Column section: Player list/stats & PVP matchup tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Player inspection browser */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            CricEdge Roster Intelligence
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {LOCAL_PLAYERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left border transition ${selectedPlayer.id === p.id ? 'bg-emerald-50/40 border-emerald-500 ring-1 ring-emerald-500/20' : 'bg-slate-50 border-gray-100 hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-white h-10 w-10 rounded-full border border-gray-100 flex items-center justify-center shadow-xs">
                    {p.avatar}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{p.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">{p.country} • {p.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Form: {Math.round(p.recentForm.reduce((a,b)=>a+b,0)/p.recentForm.length)} pts
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick selected details card */}
          <div className="bg-slate-50/60 rounded-xl p-4 space-y-3 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Consistency Coefficient</span>
              <span className="font-mono font-bold text-emerald-700">{selectedPlayer.attributes.consistencyIndex}%</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full" style={{ width: `${selectedPlayer.attributes.consistencyIndex}%` }}></div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-gray-500">Risk Vulnerability Index</span>
              <span className="font-mono font-bold text-rose-600">{selectedPlayer.attributes.riskIndex}%</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full" style={{ width: `${selectedPlayer.attributes.riskIndex}%` }}></div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-gray-500">Performance Trend</span>
              <span className="font-bold text-indigo-700">{selectedPlayer.attributes.performanceTrends}</span>
            </div>
          </div>
        </div>

        {/* Center column: Selected player deep statistics & Wagon distributions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-start border-b border-gray-50 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedPlayer.avatar}</span>
              <div>
                <h3 className="text-lg font-black text-gray-900">{selectedPlayer.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono font-medium">
                  {selectedPlayer.country} • {selectedPlayer.role}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg text-center font-mono border border-slate-100/50">
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Career Average</span>
              <p className="text-lg font-black text-emerald-600">{selectedPlayer.career.average}</p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100/30">
              <span className="text-[10px] text-gray-400 block">Matches played</span>
              <b className="text-base font-mono text-gray-800">{selectedPlayer.career.matches}</b>
            </div>
            <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100/30">
              <span className="text-[10px] text-gray-400 block">{selectedPlayer.role === 'Bowler' ? 'Wickets' : 'Career Runs'}</span>
              <b className="text-base font-mono text-gray-800">
                {selectedPlayer.role === 'Bowler' ? selectedPlayer.career.wickets : selectedPlayer.career.runs}
              </b>
            </div>
            <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100/30">
              <span className="text-[10px] text-gray-400 block">Strike Rate</span>
              <b className="text-base font-mono text-gray-800">{selectedPlayer.career.strikeRate}</b>
            </div>
            <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100/30">
              <span className="text-[10px] text-gray-400 block">Best Record</span>
              <b className="text-base font-mono text-emerald-800">{selectedPlayer.career.best}</b>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Wage Areas */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Scoring Outfield Areas</h4>
              <div className="space-y-2">
                {selectedPlayer.wagonWheel.map((w, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>{w.area}</span>
                      <span className="font-bold">{w.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${w.value * 2}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dismissal vulnerabilities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Dismissal / Speed vulnerabilities</h4>
              <div className="space-y-2">
                {selectedPlayer.dismissals.map((d, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>{d.type}</span>
                      <span className="font-bold">{d.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-450 h-full" style={{ width: `${d.value * 2}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PVP Matchup intelligence dashboard Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600 animate-spin" />
              Advanced Player vs Player Matchup Analyst
            </h3>
            <p className="text-xs text-gray-400">Head-to-head match statistical duel simulator</p>
          </div>

          <div className="flex gap-2">
            {['ODI', 'T20', 'TEST'].map((f) => (
              <button
                key={f}
                onClick={() => setPvpFormat(f as any)}
                className={`px-3 py-1 text-xs font-mono rounded ${pvpFormat === f ? 'bg-emerald-600 text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Matchup Selection widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          
          {/* Batsman Selector */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-dashed border-gray-200 text-center flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-mono font-bold block mb-2">Select Batsman</span>
            <select
              value={pvpBatter.id}
              onChange={(e) => setPvpBatter(LOCAL_PLAYERS.find(p => p.id === e.target.value) || LOCAL_PLAYERS[0])}
              className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-emerald-600 font-bold"
            >
              {LOCAL_PLAYERS.filter(p => p.role !== 'Bowler').map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
              ))}
            </select>
            <span className="text-5xl mt-4 shrink-0 block">{pvpBatter.avatar}</span>
            <span className="text-xs font-black mt-2 block">{pvpBatter.name}</span>
            <span className="text-[10px] text-gray-400 uppercase font-mono">{pvpBatter.role}</span>
          </div>

          {/* Versus Statistics details display */}
          <div className="flex flex-col items-center py-4 border-y md:border-y-0 md:border-x border-gray-100">
            <span className="text-xs font-bold text-gray-400 font-mono tracking-widest uppercase">Matchup Record</span>
            
            <div className="grid grid-cols-3 gap-4 w-full text-center mt-4">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Innings</span>
                <b className="text-lg font-black font-mono text-gray-800">{matchup.innings}</b>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Runs Scored</span>
                <b className="text-lg font-black font-mono text-emerald-700">{matchup.runs}</b>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Balls Faced</span>
                <b className="text-lg font-black font-mono text-gray-800">{matchup.balls}</b>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full text-center mt-4 pt-4 border-t border-gray-50">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Strike Rate</span>
                <b className="text-base font-black font-mono text-purple-700">{matchup.strikeRate}</b>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Outs / Dismissals</span>
                <b className="text-base font-black font-mono text-rose-600">{matchup.dismissals}</b>
              </div>
            </div>

            <div className="flex justify-between w-full mt-4 text-[10px] font-mono text-gray-400 px-4">
              <span>Boundary ratio: {matchup.fours} Fours, {matchup.sixes} Sixes</span>
              <span>Dot balls %: {matchup.dots}%</span>
            </div>
          </div>

          {/* Bowler Selector */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-dashed border-gray-200 text-center flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-mono font-bold block mb-2">Select Bowler</span>
            <select
              value={pvpBowler.id}
              onChange={(e) => setPvpBowler(LOCAL_PLAYERS.find(p => p.id === e.target.value) || LOCAL_PLAYERS[1])}
              className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-emerald-600 font-bold"
            >
              {LOCAL_PLAYERS.filter(p => p.role === 'Bowler' || p.role === 'All-Rounder').map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
              ))}
            </select>
            <span className="text-5xl mt-4 shrink-0 block">{pvpBowler.avatar}</span>
            <span className="text-xs font-black mt-2 block">{pvpBowler.name}</span>
            <span className="text-[10px] text-gray-400 uppercase font-mono">{pvpBowler.role}</span>
          </div>

        </div>

        {/* Explainable AI Matchup Report box */}
        <div className="mt-8 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 flex gap-3.5 items-start">
          <span className="h-9 w-9 shrink-0 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs text-sm">AI</span>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              CricEdge AI Duel Forecast ({pvpFormat} matchup)
            </h4>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {matchup.expectedOutcome}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
