/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Initialize the Express router
const app = express();
const PORT = 3000;

app.use(express.json());

// Secure Server-side Gemini API client initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI prediction results will fall back to simulated analytical engines.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-Memory Database for Social Opinions & Gamified Polls
const localPolls = [
  { id: 'poll_1', question: "Who will win the upcoming IND vs AUS Series?", options: ["India", "Australia", "Draw"], votes: [1842, 1205, 142] },
  { id: 'poll_2', question: "Will Virat Kohli score another ODI century in Wankhede?", options: ["Definitely Yes", "Unlikely", "Depends on pitch"], votes: [2134, 452, 608] }
];

const matchDiscussions: Record<string, { username: string; text: string; time: string; reputation: number }[]> = {
  'LIVE_001': [
    { username: 'DhoniFanatic', text: 'Kohli is in incredible touch today! Easily the best knock of the series. Need rahul to stay firm till the 45th over.', time: '2 mins ago', reputation: 45 },
    { username: 'AussieSledge', text: 'Cummins looks extremely smart with those bowling changes in green soil. Wait until we bring hazelwood on in death overs!', time: '5 mins ago', reputation: -2 }
  ]
};

// API Endpoints: Tournament Information / Core Datasets
app.get('/api/health', (req, res) => {
  res.json({ status: "alive", system: "CricEdge AI Server Engine" });
});

// Dynamic AI prediction generator route
app.post('/api/gemini/predict', async (req, res) => {
  const { teamA, teamB, venueName, format } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Elegant baseline fallback prediction
    return res.json({
      success: true,
      usingFallback: true,
      prediction: {
        predictedWinner: teamA === 'India' ? 'India' : teamB || 'Australia',
        confidence: 76,
        tossPrediction: "Bowl First",
        topBatter: teamA === 'India' ? 'Virat Kohli' : 'Steve Smith',
        topBowler: teamA === 'India' ? 'Jasprit Bumrah' : 'Pat Cummins',
        explanation: 'Simulated Analytics based on historical form: India maintains a formidable 72% win percentage at Wankhede. Pitch has high grit density and favours chasing.',
        historicalSupport: 'In the last 5 head-to-head matches, the chasing team won 4 times on red-soil surfaces.'
      }
    });
  }

  try {
    const prompt = `You are the lead CricEdge AI Sports Analyst. Provide a granular analytical prediction for an upcoming match between ${teamA || 'India'} and ${teamB || 'Australia'} at ${venueName || 'Wankhede Stadium'} (format: ${format || 'ODI'}).
    Provide the response strictly as valid, parsable JSON matching this schema:
    {
      "predictedWinner": "Name of predicted winning team",
      "confidence": 75, // integer percentage confidence
      "tossPrediction": "Ideal choice like - Win toss and elect to bowl first",
      "topBatter": "Name of predicted top batsman",
      "topBowler": "Name of predicted top bowler",
      "explanation": "Why this prediction is generated using data and venue characteristics",
      "historicalSupport": "Provide 1 line of statistical evidence or historical records"
    }`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, prediction: parsedData });
  } catch (error: any) {
    console.error("Gemini Predict Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Auto Match & Toss Optimization Route
app.post('/api/gemini/auto-optimize', async (req, res) => {
  const { targetTeam } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Highly analytical falling back configs for each team
    let optimizedData = {
      targetTeam: targetTeam || "India",
      optimalOpponent: "Pakistan",
      optimalVenue: "Eden Gardens (Kolkata)",
      optimalFormat: "T20",
      tossStrategy: "Win toss and elect to bowl first (Capitilize on high dew coefficient)",
      optimizedProbability: 89,
      tacticalPlan: "India matches up exceptionally well against Pakistan on dry, spinning turf. Eden Gardens yields an elite turn factor of 4.2. India.s spin duo (Yuzvendra Chahal/Kuldeep Yadav) can apply a strong stranglehold in the middle overs, pushing down power play momentum. Chasing under the dew cap ensures clear batting advantages.",
      historicalPrecedent: "India has a 5-0 record in major global tournament games when chasing under evening dew cycles at Eden Gardens."
    };

    if (targetTeam === "Australia") {
      optimizedData = {
        targetTeam: "Australia",
        optimalOpponent: "England",
        optimalVenue: "Melbourne Cricket Ground (MCG)",
        optimalFormat: "Test",
        tossStrategy: "Win toss and elect to bowl first (Exploit dynamic overcast seaming swings)",
        optimizedProbability: 91,
        tacticalPlan: "England.s aggressive batsman lineup often stumbles against sustained high-bounce parameters (8.8/10 index). Playing at the MCG with a hard-surface red ball allows Mitchell Starc and Pat Cummins to generate unmatched movement and steep bounce, dismantling England’s top order inside the opening hour.",
        historicalPrecedent: "Australia won 8 of their last 10 Ashes matches at the MCG when putting the opposition in to bat on day one."
      };
    } else if (targetTeam === "England") {
      optimizedData = {
        targetTeam: "England",
        optimalOpponent: "Pakistan",
        optimalVenue: "Lord's Grounds (London)",
        optimalFormat: "ODI",
        tossStrategy: "Win toss and elect to bat first (Secure steep scoreboard pressure)",
        optimizedProbability: 87,
        tacticalPlan: "England’s ultra-aggressive batting squad has high boundary ratios. Lord’s features a flat batting deck under high-pressure ODI settings. Registering a monumental score above 330 immediately targets Pakistan.s historical vulnerability as a fragile chasing lineup under scoreboard weight.",
        historicalPrecedent: "England boasts a flawless 88% win rate on home soil when constructing an opening score above 315 against subcontinental sides."
      };
    } else if (targetTeam === "Pakistan") {
      optimizedData = {
        targetTeam: "Pakistan",
        optimalOpponent: "England",
        optimalVenue: "Melbourne Cricket Ground (MCG)",
        optimalFormat: "T20",
        tossStrategy: "Win toss and choose to bowl first (Maximize elite raw pace sway)",
        optimizedProbability: 86,
        tacticalPlan: "England's heavy dependency on paceless pitch hitting can be heavily countered at MCG. Pakistan's elite seamers (Shaheen Afridi/Naseem Shah) leverage steep lateral cut movement on this damp grass, stifling early powerplay shots down to under 5.4 runs per over.",
        historicalPrecedent: "Pakistan holds a 92% win rate in MCG simulations when restricting modern power-hitters under the 140-run mark."
      };
    }

    return res.json({ success: true, usingFallback: true, optimized: optimizedData });
  }

  try {
    const prompt = `You are the lead CricEdge AI Sports Analyst and Optimizer.
    Analyze the sports characteristics of "${targetTeam || 'India'}" (from options: India, Australia, England, Pakistan) and calculate the absolute optimal match-up that ensures an elite "high chance probability to win" (>85%).
    Customize:
    1. A favorable opponent (from options: India, Australia, England, Pakistan) that "${targetTeam || 'India'}" has a structural tactical advantage against.
    2. A favorable stadium (from options: Wankhede Stadium, Lord's Grounds London, Melbourne Cricket Ground, Eden Gardens) that matches their core technical strengths (e.g. high spin or bouncy green swing).
    3. The optimal Match Format (ODI, T20, Test).
    4. The exact Toss Strategy (e.g., Win toss and choose to bowl first to maximize dew chasing) that seals their winning chance.
    5. A high probability of victory (integer percentage between 85 and 98).
    6. A thorough, highly detailed technical Tactical Plan explaining exactly why this specific recipe is so lethal.
    7. A realistic historical precedent statistic supporting this outcome.

    Provide the response strictly as valid, parsable JSON matching this schema:
    {
      "targetTeam": "${targetTeam || 'India'}",
      "optimalOpponent": "Name of optimal opponent team",
      "optimalVenue": "Name of stadium venue",
      "optimalFormat": "ODI / T20 / Test",
      "tossStrategy": "Optimal choice like - Win toss and elect to bowl first to exploit late dew patterns",
      "optimizedProbability": 88, // integer probability from 85 to 98
      "tacticalPlan": "Thorough technical tactical breakdown of the match-up advantages and pitch mechanics",
      "historicalPrecedent": "A plausible historical precedent or head-to-head statistic that supports this AI optimization"
    }`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, optimized: parsedData });
  } catch (error: any) {
    console.error("Gemini Auto-Optimize Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cricket GPT - Natural Language Conversational Agent
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history } = req.body;
  const client = getGeminiClient();

  if (!client) {
    return res.json({
      reply: `Hello! I am CricEdge GPT, your artificial cricket intelligence assistant. Right now, I am running in local analytical sandbox mode because the Gemini API key has not been registered in your secrets setting yet.

Here is some interesting trivia for you: Virat Kohli averages 58.7 in ODI cricket with  kral-ranking stats. Ask me about venue metrics, toss ratios, or fantasy recommendations, and I will do my best to answer with embedded local intelligence!`
    });
  }

  try {
    // Format conversation history for Gemini multi-turn chat
    const systemInstruction = `You are "CricEdge GPT Analyst" - an elite sports analyst, statistician, and master of pitch topography, fantasy coefficients, and batting mechanics.
Keep responses incredibly direct, professional, and full of exciting cricket terminology (e.g. "cross bat selections", "grit density", "dew factors", "seaming green decks"). Never mention API keys or software internals. Format with clean bullet points.`;

    const chat = client.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.8
      }
    });

    // Replay simple history to retain context
    if (history && Array.isArray(history)) {
      for (const turn of history.slice(-4)) {
        await chat.sendMessage({ message: turn.text });
      }
    }

    const result = await chat.sendMessage({ message: message });
    res.json({ reply: result.text });
  } catch (err: any) {
    console.error("GPT Chat Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Community Interactive API
app.get('/api/community/polls', (req, res) => {
  res.json({ polls: localPolls });
});

app.post('/api/community/polls/vote', (req, res) => {
  const { pollId, optionIndex } = req.body;
  const poll = localPolls.find(p => p.id === pollId);
  if (poll && optionIndex >= 0 && optionIndex < poll.votes.length) {
    poll.votes[optionIndex]++;
    return res.json({ success: true, poll });
  }
  res.status(400).json({ error: "Invalid poll selection" });
});

app.get('/api/community/comments/:matchId', (req, res) => {
  const { matchId } = req.params;
  const list = matchDiscussions[matchId] || [];
  res.json({ comments: list });
});

app.post('/api/community/comments/:matchId', (req, res) => {
  const { matchId } = req.params;
  const { username, text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Comment text required" });
  }
  if (!matchDiscussions[matchId]) {
    matchDiscussions[matchId] = [];
  }
  const newComment = {
    username: username || 'Guest_Player',
    text,
    time: 'Just now',
    reputation: 1
  };
  matchDiscussions[matchId].unshift(newComment);
  res.json({ success: true, comments: matchDiscussions[matchId] });
});

// Configure Vite integration
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static delivery
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CricEdge AI backend fully up on port ${PORT}`);
  });
}

main().catch(err => {
  console.error("Express App startup failure:", err);
});
