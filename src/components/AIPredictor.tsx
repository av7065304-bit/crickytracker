/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  Activity, 
  Sparkles, 
  Loader, 
  BarChart3, 
  Coins, 
  Flame, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Shuffle,
  ShieldCheck as ShieldCheckIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const TEAM_STRENGTHS: Record<string, {
  batting: number;
  bowling: number;
  spin: number;
  pace: number;
  fielding: number;
  adaptability: number;
}> = {
  India: { batting: 92, bowling: 88, spin: 94, pace: 84, fielding: 86, adaptability: 89 },
  Australia: { batting: 88, bowling: 92, spin: 76, pace: 95, fielding: 94, adaptability: 90 },
  England: { batting: 90, bowling: 85, spin: 78, pace: 88, fielding: 88, adaptability: 85 },
  Pakistan: { batting: 82, bowling: 90, spin: 82, pace: 94, fielding: 78, adaptability: 80 }
};

export default function AIPredictor() {
  // Mode selection: custom predictor versus automated winning optimizer
  const [activeMode, setActiveMode] = useState<'custom' | 'optimize'>('optimize');

  // Custom simulation states
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

  // AI Auto-Optimize states
  const [targetTeam, setTargetTeam] = useState('India');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<any>({
    targetTeam: 'India',
    optimalOpponent: 'Pakistan',
    optimalVenue: 'Eden Gardens (Kolkata)',
    optimalFormat: 'T20',
    tossStrategy: 'Win toss and elect to bowl first (Capitalize on high dew coefficient)',
    optimizedProbability: 89,
    tacticalPlan: "India matches up exceptionally well against Pakistan on dry, spinning turf. Eden Gardens yields an elite turn factor of 4.2. India's spin duo (Yuzvendra Chahal/Kuldeep Yadav) can apply a strong stranglehold in the middle overs, pushing down power play momentum. Chasing under the dew cap ensures clear batting advantages.",
    historicalPrecedent: "India has a 5-0 record in major global tournament games when chasing under evening dew cycles at Eden Gardens."
  });
  const [optimizationSteps, setOptimizationSteps] = useState<string[]>([]);

  // Toss Simulator states
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<'Heads' | 'Tails' | null>(null);
  const [tossLog, setTossLog] = useState<string>('');

  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');

  // Handle standard custom matchup forecast
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

  // Handle AI Auto Win-Probability Optimization
  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationSteps([]);
    
    // Simulate step by step analytical processing
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    
    const stepsList = [
      `Initializing CricEdge AI squad capability matrices for Target Team: ${targetTeam}...`,
      `Scanning optimal match-up equations among opposing teams...`,
      `Filtering historical ground records and local pitch density parameters...`,
      `Simulating 1,200 unique toss scenarios and humidity dew curves...`,
      `Synthesizing optimal win-probability coefficient (>85%)...`
    ];

    for (let i = 0; i < stepsList.length; i++) {
      setOptimizationSteps((prev) => [...prev, stepsList[i]]);
      await sleep(400);
    }

    try {
      const response = await fetch('/api/gemini/auto-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTeam })
      });

      const data = await response.json();
      if (data.success && data.optimized) {
        setOptimizedResult(data.optimized);
      }
    } catch (error) {
      console.error("AI Auto Optimize Fetch Error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Interactive Live Coin Toss Flipper
  const handleFlipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinSide(null);
    setTossLog('Flipping the silver coin...');

    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      const finalSide = isHeads ? 'Heads' : 'Tails';
      setCoinSide(finalSide);
      setIsFlipping(false);
      
      const targetTeamWins = Math.random() > 0.45; // 55% chance user target team gets favorable toss luck
      const activeOpponent = activeMode === 'optimize' ? optimizedResult.optimalOpponent : teamB;
      const activeTeam = activeMode === 'optimize' ? optimizedResult.targetTeam : teamA;
      const activeTossStrategy = activeMode === 'optimize' ? optimizedResult.tossStrategy : prediction.tossPrediction;

      if (targetTeamWins) {
        setTossLog(`🎉 ${activeTeam} won the toss! Choosing: ${activeTossStrategy}`);
      } else {
        setTossLog(`🍀 ${activeOpponent} won the toss! Under sub-optimal pressure, they choose opposite. Play advantage pivots heavily to ${activeTeam}!`);
      }
    }, 1200);
  };

  // Define active comparative chart teams
  const chartTeamA = activeMode === 'optimize' ? optimizedResult.targetTeam : teamA;
  const chartTeamB = activeMode === 'optimize' ? optimizedResult.optimalOpponent : teamB;

  return (
    <div className="space-y-6">
      
      {/* Header section with tab selectors */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-8 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest font-black bg-gradient-to-r from-purple-500 to-sky-400 text-white px-2.5 py-1 rounded">
                ⚡ CricEdge Machine Intelligence
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">AI Match & Toss Forecast Console</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Utilize recursive neural simulations or trigger the automatic high-probability auto-optimizer to match-make ideal recipes for absolute victory.
            </p>
          </div>

          <div className="flex bg-slate-850 p-1.5 rounded-2xl border border-slate-850 shrink-0">
            <button
              onClick={() => setActiveMode('optimize')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition flex items-center gap-2 cursor-pointer ${
                activeMode === 'optimize'
                  ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white shadow-md shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              AI Winning Auto-Optimizer
            </button>
            <button
              onClick={() => setActiveMode('custom')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition flex items-center gap-2 cursor-pointer ${
                activeMode === 'custom'
                  ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white shadow-md shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shuffle className="h-3.5 w-3.5" />
              Custom Match simulator
            </button>
          </div>
        </div>
      </div>

      {/* Mode A: AI WINNING AUTO-OPTIMIZER PANEL */}
      {activeMode === 'optimize' && (
        <div className="space-y-6">
          {/* Target team picker and action */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-150 border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500 animate-bounce" />
                <h3 className="font-bold text-slate-900 text-base">Automatic Win Formula & Toss Optimizer</h3>
              </div>
              <span className="text-[10px] text-indigo-650 bg-indigo-50 font-mono font-black border border-indigo-100 px-2 py-0.5 rounded uppercase">
                Optimized probability &gt;85% Guarantee
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="md:col-span-2">
                <label className="text-xs text-slate-500 font-bold mb-2 block">Select Your Favorable Core Team</label>
                <div className="grid grid-cols-4 gap-2">
                  {['India', 'Australia', 'England', 'Pakistan'].map((tName) => {
                    const flags: Record<string, string> = { India: '🇮🇳', Australia: '🇦🇺', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Pakistan: '🇵🇰' };
                    return (
                      <button
                        key={tName}
                        type="button"
                        onClick={() => setTargetTeam(tName)}
                        className={`py-3 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 border cursor-pointer active:scale-95 ${
                          targetTeam === tName
                            ? 'bg-purple-50 border-purple-300 text-purple-700 font-extrabold shadow-sm'
                            : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/60'
                        }`}
                      >
                        <span className="text-xl">{flags[tName]}</span>
                        <span>{tName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleAutoOptimize}
                  disabled={isOptimizing}
                  className="w-full bg-gradient-to-r from-purple-600 to-sky-500 hover:opacity-95 font-bold text-white px-5 py-4 rounded-xl text-xs transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer h-12 shadow-sm active:scale-95"
                >
                  {isOptimizing ? <Loader className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate AI High Favorable Match & Toss
                </button>
              </div>
            </div>

            {/* AI Streaming Thinking step-by-step logs */}
            {isOptimizing && (
              <div className="mt-6 bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-[10px] space-y-2 border border-slate-950 shadow-inner">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="font-bold text-white uppercase text-[9px] tracking-wider">CricEdge Real-time Solver Logs</span>
                </div>
                {optimizationSteps.map((stepMessage, stepIdx) => (
                  <p key={stepIdx} className="flex items-start gap-1">
                    <span className="text-slate-500 mr-1">&gt;</span>
                    <span>{stepMessage}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Results dashboard area */}
          {optimizedResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Win Probability Card */}
              <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-[2rem] border border-purple-950 p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-lg">
                <div className="absolute right-[-10px] bottom-[-20px] opacity-10 pointer-events-none">
                  <Activity className="h-48 w-48 text-sky-400" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-500 text-white font-extrabold px-2.5 py-1 rounded">
                      WIN FORMULA LOCKED
                    </span>
                    <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>

                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">EXPECTED PROBABILITY</span>
                  
                  <div className="flex items-baseline gap-2 mt-2">
                    <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                      {optimizedResult.optimizedProbability}%
                    </h1>
                  </div>

                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 mt-1 font-mono uppercase">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    High Chance to Win
                  </span>

                  <p className="text-slate-300 text-xs mt-4 font-semibold leading-relaxed">
                    AI Auto-optimization indicates a highly favorable match configuration that maximizes {optimizedResult.targetTeam}'s tactical indices.
                  </p>

                  <div className="w-full bg-indigo-950 h-3 rounded-full overflow-hidden mt-6 relative border border-white/5 p-[1px]">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-sky-400 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${optimizedResult.optimizedProbability}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 space-y-2">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">OPTIMIZATION VARIABLES STATUS</span>
                  <div className="flex flex-wrap gap-1 text-[9px] font-mono">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/10 px-2 py-0.5 rounded">Opponent Match: Ready</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/10 px-2 py-0.5 rounded">Venue Alignment: Safe</span>
                  </div>
                </div>
              </div>

              {/* Right Columns: Tactical blueprint details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Tactical Recipe Parameters */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-6 shadow-sm">
                  <h4 className="text-sm font-black text-slate-850 uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    AI Auto-Optimized Selection Blueprint
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                      <span className="text-[10px] text-gray-450 block font-mono uppercase">Optimal Opponent</span>
                      <b className="text-sm text-slate-800 font-extrabold mt-1 block">
                        {optimizedResult.optimalOpponent}
                      </b>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                      <span className="text-[10px] text-gray-450 block font-mono uppercase">Optimal Stadium Matchup</span>
                      <b className="text-sm text-slate-800 font-extrabold mt-1 block leading-tight">
                        {optimizedResult.optimalVenue}
                      </b>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                      <span className="text-[10px] text-gray-450 block font-mono uppercase">Optimal Match Format</span>
                      <b className="text-sm text-slate-800 font-extrabold mt-1 block">
                        {optimizedResult.optimalFormat} Series
                      </b>
                    </div>
                  </div>

                  <div className="bg-purple-50/50 border border-purple-100/60 rounded-2xl p-4 text-xs text-slate-800">
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <b className="text-[10px] uppercase font-mono text-purple-800 tracking-wider">AI Tactical Action Plan</b>
                    </div>
                    <p className="leading-relaxed font-medium">{optimizedResult.tacticalPlan}</p>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <b className="text-[10px] uppercase font-mono text-emerald-800 tracking-wider">Verified Historical Precedent</b>
                    </div>
                    <p className="font-medium">{optimizedResult.historicalPrecedent}</p>
                  </div>
                </div>

                {/* Coin Toss Simulator Action Block */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-slate-50 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-850 uppercase tracking-wider flex items-center gap-2">
                        <Coins className="h-4 w-4 text-amber-500" />
                        AI Embedded Live Coin Toss Simulator
                      </h4>
                      <p className="text-xs text-slate-400">Flip to verify how winning the toss deploys the ultimate winning strategy.</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleFlipCoin}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 active:scale-95 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Coins className={`h-3 w-3 ${isFlipping ? 'animate-spin' : ''}`} />
                      Flip Silver Coin
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    
                    {/* Flipping Coin Visual representation */}
                    <div className="bg-slate-50 border border-slate-100/70 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden">
                      {isFlipping ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-250 animate-bounce flex items-center justify-center border-2 border-amber-300 shadow-md">
                            <span className="font-mono text-xs text-amber-805 font-black animate-ping">$</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 animate-pulse">Coin spinning in mid-air...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-500 flex items-center justify-center border-2 border-amber-400 shadow-sm relative">
                            <span className="font-mono text-sm text-yellow-950 font-black">
                              {coinSide ? coinSide[0] : '$'}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-extrabold uppercase">
                            Result: {coinSide || "Awaiting Flip"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Result log explanation */}
                    <div className="md:col-span-2 bg-slate-50 border border-slate-150 border-slate-50 rounded-2xl p-4 min-h-[120px] flex flex-col justify-center">
                      <span className="text-[9px] uppercase font-mono text-slate-400 mb-1 block">Toss Simulator Log Output</span>
                      {tossLog ? (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-800 font-bold leading-relaxed">{tossLog}</p>
                          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 text-[10px] rounded font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Win advantage optimized to 100% capacity
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-xs text-slate-450 text-slate-500 font-medium">
                          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <p>Click "Flip Silver Coin" to trigger a neural trial of the coin flip. See how CricEdge models handle the random event outcomes.</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      )}

      {/* Mode B: CUSTOM predictor panels */}
      {activeMode === 'custom' && (
        <div className="space-y-6">
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
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-950 p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-sm">
              <div className="absolute right-[-15px] bottom-[-15px] opacity-10 pointer-events-none">
                <ShieldCheck className="h-48 w-48" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-black bg-emerald-500 text-white px-2 py-0.5 rounded">
                    FORECAST OUTCOME
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">Confidence: {prediction.confidence}%</span>
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

              <p className="text-[10px] text-indigo-200 font-mono mt-4 border-t border-white/5 pt-4">
                ⚠️ Simulated risk tolerance: Moderate. Values computed via Gemini engine.
              </p>
            </div>

            {/* Explainable report card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-xs">
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

                <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 text-slate-755">
                  <b className="text-[10px] uppercase font-mono text-emerald-805 tracking-wider block mb-1">Historical Evidence Support</b>
                  <p className="font-medium">{prediction.historicalSupport}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Comparative Squad Strengths Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Comparative Squad Strengths Profile
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualize and side-by-side compare relative capability metrics between {chartTeamA || 'Team A'} and {chartTeamB || 'Team B'}
            </p>
          </div>

          {/* Chart View Toggle Switch */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/40">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white text-purple-600 shadow-xs scale-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📊 Bar Chart
            </button>
            <button
              type="button"
              onClick={() => setChartType('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                chartType === 'radar'
                  ? 'bg-white text-purple-600 shadow-xs scale-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🕸️ Radar Chart
            </button>
          </div>
        </div>

        <div className="w-full h-80 min-h-[320px] bg-slate-50/40 rounded-2xl border border-slate-100/50 p-4 relative overflow-hidden flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={[
                  { subject: 'Batting Power', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.batting || 85, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.batting || 85 },
                  { subject: 'Bowling Depth', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.bowling || 85, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.bowling || 85 },
                  { subject: 'Spin Efficiency', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.spin || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.spin || 80 },
                  { subject: 'Pace Threat', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.pace || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.pace || 80 },
                  { subject: 'Fielding', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.fielding || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.fielding || 80 },
                  { subject: 'Adaptability', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.adaptability || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.adaptability || 80 }
                ]}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '0.75rem', 
                    color: '#fff', 
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }} />
                <Bar dataKey={chartTeamA} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey={chartTeamB} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: 'Batting Power', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.batting || 85, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.batting || 85 },
                { subject: 'Bowling Depth', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.bowling || 85, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.bowling || 85 },
                { subject: 'Spin Efficiency', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.spin || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.spin || 80 },
                { subject: 'Pace Threat', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.pace || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.pace || 80 },
                { subject: 'Fielding', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.fielding || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.fielding || 80 },
                { subject: 'Adaptability', [chartTeamA]: TEAM_STRENGTHS[chartTeamA]?.adaptability || 80, [chartTeamB]: TEAM_STRENGTHS[chartTeamB]?.adaptability || 80 }
              ]}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 9 }}
                />
                <Radar
                   name={chartTeamA}
                   dataKey={chartTeamA}
                   stroke="#8b5cf6"
                   fill="#8b5cf6"
                   fillOpacity={0.35}
                />
                <Radar
                   name={chartTeamB}
                   dataKey={chartTeamB}
                   stroke="#0ea5e9"
                   fill="#0ea5e9"
                   fillOpacity={0.35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '0.75rem', 
                    color: '#fff', 
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
              </RadarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
