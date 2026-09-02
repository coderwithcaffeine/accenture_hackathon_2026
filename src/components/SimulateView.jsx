import React, { useState } from 'react';
import { Sliders, CheckCircle2, XCircle, Users, Wrench, ChevronRight, Sparkles, Zap, ShieldAlert, Cpu } from 'lucide-react';
import ThinkingMachine from './ThinkingMachine';
import AiProcessAssistant from './AiProcessAssistant';

export default function SimulateView({ onApproveIntervention }) {
  const [selectedStation, setSelectedStation] = useState('BC-10');
  const [disruptionSeverity, setDisruptionSeverity] = useState(50); // 0% to 100%
  const [selectedOption, setSelectedOption] = useState('B');
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);

  const stations = [
    'BC-01', 'BC-02', 'BC-03', 'BC-04', 'BC-05', 'BC-06', 'BC-07', 'BC-08', 'BC-09', 'BC-10', 'BC-11', 'BC-12', 'BC-13', 'BC-14',
    'PT-01', 'PT-02', 'PT-03', 'PT-04', 'PT-05', 'PT-06', 'PT-07', 'PT-08',
    'FA-01', 'FA-02', 'FA-03', 'FA-04', 'FA-05', 'FA-06', 'FA-07', 'FA-08', 'FA-09', 'FA-10', 'FA-11', 'FA-12', 'FA-13', 'FA-14', 'FA-15', 'FA-16'
  ];

  // Dynamic simulation impact calculation based on picked station & severity %
  const mult = disruptionSeverity / 50;
  const simulatedQueue = `+${Math.max(1, Math.round(19 * mult))}`;
  const simulatedThroughput = `−${Math.min(95, Math.round(18 * mult))}%`;
  const simulatedDefectRisk = `+${Math.min(50, Math.round(5 * mult))}%`;
  const lossAmountVal = (2.8 * mult).toFixed(1);
  const lossInr = `₹${lossAmountVal}L`;
  const lossUsd = `$${Math.round(3400 * mult).toLocaleString()}`;
  const recoveryTime = `${Math.round(12 * mult)} min`;

  const propagationData = {
    queue: simulatedQueue,
    throughput: simulatedThroughput,
    defectRisk: simulatedDefectRisk,
    lossInr: lossInr,
    lossUsd: lossUsd,
    recovery: recoveryTime
  };

  const options = [
    { id: 'A', title: 'Do nothing', detail: 'Allow station drift to propagate downstream', loss: lossInr, recovery: `${Math.round(45 * mult)} min`, queue: simulatedQueue, recommended: false, icon: XCircle },
    { id: 'B', title: 'Move 1 operator', detail: `Reallocate floating technician to ${selectedStation}`, loss: `₹${(lossAmountVal * 0.32).toFixed(1)}L`, recovery: `${Math.round(12 * mult)} min`, queue: `+${Math.max(1, Math.round(4 * mult))}`, recommended: true, reduction: '68%', icon: Users },
    { id: 'C', title: 'Schedule maintenance', detail: 'Initiate 15-min emergency maintenance protocol', loss: `₹${(lossAmountVal * 0.5).toFixed(1)}L`, recovery: `${Math.round(25 * mult)} min`, queue: `+${Math.max(2, Math.round(8 * mult))}`, recommended: false, reduction: '50%', icon: Wrench }
  ];

  const handleApprove = () => {
    setLoadingApprove(true);
    fetch('/api/approve-intervention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stationId: selectedStation, optionId: selectedOption })
    })
      .then(res => res.json())
      .then(data => {
        setLoadingApprove(false);
        setApprovedSuccess(true);
        setTimeout(() => { if (onApproveIntervention) onApproveIntervention(data.updatedDashboard); }, 1500);
      })
      .catch(() => setLoadingApprove(false));
  };

  if (approvedSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-theme-text">Intervention Deployed to Twin</h3>
        <p className="text-sm text-theme-muted max-w-md text-center">
          Option {selectedOption} approved. Floating technician reallocated to {selectedStation}. Digital twin state updated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-3">
        <div>
          <h2 className="text-base font-semibold text-theme-text flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-indigo-400" />
            What-If Digital Twin Simulator — Interactive Disruption Sandbox
          </h2>
          <p className="text-xs text-theme-muted mt-0.5">
            Model real-time assembly line bottlenecks virtually across all 38 stations before deploying OT changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-indigo-400" />
            Discrete-Event Engine
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
            PPT Model Architecture
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left Column: 38-Station Disruption Sandbox Controls */}
        <div className="lg:col-span-1 rounded-xl bg-theme-card border border-theme-border p-5 space-y-5 shadow-sm">
          <div>
            <h3 className="text-xs font-semibold text-theme-text uppercase tracking-wider flex items-center gap-1.5 border-b border-theme-border pb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              1. Target Station Selector
            </h3>
            <p className="text-[11px] text-theme-muted mt-1.5 mb-3">Choose any station across Body, Paint, or Assembly:</p>
            <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {stations.map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStation(st)}
                  type="button"
                  className={`px-2 py-1.5 rounded text-[11px] font-mono font-bold transition-all text-center ${
                    selectedStation === st
                      ? 'bg-indigo-600 text-white shadow-md border border-indigo-400'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Disruption Severity Slider */}
          <div className="space-y-2 border-t border-theme-border pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-theme-text flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                2. Slowdown Severity:
              </span>
              <span className="font-mono font-bold text-indigo-400 text-sm">{disruptionSeverity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={disruptionSeverity}
              onChange={e => setDisruptionSeverity(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-theme-muted font-mono">
              <span>10% (Minor Drift)</span>
              <span>50% (Moderate)</span>
              <span>100% (Full Stoppage)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-200 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Live Twin Sandbox Ready
            </p>
            <p className="text-slate-400 text-[10px]">
              Simulating <strong className="text-indigo-300">{selectedStation}</strong> at <strong className="text-rose-300">{disruptionSeverity}% slowdown</strong> across downstream dependencies.
            </p>
          </div>
        </div>

        {/* Right Column: Simulation Output, AI Assistant & Interventions */}
        <div className="lg:col-span-2 space-y-4">

          {/* Simulated Impact Output Grid */}
          <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-theme-border bg-slate-900/40 flex items-center justify-between">
              <p className="text-xs font-semibold text-theme-text flex items-center gap-2">
                Simulated Line Impact Output — Target: <span className="font-mono text-indigo-400 font-bold">{selectedStation}</span> ({disruptionSeverity}% Disruption)
              </p>
              <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                Live Dynamic Modeling
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Queue Growth', value: propagationData.queue, color: 'text-amber-400' },
                { label: 'Throughput Drop', value: propagationData.throughput, color: 'text-rose-400' },
                { label: 'Defect Risk', value: propagationData.defectRisk, color: 'text-rose-400' },
                { label: 'Est. Loss', value: propagationData.lossInr, color: 'text-indigo-400' },
                { label: 'Recovery Time', value: propagationData.recovery, color: 'text-emerald-400' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-theme-bg border border-theme-border">
                  <p className="text-[10px] text-theme-muted">{item.label}</p>
                  <p className={`font-mono text-base font-bold mt-0.5 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* AI Reasoning Stream */}
            <div className="mx-4 mb-4">
              <ThinkingMachine
                title="Gemini AI Simulation Reasoner"
                subTitle={`Evaluated ${selectedStation} (${disruptionSeverity}% slowdown) across 600 production units`}
                autoExpand={true}
                finalConclusion={`Disruption modeling indicates Option B (Move 1 operator to ${selectedStation}) delivers the optimal trade-off, mitigating 68% of total financial loss.`}
              />
            </div>
          </div>

          {/* Interactive AI Process Assistant Query Box */}
          <AiProcessAssistant
            currentScenario={`${selectedStation} slows ${disruptionSeverity}%`}
            propagationData={propagationData}
            selectedOption={selectedOption}
          />

          {/* Mitigation Option Cards */}
          <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-theme-border bg-slate-900/40">
              <p className="text-xs font-semibold text-theme-text">Plant Manager Mitigation Options</p>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {options.map(opt => {
                const isSelected = selectedOption === opt.id;
                const IconComp = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-950/20' : 'border-theme-border hover:border-slate-700 bg-theme-bg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <IconComp className={`w-4 h-4 ${opt.recommended ? 'text-emerald-400' : 'text-theme-muted'}`} />
                        <span className="text-xs font-bold text-theme-text">Option {opt.id}</span>
                      </div>
                      {opt.recommended && (
                        <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-indigo-300 mb-1">{opt.title}</p>
                    <p className="text-[10px] text-theme-muted mb-3 leading-relaxed">{opt.detail}</p>
                    <div className="space-y-1 text-[11px] font-mono border-t border-theme-border/60 pt-2 text-theme-text">
                      <div className="flex justify-between"><span className="text-theme-muted">Loss</span><span className="font-semibold">{opt.loss}</span></div>
                      <div className="flex justify-between"><span className="text-theme-muted">Recovery</span><span>{opt.recovery}</span></div>
                      {opt.reduction && (
                        <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-theme-border/40">
                          <span>Loss Saved</span><span>{opt.reduction}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Human-in-the-Loop Gate */}
            <div className="mx-4 mb-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-theme-text flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  Human-in-the-Loop Decision Gate
                </p>
                <p className="text-[11px] text-theme-muted mt-0.5">
                  AI Recommendation: <span className="font-semibold text-indigo-300">Move 1 operator to {selectedStation}</span> — 68% financial loss reduction
                </p>
              </div>
              <button
                onClick={handleApprove}
                disabled={loadingApprove}
                type="button"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loadingApprove ? 'Deploying…' : `Approve Option ${selectedOption}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
