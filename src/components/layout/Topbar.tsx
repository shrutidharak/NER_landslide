import { useState, useEffect } from 'react';
import { Bell, User, MapPin, RefreshCw, Menu } from 'lucide-react';
import { ALERTS } from '../../data/alerts';

interface TopbarProps {
  lastUpdate?: Date;
  onToggleMobileMenu?: () => void;
}

export default function Topbar({ lastUpdate, onToggleMobileMenu }: TopbarProps) {
  const [secAgo, setSecAgo] = useState(0);

  useEffect(() => {
    if (!lastUpdate) return;
    const tick = () => setSecAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastUpdate]);

  const activeAlerts = ALERTS.filter(a => a.status === 'ACTIVE').length;

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            aria-label="Toggle Navigation"
          >
            <Menu size={20} color="#6b7280" />
          </button>
        )}
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
          <MapPin size={13} />
          <span>NER Regional Disaster Center — Shillong Command</span>
        </div>
        <div style={{ width: 1, height: 16, background: '#e2e5eb' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
          <span className="status-dot online pulse" />
          <span style={{ color: '#15803d', fontWeight: 500 }}>System Operational</span>
        </div>
        <div style={{ width: 1, height: 16, background: '#e2e5eb' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
          <RefreshCw size={12} />
          <span>Updated {secAgo}s ago</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={18} color="#6b7280" />
          {activeAlerts > 0 && (
            <span style={{
              position: 'absolute', top: -5, right: -5,
              background: '#dc2626', color: 'white',
              borderRadius: '50%', width: 14, height: 14,
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{activeAlerts}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          padding: '4px 8px', borderRadius: 4, background: '#f4f5f7' }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: '#1a2744',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={13} color="#93c5fd" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>District Control</span>
        </div>
      </div>
    </header>
  );
}
