import React from 'react';
import { AlertTriangle, ShieldAlert, Cpu, GitCommit, ArrowLeft } from 'lucide-react';
import ThinkingMachine from './ThinkingMachine';

export default function InsightsView({ insightsData, onInspectUnit }) {
  if (!insightsData) return null;

  const { next_bottleneck, quality_vehicle } = insightsData;

  const lineagePath = [
    { id: 'FA-16', name: 'Final Quality Inspection', status: 'Anomaly detected', flag: false },
    { id: 'FA-07', name: 'Torque Fastening B', status: 'Normal pass', flag: false },
    { id: 'PT-05', name: 'Basecoat Spray', status: 'Normal pass', flag: false },
    { id: 'BC-07', name: 'Torque Fastening A', status: 'Probable origin — torque & vibration shift', flag: true }
  ];

  return (
    <div className="space-y-5">

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-theme-text flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            AI Root-Cause & Quality Insights
          </h2>
          <p className="text-xs text-theme-muted mt-0.5">Bottleneck prediction, quality risk, and Causal Traceability Engine</p>
        </div>
        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Gemini 2.5 Flash · Causal Inference Engine
        </span>
      </div>

      {/* Thinking Machine Reasoning Stream */}
      <ThinkingMachine
        title="Root Cause Causal Trace Pipeline"
        subTitle="Statistical Z-Score & Telemetry Covariance Tracing"
        autoExpand={true}
        finalConclusion="Station BC-07 (Torque Fastening A) is isolated as the probable origin for defect #1842 (+4.2σ vibration excursion). Early intervention recommended before unit reaches final inspection."
      />

      {/* 3-Column Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bottleneck Prediction */}
        <div className="rounded-xl bg-theme-card border border-theme-border p-5 space-y-4 flex flex-col shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-theme-text">Bottleneck Prediction</h3>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
              {next_bottleneck?.bottleneck_risk_pct || 91}% risk
            </span>
          </div>

          <div>
            <p className="font-mono text-base font-bold text-indigo-400">
              {next_bottleneck?.station_id || 'BC-10'}
            </p>
            <p className="text-sm font-medium text-theme-text">{next_bottleneck?.station_name || 'Chassis Alignment'}</p>
            <p className="text-xs text-theme-muted mt-1">
              Constraint threshold predicted in <strong className="text-amber-400">{next_bottleneck?.predicted_in_mins || 11} min</strong>
            </p>
          </div>

          <div className="rounded-xl bg-theme-bg border border-theme-border p-3">
            <p className="text-[10px] text-theme-muted mb-1 font-mono uppercase">Cycle time trajectory</p>
            <p className="font-mono text-sm font-bold text-amber-400">
              {(next_bottleneck?.trajectory || [58, 60, 62, 65]).join('s → ')}s
            </p>
          </div>

          <p className="text-xs text-theme-muted leading-relaxed flex-1">
            Station cycle time has drifted above the 58s takt target due to cumulative mechanical wear. Queue growth is accelerating.
          </p>

          <div className="flex items-center gap-2 text-xs text-amber-400 pt-2 border-t border-theme-border font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Queue growing · +14 units waiting
          </div>
        </div>

        {/* Quality Risk */}
        <div className="rounded-xl bg-theme-card border border-theme-border p-5 space-y-4 flex flex-col shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-theme-text">Quality Defect Risk</h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              {quality_vehicle?.defect_risk_pct || 18}% defect risk
            </span>
          </div>

          <div>
            <p className="font-mono text-base font-bold text-theme-text">
              Vehicle #{quality_vehicle?.unit_id || 1842}
            </p>
            <p className="text-xs text-theme-muted mt-0.5">
              Likely origin: <span className="font-mono font-bold text-indigo-400">{quality_vehicle?.likely_origin_station || 'BC-07'}</span>
              {' '}({quality_vehicle?.likely_origin_name || 'Torque Fastening A'})
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] text-theme-muted uppercase tracking-wider font-mono">Telemetry Signals</p>
            {(quality_vehicle?.signals || [
              { name: 'Torque Excursion', value: '132.4 Nm', status: 'Abnormal' },
              { name: 'Vibration Anomaly', value: '0.62 g', status: 'Elevated' },
              { name: 'Cycle Time Dev', value: '+8%', status: 'Deviated' }
            ]).map((sig, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-theme-bg border border-theme-border">
                <span className="text-theme-muted">{sig.name}</span>
                <span className="font-mono font-semibold text-amber-400">{sig.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onInspectUnit(quality_vehicle?.unit_id || 1842)}
            type="button"
            className="mt-auto w-full py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <GitCommit className="w-4 h-4" />
            Trace Defect Lineage
          </button>
        </div>

        {/* Gemini Root Cause Analysis Details */}
        <div className="rounded-xl bg-theme-card border border-theme-border p-5 space-y-4 flex flex-col shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-theme-text">AI Accuracy Metrics</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              High Confidence
            </span>
          </div>

          <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/20 p-4 flex-1 space-y-2">
            <p className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider">Causal Analysis Summary</p>
            <p className="text-xs text-slate-200 leading-relaxed">
              BC-07 is isolated as the single probable defect origin because torque (132.4 Nm) and vibration (0.62 g) exceed 4.2σ thresholds simultaneously across recent production runs.
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-theme-muted font-mono border-t border-theme-border pt-3">
            <div className="flex justify-between"><span>Lineage Top-1 Accuracy:</span><strong className="text-emerald-400">88.2%</strong></div>
            <div className="flex justify-between"><span>Control Threshold Exceeded:</span><strong className="text-rose-400">4.2σ</strong></div>
          </div>
        </div>
      </div>

      {/* Backward Trace Lineage Diagram */}
      <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-theme-border flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-theme-text">Backward Lineage Graph</h3>
            <span className="text-[11px] font-mono text-indigo-400">Vehicle #{quality_vehicle?.unit_id || 1842}</span>
          </div>
          <span className="text-[11px] text-theme-muted font-mono">Final Inspection → Root Origin Station</span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          {lineagePath.map((st, idx) => (
            <div
              key={st.id}
              className={`p-4 rounded-xl border transition-all ${
                st.flag
                  ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/30'
                  : 'border-theme-border bg-theme-bg'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-theme-muted font-mono">Step {idx + 1}</span>
                {idx > 0 && <ArrowLeft className="w-3.5 h-3.5 text-theme-muted" />}
              </div>
              <p className={`font-mono font-bold text-sm ${st.flag ? 'text-rose-400' : 'text-indigo-400'}`}>{st.id}</p>
              <p className="text-xs text-theme-text mt-0.5 font-medium">{st.name}</p>
              <p className={`text-[10px] mt-2 ${st.flag ? 'text-rose-400 font-bold' : 'text-theme-muted'}`}>{st.status}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
