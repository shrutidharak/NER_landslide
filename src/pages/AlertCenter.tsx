import { useState } from 'react';
import { ALERTS } from '../data/alerts';
import AlertCard from '../components/shared/AlertCard';
import SimulationBanner from '../components/shared/SimulationBanner';
import type { AlertStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TABS: { label: string; filter: AlertStatus | 'ALL' }[] = [
  { label: 'All', filter: 'ALL' },
  { label: 'Active', filter: 'ACTIVE' },
  { label: 'Monitoring', filter: 'MONITORING' },
  { label: 'Sent', filter: 'SENT' },
  { label: 'Resolved', filter: 'RESOLVED' },
];

const FLOW_STEPS = [
  { label: 'Alert Engine', sub: 'Risk threshold crossed', color: '#dc2626' },
  { label: 'CAP Alert', sub: 'Common Alerting Protocol', color: '#ea580c' },
  { label: 'Govt. Alert Layer', sub: 'SDMA / District EOC', color: '#d97706' },
  { label: 'Broadcast', sub: 'Cell / SACHET / SMS', color: '#2563eb' },
  { label: 'Citizens', sub: 'Field officers & public', color: '#16a34a' },
];

export default function AlertCenter() {
  const [activeTab, setActiveTab] = useState<AlertStatus | 'ALL'>('ALL');
  const navigate = useNavigate();

  const filtered = activeTab === 'ALL'
    ? ALERTS
    : ALERTS.filter(a => a.status === activeTab);

  const sorted = [...filtered].sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());

  return (
    <div className="page-content">
      <SimulationBanner />

      <div style={{ paddingTop: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: '#1a2744', marginBottom: 3 }}>Alert Center</h1>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Manage and review all system alerts for the NER region.</p>
        </div>

        {/* Alert flow */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em', marginBottom: 12 }}>
            ALERT DISPATCH FLOW
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', minWidth: 100 }}>
                  <div style={{
                    background: step.color + '18', border: `1px solid ${step.color}40`,
                    borderRadius: 6, padding: '8px 10px', marginBottom: 3
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: step.color }}>{step.label}</div>
                    <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{step.sub}</div>
                  </div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <ArrowRight size={16} color="#d1d5db" style={{ flexShrink: 0, margin: '0 4px' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11.5, color: '#6b7280' }}>
            Notification channels: <span style={{ color: '#374151', fontWeight: 500 }}>SMS · IVR/Voice · WhatsApp · Mobile Push · Cell Broadcast · SACHET · Local Siren · LoRa</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          {TABS.map(({ label, filter }) => (
            <div
              key={filter}
              className={`tab${activeTab === filter ? ' active' : ''}`}
              onClick={() => setActiveTab(filter)}
            >
              {label}
              {filter !== 'ALL' && (
                <span style={{
                  marginLeft: 5,
                  background: activeTab === filter ? '#dbeafe' : '#f1f3f7',
                  color: activeTab === filter ? '#1d4ed8' : '#9ca3af',
                  padding: '0 5px', borderRadius: 10, fontSize: 10, fontWeight: 600
                }}>
                  {ALERTS.filter(a => a.status === filter).length}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Alert cards */}
        <div>
          {sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              No alerts in this category.
            </div>
          ) : (
            sorted.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onViewZone={() => navigate('/map')}
                onAcknowledge={() => {/* mock acknowledge */}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
