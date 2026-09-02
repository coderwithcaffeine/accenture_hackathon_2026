# DigitalTwin.ai — Predictive Vehicle Assembly Digital Twin
*Accenture Innovation Challenge 2026 — Track 4: DigitalTwin.ai*

**Tagline**: Predict • Simulate • Prevent

A working predictive digital twin for a 38-station mixed-model vehicle assembly line built with **Express (Node.js)**, **React.js**, **Tailwind CSS v3**, and **Google Gemini API** integration.

The system embodies the core operational story:
$$\text{LIVE FACTORY DATA} \longrightarrow \text{DIGITAL TWIN} \longrightarrow \text{PREDICT} \longrightarrow \text{SIMULATE} \longrightarrow \text{RECOMMEND} \longrightarrow \text{HUMAN DECISION}$$

---

## 1. The 4 Main Dashboard Tabs

| Tab | Name | Purpose & Key Features |
| :--- | :--- | :--- |
| **Tab 1** | **FLOOR** | **Live Monitoring**: Home screen showing Top KPIs (Takt 57s, Throughput 82 v/hr, OEE 84.2%, Open Alerts, Twin Sync LIVE), animated 38-station conveyor track across Body Construction ➔ Paint ➔ Final Assembly, station nodes (Green/Amber/Red/Gray), and right-side station detail drawer with cycle-time trajectory trend. |
| **Tab 2** | **INSIGHTS** | **AI Diagnostics & Root Cause**: 3 sections — **BOTTLENECK** (next constraint prediction & time), **QUALITY** (Vehicle #1842 defect risk & supporting signals), and **ROOT CAUSE** with visual **TRACE ORIGIN** backward line flow (`FA-16 ➔ FA-07 ➔ BC-07`). Includes Gemini root-cause explanation. |
| **Tab 3** | **SIMULATE** | **WHAT-IF SIMULATOR**: Test decisions virtually before changing the line. Supports 6 disruption scenarios, discrete-event propagation impact calculation ($/₹), Gemini trade-off interpretation, intervention optimization cards (**RECOMMENDED: MOVE 1 OPERATOR**), and **Human-in-the-Loop APPROVE INTERVENTION** button. |
| **Tab 4** | **CONTROL ROOM** | **Executive Management**: Combined dashboard featuring **IMPACT** (defects caught early, savings, loss avoided), **TRUST SCORECARD** (Precision, Recall, F1, False-Negative Rate, Lineage Top-1 Accuracy), **COVERAGE** (Full vs Limited vs Missing sensors with Soft-Sensor confidence scores), and Gemini Management Briefing. |

---

## 2. Google Gemini AI Integration (4 Places)

DigitalTwin.ai uses the **Google Gemini API** (`gemini-2.5-flash`) via an Express backend proxy (`POST /api/gemini-explain`) to generate natural language operational reasoning:

1. **Alert Explanation**: Explains why station cycle time is trending above takt.
2. **Root-Cause Explanation**: Explains feature anomaly signals (`BC-07` torque/vibration).
3. **What-If Interpretation**: Explains operational trade-offs between candidate interventions.
4. **Management Summary**: Generates executive briefing for the Control Room view.

*Note: If `GEMINI_API_KEY` is not provided, the application automatically uses deterministic template fallbacks with zero interruption.*

---

## 3. Environment Setup & API Key

Copy `.env.example` to `.env` and insert your Gemini API Key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
```

> Get your free Gemini API key at: [Google AI Studio](https://aistudio.google.com/)

---

## 4. Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
npm install
```

### Start Both Backend & Frontend Simultaneously (Single Command)

```bash
npm start
```
> This boots the Express API Backend (`http://localhost:5000`) and React Frontend (`http://localhost:3000`) concurrently in one terminal window.

### Running Backend and Frontend Separately (Optional)

```bash
# Terminal 1: Backend Express Server Only
npm run server

# Terminal 2: Frontend React Dashboard Only
npm run dev
```
