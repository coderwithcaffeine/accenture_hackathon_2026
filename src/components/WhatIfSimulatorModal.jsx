import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, XCircle, Users, Wrench, ChevronRight, Sparkles } from 'lucide-react';
import ThinkingMachine from './ThinkingMachine';
import AiProcessAssistant from './AiProcessAssistant';

export default function WhatIfSimulatorModal({ onClose, onApproveIntervention }) {
  const [selectedScenario, setSelectedScenario] = useState('slowdown_10');
  const [selectedOption, setSelectedOption]     = useState('B');
  const [loading, setLoading]                   = useState(false);
  const [approvedSuccess, setApprovedSuccess]   = useState(false);
  const [showThinkingTrace, setShowThinkingTrace] = useState(true);

  const scenarios = [
    { id: 'slowdown_10',  label: 'BC-10 slows 10%',         detail: 'Gradual cycle time increase' },
    { id: 'slowdown_20',  label: 'BC-10 slows 20%',         detail: 'Moderate production impact' },
    { id: 'stoppage_10m', label: 'BC-10 fails 10 min',      detail: 'Full station outage' },
    { id: 'rate_reduction', label: 'Cut upstream rate 15%', detail: 'Reduce feed rate' }
  ];

  const propagation = {
    slowdown_10:   { queue: '+19', throughput: '−18%', defectRisk: '+5%',  loss: '₹2.8L', usd: '$3,400' },
    slowdown_20:   { queue: '+32', throughput: '−34%', defectRisk: '+12%', loss: '₹5.2L', usd: '$6,300' },
    stoppage_10m:  { queue: '+48', throughput: '−55%', defectRisk: '+22%', loss: '₹8.9L', usd: '$10,800' },
    rate_reduction:{ queue: '+6',  throughput: '−10%', defectRisk: '+1%',  loss: '₹1.2L', usd: '$1,450' }
  }[selectedScenario];

  const sc = scenarios.find(s => s.id === selectedScenario);

  const options = [
    { id: 'A', title: 'Do nothing',          detail: 'Allow drift to propagate',              loss: propagation.loss, recovery: '45 min', queue: propagation.queue, recommended: false, icon: XCircle },
    { id: 'B', title: 'Move 1 operator',     detail: 'Reallocate floating technician to BC-10', loss: '₹0.9L',         recovery: '12 min', queue: '+4',             recommended: true,  reduction: '68%', icon: Users },
    { id: 'C', title: 'Schedule maintenance',detail: '15-min quick maintenance protocol',      loss: '₹1.4L',         recovery: '25 min', queue: '+8',             recommended: false, reduction: '50%', icon: Wrench }
  ];

  const handleApprove = () => {
    setLoading(true);
    fetch('/api/approve-intervention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stationId: 'BC-10', optionId: selectedOption })
    })
      .then(r => r.json())
      .then(data => {
        setLoading(false);
        setApprovedSuccess(true);
        setTimeout(() => { onApproveIntervention(data.updatedDashboard); onClose(); }, 1500);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0 bg-slate-950/50">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              What-If Simulator & AI Decision Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Model assembly line disruptions virtually before changing the physical line</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {approvedSuccess ? (
            <div className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-100">Intervention Deployed to Twin</h4>
              <p className="text-sm text-slate-400 max-w-md">
                Option {selectedOption} approved by human supervisor. Floating technician reallocated to BC-10. Digital twin state updated.
              </p>
            </div>
          ) : (
            <>
              {/* Scenario Picker + Impact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">

                {/* Scenario picker */}
                <div className="sm:col-span-2 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/50">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Disruption Scenario</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {scenarios.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedScenario(s.id)}
                        type="button"
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between gap-2 transition-colors ${
                          selectedScenario === s.id
                            ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-medium">{s.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{s.detail}</p>
                        </div>
                        {selectedScenario === s.id && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Impact metrics */}
                <div className="sm:col-span-3 space-y-3">
                  <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/50">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Simulated Impact — {sc.label}</p>
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-2">
                      {[
                        { label: 'Queue Growth', val: propagation.queue,      color: 'text-amber-400' },
                        { label: 'Throughput Impact', val: propagation.throughput, color: 'text-rose-400' },
                        { label: 'Defect Risk', val: propagation.defectRisk, color: 'text-rose-400' },
                        { label: 'Est. Loss', val: `${propagation.loss} (${propagation.usd})`, color: 'text-indigo-400' },
                      ].map(item => (
                        <div key={item.label} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                          <p className="text-[10px] text-slate-400">{item.label}</p>
                          <p className={`font-mono text-sm font-bold mt-0.5 ${item.color}`}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Thinking Machine Stream */}
              <ThinkingMachine
                title="AI Scenario Evaluator"
                subTitle={`Analyzing ${sc.label} discrete-event propagation`}
                autoExpand={showThinkingTrace}
                finalConclusion={`Scenario modeling indicates Option B (Move 1 operator) delivers the optimal trade-off: reduces queue propagation by 68% without incurring planned maintenance downtime.`}
              />

              {/* Interactive AI Process Assistant Query Box */}
              <AiProcessAssistant
                currentScenario={sc.label}
                propagationData={{ queue: propagation.queue, throughput: propagation.throughput, lossInr: propagation.loss }}
                selectedOption={selectedOption}
              />

              {/* Response Options */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Intervention Options</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {options.map(opt => {
                    const isSelected = selectedOption === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-950/20'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-4 h-4 ${opt.recommended ? 'text-emerald-400' : 'text-slate-400'}`} />
                            <span className="text-xs font-bold text-slate-100">Option {opt.id}</span>
                          </div>

                          {opt.recommended && (
                            <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Recommended
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-medium text-indigo-300 mb-1">{opt.title}</p>
                        <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">{opt.detail}</p>
                        
                        <div className="space-y-1 text-[11px] font-mono border-t border-slate-800 pt-2 text-slate-300">
                          <div className="flex justify-between"><span className="text-slate-400 font-sans">Loss</span><span className="font-semibold text-slate-200">{opt.loss}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400 font-sans">Recovery</span><span>{opt.recovery}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400 font-sans">Queue</span><span>{opt.queue} units</span></div>
                          {opt.reduction && (
                            <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-slate-800/80">
                              <span className="font-sans">Loss Saved</span><span>{opt.reduction}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Human-in-the-Loop Gate */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    Human-in-the-Loop Decision Gate
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    AI recommendation: <strong className="text-indigo-300">Option B (Move 1 operator to BC-10)</strong> — 68% loss reduction
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={onClose}
                    type="button"
                    className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    type="button"
                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {loading ? 'Deploying…' : `Approve Option ${selectedOption}`}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
