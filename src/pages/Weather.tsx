import { Cloud, CloudRain, Droplets, ShieldAlert } from 'lucide-react';
import SimulationBanner from '../components/shared/SimulationBanner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HOURLY_RAINFALL_DATA = [
  { time: '00:00', actual: 4.2, threshold: 15.0 },
  { time: '03:00', actual: 8.5, threshold: 15.0 },
  { time: '06:00', actual: 18.2, threshold: 15.0 },
  { time: '09:00', actual: 32.6, threshold: 15.0 },
  { time: '12:00', actual: 45.1, threshold: 15.0 },
  { time: '15:00', actual: 28.4, threshold: 15.0 },
  { time: '18:00', actual: 16.0, threshold: 15.0 },
  { time: '21:00', actual: 9.8, threshold: 15.0 },
];

const WEATHER_STATIONS = [
  { id: 'WS-01', name: 'Shillong Peak AWS', lat: 25.57, lng: 91.88, rainfall24h: 142.5, intensity: 'Heavy Monsoon Downpour', status: 'red' },
  { id: 'WS-02', name: 'Kohima Science College AWS', lat: 25.67, lng: 94.11, rainfall24h: 98.2, intensity: 'Moderate Rain', status: 'orange' },
  { id: 'WS-03', name: 'Cherrapunji IMD Station', lat: 25.27, lng: 91.73, rainfall24h: 210.8, intensity: 'Torrential Extremely Heavy', status: 'red' },
  { id: 'WS-04', name: 'Aizawl Meteorological Observatory', lat: 23.72, lng: 92.71, rainfall24h: 76.4, intensity: 'Light to Moderate', status: 'yellow' },
  { id: 'WS-05', name: 'Gangtok IMD AWS', lat: 27.33, lng: 88.61, rainfall24h: 115.0, intensity: 'Heavy Rain', status: 'orange' },
];

export default function Weather() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationBanner />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CloudRain style={{ color: '#0284c7' }} size={22} />
          Meteorological & Hydro-Meteorological Monitoring (IMD / AWS)
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
          Real-time Automatic Weather Station (AWS) data, 3-hour cumulative rainfall thresholds, satellite soil saturation indices, and IMD heavy rainfall alerts for the North Eastern Region.
        </p>
      </div>

      {/* IMD Alert Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(225,29,72,0.15), rgba(15,23,42,0.8))',
        border: '1px solid #f43f5e',
        borderRadius: 8,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert style={{ color: 'white' }} size={24} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fecdd3', display: 'flex', alignItems: 'center', gap: 8 }}>
              IMD RED ALERT: Extremely Heavy Rainfall Warning for East Khasi Hills & West Jaintia Hills
            </div>
            <div style={{ fontSize: 12, color: '#fda4af', marginTop: 2 }}>
              Valid for next 48 hours. Rainfall exceeding 200mm in 24h. Slope saturation critical threshold crossed.
            </div>
          </div>
        </div>
        <button className="btn btn-danger" style={{ fontSize: 12 }}>
          View IMD Radar Satellite Layer
        </button>
      </div>

      {/* Weather Station Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {WEATHER_STATIONS.map(st => (
          <div key={st.id} className="card" style={{ padding: 14, borderTop: `3px solid ${st.status === 'red' ? '#ef4444' : st.status === 'orange' ? '#f97316' : '#eab308'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{st.name}</div>
              <span className={`badge badge-${st.status === 'red' ? 'danger' : st.status === 'orange' ? 'warning' : 'info'}`}>
                {st.rainfall24h} mm / 24h
              </span>
            </div>

            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Cloud size={13} style={{ color: '#38bdf8' }} /> {st.intensity}
            </div>

            <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
              Coordinates: {st.lat}°N, {st.lng}°E
            </div>
          </div>
        ))}
      </div>

      {/* Rainfall Threshold Analysis Chart */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Droplets style={{ color: '#38bdf8' }} size={18} />
              Cumulative Hourly Rainfall vs. Landslide Trigger Threshold (Shillong AWS)
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>
              Continuous rainfall exceeding 15mm/hr for 3 consecutive hours triggers slope stability failure model in granitic gneiss terrain.
            </p>
          </div>
          <span style={{ fontSize: 11, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '4px 8px', borderRadius: 4 }}>
            Threshold Breached between 06:00 - 15:00
          </span>
        </div>

        <div style={{ height: 260, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_RAINFALL_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rainColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" unit=" mm" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f8fafc' }} />
              <Area type="monotone" dataKey="actual" name="Rainfall (mm/hr)" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#rainColor)" />
              <Area type="monotone" dataKey="threshold" name="Landslide Failure Threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Satellite Moisture & Hydro Parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
            🛰 Sentinel-1 Synthetic Aperture Radar (SAR) Soil Saturation Index
          </h3>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
            C-band radar backscatter indicates pore water pressure accumulation in upper 30cm soil column.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#cbd5e1' }}>Shillong - Guwahati Corridor</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>94.2% Saturation</span>
              </div>
              <div style={{ height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '94.2%', height: '100%', background: '#ef4444' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#cbd5e1' }}>Kohima Ridge Zone</span>
                <span style={{ color: '#f97316', fontWeight: 700 }}>78.5% Saturation</span>
              </div>
              <div style={{ height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '78.5%', height: '100%', background: '#f97316' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#cbd5e1' }}>Lunglei Hill Slope</span>
                <span style={{ color: '#eab308', fontWeight: 700 }}>64.1% Saturation</span>
              </div>
              <div style={{ height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '64.1%', height: '100%', background: '#eab308' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
            🌧 Antecedent Rainfall Index (ARI - 7 Days Cumulative)
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
            Prior 7-day accumulated rainfall dictates background ground saturation before short-duration cloudburst events.
          </p>

          <table className="table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>District / Location</th>
                <th>ARI (7-Day)</th>
                <th>Risk State</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: '#f8fafc' }}>East Khasi Hills</td>
                <td style={{ color: '#ef4444', fontWeight: 700 }}>485 mm</td>
                <td><span className="badge badge-danger">CRITICAL</span></td>
              </tr>
              <tr>
                <td style={{ color: '#f8fafc' }}>Kohima District</td>
                <td style={{ color: '#f97316', fontWeight: 700 }}>310 mm</td>
                <td><span className="badge badge-warning">HIGH</span></td>
              </tr>
              <tr>
                <td style={{ color: '#f8fafc' }}>Gangtok East</td>
                <td style={{ color: '#f97316', fontWeight: 700 }}>295 mm</td>
                <td><span className="badge badge-warning">HIGH</span></td>
              </tr>
              <tr>
                <td style={{ color: '#f8fafc' }}>Champhai Mizoram</td>
                <td style={{ color: '#eab308', fontWeight: 700 }}>180 mm</td>
                <td><span className="badge badge-info">MODERATE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
