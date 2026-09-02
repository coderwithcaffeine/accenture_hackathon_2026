/**
 * Express REST API Server for DigitalTwin.ai with Google Gemini Proxy
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import { simulateUnits } from './src/simulate.js';
import {
  computeBaselines,
  detectBottlenecks,
  buildFeatureMatrix,
  trainDefectPredictor,
  traceLineage,
  evaluateLineageAccuracy,
  computeROI,
  computePropagation,
  computeInterventionOptions,
  buildGeminiPrompts,
  assembleDashboardData
} from './src/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load station configuration
const stationsPath = path.join(__dirname, 'config', 'stations.json');
let stations = [];
try {
  stations = JSON.parse(fs.readFileSync(stationsPath, 'utf8'));
} catch (err) {
  console.error('Error loading stations config:', err);
}

// Global cached state
let currentSeed = 42;
let currentNUnits = 600;
let cachedUnits = [];
let cachedBaselines = {};
let cachedBottleneckAlerts = [];
let cachedModelResult = null;
let cachedLineageAccuracy = 0;
let cachedROI = {};
let cachedDashboardData = {};

// Run Pipeline
function runPipeline(seed = 42, nUnits = 600) {
  console.log(`[Pipeline] Running simulation (seed=${seed}, nUnits=${nUnits})...`);
  currentSeed = seed;
  currentNUnits = nUnits;

  // 1. Simulation
  cachedUnits = simulateUnits(stations, nUnits, seed);

  // 2. Baselines (first 100 units)
  cachedBaselines = computeBaselines(cachedUnits, stations, 100);

  // 3. SPC Bottleneck Detection
  cachedBottleneckAlerts = detectBottlenecks(cachedUnits, stations, cachedBaselines, 3, 5);

  // 4. Feature Matrix & Defect Predictor Training
  const { X, y } = buildFeatureMatrix(cachedUnits, stations, cachedBaselines);
  cachedModelResult = trainDefectPredictor(X, y);

  // 5. Lineage Tracing & Top-1 Accuracy
  cachedLineageAccuracy = evaluateLineageAccuracy(cachedUnits, stations, cachedBaselines);

  // 6. ROI Computation
  const seededDefectsCount = cachedUnits.filter(u => u.seeded_defect).length;
  cachedROI = computeROI(cachedBottleneckAlerts, cachedModelResult.metrics, seededDefectsCount);

  // 7. Assemble Dashboard Data
  cachedDashboardData = assembleDashboardData(
    cachedUnits,
    stations,
    cachedBaselines,
    cachedBottleneckAlerts,
    cachedModelResult.metrics,
    cachedLineageAccuracy,
    cachedROI
  );

  console.log(`[Pipeline] Complete! Precision: ${cachedModelResult.metrics.precision}, Recall: ${cachedModelResult.metrics.recall}, Lineage Top-1: ${cachedLineageAccuracy}`);
}

// API Endpoints
app.get('/api/stations', (req, res) => {
  res.json(stations);
});

app.get('/api/dashboard-data', (req, res) => {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_KEY_HERE');
  res.json({
    ...cachedDashboardData,
    gemini_active: geminiConfigured
  });
});

app.get('/api/units', (req, res) => {
  res.json({
    total: cachedUnits.length,
    seed: currentSeed,
    units: cachedUnits
  });
});

app.get('/api/unit-lineage/:unitId', (req, res) => {
  const unitId = parseInt(req.params.unitId, 10);
  const unit = cachedUnits.find(u => u.unit_id === unitId);
  if (!unit) {
    return res.status(404).json({ error: `Unit ${unitId} not found` });
  }

  const trace = traceLineage(unit, stations, cachedBaselines);
  res.json({
    unit_id: unit.unit_id,
    seeded_defect: unit.seeded_defect,
    actual_origin: unit.defect_origin_station,
    predicted_origin: trace[0] ? trace[0].station_id : null,
    is_top1_match: trace[0] ? trace[0].station_id === unit.defect_origin_station : false,
    trace_rankings: trace
  });
});

// Google Gemini Explanation Proxy Route
app.post('/api/gemini-explain', async (req, res) => {
  const { type, payload } = req.body;
  const { prompt, fallback } = buildGeminiPrompts(type, payload);

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_KEY_HERE' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.json({
      explanation: fallback,
      source: 'TEMPLATE_FALLBACK',
      message: 'GEMINI_API_KEY not set in .env file. Using deterministic fallback explanation.'
    });
  }

  try {
    // Call Google Gemini API (gemini-2.5-flash) via fetch REST endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150, temperature: 0.2 }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedText) {
      throw new Error('Empty text returned from Gemini API');
    }

    res.json({
      explanation: generatedText,
      source: 'GEMINI_AI',
      model: 'gemini-2.5-flash'
    });

  } catch (err) {
    console.warn(`[Gemini Proxy Fallback] Call failed: ${err.message}. Using deterministic fallback.`);
    res.json({
      explanation: fallback,
      source: 'TEMPLATE_FALLBACK',
      error: err.message
    });
  }
});

// What-If Scenario Simulation Endpoint
app.post('/api/simulate-scenario', (req, res) => {
  const { targetStationId = 'BC-10', slowdownPct = 10 } = req.body;
  const propagation = computePropagation(targetStationId, slowdownPct);
  const intervention = computeInterventionOptions(targetStationId);

  res.json({
    propagation,
    intervention
  });
});

// Human-In-The-Loop Intervention Approval Endpoint
app.post('/api/approve-intervention', (req, res) => {
  const { stationId = 'BC-10', optionId = 'B' } = req.body;

  if (cachedDashboardData.floor) {
    cachedDashboardData.floor.station_statuses = cachedDashboardData.floor.station_statuses.map(st => {
      if (st.id === stationId) {
        return {
          ...st,
          status: 'amber',
          queue: 4,
          current_cycle_time: Math.round(st.baseline_mean + 2)
        };
      }
      return st;
    });

    cachedDashboardData.floor.alert_timeline.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'HUMAN_DECISION',
      station_id: stationId,
      message: `HUMAN APPROVED: Option ${optionId} executed. Reallocated floating technician to ${stationId}. Queue reduced to 4.`
    });
  }

  res.json({
    success: true,
    message: `Intervention ${optionId} approved and deployed for station ${stationId}.`,
    updatedDashboard: cachedDashboardData
  });
});

app.post('/api/simulate', (req, res) => {
  const seed = parseInt(req.body.seed || 42, 10);
  const nUnits = parseInt(req.body.nUnits || 600, 10);

  runPipeline(seed, nUnits);

  res.json({
    success: true,
    seed,
    nUnits,
    dashboardData: cachedDashboardData
  });
});

// Start server first so port 5000 is open immediately
app.listen(PORT, () => {
  console.log(`🚀 DigitalTwin.ai Server listening at http://localhost:${PORT}`);
  // Initial pipeline execution
  runPipeline(42, 600);
});
