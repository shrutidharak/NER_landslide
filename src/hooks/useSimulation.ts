import { useState, useEffect, useRef } from 'react';
import { ZONES } from '../data/zones';
import type { Zone, RiskLevel } from '../types';

function computeRisk(z: Zone): RiskLevel {
  const score = z.finalRiskScore;
  if (score >= 0.85) return 'CRITICAL';
  if (score >= 0.65) return 'HIGH';
  if (score >= 0.40) return 'MEDIUM';
  return 'LOW';
}

export interface SimulationState {
  zones: Zone[];
  lastUpdate: Date;
  tick: number;
}

export function useSimulation(intervalMs = 8000): SimulationState {
  const [state, setState] = useState<SimulationState>({
    zones: ZONES.map(z => ({ ...z })),
    lastUpdate: new Date(),
    tick: 0,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const id = setInterval(() => {
      const current = stateRef.current;
      const updated = current.zones.map(zone => {
        // Only actively simulate high/medium risk zones more aggressively
        const isActive = zone.risk === 'HIGH' || zone.risk === 'CRITICAL' || zone.risk === 'MEDIUM';
        const factor = isActive ? 1 : 0.3;

        const deltaRainfall = (Math.random() * 3 - 0.5) * factor;
        const deltaSoil = (Math.random() * 1.5 - 0.3) * factor;
        const deltaFoS = (-Math.random() * 0.008) * factor;
        const deltaML = (Math.random() * 0.008) * factor;

        const newRainfall = Math.max(0, Math.min(220, zone.rainfall + deltaRainfall));
        const newSoil = Math.max(10, Math.min(95, zone.soilMoisture + deltaSoil));
        const newFoS = Math.max(0.50, Math.min(2.5, zone.fos + deltaFoS));
        const newML = Math.max(0.01, Math.min(0.99, zone.mlProbability + deltaML));

        // Hybrid risk score (simplified)
        const fosRisk = newFoS < 1.0 ? (1 - newFoS) * 0.6 : 0;
        const mlComponent = newML * 0.4;
        const rainfallFactor = Math.min(1, newRainfall / 200) * 0.15;
        const soilFactor = Math.min(1, newSoil / 100) * 0.1;
        const newScore = Math.min(0.99, fosRisk + mlComponent + rainfallFactor + soilFactor);

        const newRisk = computeRisk({ ...zone, finalRiskScore: newScore });
        const trend = deltaRainfall > 0 || deltaSoil > 0 ? 'INCREASING' : 'STABLE';

        return {
          ...zone,
          rainfall: Math.round(newRainfall * 10) / 10,
          soilMoisture: Math.round(newSoil * 10) / 10,
          fos: Math.round(newFoS * 100) / 100,
          mlProbability: Math.round(newML * 100) / 100,
          finalRiskScore: Math.round(newScore * 100) / 100,
          risk: newRisk,
          trend,
          lastUpdate: new Date(),
        } as Zone;
      });

      setState({ zones: updated, lastUpdate: new Date(), tick: current.tick + 1 });
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return state;
}
