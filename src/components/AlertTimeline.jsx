import React from 'react';
import { Clock, Activity, AlertTriangle, ShieldAlert, Sliders, CheckCircle2 } from 'lucide-react';

const EVENT_CONFIG = {
  DRIFT:          { icon: Activity,      color: 'text-status-amber', dot: 'bg-status-amber' },
  BOTTLENECK:     { icon: AlertTriangle, color: 'text-status-red',   dot: 'bg-status-red'   },
  QUALITY_RISK:   { icon: ShieldAlert,   color: 'text-brand-purple', dot: 'bg-brand-purple'  },
  SIMULATION:     { icon: Sliders,       color: 'text-theme-accent', dot: 'bg-theme-accent'  },
  HUMAN_DECISION: { icon: CheckCircle2,  color: 'text-status-green', dot: 'bg-status-green'  },
};

export default function AlertTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="rounded-xl bg-theme-card border border-theme-border overflow-hidden">
      <div className="px-4 py-2.5 border-b border-theme-border flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-theme-muted" />
        <p className="text-xs font-semibold text-theme-text">Event log</p>
        <span className="ml-auto font-mono text-[10px] text-theme-muted">{timeline.length} events</span>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {timeline.map((event, idx) => {
          const cfg  = EVENT_CONFIG[event.type] || EVENT_CONFIG.HUMAN_DECISION;
          const Icon = cfg.icon;
          const isLast = idx === timeline.length - 1;

          return (
            <div key={idx} className="flex gap-3 px-4 py-2.5 hover:bg-theme-bg/50 transition-colors">
              {/* Timeline spine */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                {!isLast && <div className="w-px flex-1 bg-theme-border/60 mt-1" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] text-theme-text leading-snug">{event.message}</p>
                  <span className="font-mono text-[10px] text-theme-muted flex-shrink-0">{event.time}</span>
                </div>
                <div className={`flex items-center gap-1 mt-0.5 ${cfg.color}`}>
                  <Icon className="w-2.5 h-2.5" />
                  <span className="text-[9px] font-medium">{event.type?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
