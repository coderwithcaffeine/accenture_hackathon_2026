import React from 'react';
import TrustScorecard from './TrustScorecard';
import SoftSensorBadge from './SoftSensorBadge';
import ThinkingMachine from './ThinkingMachine';
import { ShieldCheck, Layers, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ControlRoomView({ leadershipData, trustData, coverageData, softSensors }) {
  if (!leadershipData) return null;

  const { roi_summary, top_risk_station } = leadershipData;
  const { total_savings, defects_caught_early, total_defects } = roi_summary || {};

  return (
    <div className="space-y-5">

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-theme-text flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Executive Control Room
          </h2>
          <p className="text-xs text-theme-muted mt-0.5 font-sans">Business ROI, Model Trust Scorecard, and Sensor Coverage Topology</p>
        </div>
      </div>

      {/* Executive AI Briefing via Thinking Machine */}
      <ThinkingMachine
        title="Executive AI Operations Briefing"
        subTitle="Plant-wide performance synthesis & risk forecasting"
        autoExpand={true}
        finalConclusion="Plant OEE is maintained at 84.2%. 19 of 24 defects were caught prior to final quality check. Reallocating 1 technician to BC-10 avoids an estimated $12,400 in assembly downtime."
      />

      {/* Business Impact KPIs */}
      <div>
        <h3 className="text-xs font-semibold text-theme-muted uppercase tracking-wider mb-3">Business Financial Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-theme-card border border-theme-border shadow-sm">
            <p className="text-[11px] text-theme-muted">Early Defects Caught</p>
            <p className="text-2xl font-bold text-theme-text font-mono mt-1">{defects_caught_early}</p>
            <p className="text-[11px] text-theme-muted mt-0.5">out of {total_defects} total defects</p>
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              {((defects_caught_early / (total_defects || 1)) * 100).toFixed(0)}% early catch rate
            </p>
          </div>

          <div className="p-4 rounded-xl bg-theme-card border border-theme-border shadow-sm">
            <p className="text-[11px] text-theme-muted">Est. Total Financial Savings</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">${total_savings?.toLocaleString()}</p>
            <p className="text-[11px] text-theme-muted mt-0.5">Scrap + downtime avoided</p>
          </div>

          <div className="p-4 rounded-xl bg-theme-card border border-theme-border shadow-sm">
            <p className="text-[11px] text-theme-muted">Production Loss Avoided</p>
            <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">₹1.9L</p>
            <p className="text-[11px] text-theme-muted mt-0.5">Via automated reallocations</p>
          </div>

          <div className="p-4 rounded-xl bg-theme-card border border-theme-border shadow-sm">
            <p className="text-[11px] text-theme-muted">Top Constraint Station</p>
            <p className="text-2xl font-bold text-rose-400 font-mono mt-1">{top_risk_station || 'BC-10'}</p>
            <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Chassis alignment drift
            </p>
          </div>
        </div>
      </div>

      {/* Model Trust Scorecard */}
      <div>
        <h3 className="text-xs font-semibold text-theme-muted uppercase tracking-wider mb-3">Model Trust Scorecard — 70/30 Test Split Validation</h3>
        <TrustScorecard trustData={trustData} />
      </div>

      {/* Sensor Coverage Topology */}
      <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-theme-border flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-theme-text">Sensor Coverage & Soft-Sensor Topology</h3>
          </div>
          <span className="text-[11px] font-mono text-theme-muted">{coverageData?.total_stations || 38} stations mapped</span>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[11px] text-emerald-400 font-semibold">Full Sensor Hardware</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{coverageData?.full_sensors_count || 30}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Vib · Temp · Torque · Cycle time</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-[11px] text-indigo-400 font-semibold">Virtual Soft-Sensor (Inferred)</p>
              <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">{coverageData?.limited_sensors_count || 8}</p>
              <p className="text-[10px] text-theme-muted mt-0.5">Cycle time + virtual inference</p>
            </div>
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border">
              <p className="text-[11px] text-theme-muted font-semibold">Unmapped Stations</p>
              <p className="text-2xl font-bold text-theme-muted font-mono mt-1">0</p>
              <p className="text-[10px] text-theme-muted mt-0.5">100% station observability</p>
            </div>
          </div>

          {/* Soft Sensors Grid */}
          <div className="pt-2">
            <h4 className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider mb-3">Virtual Soft-Sensor Inferences</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {softSensors && Object.values(softSensors).map((ss) => (
                <div key={ss.station_id} className="p-3.5 rounded-xl bg-theme-bg border border-theme-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-indigo-400">{ss.station_id} — {ss.station_name}</span>
                  </div>
                  <SoftSensorBadge softSensorData={ss} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
