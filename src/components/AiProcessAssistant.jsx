import React, { useState } from 'react';
import { Sparkles, Send, Bot, HelpCircle, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import ThinkingMachine from './ThinkingMachine';

export default function AiProcessAssistant({ currentScenario = 'BC-10 slows 10%', propagationData = {}, selectedOption = 'B' }) {
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showThinking, setShowThinking] = useState(false);

  const presetQuestions = [
    "How can we eliminate queue buildup at BC-10 entirely?",
    "Compare Option B (Operator Move) vs Option C (Maintenance)",
    "What if we reduce upstream feed rate by 15%?",
    "What is the financial ROI of adding a buffer station?"
  ];

  const handleAsk = (queryToAsk) => {
    const q = queryToAsk || userQuery;
    if (!q.trim()) return;

    setLoading(true);
    setShowThinking(true);
    setAiResponse(null);

    fetch('/api/gemini-explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'CUSTOM_PROCESS_QUERY',
        payload: {
          userQuestion: q,
          scenario: currentScenario,
          queue: propagationData.queue || '+19 units',
          throughput: propagationData.throughput || '-18%',
          loss: propagationData.lossInr || '₹2.8L',
          selectedOption: `Option ${selectedOption}`
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        setAiResponse(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAsk(userQuery);
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-indigo-500/30 p-5 space-y-4 shadow-lg backdrop-blur-md">

      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Gemini AI Process Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Interactive Query Box
              </span>
            </h3>
            <p className="text-xs text-slate-400">Ask any process question, scenario modification, or financial trade-off query</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
      </div>

      {/* Preset Quick-Question Pills */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-indigo-400" />
          Suggested Process Queries:
        </p>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => { setUserQuery(pq); handleAsk(pq); }}
              type="button"
              className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-950/30 transition-all text-left flex items-center gap-1.5"
            >
              <span>💬</span> {pq}
            </button>
          ))}
        </div>
      </div>

      {/* Question Input Form */}
      <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type your process question (e.g., What if we double floating technicians?)..."
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !userQuery.trim()}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-md flex-shrink-0"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Thinking…
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Ask AI
            </>
          )}
        </button>
      </form>

      {/* Thinking Machine Stream while loading */}
      {loading && showThinking && (
        <ThinkingMachine
          title="Gemini AI Reasoning Engine"
          subTitle={`Processing question: "${userQuery}"`}
          isThinking={true}
          autoExpand={true}
        />
      )}

      {/* Formatted Answer Response Box */}
      {aiResponse && !loading && (
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Gemini AI Process Analysis
            </span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {aiResponse.model || 'gemini-2.5-flash'}
            </span>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {aiResponse.explanation}
          </div>
        </div>
      )}

    </div>
  );
}
