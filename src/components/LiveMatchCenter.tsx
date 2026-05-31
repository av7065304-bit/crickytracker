/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SAMPLE_BATSMEN, SAMPLE_BOWLERS, SAMPLE_COMMENTARY, SAMPLE_MATCH } from '../data';
import { LiveMatch, BatsmanScore, BowlerScore, CommentaryBall } from '../types';
import { Target, Zap, TrendingUp, Compass, MapPin, Activity, HelpCircle, Users, RefreshCw, Play, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Roster of reserve batsmen when wickets fall
const INCOMING_BATSMEN = [
  'Hardik Pandya',
  'Ravindra Jadeja',
  'Axar Patel',
  'Shardul Thakur',
  'Jasprit Bumrah',
  'Mohammed Siraj'
];

interface LiveMatchCenterProps {
  theme?: 'dark' | 'light';
}

export default function LiveMatchCenter({ theme = 'dark' }: LiveMatchCenterProps) {
  const [activeTab, setActiveTab] = useState<'commentary' | 'scorecard' | 'wagon' | 'analytics'>('commentary');
  const [commentInput, setCommentInput] = useState('');
  const [userComments, setUserComments] = useState<{ username: string; text: string; time: string; reputation: number }[]>([
    { username: 'LordsGravelKing', text: 'Kohli is in unstoppable form today. 124 of 110 at Wankhede feels premium!', time: '1 min ago', reputation: 42 },
    { username: 'AussieSpeeds', text: 'Cummins needs to bring Hazelwood back in. Those offcutters would slow things down on the dry soil.', time: '5 mins ago', reputation: 12 }
  ]);
  const [selectedWheelArea, setSelectedWheelArea] = useState<string | null>(null);
  const [calculatedTargetRuns, setCalculatedTargetRuns] = useState<number>(315);
  const [calcOvers, setCalcOvers] = useState<number>(50);

  // Live Score states with localStorage persistence to keep simulation data alive
  const [match, setMatch] = useState<LiveMatch>(() => {
    const saved = localStorage.getItem('cricedge_sim_match');
    return saved ? JSON.parse(saved) : SAMPLE_MATCH;
  });

  const [batsmenList, setBatsmenList] = useState<BatsmanScore[]>(() => {
    const saved = localStorage.getItem('cricedge_sim_batsmen');
    return saved ? JSON.parse(saved) : SAMPLE_BATSMEN;
  });

  const [bowlersList, setBowlersList] = useState<BowlerScore[]>(() => {
    const saved = localStorage.getItem('cricedge_sim_bowlers');
    return saved ? JSON.parse(saved) : SAMPLE_BOWLERS;
  });

  const [commentaryList, setCommentaryList] = useState<CommentaryBall[]>(() => {
    const saved = localStorage.getItem('cricedge_sim_commentary');
    return saved ? JSON.parse(saved) : SAMPLE_COMMENTARY;
  });

  const [partnership, setPartnership] = useState(() => {
    const saved = localStorage.getItem('cricedge_sim_partnership');
    return saved ? JSON.parse(saved) : {
      batsman1: 'Virat Kohli',
      runs1: 124,
      balls1: 110,
      batsman2: 'KL Rahul',
      runs2: 68,
      balls2: 72,
      totalRuns: 192,
      ballsFaced: 182,
      striker: 'Virat Kohli'
    };
  });

  const [upcomingBatsmanIdx, setUpcomingBatsmanIdx] = useState(() => {
    const saved = localStorage.getItem('cricedge_sim_upcoming_idx');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track live simulation loop state and flash visual outcomes
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);
  const [flashOutcome, setFlashOutcome] = useState<'SIX' | 'FOUR' | 'WICKET' | 'RUNS' | 'DOT' | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('cricedge_sim_match', JSON.stringify(match));
    localStorage.setItem('cricedge_sim_batsmen', JSON.stringify(batsmenList));
    localStorage.setItem('cricedge_sim_bowlers', JSON.stringify(bowlersList));
    localStorage.setItem('cricedge_sim_commentary', JSON.stringify(commentaryList));
    localStorage.setItem('cricedge_sim_partnership', JSON.stringify(partnership));
    localStorage.setItem('cricedge_sim_upcoming_idx', upcomingBatsmanIdx.toString());
  }, [match, batsmenList, bowlersList, commentaryList, partnership, upcomingBatsmanIdx]);

  // Autoplay simulation timer loop
  useEffect(() => {
    let timer: any;
    if (isLiveSimulating) {
      timer = setInterval(() => {
        handleSimulateBall();
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isLiveSimulating, match, batsmenList, bowlersList, commentaryList, partnership, upcomingBatsmanIdx]);

  // Ball simulation engine logic (mathematically precise back-calculation)
  const handleSimulateBall = () => {
    const oversParts = match.teamA.overs.split('.');
    const completedOvers = parseInt(oversParts[0], 10);
    const completedBallsInOver = oversParts[1] ? parseInt(oversParts[1], 10) : 0;
    const totalBalls = completedOvers * 6 + completedBallsInOver;

    if (totalBalls >= 300) {
      setIsLiveSimulating(false);
      alert("Match completed! Reset the score simulation using the 'Reset Score' button.");
      return;
    }

    const nextTotalBalls = totalBalls + 1;
    const nextOversText = `${Math.floor(nextTotalBalls / 6)}.${nextTotalBalls % 6}`;

    // Calculate random ball outcome
    const rand = Math.random();
    let runs = 0;
    let isWicket = false;
    let eventType: 'run' | 'boundary' | 'wicket' | 'dot' = 'dot';
    let label: 'SIX' | 'FOUR' | 'WICKET' | 'RUNS' | 'DOT' = 'DOT';

    if (rand < 0.42) {
      runs = 0;
      eventType = 'dot';
      label = 'DOT';
    } else if (rand < 0.72) {
      runs = 1;
      eventType = 'run';
      label = 'RUNS';
    } else if (rand < 0.84) {
      runs = 2;
      eventType = 'run';
      label = 'RUNS';
    } else if (rand < 0.93) {
      runs = 4;
      eventType = 'boundary';
      label = 'FOUR';
    } else if (rand < 0.97) {
      runs = 6;
      eventType = 'boundary';
      label = 'SIX';
    } else {
      runs = 0;
      isWicket = true;
      eventType = 'wicket';
      label = 'WICKET';
    }

    setFlashOutcome(label);
    setTimeout(() => setFlashOutcome(null), 2500);

    const strikerName = partnership.striker;
    const nonStrikerName = partnership.striker === partnership.batsman1 ? partnership.batsman2 : partnership.batsman1;

    // Cycle through active bowlers based on current overs bowled
    const activeBowlers = bowlersList.map(b => b.name);
    const activeBowlerIndex = Math.floor(completedOvers % activeBowlers.length);
    const bowlerName = activeBowlers[activeBowlerIndex] || 'Pat Cummins';
    
    let title = '';
    let description = '';
    const bowlerShort = bowlerName.split(' ').pop() || 'Cummins';
    const strikerShort = strikerName.split(' ').pop() || 'Kohli';

    if (isWicket) {
      title = `OUT! ${strikerName} wickets depart!`;
      const dismissalWays = [
        `c Cummins b ${bowlerShort}`, 
        `lbw b ${bowlerShort}`, 
        `b ${bowlerShort} (Clean Bowled!)`, 
        `run out (Maxwell)`
      ];
      const dismissalText = dismissalWays[Math.floor(Math.random() * dismissalWays.length)];
      description = `An incredible tactical rotation! ${strikerShort} attempts a wild swipe but is thoroughly outfoxed by an offcutter from ${bowlerName}. Catch secured safely.`;

      // Update batsmen list to list dismissal status
      setBatsmenList(prev => prev.map(b => {
        if (b.name === strikerName) {
          return { ...b, runs: b.runs, balls: b.balls + 1, status: dismissalText };
        }
        return b;
      }));

      // Find next incoming batsman
      const nextBatsmanName = INCOMING_BATSMEN[upcomingBatsmanIdx % INCOMING_BATSMEN.length];
      setUpcomingBatsmanIdx(prev => prev + 1);

      // Create new batsman element
      setBatsmenList(prev => {
        if (!prev.some(b => b.name === nextBatsmanName)) {
          return [...prev, { playerId: 'NEW_' + Date.now(), name: nextBatsmanName, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'batting' }];
        }
        return prev;
      });

      // Reset partnership values
      setPartnership(prev => {
        const isB1 = prev.striker === prev.batsman1;
        return {
          ...prev,
          batsman1: isB1 ? nextBatsmanName : prev.batsman1,
          runs1: isB1 ? 0 : prev.runs1,
          balls1: isB1 ? 0 : prev.balls1,
          batsman2: isB1 ? prev.batsman2 : nextBatsmanName,
          runs2: isB1 ? prev.runs2 : 0,
          balls2: isB1 ? prev.balls2 : 0,
          totalRuns: 0,
          ballsFaced: 0,
          striker: nextBatsmanName
        };
      });

    } else {
      if (runs === 4) {
        title = `FOUR! Magnificently hit by ${strikerShort}`;
        description = `Slashed past point! ${strikerShort} gets full width and punches it flat to the fence for matching boundary units.`;
      } else if (runs === 6) {
        title = `SIX! Mammoth launch into stadium seats!`;
        description = `Incredible display of power! ${strikerName} pulls a short ball from ${bowlerName} high and deep over the boundary rope!`;
      } else if (runs === 0) {
        title = `No run, defended meticulously`;
        description = `${strikerShort} offers a textbook defensive block right on the line of the leg-stump.`;
      } else {
        title = `${runs} Run${runs > 1 ? 's' : ''}, worked into open gap`;
        description = `Tucked softly to deep midwicket. The batters coordinate easily to pocket the physical single.`;
      }

      // Update active batsman scores
      setBatsmenList(prev => prev.map(b => {
        if (b.name === strikerName) {
          const nextRuns = b.runs + runs;
          const nextBalls = b.balls + 1;
          const foursInc = runs === 4 ? 1 : 0;
          const sixesInc = runs === 6 ? 1 : 0;
          const sr = parseFloat((nextRuns / nextBalls * 100).toFixed(1));
          return {
            ...b,
            runs: nextRuns,
            balls: nextBalls,
            fours: b.fours + foursInc,
            sixes: b.sixes + sixesInc,
            strikeRate: sr,
            status: 'batting'
          };
        }
        return b;
      }));

      // Update partnership indicators
      setPartnership(prev => {
        const isB1 = prev.striker === prev.batsman1;
        const nextRuns1 = isB1 ? prev.runs1 + runs : prev.runs1;
        const nextBalls1 = isB1 ? prev.balls1 + 1 : prev.balls1;
        const nextRuns2 = isB1 ? prev.runs2 : prev.runs2 + runs;
        const nextBalls2 = isB1 ? prev.balls2 : prev.balls2 + 1;

        // Strike changes on high/odd counts
        let nextStriker = prev.striker;
        if (runs % 2 !== 0) {
          nextStriker = isB1 ? prev.batsman2 : prev.batsman1;
        }

        // Over rotation change strike
        const isEndOfOver = nextTotalBalls % 6 === 0;
        if (isEndOfOver) {
          nextStriker = nextStriker === prev.batsman1 ? prev.batsman2 : prev.batsman1;
        }

        return {
          ...prev,
          runs1: nextRuns1,
          balls1: nextBalls1,
          runs2: nextRuns2,
          balls2: nextBalls2,
          totalRuns: prev.totalRuns + runs,
          ballsFaced: prev.ballsFaced + 1,
          striker: nextStriker
        };
      });
    }

    // Update bowler performance
    setBowlersList(prev => prev.map(b => {
      if (b.name === bowlerName) {
        const currentBalls = Math.round((b.overs % 1) * 10) + Math.floor(b.overs) * 6;
        const nextBalls = currentBalls + 1;
        const nextOvers = parseFloat(`${Math.floor(nextBalls / 6)}.${nextBalls % 6}`);
        return {
          ...b,
          overs: nextOvers,
          runs: b.runs + runs,
          wickets: b.wickets + (isWicket ? 1 : 0),
          economy: parseFloat(((b.runs + runs) / (nextBalls / 6)).toFixed(2))
        };
      }
      return b;
    }));

    // Update global match score
    setMatch(prev => {
      const matchScoreParts = prev.teamA.score.split('/');
      const currentRuns = parseInt(matchScoreParts[0], 10);
      const currentWickets = matchScoreParts[1] ? parseInt(matchScoreParts[1], 10) : 0;

      const nextRuns = currentRuns + runs;
      const nextWickets = currentWickets + (isWicket ? 1 : 0);
      const target = 315;
      const runsRemaining = Math.max(0, target - nextRuns);
      const ballsRemaining = Math.max(0, 300 - nextTotalBalls);

      let statusText = `India require ${runsRemaining} runs under ${ballsRemaining} deliveries to win a thriller!`;
      if (nextRuns >= target) {
        statusText = `🏆 India won by ${6 - nextWickets} wickets in a spectacular finish!`;
        setIsLiveSimulating(false);
      } else if (nextWickets >= 10 || ballsRemaining <= 0) {
        statusText = `🇦🇺 Australia won the grand finale in a suspenseful ending!`;
        setIsLiveSimulating(false);
      }

      const currentRunRate = parseFloat((nextRuns / (nextTotalBalls / 6)).toFixed(2));
      const requiredRunRate = ballsRemaining > 0 ? parseFloat(((runsRemaining) / (ballsRemaining / 6)).toFixed(2)) : 0.00;

      let teamAProb = Math.max(5, Math.min(98, Math.round(74 + (nextRuns - 298) * 0.5 - (nextWickets - 4) * 12)));
      if (nextRuns >= target) teamAProb = 100;
      if (nextWickets >= 10 || (nextRuns < target && ballsRemaining <= 0)) teamAProb = 0;

      return {
        ...prev,
        teamA: {
          ...prev.teamA,
          score: `${nextRuns}/${nextWickets}`,
          overs: nextOversText
        },
        statusText,
        currentRunRate,
        requiredRunRate,
        probability: {
          teamA: teamAProb,
          teamB: 100 - teamAProb
        }
      };
    });

    // Save dynamic commentary
    const newCommentaryItem: CommentaryBall = {
      overNum: Math.floor(totalBalls / 6),
      ballNum: (totalBalls % 6) + 1,
      event: eventType,
      runs,
      title,
      description,
      batsman: strikerName,
      bowler: bowlerName
    };

    setCommentaryList(prev => [newCommentaryItem, ...prev]);
  };

  const handleResetSimulation = () => {
    if (window.confirm("Restore match score, partnership, and commentary back to defaults?")) {
      setMatch(SAMPLE_MATCH);
      setBatsmenList(SAMPLE_BATSMEN);
      setBowlersList(SAMPLE_BOWLERS);
      setCommentaryList(SAMPLE_COMMENTARY);
      setUpcomingBatsmanIdx(0);
      setPartnership({
        batsman1: 'Virat Kohli',
        runs1: 124,
        balls1: 110,
        batsman2: 'KL Rahul',
        runs2: 68,
        balls2: 72,
        totalRuns: 192,
        ballsFaced: 182,
        striker: 'Virat Kohli'
      });
      localStorage.removeItem('cricedge_sim_match');
      localStorage.removeItem('cricedge_sim_batsmen');
      localStorage.removeItem('cricedge_sim_bowlers');
      localStorage.removeItem('cricedge_sim_commentary');
      localStorage.removeItem('cricedge_sim_partnership');
      localStorage.removeItem('cricedge_sim_upcoming_idx');
    }
  };

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

  const containerClasses = theme === 'dark' 
    ? "space-y-6 text-slate-100" 
    : "space-y-6 text-[#1A1A1A]";

  return (
    <div className={containerClasses}>
      
      {/* Dynamic Simulated Telemetry Controls Tray */}
      <div className={`rounded-3xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 border transition ${
        theme === 'dark' 
          ? 'bg-slate-950/80 border-slate-800 text-slate-200 shadow-lg' 
          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-purple-400 block">AI Stadium Controller Feed</span>
            <p className="text-xs font-semibold">Simulate live ball events & watch odds updates dynamically in real-time!</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action indicator message */}
          <AnimatePresence>
            {flashOutcome && (
              <motion.span
                initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.4, opacity: 0, rotate: 15 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black text-white shrink-0 shadow-md ${
                  flashOutcome === 'SIX' ? 'bg-indigo-600 shadow-indigo-600/30' :
                  flashOutcome === 'FOUR' ? 'bg-emerald-600 shadow-emerald-600/30' :
                  flashOutcome === 'WICKET' ? 'bg-rose-600 shadow-rose-600/30 animate-shake' : 
                  flashOutcome === 'RUNS' ? 'bg-sky-600' : 'bg-slate-650'
                }`}
              >
                🔥 {flashOutcome}!
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer border transition-all ${
              isLiveSimulating 
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse' 
                : 'bg-slate-900 border-slate-950 text-white hover:bg-slate-800 dark:bg-slate-900'
            }`}
          >
            <Activity className={`h-4 w-4 ${isLiveSimulating ? 'animate-spin' : ''}`} />
            {isLiveSimulating ? 'Stop Autoplay' : 'Autoplay Balls'}
          </button>

          <button
            type="button"
            onClick={handleSimulateBall}
            disabled={isLiveSimulating}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-md hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Zap className="h-4 w-4" /> Next Ball
          </button>

          <button
            type="button"
            onClick={handleResetSimulation}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              theme === 'dark' 
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}
          >
            Reset Match
          </button>
        </div>
      </div>

      {/* Live Match Summary Header Card with exit-entry scaling animations */}
      <div 
        id="live-score-summary" 
        className={`rounded-[2.5rem] border p-8 shadow-md relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-slate-950 border-slate-900 shadow-purple-950/10' 
            : 'bg-white border-slate-100'
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-500"></div>
        
        <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-4.5 py-1.5 rounded-br-3xl flex items-center gap-1.5 tracking-wider uppercase animate-pulse shadow-xs">
          <span className="h-2 w-2 rounded-full bg-white"></span>
          LIVE SCORECARD
        </div>

        <div className="text-right text-xs font-mono text-slate-400 mb-4 pt-1.5">
          {match.tournament} • {match.venue}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          {/* Team A */}
          <div className="flex items-center gap-4">
            <span className="text-4xl bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-150/50 dark:border-slate-800">{match.teamA.logo}</span>
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {match.teamA.name}
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/60 font-mono tracking-wider uppercase">Batting</span>
              </h3>
              
              {/* Animated Runs scoring view */}
              <div className="relative h-11 flex items-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={match.teamA.score}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    className={`text-3xl font-black font-mono tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                  >
                    {match.teamA.score}
                  </motion.p>
                </AnimatePresence>
              </div>

              <p className="text-xs text-slate-400 font-mono mt-0.5">Overs: {match.teamA.overs} / 50</p>
            </div>
          </div>

          {/* Versus Mid section */}
          <div className="flex flex-col items-center justify-center text-center border-y md:border-y-0 md:border-x border-slate-100 dark:border-slate-850 py-4 md:py-0 px-4">
            <span className={`text-xs font-bold uppercase tracking-widest border px-3.5 py-1 rounded-full ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800 text-slate-400' 
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}>VS</span>
            
            <p className="text-xs font-semibold text-rose-500 mt-3 flex items-center gap-1.5 animate-pulse min-h-[1.5rem]">
              <Activity className="h-3 w-3" />
              {match.statusText}
            </p>
            
            <div className={`w-full h-2 rounded-full mt-4 overflow-hidden relative ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <motion.div 
                className="bg-gradient-to-r from-emerald-400 to-sky-400 h-full rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${match.probability.teamA}%` }}
                transition={{ duration: 0.5, type: "spring" }}
              />
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono font-bold text-slate-500 mt-1.5">
              <span>{match.teamA.shortName}: {match.probability.teamA}%</span>
              <span>Win Probability</span>
              <span>{match.teamB.shortName}: {match.probability.teamB}%</span>
            </div>
          </div>

          {/* Team B */}
          <div className="flex items-center justify-end gap-3 md:text-right">
            <div>
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {match.teamB.name}
              </h3>
              <p className={`text-3xl font-black mt-1 font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {match.teamB.score}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">Overs: {match.teamB.overs} (Completed)</p>
            </div>
            <span className="text-4xl bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-150/50 dark:border-slate-800">{match.teamB.logo}</span>
          </div>
        </div>

        {/* Highlight ticker row metrics with small spring enters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-150/60 dark:border-slate-900">
          <div className={`rounded-[1.25rem] border p-4 text-center ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
          }`}>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Current Run Rate</p>
            <p className={`text-lg font-bold mt-1 font-mono ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{match.currentRunRate}</p>
          </div>
          <div className={`rounded-[1.25rem] border p-4 text-center ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
          }`}>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Req. Run Rate</p>
            <p className="text-lg font-bold text-rose-500 mt-1 font-mono">{match.requiredRunRate}</p>
          </div>
          <div className={`rounded-[1.25rem] border p-4 text-center ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
          }`}>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Proj. Final Score</p>
            <p className="text-lg font-bold text-emerald-500 mt-1 font-mono">{match.projectedScore || 350}</p>
          </div>
          <div className={`rounded-[1.25rem] border p-4 text-center ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
          }`}>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Pitch Bounce Index</p>
            <p className="text-lg font-bold text-purple-500 mt-1 font-mono">{match.pitch.paceScore}/100</p>
          </div>
        </div>
      </div>

      {/* Tabs list with updated active colors */}
      <div className="flex border-b border-slate-150/50 dark:border-slate-850 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('commentary')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'commentary' ? 'border-emerald-500 text-purple-400 font-black bg-emerald-50/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Activity className="h-4 w-4" /> Live Ball-By-Ball
        </button>
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'scorecard' ? 'border-emerald-500 text-purple-400 font-black bg-emerald-50/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <TrendingUp className="h-4 w-4" /> Live Box Scorecard
        </button>
        <button
          onClick={() => setActiveTab('wagon')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'wagon' ? 'border-emerald-500 text-purple-400 font-black bg-emerald-50/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Target className="h-4 w-4" /> Hit Wagon & Shot Pitch Map
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'analytics' ? 'border-emerald-500 text-purple-400 font-black bg-emerald-50/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Compass className="h-4 w-4" /> Target Calculators & Chat Opinions
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'commentary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Over Commentary summary List */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            <div className={`rounded-2xl border p-5 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-900 text-slate-100' : 'bg-white border-slate-150 text-slate-850'
            }`}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block animate-ping"></span>
                Event stream (Indian Innings - Chasing)
              </h4>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <AnimatePresence initial={false}>
                  {commentaryList.slice(0, 15).map((ball, idx) => (
                    <motion.div 
                      key={`${ball.overNum}.${ball.ballNum}-${idx}`}
                      initial={{ opacity: 0, y: -18, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 items-start border-b border-slate-150/40 dark:border-slate-900 pb-4 last:border-0 relative"
                    >
                      <span className={`w-14 text-center text-xs font-mono font-bold py-1.5 px-2 rounded-lg shrink-0 ${
                        ball.event === 'boundary' 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                          : ball.event === 'wicket' 
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                      }`}>
                        {ball.overNum}.{ball.ballNum}
                      </span>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-2">
                          <span>{ball.title}</span>
                          {ball.runs === 4 && <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">4 Runs</span>}
                          {ball.runs === 6 && <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">6 Runs</span>}
                          {ball.event === 'wicket' && <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">OUT</span>}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {ball.description}
                        </p>
                        <p className="text-[10px] font-mono text-purple-400 mt-1">
                          Striker: {ball.batsman} | Bowler: {ball.bowler}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Dynamic Partnership Sidebar with entrance/exit transitions */}
          <div className="space-y-6">
            <div className={`rounded-2xl border p-5 ${
              theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-150'
            }`}>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" /> Active Partnerships
              </h4>
              
              {/* Wrapped in AnimatePresence with keys mapped to score changes */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${partnership.batsman1}-${partnership.batsman2}-${partnership.totalRuns}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'} rounded-xl p-4 space-y-4`}
                >
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className={partnership.striker === partnership.batsman1 ? "font-bold text-emerald-400 underline decoration-2 decoration-emerald-500" : ""}>
                      {partnership.batsman1} ({partnership.runs1}*{partnership.striker === partnership.batsman1 ? ' 🏏' : ''})
                    </span>
                    <span className="font-mono font-bold text-slate-200 bg-purple-950/40 border border-purple-900/40 px-2.5 py-0.5 rounded-full">
                      Runs: {partnership.totalRuns}
                    </span>
                    <span className={partnership.striker === partnership.batsman2 ? "font-bold text-emerald-400 underline decoration-2 decoration-emerald-500" : ""}>
                      {partnership.batsman2} ({partnership.runs2}*{partnership.striker === partnership.batsman2 ? ' 🏏' : ''})
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <motion.div 
                      className="bg-emerald-500 h-full border-r border-[#0d1527]" 
                      initial={{ width: 0 }}
                      animate={{ width: `${partnership.totalRuns > 0 ? (partnership.runs1 / partnership.totalRuns) * 100 : 50}%` }}
                      transition={{ type: "spring", stiffness: 80 }}
                    />
                    <motion.div 
                      className="bg-sky-500 h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${partnership.totalRuns > 0 ? (partnership.runs2 / partnership.totalRuns) * 100 : 50}%` }}
                      transition={{ type: "spring", stiffness: 80 }}
                    />
                  </div>
                  
                  <p className="text-[11px] text-slate-400 text-center font-mono">
                    Balls faced: {partnership.ballsFaced} | Current striker strikes at: <b className="text-emerald-400 font-extrabold">{partnership.striker}</b>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-purple-950/20">
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <Target className="h-40 w-40" />
              </div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-emerald-100">CricEdge Live Momentum</h4>
              <p className="text-2xl font-black mt-2 font-mono">IND +{Math.round(84 + (parseFloat(match.teamA.score.split('/')[0]) - 298) * 0.9)} Index</p>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                Indian batting powerplay dominance and Kohli's immaculate wagon sweep ratio keeps the hosts ahead of the projected baseline.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs font-mono">
                <span>Momentum Peak: Over 35</span>
                <span>Chances to Win: {match.probability.teamA}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scorecard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Batting Card */}
          <div className={`rounded-xl border overflow-hidden shadow-xs ${
            theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'
          }`}>
            <div className="bg-slate-50/50 dark:bg-slate-900 px-5 py-4 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <span>🇮🇳</span> India Innings Scorecard
              </h3>
              <span className="text-sm font-mono font-bold">{match.teamA.score} ({match.teamA.overs} Overs)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-md">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-900 text-[11px] text-slate-400 uppercase font-mono bg-slate-50/30 dark:bg-slate-900/10">
                    <th className="px-5 py-3 font-semibold">Batsman</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Runs</th>
                    <th className="px-4 py-3 font-semibold text-right">Balls</th>
                    <th className="px-4 py-3 font-semibold text-right">4s</th>
                    <th className="px-4 py-3 font-semibold text-right">6s</th>
                    <th className="px-4 py-3 font-semibold text-right">S/R</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-xs">
                  {batsmenList.map((bat, i) => (
                    <tr key={i} className={bat.status === 'batting' || bat.status === 'not out' ? 'bg-emerald-500/5 font-medium' : ''}>
                      <td className="px-5 py-3 font-bold flex items-center gap-1.5">
                        {bat.name}
                        {(bat.status === 'batting' || bat.status === 'not out') && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{bat.status}</td>
                      <td className="px-4 py-3 text-right font-black font-mono">{bat.runs}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">{bat.balls}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">{bat.fours}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">{bat.sixes}</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-400 font-bold">{bat.strikeRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bowling Card */}
          <div className={`rounded-xl border overflow-hidden shadow-xs ${
            theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'
          }`}>
            <div className="bg-slate-50/50 dark:bg-slate-900 px-5 py-4 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <span>🇦🇺</span> Australian Bowling Department
              </h3>
              <b className="text-xs text-slate-400 font-mono">Target: 315 Runs</b>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-md">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-900 text-[11px] text-slate-400 uppercase font-mono bg-slate-50/30 dark:bg-slate-900/10">
                    <th className="px-5 py-3 font-semibold">Bowler</th>
                    <th className="px-4 py-3 font-semibold text-right">Overs</th>
                    <th className="px-4 py-3 font-semibold text-right">Maidens</th>
                    <th className="px-4 py-3 font-semibold text-right">Runs</th>
                    <th className="px-4 py-3 font-semibold text-right">Wickets</th>
                    <th className="px-4 py-3 font-semibold text-right">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-xs">
                  {bowlersList.map((bowl, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3 font-bold text-slate-350">{bowl.name}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-200">{bowl.overs}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">{bowl.maidens}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-200">{bowl.runs}</td>
                      <td className="px-4 py-3 text-right font-mono font-black text-rose-500">{bowl.wickets}</td>
                      <td className="px-4 py-3 text-right font-mono text-indigo-400 font-bold">{bowl.economy}</td>
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
