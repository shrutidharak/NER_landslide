import { useState } from 'react';
import { Building2, MapPin, AlertOctagon } from 'lucide-react';
import SimulationBanner from '../components/shared/SimulationBanner';
import { INFRASTRUCTURE, ROADS, SHELTERS } from '../data/infrastructure';

export default function Infrastructure() {
  const [selectedTab, setSelectedTab] = useState<'roads' | 'shelters' | 'assets'>('roads');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationBanner />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 style={{ color: '#8b5cf6' }} size={22} />
            Critical Infrastructure, Highway Corridors & Relief Shelters
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
            GIS inventory of vulnerable roads, remote habitations, medical centers, emergency evacuation centers, and heavy earthmoving equipment.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #334155', paddingBottom: 8 }}>
        <button
          className={`btn ${selectedTab === 'roads' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedTab('roads')}
        >
          Highway Corridors & Arterial Roads ({ROADS.length})
        </button>
        <button
          className={`btn ${selectedTab === 'shelters' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedTab('shelters')}
        >
          Relief & Evacuation Shelters ({SHELTERS.length})
        </button>
        <button
          className={`btn ${selectedTab === 'assets' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedTab('assets')}
        >
          Vulnerable Assets & Hospitals ({INFRASTRUCTURE.length})
        </button>
      </div>

      {/* ROADS TAB */}
      {selectedTab === 'roads' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {ROADS.map(road => {
            const isBlocked = road.status === 'BLOCKED';
            const isPartial = road.status === 'PARTIALLY_BLOCKED';
            const code = road.code ?? road.id;
            const lengthKm = road.lengthKm ?? 24;
            const alternateRoute = road.alternateRoute ?? 'State Bypass via Mawlyndep';

            return (
              <div key={road.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                      {code}
                    </span>
                    <span className={`badge badge-${isBlocked ? 'danger' : isPartial ? 'warning' : 'success'}`}>
                      {road.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
                    {road.name}
                  </h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                    Corridor length: {lengthKm} km • Vulnerable cut-slopes: 14 sections
                  </div>

                  <div style={{ background: '#0f172a', padding: 10, borderRadius: 6, border: '1px solid #334155', fontSize: 12, marginBottom: 12 }}>
                    <div style={{ color: '#cbd5e1', fontWeight: 600, marginBottom: 2 }}>Alternate Detour Route:</div>
                    <div style={{ color: '#38bdf8' }}>{alternateRoute}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #334155', fontSize: 11, color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: isBlocked ? '#ef4444' : '#22c55e' }}>
                    <AlertOctagon size={14} /> PWD Clearing Status: {isBlocked ? 'Earthmover Deployment in progress' : 'Clear for traffic'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SHELTERS TAB */}
      {selectedTab === 'shelters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {SHELTERS.map(shelter => {
            const loc = shelter.location ?? `${shelter.district} District Center`;
            const contactPerson = shelter.contactPerson ?? 'District Relief Officer';
            const contactPhone = shelter.contactPhone ?? '0364-2225289';

            return (
              <div key={shelter.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{shelter.name}</h3>
                    <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <MapPin size={13} style={{ color: '#22c55e' }} /> {loc}
                    </div>
                  </div>
                  <span className="badge badge-success">{shelter.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '12px 0', background: '#0f172a', padding: 10, borderRadius: 6, border: '1px solid #334155' }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: '#64748b' }}>Total Capacity</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>{shelter.capacity} People</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: '#64748b' }}>Current Occupancy</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8' }}>{shelter.currentOccupancy} People</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: '#cbd5e1' }}>
                  <strong>Contact Officer:</strong> {contactPerson} ({contactPhone})
                </div>

                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {shelter.facilities.map((fac, idx) => (
                    <span key={idx} style={{ fontSize: 10, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '2px 6px', borderRadius: 4 }}>
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ASSETS TAB */}
      {selectedTab === 'assets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {INFRASTRUCTURE.map(item => {
            const vuln = item.vulnerability ?? (item.status === 'DAMAGED' ? 'high' : item.status === 'CLOSED' ? 'medium' : 'low');
            const desc = item.description ?? item.details ?? 'Critical regional infrastructure node.';
            const lng = item.lng ?? item.lon;
            const zoneId = item.zoneId ?? 'Z1';

            return (
              <div key={item.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{item.name}</h3>
                    <div style={{ fontSize: 11, color: '#8b5cf6', textTransform: 'uppercase', fontWeight: 600 }}>{item.type.replace('_', ' ')}</div>
                  </div>
                  <span className={`badge badge-${vuln === 'high' ? 'danger' : vuln === 'medium' ? 'warning' : 'info'}`}>
                    {vuln.toUpperCase()} VULNERABILITY
                  </span>
                </div>

                <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: '8px 0' }}>
                  {desc}
                </p>

                <div style={{ fontSize: 11, color: '#64748b', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: 8 }}>
                  <span>GPS: {item.lat}, {lng}</span>
                  <span style={{ color: '#38bdf8' }}>Nearest Zone: {zoneId}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
