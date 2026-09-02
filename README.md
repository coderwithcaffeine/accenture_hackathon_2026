# DigitalTwin.ai — Predictive Mixed-Model Assembly Line Digital Twin
> **Accenture Innovation Challenge 2026 — Track 4: DigitalTwin.ai (Round 2 Submission)**  
> **Team Name**: AIwithHardware  
> **Lead Developer**: Kartikey Yadav (IIT Delhi, Biotechnology)  
> *Predict • Simulate • Prevent • Trust*

---

## 📌 Executive Summary & Round 2 Problem Framing (Track 4)

In modern automotive and discrete manufacturing, assembly lines are rarely ideal, uniformly instrumented environments. Instead, factories present real-world operational challenges:
- **Uneven Sensor Coverage**: High-end modern stations feature vibration, torque, and thermal IoT telemetry, while legacy stations rely solely on manual checklists.
- **Intermittent & Multi-Causal Root Causes**: Equipment wear, operator variance, and upstream component tolerance stack up to create complex bottlenecks.
- **Strict OT / PLC Integration Constraints**: Modifying live Programmable Logic Controllers carries severe operational downtime risks; retrofits are restricted to sparse maintenance windows.
- **Late-Surfacing Defects**: Defects introduced at early Body Construction stations (e.g., `BC-07`) often remain undetected until Final Assembly (`FA-16`), creating massive downstream rework costs.
- **Diverse Stakeholder Needs**: Floor supervisors require real-time line control; plant managers require predictive bottleneck forecasts; executive leadership requires validated ROI business cases.

**DigitalTwin.ai** delivers an end-to-end predictive digital twin that bridges legacy equipment gaps, predicts bottlenecks before queue growth stalls throughput, isolates defect root origins via Z-score covariance tracing, and empowers plant operators with a **Human-in-the-Loop AI Thinking Machine**.

---

## 🏆 Round 2 Hackathon-Winning Features & Creative Enhancements

1. **🌊 Live Line Propagation & Starvation Heatmap Mode**:
   - Visualizes real-time **Upstream Backpressure Queue Waves** (S3 ➔ S2 slowdown propagation) and **Downstream Part Starvation Waves** directly on the 38-station material conveyor track.
2. **⚡ Interactive 38-Station Disruption Sandbox**:
   - Pick ANY station (`BC-01` to `FA-16`) and drag the **Disruption Severity Slider (10% to 100%)** to simulate real-time queue accumulation, throughput drop %, defect risk elevation, and financial loss in real-time.
3. **🤖 Gemini AI Station Assistant & Domain Guardrail**:
   - Interactive process query box with system role context, 3-line structured operational analysis (Financial Loss, Line Starvation, Actionable Recommendation), and domain boundary refusal (`"I am station ai not general purpose ai"`).
4. **🧠 Step-by-Step AI Reasoning Trace (Thinking Machine)**:
   - Live collapsible trace showing domain validation, dependency matrix calculation, financial impact assessment, and 3-line operational synthesis.

---

## 🚀 Core Features & Architectural Approach

### 1. Hybrid Modeling Engine & Simulated Production Data
- **38-Station Assembly Line Topology**: Spans 3 core production phases:
  - **Body Construction** (14 stations: `BC-01` to `BC-14` — Metal Stamping, Framing, Underbody Weld, Door Fitting)
  - **Paint** (8 stations: `PT-01` to `PT-08` — Pretreatment, E-Coat, Sealer, Basecoat, Oven Cure)
  - **Final Assembly** (16 stations: `FA-01` to `FA-16` — Trim, Wiring, Engine Marriage, Fluid Fill, Inspection)
- **Mixed-Model Simulation**: Simulates 600 production units passing through discrete cycle-time distributions, baseline means, and variance limits.

### 2. Uneven Sensor Support & Virtual Soft-Sensor Inferencing
- **Full-Sensor Hardware Stations (30 stations)**: Ingests 4 live telemetry streams (Vibration $g$, Temperature $^\circ\text{C}$, Torque $\text{Nm}$, Cycle Time $s$).
- **Checklist-Only Stations (8 stations)**: Stations with no direct IoT telemetry utilize **Virtual Soft-Sensors**. The twin computes indirect health states using downstream cycle-time propagation ratios and upstream statistical variance, displaying estimated health % and confidence metrics (`HIGH`/`MEDIUM`/`LOW`).

### 3. Predictive SPC & Anomaly Detection Pipeline
- **Western Electric Statistical Process Control (SPC)**: Monitors rolling 5-unit streaks exceeding $+3\sigma$ baseline cycle-time limits.
- **Bottleneck Forecasting**: Predicts bottleneck probability (%) and time-to-constraint (in minutes) before queue buildup constrains plant throughput.

### 4. Defect Lineage Tracing (Top-1 Origin Matching)
- **Backward Covariance Trace**: When a defect surfaces at final quality check (`FA-16`), the twin computes Z-score anomaly rankings across all 38 upstream stations.
- **Origin Isolation**: Identifies ground-truth defect sources (e.g., `BC-07 Torque Fastening A`) with **88.2% Top-1 Lineage Accuracy**.

### 5. Gemini AI "Thinking Machine" Reasoning Engine
- **Step-by-Step AI Reasoning Stream**: Displays an autonomous 5-step analytical pipeline across the UI:
  1. `Ingest Telemetry`: 38-station stream validation across 600 units.
  2. `SPC Anomaly Detection`: Rolling $+4.2\sigma$ drift evaluation.
  3. `Causal Lineage Tracing`: Covariance matrix Z-score origin ranking.
  4. `Impact Propagation`: Discrete-event queue buildup simulation.
  5. `Human-in-the-Loop Synthesis`: Actionable mitigation recommendation.
- Integrates Google Gemini API (`gemini-2.5-flash`) via an Express proxy (`/api/gemini-explain`) with seamless deterministic fallback when no API key is set.

### 6. What-If Simulator & Human-in-the-Loop Gate
- **Virtual Disruption Modeling**: Test 6 disruption scenarios virtually (e.g., `BC-10 slows 10%`, `BC-10 fails 10 min`, `Cut upstream rate 15%`) without impacting physical OT hardware.
- **Decision Matrix**: Evaluates candidate interventions (Do Nothing vs. Move 1 Floating Operator vs. Schedule Maintenance) based on estimated financial loss, queue buildup, and recovery time.
- **Human-in-the-Loop Approval**: Allows floor supervisors to approve interventions with 1 click, instantly updating the twin state.

---

## 👥 Multi-Stakeholder Persona Views

| View / Persona | Target User | Key Capabilities & Features |
| :--- | :--- | :--- |
| **Floor Supervisor** | Line Operator / Floor Manager | • Real-time 38-station status grid (Green/Amber/Red/Soft)<br>• Animated material conveyor track with speed controls<br>• Height-constrained, scrollable Active Alerts panel<br>• Slide-over station detail drawer with cycle time trend bars |
| **AI Insights** | Process / Quality Engineer | • Causal Root-Cause Analysis<br>• Vehicle defect risk breakdown & telemetry signals<br>• Backward Lineage Trace Diagram (`FA-16` ➔ `PT-05` ➔ `BC-07`) |
| **What-If Simulate** | Plant Maintenance Planner | • Discrete-event disruption simulator<br>• Estimated financial loss calculation (₹ / $)<br>• Option cards with "Recommended" pill & Human-in-the-Loop gate |
| **Control Room** | Plant Leadership / Operations Executive | • Executive AI Operations Briefing<br>• Business ROI metrics ($ total savings, early defect catch rate)<br>• Model Trust Scorecard (Precision, Recall, F1, 70/30 confusion matrix)<br>• Sensor Coverage Topology breakdown |

---

## 📈 Business Impact, Scalability & Model Trust

### 💡 Business ROI
- **$12,400+ Saved per Bottleneck Event**: Reallocating 1 floating technician prevents queue growth from stopping the entire assembly line.
- **Early Defect Catch Rate**: 80.0% of defects caught prior to final inspection, avoiding costly teardowns.
- **Plant OEE Optimization**: Maintains plant OEE at **84.2%**.

### 🛡️ Model Trust & Validation (70/30 Split)
To eliminate floor-level alert fatigue, predictive models are validated on 179 held-out units:
- **Precision**: 88.9% (Low false alarm rate)
- **Recall**: 80.0% (High defect catch rate)
- **F1 Score**: 84.2%
- **Lineage Top-1 Accuracy**: 88.2%

### 🌐 Scalability & Non-Invasive OT Integration
- **Non-Invasive Architecture**: Operates as a lightweight edge proxy over REST/MQTT telemetry without touching PLC ladder logic.
- **Cross-Site Adaptability**: Virtual soft-sensors allow deployment on legacy lines with partial instrumentation without requiring expensive capital retrofits.

---

## 💻 Tech Stack

- **Frontend**: React 18, Tailwind CSS v3, Lucide Icons, Custom Glassmorphism Theme System
- **Backend API**: Express.js (Node.js), Concurrently
- **Analytics & Simulation**: Custom Discrete-Event Simulation Engine, Random Forest Predictor (`ml-random-forest`), Statistical Process Control (SPC) Engine
- **AI Integration**: Google Gemini API (`gemini-2.5-flash` proxy)

---

## ⚡ Quick Start Guide (Way to Start It)

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### 1. Clone the Repository
```bash
git clone git@github.com:coderwithcaffeine/accenture_hackathon_2026.git
cd accenture_hackathon_2026
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```

If you have a Google Gemini API Key, set it in `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```
> *Note: If no API key is provided, the application runs seamlessly using built-in deterministic reasoning fallbacks.*

### 4. Run the Application
Start both the Express backend server (Port 5000) and Vite frontend server (Port 3000) concurrently with a single command:

```bash
npm start
```
or
```bash
npm run dev:all
```

### 5. Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Repository Structure

```
accenture_hackathon_2026/
├── config/
│   └── stations.json           # 38-station layout configuration
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation & system status
│   │   ├── TopKpiBar.jsx       # Glanceable plant KPIs
│   │   ├── StatusRibbon.jsx    # Line health ribbon
│   │   ├── FloorSupervisorView.jsx # 38-station grid & active alerts
│   │   ├── LiveConveyorTrack.jsx # Animated material flow track
│   │   ├── StationDetailPanel.jsx # Slide-over station drawer
│   │   ├── AlertTimeline.jsx   # Event timeline feed
│   │   ├── InsightsView.jsx    # Root-cause & lineage trace view
│   │   ├── SimulateView.jsx    # What-If scenario simulator view
│   │   ├── WhatIfSimulatorModal.jsx # What-If modal dialog
│   │   ├── ControlRoomView.jsx # Executive briefing & trust scorecard
│   │   ├── TrustScorecard.jsx  # Model precision/recall metrics
│   │   ├── SoftSensorBadge.jsx # Virtual sensor inference badge
│   │   ├── ThinkingMachine.jsx # Real-time AI reasoning trace
│   │   └── ThemeToggle.jsx     # Dark/Light mode toggle
│   ├── context/
│   │   └── ThemeContext.jsx    # Theme provider
│   ├── analytics.js            # SPC, ML training & lineage tracing
│   ├── simulate.js             # Discrete-event simulation pipeline
│   ├── App.jsx                 # Main application container
│   ├── index.css               # Design tokens & CSS variables
│   └── main.jsx                # React entry point
├── server.js                   # Express REST API & Gemini proxy
├── package.json                # Scripts & dependencies
├── tailwind.config.js          # Tailwind theme configuration
├── vite.config.js              # Vite server & API proxy config
├── .env.example                # Environment template
└── README.md                   # Project documentation
```

---

## 📜 License & Acknowledgments
Built for the **Accenture Innovation Challenge 2026 — Track 4: DigitalTwin.ai**.
