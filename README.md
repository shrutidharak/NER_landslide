# NER-EWS — AI-Based Early Warning & Landslide Risk Monitoring System

**Smart India Hackathon 2026 · Problem Statement ID 26001**
**Organization:** Ministry of Development of North Eastern Region (MDoNER) · **Theme:** Disaster Management

> A real-time, GIS-driven early warning platform that turns rainfall, soil, slope and satellite data into **plain, actionable risk alerts** — so that a district officer in Aizawl or a family in a hillside village in Mizoram gets a warning *before* the slope gives way, not after.

---

## 1. Why this exists

The North Eastern Region loses roads, bridges and sometimes lives every monsoon to landslides that were, in hindsight, predictable. Monitoring today is largely manual and reactive — a call after a road is already blocked. There is no single system that fuses rainfall, soil moisture, terrain and historical landslide data into one live, explainable risk picture for the people who have to act on it: District Disaster Management Authorities, field officers, and villagers themselves.

**NER-EWS** is our answer: one dashboard that shows *which slope*, *how risky*, *why*, and *what to do next* — in a form that works even for a low-bandwidth block office.

---

## 2. What's in this repository

This repo contains the **command-center web application** — the GIS dashboard, alerting console, sensor/field-reporting interface, and analytics layer that district authorities and field teams would actually use. It is built as a fully working, click-through prototype so that the risk-scoring logic, alert workflow and UI/UX can be demonstrated end-to-end today, while the production data pipeline (live sensors, satellite feeds, trained ML model) is wired in behind the same interface.

> **Honesty note, because it matters:** the risk scores, sensor readings and alerts you see in this build are **simulated** (clearly flagged with a `● DEMO / SIMULATION DATA` banner in the UI). We are not claiming a trained model with production accuracy — that would be dishonest at a hackathon and in engineering generally. Section 8 explains exactly what's real, what's a working mock, and what the evaluation plan looks like once we're trained on real landslide inventory data.

---

## 3. Key Features

| Module | What it does |
|---|---|
| **Overview** | District-level command-center summary — zones at risk, active alerts, connectivity status, at a glance |
| **Live Risk Map** | Interactive Leaflet/GIS map with colour-coded risk heatmap (Low → Critical) over vulnerable zones, roads, villages and infrastructure |
| **Alert Center** | Live feed of triggered alerts with severity, trigger reason and recipient channels; drills into **CAP-formatted** alert details |
| **Sensor Monitoring** | Live rainfall / soil-moisture / temperature sensor grid with battery + online status and historical trend charts |
| **Field Reports** | Citizens and field officers can submit geo-tagged reports of cracks, slope movement, rockfall or blocked roads, which feed back into zone risk |
| **Weather** | Rainfall-linked forecast view for each risk zone |
| **Infrastructure** | Roads, bridges, hospitals, schools and shelters mapped against risk zones, with road status (open / partially blocked / blocked) |
| **Analytics** | Trend and comparison views across zones — the layer where the ML risk model's outputs are visualised |
| **Admin / Settings** | Zone, threshold and notification configuration for the authority operating the system |

The alert payload is modelled on the **OASIS Common Alerting Protocol (CAP)** format — the same standard used by IMD and NDMA — so the system can plug directly into India's existing emergency-alert ecosystem (SACHET / SMS gateways) rather than inventing a parallel one.

---

## 4. Screenshots — Disaster Simulator

**Overview / Command Center**

<img width="1600" alt="Overview dashboard" src="https://github.com/user-attachments/assets/0f9fb302-7523-4f6c-a2e1-6cbb27edb64d" />

**Live Risk Map**

<p>
  <img width="49%" alt="Live Risk Map view 1" src="https://github.com/user-attachments/assets/b8827c27-02f4-411b-b7e3-d1520c30375f" />
  <img width="49%" alt="Live Risk Map view 2" src="https://github.com/user-attachments/assets/488fcb48-8277-46ec-a9a8-400ae8acfd00" />
</p>

**Sensor Monitoring**

<img width="1600" alt="Sensor Monitoring" src="https://github.com/user-attachments/assets/7e4825a9-a7b1-4349-a835-19ac872c9e83" />

**Analytics**

<p>
  <img width="49%" alt="Analytics view 1" src="https://github.com/user-attachments/assets/d7b20e2d-99cb-4ac9-97c8-cb0cb0c94d23" />
  <img width="49%" alt="Analytics view 2" src="https://github.com/user-attachments/assets/690589f4-4e51-40c1-be81-6d8443ee30ae" />
</p>


<img width="1600" alt="Alert Center" src="https://github.com/user-attachments/assets/8ab3cfe6-3289-40a6-a948-8a0d00e389b8" />


---

## 5. Tech Stack

**Frontend (this repo — fully implemented)**

| Layer | Technology |
|---|---|
| UI framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4, custom design tokens (CSS variables) |
| Routing | React Router v7 |
| Maps / GIS | Leaflet + react-leaflet, Turf.js (geospatial calculations) |
| Charts | Recharts |
| Icons | lucide-react |
| Dates | date-fns |
| Linting | oxlint |

**Proposed production backend & ML layer** (architecture designed, integration-ready via the mock API service — see `src/api/index.ts`)

| Layer | Technology |
|---|---|
| API | FastAPI (Python) — `VITE_API_BASE_URL` is already the single swap-point in the frontend |
| ML serving | scikit-learn / XGBoost / LightGBM models behind a REST endpoint |
| Data ingestion | IMD weather API, satellite imagery (Sentinel/Bhuvan), IoT rainfall & soil-moisture sensors |
| Storage | PostgreSQL + PostGIS (spatial queries), object storage for imagery |
| Alerting | CAP-formatted alerts → SMS/app gateway, multilingual templating |
| Offline support | Service-worker cache + sync queue for low-connectivity field use |
| Deployment | Containerised (Docker), cloud-hosted with edge caching for hill districts |

---

## 6. System Architecture

<p align="center">
  <img width="700" alt="System Architecture Diagram" src="https://github.com/user-attachments/assets/d381d70f-e30b-4f83-8404-16301a617bab" />
</p>

---

## 7. Methodology — the Hybrid Risk Score

The design decision at the heart of this project (already reflected in the data model — see `src/types/index.ts` and `src/hooks/useSimulation.ts`) is that **landslide risk should not come from a black-box ML score alone.** Slope engineering has a well-established physical model, and recent literature (Roccati et al. 2021; Li et al. 2022; Mihu et al. 2026 — GIS-AHP and RF/XGBoost/LightGBM based susceptibility mapping for rainfall-triggered landslides, including a study on Dibang Valley in NE India) shows the best results come from **combining a physical stability model with a data-driven model**, not choosing one over the other.

So every zone in NER-EWS carries two scores that are fused into one:

1. **Factor of Safety (FoS)** — a geotechnical stability ratio from slope, soil and terrain data. FoS < 1.0 means the slope is physically unstable.
2. **ML Probability** — a learned probability of landslide occurrence from historical inventory + rainfall + soil moisture + terrain features.

```
finalRiskScore = (instability from FoS) × 0.60
               + (ML probability)       × 0.40
               + (live rainfall factor) × 0.15
               + (live soil factor)     × 0.10
```

This hybrid score is then bucketed into **LOW / MEDIUM / HIGH / CRITICAL**, which drives the map colour, the alert trigger and the dashboard's severity badges. The weighting above is intentionally simple and tunable — the important architectural point is that the *physical* and *learned* signals never fully override each other, which is what makes the system explainable to a District Magistrate who isn't a data scientist.

**Planned ML pipeline (production):**
- **Features:** cumulative & intensity rainfall, antecedent soil moisture, slope angle, aspect, elevation, NDVI/land cover, distance to drainage, lithology, past landslide density
- **Candidate models:** Random Forest, XGBoost, LightGBM (ensemble comparison, per the reference literature) with a simple logistic baseline
- **Explainability:** SHAP values surfaced in the Analytics module, so a risk alert can show *"triggered mainly by 3-day cumulative rainfall + saturated soil,"* not just a number
- **Validation approach:** spatial k-fold cross-validation (not random split, to avoid spatial leakage between neighbouring slope cells) against the historical landslide inventory

---

## 8. Model Evaluation — status & plan

**Current status:** this repository ships a working frontend and a fully-specified hybrid scoring formula, but **no model has been trained on real data yet** inside this repo — the `mlProbability` and `fos` values you see in the demo are simulated (clearly marked in the UI). We chose not to publish a fabricated confusion matrix or accuracy numbers here, because numbers without a real trained model behind them would misrepresent the work — and a judge who asks "on what dataset?" deserves a straight answer.

**Once trained on the historical landslide inventory for the target districts, evaluation will report:**

| Metric | Why it matters here |
|---|---|
| Confusion matrix (TP / FP / TN / FN) | False negatives = missed landslides = the metric we care about most |
| Recall (sensitivity) | Primary metric — a missed landslide costs lives; we will tune the decision threshold to favour recall over precision |
| Precision | To keep false-alarm fatigue low enough that authorities keep trusting the alerts |
| F1-score | Balanced view across the classes |
| ROC-AUC / PR-AUC | Model discrimination, especially important given landslide events are a rare/imbalanced class |
| Spatial cross-validation score | Confirms the model generalises to unseen terrain, not just memorised training slopes |

This section is intentionally a *plan*, not a claim — it will be filled in with real figures as soon as we run training against the datasets referenced in Section 7.

---

## 9. Project Structure

```
ner-ews/
├── src/
│   ├── api/            # Service layer — swap mock calls for FastAPI here (VITE_API_BASE_URL)
│   ├── components/
│   │   ├── layout/      # Sidebar, Topbar, MobileNav
│   │   ├── map/         # RiskMap, RiskLegend (Leaflet)
│   │   └── shared/      # AlertCard, SensorChart, StatusBadge, SimulationBanner
│   ├── data/            # Mock datasets (zones, sensors, alerts, infrastructure)
│   ├── hooks/           # useSimulation, useEvacuation
│   ├── pages/            # Overview, LiveRiskMap, AlertCenter, CAPDetails, SensorMonitoring,
│   │                      FieldReports, Weather, Infrastructure, Analytics, Admin, Settings
│   ├── types/           # Shared TypeScript domain types (Zone, Sensor, Alert, Infrastructure…)
│   ├── App.tsx           # Routes
│   └── main.tsx
├── public/
└── package.json
```

---

## 10. Getting Started

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/ner-ews.git
cd ner-ews

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
# → open http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview the production build
npm run preview
```

**Connecting a real backend:** set `VITE_API_BASE_URL` in a `.env` file and replace the mock return values in `src/api/index.ts` with real `fetch()` calls — the frontend components already consume this API layer, so no UI code needs to change.

---

## 11. Roadmap

- [ ] Train and validate the hybrid FoS + ML risk model on real districtwise landslide inventory data (confusion matrix, recall/precision reported here)
- [ ] FastAPI backend with PostGIS for spatial queries
- [ ] Live IMD weather API + satellite feed integration
- [ ] IoT rainfall/soil-moisture sensor ingestion pipeline
- [ ] SMS/app-based CAP alert dispatch, multilingual templates (Assamese, Bengali, Mizo, Khasi, Nepali, Hindi, English)
- [ ] Offline-first sync for low-connectivity field use
- [ ] SHAP-based explainability panel in Analytics

---

## 12. Team & Submission

- **Problem Statement:** 26001 — *AI-Based Early Warning and Landslide Risk Monitoring System in NER*
- **Organization:** Ministry of Development of North Eastern Region (MDoNER)
- **Category:** Software · **Theme:** Disaster Management
- **Event:** Smart India Hackathon 2026
- **Institution:** Jorhat Engineering College
- **Team name:** VisionX

**Team Members**

| Name | Role |
|---|---|
| Debangaraj Munda | Team Leader |
| Bidyut Jyoti Borah | Member |
| Devahuti Phukan | Member |
| Pervez Mohsin Ahmed | Member |
| Mridul Hazarika | Member |
| Shrutidhara Tasa | Member |

---

## 13. License

This project is submitted for Smart India Hackathon 2026. License to be finalised by the team — MIT is suggested for an open disaster-management tool that other districts/states could reuse.
