import type { Alert } from '../../types';
import { RiskBadge, AlertStatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { MessageSquare, MapPin, CheckCircle } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onViewZone?: () => void;
  onAcknowledge?: () => void;
  compact?: boolean;
}

export default function AlertCard({ alert, onViewZone, onAcknowledge, compact = false }: AlertCardProps) {
  const borderColors: Record<string, string> = {
    ACTIVE: '#dc2626',
    MONITORING: '#d97706',
    SENT: '#2563eb',
    RESOLVED: '#16a34a',
  };

  return (
    <div className="card" style={{
      borderLeft: `3px solid ${borderColors[alert.status] ?? '#e2e5eb'}`,
      marginBottom: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RiskBadge risk={alert.risk} />
          <AlertStatusBadge status={alert.status} />
        </div>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>
          {format(alert.triggeredAt, 'hh:mm a')}
        </span>
      </div>

      {/* Zone name */}
      <div style={{ fontWeight: 600, fontSize: 13.5, color: '#1e2532', marginBottom: 4 }}>
        {alert.zoneName}
      </div>

      {/* Description */}
      {!compact && (
        <div style={{ fontSize: 12.5, color: '#4b5563', marginBottom: 10, lineHeight: 1.5 }}>
          {alert.description.slice(0, 180)}{alert.description.length > 180 ? '…' : ''}
        </div>
      )}

      {/* Trigger */}
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: compact ? 0 : 10 }}>
        <span style={{ color: '#9ca3af' }}>Trigger: </span>
        {alert.trigger}
      </div>

      {/* Recipients + Channels */}
      {!compact && (
        <>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 12 }}>
            <div>
              <div style={{ color: '#9ca3af', marginBottom: 3 }}>Recipients</div>
              {alert.recipients.map(r => (
                <div key={r} style={{ color: '#374151' }}>{r}</div>
              ))}
            </div>
            <div>
              <div style={{ color: '#9ca3af', marginBottom: 3 }}>Channels</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {alert.channels.map(c => (
                  <span key={c} style={{
                    background: '#f1f3f7', color: '#374151',
                    padding: '1px 6px', borderRadius: 3, fontSize: 11
                  }}>✓ {c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            {onViewZone && (
              <button className="btn btn-secondary btn-sm" onClick={onViewZone}>
                <MapPin size={12} /> View Zone
              </button>
            )}
            <button className="btn btn-secondary btn-sm">
              <MessageSquare size={12} /> View Alert
            </button>
            {onAcknowledge && alert.status === 'ACTIVE' && (
              <button className="btn btn-ghost btn-sm" onClick={onAcknowledge}>
                <CheckCircle size={12} /> Acknowledge
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
