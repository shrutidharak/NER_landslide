import { useState } from 'react';
import RiskMap from '../components/map/RiskMap';
import RiskLegend from '../components/map/RiskLegend';
import { RiskBadge } from '../components/shared/StatusBadge';
import SimulationBanner from '../components/shared/SimulationBanner';
import type { Zone, RouteOption } from '../types';
import { SHELTERS } from '../data/infrastructure';
import { ZONES } from '../data/zones';
import { planEvacuation, findNearestShelter } from '../hooks/useEvacuation';
import { TrendingUp, Minus, TrendingDown, Navigation, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface LiveRiskMapProps {
  zones?: Zone[];
}

const LAYER_LABELS: Record<string, string> = {
  mlRisk: 'Risk Zones',
  rainfall: 'Rainfall',
  soilMoisture: 'Soil Moisture',
  roads: 'Roads',
  villages: 'Villages',
  infrastructure: 'Infrastructure',
  sensors: 'Sensors',
  fieldReports: 'Field Reports',
  shelters: 'Shelters',
  history: 'Landslide History',
};

export default function LiveRiskMap({ zones = ZONES }: LiveRiskMapProps) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones.find(z => z.risk === 'CRITICAL') ?? zones[0]);
  const [layers, setLayers] = useState({
    mlRisk: true, rainfall: false, soilMoisture: false,
    roads: true, villages: true, infrastructure: true,
    sensors: true, fieldReports: true, shelters: true, history: false,
  });
  const [showEvacPlanner, setShowEvacPlanner] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [evacuationPlan, setEvacuationPlan] = useState<ReturnType<typeof planEvacuation> | null>(null);
  const [showEvacMode, setShowEvacMode] = useState(false);
  const [selectedShelter] = useState<typeof SHELTERS[0] | null>(null);

  const toggleLayer = (k: string) => setLayers(prev => ({ ...prev, [k]: !prev[k as keyof typeof prev] }));

  const handlePlanRoute = () => {
    if (!selectedZone) return;
    const shelter = selectedShelter ?? findNearestShelter(selectedZone);
    if (!shelter) return;
    const plan = planEvacuation(selectedZone, shelter);
    setEvacuationPlan(plan);
    setSelectedRoute(plan.routes[0]);
    setShowEvacPlanner(true);
  };

  const routeLabelText = (label: RouteOption['label']) =>
    label === 'LOW_RISK' ? 'Low-Risk Route' : label === 'FASTEST' ? 'Fastest Route' : 'Alternate Route';

  const routeLabelColor = (r: RouteOption) =>
    r.risk === 'LOW' ? '#16a34a' : r.risk === 'MEDIUM' ? '#d97706' : '#ea580c';

  return (
    <div className="map-page" style={{ position: 'relative' }}>
      {/* Evacuation mode overlay */}
      {showEvacMode && (
        <div className="evac-overlay">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.1em', marginBottom: 8 }}>
              ⚠ EVACUATION MODE ACTIVE
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {selectedZone?.name ?? 'Selected Zone'}
            </div>
            <RiskBadge risk={selectedZone?.risk ?? 'HIGH'} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '16px 24px', width: '100%', maxWidth: 360, marginBottom: 20 }}>
            {[
              { label: 'Nearest Shelter', value: findNearestShelter(selectedZone!)?.name ?? 'Calculating…' },
              { label: 'Emergency Contact', value: 'SDMA: 1800-345-3696' },
              { label: 'Field Team', value: 'Response Team 01 — En Route' },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 10, color: '#7a90b8', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-danger" onClick={() => setShowEvacMode(false)}>
            <X size={14} /> Exit Evacuation Mode
          </button>
        </div>
      )}

      {/* Map */}
      <div className="map-container" style={{ position: 'relative' }}>
        {/* Top controls */}
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 900,
          display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          <SimulationBanner inline />
          <button
            className="btn btn-danger btn-sm"
            style={{ zIndex: 900 }}
            onClick={() => setShowEvacMode(true)}
          >
            ⚠ Evacuation Mode
          </button>
        </div>

        <RiskMap
          zones={zones}
          selectedZoneId={selectedZone?.id}
          onZoneClick={z => { setSelectedZone(z); setShowEvacPlanner(false); setSelectedRoute(null); }}
          layers={layers}
          evacuationRoute={selectedRoute}
          height="100%"
        />
      </div>

      {/* Right panel */}
      <div className="map-panel">
        {/* Layer controls */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e5eb' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
            Map Layers
          </div>
          {Object.entries(LAYER_LABELS).map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, cursor: 'pointer', fontSize: 12.5, color: '#374151' }}>
              <input
                type="checkbox"
                checked={layers[key as keyof typeof layers]}
                onChange={() => toggleLayer(key)}
                style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2563eb' }}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Legend */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e5eb' }}>
          <RiskLegend compact />
        </div>

        {/* Selected zone */}
        {selectedZone && !showEvacPlanner && (
          <div style={{ padding: '12px 14px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
              Selected Zone
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a2744', marginBottom: 6 }}>{selectedZone.name}</div>
            <div style={{ marginBottom: 10 }}><RiskBadge risk={selectedZone.risk} /></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
              {[
                { label: 'ML Probability', value: selectedZone.mlProbability.toFixed(2) },
                { label: 'TRIGRS FoS', value: selectedZone.fos.toFixed(2), warn: selectedZone.fos < 1.0 },
                { label: 'Rainfall', value: `${selectedZone.rainfall} mm` },
                { label: 'Soil Moisture', value: `${selectedZone.soilMoisture}%` },
                { label: 'Slope', value: `${selectedZone.slope}°` },
                { label: 'Risk Score', value: selectedZone.finalRiskScore.toFixed(2) },
              ].map(({ label, value, warn }) => (
                <div key={label} className="card-sm">
                  <div style={{ fontSize: 9.5, color: '#9ca3af', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: warn ? '#dc2626' : '#1e2532' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              {selectedZone.trend === 'INCREASING' ? (
                <><TrendingUp size={13} color="#dc2626" /><span style={{ color: '#dc2626' }}>Risk increasing</span></>
              ) : selectedZone.trend === 'DECREASING' ? (
                <><TrendingDown size={13} color="#16a34a" /><span style={{ color: '#16a34a' }}>Risk decreasing</span></>
              ) : (
                <><Minus size={13} color="#9ca3af" /><span>Stable</span></>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePlanRoute}>
                <Navigation size={13} /> Plan Safe Route
              </button>
            </div>
          </div>
        )}

        {/* Evacuation planner */}
        {showEvacPlanner && evacuationPlan && (
          <div style={{ padding: '12px 14px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a2744' }}>Route Planner</div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowEvacPlanner(false); setSelectedRoute(null); }}>
                <X size={12} />
              </button>
            </div>

            <div className="card-sm" style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 2 }}>From</div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{evacuationPlan.fromZone.name}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, marginBottom: 2 }}>To</div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{evacuationPlan.toShelter.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                Capacity: {evacuationPlan.toShelter.currentOccupancy}/{evacuationPlan.toShelter.capacity} ·{' '}
                <span style={{ color: '#15803d' }}>● {evacuationPlan.toShelter.status}</span>
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>ROUTE OPTIONS</div>

            {evacuationPlan.routes.map(route => (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                style={{
                  padding: '10px 12px',
                  border: `2px solid ${selectedRoute?.id === route.id ? routeLabelColor(route) : '#e2e5eb'}`,
                  borderRadius: 5, marginBottom: 8, cursor: 'pointer',
                  background: selectedRoute?.id === route.id ? '#fafbfc' : 'white',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: routeLabelColor(route) }}>
                    {routeLabelText(route.label)}
                  </span>
                  <RiskBadge risk={route.risk} />
                </div>
                <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>
                  {route.distance} km · ~{route.duration} min
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>
                  {route.blockedRoads === 0 ? '✓ No blocked roads' : `⚠ ${route.blockedRoads} blocked road`}
                  {route.highRiskSegments > 0 && ` · ⚠ ${route.highRiskSegments} medium-risk segment`}
                </div>
              </div>
            ))}

            {selectedRoute && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 6 }}>ROUTE CHECK</div>
                {selectedRoute.safetyChecks.map(({ label, passed }) => (
                  <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5, fontSize: 11.5 }}>
                    {passed
                      ? <CheckCircle size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                      : <AlertTriangle size={13} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />}
                    <span style={{ color: passed ? '#15803d' : '#b45309' }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
