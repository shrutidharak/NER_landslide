import { useState } from 'react';
import { Shield, Radio, Send, Users, PhoneCall, CheckCircle2, Lock } from 'lucide-react';
import SimulationBanner from '../components/shared/SimulationBanner';
import { ZONES } from '../data/zones';

export default function Admin() {
  const [selectedZone, setSelectedZone] = useState('Z1');
  const [alertSeverity, setAlertSeverity] = useState<'Extreme' | 'Severe' | 'Moderate'>('Extreme');
  const [headline, setHeadline] = useState('IMMEDIATE EVACUATION NOTICE: NH-27 Slope Failure Imminent');
  const [instructions, setInstructions] = useState('All residents within 500 meters of Km 42 slope cut must move to Relief Camp #1 (Shillong Polytechnic). Road traffic diverted via Mawlyndep.');
  const [channels, setChannels] = useState({
    sms: true,
    siren: true,
    capServer: true,
    radioBroadcast: false,
    whatsappBot: true
  });
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcasting(true);
    setBroadcastSuccess(false);

    setTimeout(() => {
      setBroadcasting(false);
      setBroadcastSuccess(true);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationBanner />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield style={{ color: '#ef4444' }} size={22} />
          District Disaster Management Authority (DDMA) Emergency Command Console
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
          Authorized command dispatch for broadcasting Common Alerting Protocol (CAP XML) feeds, actuating local siren towers, and mobilizing NDRF / SDRF field response forces.
        </p>
      </div>

      {/* Security Clearance Banner */}
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#22c55e' }}>
          <Lock size={15} /> Authenticated User: <strong>DDMA Emergency Officer (East Khasi Hills Command)</strong>
        </div>
        <div style={{ fontSize: 11, color: '#64748b' }}>
          Session ID: SEC-DDMA-2026-0922 • Role: Admin Dispatch
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {/* Emergency Alert Broadcast Panel */}
        <div className="card" style={{ padding: 18 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio style={{ color: '#ef4444' }} size={18} /> Broadcast Emergency Early Warning Alert
          </h2>

          <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Target Zone</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
              >
                {ZONES.map(z => (
                  <option key={z.id} value={z.id}>{z.name} ({z.district})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Alert Severity Level</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['Extreme', 'Severe', 'Moderate'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    className={`btn ${alertSeverity === sev ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => setAlertSeverity(sev)}
                    style={{ flex: 1, fontSize: 12, padding: '6px' }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>CAP Headline Text</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Actionable Instructions</label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>Dissemination Channels</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#cbd5e1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={channels.sms} onChange={(e) => setChannels({...channels, sms: e.target.checked})} />
                  📱 Cell Broadcast SMS Gateway
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={channels.siren} onChange={(e) => setChannels({...channels, siren: e.target.checked})} />
                  🔊 Outdoor Siren Actuation
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={channels.capServer} onChange={(e) => setChannels({...channels, capServer: e.target.checked})} />
                  🌐 National CAP Feed Push
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={channels.whatsappBot} onChange={(e) => setChannels({...channels, whatsappBot: e.target.checked})} />
                  💬 Community WhatsApp Bot
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger"
              disabled={broadcasting}
              style={{ marginTop: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14 }}
            >
              <Send size={16} />
              {broadcasting ? 'Encrypting & Transmitting CAP Feed...' : 'EXECUTE EMERGENCY BROADCAST'}
            </button>

            {broadcastSuccess && (
              <div style={{ background: '#14532d', border: '1px solid #22c55e', color: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
                Broadcast successfully pushed to 14,250 registered SIMs and 3 outdoor sirens!
              </div>
            )}
          </form>
        </div>

        {/* Quick Mobilization & Emergency Contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users style={{ color: '#38bdf8' }} size={18} /> NDRF / SDRF Deployment Mobilization
            </h3>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
              Active response teams stationed at strategic transit nodes across NER.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: '#0f172a', padding: 10, borderRadius: 6, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>1st Battalion NDRF Guwahati</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>2 Battalions • Standby on NH-27</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}>Dispatch</button>
              </div>

              <div style={{ background: '#0f172a', padding: 10, borderRadius: 6, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>Nagaland SDRF Quick Response Unit</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Kohima Base • 45 Personnel</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}>Dispatch</button>
              </div>

              <div style={{ background: '#0f172a', padding: 10, borderRadius: 6, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>Sikkim State Disaster Force</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Gangtok Base • Debris Clearing Team</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}>Dispatch</button>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <PhoneCall style={{ color: '#22c55e' }} size={18} /> Hotlines & Emergency Duty Roster
            </h3>
            <div style={{ fontSize: 12, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>State Emergency Operations Center (SEOC):</span>
                <strong style={{ color: '#38bdf8' }}>1070 / 0364-2225289</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>NDRF Control Room (Guwahati):</span>
                <strong style={{ color: '#38bdf8' }}>0361-2840284</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>BRO Highway Clearance Cell:</span>
                <strong style={{ color: '#38bdf8' }}>0364-2500120</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
