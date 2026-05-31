/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_USER, LOCAL_TEAMS } from '../data';
import { UserCheck, HelpCircle, Activity, Globe, Bell, Smartphone, Sparkles, LogIn, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { getTossSubscription, saveTossSubscription, triggerTossAlert } from '../utils/notificationService';


export default function DashboardAndSettings({ language, setLanguage }: { language: string; setLanguage: (l: string) => void }) {
  const [tossAlerts, setTossAlerts] = useState(true);
  const [wicketAlerts, setWicketAlerts] = useState(true);
  const [scoreAlerts, setScoreAlerts] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [pwaSupportAlert, setPwaSupportAlert] = useState(false);

  // Advanced toss alert subscriptions detailed states
  const [tossOption, setTossOption] = useState<'all' | 'specific'>('all');
  const [subscribedTeams, setSubscribedTeams] = useState<string[]>(['IND', 'AUS', 'ENG', 'PAK']);
  const [browserPermission, setBrowserPermission] = useState<string>('default');
  const [simulationStatus, setSimulationStatus] = useState<string>('');

  useEffect(() => {
    const config = getTossSubscription();
    setTossAlerts(config.enabled);
    setTossOption(config.option);
    setSubscribedTeams(config.subscribedTeams);
    
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const handleTossAlertsToggle = () => {
    const nextEnabled = !tossAlerts;
    setTossAlerts(nextEnabled);
    saveTossSubscription({
      enabled: nextEnabled,
      option: tossOption,
      subscribedTeams: subscribedTeams
    });
  };

  const handleTossOptionChange = (option: 'all' | 'specific') => {
    setTossOption(option);
    saveTossSubscription({
      enabled: tossAlerts,
      option: option,
      subscribedTeams: subscribedTeams
    });
  };

  const toggleSubscribedTeam = (teamId: string) => {
    let nextSubscribed: string[];
    if (subscribedTeams.includes(teamId)) {
      // Don't let it become completely empty so we always have fallback, but they can select or deselect as they please
      nextSubscribed = subscribedTeams.filter(t => t !== teamId);
    } else {
      nextSubscribed = [...subscribedTeams, teamId];
    }
    setSubscribedTeams(nextSubscribed);
    saveTossSubscription({
      enabled: tossAlerts,
      option: tossOption,
      subscribedTeams: nextSubscribed
    });
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
    } else {
      alert('Your browser does not support native push notifications, but CricEdge in-app notifications are fully active!');
    }
  };

  const simulateTossNotificationFor = (teamId: string) => {
    const team = LOCAL_TEAMS.find(t => t.id === teamId);
    if (!team) return;

    if (!tossAlerts) {
      setSimulationStatus(`⚠️ Toss alerts are turned off! Enable Toss Decision Alert below to receive alerts.`);
      return;
    }

    if (tossOption === 'specific' && !subscribedTeams.includes(teamId)) {
      setSimulationStatus(`❌ Not Subscribed to ${team.logo} ${team.name}! No notification was triggered for this team.`);
      return;
    }

    const decisions = ['Bat First', 'Bowl First'];
    const randomDecision = decisions[Math.floor(Math.random() * decisions.length)];
    
    triggerTossAlert(team.id, team.name, team.logo, randomDecision);
    setSimulationStatus(`🎉 Toss alert simulated successfully for ${team.logo} ${team.name}! A push notification has been dispatched.`);
  };

  // Authenticate login simulation
  const [authEmail, setAuthEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<string | null>('av7065304@gmail.com');
  const [showAuthCode, setShowAuthCode] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAuthCode) {
      setShowAuthCode(true); // Ask for OTP simulator
    } else {
      setLoggedInUser(authEmail || 'guest@cricedge.ai');
      setShowAuthCode(false);
    }
  };

  const handlePwaInstall = () => {
    setPwaInstalled(true);
    setPwaSupportAlert(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Authentication header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs">
        <h3 className="font-bold text-gray-901 border-b border-gray-50 pb-3 mb-4 flex items-center gap-2 text-gray-800">
          <LogIn className="h-4 w-4 text-emerald-600" />
          CricEdge Secure OTP / Google Auth Simulator
        </h3>

        {loggedInUser ? (
          <div className="flex justify-between items-center bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div>
                <p className="text-xs font-mono font-bold text-emerald-800">CONNECTED USER ACCOUNT</p>
                <b className="text-xs text-slate-850 font-black">{loggedInUser}</b>
              </div>
            </div>
            <button
              onClick={() => setLoggedInUser(null)}
              className="text-[10px] bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold font-mono px-3 py-1.5 rounded transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs text-gray-500 block mb-1">Enter email address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="av7065304@gmail.com"
                className="w-full bg-slate-50 border border-gray-150 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-emerald-650"
              />
            </div>

            {showAuthCode && (
              <div className="flex-1 w-full">
                <label className="text-xs text-gray-550 block mb-1">Enter OTP code simulator</label>
                <input
                  type="text"
                  required
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="8 8 2 1"
                  className="w-full bg-slate-50 border border-gray-150 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-emerald-650 font-mono text-center"
                />
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-xs rounded transition whitespace-nowrap cursor-pointer block w-full sm:w-auto"
            >
              {showAuthCode ? "Verify Code & Login" : "Send Temporary Security OTP"}
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Languages switching selection */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-600" />
            Multilingual Language Config
          </h3>
          <p className="text-xs text-gray-400 font-mono">Select target locale to switch analytics dashboards dynamically</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {[
              { code: 'English', flag: '🇬🇧 Eng' },
              { code: 'Hindi', flag: '🇮🇳 हिंदी' },
              { code: 'Spanish', flag: '🇪🇸 Esp' },
              { code: 'French', flag: '🇫🇷 Fr' },
              { code: 'Arabic', flag: '🇦🇪 عربى' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`text-xs font-bold py-2 px-3 rounded-lg border transition text-center ${language === lang.code ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' : 'bg-slate-50 border-gray-150 text-gray-700 hover:bg-slate-100'}`}
              >
                {lang.flag}
              </button>
            ))}
          </div>
        </div>

        {/* PWA features indicator */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-emerald-600 animate-pulse" />
            CricEdge Edge-PWA Hub
          </h3>
          <p className="text-xs text-gray-400">Install CricEdge directly to your desktop or mobile home screens</p>

          <div className="pt-2">
            {pwaInstalled ? (
              <div className="bg-emerald-50 rounded-lg p-3 text-emerald-800 text-xs text-center font-semibold">
                ✓ CricEdge AI PWA Hub is successfully registered. Offline caching enabled.
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePwaInstall}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition text-center cursor-pointer shadow-xs"
              >
                Install Application Offline Package
              </button>
            )}

            {pwaSupportAlert && (
              <p className="text-[10px] text-gray-450 mt-2 font-mono text-center">
                PWA configuration added: index.html serviceWorker assets loaded.
              </p>
            )}
          </div>
        </div>

        {/* Notifications and push preferences */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 space-y-6 md:col-span-2 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-purple-600 animate-bounce" />
                Real-time CricEdge Push Notification Subscriptions
              </h3>
              <p className="text-xs text-slate-400 mt-1">Configure browser web push capabilities and subscribe to specific teams' official toss results.</p>
            </div>

            {/* Direct browser push status */}
            <div>
              {browserPermission === 'granted' ? (
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  HTML5 Push Active
                </span>
              ) : browserPermission === 'denied' ? (
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100" title="Notifications are blocked in your browser settings. Custom in-app alert overlays will still render perfectly.">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Local Overlay Mode
                </span>
              ) : (
                <button
                  type="button"
                  onClick={requestBrowserPermission}
                  className="px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-xs font-bold border border-purple-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Request Native Alerts Help
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* General Toss Alerts option and configuration */}
            <div className="flex flex-col p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tossAlerts}
                  onChange={handleTossAlertsToggle}
                  className="rounded accent-purple-600 h-4.5 w-4.5 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Toss Decision Alerts</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-relaxed block mt-1">Triggers immediately upon referee coin flip completion.</span>
                </div>
              </label>

              {/* Toss specific squads detailed configurations */}
              {tossAlerts && (
                <div className="mt-4 pt-3 border-t border-slate-200/50 space-y-3 animate-fade-in">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Scope filters</span>
                  
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                      <input
                        type="radio"
                        name="tossScope"
                        checked={tossOption === 'all'}
                        onChange={() => handleTossOptionChange('all')}
                        className="accent-purple-600"
                      />
                      <span>All Tournaments & Teams</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                      <input
                        type="radio"
                        name="tossScope"
                        checked={tossOption === 'specific'}
                        onChange={() => handleTossOptionChange('specific')}
                        className="accent-purple-600"
                      />
                      <span>Selected Squads Only</span>
                    </label>
                  </div>

                  {tossOption === 'specific' && (
                    <div className="space-y-1.5 pt-1 animate-fade-in">
                      <span className="text-[9px] text-slate-400 font-semibold block">CHOOSE COUNTRIES:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {LOCAL_TEAMS.map((team) => {
                          const isSubbed = subscribedTeams.includes(team.id);
                          return (
                            <button
                              key={team.id}
                              type="button"
                              onClick={() => toggleSubscribedTeam(team.id)}
                              className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[10px] font-extrabold transition cursor-pointer select-none ${
                                isSubbed 
                                  ? 'bg-purple-50/70 border-purple-200 text-purple-700' 
                                  : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-55'
                              }`}
                            >
                              <span>{team.logo} {team.shortName}</span>
                              {isSubbed && <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse ml-auto" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* General Wicket Alerts */}
            <label className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 cursor-pointer">
              <input
                type="checkbox"
                checked={wicketAlerts}
                onChange={() => setWicketAlerts(!wicketAlerts)}
                className="rounded accent-purple-600 h-4.5 w-4.5 mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Wicket Alert Hooks</span>
                <span className="text-[10px] text-slate-400 font-medium leading-relaxed block mt-1">Fires immediately when standard wickets drop, runs out, or critical drops happen.</span>
              </div>
            </label>

            {/* Overs Summary Alert */}
            <label className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 cursor-pointer">
              <input
                type="checkbox"
                checked={scoreAlerts}
                onChange={() => setScoreAlerts(!scoreAlerts)}
                className="rounded accent-purple-600 h-4.5 w-4.5 mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Summary Overs Recap</span>
                <span className="text-[10px] text-slate-400 font-medium leading-relaxed block mt-1">Triggers clean 5-overs summary indices, projection changes and run rate reviews.</span>
              </div>
            </label>
          </div>

          {/* Interactive Playground Push Notification Tester */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-100 p-5 mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">🔔 Live Subscription Testing Sandbox</span>
              <span className="text-[9px] bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">Simulator Device</span>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Validate your filters immediately! Trigger standard match-day tosses below to see how CricEdge pushes alerts depending on your subscription list:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {LOCAL_TEAMS.map((team) => {
                const isSubscribedToThis = !tossAlerts ? false : (tossOption === 'all' || subscribedTeams.includes(team.id));
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => simulateTossNotificationFor(team.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs group"
                  >
                    <span className="transform group-hover:scale-110 transition">{team.logo}</span>
                    <span>Toss: {team.shortName}</span>
                    <span className={`w-2 h-2 rounded-full ${isSubscribedToThis ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350 bg-slate-300'}`} title={isSubscribedToThis ? "Subscribed to this team" : "Not subscribed"} />
                  </button>
                );
              })}
            </div>

            {simulationStatus && (
              <div className="bg-white border border-slate-100 text-xs py-3 px-4 rounded-xl flex items-center justify-between font-medium text-slate-600 animate-fade-in">
                <span>{simulationStatus}</span>
                <button
                  type="button"
                  onClick={() => setSimulationStatus('')}
                  className="text-slate-400 hover:text-slate-700 text-[10px] font-bold uppercase shrink-0 font-mono"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
