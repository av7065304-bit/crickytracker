/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Wallet, ArrowUp, ArrowDown, PlusCircle, RefreshCw, 
  Layers, CheckCircle2, DollarSign, Sparkles, Percent, ShoppingCart,
  Play, HelpCircle, X, Trash2, Award, ArrowRight
} from 'lucide-react';

interface MarketSelection {
  id: string;
  category: string;
  marketName: string;
  optionName: string;
  odds: number;
  prevOdds?: number;
}

interface ActiveBet {
  id: string;
  selections: MarketSelection[];
  stake: number;
  multiplier: number;
  potentialPayout: number;
  placedTime: string;
  currentCashoutOffer: number;
  status: 'ACTIVE' | 'WON' | 'LOST' | 'CASHED_OUT';
  cashoutReceived?: number;
}

// Initial default exotic betting options with initial baseline odds
const BASELINE_MARKETS: MarketSelection[] = [
  // Category: Match Outcome
  { id: 'mkt_1a', category: 'Match Winner', marketName: 'Full time win outcome', optionName: 'India to Win', odds: 1.25 },
  { id: 'mkt_1b', category: 'Match Winner', marketName: 'Full time win outcome', optionName: 'Australia to Win', odds: 4.10 },
  
  // Category: Next Dismissal
  { id: 'mkt_2a', category: 'Next Wicket Method', marketName: 'Dismissal prediction (5th wicket)', optionName: 'Catch Out', odds: 1.80 },
  { id: 'mkt_2b', category: 'Next Wicket Method', marketName: 'Dismissal prediction (5th wicket)', optionName: 'Bowled Clean', odds: 3.50 },
  { id: 'mkt_2c', category: 'Next Wicket Method', marketName: 'Dismissal prediction (5th wicket)', optionName: 'LBW (Leg Before Wicket)', odds: 4.50 },
  { id: 'mkt_2d', category: 'Next Wicket Method', marketName: 'Dismissal prediction (5th wicket)', optionName: 'Run Out / Stumped', odds: 12.00 },

  // Category: Player Props
  { id: 'mkt_3a', category: 'Player Props', marketName: 'Kohli century celebration', optionName: 'Kohli to score 150+ Runs', odds: 2.10 },
  { id: 'mkt_3b', category: 'Player Props', marketName: 'Pace bowler dominance', optionName: 'Cummins to claim 3+ wickets', odds: 2.65 },
  { id: 'mkt_3c', category: 'Player Props', marketName: 'Spin specialist controls', optionName: 'Jadeja economy rate under 4.0 rpo', odds: 1.95 },

  // Category: Innings Totals
  { id: 'mkt_4a', category: 'Innings Exotics', marketName: 'Match maximum shots', optionName: 'Total Match Sixes Over 14.5', odds: 1.85 },
  { id: 'mkt_4b', category: 'Innings Exotics', marketName: 'Match maximum shots', optionName: 'Total Match Sixes Under 14.5', odds: 1.95 },
  { id: 'mkt_4c', category: 'Innings Exotics', marketName: 'Next Over Run density', optionName: 'Over #43 runs over 7.5', odds: 2.20 }
];

export default function OddsAnalytics() {
  // Wallet state with localStorage persistence
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('cricedge_mock_balance');
    return saved ? parseFloat(saved) : 1000.00;
  });

  const [activeTab, setActiveTab] = useState<'exotics' | 'calculator'>('exotics');
  const [markets, setMarkets] = useState<MarketSelection[]>(BASELINE_MARKETS);
  
  // Selection basket state for placing bets
  const [selectedBasket, setSelectedBasket] = useState<MarketSelection[]>([]);
  const [stakeValue, setStakeValue] = useState<number>(50);
  const [isParlay, setIsParlay] = useState<boolean>(false);
  
  // Portfolio of active/past bets
  const [activeBets, setActiveBets] = useState<ActiveBet[]>(() => {
    const saved = localStorage.getItem('cricedge_active_bets');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastFlushedField, setLastFlushedField] = useState<string | null>(null);
  const [oddsDecimal, setOddsDecimal] = useState<number>(1.65);
  const [settlementMessage, setSettlementMessage] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);

  // Synchronize localStorage keys on updates
  useEffect(() => {
    localStorage.setItem('cricedge_mock_balance', balance.toFixed(2));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('cricedge_active_bets', JSON.stringify(activeBets));
  }, [activeBets]);

  // Implied probability calculation
  const impliedWinProbValue = oddsDecimal > 0 ? (100 / oddsDecimal).toFixed(1) : '0';

  // Toggle selection inside the betting basket
  const handleToggleBasket = (sel: MarketSelection) => {
    const alreadySelected = selectedBasket.find((item) => item.id === sel.id);
    if (alreadySelected) {
      setSelectedBasket(selectedBasket.filter((item) => item.id !== sel.id));
    } else {
      // If NOT parlay multi-bet mode, keep only this single selection
      if (!isParlay) {
        setSelectedBasket([sel]);
      } else {
        setSelectedBasket([...selectedBasket, sel]);
      }
    }
  };

  // Trigger simulated live exchange rate fluctuation
  const handleSimulateFlashOdds = () => {
    setMarkets((prevMarkets) => {
      return prevMarkets.map((m) => {
        // Random fluctuation between -15% and +15%
        const coefficientChange = (Math.random() * 0.3) - 0.15;
        const newOdds = Math.max(1.05, parseFloat((m.odds * (1 + coefficientChange)).toFixed(2)));
        return {
          ...m,
          prevOdds: m.odds,
          odds: newOdds
        };
      });
    });

    // Pick a random market to spotlight
    const randomIndex = Math.floor(Math.random() * BASELINE_MARKETS.length);
    setLastFlushedField(BASELINE_MARKETS[randomIndex].id);
    setTimeout(() => setLastFlushedField(null), 3000);

    // Also update cashout offers for existing active bets based on mock updates
    setActiveBets((prevBets) => 
      prevBets.map((b) => {
        if (b.status !== 'ACTIVE') return b;
        // Random cashout coefficient shift based on performance spikes
        const fluctuation = (Math.random() * 0.2) - 0.1;
        const newCashout = Math.max(
          b.stake * 0.35,
          Math.min(b.potentialPayout * 0.95, parseFloat((b.currentCashoutOffer * (1 + fluctuation)).toFixed(2)))
        );
        return {
          ...b,
          currentCashoutOffer: newCashout
        };
      })
    );
  };

  // Submit and Place simulated wager
  const handlePlaceBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBasket.length === 0) return;
    if (stakeValue <= 0) {
      alert('Please define a valid mock stake investment.');
      return;
    }
    if (stakeValue > balance) {
      alert('Insufficient simulated funds in your esports balance ledger.');
      return;
    }

    // Compound multiplier (all multiplied if parlay, else the single selection)
    const multiplier = isParlay
      ? parseFloat(selectedBasket.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2))
      : selectedBasket[0].odds;

    const potentialPayout = parseFloat((stakeValue * multiplier).toFixed(2));

    const newBet: ActiveBet = {
      id: 'bet_' + Date.now(),
      selections: [...selectedBasket],
      stake: stakeValue,
      multiplier,
      potentialPayout,
      placedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      currentCashoutOffer: parseFloat((stakeValue * (0.85 + (Math.random() * 0.15))).toFixed(2)), // starting cashout is near 90% of stake
      status: 'ACTIVE'
    };

    setBalance((prev) => parseFloat((prev - stakeValue).toFixed(2)));
    setActiveBets((prev) => [newBet, ...prev]);
    setSelectedBasket([]);
    
    // Smooth user onboarding advice 
    setSettlementMessage({
      text: `🚀 Live slip validated! Mock wager of $${stakeValue} placed safely. Check the live cashout ticker.`,
      type: 'info'
    });
    setTimeout(() => setSettlementMessage(null), 4500);
  };

  // Settle active bets simulating match live events
  const handleTriggerSettleAll = () => {
    const activeOnes = activeBets.filter(b => b.status === 'ACTIVE');
    if (activeOnes.length === 0) {
      alert('No active bet slips available to settle currently.');
      return;
    }

    const settledCount = activeOnes.length;
    let profitResult = 0;
    let winCount = 0;

    setActiveBets((prevBets) => 
      prevBets.map((b) => {
        if (b.status !== 'ACTIVE') return b;
        
        // Simulating 50-50 chances for exotic outcomes on the red soil deck
        const isWon = Math.random() > 0.45; 
        if (isWon) {
          profitResult += b.potentialPayout;
          winCount++;
          return { ...b, status: 'WON' };
        } else {
          return { ...b, status: 'LOST' };
        }
      })
    );

    if (profitResult > 0) {
      setBalance((prev) => parseFloat((prev + profitResult).toFixed(2)));
    }

    setSettlementMessage({
      text: `⚡ Ball-by-ball settled! Evaluated ${settledCount} outstanding slips. You won ${winCount} tickets, returning $${profitResult.toFixed(2)} to your bankroll!`,
      type: winCount > 0 ? 'success' : 'danger'
    });
    setTimeout(() => setSettlementMessage(null), 7000);
  };

  // Perform early cashout settle
  const handleCashoutBet = (betId: string) => {
    const targetBet = activeBets.find(b => b.id === betId);
    if (!targetBet || targetBet.status !== 'ACTIVE') return;

    const offer = targetBet.currentCashoutOffer;
    setBalance((prev) => parseFloat((prev + offer).toFixed(2)));
    
    setActiveBets((prevBets) => 
      prevBets.map((b) => {
        if (b.id !== betId) return b;
        return {
          ...b,
          status: 'CASHED_OUT',
          cashoutReceived: offer
        };
      })
    );

    setSettlementMessage({
      text: `💸 Cashed out bet slip early! Recouped $${offer.toFixed(2)} immediately into your ledger.`,
      type: 'info'
    });
    setTimeout(() => setSettlementMessage(null), 4000);
  };

  // Delete/Wipe settled wager logs
  const handleClearHistory = () => {
    setActiveBets(activeBets.filter(b => b.status === 'ACTIVE'));
  };

  // Restore simulated portfolio back to pristine conditions
  const handleResetWallet = () => {
    if (window.confirm('Reset wallet and delete all past active mock logs?')) {
      setBalance(1000.00);
      setSelectedBasket([]);
      setActiveBets([]);
      localStorage.removeItem('cricedge_mock_balance');
      localStorage.removeItem('cricedge_active_bets');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* simulated balance banner header card */}
      <div className="bg-gradient-to-r from-slate-900 via-[#101726] to-purple-950 text-white rounded-3xl p-6 border border-slate-8 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-purple-300 font-mono uppercase tracking-widest font-black block">Virtual Fantasy Bankroll</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h1 className="text-3xl font-mono font-black text-white tracking-tight">${balance.toFixed(2)}</h1>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-pulse" /> FREE DEMO CREDITS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">No real-currency value — testing odds multipliers, edge metrics & fantasy parameters</p>
          </div>
        </div>

        {/* Action utility items */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBalance(prev => parseFloat((prev + 250.00).toFixed(2)))}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-purple-500/20 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" /> Claim Daily +$250
          </button>
          
          <button
            type="button"
            onClick={handleResetWallet}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Reset wallet to default State"
          >
            Wipe Portfolio
          </button>
        </div>
      </div>

      {/* Interactive notification messages */}
      {settlementMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center justify-between gap-3 animate-fade-in ${
          settlementMessage.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
            : settlementMessage.type === 'danger'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25'
        }`}>
          <span>{settlementMessage.text}</span>
          <button onClick={() => setSettlementMessage(null)} className="hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Twin Column Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Catalogs & Analytics (70% column width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header selector for exotics vs calculator */}
          <div className="flex border-b border-slate-150/50 gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('exotics')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'exotics' ? 'border-purple-500 text-purple-600 font-extrabold bg-purple-50/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Award className="h-4 w-4" /> Sports Betting Lounge (Exotic Live Props)
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${activeTab === 'calculator' ? 'border-purple-500 text-purple-600 font-extrabold bg-purple-50/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Percent className="h-4 w-4" /> Implied Odds Converter
            </button>
          </div>

          {activeTab === 'exotics' && (
            <div className="space-y-6">
              
              {/* Ticker Action header */}
              <div className="bg-white rounded-2xl border border-slate-200/50 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    Stadium Exotic Betting Markets
                  </h3>
                  <p className="text-xs text-slate-450 mt-1">
                    Tap coefficients to compile your custom bet card. Accrue parlay multipliers.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateFlashOdds}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-150 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 transition active:scale-95 cursor-pointer dark:bg-slate-900/40 dark:border-slate-800"
                  >
                    <RefreshCw className="h-3 w-3 animate-spin" /> Simulated Odds Tick
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerSettleAll}
                    disabled={activeBets.filter(b => b.status === 'ACTIVE').length === 0}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                    title="Simulate the next live wicket or over delivery to settle active slips"
                  >
                    <Play className="h-3.5 w-3.5" /> Next Ball Settle
                  </button>
                </div>
              </div>

              {/* Grouped Markets layout */}
              {['Match Winner', 'Next Wicket Method', 'Player Props', 'Innings Exotics'].map((cat) => {
                const subMarkets = markets.filter(m => m.category === cat);
                return (
                  <div key={cat} className="bg-white rounded-2xl border border-slate-200/50 p-5 space-y-4">
                    <h4 className="text-xs font-extrabold text-purple-400 tracking-widest uppercase border-b border-slate-100/5 pb-2">
                      {cat} Markets
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {subMarkets.map((m) => {
                        const inBasket = selectedBasket.some(item => item.id === m.id);
                        const hasFluctuatedUp = m.prevOdds && m.odds > m.prevOdds;
                        const hasFluctuatedDown = m.prevOdds && m.odds < m.prevOdds;
                        const isFlashMarket = lastFlushedField === m.id;

                        return (
                          <div
                            key={m.id}
                            className={`p-3.5 rounded-xl border flex justify-between items-center transition-all ${
                              inBasket 
                                ? 'bg-purple-900/10 border-purple-500/60 text-purple-100' 
                                : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50/80 dark:bg-slate-900/30'
                            } ${isFlashMarket ? 'ring-2 ring-purple-600' : ''}`}
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                                {m.marketName}
                              </span>
                              <b className="text-xs font-bold text-slate-850 block">
                                {m.optionName}
                              </b>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleBasket(m)}
                              className={`px-3 py-2 rounded-xl text-xs font-mono font-black flex items-center gap-1.5 cursor-pointer transition ${
                                inBasket 
                                  ? 'bg-purple-600 text-white shadow-md' 
                                  : 'bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-slate-900 dark:border-slate-800 dark:text-indigo-400'
                              }`}
                            >
                              {hasFluctuatedUp && <ArrowUp className="h-3 w-3 text-emerald-500 shrink-0" />}
                              {hasFluctuatedDown && <ArrowDown className="h-3 w-3 text-rose-500 shrink-0" />}
                              <span>{m.odds.toFixed(2)}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="bg-white rounded-2xl border border-slate-200/50 p-6 space-y-6">
              
              <div className="border-b border-slate-100/10 pb-4">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-purple-400" />
                  Implied win Odds Calculator & Conversions
                </h3>
                <p className="text-xs text-slate-450 mt-1">
                  Evaluate mathematical win metrics and margin margins based on arbitrary system decimal coefficients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Implied Probability Calculator Inputs */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 space-y-4 dark:bg-slate-900/30">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold uppercase block">Odds Implied Percentage</span>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Enter Decimal Win Odds (e.g. 1.65)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1.01"
                      value={oddsDecimal}
                      onChange={(e) => setOddsDecimal(Math.max(1.01, parseFloat(e.target.value) || 0))}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-purple-600 block bg-white font-black"
                    />
                  </div>

                  <div className="bg-emerald-500/10 text-emerald-400 rounded-xl p-4 text-center border border-emerald-500/20">
                    <span className="text-[9px] block text-emerald-400 font-semibold uppercase tracking-wide">Implied Win Probability Matcher</span>
                    <b className="text-2xl font-mono mt-1 block font-black">{impliedWinProbValue}%</b>
                  </div>
                </div>

                {/* Quick Convert Helper Card */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Standard Conversion Guide</h4>
                  
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 space-y-2 text-xs dark:bg-slate-900/30">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-450">Odds 1.50</span>
                      <span className="font-bold">Implies 66.7% Win Chance</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-450">Odds 2.00</span>
                      <span className="font-bold">Implies 50.0% Win Chance</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-450">Odds 3.00</span>
                      <span className="font-bold">Implies 33.3% Win Chance</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-450">Odds 5.00</span>
                      <span className="font-bold">Implies 20.0% Win Chance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative notification block */}
              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/25 text-xs text-amber-300 flex gap-3">
                <span className="h-5 w-5 shrink-0 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-black">!</span>
                <div>
                  <b className="block">Pure Mathematical Framework Consent Notice</b>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    CricEdge AI tracks implied probability coefficients and market odds changes purely for mathematical sports intelligence. <b>Real-money gambling/betting is strictly prohibited on this platform.</b> All values serve educational/simulation purposes to enhance esports statistics exploration and fantasy selection models.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Dynamic Action Slip Drawer Sidebar (30% column width) */}
        <div className="space-y-6">
          
          {/* Active Bet Builder Slip Card */}
          <div className="bg-white rounded-3xl border border-slate-200/50 p-5 shadow-md flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-purple-500"></div>
            
            <div className="flex justify-between items-center border-b border-slate-100/5 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4.5 w-4.5 text-purple-400 animate-bounce" />
                <h3 className="font-black text-xs uppercase tracking-wide">Interactive Slip Basket</h3>
              </div>
              <span className="text-[10px] font-bold bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                {selectedBasket.length} Items Selected
              </span>
            </div>

            {/* Empty slip view */}
            {selectedBasket.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <p className="text-xs">Your betting slip is currently empty.</p>
                <p className="text-[10px] text-slate-500">Tap onto any of the decimal odds buttons on the left to include exotic match props into your card.</p>
              </div>
            ) : (
              /* Active slip view builder */
              <form onSubmit={handlePlaceBet} className="space-y-4">
                
                {/* ACCA / Parlay Toggle Switch */}
                <div className="flex items-center justify-between bg-slate-50/70 p-2.5 rounded-xl border border-slate-150/40 dark:bg-slate-900/60">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-400" />
                    <div>
                      <span className="text-xs font-bold block">Aggregated Accumulator (ACCA)</span>
                      <span className="text-[9px] text-slate-500 block">Combine stakes into compound odds</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsParlay(!isParlay);
                      setSelectedBasket([]); // Clear existing to reset constraint
                    }}
                    className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer select-none ${
                      isParlay 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {isParlay ? 'MULTI ACCA ON' : 'SINGLE MODE'}
                  </button>
                </div>

                {/* Selected markets list */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedBasket.map((sel) => (
                    <div key={sel.id} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl relative flex justify-between items-center group dark:bg-slate-900/40">
                      <div className="space-y-0.5 max-w-[85%]">
                        <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block">
                          {sel.category}
                        </span>
                        <b className="text-xs font-bold text-slate-800 block truncate leading-tight">
                          {sel.optionName}
                        </b>
                        <span className="text-[9px] text-slate-450 block font-mono">
                          {sel.marketName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black text-purple-400">
                          @{sel.odds}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleBasket(sel)}
                          className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Investment Stake Slider Calculator */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3 dark:bg-slate-900/40">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Simulated Stake Value:</span>
                    <b className="text-sm font-mono font-black text-slate-800">${stakeValue}</b>
                  </div>
                  
                  <input
                    type="range"
                    min="10"
                    max={Math.min(500, balance)}
                    step="10"
                    value={stakeValue}
                    onChange={(e) => setStakeValue(parseInt(e.target.value) || 10)}
                    className="w-full accent-purple-500"
                  />

                  {/* Preset quick stake buttons */}
                  <div className="grid grid-cols-4 gap-1.5 w-full">
                    {[10, 50, 100, Math.floor(balance)].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setStakeValue(p)}
                        className="px-1 py-1 bg-white border border-slate-250 rounded text-[10px] font-bold font-mono hover:bg-slate-50 hover:border-slate-350 cursor-pointer text-slate-650 transition dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                      >
                        {p === Math.floor(balance) ? 'MAX' : `$${p}`}
                      </button>
                    ))}
                  </div>

                  {/* Compound slip calculations */}
                  <div className="pt-3 border-t border-slate-200/50 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Compound Multiplier:</span>
                      <b className="text-slate-900 font-bold font-sans">
                        {isParlay 
                          ? selectedBasket.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2) 
                          : selectedBasket[0].odds.toFixed(2)
                        }x
                      </b>
                    </div>
                    
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500">Potential Payout:</span>
                      <b className="text-base text-emerald-400 font-black">
                        ${(
                          stakeValue * 
                          (isParlay 
                            ? parseFloat(selectedBasket.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2)) 
                            : selectedBasket[0].odds)
                        ).toFixed(2)}
                      </b>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-black shadow-lg hover:shadow-purple-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" /> CONFIRM SIMULATED WAGER
                </button>
              </form>
            )}

          </div>

          {/* User Portfolio of Active & Settled bet Slips */}
          <div className="bg-white rounded-3xl border border-slate-200/50 p-5 shadow-xs flex flex-col gap-4">
            
            <div className="flex justify-between items-center border-b border-slate-100/5 pb-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-500" /> My Portfolio Ledger
              </h3>
              
              {activeBets.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-[10px] text-slate-400 hover:text-slate-250 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Clear History
                </button>
              )}
            </div>

            {activeBets.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-xs">No transaction slips currently in your active portfolio ledger.</p>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {activeBets.map((bet) => {
                  const hasWon = bet.status === 'WON';
                  const hasLost = bet.status === 'LOST';
                  const isCashed = bet.status === 'CASHED_OUT';
                  const isActive = bet.status === 'ACTIVE';

                  return (
                    <div 
                      key={bet.id} 
                      className={`p-3.5 rounded-2xl border flex flex-col gap-3 relative overflow-hidden transition-all ${
                        isActive 
                          ? 'bg-slate-50/50 border-slate-250 dark:bg-slate-900/30' 
                          : hasWon 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : hasLost 
                              ? 'bg-rose-500/10 border-rose-500/30' 
                              : 'bg-indigo-500/10 border-indigo-500/30'
                      }`}
                    >
                      {/* Ticket metadata */}
                      <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                        <span className="text-[9px] font-mono font-bold text-slate-500">
                          {bet.placedTime} • ID: #{bet.id.slice(4, 9)}
                        </span>
                        
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-indigo-100 text-indigo-705 text-indigo-700' 
                            : hasWon 
                              ? 'bg-emerald-500/25 text-emerald-400' 
                              : hasLost 
                                ? 'bg-rose-500/25 text-rose-400' 
                                : 'bg-purple-550/25 text-indigo-300'
                        }`}>
                          {bet.status}
                        </span>
                      </div>

                      {/* Ticket selections */}
                      <div className="space-y-2">
                        {bet.selections.map((se) => (
                          <div key={se.id} className="flex justify-between items-start text-xs gap-2">
                            <div>
                              <b className="text-slate-800 block text-[11px] font-extrabold">{se.optionName}</b>
                              <span className="text-[9px] text-slate-500">{se.marketName}</span>
                            </div>
                            <span className="font-mono text-slate-400 whitespace-nowrap">@{se.odds}</span>
                          </div>
                        ))}
                      </div>

                      {/* Ticket financials */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Stake Amount</span>
                          <b className="text-slate-850 font-sans">${bet.stake}</b>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">
                            {isActive ? 'Potential Return' : isCashed ? 'Cashout Received' : hasWon ? 'Earned Return' : 'Lost Stake'}
                          </span>
                          <b className={`text-sm ${isActive ? 'text-slate-850' : hasWon ? 'text-emerald-450 text-emerald-450 font-black' : hasLost ? 'text-rose-450 line-through' : 'text-indigo-400 font-bold'}`}>
                            ${isCashed ? bet.cashoutReceived?.toFixed(2) : hasWon ? bet.potentialPayout : bet.potentialPayout}
                          </b>
                        </div>
                      </div>

                      {/* Early Cashout option button */}
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => handleCashoutBet(bet.id)}
                          className="w-full py-2 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/30 hover:text-white text-emerald-400 text-xs font-bold transition rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                        >
                          💸 Secure Profit / Cashout for <b>${bet.currentCashoutOffer.toFixed(2)}</b>
                        </button>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
