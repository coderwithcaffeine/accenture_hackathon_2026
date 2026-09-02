import React from 'react';

/**
 * SoftSensorBadge — shows virtual inference confidence for checklist-only stations.
 * Renders a clean inline badge with a tooltip on hover.
 */
export default function SoftSensorBadge({ softSensorData }) {
  if (!softSensorData) return null;

  const { estimated_state_pct, confidence_pct, confidence_level } = softSensorData;

  const levelStyle = {
    HIGH:   'text-status-green',
    MEDIUM: 'text-status-amber',
    LOW:    'text-theme-muted',
  }[confidence_level] || 'text-theme-muted';

  return (
    <div className="space-y-2">
      {/* State bar */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-theme-muted">Estimated state</span>
        <span className="font-mono font-semibold text-theme-text">{estimated_state_pct}%</span>
      </div>
      <div className="h-1.5 bg-theme-border/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-purple rounded-full transition-all duration-300"
          style={{ width: `${estimated_state_pct}%` }}
        />
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-theme-muted">Confidence</span>
        <span className={`font-mono font-semibold ${levelStyle}`}>
          {confidence_pct}% — {confidence_level}
        </span>
      </div>
    </div>
  );
}
