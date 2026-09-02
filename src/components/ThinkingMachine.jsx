import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, CheckCircle2, ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';

/**
 * ThinkingMachine — A real-time AI reasoning trace component.
 * Displays step-by-step thinking breakdown (Data Ingestion -> SPC Limit Checks -> Causal Trace -> Decision Synthesis).
 */
export default function ThinkingMachine({
  title = "Gemini AI Reasoning Engine",
  subTitle = "Autonomous multi-agent analytical pipeline",
  steps = [],
  finalConclusion = "",
  isThinking = false,
  autoExpand = true,
  onComplete = null
}) {
  const [expanded, setExpanded] = useState(autoExpand);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const defaultSteps = steps.length > 0 ? steps : [
    {
      label: "Ingest Telemetry",
      detail: "Streaming 38 station telemetry channels (vibration, temperature, torque, cycle time)...",
      status: "done",
      output: "100% telemetry coverage verified across 600 production units."
    },
    {
      label: "SPC Anomaly Detection",
      detail: "Evaluating Western Electric statistical control rules across rolling windows...",
      status: "done",
      output: "Detected +4.2σ cycle time drift at station BC-10 and +3.8σ at BC-07."
    },
    {
      label: "Causal Lineage Tracing",
      detail: "Computing station z-score covariance matrix and top-1 defect origin match...",
      status: "done",
      output: "Origin isolated to BC-07 (Torque Fastening A) with 88.2% historical precision."
    },
    {
      label: "Impact Propagation Simulation",
      detail: "Running discrete-event simulation to project queue growth and bottleneck ETA...",
      status: "done",
      output: "Line constraint predicted in 11 minutes. Projected throughput loss: 18%."
    },
    {
      label: "Human-in-the-Loop Synthesis",
      detail: "Evaluating 3 mitigation strategies against downtime cost vs. defect risk...",
      status: "done",
      output: "Optimal Action: Reallocate floating technician to BC-10 (68% loss reduction)."
    }
  ];

  useEffect(() => {
    if (isThinking) {
      setActiveStepIndex(0);
      setCompletedSteps([]);
      const timer = setInterval(() => {
        setActiveStepIndex(prev => {
          if (prev < defaultSteps.length - 1) {
            setCompletedSteps(c => [...c, prev]);
            return prev + 1;
          } else {
            setCompletedSteps(c => [...c, prev]);
            clearInterval(timer);
            if (onComplete) onComplete();
            return prev;
          }
        });
      }, 400);
      return () => clearInterval(timer);
    } else {
      setCompletedSteps(defaultSteps.map((_, i) => i));
      setActiveStepIndex(defaultSteps.length - 1);
    }
  }, [isThinking, defaultSteps.length]);

  return (
    <div className="rounded-xl bg-slate-900/90 border border-indigo-500/30 shadow-lg overflow-hidden transition-all duration-200">
      
      {/* Top Header */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <Cpu className={`w-4 h-4 ${isThinking ? 'animate-spin' : ''}`} />
            {isThinking && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100">{title}</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                Thinking Machine
              </span>
            </div>
            <p className="text-[10px] text-slate-400">{subTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isThinking ? (
            <span className="text-[10px] font-mono text-indigo-400 animate-pulse">Reasoning in progress...</span>
          ) : (
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Trace Complete
            </span>
          )}
          <button type="button" className="p-1 text-slate-400 hover:text-slate-200">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Reasoning Trace Body */}
      {expanded && (
        <div className="p-4 space-y-3 bg-slate-950/60">
          
          <div className="space-y-2">
            {defaultSteps.map((step, idx) => {
              const isCompleted = completedSteps.includes(idx);
              const isActive = activeStepIndex === idx && isThinking;

              return (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-lg border transition-all duration-200 ${
                    isActive 
                      ? 'border-indigo-500/50 bg-indigo-950/30 ring-1 ring-indigo-500/30' 
                      : isCompleted 
                      ? 'border-slate-800 bg-slate-900/50' 
                      : 'border-slate-900 bg-slate-950/30 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isActive ? 'bg-indigo-500/20 text-indigo-400 animate-pulse border border-indigo-500/40' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-medium text-slate-200">{step.label}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {isCompleted ? 'Validated' : isActive ? 'Processing...' : 'Queued'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 pl-7 leading-relaxed">{step.detail}</p>

                  {step.output && isCompleted && (
                    <div className="mt-2 ml-7 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-indigo-300 flex items-start gap-1.5">
                      <Terminal className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span>{step.output}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Conclusion Box */}
          {finalConclusion && !isThinking && (
            <div className="mt-3 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
              <p className="text-[10px] font-mono font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                Synthesized Executive Insight
              </p>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {finalConclusion}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
