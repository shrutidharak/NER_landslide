import { useState } from 'react';
import { SENSORS } from '../data/sensors';
import { SensorStatusBadge } from '../components/shared/StatusBadge';
import SensorChart from '../components/shared/SensorChart';
import SimulationBanner from '../components/shared/SimulationBanner';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PIPELINE_STEPS = ['ESP32 IoT Gateway', 'MQTT', 'AWS IoT Core', 'Amazon Kinesis', 'FastAPI / ECS', 'InfluxDB', 'Risk Engine'];

export default function SensorMonitoring() {
  const [selected, setSelected] = useState<typeof SENSORS[0] | null>(SENSORS[0]);
  const [showPipeline, setShowPipeline] = useState(false);
  const [search, setSearch] = useState('');

  const online = SENSORS.filter(s => s.status === 'ONLINE').length;
  const offline = SENSORS.filter(s => s.status === 'OFFLINE').length;
  const warning = SENSORS.filter(s => s.status === 'WARNING').length;

  const filtered = SENSORS.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.zoneName.toLowerCase().includes(search.toLowerCase())
  );

  const typeEmoji = (t: string) =>
    t === 'RAINFALL' ? '🌧' : t === 'SOIL_MOISTURE' ? '💧' : '🌡';

  return (
    <div className="page-content">
      <SimulationBanner />
      <div style={{ paddingTop: 16 }}>
        <div style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: '#1a2744', marginBottom: 3 }}>Sensor Network</h1>
          <p style={{ fontSize: 12, color: '#6b7280' }}>IoT sensor nodes across the NER monitoring zones.</p>
        </div>

        {/* Stats */}
        <div className="card" style={{ padding: 0, marginBottom: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div className="stat-item" style={{ flex: '1 1 100px' }}>
              <span className="stat-value">{SENSORS.length}</span>
              <span className="stat-label">Total Sensors</span>
            </div>
            <div className="stat-item" style={{ flex: '1 1 100px' }}>
              <span className="stat-value" style={{ color: '#16a34a' }}>{online}</span>
              <span className="stat-label">Online</span>
            </div>
            <div className="stat-item" style={{ flex: '1 1 100px' }}>
              <span className="stat-value" style={{ color: '#dc2626' }}>{offline}</span>
              <span className="stat-label">Offline</span>
            </div>
            <div className="stat-item" style={{ flex: '1 1 100px' }}>
              <span className="stat-value" style={{ color: '#d97706' }}>{warning}</span>
              <span className="stat-label">Warning</span>
            </div>
          </div>
        </div>

        {/* Data pipeline expandable */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setShowPipeline(!showPipeline)}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Data Pipeline</div>
            <button className="btn btn-ghost btn-sm">
              {showPipeline ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showPipeline ? 'Hide' : 'How data reaches the system'}
            </button>
          </div>
          {showPipeline && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="pipeline-step">{step}</div>
                  {i < PIPELINE_STEPS.length - 1 && <span style={{ color: '#9ca3af', fontSize: 14 }}>→</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Sensor list */}
          <div>
            <div style={{ marginBottom: 8 }}>
              <input
                placeholder="Search sensor or zone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filtered.map(sensor => (
                <div
                  key={sensor.id}
                  className="card-sm"
                  onClick={() => setSelected(sensor)}
                  style={{
                    cursor: 'pointer',
                    border: selected?.id === sensor.id ? '1px solid #2563eb' : '1px solid #e2e5eb',
                    background: selected?.id === sensor.id ? '#f0f7ff' : 'white',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                        <span style={{ fontSize: 14 }}>{typeEmoji(sensor.type)}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1a2744' }}>{sensor.id}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{sensor.zoneName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <SensorStatusBadge status={sensor.status} />
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e2532', marginTop: 3 }}>
                        {sensor.value} <span style={{ fontSize: 10, fontWeight: 400, color: '#9ca3af' }}>{sensor.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatDistanceToNow(sensor.lastUpdate, { addSuffix: true })}</span>
                    <span>Batt: {sensor.battery}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensor detail + chart */}
          {selected && (
            <div>
              <div className="card" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a2744', marginBottom: 2 }}>
                      {typeEmoji(selected.type)} {selected.id}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{selected.zoneName}</div>
                  </div>
                  <SensorStatusBadge status={selected.status} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
                  {[
                    { label: 'Current Reading', value: `${selected.value} ${selected.unit}` },
                    { label: 'Battery', value: `${selected.battery}%` },
                    { label: 'Last Update', value: formatDistanceToNow(selected.lastUpdate, { addSuffix: true }) },
                    { label: 'Coordinates', value: `${selected.lat.toFixed(3)}, ${selected.lon.toFixed(3)}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1e2532' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Last 24 Hours — {selected.type.replace('_', ' ')}
                </div>
                <SensorChart sensor={selected} height={160} />
              </div>

              {/* Battery indicator */}
              <div className="card" style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Battery Level</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="risk-bar" style={{ flex: 1 }}>
                    <div
                      className="risk-bar-fill"
                      style={{
                        width: `${selected.battery}%`,
                        background: selected.battery > 50 ? '#16a34a' : selected.battery > 20 ? '#d97706' : '#dc2626'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{selected.battery}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
