import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Bell, Radio, FileText, Camera, Cloud,
  Building2, BarChart3, Settings, Shield, ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/map', label: 'Live Risk Map', icon: Map },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/sensors', label: 'Sensor Monitoring', icon: Radio },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/field', label: 'Field Reports', icon: Camera },
  { path: '/weather', label: 'Weather', icon: Cloud },
  { path: '/infrastructure', label: 'Infrastructure', icon: Building2 },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin', label: 'Admin / Response', icon: Shield },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #e2e5eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 6,
            background: 'linear-gradient(135deg,#ea580c,#dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: 'white', fontSize: 14 }}>⛰</span>
          </div>
          <div>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>NER-Landslide</div>
            <div style={{ color: '#64748b', fontSize: 10.5 }}>Early Warning System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8, paddingBottom: 12 }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <a
              key={path}
              className={`nav-item${active ? ' active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon className="nav-icon" size={16} />
              <span>{label}</span>
              {active && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e2e5eb', padding: '10px 14px' }}>
        <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>
          <div style={{ color: '#475569', fontWeight: 600, marginBottom: 2 }}>NER Landslide EWS</div>
          <div>Prototype v1.0 — 2026</div>
          <div>College Hackathon Project</div>
        </div>
      </div>
    </aside>
  );
}
