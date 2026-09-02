import React from 'react';
import { Clock, TrendingUp, BarChart2, AlertTriangle, Radio } from 'lucide-react';

function KpiCard({ icon: Icon, label, value, sub, iconColor = 'text-theme-muted', valueColor = 'text-theme-text' }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-theme-card border border-theme-border shadow-sm">
      <div className={`${iconColor} opacity-80 flex-shrink-0`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-theme-muted font-medium">{label}</p>
        <p className={`text-lg font-bold leading-tight font-mono ${valueColor}`}>{value}</p>
        {sub && <p className="text-[10px] text-theme-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function TopKpiBar({ kpiData }) {
  if (!kpiData) return null;
  const { takt_time_s, throughput_vh_hr, oee_pct, open_alerts_count, twin_sync_status } = kpiData;

  const oeeColor = oee_pct >= 85 ? 'text-emerald-400' : oee_pct >= 75 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <KpiCard icon={Clock} label="Target Takt" value={`${takt_time_s}s`} iconColor="text-indigo-400" />
      <KpiCard icon={TrendingUp} label="Throughput" value={throughput_vh_hr} sub="vehicles / hr" iconColor="text-sky-400" />
      <KpiCard icon={BarChart2} label="Plant OEE" value={`${oee_pct}%`} iconColor={oeeColor} valueColor={oeeColor} />
      <KpiCard
        icon={AlertTriangle}
        label="Open Alerts"
        value={open_alerts_count > 0 ? open_alerts_count : '0'}
        sub={open_alerts_count > 0 ? 'Need attention' : 'All nominal'}
        iconColor={open_alerts_count > 0 ? 'text-rose-400' : 'text-emerald-400'}
        valueColor={open_alerts_count > 0 ? 'text-rose-400' : 'text-emerald-400'}
      />
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-theme-card border border-theme-border shadow-sm col-span-2 sm:col-span-1">
        <Radio className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0" />
        <div>
          <p className="text-xs text-theme-muted font-medium">Twin State Sync</p>
          <p className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            {twin_sync_status}
          </p>
        </div>
      </div>
    </div>
  );
}
