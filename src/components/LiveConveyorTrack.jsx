import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Waves, Zap, ShieldAlert } from 'lucide-react';

/**
 * LiveConveyorTrack — animated material-flow visualizer with Propagation Heatmap Mode.
 * Displays live vehicle movement across 38 stations, backpressure wave propagation, and starvation risks.
 */
export default function LiveConveyorTrack({ stationStatuses, activeAlerts, latestUnitId, onInspectUnit }) {
  const [isPlaying, setIsPlaying]         = useState(true);
  const [currentStationIdx, setIdx]       = useState(0);
  const [currentUnit, setCurrentUnit]     = useState(1);
  const [speed, setSpeed]                 = useState(1);
  const [showHeatmap, setShowHeatmap]     = useState(false);

  const totalStations = stationStatuses?.length || 0;

  useEffect(() => {
    if (!isPlaying || totalStations === 0) return;
    const ms = Math.max(200, 1200 / speed);
    const t  = setInterval(() => {
      setIdx(prev => {
        if (prev >= totalStations - 1) {
          setCurrentUnit(u => (u >= latestUnitId ? 1 : u + 1));
          return 0;
        }
        return prev + 1;
      });
    }, ms);
    return () => clearInterval(t);
  }, [isPlaying, speed, totalStations, latestUnitId]);

  if (!stationStatuses || totalStations === 0) return null;

  const current     = stationStatuses[currentStationIdx];
  const isRed       = current?.status === 'red';
  const isAmber     = current?.status === 'amber';
  const progress    = (currentStationIdx / (totalStations - 1)) * 100;

  // Find primary bottleneck station index for heatmap wave calculation
  const bottleneckIdx = stationStatuses.findIndex(s => s.status === 'red' || s.id === 'BC-10');

  return (
    <div className="rounded-xl bg-theme-card border border-theme-border shadow-md transition-all">

      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-theme-border gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h2 className="text-sm font-semibold text-theme-text">Live Material Conveyor</h2>
          <span className="text-xs text-theme-muted flex items-center gap-1.5 ml-2 font-mono">
            Unit <span className="font-bold text-indigo-400">#{currentUnit}</span> at <span className="font-semibold text-theme-text">{current?.id}</span>
          </span>
        </div>

        {/* Playback & Heatmap Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Propagation Heatmap Toggle Button */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
              showHeatmap
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold ring-1 ring-rose-500/30'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Waves className={`w-3.5 h-3.5 ${showHeatmap ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            {showHeatmap ? 'Propagation Heatmap: ACTIVE' : 'Toggle Propagation Heatmap'}
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-0.5 bg-theme-bg border border-theme-border rounded-lg p-1">
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                type="button"
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                  speed === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-text'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(p => !p)}
            type="button"
            className={`p-1.5 rounded-lg border transition-colors ${
              isPlaying
                ? 'border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-bg'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
            }`}
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => { setIdx(0); setCurrentUnit(1); }}
            type="button"
            className="p-1.5 rounded-lg border border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-bg transition-colors"
            title="Reset conveyor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Heatmap Banner Notification */}
      {showHeatmap && (
        <div className="px-5 py-2.5 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between text-xs text-rose-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse" />
            <span>
              <strong className="font-mono text-rose-300 uppercase">Propagation Analysis Active:</strong> Upstream stations experiencing <strong className="text-amber-300 font-mono">Backpressure Queue Waves (S3 ➔ S2)</strong> · Downstream stations experiencing <strong className="text-sky-300 font-mono">Part Starvation Risks</strong>.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 text-rose-300">
            PPT Model Alignment
          </span>
        </div>
      )}

      {/* Alert Strip (shown when current station is critical/warning) */}
      {!showHeatmap && (isRed || isAmber) && (
        <div className={`px-5 py-2 flex items-center justify-between text-xs transition-colors ${
          isRed
            ? 'bg-rose-500/10 border-b border-rose-500/20 text-rose-300'
            : 'bg-amber-500/10 border-b border-amber-500/20 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong className="font-mono">{current.id}</strong> ({current.name}) —{' '}
              {isRed
                ? `Cycle time ${current.current_cycle_time}s exceeds 58s takt target. Critical bottleneck.`
                : `Cycle time ${current.current_cycle_time}s drifting vs ${current.baseline_mean}s baseline.`
              }
            </span>
          </div>
          {isRed && (
            <button
              onClick={() => onInspectUnit(currentUnit)}
              type="button"
              className="text-[10px] font-semibold px-2.5 py-1 rounded bg-rose-600 text-white hover:bg-rose-500 transition-colors flex-shrink-0 ml-4 shadow-sm"
            >
              Inspect Unit #{currentUnit}
            </button>
          )}
        </div>
      )}

      {/* Animated Track Container (OVERFLOW VISIBLE SO TOOLTIPS ARE NEVER CLIPPED) */}
      <div className="px-6 pt-10 pb-10 relative bg-theme-bg/60 rounded-b-xl overflow-visible">

        {/* Rail track base */}
        <div className="absolute top-12 left-8 right-8 h-1 bg-slate-800 rounded-full" />
        
        {/* Rail progress fill */}
        <div
          className="absolute top-12 left-8 h-1 rounded-full transition-all duration-300"
          style={{
            width: `calc(${progress}% * 0.92)`,
            background: isRed
              ? 'linear-gradient(to right, #6366f1, #f43f5e)'
              : 'linear-gradient(to right, #6366f1, #10b981)'
          }}
        />

        {/* Vehicle Token */}
        <div
          className="absolute top-12 -translate-y-1/2 z-20 transition-all duration-300"
          style={{ left: `calc(2rem + ${(progress / 100) * 88}%)` }}
        >
          <div className="relative -translate-x-1/2">
            {isRed && (
              <div className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping" />
            )}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg border transition-all duration-200 ${
              isRed
                ? 'bg-rose-600 border-rose-400 text-white'
                : isAmber
                ? 'bg-amber-600 border-amber-400 text-white'
                : 'bg-indigo-600 border-indigo-400 text-white'
            }`}>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow">
              #{currentUnit}
            </div>
          </div>
        </div>

        {/* Station Waypoint Dots & Heatmap Wave Indicators */}
        <div className="relative z-10 flex justify-between items-center">
          {stationStatuses.map((st, idx) => {
            const isActive  = idx === currentStationIdx;
            const isPassed  = idx < currentStationIdx;
            const stRed     = st.status === 'red';
            const stAmber   = st.status === 'amber';
            const showLabel = idx === 0 || idx === totalStations - 1 || idx % 5 === 0 || stRed;

            // Heatmap propagation logic: upstream backpressure vs downstream starvation
            const isUpstreamWave = showHeatmap && bottleneckIdx !== -1 && idx < bottleneckIdx && idx >= bottleneckIdx - 3;
            const isDownstreamStarved = showHeatmap && bottleneckIdx !== -1 && idx > bottleneckIdx && idx <= bottleneckIdx + 4;

            return (
              <div
                key={st.id}
                onClick={() => setIdx(idx)}
                className="relative flex flex-col items-center cursor-pointer group"
              >
                {/* Station Dot */}
                <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                  isActive
                    ? stRed
                      ? 'bg-rose-500 border-white ring-4 ring-rose-500/40 scale-125'
                      : 'bg-indigo-500 border-white ring-4 ring-indigo-500/40 scale-125'
                    : isUpstreamWave
                    ? 'bg-amber-500 border-amber-300 ring-2 ring-amber-500/50 animate-pulse'
                    : isDownstreamStarved
                    ? 'bg-sky-500 border-sky-300 ring-2 ring-sky-500/50'
                    : stRed
                    ? 'bg-rose-500 border-rose-300'
                    : stAmber
                    ? 'bg-amber-500 border-amber-300'
                    : isPassed
                    ? 'bg-emerald-500 border-emerald-300'
                    : 'bg-slate-800 border-slate-700'
                }`} />

                {/* Heatmap Wave Tag (shown when Heatmap mode is ACTIVE) */}
                {isUpstreamWave && (
                  <span className="absolute -top-7 font-mono text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.5 rounded whitespace-nowrap shadow-sm animate-pulse">
                    Backpressure ↑
                  </span>
                )}
                {isDownstreamStarved && (
                  <span className="absolute -top-7 font-mono text-[8px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 px-1 py-0.5 rounded whitespace-nowrap shadow-sm">
                    Starved 🛑
                  </span>
                )}

                {/* Station Label */}
                {showLabel && (
                  <span className={`absolute top-6 font-mono text-[9px] font-semibold whitespace-nowrap ${
                    isActive ? 'text-indigo-400 font-bold' : stRed ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {st.id}
                  </span>
                )}

                {/* SAFE TOOLTIP POSITIONED DOWNWARDS (top-7) SO IT NEVER GETS HIDDEN UNDER CONTAINER UPPER BORDER */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 w-48 p-2.5 rounded-xl bg-slate-900/95 text-slate-100 text-[11px] shadow-2xl border border-slate-700 backdrop-blur-md pointer-events-none transition-all">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                    <span className="font-mono font-bold text-indigo-400">{st.id}</span>
                    <span className={`text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded ${
                      stRed ? 'bg-rose-500/20 text-rose-300' : stAmber ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {st.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-tight mb-1.5">{st.name}</p>
                  <div className="text-[10px] space-y-0.5 font-mono text-slate-400">
                    <div className="flex justify-between"><span>Cycle time:</span><span className="text-slate-200 font-semibold">{st.current_cycle_time}s</span></div>
                    <div className="flex justify-between"><span>Baseline:</span><span>{st.baseline_mean}s</span></div>
                    <div className="flex justify-between"><span>Queue depth:</span><span className="text-amber-400">{st.queue} units</span></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase Zone Labels */}
        <div className="flex justify-between mt-10 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>Body Construction</span>
          <span>Paint</span>
          <span>Final Assembly</span>
        </div>
      </div>

      {/* Live Telemetry HUD Bar */}
      <div className="px-5 py-3.5 border-t border-theme-border grid grid-cols-2 sm:grid-cols-4 gap-4 bg-theme-card rounded-b-xl">
        <div>
          <p className="text-[10px] text-theme-muted uppercase tracking-wider">Selected Station</p>
          <p className="font-mono text-xs font-bold text-indigo-400 truncate mt-0.5">{current?.id} — {current?.name}</p>
          <p className="text-[10px] text-theme-muted truncate">{current?.phase}</p>
        </div>

        <div>
          <p className="text-[10px] text-theme-muted uppercase tracking-wider">Cycle Time vs Baseline</p>
          <p className={`font-mono text-sm font-bold mt-0.5 ${
            isRed ? 'text-rose-400' : isAmber ? 'text-amber-400' : 'text-slate-200'
          }`}>
            {current?.current_cycle_time}s <span className="text-[10px] text-theme-muted font-normal">(baseline {current?.baseline_mean}s)</span>
          </p>
        </div>

        <div>
          <p className="text-[10px] text-theme-muted uppercase tracking-wider">Sensor Tier</p>
          <p className={`text-xs font-semibold mt-0.5 ${
            current?.sensor_tier === 'checklist_only' ? 'text-indigo-400' : 'text-emerald-400'
          }`}>
            {current?.sensor_tier === 'checklist_only' ? 'Soft-Sensor Inferred' : 'Full Sensor Hardware'}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-theme-muted uppercase tracking-wider">Live Readings</p>
          {current?.sensor_tier === 'full' && current?.latest_readings ? (
            <p className="font-mono text-[11px] font-semibold text-slate-200 mt-0.5">
              {current.latest_readings.vibration}g · {current.latest_readings.temperature}°C · {current.latest_readings.torque}Nm
            </p>
          ) : (
            <button
              onClick={() => onInspectUnit(currentUnit)}
              type="button"
              className="mt-0.5 text-[10px] text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              Trace unit #{currentUnit} telemetry →
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
