import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Bell, Camera, Shield } from 'lucide-react';

const items = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/map', label: 'Map', icon: Map },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/field', label: 'Reports', icon: Camera },
  { path: '/admin', label: 'Response', icon: Shield },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="mobile-nav">
      {items.map(({ path, label, icon: Icon }) => (
        <button
          key={path}
          className={`mobile-nav-item${location.pathname === path ? ' active' : ''}`}
          onClick={() => navigate(path)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', flex: 1 }}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
