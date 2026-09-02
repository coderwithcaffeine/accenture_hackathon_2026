import React from 'react';
import { Clock, TrendingUp, BarChart2, AlertTriangle, Radio } from 'lucide-react';

export default function TopKpiBar({ kpiData }) {
  if (!kpiData) return null;
  const { takt_time_s, throughput_vh_hr, oee_pct, open_alerts_count, twin_sync_status } = kpiData;

  const oeeColor = oee_pct >= 85 ? 'text-emerald-400' : oee_pct >= 75 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 px-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        
        {/* Takt Time */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none">Target Takt</span>
            <span className="font-mono font-bold text-slate-100 text-sm">{takt_time_s}s</span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Throughput */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none">Throughput</span>
            <span className="font-mono font-bold text-slate-100 text-sm">{throughput_vh_hr}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Plant OEE */}
        <div className="flex items-center gap-2">
          <BarChart2 className={`w-4 h-4 ${oeeColor} flex-shrink-0`} />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none">Plant OEE</span>
            <span className={`font-mono font-bold text-sm ${oeeColor}`}>{oee_pct}%</span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Open Alerts */}
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${open_alerts_count > 0 ? 'text-amber-400' : 'text-emerald-400'} flex-shrink-0`} />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none">Open Alerts</span>
            <span className={`font-mono font-bold text-sm ${open_alerts_count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {open_alerts_count}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Twin Sync Status */}
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none">Twin Sync</span>
            <span className="font-mono font-bold text-emerald-400 text-xs flex items-center gap-1">
              {twin_sync_status}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
