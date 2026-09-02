import React, { useState } from 'react';
import { Radar, Zap, Wrench, CheckCircle2, Cpu, Flame, RefreshCw, FileText, ArrowRight, Filter } from 'lucide-react';
import ThinkingMachine from './ThinkingMachine';

export default function AiRadarView({ stationStatuses = [] }) {
  const [selectedStationId, setSelectedStationId] = useState('BC-10');
  const [injectedAnomaly, setInjectedAnomaly]     = useState(null);
  const [workOrderDispatched, setDispatched]       = useState(false);
  const [phaseFilter, setPhaseFilter]             = useState('all');

  const defaultStations = [
    { id: 'BC-01', name: 'Stamping Line A', phase: 'Body Construction', health: 94, rulHours: 142.5, vibration: '0.12g', temp: '42°C', torque: '118Nm', status: 'optimal' },
    { id: 'BC-07', name: 'Welding Cell 3', phase: 'Body Construction', health: 62, rulHours: 18.4, vibration: '0.45g', temp: '58°C', torque: '132Nm', status: 'warning' },
    { id: 'BC-10', name: 'Chassis Alignment', phase: 'Body Construction', health: 41, rulHours: 4.8, vibration: '0.78g', temp: '69°C', torque: '145Nm', status: 'critical' },
    { id: 'PT-05', name: 'Clearcoat Spray 2', phase: 'Paint', health: 88, rulHours: 96.0, vibration: '0.18g', temp: '48°C', torque: '120Nm', status: 'optimal' },
    { id: 'PT-07', name: 'Oven Bake Tunnel', phase: 'Paint', health: 58, rulHours: 14.2, vibration: '0.52g', temp: '185°C', torque: '124Nm', status: 'warning' },
    { id: 'FA-12', name: 'Engine Marriage', phase: 'Final Assembly', health: 91, rulHours: 110.0, vibration: '0.15g', temp: '44°C', torque: '119Nm', status: 'optimal' },
    { id: 'FA-16', name: 'Final QA Inspection', phase: 'Final Assembly', health: 96, rulHours: 160.0, vibration: '0.10g', temp: '40°C', torque: '115Nm', status: 'optimal' }
  ];

  const filteredStations = defaultStations.filter(s => {
    if (phaseFilter === 'all') return true;
    if (phaseFilter === 'bc') return s.phase === 'Body Construction';
    if (phaseFilter === 'pt') return s.phase === 'Paint';
    if (phaseFilter === 'fa') return s.phase === 'Final Assembly';
    return true;
  });

  const currentStation = defaultStations.find(s => s.id === selectedStationId) || defaultStations[2];

  let activeHealth = currentStation.health;
  let activeRul = currentStation.rulHours;
  let activeVibration = currentStation.vibration;
  let activeTemp = currentStation.temp;
  let activeTorque = currentStation.torque;

  if (injectedAnomaly === 'thermal') {
    activeHealth = 28;
    activeRul = 1.5;
    activeTemp = '92°C (OVERHEAT)';
  } else if (injectedAnomaly === 'vibration') {
    activeHealth = 32;
    activeRul = 2.1;
    activeVibration = '1.15g (SPIKE)';
  } else if (injectedAnomaly === 'torque') {
    activeHealth = 38;
    activeRul = 3.4;
    activeTorque = '158Nm (DRIFT)';
  }

  const handleInject = (type) => {
    setInjectedAnomaly(type);
    setDispatched(false);
  };

  const handleClearAnomaly = () => {
    setInjectedAnomaly(null);
    setDispatched(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-3">
        <div>
          <h2 className="text-base font-semibold text-theme-text flex items-center gap-2">
            <Radar className="w-4.5 h-4.5 text-indigo-400" />
            AI Anomaly & Prescriptive Maintenance Studio
          </h2>
          <p className="text-xs text-theme-muted mt-0.5">
            Physics-informed health index, RUL forecasting, and automated CMMS work order generation
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left Column: Filtered RUL Station List */}
        <div className="lg:col-span-1 rounded-xl bg-theme-card border border-theme-border p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-theme-border pb-2">
            <h3 className="text-xs font-semibold text-theme-text uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Equipment RUL Matrix
            </h3>
            <span className="text-[10px] font-mono text-theme-muted">{filteredStations.length} Stations</span>
          </div>

          {/* Phase Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            {[
              { id: 'all', label: 'All' },
              { id: 'bc', label: 'Body' },
              { id: 'pt', label: 'Paint' },
              { id: 'fa', label: 'Assembly' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setPhaseFilter(f.id)}
                type="button"
                className={`flex-1 py-1 rounded transition-colors text-center ${
                  phaseFilter === f.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredStations.map(st => {
              const isSelected = selectedStationId === st.id;
              const isCrit = st.status === 'critical';
              const isWarn = st.status === 'warning';

              return (
                <div
                  key={st.id}
                  onClick={() => { setSelectedStationId(st.id); setInjectedAnomaly(null); setDispatched(false); }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                      : 'bg-theme-bg border-theme-border hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-theme-text">{st.id} — {st.name}</span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isCrit ? 'bg-rose-500/20 text-rose-300' : isWarn ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {isCrit ? 'CRITICAL' : isWarn ? 'WARN' : 'OK'}
                    </span>
                  </div>

                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full ${
                        st.health < 50 ? 'bg-rose-500' : st.health < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${st.health}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-theme-muted">
                    <span>Health: <strong className="text-theme-text">{st.health}%</strong></span>
                    <span>RUL: <strong className={isCrit ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{st.rulHours} hrs</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Anomaly Sandbox & CMMS Work Order Studio */}
        <div className="lg:col-span-2 space-y-3">

          {/* Injector Sandbox */}
          <div className="rounded-xl bg-slate-900 border border-indigo-500/30 p-3.5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Judges' Anomaly Injector — <strong className="text-indigo-300 font-mono">{currentStation.id}</strong>
              </span>
              {injectedAnomaly && (
                <button onClick={handleClearAnomaly} type="button" className="text-[10px] font-mono text-slate-400 hover:text-slate-200 underline">
                  Clear Anomaly
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleInject('thermal')}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  injectedAnomaly === 'thermal' ? 'bg-rose-600 text-white font-bold' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}
              >
                <Flame className="w-3 h-3 text-rose-400" /> Overheat (+18°C)
              </button>

              <button
                onClick={() => handleInject('vibration')}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  injectedAnomaly === 'vibration' ? 'bg-amber-600 text-white font-bold' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" /> Vibration (+0.85g)
              </button>

              <button
                onClick={() => handleInject('torque')}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  injectedAnomaly === 'torque' ? 'bg-indigo-600 text-white font-bold' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                <Wrench className="w-3 h-3 text-indigo-400" /> Torque (+15Nm)
              </button>
            </div>
          </div>

          {/* Telemetry Envelope */}
          <div className="rounded-xl bg-theme-card border border-theme-border p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-theme-border pb-2 text-xs">
              <span className="font-semibold text-theme-text">Diagnostics Envelope — {currentStation.id} ({currentStation.name})</span>
              <span className="font-mono text-indigo-400 font-bold">RUL: {activeRul} hrs</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border">
                <span className="text-[9px] text-theme-muted uppercase font-mono block">Health Index</span>
                <span className={`font-mono font-bold ${activeHealth < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{activeHealth}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border">
                <span className="text-[9px] text-theme-muted uppercase font-mono block">Vibration</span>
                <span className="font-mono font-bold text-slate-200">{activeVibration}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border">
                <span className="text-[9px] text-theme-muted uppercase font-mono block">Thermal</span>
                <span className="font-mono font-bold text-slate-200">{activeTemp}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-theme-bg border border-theme-border">
                <span className="text-[9px] text-theme-muted uppercase font-mono block">Torque</span>
                <span className="font-mono font-bold text-slate-200">{activeTorque}</span>
              </div>
            </div>

            <ThinkingMachine
              title="Gemini AI Prescriptive Diagnostics Engine"
              subTitle={`Analyzed telemetry envelope for ${currentStation.id}`}
              autoExpand={false}
              finalConclusion={`Physics-informed model predicts equipment breakdown within ${activeRul} hours. Automated CMMS Work Order generated.`}
            />
          </div>

          {/* Work Order Card */}
          <div className="rounded-xl bg-slate-950 border border-indigo-500/30 p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2 text-xs">
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                Prescriptive Work Order — <span className="font-mono text-indigo-300">#WO-2026-8942</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Auto-Generated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 font-mono uppercase block">Target Equipment</span>
                <span className="font-semibold text-slate-200">{currentStation.id} Servo Drive & Bearing</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 font-mono uppercase block">Prescribed Part</span>
                <span className="font-semibold text-indigo-300">SKF-6205-2RS Bearing (Qty: 1)</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              {workOrderDispatched ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Work Order #WO-2026-8942 Dispatched to Factory CMMS!
                </div>
              ) : (
                <button
                  onClick={() => setDispatched(true)}
                  type="button"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Wrench className="w-3.5 h-3.5" /> Auto-Dispatch Work Order to CMMS
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
