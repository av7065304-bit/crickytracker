/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Compass, Sparkles, Loader } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function CricketGPT() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: "Welcome to **CricEdge GPT Intel**! I am your premium AI cricket assistant.\n\nAsk me about bowler angles, pitch soil density, matchup dimensions (e.g. *Virat Kohli vs Jasprit Bumrah*), or optimal squad picking strategies!" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || userInput;
    if (!textToSend.trim()) return;

    if (!customText) setUserInput('');

    // Append user message
    const updatedMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages.map(m => ({ text: m.text }))
        })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: "Error: Failed to obtain response from CricEdge GPT backend." }]);
      }
    } catch (err) {
      console.error("GPT Chat Error:", err);
      setMessages(prev => [...prev, { sender: 'bot', text: "Unable to reach CricEdge AI. Please examine active network connectivity." }]);
    } finally {
      setLoading(false);
    }
  };

  const starterBubbles = [
    "Predict IND vs AUS matchup at Wankhede",
    "Compare Virat Kohli vs Jasprit Bumrah ODI average",
    "Identify premium differential picks for Dream11 roster",
    "Explain how London overcast swing impacts batting"
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 flex flex-col h-[550px] overflow-hidden shadow-xs relative">
      {/* GPT Header bar */}
      <div className="px-5 py-4 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
            AI
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
              CricEdge GPT Analyst
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-gray-500">Powered securely by server-side Gemini 3.5 Model</p>
          </div>
        </div>

        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold border border-indigo-100">
          RAG Analytics
        </span>
      </div>

      {/* Message Output Thread */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex gap-3 max-w-xl ${m.sender === 'user' ? 'ml-auto justify-end flex-row-reverse' : ''}`}
          >
            <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-650 text-emerald-900 bg-emerald-50'}`}>
              {m.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            <div className={`p-4 rounded-xl leading-relaxed text-xs border ${m.sender === 'user' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100/30 text-gray-800'}`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0">
              <Bot className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100/30 rounded-xl flex items-center gap-2 text-gray-400">
              <Loader className="h-3.5 w-3.5 animate-spin" /> CricEdge Analyst is digesting soil moisture metrics...
            </div>
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Starter Suggestions on footer */}
      {messages.length === 1 && (
        <div className="px-5 pb-3">
          <p className="text-[10px] font-mono font-bold uppercase text-gray-400 mb-2">Suggested analytical queries</p>
          <div className="flex flex-wrap gap-2">
            {starterBubbles.map((st, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(st)}
                className="text-[10px] px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-150 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition text-left cursor-pointer font-medium"
              >
                💡 {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Form input */}
      <div className="p-4 border-t border-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Query matchup rates, stadium slope angles, or ask for team suggestions..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-xs focus:outline-emerald-600 font-sans"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-lg transition shrink-0 flex items-center justify-center cursor-pointer shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
