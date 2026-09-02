import React, { useState } from 'react';
import { Sliders, CheckCircle2, XCircle, Users, Wrench, ChevronRight, Sparkles } from 'lucide-react';
import ThinkingMachine from './ThinkingMachine';
import AiProcessAssistant from './AiProcessAssistant';

export default function SimulateView({ onApproveIntervention }) {
  const [selectedScenario, setSelectedScenario] = useState('slowdown_10');
  const [selectedOption, setSelectedOption] = useState('B');
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);

  const scenarios = [
    { id: 'slowdown_10', label: 'BC-10 slows 10%', detail: 'Gradual cycle time increase' },
    { id: 'slowdown_20', label: 'BC-10 slows 20%', detail: 'Moderate production impact' },
    { id: 'stoppage_10m', label: 'BC-10 fails 10 min', detail: 'Full station outage' },
    { id: 'rate_reduction', label: 'Cut upstream rate 15%', detail: 'Reduce feed rate' },
    { id: 'schedule_maint', label: 'Schedule maintenance', detail: '15-min planned downtime' },
    { id: 'backup_capacity', label: 'Activate backup buffer', detail: 'Reduce constraint impact' }
  ];

  const propagationData = {
    slowdown_10: { queue: '+19', throughput: '−18%', defectRisk: '+5%', lossInr: '₹2.8L', lossUsd: '$3,400', recovery: '12 min' },
    slowdown_20: { queue: '+32', throughput: '−34%', defectRisk: '+12%', lossInr: '₹5.2L', lossUsd: '$6,300', recovery: '22 min' },
    stoppage_10m: { queue: '+48', throughput: '−55%', defectRisk: '+22%', lossInr: '₹8.9L', lossUsd: '$10,800', recovery: '45 min' },
    rate_reduction: { queue: '+6', throughput: '−10%', defectRisk: '+1%', lossInr: '₹1.2L', lossUsd: '$1,450', recovery: '8 min' },
    schedule_maint: { queue: '+8', throughput: '−12%', defectRisk: '+2%', lossInr: '₹1.4L', lossUsd: '$1,700', recovery: '25 min' },
    backup_capacity: { queue: '+3', throughput: '−4%', defectRisk: '+0%', lossInr: '₹0.4L', lossUsd: '$500', recovery: '5 min' }
  }[selectedScenario];

  const currentScenarioObj = scenarios.find(s => s.id === selectedScenario);

  const options = [
    { id: 'A', title: 'Do nothing', detail: 'Allow drift to propagate downstream', loss: propagationData.lossInr, recovery: '45 min', queue: propagationData.queue, recommended: false, icon: XCircle },
    { id: 'B', title: 'Move 1 operator', detail: 'Reallocate floating technician to BC-10', loss: '₹0.9L', recovery: '12 min', queue: '+4', recommended: true, reduction: '68%', icon: Users },
    { id: 'C', title: 'Schedule maintenance', detail: 'Initiate 15-min maintenance protocol', loss: '₹1.4L', recovery: '25 min', queue: '+8', recommended: false, reduction: '50%', icon: Wrench }
  ];

  const handleApprove = () => {
    setLoadingApprove(true);
    fetch('/api/approve-intervention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stationId: 'BC-10', optionId: selectedOption })
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
        <p className="text-sm text-theme-muted">Option {selectedOption} approved. Floating technician reallocated to BC-10. Line state updated.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-theme-text flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            What-If Digital Twin Simulator
          </h2>
          <p className="text-xs text-theme-muted mt-0.5">Simulate bottleneck propagation and test counter-measures virtually</p>
        </div>
        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          Discrete-event simulation engine
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Scenario picker */}
        <div className="lg:col-span-1 rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-theme-border bg-slate-900/40">
            <p className="text-xs font-semibold text-theme-text">Disruption Scenario</p>
          </div>
          <div className="p-2 space-y-1">
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                type="button"
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between gap-2 transition-colors ${
                  selectedScenario === sc.id
                    ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                    : 'text-theme-text hover:bg-theme-bg border border-transparent'
                }`}
              >
                <div>
                  <p className="text-xs font-medium">{sc.label}</p>
                  <p className="text-[10px] text-theme-muted mt-0.5">{sc.detail}</p>
                </div>
                {selectedScenario === sc.id && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Results + interventions */}
        <div className="lg:col-span-2 space-y-4">

          {/* Propagation output */}
          <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-theme-border bg-slate-900/40">
              <p className="text-xs font-semibold text-theme-text">Simulated Line Impact — {currentScenarioObj.label}</p>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Queue Growth', value: propagationData.queue, color: 'text-amber-400' },
                { label: 'Throughput', value: propagationData.throughput, color: 'text-rose-400' },
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

            {/* AI Thinking Machine Integration */}
            <div className="mx-4 mb-4">
              <ThinkingMachine
                title="Gemini AI Simulation Reasoner"
                subTitle={`Evaluated ${currentScenarioObj.label} across 600 production steps`}
                autoExpand={true}
                finalConclusion={`Scenario simulation predicts queue drift reaching +19 units within 12 minutes. Option B mitigates 68% of total financial loss.`}
              />
            </div>
          </div>

          {/* Interactive AI Process Assistant Query Box */}
          <AiProcessAssistant
            currentScenario={currentScenarioObj.label}
            propagationData={propagationData}
            selectedOption={selectedOption}
          />

          {/* Intervention options */}
          <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-theme-border bg-slate-900/40">
              <p className="text-xs font-semibold text-theme-text">Supervisor Mitigation Options</p>
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
                    <p className="text-xs font-medium text-indigo-400 mb-1">{opt.title}</p>
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

            {/* Human-in-the-Loop gate */}
            <div className="mx-4 mb-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-theme-text flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  Human-in-the-Loop Decision Gate
                </p>
                <p className="text-[11px] text-theme-muted mt-0.5">
                  AI recommends: <span className="font-semibold text-indigo-400">Move 1 operator to BC-10</span> — 68% loss reduction
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
