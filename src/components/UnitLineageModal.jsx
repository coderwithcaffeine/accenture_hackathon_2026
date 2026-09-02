import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, Activity } from 'lucide-react';

export default function UnitLineageModal({ unitId, onClose }) {
  const [lineageData, setLineageData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (!unitId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/unit-lineage/${unitId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Unit ${unitId} not found in dataset`);
        return res.json();
      })
      .then(data => { setLineageData(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [unitId]);

  if (!unitId) return null;

  const isDefective = lineageData?.seeded_defect;
  const isMatch     = lineageData?.is_top1_match;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-theme-card border border-theme-border rounded-xl shadow-2xl flex flex-col max-h-[88vh] animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-border flex-shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-brand-purple">Unit #{unitId}</span>
              {lineageData && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isDefective
                    ? 'bg-status-red/10 text-status-red border border-status-red/20'
                    : 'bg-status-green/10 text-status-green border border-status-green/20'
                }`}>
                  {isDefective ? 'Defect seeded' : 'Clean unit'}
                </span>
              )}
            </div>
            <p className="text-xs text-theme-muted mt-0.5">Lineage trace — z-score ranking across all stations</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-theme-muted">Tracing telemetry across 38 stations…</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <AlertTriangle className="w-8 h-8 text-status-red mx-auto mb-2" />
              <p className="text-sm text-status-red">{error}</p>
            </div>
          ) : lineageData ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border ${
                  isDefective ? 'border-status-red/30 bg-status-red/5' : 'border-status-green/30 bg-status-green/5'
                }`}>
                  <p className="text-[10px] text-theme-muted">Unit status</p>
                  <div className={`flex items-center gap-1.5 mt-1 font-semibold text-sm ${
                    isDefective ? 'text-status-red' : 'text-status-green'
                  }`}>
                    {isDefective ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    {isDefective ? 'Defective' : 'Clean pass'}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-theme-border bg-theme-bg">
                  <p className="text-[10px] text-theme-muted">Ground truth origin</p>
                  <p className={`font-mono text-sm font-bold mt-1 ${lineageData.actual_origin ? 'text-brand-purple' : 'text-theme-muted'}`}>
                    {lineageData.actual_origin || '—'}
                  </p>
                  <p className="text-[10px] text-theme-muted mt-0.5">{lineageData.actual_origin ? 'Known defect source' : 'No defect seeded'}</p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  !isDefective || isMatch
                    ? 'border-status-green/30 bg-status-green/5'
                    : 'border-status-amber/30 bg-status-amber/5'
                }`}>
                  <p className="text-[10px] text-theme-muted">Model prediction</p>
                  <p className={`font-mono text-sm font-bold mt-1 ${
                    !isDefective || isMatch ? 'text-status-green' : 'text-status-amber'
                  }`}>
                    {!isDefective ? '—' : lineageData.predicted_origin}
                  </p>
                  <p className="text-[10px] text-theme-muted mt-0.5">
                    {!isDefective ? 'No defect to predict' : isMatch ? '✓ Exact top-1 match' : '△ Not top-1'}
                  </p>
                </div>
              </div>

              {/* Z-score table */}
              <div className="rounded-xl border border-theme-border overflow-hidden">
                <div className="px-4 py-2.5 border-b border-theme-border flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-brand-purple" />
                  <p className="text-xs font-semibold text-theme-text">Station anomaly rankings</p>
                  <span className="text-[11px] text-theme-muted ml-1">Sorted by max |z-score|</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-theme-border bg-theme-bg">
                        <th className="py-2 px-4 text-[10px] font-semibold text-theme-muted">#</th>
                        <th className="py-2 px-4 text-[10px] font-semibold text-theme-muted">Station</th>
                        <th className="py-2 px-4 text-[10px] font-semibold text-theme-muted">Name</th>
                        <th className="py-2 px-4 text-[10px] font-semibold text-theme-muted">Max |z-score|</th>
                        <th className="py-2 px-4 text-[10px] font-semibold text-theme-muted">Readings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-border/50">
                      {lineageData.trace_rankings.map((st, idx) => {
                        const isOrigin   = st.station_id === lineageData.actual_origin;
                        const isHighZ    = st.z_score >= 3.0;
                        return (
                          <tr
                            key={st.station_id}
                            className={`transition-colors ${
                              isOrigin
                                ? 'bg-brand-purple/8 font-semibold'
                                : isHighZ
                                ? 'bg-status-amber/5'
                                : 'hover:bg-theme-bg/50'
                            }`}
                          >
                            <td className="py-2.5 px-4 text-theme-muted font-mono">#{idx + 1}</td>
                            <td className={`py-2.5 px-4 font-mono font-bold ${isOrigin ? 'text-brand-purple' : 'text-theme-text'}`}>
                              {st.station_id}
                              {isOrigin && <span className="ml-1.5 text-[9px] font-sans font-medium bg-brand-purple/15 text-brand-purple px-1.5 py-0.5 rounded">Origin</span>}
                            </td>
                            <td className="py-2.5 px-4 text-theme-text">{st.station_name}</td>
                            <td className="py-2.5 px-4">
                              <span className={`font-mono font-semibold px-1.5 py-0.5 rounded text-[10px] ${
                                isHighZ
                                  ? 'text-status-red bg-status-red/10 border border-status-red/20'
                                  : 'text-theme-muted'
                              }`}>
                                {st.z_score}σ
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-[10px] text-theme-muted font-mono">
                              {st.telemetry.vibration}g · {st.telemetry.temperature}°C · {st.telemetry.torque}Nm
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-3.5 border-t border-theme-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-theme-border text-xs text-theme-text hover:border-brand-purple transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
