/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LiveMatch, PlayerStats, TeamStats, AIPrediction, UserDashboardData, BatsmanScore, BowlerScore, CommentaryBall, LanguagePack } from './types';

export const LOCAL_TEAMS: TeamStats[] = [
  {
    id: 'IND',
    name: 'India',
    shortName: 'IND',
    primaryColor: '#00529B',
    logo: '🇮🇳',
    strength: { batting: 95, bowling: 92, fielding: 88, tossImpact: 75, awayRecord: 82 },
    recentScores: [
      { opponent: 'AUS', result: 'W', score: '352/5 (50) vs 312 (48.4)' },
      { opponent: 'ENG', result: 'W', score: '184/3 (20) vs 180/7 (20)' },
      { opponent: 'PAK', result: 'W', score: '264/4 (48.2) vs 261 (50)' },
      { opponent: 'SA', result: 'L', score: '220 (49.1) vs 224/4 (44.2)' },
      { opponent: 'NZ', result: 'W', score: '310/6 (50) vs 245/10 (42)' }
    ]
  },
  {
    id: 'AUS',
    name: 'Australia',
    shortName: 'AUS',
    primaryColor: '#FCD116',
    logo: '🇦🇺',
    strength: { batting: 90, bowling: 94, fielding: 95, tossImpact: 80, awayRecord: 85 },
    recentScores: [
      { opponent: 'IND', result: 'L', score: '312 (48.4) vs 352/5' },
      { opponent: 'ENG', result: 'W', score: '380/4 (50) vs 301 (45)' },
      { opponent: 'RSA', result: 'W', score: '172/2 (16) vs 170 (20)' },
      { opponent: 'NZ', result: 'W', score: '280 (48) vs 210 (41)' },
      { opponent: 'PAK', result: 'W', score: '302/5 (50) vs 280 (50)' }
    ]
  },
  {
    id: 'ENG',
    name: 'England',
    shortName: 'ENG',
    primaryColor: '#D30731',
    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    strength: { batting: 92, bowling: 84, fielding: 89, tossImpact: 70, awayRecord: 74 },
    recentScores: [
      { opponent: 'AUS', result: 'L', score: '301 (45) vs 380/4' },
      { opponent: 'IND', result: 'L', score: '180/7 vs 184/3' },
      { opponent: 'NZ', result: 'W', score: '325/4 vs 290/10' },
      { opponent: 'SA', result: 'W', score: '242/1 vs 241/8' },
      { opponent: 'PAK', result: 'L', score: '154 vs 158/3' }
    ]
  },
  {
    id: 'PAK',
    name: 'Pakistan',
    shortName: 'PAK',
    primaryColor: '#1F5A38',
    logo: '🇵🇰',
    strength: { batting: 85, bowling: 91, fielding: 74, tossImpact: 65, awayRecord: 70 },
    recentScores: [
      { opponent: 'IND', result: 'L', score: '261 vs 264/4' },
      { opponent: 'AUS', result: 'L', score: '280 vs 302/5' },
      { opponent: 'NZ', result: 'W', score: '190/3 vs 189/9' },
      { opponent: 'ENG', result: 'W', score: '158/3 (17) vs 154' },
      { opponent: 'RSA', result: 'L', score: '210 vs 211/4' }
    ]
  }
];

export const LOCAL_PLAYERS: PlayerStats[] = [
  {
    id: 'V_KOHLI',
    name: 'Virat Kohli',
    role: 'Batter',
    country: 'India',
    avatar: '👑',
    recentForm: [95, 112, 45, 87, 101],
    career: { matches: 292, runs: 13848, wickets: 4, average: 58.7, strikeRate: 93.6, best: '183' },
    attributes: { consistencyIndex: 96, performanceTrends: 'Rising', riskIndex: 12 },
    wagonWheel: [
      { area: 'Cover Drive', value: 25 },
      { area: 'On Drive', value: 18 },
      { area: 'Mid Wicket Pull', value: 22 },
      { area: 'Flick/Square Leg', value: 20 },
      { area: 'Straight Punch', value: 10 },
      { area: 'Unorthodox Cuts', value: 5 }
    ],
    dismissals: [
      { type: 'Caught Out behind', value: 40 },
      { type: 'Bowled clean', value: 22 },
      { type: 'LBW trap', value: 18 },
      { type: 'Stumped', value: 10 },
      { type: 'Run Out', value: 10 }
    ]
  },
  {
    id: 'J_BUMRAH',
    name: 'Jasprit Bumrah',
    role: 'Bowler',
    country: 'India',
    avatar: '🎯',
    recentForm: [120, 85, 90, 110, 140],
    career: { matches: 89, runs: 125, wickets: 149, average: 23.5, strikeRate: 31.4, best: '6/19' },
    attributes: { consistencyIndex: 94, performanceTrends: 'Rising', riskIndex: 8 },
    wagonWheel: [
      { area: 'Short Pitched Off', value: 12 },
      { area: 'Straight York', value: 42 },
      { area: 'Good Length Outside Off', value: 30 },
      { area: 'Leg Side Deflections', value: 16 }
    ],
    dismissals: [
      { type: 'Caught behind', value: 35 },
      { type: 'Bowled yorker', value: 45 },
      { type: 'LBW length', value: 18 },
      { type: 'Stumped spinner', value: 2 }
    ]
  },
  {
    id: 'G_MAXWELL',
    name: 'Glenn Maxwell',
    role: 'All-Rounder',
    country: 'Australia',
    avatar: '⚡',
    recentForm: [110, 32, 145, 12, 190],
    career: { matches: 138, runs: 3890, wickets: 68, average: 35.4, strikeRate: 145.2, best: '201*' },
    attributes: { consistencyIndex: 68, performanceTrends: 'Stable', riskIndex: 65 },
    wagonWheel: [
      { area: 'Reverse Sweep', value: 32 },
      { area: 'Slog Sweep Over Mid-W', value: 38 },
      { area: 'Straight Loft', value: 15 },
      { area: 'Off-side Drive', value: 15 }
    ],
    dismissals: [
      { type: 'Caught boundary', value: 55 },
      { type: 'Bowled trying scoop', value: 25 },
      { type: 'LBW slow ball', value: 15 },
      { type: 'Run Out risk', value: 5 }
    ]
  },
  {
    id: 'S_SMITH',
    name: 'Steve Smith',
    role: 'Batter',
    country: 'Australia',
    avatar: '🏏',
    recentForm: [74, 48, 92, 110, 15],
    career: { matches: 155, runs: 5612, wickets: 28, average: 44.5, strikeRate: 88.0, best: '164' },
    attributes: { consistencyIndex: 90, performanceTrends: 'Stable', riskIndex: 15 },
    wagonWheel: [
      { area: 'On Side Glance', value: 35 },
      { area: 'Cover Drive', value: 20 },
      { area: 'Straight Push', value: 25 },
      { area: 'Late Cut', value: 20 }
    ],
    dismissals: [
      { type: 'LBW moving across', value: 38 },
      { type: 'Caught slips', value: 32 },
      { type: 'Bowled leave', value: 15 },
      { type: 'Caught other', value: 15 }
    ]
  }
];

export const VENUE_DATA = [
  {
    id: 'WANKHEDE',
    name: 'Wankhede Stadium',
    city: 'Mumbai',
    pitchType: 'Red Soil Balanced',
    batFriendly: 82,
    bowlFriendly: 55,
    paceFriendly: 65,
    spinFriendly: 45,
    avgFirstInnings: 284,
    avgSecondInnings: 258,
    highest: '438/4 by RSA',
    lowest: '115/10 by BAN',
    chaseRatio: 62, // 62% wins chasing
    defendRatio: 38,
    tossSelection: 'Bowl First (Recommended)',
    weatherImpact: 'Slight dew factor after sunset, improving batting conditions.',
    dimensions: '65m straight boundary, short square boundaries (58m), high altitude humidity.',
    aiAnalysis: 'Excellent bounce lets batsmen clear the lines. Powerplay pace dictates the flow of second half.'
  },
  {
    id: 'LORDS',
    name: "Lord's Cricket Ground",
    city: 'London',
    pitchType: 'Green Seaming Grass',
    batFriendly: 58,
    bowlFriendly: 85,
    paceFriendly: 88,
    spinFriendly: 35,
    avgFirstInnings: 242,
    avgSecondInnings: 215,
    highest: '398/5 by ENG',
    lowest: '78/10 by IRE',
    chaseRatio: 44,
    defendRatio: 56,
    tossSelection: 'Bat First',
    weatherImpact: 'Overcast skies frequently trigger high late swing; humidity varies 70-90%.',
    dimensions: 'Slope from north to south side (8-foot drop), deep square bounds (74m).',
    aiAnalysis: 'Early seam movement can disrupt leading orders. First ten overs are crucial for survival.'
  },
  {
    id: 'MCG',
    name: 'Melbourne Cricket Ground',
    city: 'Melbourne',
    pitchType: 'Drop-in Pitch Balanced',
    batFriendly: 72,
    bowlFriendly: 70,
    paceFriendly: 75,
    spinFriendly: 60,
    avgFirstInnings: 268,
    avgSecondInnings: 245,
    highest: '381/5 by AUS',
    lowest: '92/10 by ZIM',
    chaseRatio: 52,
    defendRatio: 48,
    tossSelection: 'Bowl First',
    weatherImpact: 'Sudden cold gusts can assist swing. High outfield speed requires strategic placements.',
    dimensions: 'Vastly spacious boundaries (82m straight) leading to low boundary reliance, high run running.',
    aiAnalysis: 'Bowlers who vary their pace and bowl into the deck succeed here. Middle overs are won on twos and boundaries are hard to hit.'
  }
];

export const SAMPLE_MATCH: LiveMatch = {
  id: 'LIVE_001',
  teamA: {
    id: 'IND',
    name: 'India',
    shortName: 'IND',
    logo: '🇮🇳',
    score: '298/4',
    overs: '42.2',
    isBatting: true
  },
  teamB: {
    id: 'AUS',
    name: 'Australia',
    shortName: 'AUS',
    logo: '🇦🇺',
    score: '315/10',
    overs: '50.0',
    isBatting: false
  },
  statusText: 'India require 18 runs under 46 deliveries to win a thriller!',
  tournament: 'Champions Trophy – Grand Finale',
  venue: 'Wankhede Cricket Stadium, India',
  toss: 'India won the toss & elected to bowl first',
  countdownMinutes: 0,
  probability: { teamA: 74, teamB: 26 },
  requiredRunRate: 2.35,
  currentRunRate: 7.03,
  projectedScore: 350,
  weather: { temp: '32°C', condition: 'Sunny, Humidity 64%', humidity: '64%', rainChance: '5%' },
  pitch: { type: 'Dry Flat Red Soil', condition: 'High bounce, Spin impact increasing', paceScore: 68, spinScore: 78 }
};

export const SAMPLE_BATSMEN: BatsmanScore[] = [
  { playerId: 'V_KOHLI', name: 'Virat Kohli', runs: 124, balls: 110, fours: 12, sixes: 3, strikeRate: 112.7, status: 'batting' },
  { playerId: 'KL_RAHUL', name: 'KL Rahul', runs: 68, balls: 72, fours: 5, sixes: 1, strikeRate: 94.4, status: 'not out' },
  { playerId: 'R_SHARMA', name: 'Rohit Sharma', runs: 42, balls: 28, fours: 6, sixes: 2, strikeRate: 150.0, status: 'c Cummins b Starc' },
  { playerId: 'S_GILL', name: 'Shubman Gill', runs: 28, balls: 25, fours: 3, sixes: 0, strikeRate: 112.0, status: 'lbw b Hazelwood' }
];

export const SAMPLE_BOWLERS: BowlerScore[] = [
  { playerId: 'M_STARC', name: 'Mitchell Starc', overs: 9, maidens: 0, runs: 62, wickets: 1, economy: 6.89, dots: 24 },
  { playerId: 'P_CUMMINS', name: 'Pat Cummins', overs: 8.2, maidens: 1, runs: 55, wickets: 1, economy: 6.6, dots: 20 },
  { playerId: 'A_ZAMPA', name: 'Adam Zampa', overs: 10, maidens: 0, runs: 71, wickets: 2, economy: 7.1, dots: 18 },
  { playerId: 'J_HAZELWOOD', name: 'Josh Hazelwood', overs: 9, maidens: 2, runs: 48, wickets: 1, economy: 5.33, dots: 28 }
];

export const SAMPLE_COMMENTARY: CommentaryBall[] = [
  { overNum: 42, ballNum: 2, event: 'boundary', runs: 4, title: 'FOUR! Smashed down the ground', description: 'Kohli dances down and thumps the slower ball from Pat Cummins directly past the bowler for elegant boundaries! Incredible poise.', batsman: 'Virat Kohli', bowler: 'Pat Cummins' },
  { overNum: 42, ballNum: 1, event: 'run', runs: 1, title: '1 Run', description: 'Rahul drives a full delivery on the pad to square leg for single.', batsman: 'KL Rahul', bowler: 'Pat Cummins' },
  { overNum: 41, ballNum: 6, event: 'wicket', runs: 0, title: 'WICKET! Zampa strikes again!', description: 'Sky high and taken! Gill tries to clear boundary sweep but finds deep mid-wicket. Great flight from Adam Zampa.', batsman: 'Shubman Gill', bowler: 'Adam Zampa' },
  { overNum: 41, ballNum: 5, event: 'run', runs: 1, title: 'Single to deep extra cover', description: 'Kohli pushes with soft hands to cover point to secure another easy single.', batsman: 'Virat Kohli', bowler: 'Adam Zampa' },
  { overNum: 41, ballNum: 4, event: 'dot', runs: 0, title: 'No Run', description: 'Defensive block outside off towards the cover fielder.', batsman: 'Virat Kohli', bowler: 'Adam Zampa' }
];

export const LANGUAGE_PACKS: Record<string, LanguagePack> = {
  English: {
    liveScores: 'Live Scores',
    fantasyAnalytics: 'Fantasy Build & Teams',
    aiPredictions: 'AI Prediction Models',
    teamAnalytics: 'Team Index Comparison',
    playerAnalytics: 'Player Profiles & PVP',
    pitchReport: 'Stadium Toss Intelligence',
    community: 'Community Opinions',
    gamification: 'Predictor Streaks & XP',
    chatAssistant: 'Cricket GPT Analyst'
  },
  Hindi: {
    liveScores: 'लाइव स्कोरकार्ड',
    fantasyAnalytics: 'फैंटेसी विश्लेषण',
    aiPredictions: 'एआई भविष्यवाणी',
    teamAnalytics: 'टीम सूचकांक तुलना',
    playerAnalytics: 'खिलाड़ी प्रोफाइल और मैचअप',
    pitchReport: 'पिच रिपोर्ट और टॉस निर्णय',
    community: 'सामुदायिक राय',
    gamification: 'स्तर और पुरस्कार प्रणाली',
    chatAssistant: 'क्रिकेट जीपीटी'
  },
  Spanish: {
    liveScores: 'Puntajes en Vivo',
    fantasyAnalytics: 'Análisis de Fantasía',
    aiPredictions: 'Predicciones de IA',
    teamAnalytics: 'Comparación de Equipos',
    playerAnalytics: 'Análisis de Jugadores',
    pitchReport: 'Informe de Campo',
    community: 'Discusión Comunitaria',
    gamification: 'Desafíos y XP',
    chatAssistant: 'Críquet GPT'
  },
  Arabic: {
    liveScores: 'النتائج المباشرة',
    fantasyAnalytics: 'تحليلات الفانتازي',
    aiPredictions: 'توقعات الذكاء الاصطناعي',
    teamAnalytics: 'تحليل ومقارنة الفرق',
    playerAnalytics: 'ذكاء اللاعبين والمواجهات',
    pitchReport: 'تحليل الملعب والقرعة',
    community: 'منتدى النقاش',
    gamification: 'المستويات والمكافآت',
    chatAssistant: 'كريكت جيب تي'
  },
  French: {
    liveScores: 'Scores en Direct',
    fantasyAnalytics: 'Analyses Fantasy',
    aiPredictions: 'Prédictions IA',
    teamAnalytics: 'Comparaison des Équipes',
    playerAnalytics: 'Analyses des Joueurs',
    pitchReport: 'Rapport de Pitch',
    community: 'Discussion Communautaire',
    gamification: 'Statut & Récompenses',
    chatAssistant: 'Cricket GPT Assistant'
  }
};

export const MOCK_USER: UserDashboardData = {
  username: 'CricEdge_Pro99',
  level: 18,
  xp: 4200,
  rank: 'Gold',
  accuracy: 84.6,
  savedPlayers: ['Virat Kohli', 'Jasprit Bumrah'],
  savedTeams: ['India', 'Australia'],
  history: [
    { date: '2026-05-28', event: 'Predicted IND Winner Champions Trophy Final', points: 150 },
    { date: '2026-05-25', event: 'Daily Loyalty Reward', points: 30 },
    { date: '2026-05-24', event: 'Created Captain Optimized Fantasy Line-up', points: 75 }
  ]
};
