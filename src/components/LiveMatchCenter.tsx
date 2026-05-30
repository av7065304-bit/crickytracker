/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAMPLE_BATSMEN, SAMPLE_BOWLERS, SAMPLE_COMMENTARY, SAMPLE_MATCH } from '../data';
import { Target, Zap, TrendingUp, Compass, MapPin, Activity, HelpCircle, Users } from 'lucide-react';

export default function LiveMatchCenter() {
  const [activeTab, setActiveTab] = useState<'commentary' | 'scorecard' | 'wagon' | 'analytics'>('commentary');
  const [commentaryList, setCommentaryList] = useState(SAMPLE_COMMENTARY);
  const [commentInput, setCommentInput] = useState('');
  const [userComments, setUserComments] = useState<{ username: string; text: string; time: string; reputation: number }[]>([
    { username: 'LordsGravelKing', text: 'Kohli is in unstoppable form today. 124 of 110 at Wankhede feels premium!', time: '1 min ago', reputation: 42 },
    { username: 'AussieSpeeds', text: 'Cummins needs to bring Hazelwood back in. Those offcutters would slow things down on the dry soil.', time: '5 mins ago', reputation: 12 }
  ]);
  const [selectedWheelArea, setSelectedWheelArea] = useState<string | null>(null);
  const [calculatedTargetRuns, setCalculatedTargetRuns] = useState<number>(315);
  const [calcOvers, setCalcOvers] = useState<number>(50);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      username: 'Predictor_Fan_01',
      text: commentInput,
      time: 'Just now',
      reputation: 1
    };
    setUserComments([newComment, ...userComments]);
    setCommentInput('');
  };

  const wagonAreas = [
    { name: 'Cover Drive', count: 18, coords: 'top-[15%] left-[75%]', color: 'bg-emerald-500' },
    { name: 'On Drive', count: 12, coords: 'top-[35%] left-[65%]', color: 'bg-emerald-500' },
    { name: 'Straight Punch', count: 8, coords: 'top-[15%] left-[50%]', color: 'bg-sky-500' },
    { name: 'Fine Leg Glance', count: 24, coords: 'top-[80%] left-[25%]', color: 'bg-orange-500' },
    { name: 'Square Cut', count: 14, coords: 'top-[50%] left-[85%]', color: 'bg-indigo-500' },
    { name: 'Mid Wicket Pull', count: 20, coords: 'top-[65%] left-[35%]', color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Live Match Summary Header Card */}
      <div id="live-score-summary" className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-500"></div>
        
        <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-4.5 py-1.5 rounded-br-3xl flex items-center gap-1.5 tracking-wider uppercase animate-pulse shadow-xs">
          <span className="h-2 w-2 rounded-full bg-white"></span>
          LIVE SCORECARD
        </div>

        <div className="text-right text-xs font-mono text-slate-400 mb-4 pt-1.5">
          {SAMPLE_MATCH.tournament} • {SAMPLE_MATCH.venue}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          {/* Team A */}
          <div className="flex items-center gap-4">
            <span className="text-4xl bg-slate-50 p-2.5 rounded-2xl border border-slate-150/50">{SAMPLE_MATCH.teamA.logo}</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {SAMPLE_MATCH.teamA.name}
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-100 font-mono tracking-wider uppercase">Batting</span>
              </h3>
              <p className="text-3xl font-black text-slate-900 mt-1 font-mono">
                {SAMPLE_MATCH.teamA.score}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">Overs: {SAMPLE_MATCH.teamA.overs} / 50</p>
            </div>
          </div>

          {/* Versus Mid section */}
          <div className="flex flex-col items-center justify-center text-center border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0 px-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3.5 py-1 rounded-full">VS</span>
            <p className="text-xs font-semibold text-rose-500 mt-3 flex items-center gap-1.5 animate-pulse">
              <Activity className="h-3 w-3" />
              {SAMPLE_MATCH.statusText}
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-sky-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${SAMPLE_MATCH.probability.teamA}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono font-bold text-slate-500 mt-1.5">
              <span>{SAMPLE_MATCH.teamA.shortName}: {SAMPLE_MATCH.probability.teamA}%</span>
              <span>Win Probability</span>
              <span>{SAMPLE_MATCH.teamB.shortName}: {SAMPLE_MATCH.probability.teamB}%</span>
            </div>
          </div>

          {/* Team B */}
          <div className="flex items-center justify-end gap-3 md:text-right">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center justify-end gap-2">
                {SAMPLE_MATCH.teamB.name}
              </h3>
              <p className="text-3xl font-black text-slate-900 mt-1 font-mono">
                {SAMPLE_MATCH.teamB.score}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">Overs: {SAMPLE_MATCH.teamB.overs} (Completed)</p>
            </div>
            <span className="text-4xl bg-slate-50 p-2.5 rounded-2xl border border-slate-150/50">{SAMPLE_MATCH.teamB.logo}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-55/60 bg-slate-50 rounded-[1.25rem] border border-slate-100 p-4 text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Current Run Rate</p>
            <p className="text-lg font-bold text-slate-800 mt-1 font-mono">{SAMPLE_MATCH.currentRunRate}</p>
          </div>
          <div className="bg-slate-55/60 bg-slate-50 rounded-[1.25rem] border border-slate-100 p-4 text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Req. Run Rate</p>
            <p className="text-lg font-bold text-rose-500 mt-1 font-mono">{SAMPLE_MATCH.requiredRunRate}</p>
          </div>
          <div className="bg-slate-55/60 bg-slate-50 rounded-[1.25rem] border border-slate-100 p-4 text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Proj. Final Score</p>
            <p className="text-lg font-bold text-emerald-600 mt-1 font-mono">{SAMPLE_MATCH.projectedScore}</p>
          </div>
          <div className="bg-slate-55/60 bg-slate-50 rounded-[1.25rem] border border-slate-100 p-4 text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Pitch Bounce Index</p>
            <p className="text-lg font-bold text-purple-600 mt-1 font-mono">{SAMPLE_MATCH.pitch.paceScore}/100</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('commentary')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'commentary' ? 'border-emerald-500 text-slate-900 bg-emerald-50/10' : 'border-transparent text-slate-450 text-slate-500 hover:text-slate-900'}`}
        >
          <Activity className="h-4 w-4" /> Live Ball-By-Ball
        </button>
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'scorecard' ? 'border-emerald-500 text-slate-900 bg-emerald-50/10' : 'border-transparent text-slate-450 text-slate-500 hover:text-slate-900'}`}
        >
          <TrendingUp className="h-4 w-4" /> Live Box Scorecard
        </button>
        <button
          onClick={() => setActiveTab('wagon')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'wagon' ? 'border-emerald-500 text-slate-900 bg-emerald-50/10' : 'border-transparent text-slate-450 text-slate-500 hover:text-slate-900'}`}
        >
          <Target className="h-4 w-4" /> Hit Wagon & Shot Pitch Map
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'analytics' ? 'border-emerald-500 text-slate-900 bg-emerald-50/10' : 'border-transparent text-slate-450 text-slate-500 hover:text-slate-900'}`}
        >
          <Compass className="h-4 w-4" /> Target Calculators & Chat Opinions
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'commentary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Over Summary List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 creative-card">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
                Event stream (Indian Innings - Chasing)
              </h4>

              <div className="space-y-4">
                {commentaryList.map((ball, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0 relative">
                    <span className={`w-14 text-center text-xs font-mono font-bold py-1.5 px-2 rounded-lg shrink-0 ${ball.event === 'boundary' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : ball.event === 'wicket' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-gray-100 text-gray-700'}`}>
                      {ball.overNum}.{ball.ballNum}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {ball.title}
                        {ball.event === 'boundary' && <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black">4 Runs</span>}
                        {ball.event === 'wicket' && <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black">OUT</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {ball.description}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400 mt-1">
                        Striker: {ball.batsman} | Bowler: {ball.bowler}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats sidebar widget */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-600" /> Active Partnerships
              </h4>
              <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Virat Kohli (124*)</span>
                  <span className="font-mono font-bold text-gray-900">Partner Runs: 154</span>
                  <span>KL Rahul (68*)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-600 h-full border-r border-white" style={{ width: '60%' }}></div>
                  <div className="bg-sky-500 h-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-[11px] text-gray-400 text-center font-mono">Balls faced: 132 | Current partnership run rate: 7.00 rpo</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-indigo-700 rounded-xl p-5 text-white relative overflow-hidden">
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <Target className="h-40 w-40" />
              </div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-emerald-100">CricEdge Live Momentum</h4>
              <p className="text-2xl font-black mt-2 font-mono">IND +84 Index</p>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                Indian batting powerplay dominance and Kohli's immaculate wagon sweep ratio keeps the hosts ahead of the projected baseline.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs font-mono">
                <span>Momentum Peak: Over 35</span>
                <span>Chances to Win: 74%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scorecard' && (
        <div className="space-y-6">
          {/* Batting Card */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
            <div className="bg-slate-50/50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span>🇮🇳</span> India Innings Scorecard
              </h3>
              <span className="text-sm font-mono font-bold text-gray-800">298/4 (42.2 Overs)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-md">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] text-gray-400 uppercase font-mono bg-slate-50/30">
                    <th className="px-5 py-3 font-semibold">Batsman</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Runs</th>
                    <th className="px-4 py-3 font-semibold text-right">Balls</th>
                    <th className="px-4 py-3 font-semibold text-right">4s</th>
                    <th className="px-4 py-3 font-semibold text-right">6s</th>
                    <th className="px-4 py-3 font-semibold text-right">S/R</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {SAMPLE_BATSMEN.map((bat, i) => (
                    <tr key={i} className={bat.status === 'batting' || bat.status === 'not out' ? 'bg-emerald-50/20 font-medium' : ''}>
                      <td className="px-5 py-3 font-bold text-gray-800 flex items-center gap-1.5">
                        {bat.name}
                        {(bat.status === 'batting' || bat.status === 'not out') && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{bat.status}</td>
                      <td className="px-4 py-3 text-right font-black font-mono text-gray-900">{bat.runs}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-500">{bat.balls}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-500">{bat.fours}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-500">{bat.sixes}</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-700 font-bold">{bat.strikeRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bowling Card */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs">
            <div className="bg-slate-50/50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span>🇦🇺</span> Australian Bowling Department
              </h3>
              <b className="text-xs text-gray-400 font-mono">Target: 315 Runs</b>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-md">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] text-gray-400 uppercase font-mono bg-slate-50/30">
                    <th className="px-5 py-3 font-semibold">Bowler</th>
                    <th className="px-4 py-3 font-semibold text-right">Overs</th>
                    <th className="px-4 py-3 font-semibold text-right">Maidens</th>
                    <th className="px-4 py-3 font-semibold text-right">Runs</th>
                    <th className="px-4 py-3 font-semibold text-right">Wickets</th>
                    <th className="px-4 py-3 font-semibold text-right">Econ</th>
                    <th className="px-4 py-3 font-semibold text-right">Dots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {SAMPLE_BOWLERS.map((bowl, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3 font-bold text-gray-800">{bowl.name}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">{bowl.overs}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-500">{bowl.maidens}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">{bowl.runs}</td>
                      <td className="px-4 py-3 text-right font-mono font-black text-rose-600">{bowl.wickets}</td>
                      <td className="px-4 py-3 text-right font-mono text-indigo-700 font-bold">{bowl.economy}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-400">{bowl.dots}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wagon' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wagon Wheel Panel */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center">
            <div className="w-full justify-between flex items-center mb-4">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Interactive Wagon Wheel</h4>
                <p className="text-xs text-gray-400 font-mono">Virat Kohli 124* (110) Area Density</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono px-2 py-1 rounded border border-emerald-100">Click Zones</span>
            </div>

            {/* Simulated Wagon Wheel Field Visual */}
            <div className="relative w-80 h-80 rounded-full border-4 border-emerald-700 bg-emerald-850/80 p-8 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Outer circle layout */}
              <div className="absolute inset-4 rounded-full border border-dashed border-white/20"></div>
              <div className="absolute inset-16 rounded-full border border-white/5"></div>

              {/* Pitch at the center */}
              <div className="w-10 h-28 bg-amber-100/90 border border-amber-350/50 rounded-xs flex items-center justify-center relative">
                <span className="block w-full h-0.5 bg-black/10 absolute top-4"></span>
                <span className="block w-full h-0.5 bg-black/10 absolute bottom-4"></span>
                <div className="text-[8px] font-mono text-amber-900/50 font-black rotate-90 scale-75">PITCH</div>
              </div>

              {/* Scatter Areas */}
              {wagonAreas.map((area, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWheelArea(area.name)}
                  className={`absolute ${area.coords} flex flex-col items-center justify-center transition-all duration-300 hover:scale-115`}
                >
                  <span className={`h-4 w-4 rounded-full ${area.color} flex items-center justify-center text-[8px] font-black font-mono text-white ring-2 ring-white cursor-pointer`}>
                    {area.count}
                  </span>
                  <span className="bg-black/80 text-[8px] text-white px-1.5 py-0.5 rounded mt-1 font-mono tracking-tighter whitespace-nowrap">
                    {area.name}
                  </span>
                </button>
              ))}
            </div>

            {selectedWheelArea ? (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg w-full text-center text-xs">
                <b>{selectedWheelArea} Statistics:</b> Represents <b className="text-emerald-700 font-mono">
                  {selectedWheelArea === 'Fine Leg Glance' ? '24%' : selectedWheelArea === 'Cover Drive' ? '18%' : '14%'}
                </b> of total strike boundaries today. Effective power stroke ratio.
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-4 text-center">Touch any zone on the stadium visual map to inspect boundary distribution metrics.</p>
            )}
          </div>

          {/* Bowler Pitch Map */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h4 className="font-bold text-gray-800 text-sm mb-2">Bowl Pitch Target Map</h4>
            <p className="text-xs text-gray-400 font-mono mb-4">Ball landing metrics against right-handed strikers (L.O.B)</p>

            <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center">
              {/* Pitch Grid Visualizer */}
              <div className="w-48 h-64 bg-yellow-50 border-x-2 border-dashed border-gray-350 rounded-lg relative overflow-hidden flex flex-col divide-y divide-gray-200">
                <div className="h-20 bg-rose-50/30 flex items-center justify-center relative">
                  <span className="absolute left-2 text-[9px] font-mono text-rose-500 font-bold">Short Deck</span>
                  <div className="h-3 w-3 rounded-full bg-rose-600 absolute top-6 right-16"></div>
                  <div className="h-3 w-3 rounded-full bg-rose-600 absolute top-12 right-20"></div>
                </div>
                <div className="h-24 bg-teal-50/30 flex items-center justify-center relative">
                  <span className="absolute left-2 text-[9px] font-mono text-teal-600 font-bold">Good Length</span>
                  <div className="h-3 w-3 rounded-full bg-emerald-500 absolute top-8 right-12 animate-bounce"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500 absolute top-4 right-28"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500 absolute top-12 right-20"></div>
                </div>
                <div className="h-20 bg-indigo-50/30 flex items-center justify-center relative">
                  <span className="absolute left-2 text-[9px] font-mono text-indigo-600 font-bold">Full/Yorker</span>
                  <div className="h-3 w-3 rounded-full bg-indigo-500 absolute top-8 right-24"></div>
                  <div className="h-3 w-3 rounded-full bg-indigo-550 absolute top-12 right-16"></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center">
                <div className="p-2 border border-rose-100 bg-rose-50/40 rounded">
                  <span className="text-[10px] text-rose-700 block">Short Bounds</span>
                  <b className="text-xs font-mono">18% Ratio</b>
                </div>
                <div className="p-2 border border-teal-100 bg-teal-50/40 rounded">
                  <span className="text-[10px] text-teal-700 block">Good Length</span>
                  <b className="text-xs font-mono">62% Hits</b>
                </div>
                <div className="p-2 border border-indigo-100 bg-indigo-50/40 rounded">
                  <span className="text-[10px] text-indigo-700 block">Yorkers</span>
                  <b className="text-xs font-mono">20% Targets</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Calculator */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Required Net run-rate Calculator</h4>
              <p className="text-xs text-gray-400 font-mono">Enter constraints to project chasing intensity</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Target Score To Set</label>
                <input
                  type="number"
                  value={calculatedTargetRuns}
                  onChange={(e) => setCalculatedTargetRuns(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-xs font-mono focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Overs Allowed</label>
                <input
                  type="number"
                  value={calcOvers}
                  onChange={(e) => setCalcOvers(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-xs font-mono focus:outline-emerald-600"
                />
              </div>

              <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                <span className="text-[10px] block text-emerald-800 font-bold uppercase tracking-wide">REQUIRED TARGET RUN RATE</span>
                <b className="text-xl font-mono text-emerald-900 mt-1 block">{(calculatedTargetRuns / calcOvers).toFixed(2)} R.P.O</b>
              </div>
            </div>
          </div>

          {/* Social Feedback and predictions share */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-indigo-600" /> Match Live Corner Debate
                </h4>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold font-mono">Active Community</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Post insights, discuss bowling rotations and team choices directly with match fans.</p>

              <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                {userComments.map((com, index) => (
                  <div key={index} className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 flex gap-2 justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 font-mono">{com.username}</span>
                        <span className="text-[10px] text-gray-450">{com.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{com.text}</p>
                    </div>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono shrink-0">
                      Cred: +{com.reputation}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-gray-50 mt-4">
              <input
                type="text"
                placeholder="Share your commentary opinion or tactical forecast..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-gray-50 rounded border border-gray-100 px-3 py-1.5 text-xs focus:outline-emerald-600"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded text-xs transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
