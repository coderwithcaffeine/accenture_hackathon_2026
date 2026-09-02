import React from 'react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function StatusRibbon({ floorData }) {
  if (!floorData) return null;

  const { station_statuses, active_alerts } = floorData;

  const redCount   = station_statuses.filter(s => s.status === 'red').length;
  const amberCount = station_statuses.filter(s => s.status === 'amber').length;
  const grayCount  = station_statuses.filter(s => s.status === 'gray').length;
  const greenCount = station_statuses.length - redCount - amberCount - grayCount;

  // Overall status
  const lineStatus = redCount > 0
    ? { label: 'Critical — Bottleneck Forming', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-500' }
    : amberCount > 0
    ? { label: 'Warning — Monitor Closely', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-500' }
    : { label: 'Nominal — Line Flow Optimal', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-500' };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className={`rounded-xl border px-4 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1.5 shadow-sm transition-colors ${lineStatus.bg}`}>

      {/* Line status indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {redCount > 0 && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${lineStatus.dot}`} />}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${lineStatus.dot}`} />
        </span>
        <span className={`text-xs font-bold ${lineStatus.color}`}>
          Line Status: {lineStatus.label}
        </span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-4 bg-theme-border/60" />

      {/* Station distribution */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {redCount > 0 && (
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {redCount} critical
          </span>
        )}
        {amberCount > 0 && (
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {amberCount} warning
          </span>
        )}
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {greenCount} normal
        </span>
        {grayCount > 0 && (
          <span className="flex items-center gap-1 text-theme-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            {grayCount} soft
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-4 bg-theme-border/60" />

      {/* Active Alerts Count */}
      {active_alerts.length > 0 ? (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{active_alerts.length} open {active_alerts.length === 1 ? 'alert' : 'alerts'} need attention</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>No active alerts</span>
        </div>
      )}

      {/* Live Clock */}
      <div className="ml-auto flex items-center gap-1.5 text-xs text-theme-muted font-mono">
        <Clock className="w-3.5 h-3.5" />
        {timeStr}
      </div>

    </div>
  );
}
