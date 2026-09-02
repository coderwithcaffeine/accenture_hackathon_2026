import React from 'react';
import { ShieldCheck } from 'lucide-react';

function MetricCell({ label, value, valueColor = 'text-theme-text', sub }) {
  return (
    <div className="p-3 rounded-lg bg-theme-bg border border-theme-border">
      <p className="text-[10px] text-theme-muted">{label}</p>
      <p className={`font-mono text-lg font-bold mt-0.5 ${valueColor}`}>{value}</p>
      {sub && <p className="text-[10px] text-theme-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export default function TrustScorecard({ trustData }) {
  if (!trustData) return null;

  const { metrics, lineage_top1_accuracy, summary_text } = trustData;
  const { precision, recall, f1, false_negative_rate, confusion_matrix, test_sample_size } = metrics;

  return (
    <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-theme-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-purple" />
          <h3 className="text-sm font-semibold text-theme-text">Model trust scorecard</h3>
          <span className="text-[11px] text-theme-muted">N = {test_sample_size} held-out units</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
          Random Forest · 70/30 split
        </span>
      </div>

      <div className="p-5 space-y-4">

        {/* Plain-language summary */}
        <p className="text-xs text-theme-text leading-relaxed bg-brand-purple/5 border border-brand-purple/15 rounded-lg px-3.5 py-3">
          <span className="font-semibold text-brand-purple">Assessment: </span>{summary_text}
        </p>

        {/* Key metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <MetricCell
            label="Precision"
            value={`${(precision * 100).toFixed(1)}%`}
            sub="True alarm rate"
          />
          <MetricCell
            label="Recall"
            value={`${(recall * 100).toFixed(1)}%`}
            valueColor="text-status-green"
            sub="Early catch rate"
          />
          <MetricCell
            label="F1 score"
            value={`${(f1 * 100).toFixed(1)}%`}
            sub="Harmonic mean"
          />
          <MetricCell
            label="Miss rate"
            value={`${(false_negative_rate * 100).toFixed(1)}%`}
            valueColor="text-status-red"
            sub="Defects missed"
          />
          <MetricCell
            label="Lineage top-1"
            value={`${(lineage_top1_accuracy * 100).toFixed(1)}%`}
            valueColor="text-theme-accent"
            sub="Exact origin match"
          />
        </div>

        {/* Confusion matrix */}
        <div>
          <p className="text-[11px] font-semibold text-theme-muted mb-2">Confusion matrix</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'True Positives',  sub: 'Defects caught early',        val: confusion_matrix.tp, color: 'border-status-green/30 bg-status-green/5 text-status-green' },
              { label: 'False Positives', sub: 'False alarms on clean units', val: confusion_matrix.fp, color: 'border-status-amber/30 bg-status-amber/5 text-status-amber' },
              { label: 'False Negatives', sub: 'Missed until final check',    val: confusion_matrix.fn, color: 'border-status-red/30 bg-status-red/5 text-status-red' },
              { label: 'True Negatives',  sub: 'Clean units correctly passed', val: confusion_matrix.tn, color: 'border-theme-border bg-theme-bg text-theme-text' },
            ].map(row => (
              <div key={row.label} className={`flex items-center justify-between p-3 rounded-lg border ${row.color}`}>
                <div>
                  <p className="text-xs font-semibold">{row.label}</p>
                  <p className="text-[10px] text-theme-muted">{row.sub}</p>
                </div>
                <span className="font-mono text-lg font-bold">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
