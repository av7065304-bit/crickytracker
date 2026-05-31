/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VENUE_DATA, LOCAL_TEAMS } from '../data';
import { Shield, MapPin, Compass, Percent, Wind, Sun, AlertTriangle, LineChart, Award, Download, Sparkles } from 'lucide-react';
import { triggerTossAlert } from '../utils/notificationService';

interface MatchPrediction {
  match: string;
  date: string;
  predictedDecision: string;
  result: 'Correct' | 'Incorrect';
  accuracy: number;
}

const VENUE_HISTORICAL_ACCURACY: Record<string, MatchPrediction[]> = {
  WANKHEDE: [
    { match: 'IND vs AUS', date: 'Nov 12, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 92 },
    { match: 'IND vs NZ', date: 'Oct 22, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 89 },
    { match: 'MI vs CSK', date: 'May 04, 2025', predictedDecision: 'Bat First', result: 'Incorrect', accuracy: 65 },
    { match: 'IND vs ENG', date: 'Mar 18, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 84 },
    { match: 'MI vs RCB', date: 'Apr 12, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 80 },
    { match: 'IND vs SA', date: 'Nov 30, 2024', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 88 },
    { match: 'MI vs KKR', date: 'Apr 20, 2025', predictedDecision: 'Bat First', result: 'Incorrect', accuracy: 72 },
    { match: 'MI vs GT', date: 'Apr 28, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 90 },
    { match: 'IND vs SL', date: 'Dec 15, 2024', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 95 },
    { match: 'IND vs AFG', date: 'Jan 10, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 87 }
  ],
  LORDS: [
    { match: 'ENG vs AUS', date: 'Aug 15, 2025', predictedDecision: 'Bat First', result: 'Correct', accuracy: 85 },
    { match: 'ENG vs IND', date: 'Jul 20, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 82 },
    { match: 'ENG vs NZ', date: 'Jun 12, 2025', predictedDecision: 'Bat First', result: 'Incorrect', accuracy: 60 },
    { match: 'Middlesex vs Surrey', date: 'May 30, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 78 },
    { match: 'ENG vs SA', date: 'Sep 08, 2024', predictedDecision: 'Bat First', result: 'Correct', accuracy: 88 },
    { match: 'ENG vs PAK', date: 'Aug 22, 2024', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 80 },
    { match: 'Middlesex vs Essex', date: 'May 14, 2025', predictedDecision: 'Bat First', result: 'Incorrect', accuracy: 64 },
    { match: 'ENG vs WI', date: 'Jul 15, 2024', predictedDecision: 'Bat First', result: 'Correct', accuracy: 89 },
    { match: 'London Spirit vs Oval Inv', date: 'Aug 01, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 75 },
    { match: 'ENG vs SL', date: 'Aug 29, 2024', predictedDecision: 'Bat First', result: 'Correct', accuracy: 83 }
  ],
  MCG: [
    { match: 'AUS vs ENG', date: 'Dec 26, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 87 },
    { match: 'AUS vs IND', date: 'Nov 05, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 82 },
    { match: 'Melb Stars vs Renegades', date: 'Jan 18, 2025', predictedDecision: 'Bat First', result: 'Incorrect', accuracy: 55 },
    { match: 'AUS vs PAK', date: 'Feb 14, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 79 },
    { match: 'Melb Stars vs Scorchers', date: 'Jan 25, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 84 },
    { match: 'AUS vs SA', date: 'Dec 18, 2024', predictedDecision: 'Bowl First', result: 'Incorrect', accuracy: 68 },
    { match: 'AUS vs NZ', date: 'Nov 22, 2024', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 91 },
    { match: 'Melb Stars vs Hurricanes', date: 'Jan 05, 2025', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 83 },
    { match: 'AUS vs WI', date: 'Feb 13, 2024', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 88 },
    { match: 'AUS vs SL', date: 'Oct 25, 2024', predictedDecision: 'Bowl First', result: 'Correct', accuracy: 86 }
  ]
};

/**
 * Analyzes accuracy trends at the currently selected venue.
 * Returns information on whether the accuracy has been consistently above 85%.
 */
function analyzePredictionConsistency(history: MatchPrediction[]) {
  if (!history || history.length === 0) {
    return { isConsistent: false, reason: "" };
  }

  // Count matches with accuracy >= 85%
  const highAccuracyMatches = history.filter(item => item.accuracy >= 85);
  const highAccCount = highAccuracyMatches.length;
  const totalCount = history.length;

  // Compute average of first 3 matches (which are the most recent of the 10)
  const recentCount = Math.min(3, history.length);
  const recentSlice = history.slice(0, recentCount);
  const recentAvg = Math.round(recentSlice.reduce((sum, item) => sum + item.accuracy, 0) / recentCount);

  // Overall average
  const overallAvg = Math.round(history.reduce((sum, item) => sum + item.accuracy, 0) / totalCount);

  // We consider the venue to be "consistently above 85%" if:
  // - The overall average is >= 85%, OR
  // - Over half (>=50%) of all stored matches reached >= 85% accuracy
  const isConsistent = highAccCount >= 5 || overallAvg >= 85;

  return {
    isConsistent,
    highAccCount,
    overallAvg,
    recentAvg,
    reason: `With ${highAccCount} out of the last ${totalCount} matches performing at or above 85% accuracy (overall average ${overallAvg}%), the prediction model has established a consistently reliable trend for ${history[0] ? "this venue" : ""}.`
  };
}

export default function VenueToss() {
  const [selectedVenue, setSelectedVenue] = useState(VENUE_DATA[0]); // Wankhede
  const [selectedTossWinner, setSelectedTossWinner] = useState<string>('IND');
  const [weatherCondition, setWeatherCondition] = useState<'Overcast' | 'Sunny' | 'Humid Dew'>('Sunny');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState<string | null>(null);
  const [hoveredAccuracyIndex, setHoveredAccuracyIndex] = useState<number | null>(null);

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

  const venueId = selectedVenue.id; // WANKHEDE, LORDS, MCG
  const matchHistory = VENUE_HISTORICAL_ACCURACY[venueId] || VENUE_HISTORICAL_ACCURACY.WANKHEDE;

  const width = 450;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = matchHistory.map((item, idx) => {
    const x = paddingX + (idx / 9) * (width - 2 * paddingX);
    const y = height - paddingY - (item.accuracy / 100) * (height - 2 * paddingY);
    return { x, y, ...item };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  const averageAccuracy = Math.round(
    matchHistory.reduce((sum, item) => sum + item.accuracy, 0) / matchHistory.length
  );

  const accuracyTrend = analyzePredictionConsistency(matchHistory);

  const activeIndex = hoveredAccuracyIndex !== null ? hoveredAccuracyIndex : 9;
  const activeMatch = matchHistory[activeIndex];

  const handlePerformCoinFlip = () => {
    setIsFlipping(true);
    setFlipResult(null);

    setTimeout(() => {
      setIsFlipping(false);
      
      const teamId = selectedTossWinner;
      const team = LOCAL_TEAMS.find(t => t.id === teamId);
      if (team) {
        setFlipResult(`🎉 ${team.logo} ${team.name} has officially won the toss !`);
        // Trigger push notification (this checks the user's subscription filters automatically!)
        triggerTossAlert(team.id, team.name, team.logo, rec.decision);
      }
    }, 1200);
  };

  const handleExportData = () => {
    const exportData = {
      venueId: selectedVenue.id,
      venueName: selectedVenue.name,
      city: selectedVenue.city,
      pitchType: selectedVenue.pitchType,
      averageAccuracy: averageAccuracy,
      exportedAt: new Date().toISOString(),
      predictionHistory: matchHistory.map((item, idx) => ({
        matchNumber: idx + 1,
        match: item.match,
        date: item.date,
        predictedDecision: item.predictedDecision,
        result: item.result,
        accuracy: item.accuracy
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = `${selectedVenue.id.toLowerCase()}_prediction_stats.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-mono font-bold block mb-2">Simulate real-time micro-climate</span>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-505 text-gray-500 font-semibold block mb-1">Select Weather Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'Sunny', label: '☀️ Clear' },
                      { value: 'Overcast', label: '☁️ Overcast' },
                      { value: 'Humid Dew', label: '💧 Dew' }
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setWeatherCondition(item.value as any)}
                        className={`text-[10px] font-extrabold p-2 rounded border transition text-center focus:outline-none cursor-pointer ${weatherCondition === item.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-505 text-gray-500 font-semibold block mb-1">Select Toss Winning Squad</label>
                  <select
                    value={selectedTossWinner}
                    onChange={(e) => setSelectedTossWinner(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 w-full font-bold text-slate-800"
                  >
                    <option value="IND">🇮🇳 India</option>
                    <option value="AUS">🇦🇺 Australia</option>
                    <option value="ENG">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</option>
                  </select>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-mono leading-relaxed pt-2 border-t border-slate-200/55">
              💡 Adjust factors to watch recommended decisions dynamically adapt to pitching moisture levels.
            </p>
          </div>

          {/* Model outcome report block */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-xl text-white flex flex-col justify-between space-y-3 shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] tracking-wide font-mono uppercase bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">
                  AI Toss recommendation model
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">Confidence: {rec.confidence}%</span>
              </div>

              <b className="text-xl block text-emerald-400 font-black">Elect to: {rec.decision}</b>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                {rec.explanation}
              </p>
            </div>

            {/* Simulated Coin Flip Trigger */}
            <div className="pt-3.5 border-t border-slate-705/50 border-t-slate-700/60 space-y-3">
              <button
                type="button"
                disabled={isFlipping}
                onClick={handlePerformCoinFlip}
                className="w-full bg-gradient-to-r from-emerald-400 to-sky-400 hover:opacity-95 font-bold text-slate-900 text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-60"
              >
                {isFlipping ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                    Flipping official coin...
                  </>
                ) : (
                  <>
                    🪙 Flip Coin & Dispatch Alerts
                  </>
                )}
              </button>

              {flipResult && (
                <div className="text-[11px] font-bold text-emerald-300 bg-white/5 p-2 rounded-lg text-center animate-fade-in border border-white/10 font-mono">
                  {flipResult}
                </div>
              )}
            </div>
          </div>

          {/* AI Historical Accuracy Chart Column */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] tracking-wide font-mono uppercase text-slate-400 font-bold">
                <LineChart className="w-3.5 h-3.5 text-indigo-500" />
                <span>AI Historical metrics</span>
              </div>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-850 uppercase tracking-wide">Prediction Accuracy</h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black text-indigo-650 text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100/50 block shrink-0">
                    Last 10: {averageAccuracy}% Acc
                  </span>
                  <button
                    id="export-metrics-btn"
                    onClick={handleExportData}
                    className="text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1 transition cursor-pointer active:scale-95 shrink-0"
                    title="Export statistics as JSON"
                  >
                    <Download className="w-3 h-3 text-slate-500" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Chart with tooltip support */}
            <div className="relative bg-white border border-slate-100 p-2.5 rounded-xl shadow-2xs">
              <svg viewBox="0 0 450 180" className="w-full h-auto overflow-visible select-none">
                <defs>
                  <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                  <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines */}
                {[50, 75, 100].map((val) => {
                  const gY = height - paddingY - (val / 100) * (height - 2 * paddingY);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={gY}
                        x2={width - paddingX}
                        y2={gY}
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={gY + 3}
                        fill="#94a3b8"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="end"
                        className="font-mono"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis labels for matches */}
                {points.map((p, idx) => (
                  <text
                    key={idx}
                    x={p.x}
                    y={height - 8}
                    fill={activeIndex === idx ? "#8b5cf6" : "#94a3b8"}
                    fillOpacity={activeIndex === idx ? 1 : 0.6}
                    fontSize="9"
                    fontWeight="black"
                    textAnchor="middle"
                    className="font-mono transition-colors duration-150"
                  >
                    M{idx + 1}
                  </text>
                ))}

                {/* Area Gradient under line */}
                {points.length > 0 && (
                  <path d={areaPath} fill="url(#chartAreaGradient)" />
                )}

                {/* Direct Line path connection */}
                {points.length > 0 && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#chartLineGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive circles / coordinates */}
                {points.map((p, idx) => {
                  const isHovered = activeIndex === idx;
                  return (
                    <g key={idx}>
                      {isHovered && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="10"
                          fill="#8b5cf6"
                          opacity="0.2"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 6 : 4}
                        fill={p.result === 'Correct' ? '#10B981' : '#EF4444'}
                        stroke={isHovered ? '#FFFFFF' : 'none'}
                        strokeWidth={isHovered ? 2 : 0}
                        className="transition-all duration-150 cursor-pointer"
                      />
                      {/* Invisible hover area trigger */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="16"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredAccuracyIndex(idx)}
                        onTouchStart={() => setHoveredAccuracyIndex(idx)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover details readout panel */}
            <div className="bg-white rounded-xl p-3 border border-slate-150/40 flex flex-col justify-between space-y-1 mt-1 shadow-2xs">
              <div className="flex justify-between items-center text-[9px]">
                <span className="font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {hoveredAccuracyIndex !== null ? `🎯 Match Prediction #${activeIndex + 1}` : '📊 Latest Match AI Outcome'}
                </span>
                <span className={`font-black uppercase px-2 py-0.5 rounded text-[8px] tracking-wide ${
                  activeMatch.result === 'Correct'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {activeMatch.result}
                </span>
              </div>

              <div className="flex justify-between items-center mt-1">
                <b className="text-xs text-slate-800">{activeMatch.match}</b>
                <span className="text-xs font-mono font-black text-slate-700">{activeMatch.accuracy}% Accuracy</span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500/90 font-medium">
                <span>Recommend: <b className="text-slate-700 font-bold">{activeMatch.predictedDecision}</b></span>
                <span className="font-mono text-[9px] text-slate-400">{activeMatch.date}</span>
              </div>
            </div>

            {/* Pro-Tip Banner */}
            {accuracyTrend.isConsistent && (
              <div className="bg-purple-50 border border-purple-100/60 rounded-xl p-3 text-xs text-purple-950 flex gap-2 items-start mt-1.5 shadow-2xs">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <b className="font-extrabold text-[11px] text-purple-900 block mb-0.5">💡 CricEdge AI Pro-Tip</b>
                  <p className="leading-relaxed text-[11px] font-medium text-purple-800">
                    {accuracyTrend.reason} Matches at this venue are prime forecasting opportunities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
