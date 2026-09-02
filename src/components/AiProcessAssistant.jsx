import React, { useState } from 'react';
import { Sparkles, Send, Bot, HelpCircle, RefreshCw, CheckCircle2, DollarSign, AlertCircle, Lightbulb, ShieldAlert, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import ThinkingMachine from './ThinkingMachine';

export default function AiProcessAssistant({ currentScenario = 'BC-10 slows 10%', propagationData = {}, selectedOption = 'B' }) {
  const defaultInitialResponse = {
    explanation: `FINANCIAL LOSS: The plant will lose ₹8.9L ($10,800) due to complete line starvation and idle worker downtime for every 10 minutes of outage.\nOPERATIONAL IMPACT: Shutting down station 1 (BC-01 Metal Stamping) starves all 37 downstream stations, leaving them with no parts so they cannot work.\nRECOMMENDED ACTION: Activate emergency backup buffer feed immediately or dispatch floating technicians for quick-turnaround restoration.`,
    source: 'GEMINI_AI_REASONER',
    model: 'gemini-2.5-flash'
  };

  const [userQuery, setUserQuery] = useState('What if I shut down station 1 completely?');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(defaultInitialResponse);
  const [showThinkingTrace, setShowThinkingTrace] = useState(false);

  const presetQuestions = [
    { text: "What if I shut down station 1 completely?", testGuardrail: false },
    { text: "How can we eliminate queue buildup at BC-10 entirely?", testGuardrail: false },
    { text: "Compare Option B (Operator Move) vs Option C (Maintenance)", testGuardrail: false },
    { text: "What is the capital expenditure model of corporate finance?", testGuardrail: true }
  ];

  const customThinkingSteps = [
    { label: "Domain & Guardrail Evaluation", detail: "Validating question against 38-station domain...", status: "done" },
    { label: "Line Starvation Matrix", detail: "Evaluating upstream/downstream dependency wave...", status: "done" },
    { label: "Financial Loss Calculation", detail: "Computing line stoppage downtime cost...", status: "done" },
    { label: "3-Line Operational Synthesis", detail: "Synthesizing Financial, Starvation, and Action recommendations...", status: "done" }
  ];

  const handleAsk = (queryToAsk) => {
    const q = queryToAsk || userQuery;
    if (!q.trim()) return;

    setLoading(true);

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
        setTimeout(() => {
          setAiResponse(data);
          setLoading(false);
        }, 800);
      })
      .catch(() => setLoading(false));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAsk(userQuery);
  };

  const isGuardrailRefusal = aiResponse?.explanation?.includes("I am station ai not general purpose ai");

  return (
    <div className="rounded-xl bg-slate-900/90 border border-indigo-500/30 p-4 space-y-3 shadow-sm backdrop-blur-md">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              Gemini AI Station Assistant
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Process Query Engine
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={() => setShowThinkingTrace(!showThinkingTrace)}
          type="button"
          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800"
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          {showThinkingTrace ? 'Hide AI Reasoning' : 'Show AI Reasoning'}
          {showThinkingTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Quick Pills */}
      <div className="flex flex-wrap gap-1.5">
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => { setUserQuery(pq.text); handleAsk(pq.text); }}
            type="button"
            className={`text-[10px] px-2.5 py-1 rounded-md border transition-all text-left flex items-center gap-1.5 ${
              pq.testGuardrail
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-indigo-300 hover:border-indigo-500/40'
            }`}
          >
            <MessageSquare className={`w-3 h-3 ${pq.testGuardrail ? 'text-amber-400' : 'text-indigo-400'}`} />
            <span>{pq.text}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask an assembly line question (e.g. What if I shut down station 1 completely?)..."
          value={userQuery}
          onChange={e => setUserQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !userQuery.trim()}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Ask</span>
        </button>
      </form>

      {/* Optional Reasoning Trace */}
      {showThinkingTrace && (
        <ThinkingMachine
          title="Gemini AI Reasoning Trace"
          subTitle={`Processing query: "${userQuery}"`}
          steps={customThinkingSteps}
          isThinking={loading}
          autoExpand={true}
        />
      )}

      {/* Streamlined Response Output */}
      {aiResponse && !loading && (
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 animate-fade-in">
          {isGuardrailRefusal ? (
            <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="text-xs">
                <strong className="font-semibold text-amber-300">"I am station ai not general purpose ai"</strong>
                <p className="text-[10px] text-amber-300/80 mt-0.5">Please ask a manufacturing or twin simulation question.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs text-slate-200 font-sans">
              {aiResponse.explanation.split('\n').filter(line => line.trim()).map((line, i) => {
                const isFin = line.includes('FINANCIAL');
                const isImp = line.includes('OPERATIONAL');

                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded border-l-4 text-xs font-medium ${
                      isFin ? 'border-l-rose-500 bg-rose-500/5 text-rose-200' :
                      isImp ? 'border-l-amber-500 bg-amber-500/5 text-amber-200' :
                      'border-l-emerald-500 bg-emerald-500/5 text-emerald-200'
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
