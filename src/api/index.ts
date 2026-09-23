/**
 * Mock API service layer.
 * Replace `VITE_API_BASE_URL` in .env and swap mock returns with
 * `fetch(baseUrl + endpoint)` to connect to real FastAPI backend.
 */

import { ZONES } from '../data/zones';
import { SENSORS } from '../data/sensors';
import { ALERTS } from '../data/alerts';
import { INFRASTRUCTURE, ROADS, SHELTERS, FIELD_REPORTS } from '../data/infrastructure';
import type { Zone, Sensor, Alert, FieldReport } from '../types';

const delay = (ms = 120) => new Promise(r => setTimeout(r, ms));

// --- Zones ---
export const api = {
  async getZones(): Promise<Zone[]> {
    await delay();
    return ZONES;
  },
  async getZone(id: string): Promise<Zone | undefined> {
    await delay();
    return ZONES.find(z => z.id === id);
  },

  // --- Sensors ---
  async getSensors(): Promise<typeof SENSORS> {
    await delay();
    return SENSORS;
  },
  async getSensor(id: string): Promise<typeof SENSORS[0] | undefined> {
    await delay();
    return SENSORS.find(s => s.id === id);
  },
  async getSensorsByZone(zoneId: string): Promise<Sensor[]> {
    await delay();
    return SENSORS.filter(s => s.zoneId === zoneId);
  },

  // --- Alerts ---
  async getAlerts(): Promise<Alert[]> {
    await delay();
    return ALERTS;
  },
  async getAlert(id: string): Promise<Alert | undefined> {
    await delay();
    return ALERTS.find(a => a.id === id);
  },
  async getAlertsByZone(zoneId: string): Promise<Alert[]> {
    await delay();
    return ALERTS.filter(a => a.zoneId === zoneId);
  },

  // --- Reports ---
  async getFieldReports(): Promise<FieldReport[]> {
    await delay();
    return FIELD_REPORTS;
  },
  async submitFieldReport(report: Omit<FieldReport, 'id' | 'reportedAt' | 'status'>): Promise<FieldReport> {
    await delay(400);
    const newReport: FieldReport = {
      ...report,
      id: `FR-${String(Date.now()).slice(-5)}`,
      reportedAt: new Date(),
      status: 'PENDING',
    };
    FIELD_REPORTS.push(newReport);
    return newReport;
  },

  // --- Infrastructure ---
  async getInfrastructure() {
    await delay();
    return INFRASTRUCTURE;
  },
  async getRoads() {
    await delay();
    return ROADS;
  },
  async getShelters() {
    await delay();
    return SHELTERS;
  },

  // --- CAP ---
  async getCAPAlert(alertId: string) {
    await delay();
    const alert = ALERTS.find(a => a.id === alertId);
    if (!alert) return null;
    return {
      identifier: alertId,
      sender: 'ner-ews@sdma.gov.in',
      sent: alert.triggeredAt.toISOString(),
      status: 'Actual',
      msgType: 'Alert',
      scope: 'Public',
      hazard: 'Landslide',
      severity: alert.risk === 'CRITICAL' ? 'Extreme' : alert.risk === 'HIGH' ? 'Severe' : 'Moderate',
      urgency: alert.status === 'ACTIVE' ? 'Immediate' : 'Expected',
      certainty: 'Likely',
      effective: alert.triggeredAt.toISOString(),
      expires: new Date(alert.triggeredAt.getTime() + 6 * 3600 * 1000).toISOString(),
      headline: alert.headline,
      description: alert.description,
      instruction: alert.instruction,
      areaDesc: alert.affectedArea,
      alert,
    };
  },
};
