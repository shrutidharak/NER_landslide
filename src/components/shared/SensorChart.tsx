import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import type { Sensor } from '../../types';
import { format } from 'date-fns';

interface SensorChartProps {
  sensor: Sensor;
  height?: number;
  showThreshold?: boolean;
}

const THRESHOLDS: Record<string, number> = {
  RAINFALL: 100,
  SOIL_MOISTURE: 65,
  TEMPERATURE: 35,
};

const COLORS: Record<string, string> = {
  RAINFALL: '#2563eb',
  SOIL_MOISTURE: '#d97706',
  TEMPERATURE: '#dc2626',
};

export default function SensorChart({ sensor, height = 140, showThreshold = true }: SensorChartProps) {
  const data = sensor.history.map(h => ({
    time: format(h.time, 'HH:mm'),
    value: Math.round(h.value * 10) / 10,
  }));

  const color = COLORS[sensor.type] ?? '#2563eb';
  const threshold = THRESHOLDS[sensor.type];

  const minVal = Math.min(...data.map(d => d.value));
  const maxVal = Math.max(...data.map(d => d.value));
  const yMin = Math.floor(minVal * 0.9);
  const yMax = Math.ceil(maxVal * 1.1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#1a2744', color: '#e2eaf8',
          padding: '6px 10px', borderRadius: 4, fontSize: 11.5
        }}>
          <div style={{ color: '#7a90b8', marginBottom: 2 }}>{label}</div>
          <div style={{ fontWeight: 600 }}>{payload[0].value} {sensor.unit}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          domain={[yMin, yMax]}
        />
        <Tooltip content={<CustomTooltip />} />
        {showThreshold && threshold && (
          <ReferenceLine
            y={threshold}
            stroke="#ea580c"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{ value: 'Threshold', position: 'right', fontSize: 9, fill: '#ea580c' }}
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
