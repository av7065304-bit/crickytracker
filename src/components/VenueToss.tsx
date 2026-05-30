/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VENUE_DATA } from '../data';
import { Shield, MapPin, Compass, Percent, Wind, Sun, AlertTriangle } from 'lucide-react';

export default function VenueToss() {
  const [selectedVenue, setSelectedVenue] = useState(VENUE_DATA[0]); // Wankhede
  const [selectedTossWinner, setSelectedTossWinner] = useState<string>('IND');
  const [weatherCondition, setWeatherCondition] = useState<'Overcast' | 'Sunny' | 'Humid Dew'>('Sunny');

  // Toss recommendation logic based on historical and real time parameters
  const generateTossRecommendation = () => {
    let decision = "Bowl First";
    let explanation = "";
    let confidence = 75;

    if (selectedVenue.id === 'LORDS') {
      if (weatherCondition === 'Overcast') {
        decision = "Bowl First";
        explanation = "High late swing and seam movement under thick London overcast skies. Strikers will struggle on green soil grass during the first 12 overs.";
        confidence = 88;
      } else {
        decision = "Bat First";
        explanation = "Hard deck seaming is minimal when dry. Lord's historically favors defending teams due to the legendary field slope deflection in second innings.";
        confidence = 72;
      }
    } else if (selectedVenue.id === 'WANKHEDE') {
      if (weatherCondition === 'Humid Dew') {
        decision = "Bowl First";
        explanation = "Heavy Mumbai coastal dew factor expected post-sunset. Spin grab drops drastically and wet ball slows down. Ideal for second innings chasing power hitters.";
        confidence = 94;
      } else {
        decision = "Bowl First";
        explanation = "Wankhede carries high relative grid bounds favoring chasing (62% historical win rate). Short boundaries ease target calculation burden.";
        confidence = 84;
      }
    } else { // MCG
      decision = "Bowl First";
      explanation = "Large straight outfield dimensions demand high run running endurance. Defensive bowling into deck proves easier in first innings when fresh.";
      confidence = 70;
    }

    return { decision, explanation, confidence };
  };

  const rec = generateTossRecommendation();

  return (
    <div className="space-y-6">
      {/* 2 Column segment: Venue database profiles & Toss Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Venue catalog navigator */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-505 text-emerald-600" />
            Venue Index database
          </h3>

          <div className="space-y-2">
            {VENUE_DATA.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVenue(v)}
                className={`w-full flex justify-between items-center p-3.5 rounded-xl border text-left transition ${selectedVenue.id === v.id ? 'bg-rose-50/15 border-rose-500/40 ring-1 ring-rose-500/10 bg-emerald-50/10 border-emerald-500/45' : 'bg-slate-50 border-gray-100 hover:bg-slate-100'}`}
              >
                <div>
                  <h4 className="text-xs font-black text-gray-800">{v.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono">{v.city} • {v.pitchType}</p>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-700">{v.id}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-3">
            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-bold">Stadium Details & Slope metrics</span>
            <p className="text-slate-600 leading-relaxed font-medium">{selectedVenue.dimensions}</p>
          </div>
        </div>

        {/* Selected Stadium Intelligence profile display */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-start border-b border-gray-50 pb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">{selectedVenue.name}</h3>
              <p className="text-xs text-gray-500">{selectedVenue.city} • pitch: {selectedVenue.pitchType}</p>
            </div>

            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold font-mono px-3 py-1 rounded-full border border-emerald-100">
              Toss choice: {selectedVenue.tossSelection}
            </span>
          </div>

          {/* Innings score tracking */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 p-3 rounded-lg">
              <span className="text-[10px] text-gray-400 block font-mono">Avg 1st Innings</span>
              <b className="text-lg font-mono font-black text-slate-800">{selectedVenue.avgFirstInnings} runs</b>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <span className="text-[10px] text-gray-400 block font-mono">Avg 2nd Innings</span>
              <b className="text-lg font-mono font-black text-slate-800">{selectedVenue.avgSecondInnings} runs</b>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <span className="text-[10px] text-gray-400 block font-mono">Chasing Win Ratio</span>
              <b className="text-lg font-mono font-black text-emerald-600">{selectedVenue.chaseRatio}%</b>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <span className="text-[10px] text-gray-400 block font-mono">Defending Win Ratio</span>
              <b className="text-lg font-mono font-black text-orange-600">{selectedVenue.defendRatio}%</b>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Topsoil balance percentages</h4>
              
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Batting Friendly Index</span>
                    <span className="font-bold">{selectedVenue.batFriendly}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedVenue.batFriendly}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Pace Bowling Seam swing</span>
                    <span className="font-bold">{selectedVenue.paceFriendly}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: `${selectedVenue.paceFriendly}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Spin Grip Turn pitch</span>
                    <span className="font-bold">{selectedVenue.spinFriendly}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${selectedVenue.spinFriendly}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-gray-250/60 text-xs space-y-3">
              <span className="text-[10px] text-gray-400 block font-mono uppercase font-bold tracking-wider">AI Stadium analysis & dew predictions</span>
              <p className="text-slate-600 leading-relaxed font-semibold">{selectedVenue.aiAnalysis}</p>
              <div className="bg-white border p-3 rounded text-slate-500 leading-relaxed text-[11px]">
                💡 <b>Micro Weather Factor:</b> {selectedVenue.weatherImpact}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toss Decision model simulation widget */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Compass className="h-5 w-5 text-indigo-600" /> Advanced real-time Toss Decision Engine
        </h3>
        <p className="text-xs text-gray-400 mb-6">Simulate field decision predictions by altering expected micro-climate conditions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-mono font-bold block mb-2">Simulate real-time micro-climate</span>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Select Weather Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'Sunny', label: '☀️ Clear / Dry' },
                    { value: 'Overcast', label: '☁️ Overcast' },
                    { value: 'Humid Dew', label: '💧 High coastal Dew' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setWeatherCondition(item.value as any)}
                      className={`text-[10px] font-bold p-2.5 rounded border transition text-center ${weatherCondition === item.value ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Select Toss Winning Squad</label>
                <select
                  value={selectedTossWinner}
                  onChange={(e) => setSelectedTossWinner(e.target.value)}
                  className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-emerald-600 w-full font-bold"
                >
                  <option value="IND">🇮🇳 India</option>
                  <option value="AUS">🇦🇺 Australia</option>
                  <option value="ENG">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model outcome report block */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-xl text-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-wide font-mono uppercase bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">
                AI Toss recommendation model
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">Confidence: {rec.confidence}%</span>
            </div>

            <b className="text-xl block text-emerald-450 font-black">Elect to: {rec.decision}</b>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {rec.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
