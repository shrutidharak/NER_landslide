import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { format } from 'date-fns';
import type { Zone } from '../types';
import { getRiskColor, ZONES } from '../data/zones';
import { ALERTS } from '../data/alerts';
import { RiskBadge, AlertStatusBadge } from '../components/shared/StatusBadge';
import SimulationBanner from '../components/shared/SimulationBanner';
import RiskMap from '../components/map/RiskMap';
import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

interface OverviewProps {
  zones?: Zone[];
}

const RISK_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;

export default function Overview({ zones = ZONES }: OverviewProps) {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const activeAlerts = ALERTS.filter(a => a.status === 'ACTIVE' || a.status === 'MONITORING').length;
  const highRisk = zones.filter(z => z.risk === 'HIGH' || z.risk === 'CRITICAL').length;
  const totalRoadsAffected = zones.reduce((s, z) => s + z.affectedRoads, 0);

  const riskCounts = RISK_ORDER.map(r => ({
    risk: r,
    count: zones.filter(z => z.risk === r).length,
    color: getRiskColor(r),
  }));

  const recentAlerts = [...ALERTS].sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime()).slice(0, 5);

  return (
    <div className="page-content" style={{ paddingTop: 0 }}>
      <SimulationBanner />

      <div style={{ padding: '16px 20px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a2744', marginBottom: 4 }}>
            North East Landslide Early Warning System
          </h1>
          <p style={{ fontSize: 12.5, color: '#6b7280' }}>
            Real-time monitoring, risk prediction and emergency response — NER Region
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 4, fontSize: 11.5, fontWeight: 600 }}>
              <span className="status-dot online pulse" /> System Operational
            </span>
            <span style={{ background: '#f1f3f7', color: '#6b7280', padding: '3px 10px', borderRadius: 4, fontSize: 11.5 }}>
              Last update: 8 sec ago
            </span>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 4, fontSize: 11.5 }}>
              {zones.length} monitored zones
            </span>
            <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 10px', borderRadius: 4, fontSize: 11.5 }}>
              {activeAlerts} active alerts
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="card" style={{ padding: 0, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e5eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Live Risk Map — NER Region</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/map')}>
              <MapPin size={11} /> Open Full Map
            </button>
          </div>
          <RiskMap
            zones={zones}
            selectedZoneId={selectedZone?.id}
            onZoneClick={z => setSelectedZone(z)}
            height="360px"
          />
          {selectedZone && (
            <div style={{ padding: '10px 14px', borderTop: '1px solid #e2e5eb', background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{selectedZone.name}</span>
                <RiskBadge risk={selectedZone.risk} />
                <span style={{ fontSize: 12, color: '#6b7280' }}>Rain: {selectedZone.rainfall} mm</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Soil: {selectedZone.soilMoisture}%</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>FoS: {selectedZone.fos}</span>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/map')}>
                View in Map
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="card" style={{ padding: 0, marginBottom: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {[
              { label: 'Active Alerts', value: activeAlerts, color: '#dc2626' },
              { label: 'High-Risk Zones', value: highRisk, color: '#ea580c' },
              { label: 'Sensor Nodes Online', value: '15 / 18', color: '#2563eb' },
              { label: 'Roads Affected', value: totalRoadsAffected, color: '#d97706' },
            ].map(({ label, value, color }) => (
              <div key={label} className="stat-item" style={{ flex: '1 1 120px' }}>
                <span className="stat-value" style={{ color }}>{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Overview + Recent Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginBottom: 14 }}>
          {/* Risk distribution */}
          <div className="card">
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Risk Overview</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={riskCounts} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f1f4" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis dataKey="risk" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} width={55} />
                <Tooltip
                  formatter={(v) => [`${v} zones`, 'Count']}
                  contentStyle={{ fontSize: 11, borderRadius: 4, border: '1px solid #e2e5eb' }}
                />
                <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                  {riskCounts.map(({ risk, color }) => (
                    <Cell key={risk} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 10 }}>
              {riskCounts.map(({ risk, count, color }) => (
                <div key={risk} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid #f0f1f4' }}>
                  <span style={{ fontSize: 11.5, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block' }} />
                    {risk}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{count} zones</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e5eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Recent Alerts</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/alerts')}>View all</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Risk</th>
                    <th>Trigger</th>
                    <th>Status</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map(alert => {
                    const zone = zones.find(z => z.id === alert.zoneId);
                    return (
                      <tr key={alert.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/alerts')}>
                        <td style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
                          {format(alert.triggeredAt, 'hh:mm a')}
                        </td>
                        <td style={{ fontSize: 12, fontWeight: 500 }}>{alert.zoneName}</td>
                        <td><RiskBadge risk={alert.risk} /></td>
                        <td style={{ fontSize: 11.5, color: '#6b7280', maxWidth: 180 }}>{alert.trigger}</td>
                        <td><AlertStatusBadge status={alert.status} /></td>
                        <td>
                          {zone?.trend === 'INCREASING' ? (
                            <TrendingUp size={13} color="#dc2626" />
                          ) : zone?.trend === 'DECREASING' ? (
                            <TrendingDown size={13} color="#16a34a" />
                          ) : (
                            <Minus size={13} color="#9ca3af" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Zone list */}
        <div className="card" style={{ padding: 0, marginBottom: 20 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e5eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>All Monitored Zones</span>
            <SimulationBanner inline />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>State</th>
                  <th>Risk</th>
                  <th>Rainfall</th>
                  <th>Soil Moisture</th>
                  <th>Slope</th>
                  <th>FoS</th>
                  <th>ML Prob.</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {zones.map(zone => (
                  <tr key={zone.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedZone(zone); navigate('/map'); }}>
                    <td style={{ fontWeight: 500, fontSize: 12.5 }}>{zone.name}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{zone.state}</td>
                    <td><RiskBadge risk={zone.risk} /></td>
                    <td style={{ fontSize: 12 }}>{zone.rainfall} mm</td>
                    <td style={{ fontSize: 12 }}>{zone.soilMoisture}%</td>
                    <td style={{ fontSize: 12 }}>{zone.slope}°</td>
                    <td style={{ fontSize: 12, fontWeight: zone.fos < 1.0 ? 600 : 400, color: zone.fos < 1.0 ? '#dc2626' : undefined }}>{zone.fos}</td>
                    <td style={{ fontSize: 12 }}>{(zone.mlProbability * 100).toFixed(0)}%</td>
                    <td>
                      {zone.trend === 'INCREASING' ? (
                        <span style={{ color: '#dc2626', fontSize: 11 }}>↑ Rising</span>
                      ) : zone.trend === 'DECREASING' ? (
                        <span style={{ color: '#16a34a', fontSize: 11 }}>↓ Falling</span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: 11 }}>— Stable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
