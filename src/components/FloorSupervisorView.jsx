import React, { useState } from 'react';
import LiveConveyorTrack from './LiveConveyorTrack';
import StationDetailPanel from './StationDetailPanel';
import AlertTimeline from './AlertTimeline';
import ThinkingMachine from './ThinkingMachine';
import { AlertTriangle, CheckCircle2, Layers, Search, Sliders, Activity, ShieldAlert } from 'lucide-react';

export default function FloorSupervisorView({ floorData, onInspectUnit, onOpenWhatIf }) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchUnitId, setSearchUnitId] = useState('');
  const [showThinkingTrace, setShowThinkingTrace] = useState(false);

  if (!floorData) return null;

  const { station_statuses, active_alerts, alert_timeline, latest_unit_id } = floorData;

  // Deduplicate active alerts by station_id to avoid redundant alert card spam
  const uniqueActiveAlerts = (active_alerts || []).reduce((acc, current) => {
    const x = acc.find(item => item.station_id === current.station_id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const phases = [
    { name: 'Body Construction', key: 'Body Construction', cols: 'grid-cols-2 sm:grid-cols-7' },
    { name: 'Paint', key: 'Paint', cols: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-8' },
    { name: 'Final Assembly', key: 'Final Assembly', cols: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-8' }
  ];

  const statusStyle = (status, isSelected) => {
    if (isSelected) return 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500 shadow-md';
    switch (status) {
      case 'red':    return 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500/70 hover:bg-rose-500/10';
      case 'amber':  return 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/70 hover:bg-amber-500/10';
      case 'gray':   return 'border-slate-800 bg-slate-900/40 opacity-60 hover:opacity-90';
      default:       return 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900';
    }
  };

  const statusDot = (status) => {
    const base = 'w-2 h-2 rounded-full flex-shrink-0';
    switch (status) {
      case 'red':   return <span className={`${base} bg-rose-500 animate-pulse`} />;
      case 'amber': return <span className={`${base} bg-amber-500`} />;
      case 'gray':  return <span className={`${base} bg-slate-500`} />;
      default:      return <span className={`${base} bg-emerald-500`} />;
    }
  };

  const handleUnitSearch = (e) => {
    e.preventDefault();
    if (searchUnitId) {
      const uId = parseInt(searchUnitId, 10);
      if (uId >= 1 && uId <= latest_unit_id) onInspectUnit(uId);
    }
  };

  return (
    <div className="space-y-5">

      {/* Animated Live Conveyor Track */}
      <LiveConveyorTrack
        stationStatuses={station_statuses}
        activeAlerts={active_alerts}
        latestUnitId={latest_unit_id}
        onInspectUnit={onInspectUnit}
      />

      {/* Section Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-theme-card p-3.5 rounded-xl border border-theme-border">
        <div>
          <h2 className="text-sm font-semibold text-theme-text flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Live Assembly Line Stations
          </h2>
          <p className="text-xs text-theme-muted mt-0.5">38 Stations · Select any station card to inspect real-time telemetry</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowThinkingTrace(!showThinkingTrace)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-xs font-medium hover:bg-indigo-500/20 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {showThinkingTrace ? 'Hide AI Reasoner' : 'View AI Reasoner Stream'}
          </button>

          <button
            onClick={onOpenWhatIf}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            What-If Simulator
          </button>

          <form onSubmit={handleUnitSearch} className="flex items-center gap-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-theme-muted" />
              <input
                type="number" min="1" max={latest_unit_id}
                placeholder={`Unit 1–${latest_unit_id}`}
                value={searchUnitId}
                onChange={e => setSearchUnitId(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 w-36"
              />
            </div>
            <button type="submit" className="px-3 py-1.5 rounded-lg border border-theme-border bg-theme-bg text-xs text-theme-text hover:border-indigo-500 transition-colors">
              Trace
            </button>
          </form>
        </div>
      </div>

      {/* Optional AI Thinking Machine Stream */}
      {showThinkingTrace && (
        <ThinkingMachine
          title="Floor Supervisor AI Reasoning Pipeline"
          subTitle="Live telemetry anomaly evaluation across 38 stations"
          autoExpand={true}
          finalConclusion="BC-10 cycle time drift (+18s over baseline) has reached constraint threshold. Floating technician reallocation recommended to maintain takt."
        />
      )}

      {/* 3-Phase Grid + Alerts Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Station Grid — 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          {phases.map((phase) => {
            const phaseStations = station_statuses.filter(st => st.phase === phase.key);
            const redCount = phaseStations.filter(s => s.status === 'red').length;
            const amberCount = phaseStations.filter(s => s.status === 'amber').length;

            return (
              <div key={phase.key} className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
                {/* Phase Header */}
                <div className="px-4 py-2.5 border-b border-theme-border flex items-center justify-between bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-semibold text-theme-text">{phase.name}</span>
                    <span className="text-[11px] text-theme-muted">({phaseStations.length} stations)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    {redCount > 0 && <span className="text-rose-400 font-semibold">{redCount} critical</span>}
                    {amberCount > 0 && <span className="text-amber-400 font-semibold">{amberCount} warning</span>}
                    {redCount === 0 && amberCount === 0 && <span className="text-emerald-400 font-medium">All nominal</span>}
                  </div>
                </div>

                {/* Station Cards Grid — FIXED COLUMNS FOR PERFECT ALIGNMENT (Paint has 8 cols so PT-08 fits on line 1) */}
                <div className={`p-3 grid ${phase.cols} gap-2`}>
                  {phaseStations.map((st) => {
                    const isSelected = selectedStation?.id === st.id;
                    const isChecklist = st.sensor_tier === 'checklist_only';

                    return (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStation(st)}
                        type="button"
                        className={`group relative p-2.5 rounded-xl border text-left transition-all duration-150 ${
                          statusStyle(st.status, isSelected)
                        }`}
                      >
                        {/* Station ID + status dot */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[11px] font-bold text-theme-text">{st.id}</span>
                          {statusDot(st.status)}
                        </div>

                        {/* Name */}
                        <p className="text-[10px] text-theme-muted leading-tight line-clamp-2 min-h-[1.5rem]">
                          {st.name}
                        </p>

                        {/* Cycle time */}
                        <div className="mt-2 pt-1.5 border-t border-theme-border/50 flex items-center justify-between">
                          <span className={`font-mono text-[11px] font-bold ${
                            st.status === 'red' ? 'text-rose-400' :
                            st.status === 'amber' ? 'text-amber-400' : 'text-slate-300'
                          }`}>{st.current_cycle_time}s</span>
                          {isChecklist && (
                            <span className="text-[9px] text-indigo-400 font-mono font-semibold bg-indigo-500/10 px-1 rounded">SOFT</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel: Alerts Sidebar + Timeline — 4 cols */}
        <div className="lg:col-span-4 space-y-4">

          {/* Active Alerts (FIXED OVERFLOW & HEIGHT CAPPED WITH CUSTOM SCROLLBAR) */}
          <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 py-2.5 border-b border-theme-border flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-theme-text">Active Station Alerts</span>
              </div>
              {uniqueActiveAlerts.length > 0 && (
                <span className="text-[10px] font-mono font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full">
                  {uniqueActiveAlerts.length}
                </span>
              )}
            </div>

            {/* Capped height scrollable container prevents alerts from being cut off or hidden */}
            <div className="p-3 max-h-[360px] overflow-y-auto custom-scrollbar space-y-2">
              {uniqueActiveAlerts.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1.5 opacity-80" />
                  <p className="text-xs text-theme-muted font-medium">All stations within normal operating limits</p>
                </div>
              ) : (
                uniqueActiveAlerts.map((alert, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-rose-400">{alert.station_id}</span>
                        <p className="text-[11px] font-medium text-slate-200 mt-0.5">{alert.station_name}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded flex-shrink-0 border border-rose-500/20">
                        {alert.bottleneck_risk_pct || 91}% risk
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">{alert.message}</p>
                    
                    <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                      <span>ETA: <strong className="text-amber-400">{alert.predicted_in_mins || 11} min</strong></span>
                      <span>Queue: <strong className="text-slate-200">14 units</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Event Timeline */}
          <AlertTimeline timeline={alert_timeline} />
        </div>
      </div>

      {/* Station Detail Slide-Over Drawer */}
      {selectedStation && (
        <StationDetailPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onInspectUnit={onInspectUnit}
          onOpenWhatIf={() => { setSelectedStation(null); onOpenWhatIf(); }}
        />
      )}

    </div>
  );
}
