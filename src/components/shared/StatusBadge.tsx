import type { RiskLevel, SensorStatus } from '../../types';

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return <span className={`risk-badge ${risk}`}>{risk}</span>;
}

export function SensorStatusBadge({ status }: { status: SensorStatus }) {
  const cfg = {
    ONLINE:  { dot: 'online',  label: 'Online',  color: '#15803d', bg: '#dcfce7' },
    OFFLINE: { dot: 'offline', label: 'Offline', color: '#b91c1c', bg: '#fee2e2' },
    WARNING: { dot: 'warning', label: 'Warning', color: '#b45309', bg: '#fef3c7' },
  }[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 3,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600
    }}>
      <span className={`status-dot ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function AlertStatusBadge({ status }: { status: string }) {
  const cfg: Record<string,{bg:string;color:string}> = {
    ACTIVE:     { bg: '#fee2e2', color: '#b91c1c' },
    MONITORING: { bg: '#fef3c7', color: '#b45309' },
    SENT:       { bg: '#dbeafe', color: '#1d4ed8' },
    RESOLVED:   { bg: '#f0fdf4', color: '#15803d' },
  };
  const c = cfg[status] ?? { bg: '#f1f3f7', color: '#6b7280' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px', borderRadius: 3,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600
    }}>{status}</span>
  );
}

export function RoadStatusBadge({ status }: { status: string }) {
  const cfg: Record<string,{bg:string;color:string;label:string}> = {
    OPEN:              { bg: '#dcfce7', color: '#15803d', label: 'Open' },
    PARTIALLY_BLOCKED: { bg: '#fef3c7', color: '#b45309', label: 'Partial Block' },
    BLOCKED:           { bg: '#fee2e2', color: '#b91c1c', label: 'Blocked' },
    OPERATIONAL:       { bg: '#dbeafe', color: '#1d4ed8', label: 'Operational' },
    DAMAGED:           { bg: '#ffedd5', color: '#c2410c', label: 'Damaged' },
    CLOSED:            { bg: '#fee2e2', color: '#b91c1c', label: 'Closed' },
  };
  const c = cfg[status] ?? { bg: '#f1f3f7', color: '#6b7280', label: status };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px', borderRadius: 3,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600
    }}>{c.label}</span>
  );
}
