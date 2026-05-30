/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOCK_USER } from '../data';
import { UserCheck, HelpCircle, Activity, Globe, Bell, Smartphone, Sparkles, LogIn } from 'lucide-react';

export default function DashboardAndSettings({ language, setLanguage }: { language: string; setLanguage: (l: string) => void }) {
  const [tossAlerts, setTossAlerts] = useState(true);
  const [wicketAlerts, setWicketAlerts] = useState(true);
  const [scoreAlerts, setScoreAlerts] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [pwaSupportAlert, setPwaSupportAlert] = useState(false);

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
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 md:col-span-2">
          <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-600 animate-bounce" />
            Real-time CricEdge Push Notifications Config
          </h3>
          <p className="text-xs text-gray-400 font-mono">Enable instant matches warnings to avoid missing wicket blocks</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={tossAlerts}
                onChange={() => setTossAlerts(!tossAlerts)}
                className="rounded accent-emerald-650 h-4 w-4"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">Toss Decision Alert</span>
                <span className="text-[10px] text-gray-400">Triggers immediately after referee coin tosses</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={wicketAlerts}
                onChange={() => setWicketAlerts(!wicketAlerts)}
                className="rounded accent-emerald-650 h-4 w-4"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">Wicket Alert</span>
                <span className="text-[10px] text-gray-400">Triggers for crucial dismissals & dropoffs</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={scoreAlerts}
                onChange={() => setScoreAlerts(!scoreAlerts)}
                className="rounded accent-emerald-650 h-4 w-4"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">Overs Summary Alert</span>
                <span className="text-[10px] text-gray-400">Triggers periodic 5-overs summary parameters</span>
              </div>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
