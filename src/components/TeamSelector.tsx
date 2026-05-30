/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LOCAL_TEAMS } from '../data';
import { Compass, Sparkles, HelpCircle, Activity } from 'lucide-react';

export default function TeamSelector() {
  const [team1, setTeam1] = useState(LOCAL_TEAMS[0]); // India
  const [team2, setTeam2] = useState(LOCAL_TEAMS[1]); // Australia

  // Custom generated head to head comparison values
  const getComparisonH2H = (t1: string, t2: string) => {
    if (t1 === t2) return { matches: 0, t1Wins: 0, t2Wins: 0, draw: 0, averageScore: 250, lastH2h: 'N/A' };
    
    if ((t1 === 'IND' && t2 === 'AUS') || (t1 === 'AUS' && t2 === 'IND')) {
      return {
        matches: 145,
        t1Wins: t1 === 'IND' ? 57 : 84,
        t2Wins: t1 === 'IND' ? 84 : 57,
        draw: 4,
        averageScore: 282,
        lastH2h: 'India won by 42 runs at Wankhede'
      };
    }

    return {
      matches: 82,
      t1Wins: 41,
      t2Wins: 38,
      draw: 3,
      averageScore: 265,
      lastH2h: 'Draw / Rain affected ODI'
    };
  };

  const h2h = getComparisonH2H(team1.id, team2.id);

  return (
    <div className="space-y-6">
      {/* Team Selection drop downs */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs">
        <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
          Interactive Team Intelligence Comparator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-6">
          {/* Team 1 Select */}
          <div className="md:col-span-3 bg-slate-50/60 p-4 rounded-xl border border-slate-100 text-center flex flex-col items-center">
            <label className="text-xs text-gray-500 font-mono font-bold block mb-2">Team Alpha Selector</label>
            <select
              value={team1.id}
              onChange={(e) => setTeam1(LOCAL_TEAMS.find(t => t.id === e.target.value) || LOCAL_TEAMS[0])}
              className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-emerald-650"
            >
              {LOCAL_TEAMS.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <span className="text-5xl mt-4 block">{team1.logo}</span>
            <span className="text-sm font-black mt-2 block">{team1.name}</span>
          </div>

          {/* Versus stats metrics card */}
          <div className="md:col-span-1 text-center font-mono py-2 bg-gray-50/70 rounded-lg">
            <span className="text-[10px] text-gray-400 block font-semibold tracking-wider">VS</span>
            <b className="text-xs text-rose-600 font-bold block mt-1">COMPARATOR</b>
          </div>

          {/* Team 2 Select */}
          <div className="md:col-span-3 bg-slate-50/60 p-4 rounded-xl border border-slate-100 text-center flex flex-col items-center">
            <label className="text-xs text-gray-500 font-mono font-bold block mb-2">Team Beta Selector</label>
            <select
              value={team2.id}
              onChange={(e) => setTeam2(LOCAL_TEAMS.find(t => t.id === e.target.value) || LOCAL_TEAMS[1])}
              className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-emerald-650"
            >
              {LOCAL_TEAMS.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <span className="text-5xl mt-4 block">{team2.logo}</span>
            <span className="text-sm font-black mt-2 block">{team2.name}</span>
          </div>
        </div>
      </div>

      {/* Main Comparisons grids */}
      {team1.id === team2.id ? (
        <div className="bg-white rounded-xl p-6 border text-center text-xs text-gray-400">
          Please select two different cricket rosters to generate head-to-head comparison telemetry.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Head to Head Summary Profile */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400">Historical Comparison Summary</h4>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Total Mutual Encounters</span>
                <span className="font-bold text-gray-800">{h2h.matches} Matches</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">{team1.name} Victories</span>
                <span className="font-bold text-emerald-600">{h2h.t1Wins}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">{team2.name} Victories</span>
                <span className="font-bold text-emerald-600">{h2h.t2Wins}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">Draws / Rainout Matches</span>
                <span className="font-medium text-gray-650">{h2h.draw} Matches</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Average Innings Scores</span>
                <span className="font-bold text-purple-600">{h2h.averageScore} runs</span>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs">
              <span className="text-[10px] text-indigo-700 block uppercase font-bold tracking-wider font-mono">Last Encounter Outcome</span>
              <p className="font-bold text-slate-800 mt-1">{h2h.lastH2h}</p>
            </div>
          </div>

          {/* Strength Factors Indexes Comparison */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 lg:col-span-2">
            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400">Powerplay, Middle & Death Strength Indices</h4>

            <div className="space-y-4">
              {/* Batting strength comparison */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-gray-600">Powerplay Batting Power</span>
                  <div className="flex gap-4">
                    <span className="text-[#00529B] font-bold">{team1.shortName}: {team1.strength.batting}%</span>
                    <span className="text-[#FCD116] font-bold">{team2.shortName}: {team2.strength.batting}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full border-r border-white" style={{ width: `${team1.strength.batting}%` }}></div>
                  <div className="bg-sky-400 h-full" style={{ width: `${team2.strength.batting}%` }}></div>
                </div>
              </div>

              {/* Bowling strength comparison */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-gray-600">Middle Overs Spin/Pace Economy</span>
                  <div className="flex gap-4">
                    <span className="text-[#00529B] font-bold">{team1.shortName}: {team1.strength.bowling}%</span>
                    <span className="text-[#FCD116] font-bold">{team2.shortName}: {team2.strength.bowling}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full border-r border-white" style={{ width: `${team1.strength.bowling}%` }}></div>
                  <div className="bg-sky-400 h-full" style={{ width: `${team2.strength.bowling}%` }}></div>
                </div>
              </div>

              {/* Death bowling rate comparison */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-gray-600">Death-Overs Guard Accuracy</span>
                  <div className="flex gap-4">
                    <span className="text-[#00529B] font-bold">{team1.shortName}: {team1.strength.fielding}%</span>
                    <span className="text-[#FCD116] font-bold">{team2.shortName}: {team2.strength.fielding}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 h-full border-r border-white" style={{ width: `${team1.strength.fielding}%` }}></div>
                  <div className="bg-sky-400 h-full" style={{ width: `${team2.strength.fielding}%` }}></div>
                </div>
              </div>

              {/* Away Record comparison */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-gray-600">Away Pitch winning trends</span>
                  <div className="flex gap-4">
                    <span className="text-[#00529B] font-bold">{team1.shortName}: {team1.strength.awayRecord}%</span>
                    <span className="text-[#FCD116] font-bold">{team2.shortName}: {team2.strength.awayRecord}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-600 h-full border-r border-white" style={{ width: `${team1.strength.awayRecord}%` }}></div>
                  <div className="bg-sky-400 h-full" style={{ width: `${team2.strength.awayRecord}%` }}></div>
                </div>
              </div>

              {/* Toss Decision Impact */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-gray-600">Toss Impact Reliance on Choice</span>
                  <div className="flex gap-4">
                    <span className="text-[#00529B] font-bold">{team1.shortName}: {team1.strength.tossImpact}%</span>
                    <span className="text-[#FCD116] font-bold">{team2.shortName}: {team2.strength.tossImpact}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-600 h-full border-r border-white" style={{ width: `${team1.strength.tossImpact}%` }}></div>
                  <div className="bg-sky-400 h-full" style={{ width: `${team2.strength.tossImpact}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
