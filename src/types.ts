/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BatsmanScore {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  status: string; // "batting", "not out", "c Rohit b Bumrah", "lbw b Jadeja", etc.
}

export interface BowlerScore {
  playerId: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  dots: number;
}

export interface CommentaryBall {
  overNum: number;
  ballNum: number;
  event: 'run' | 'boundary' | 'wicket' | 'dot' | 'extra';
  runs: number;
  title: string;
  description: string;
  batsman: string;
  bowler: string;
}

export interface LiveMatch {
  id: string;
  teamA: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    score: string; // e.g. "284/6"
    overs: string; // e.g. "43.2"
    isBatting: boolean;
  };
  teamB: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    score: string;
    overs: string;
    isBatting: boolean;
  };
  statusText: string; // e.g. "India require 42 runs in 24 balls to win"
  tournament: string; // e.g. "IPL 2026", "T20 World Cup"
  venue: string;
  toss: string;
  countdownMinutes?: number;
  probability: {
    teamA: number; // e.g. 64 for 64% win probability
    teamB: number; // e.g. 36
  };
  requiredRunRate: number;
  currentRunRate: number;
  projectedScore?: number;
  weather: {
    temp: string;
    condition: string;
    humidity: string;
    rainChance: string;
  };
  pitch: {
    type: string;
    condition: string;
    paceScore: number; // 0-100
    spinScore: number; // 0-100
  };
}

export interface PlayerStats {
  id: string;
  name: string;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
  country: string;
  avatar: string;
  recentForm: number[]; // Last 5 matches fantasy points / scores
  career: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
    best: string;
  };
  attributes: {
    consistencyIndex: number; // 0-100
    performanceTrends: string; // "Rising" | "Stable" | "Declining"
    riskIndex: number; // 0-100
  };
  wagonWheel: { area: string; value: number }[]; // Scoring distribution
  dismissals: { type: string; value: number }[]; // Out distribution
}

export interface TeamStats {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  logo: string;
  strength: {
    batting: number;
    bowling: number;
    fielding: number;
    tossImpact: number;
    awayRecord: number;
  };
  recentScores: { opponent: string; result: 'W' | 'L'; score: string }[];
}

export interface AIPrediction {
  matchId: string;
  predictedWinner: string;
  confidence: number; // e.g. 78%
  tossPrediction: string;
  topBatter: string;
  topBowler: string;
  expectedFantasyPoints: { name: string; pts: number }[];
  explanation: string;
  historicalSupport: string;
}

export interface FantasyPrediction {
  userId?: string;
  optimalTeam: {
    captain: string;
    viceCaptain: string;
    players: { name: string; role: string; pts: number; cost: number; ownership: number }[];
  };
  differentialPicks: string[];
  safePicks: string[];
}

export interface OddsHistory {
  matchId: string;
  time: string;
  oddsA: number;
  oddsB: number;
}

export interface UserDashboardData {
  username: string;
  level: number;
  xp: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Legend';
  accuracy: number; // Predictor accuracy
  savedPlayers: string[];
  savedTeams: string[];
  history: { date: string; event: string; points: number }[];
}

export interface LanguagePack {
  liveScores: string;
  fantasyAnalytics: string;
  aiPredictions: string;
  teamAnalytics: string;
  playerAnalytics: string;
  pitchReport: string;
  community: string;
  gamification: string;
  chatAssistant: string;
}
