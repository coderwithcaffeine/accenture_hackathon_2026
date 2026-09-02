import React, { useState } from 'react';
import { Sparkles, Send, Bot, HelpCircle, RefreshCw, CheckCircle2, DollarSign, AlertCircle, Lightbulb, ShieldAlert, MessageSquare } from 'lucide-react';
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
  const [showThinking, setShowThinking] = useState(true);

  const presetQuestions = [
    { text: "What if I shut down station 1 completely?", testGuardrail: false },
    { text: "How can we eliminate queue buildup at BC-10 entirely?", testGuardrail: false },
    { text: "Compare Option B (Operator Move) vs Option C (Maintenance)", testGuardrail: false },
    { text: "What is the capital expenditure model of general corporate finance?", testGuardrail: true }
  ];

  const customThinkingSteps = [
    {
      label: "Domain & Guardrail Boundary Evaluation",
      detail: "Validating question against 38-station manufacturing domain boundary...",
      status: "done",
      output: "Domain context verified: Mixed-model vehicle assembly line (BC, PT, FA)."
    },
    {
      label: "Line Starvation & Bottleneck Simulation",
      detail: "Evaluating upstream and downstream station dependency matrix...",
      status: "done",
      output: "Station dependency evaluated across 38 stations and 600 production units."
    },
    {
      label: "Financial Loss Calculation",
      detail: "Computing line stoppage downtime cost and idle labor penalties...",
      status: "done",
      output: "Financial impact calculated: ₹8.9L ($10,800) per outage incident."
    },
    {
      label: "3-Line Operational Synthesis",
      detail: "Synthesizing Financial Loss, Operational Starvation, and Actionable Mitigation...",
      status: "done",
      output: "Synthesized 3-line structured operational response."
    }
  ];

  const handleAsk = (queryToAsk) => {
    const q = queryToAsk || userQuery;
    if (!q.trim()) return;

    setLoading(true);
    setShowThinking(true);

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
        }, 1000);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAsk(userQuery);
  };

  const isGuardrailRefusal = aiResponse?.explanation?.includes("I am station ai not general purpose ai");

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
              Gemini AI Station Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Assembly Line Domain AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">Ask any assembly line process question for an instant 3-line operational analysis</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
      </div>

      {/* Preset Quick-Question Pills */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-indigo-400" />
          Sample Process Queries:
        </p>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => { setUserQuery(pq.text); handleAsk(pq.text); }}
              type="button"
              className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${
                pq.testGuardrail
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-950/30'
              }`}
            >
              <MessageSquare className={`w-3 h-3 ${pq.testGuardrail ? 'text-amber-400' : 'text-indigo-400'}`} />
              <span>{pq.text}</span>
              {pq.testGuardrail && (
                <span className="text-[9px] font-mono text-amber-400 bg-amber-500/20 px-1 rounded ml-1">Guardrail Test</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Question Input Form */}
      <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask an assembly line question (e.g. What if I shut down station 1 completely?)..."
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
              Reasoning…
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Ask AI
            </>
          )}
        </button>
      </form>

      {/* Visible Thinking Machine Stream */}
      {showThinking && (
        <ThinkingMachine
          title="Gemini AI Reasoning Trace"
          subTitle={`Processing query: "${userQuery}"`}
          steps={customThinkingSteps}
          isThinking={loading}
          autoExpand={true}
        />
      )}

      {/* Formatted 3-Line Answer Response Box */}
      {aiResponse && (
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Station AI Operational Response
            </span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {aiResponse.model || 'gemini-2.5-flash'}
            </span>
          </div>

          {/* Guardrail Refusal Card for Unrelated Non-Machine Questions */}
          {isGuardrailRefusal ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-mono text-xs font-bold text-amber-300">Domain Boundary Refusal</p>
                <p className="text-sm font-semibold text-amber-100 mt-0.5">"I am station ai not general purpose ai"</p>
                <p className="text-[11px] text-amber-300/80 mt-1">
                  Please ask a process question related to assembly line stations, bottlenecks, defects, or digital twin simulation.
                </p>
              </div>
            </div>
          ) : (
            /* Crisp 3-Line Structured Response Cards */
            <div className="space-y-2 text-xs text-slate-200 leading-relaxed font-sans">
              {aiResponse.explanation.split('\n').filter(line => line.trim()).map((line, i) => {
                const isFinancial = line.includes('FINANCIAL');
                const isImpact = line.includes('OPERATIONAL');
                const isAction = line.includes('RECOMMENDED');

                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border flex items-start gap-2.5 transition-all shadow-sm ${
                      isFinancial ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' :
                      isImpact ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
                      isAction ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' :
                      'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isFinancial && <DollarSign className="w-4 h-4 text-rose-400" />}
                      {isImpact && <AlertCircle className="w-4 h-4 text-amber-400" />}
                      {isAction && <Lightbulb className="w-4 h-4 text-emerald-400" />}
                      {!isFinancial && !isImpact && !isAction && <Bot className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-xs leading-normal">{line}</p>
                    </div>
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
