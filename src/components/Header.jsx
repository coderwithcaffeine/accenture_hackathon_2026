import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Activity, Zap, Sliders, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onResimulate, loading, geminiActive }) {
  const tabs = [
    { id: 'floor', label: 'Floor Supervisor', icon: Activity },
    { id: 'insights', label: 'AI Insights', icon: Zap },
    { id: 'simulate', label: 'What-If Simulate', icon: Sliders },
    { id: 'control_room', label: 'Control Room', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-theme-card/90 backdrop-blur-md border-b border-theme-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Brand Logo & System Info */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-mono font-bold text-xs">DT</span>
            </div>
            <div>
              <span className="font-bold text-sm text-theme-text tracking-tight">DigitalTwin.ai</span>
              <span className="hidden sm:inline text-theme-muted text-xs ml-2 font-mono">• Assembly Line Twin</span>
            </div>
            <span className="hidden md:flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-3 h-3 text-indigo-400" />
              Thinking Machine Active
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1" aria-label="Main Navigation">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                      : 'text-theme-muted hover:text-theme-text hover:bg-theme-bg'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onResimulate()}
              disabled={loading}
              type="button"
              className="p-2 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-bg transition-colors disabled:opacity-40"
              title="Re-run simulation pipeline"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
}
