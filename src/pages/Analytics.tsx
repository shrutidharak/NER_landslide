import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BrainCircuit } from 'lucide-react';
import SimulationBanner from '../components/shared/SimulationBanner';

const FEATURE_IMPORTANCE = [
  { feature: 'Antecedent Rainfall (7-Day)', weight: 32 },
  { feature: 'Slope Angle (>35°)', weight: 24 },
  { feature: 'Soil Pore-Water Pressure', weight: 18 },
  { feature: 'NDVI Vegetation Index', weight: 12 },
  { feature: 'Geological Fault Proximity', weight: 8 },
  { feature: 'Cut-Slope Excavation Index', weight: 6 },
];

const ACCURACY_TREND = [
  { month: 'May', Random_Forest: 84, XGBoost: 88, Hybrid_LSTM_GNN: 92 },
  { month: 'Jun', Random_Forest: 86, XGBoost: 89, Hybrid_LSTM_GNN: 94 },
  { month: 'Jul', Random_Forest: 85, XGBoost: 91, Hybrid_LSTM_GNN: 95 },
  { month: 'Aug', Random_Forest: 87, XGBoost: 92, Hybrid_LSTM_GNN: 96 },
  { month: 'Sep', Random_Forest: 88, XGBoost: 93, Hybrid_LSTM_GNN: 97 },
];

const RADAR_PERFORMANCE = [
  { metric: 'Precision', XGBoost: 91, Hybrid_GNN: 96 },
  { metric: 'Recall', XGBoost: 89, Hybrid_GNN: 95 },
  { metric: 'F1-Score', XGBoost: 90, Hybrid_GNN: 95.5 },
  { metric: 'Lead Time (Hrs)', XGBoost: 75, Hybrid_GNN: 92 },
  { metric: 'Spatial Accuracy', XGBoost: 82, Hybrid_GNN: 94 },
];

export default function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationBanner />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BrainCircuit style={{ color: '#ec4899' }} size={22} />
          AI/ML Prediction Analytics & Slope Stability Physics Model
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
          Evaluation metrics for Hybrid GNN-LSTM Landslide Failure Model, feature importance, Factor of Safety (FoS) sensitivity analysis, and spatial prediction confidence.
        </p>
      </div>

      {/* Top Model Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Model Precision</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#ec4899', marginTop: 2 }}>96.4%</div>
          <div style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>Hybrid GNN-LSTM Architecture</div>
        </div>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Alert Lead Time</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>6.5 Hours</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Prior to slope failure event</div>
        </div>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>False Positive Rate</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginTop: 2 }}>3.2%</div>
          <div style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>Reduced via IoT sensor fusion</div>
        </div>
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Inference Latency</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b', marginTop: 2 }}>140 ms</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Real-time edge micro-service</div>
        </div>
      </div>

      {/* Feature Importance & Model Accuracy Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {/* Feature Importance */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>
            📊 Feature Importance (SHAP Value Weights)
          </h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" unit="%" />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc' }} />
                <Bar dataKey="weight" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Accuracy Comparison */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>
            📈 Model Prediction Accuracy Progression (Monsoon 2026)
          </h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ACCURACY_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis domain={[80, 100]} stroke="#94a3b8" unit="%" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc' }} />
                <Line type="monotone" dataKey="Random_Forest" stroke="#94a3b8" strokeWidth={2} />
                <Line type="monotone" dataKey="XGBoost" stroke="#38bdf8" strokeWidth={2} />
                <Line type="monotone" dataKey="Hybrid_LSTM_GNN" stroke="#ec4899" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Physics Model FoS Explanation & Radar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
            📐 Geotechnical Factor of Safety (FoS) Equation
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
            The physical stability of hill slopes is computed using Infinite Slope Hydro-Mechanical Analysis:
          </p>

          <div style={{
            background: '#0f172a',
            padding: 14,
            borderRadius: 8,
            border: '1px solid #334155',
            fontSize: 13,
            color: '#38bdf8',
            fontFamily: 'monospace',
            textAlign: 'center',
            marginBottom: 12
          }}>
            FoS = [ c' + (γ - γw · m) · z · cos²β · tanφ' ] / [ γ · z · sinβ · cosβ ]
          </div>

          <div style={{ fontSize: 11.5, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>• <strong>c'</strong>: Effective Soil Cohesion (kPa)</div>
            <div>• <strong>γ / γw</strong>: Bulk / Water Unit Weight (kN/m³)</div>
            <div>• <strong>m</strong>: Fractional Soil Saturation Ratio (0.0 to 1.0)</div>
            <div>• <strong>z</strong>: Failure plane depth (m)</div>
            <div>• <strong>β</strong>: Slope Incline Angle (degrees)</div>
          </div>

          <div style={{ marginTop: 12, padding: 8, background: '#1e293b', borderRadius: 6, fontSize: 11, color: '#f59e0b' }}>
            ⚡ Critical Condition: When FoS &lt; 1.0, driving gravitational shear force exceeds resisting cohesion, resulting in catastrophic failure.
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
            🎯 Multi-Criteria Radar Comparison
          </h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_PERFORMANCE}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="XGBoost Baseline" dataKey="XGBoost" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                <Radar name="Proposed Hybrid GNN" dataKey="Hybrid_GNN" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
