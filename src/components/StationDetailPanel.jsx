import React from 'react';
import SoftSensorBadge from './SoftSensorBadge';
import { Cpu, ShieldAlert, ArrowRight, X, Sliders, Activity } from 'lucide-react';

export default function StationDetailPanel({ station, onClose, onInspectUnit, onOpenWhatIf }) {
  if (!station) return null;

  const { id, name, phase, sensor_tier, current_cycle_time, baseline_mean, status, queue, soft_sensor_data, latest_readings } = station;
  const isBottleneck = status === 'red';
  const isWarning   = status === 'amber';

  const taktTarget = 58;
  const overTakt   = current_cycle_time - taktTarget;
  const overBase   = current_cycle_time - baseline_mean;

  const trajectory = [
    Math.round(baseline_mean),
    Math.round(baseline_mean + 2),
    Math.round(baseline_mean + 4),
    Math.round(current_cycle_time)
  ];

  const riskPct  = isBottleneck ? 91 : isWarning ? 64 : 12;
  const riskColor = isBottleneck ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400';
  const riskBg    = isBottleneck ? 'bg-rose-500/10 border-rose-500/30' : isWarning ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30';

  const maxVal = Math.max(...trajectory) + 2;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl overflow-hidden animate-slide-left flex flex-col glass-panel">

      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-800 flex-shrink-0 bg-slate-950/60">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-indigo-400">{id}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
              sensor_tier === 'checklist_only'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {sensor_tier === 'checklist_only' ? 'Soft-Sensor' : 'Full Sensor Hardware'}
            </span>
          </div>
          <h2 className="text-base font-semibold text-slate-100 leading-snug">{name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{phase}</p>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="ml-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">

        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Current Cycle Time</p>
            <p className={`font-mono text-2xl font-bold mt-1 ${
              isBottleneck ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-100'
            }`}>{current_cycle_time}s</p>
            <p className="text-[10px] text-slate-400 mt-1">Takt {taktTarget}s · <span className={overTakt > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
              {overTakt > 0 ? `+${overTakt}s over target` : 'On target'}
            </span></p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Queue Depth</p>
            <p className={`font-mono text-2xl font-bold mt-1 ${queue > 10 ? 'text-rose-400' : 'text-slate-100'}`}>{queue}</p>
            <p className="text-[10px] text-slate-400 mt-1">units waiting</p>
          </div>
        </div>

        {/* Bottleneck Risk Gauge */}
        <div className={`p-4 rounded-xl border ${riskBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className={`w-4 h-4 ${riskColor}`} />
              <p className={`text-xs font-semibold ${riskColor}`}>Bottleneck Risk Probability</p>
            </div>
            <span className={`font-mono text-xl font-bold ${riskColor}`}>{riskPct}%</span>
          </div>
          <div className="mt-2 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                riskPct >= 75 ? 'bg-rose-500' : riskPct >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${riskPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-300 mt-2 font-mono">
            {isBottleneck ? 'Predicted constraint ETA: 11 minutes' : 'Within normal operational control range'}
          </p>
        </div>

        {/* Cycle time trend */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Cycle Time Trend Trajectory</p>
          <div className="space-y-2">
            {trajectory.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400 w-12 flex-shrink-0 text-right">T-{trajectory.length - 1 - idx}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      idx === trajectory.length - 1
                        ? isBottleneck ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${(val / maxVal) * 100}%` }}
                  />
                </div>
                <span className={`font-mono text-[10px] font-bold w-8 flex-shrink-0 ${
                  idx === trajectory.length - 1
                    ? isBottleneck ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-indigo-400'
                    : 'text-slate-400'
                }`}>{val}s</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Baseline: {baseline_mean}s · Drift: +{overBase.toFixed(1)}s</p>
        </div>

        {/* Telemetry Signals */}
        {sensor_tier === 'full' && latest_readings && (
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            {[
              { label: 'Vibration', val: `${latest_readings.vibration}g` },
              { label: 'Temperature', val: `${latest_readings.temperature}°C` },
              { label: 'Torque', val: `${latest_readings.torque}Nm` }
            ].map(r => (
              <div key={r.label} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <p className="text-slate-400 text-[10px]">{r.label}</p>
                <p className="font-mono font-bold text-slate-200 mt-0.5">{r.val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quality Risk Trace */}
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <p className="text-xs font-semibold text-slate-100">Quality Defect Origin Trace</p>
            </div>
            <span className="font-mono text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">18% defect risk</span>
          </div>

          <div>
            <p className="text-[11px] text-slate-200 font-medium">Vehicle #1842</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Probable origin: <span className="font-mono text-indigo-400 font-bold">BC-07 (Torque Fastening A)</span></p>
          </div>

          <button
            onClick={() => onInspectUnit(1842)}
            type="button"
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30 transition-colors"
          >
            Trace Defect Origin Graph
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Soft sensor inference */}
        {soft_sensor_data && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <p className="text-xs font-semibold text-slate-100">Virtual Soft-Sensor Inference</p>
            </div>
            <SoftSensorBadge softSensorData={soft_sensor_data} />
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono mt-1">{soft_sensor_data.source}</p>
          </div>
        )}

      </div>

      {/* Sticky Drawer Footer */}
      <div className="flex-shrink-0 p-4 border-t border-slate-800 bg-slate-950">
        <button
          onClick={onOpenWhatIf}
          type="button"
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Sliders className="w-4 h-4" />
          Simulate What-If for {id}
        </button>
      </div>

    </div>
  );
}
