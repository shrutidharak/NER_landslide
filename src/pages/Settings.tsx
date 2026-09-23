import { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Globe, Database, Save } from 'lucide-react';
import SimulationBanner from '../components/shared/SimulationBanner';

export default function Settings() {
  const [backendUrl, setBackendUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1');
  const [pollingRate, setPollingRate] = useState('30');
  const [language, setLanguage] = useState('en');
  const [rainThreshold, setRainThreshold] = useState('15');
  const [porePressureThreshold, setPorePressureThreshold] = useState('25');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationBanner />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingsIcon style={{ color: '#94a3b8' }} size={22} />
          System Settings & Model Parameter Configuration
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
          Configure API endpoints, threshold sensitivity parameters, IoT telemetry polling interval, and regional multilingual preferences.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {/* Backend API & Integration settings */}
        <div className="card" style={{ padding: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database style={{ color: '#38bdf8' }} size={18} /> Backend API & FastAPI Integration
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>FastAPI Backend Base URL</label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
              />
              <span style={{ fontSize: 10.5, color: '#64748b', marginTop: 2, display: 'block' }}>
                Set `VITE_API_BASE_URL` in `.env` to connect real FastAPI / PyTorch backend.
              </span>
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>IoT Telemetry Polling Rate</label>
              <select
                value={pollingRate}
                onChange={(e) => setPollingRate(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
              >
                <option value="10">Every 10 seconds (Ultra-realtime debug)</option>
                <option value="30">Every 30 seconds (Default)</option>
                <option value="60">Every 60 seconds (Monsoon mode)</option>
                <option value="300">Every 5 minutes (Low power mode)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Model Threshold Sensitivity Settings */}
        <div className="card" style={{ padding: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders style={{ color: '#ea580c' }} size={18} /> Physics Threshold Sensitivity
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                <span>Continuous Rainfall Trigger Threshold (mm/hr):</span>
                <strong style={{ color: '#ea580c' }}>{rainThreshold} mm/hr</strong>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={rainThreshold}
                onChange={(e) => setRainThreshold(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>
                <span>Pore-Water Pressure Critical Alert (kPa):</span>
                <strong style={{ color: '#ea580c' }}>{porePressureThreshold} kPa</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={porePressureThreshold}
                onChange={(e) => setPorePressureThreshold(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Multilingual & Localization */}
        <div className="card" style={{ padding: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe style={{ color: '#22c55e' }} size={18} /> Multilingual Alert Localization (NER Regional)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>System Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
              >
                <option value="en">English (Official Default)</option>
                <option value="as">অসমীয়া (Assamese)</option>
                <option value="kha">Khasi (Meghalaya)</option>
                <option value="mzo">Mizo (Mizoram)</option>
                <option value="nag">Nagamese (Nagaland)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
          {saved && <span style={{ color: '#22c55e', fontSize: 13 }}>✓ Settings saved successfully!</span>}
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
