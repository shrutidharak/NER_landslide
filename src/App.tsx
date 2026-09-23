import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MobileNav from './components/layout/MobileNav';

// Pages
import Overview from './pages/Overview';
import LiveRiskMap from './pages/LiveRiskMap';
import AlertCenter from './pages/AlertCenter';
import CAPDetails from './pages/CAPDetails';
import SensorMonitoring from './pages/SensorMonitoring';
import FieldReports from './pages/FieldReports';
import Weather from './pages/Weather';
import Infrastructure from './pages/Infrastructure';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-shell">
        {/* Left Sidebar Nav */}
        <Sidebar />

        {/* Right Main Area (Topbar + Page Content) */}
        <div className="main-area">
          <Topbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <MobileNav />

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/map" element={<LiveRiskMap />} />
              <Route path="/alerts" element={<AlertCenter />} />
              <Route path="/alerts/:id" element={<CAPDetails />} />
              <Route path="/reports" element={<CAPDetails />} />
              <Route path="/sensors" element={<SensorMonitoring />} />
              <Route path="/field" element={<FieldReports />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
