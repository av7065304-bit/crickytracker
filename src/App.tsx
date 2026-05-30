/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAMPLE_MATCH, LANGUAGE_PACKS, LOCAL_PLAYERS, LOCAL_TEAMS } from './data';
import LiveMatchCenter from './components/LiveMatchCenter';
import PlayerView from './components/PlayerView';
import TeamSelector from './components/TeamSelector';
import VenueToss from './components/VenueToss';
import AIPredictor from './components/AIPredictor';
import CricketGPT from './components/CricketGPT';
import FantasyBuilder from './components/FantasyBuilder';
import OddsAnalytics from './components/OddsAnalytics';
import GamificationEngine from './components/GamificationEngine';
import DashboardAndSettings from './components/DashboardAndSettings';
import { 
  Trophy, Activity, Users, MapPin, Sparkles, Bot, LineChart, 
  Settings, Award, Globe, Newspaper, Info, HelpCircle, ChevronRight, Calendar
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'live' | 'players' | 'teams' | 'stadiums' | 'predictor' | 'gpt' | 'fantasy' | 'odds' | 'ranks'>('home');
  const [language, setLanguage] = useState<string>('English');
  
  // Selected translation package
  const langPack = LANGUAGE_PACKS[language] || LANGUAGE_PACKS.English;

  // Static News & Trends data matching real stats for the Statistics and Trends segment
  const iplNews = [
    { title: 'Champions Trophy Finale: India Chasing 315 Target', desc: 'Kohli maintains anchor dominance at Wankhede. Pitch bounce index increasing.', time: '13 mins ago' },
    { title: 'Mega Auction Trends: Bowler coefficients trigger high premium prices', desc: 'Analysis shows yorker density statistics are highly prioritized by elite franchise scouts.', time: '2 hours ago' },
    { title: 'Steve Smith analyzes MCG pitch dimension choices', desc: 'Advocates deep square placements over boundary hazard chasing.', time: '1 day ago' }
  ];

  const statLeaders = {
    runs: [
      { name: 'Virat Kohli (IND)', value: '13,848 Runs', avg: '58.7 Avg' },
      { name: 'Babar Azam (PAK)', value: '5,729 Runs', avg: '56.4 Avg' }
    ],
    wickets: [
      { name: 'Jasprit Bumrah (IND)', value: '149 Wickets', avg: '23.5 Avg' },
      { name: 'Mitchell Starc (AUS)', value: '236 Wickets', avg: '25.2 Avg' }
    ],
    strikeRate: [
      { name: 'Glenn Maxwell (AUS)', value: '145.2 SR', avg: '35.4 Avg' },
      { name: 'Heinrich Klaasen (SA)', value: '142.0 SR', avg: '40.6 Avg' }
    ]
  };

  const featuredTournaments = [
    { name: 'IPL 2026', desc: 'Indian Premier League', logo: '🏏' },
    { name: 'T20 World Cup', desc: 'ICC Championship', logo: '🏆' },
    { name: 'Champions Trophy', desc: 'Elite Mini World Cup', logo: '🛡️' },
    { name: 'BBL 15', desc: 'Big Bash League Australia', logo: '⚡' },
    { name: 'The Hundred', desc: '100-Ball Cricket UK', logo: '💯' }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1A1A1A] font-sans flex flex-col antialiased">
      
      {/* Top Universal Sports Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md bg-white/95 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          
          {/* Logo Brand area */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 to-sky-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md transform group-hover:scale-105 transition-all">
              C
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 block font-sans tracking-tight">
                CricEdge <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-sky-500 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">Sports intelligence hub</span>
            </div>
          </div>

          {/* Quick Stats Tick line */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              Live: <b className="font-bold text-slate-800">IND 298/4 (42.2)</b>
            </span>
            <span>Target: <b className="font-bold text-slate-800">315</b></span>
            <span>Venue: <b className="font-bold text-slate-800">Wankhede (Red Soil)</b></span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold border border-purple-100">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
              AI PRO ENABLED
            </span>
          </div>

          {/* Settings & locales shortcuts */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('ranks')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition relative"
              title="Dashboard Preferences"
            >
              <Settings className="h-4.5 w-4.5" />
            </button>

            <span className="text-xs bg-slate-50 text-slate-700 border border-slate-100 font-mono font-bold px-2.5 py-1 rounded-lg hidden sm:inline-block">
              🌐 {language}
            </span>
          </div>

        </div>
      </header>

      {/* Primary Category Selector Tab rail bar */}
      <div className="bg-white border-b border-slate-200/80 overflow-x-auto scrollbar-none py-2 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2">
          
          {[
            { id: 'home', label: 'Match Feed', icon: Newspaper },
            { id: 'live', label: langPack.liveScores, icon: Activity, pill: 'LIVE' },
            { id: 'players', label: langPack.playerAnalytics, icon: Users },
            { id: 'teams', label: langPack.teamAnalytics, icon: Trophy },
            { id: 'stadiums', label: langPack.pitchReport, icon: MapPin },
            { id: 'predictor', label: langPack.aiPredictions, icon: Sparkles, highlight: true },
            { id: 'gpt', label: langPack.chatAssistant, icon: Bot },
            { id: 'fantasy', label: langPack.fantasyAnalytics, icon: Award },
            { id: 'odds', label: 'Pro Odds analysis', icon: LineChart },
            { id: 'ranks', label: langPack.gamification, icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`py-2 px-3.5 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-1.5 shrink-0 select-none cursor-pointer ${isActive ? 'bg-slate-900 text-white font-extrabold shadow-sm' : tab.highlight ? 'bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100/60' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.pill && (
                  <span className="bg-red-500 text-white font-black text-[8px] tracking-wider px-1.5 py-0.5 rounded uppercase font-sans animate-pulse">
                    {tab.pill}
                  </span>
                )}
              </button>
            );
          })}

        </div>
      </div>

      {/* Main Core Layout Panels container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {currentTab === 'home' && (
          <div className="space-y-8">
            
            {/* Live Hero Match Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-500"></div>

              <div className="space-y-4 pt-2 w-full md:max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded uppercase tracking-wider animate-pulse">Live</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{SAMPLE_MATCH.tournament}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                  🔥 Grand Finale Matchup: {SAMPLE_MATCH.teamA.name} require 18 runs under 46 deliveries to lift the trophy!
                </h1>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 text-xs">
                  <span className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-purple-800 text-white text-[11px] flex items-center justify-center font-bold shrink-0">AI</span>
                  <p className="text-slate-600 leading-relaxed font-semibold">
                    <b>CricEdge Prediction Coefficient:</b> India carrying {SAMPLE_MATCH.probability.teamA}% winning probability due to Virat Kohli remaining steady at crease.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentTab('live')}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition duration-150 shrink-0 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                  >
                    Enter Live score center & Commentary
                  </button>
                </div>
              </div>

              {/* Matchup scores visual mini scorecard */}
              <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 w-full md:max-w-xs space-y-5">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span className="font-bold">LIVE OVER SUMMARY</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">CRR {SAMPLE_MATCH.currentRunRate}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{SAMPLE_MATCH.teamA.logo}</span>
                      <span className="text-xs font-bold text-slate-800">{SAMPLE_MATCH.teamA.shortName}</span>
                    </div>
                    <b className="text-sm font-mono font-black text-slate-900">{SAMPLE_MATCH.teamA.score} ({SAMPLE_MATCH.teamA.overs})</b>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{SAMPLE_MATCH.teamB.logo}</span>
                      <span className="text-xs font-bold text-slate-800">{SAMPLE_MATCH.teamB.shortName}</span>
                    </div>
                    <span className="text-sm font-mono text-slate-400 font-medium">{SAMPLE_MATCH.teamB.score} (50.0)</span>
                  </div>
                </div>

                <div className="text-center pt-3 border-t border-slate-100 text-xs font-black text-rose-600">
                  {SAMPLE_MATCH.statusText}
                </div>
              </div>
            </div>

            {/* Featured Tournaments Row */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Premium Featured Tournaments</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {featuredTournaments.map((tour, idx) => (
                  <div key={idx} className="bg-white rounded-[1.5rem] p-4 border border-slate-100 flex items-center gap-3 shadow-2xs hover:bg-slate-50 hover:border-slate-200 transition cursor-pointer">
                    <span className="text-3xl bg-slate-50 p-2 rounded-2xl">{tour.logo}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{tour.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{tour.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Twin Column: Tournament Statistics & RAG AI Trends highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Leader statistics records highlights */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 lg:col-span-1">
                <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-3">
                  <Trophy className="h-4 w-4 text-emerald-600" /> Season Stat Leaders
                </h3>

                <div className="space-y-4">
                  {/* Runs */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Most Runs</span>
                    {statLeaders.runs.map((r, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700 font-medium">{r.name}</span>
                        <b className="font-mono text-gray-900">{r.value} <span className="text-[10px] text-gray-400">({r.avg})</span></b>
                      </div>
                    ))}
                  </div>

                  {/* Wickets */}
                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Most Wickets</span>
                    {statLeaders.wickets.map((w, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700 font-medium">{w.name}</span>
                        <b className="font-mono text-rose-600">{w.value} <span className="text-[10px] text-gray-400">({w.avg})</span></b>
                      </div>
                    ))}
                  </div>

                  {/* Strike Rate */}
                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Highest strike rate</span>
                    {statLeaders.strikeRate.map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700 font-medium">{s.name}</span>
                        <b className="font-mono text-emerald-700">{s.value} <span className="text-[10px] text-gray-400">({s.avg})</span></b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RAG latest News & Trends cards */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 lg:col-span-2">
                <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-2 border-b border-gray-50 pb-3">
                  <Newspaper className="h-4 w-4 text-indigo-600" />
                  Latest CricEdge Intel & News Feeds
                </h3>

                <div className="space-y-4">
                  {iplNews.map((news, index) => (
                    <div key={index} className="space-y-1.5 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center text-[10px] text-gray-450 font-mono">
                        <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">Intel Feed</span>
                        <span>{news.time}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 hover:text-emerald-700 cursor-pointer">{news.title}</h4>
                      <p className="text-[11px] text-gray-550 leading-relaxed font-semibold">{news.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Popular players catalog shortcut bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-sm text-gray-800">Popular Season Watchlist Players</h4>
                <button 
                  onClick={() => setCurrentTab('players')}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center"
                >
                  Inspect Matchups Duel <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                {LOCAL_PLAYERS.map((pl, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setCurrentTab('players');
                    }}
                    className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100 cursor-pointer hover:border-emerald-450 transition"
                  >
                    <span className="text-2xl">{pl.avatar}</span>
                    <div>
                      <b className="text-xs block text-slate-850 font-black">{pl.name}</b>
                      <span className="text-[10px] text-gray-400 font-mono">{pl.country} • {pl.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {currentTab === 'live' && <LiveMatchCenter />}
        {currentTab === 'players' && <PlayerView />}
        {currentTab === 'teams' && <TeamSelector />}
        {currentTab === 'stadiums' && <VenueToss />}
        {currentTab === 'predictor' && <AIPredictor />}
        {currentTab === 'gpt' && <CricketGPT />}
        {currentTab === 'fantasy' && <FantasyBuilder />}
        {currentTab === 'odds' && <OddsAnalytics />}
        {currentTab === 'ranks' && (
          <div className="space-y-6">
            <GamificationEngine />
            <DashboardAndSettings language={language} setLanguage={setLanguage} />
          </div>
        )}

      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-450 text-gray-500 font-mono">
          <p>© 2026 CricEdge AI Sports, Inc. All Rights Reserved. Pure Cricket Intelligence.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-emerald-700">Privacy Charter</span>
            <span className="cursor-pointer hover:text-emerald-700">Audit logs & Security</span>
            <span className="cursor-pointer hover:text-indigo-700">PWA Manifests</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
