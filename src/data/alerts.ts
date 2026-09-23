import type { Alert } from '../types';
import { subMinutes, subHours } from 'date-fns';

const now = new Date();

export const ALERTS: Alert[] = [
  {
    id: 'ALT-001',
    zoneId: 'aizawl-z03',
    zoneName: 'Aizawl Zone 03',
    risk: 'HIGH',
    status: 'ACTIVE',
    trigger: 'Heavy rainfall + low FoS',
    triggeredAt: subMinutes(now, 43),
    headline: 'Landslide risk increasing in Aizawl Zone 03',
    description:
      'Heavy rainfall detected in the last 6 hours. Soil moisture is above 65%. TRIGRS Factor of Safety is 0.91, indicating reduced slope stability. ML model predicts elevated landslide probability.',
    instruction:
      'Residents in the affected zone should avoid steep slopes and follow instructions from local authorities. Field teams should survey Zone 03 hillsides. Do not use NH-6 bypass road.',
    recipients: ['District EOC', 'Field Officers', 'Residents — Aizawl Zone 03'],
    channels: ['SMS', 'SACHET', 'Cell Broadcast', 'WhatsApp'],
    affectedArea: 'Aizawl Zone 03',
  },
  {
    id: 'ALT-002',
    zoneId: 'churachandpur',
    zoneName: 'Churachandpur',
    risk: 'MEDIUM',
    status: 'MONITORING',
    trigger: 'Soil moisture increase',
    triggeredAt: subMinutes(now, 64),
    headline: 'Soil moisture rising in Churachandpur',
    description:
      'Soil moisture has increased from 44% to 54% over the past 4 hours. Rainfall continues at moderate levels. FoS currently at 1.12 — still above critical threshold but declining.',
    instruction:
      'Authorities in Churachandpur district are advised to monitor the situation. Pre-position field teams near slopes on the eastern fringe.',
    recipients: ['District EOC — Churachandpur', 'Field Officers'],
    channels: ['SMS', 'WhatsApp'],
    affectedArea: 'Churachandpur district',
  },
  {
    id: 'ALT-003',
    zoneId: 'kohima-rural',
    zoneName: 'Kohima Rural',
    risk: 'HIGH',
    status: 'SENT',
    trigger: 'Rainfall threshold exceeded',
    triggeredAt: subMinutes(now, 91),
    headline: 'Rainfall threshold exceeded in Kohima Rural',
    description:
      'Cumulative rainfall over 24 hours has crossed 115 mm. Slope angle at 35°. TRIGRS analysis indicates FoS of 0.94. Three villages on the northern slope are within the risk perimeter.',
    instruction:
      'Field officers should alert villages on the northern slope. Evacuation to Community Hall is recommended for households in Zone 3A.',
    recipients: ['District EOC — Kohima', 'Field Officers', 'Village Headmen — Zone 3A'],
    channels: ['SMS', 'IVR', 'SACHET'],
    affectedArea: 'Kohima Rural — Northern Slope Zone 3A',
  },
  {
    id: 'ALT-004',
    zoneId: 'gangtok-z1',
    zoneName: 'Gangtok Zone 1',
    risk: 'CRITICAL',
    status: 'ACTIVE',
    trigger: 'Critical FoS + extreme rainfall',
    triggeredAt: subMinutes(now, 18),
    headline: 'CRITICAL: Slope stability severely reduced in Gangtok Zone 1',
    description:
      'Rainfall at 168 mm / 24h. Soil moisture at 78%. Slope angle 45°. TRIGRS FoS is 0.74 — critically below 1.0. ML model gives 91% landslide probability. Situation is deteriorating rapidly.',
    instruction:
      'Immediate evacuation of all residents in Gangtok Zone 1 is strongly recommended. NH-10 near the zone may be at risk. All field teams to respond immediately.',
    recipients: [
      'State Disaster Management Authority — Sikkim',
      'District EOC — East Sikkim',
      'Field Officers',
      'Residents — Gangtok Zone 1',
      'NDRF',
    ],
    channels: ['SMS', 'SACHET', 'Cell Broadcast', 'WhatsApp', 'IVR', 'Local Siren'],
    affectedArea: 'Gangtok Zone 1 — East Sikkim',
  },
  {
    id: 'ALT-005',
    zoneId: 'lunglei-z1',
    zoneName: 'Lunglei Zone 1',
    risk: 'HIGH',
    status: 'ACTIVE',
    trigger: 'Rainfall increase + soil saturation',
    triggeredAt: subMinutes(now, 29),
    headline: 'Slope conditions deteriorating in Lunglei Zone 1',
    description:
      'Rainfall has increased to 131 mm / 24h. Soil moisture at 71%. Slope at 41°. FoS at 0.87. Risk is HIGH and trending upward.',
    instruction:
      'Field teams to deploy to Lunglei Zone 1. Communities near steep slopes should be informed of elevated risk. Monitor NH-54 connectivity.',
    recipients: ['District EOC — Lunglei', 'Field Officers'],
    channels: ['SMS', 'WhatsApp', 'SACHET'],
    affectedArea: 'Lunglei Zone 1',
  },
  {
    id: 'ALT-006',
    zoneId: 'guwahati-hills',
    zoneName: 'Guwahati Hills',
    risk: 'MEDIUM',
    status: 'MONITORING',
    trigger: 'Rising rainfall trend',
    triggeredAt: subMinutes(now, 110),
    headline: 'Monitoring: Rainfall increasing in Guwahati Hills',
    description:
      'Rainfall trending upward over the past 6 hours. Currently at 94 mm / 24h. Soil moisture at 57%. FoS at 1.09 — watch level.',
    instruction: 'No immediate action required. Continue monitoring. Alert if rainfall exceeds 110 mm.',
    recipients: ['District EOC — Kamrup Metro'],
    channels: ['SMS'],
    affectedArea: 'Guwahati Hills area',
  },
  {
    id: 'ALT-007',
    zoneId: 'tawang-ridge',
    zoneName: 'Tawang Ridge',
    risk: 'MEDIUM',
    status: 'MONITORING',
    trigger: 'ML probability increase',
    triggeredAt: subHours(now, 3),
    headline: 'ML model flags increasing risk at Tawang Ridge',
    description:
      'ML prediction probability has risen to 0.61 over the last 3 hours. Rainfall at 72 mm / 24h. Slope at 31°. FoS at 1.06.',
    instruction: 'Monitor closely. Pre-check connectivity of Tawang–Bomdila road.',
    recipients: ['District EOC — Tawang'],
    channels: ['SMS'],
    affectedArea: 'Tawang Ridge',
  },
];

export const getActiveAlerts = () => ALERTS.filter(a => a.status === 'ACTIVE');
export const getAlertsByZone = (zoneId: string) => ALERTS.filter(a => a.zoneId === zoneId);
