export default function SimulationBanner({ inline = false }: { inline?: boolean }) {
  if (inline) {
    return (
      <span className="sim-banner">
        ● DEMO / SIMULATION DATA
      </span>
    );
  }
  return (
    <div style={{
      background: '#fef3c7', borderBottom: '1px solid #fbbf24',
      padding: '5px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 11.5, color: '#92400e', fontWeight: 500
    }}>
      <span style={{ fontWeight: 700 }}>● DEMO / SIMULATION DATA</span>
      <span style={{ opacity: 0.8 }}>Sensor readings and risk values are simulated for demonstration purposes. Not real sensor data.</span>
    </div>
  );
}
