import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import TopKpiBar from './components/TopKpiBar';
import StatusRibbon from './components/StatusRibbon';
import FloorSupervisorView from './components/FloorSupervisorView';
import InsightsView from './components/InsightsView';
import SimulateView from './components/SimulateView';
import AiRadarView from './components/AiRadarView';
import ControlRoomView from './components/ControlRoomView';
import UnitLineageModal from './components/UnitLineageModal';
import WhatIfSimulatorModal from './components/WhatIfSimulatorModal';

export default function App() {
  const [activeTab, setActiveTab]         = useState('floor');
  const [tabKey, setTabKey]               = useState(0);           // drives re-mount for fade animation
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [inspectUnitId, setInspectUnitId] = useState(null);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);

  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    fetch('/api/dashboard-data')
      .then(res => res.json())
      .then(data => { setDashboardData(data); setLoading(false); })
      .catch(err => { console.error('Failed to fetch:', err); setLoading(false); });
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const handleResimulate = () => {
    setLoading(true);
    fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed: Math.floor(Math.random() * 10000), nUnits: 600 })
    })
      .then(res => res.json())
      .then(data => { if (data.dashboardData) setDashboardData(data.dashboardData); setLoading(false); })
      .catch(err => { console.error('Simulate error:', err); setLoading(false); });
  };

  // Tab switch with animation reset
  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setTabKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200 flex flex-col font-sans">

      <Header
        activeTab={activeTab}
        setActiveTab={handleTabSwitch}
        onResimulate={handleResimulate}
        loading={loading}
        geminiActive={dashboardData?.gemini_active}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 space-y-4">

        {/* Persistent KPI bar */}
        {dashboardData && <TopKpiBar kpiData={dashboardData.kpi} />}

        {/* Status ribbon — shown on all tabs, glanceable line health */}
        {dashboardData && <StatusRibbon floorData={dashboardData.floor} />}

        {/* ── Content area ─────────────────────────────────────── */}
        {loading && !dashboardData ? (
          <LoadingSkeleton />
        ) : dashboardData ? (
          <div key={tabKey} className="animate-tab-enter">
            {activeTab === 'floor' && (
              <FloorSupervisorView
                floorData={dashboardData.floor}
                onInspectUnit={uid => setInspectUnitId(uid)}
                onOpenWhatIf={() => setShowWhatIfModal(true)}
              />
            )}
            {activeTab === 'insights' && (
              <InsightsView
                insightsData={dashboardData.insights}
                onInspectUnit={uid => setInspectUnitId(uid)}
              />
            )}
            {activeTab === 'simulate' && (
              <SimulateView
                onApproveIntervention={updatedData => {
                  if (updatedData) setDashboardData(updatedData);
                }}
              />
            )}
            {activeTab === 'radar' && (
              <AiRadarView stationStatuses={dashboardData.floor?.stations} />
            )}
            {activeTab === 'control_room' && (
              <ControlRoomView
                leadershipData={dashboardData.leadership}
                trustData={dashboardData.trust_scorecard}
                coverageData={dashboardData.coverage}
                softSensors={dashboardData.floor?.soft_sensors}
              />
            )}
          </div>
        ) : (
          <ErrorState onRetry={fetchDashboardData} />
        )}
      </main>

      {/* Modals */}
      {showWhatIfModal && (
        <WhatIfSimulatorModal
          onClose={() => setShowWhatIfModal(false)}
          onApproveIntervention={updatedData => {
            if (updatedData) setDashboardData(updatedData);
          }}
        />
      )}
      {inspectUnitId && (
        <UnitLineageModal
          unitId={inspectUnitId}
          onClose={() => setInspectUnitId(null)}
        />
      )}

      <footer className="border-t border-theme-border py-3.5 px-4 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-theme-muted">
          <span>DigitalTwin.ai — Accenture Innovation Challenge 2026 · Track 4</span>
          <span className="font-mono">Gemini 2.5 Flash · 38 stations · 600-unit simulation</span>
        </div>
      </footer>

    </div>
  );
}

/* ── Inline sub-components ──────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl skeleton" />
        ))}
      </div>
      {/* Main skeleton */}
      <div className="h-40 rounded-xl skeleton" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl skeleton" />
        ))}
      </div>
      <div className="h-px w-8 mx-auto bg-theme-muted/30 mt-6" />
      <p className="text-center text-sm text-theme-muted">Loading twin data…</p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="py-20 flex flex-col items-center gap-3 text-center animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-status-red/10 flex items-center justify-center">
        <span className="text-status-red text-lg">!</span>
      </div>
      <p className="text-sm font-semibold text-theme-text">Could not connect to backend</p>
      <p className="text-xs text-theme-muted">Ensure the Express server is running on port 5000.</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 rounded-lg border border-theme-border text-xs text-theme-text hover:border-brand-purple transition-colors"
      >
        Retry connection
      </button>
    </div>
  );
}
