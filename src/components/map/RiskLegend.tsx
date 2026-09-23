interface RiskLegendProps {
  compact?: boolean;
}

export default function RiskLegend({ compact = false }: RiskLegendProps) {
  return (
    <div className="card" style={{ padding: compact ? '8px 10px' : '10px 12px' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Map Legend
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>RISK LEVEL</div>
        {[
          { risk: 'CRITICAL', color: '#dc2626' },
          { risk: 'HIGH', color: '#ea580c' },
          { risk: 'MEDIUM', color: '#d97706' },
          { risk: 'LOW', color: '#16a34a' },
        ].map(({ risk, color }) => (
          <div key={risk} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: color, opacity: 0.8 }} />
            <span style={{ fontSize: 11, color: '#374151' }}>{risk}</span>
          </div>
        ))}
      </div>
      {!compact && (
        <>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>SENSORS</div>
            {[
              { label: 'Rainfall', emoji: '🌧' },
              { label: 'Soil Moisture', emoji: '💧' },
              { label: 'Temperature', emoji: '🌡' },
            ].map(({ label, emoji }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 12 }}>{emoji}</span>
                <span style={{ fontSize: 11, color: '#374151' }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>INFRASTRUCTURE</div>
            {[
              { label: 'Shelter', emoji: '🏠' },
              { label: 'Hospital', emoji: '🏥' },
              { label: 'Field Report', emoji: '⚠' },
              { label: 'Rockfall', emoji: '🪨' },
              { label: 'Road Blocked', emoji: '🚧' },
            ].map(({ label, emoji }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 12 }}>{emoji}</span>
                <span style={{ fontSize: 11, color: '#374151' }}>{label}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>ROADS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 3, background: '#16a34a', borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: '#374151' }}>Open</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 3, background: '#d97706', borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: '#374151' }}>Partial Block</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 3, background: '#dc2626', borderRadius: 2, opacity: 0.7 }} />
                <span style={{ fontSize: 11, color: '#374151' }}>Blocked</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
