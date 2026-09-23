import { useState } from 'react';
import { ALERTS } from '../data/alerts';
import { RiskBadge } from '../components/shared/StatusBadge';
import SimulationBanner from '../components/shared/SimulationBanner';
import { format, addHours } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ALERT_ID = 'ALT-001'; // Default to first alert

export default function CAPDetails() {
  const alert = ALERTS.find(a => a.id === ALERT_ID) ?? ALERTS[0];
  const [showXML, setShowXML] = useState(false);

  const effective = alert.triggeredAt;
  const expires = addHours(alert.triggeredAt, 6);

  const severity =
    alert.risk === 'CRITICAL' ? 'Extreme' :
    alert.risk === 'HIGH' ? 'Severe' :
    alert.risk === 'MEDIUM' ? 'Moderate' : 'Minor';

  const capXML = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alert.id}</identifier>
  <sender>ner-ews@sdma.gov.in</sender>
  <sent>${effective.toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <language>en-IN</language>
    <category>Geo</category>
    <event>Landslide</event>
    <urgency>${alert.status === 'ACTIVE' ? 'Immediate' : 'Expected'}</urgency>
    <severity>${severity}</severity>
    <certainty>Likely</certainty>
    <effective>${effective.toISOString()}</effective>
    <expires>${expires.toISOString()}</expires>
    <headline>${alert.headline}</headline>
    <description>${alert.description}</description>
    <instruction>${alert.instruction}</instruction>
    <area>
      <areaDesc>${alert.affectedArea}</areaDesc>
    </area>
  </info>
</alert>`;

  return (
    <div className="page-content">
      <SimulationBanner />
      <div style={{ paddingTop: 16, maxWidth: 720 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', marginBottom: 4 }}>
            COMMON ALERTING PROTOCOL — ALERT
          </div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: '#1a2744', marginBottom: 3 }}>{alert.headline}</h1>
          <RiskBadge risk={alert.risk} />
        </div>

        {/* Field grid */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Hazard', value: 'Landslide' },
              { label: 'Severity', value: severity },
              { label: 'Urgency', value: alert.status === 'ACTIVE' ? 'Immediate' : 'Expected' },
              { label: 'Certainty', value: 'Likely' },
              { label: 'Area', value: alert.affectedArea },
              { label: 'Sender', value: 'NER-EWS / SDMA' },
              { label: 'Effective', value: format(effective, 'dd MMM yyyy, HH:mm') },
              { label: 'Expires', value: format(expires, 'dd MMM yyyy, HH:mm') },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: '#1e2532', fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>DESCRIPTION</div>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{alert.description}</p>
        </div>

        {/* Instruction */}
        <div className="card" style={{ marginBottom: 14, borderLeft: '3px solid #dc2626' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>INSTRUCTION TO PUBLIC</div>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{alert.instruction}</p>
        </div>

        {/* Channels */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>SENT VIA</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {alert.channels.map(c => (
              <span key={c} style={{
                background: '#dbeafe', color: '#1d4ed8',
                padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500
              }}>✓ {c}</span>
            ))}
          </div>
        </div>

        {/* CAP XML */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showXML ? 10 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>CAP XML PREVIEW</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowXML(!showXML)}>
              {showXML ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showXML ? 'Hide XML' : 'View CAP XML'}
            </button>
          </div>
          {showXML && (
            <pre style={{
              background: '#1a2744', color: '#a8d4ff',
              padding: '12px', borderRadius: 4,
              fontSize: 11, lineHeight: 1.6,
              overflowX: 'auto', margin: 0,
            }}>
              {capXML}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
