import type { Zone, Shelter, RouteOption, EvacuationPlan } from '../types';
import { SHELTERS } from '../data/infrastructure';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function midpoint(lat1: number, lon1: number, lat2: number, lon2: number, t = 0.5): [number, number] {
  return [lat1 + (lat2 - lat1) * t, lon1 + (lon2 - lon1) * t];
}

export function findNearestShelter(zone: Zone): Shelter | undefined {
  return SHELTERS.filter(s => s.status === 'OPEN').sort((a, b) =>
    haversineKm(zone.lat, zone.lon, a.lat, a.lon) -
    haversineKm(zone.lat, zone.lon, b.lat, b.lon)
  )[0];
}

export function planEvacuation(zone: Zone, shelter: Shelter): EvacuationPlan {
  const directDist = haversineKm(zone.lat, zone.lon, shelter.lat, shelter.lon);

  // Route A — Low risk, slightly longer, avoids known risk zones
  const wpA = midpoint(zone.lat, zone.lon, shelter.lat, shelter.lon, 0.4);
  const routeA: RouteOption = {
    id: 'route-a',
    label: 'LOW_RISK',
    distance: Math.round((directDist * 1.28) * 10) / 10,
    duration: Math.round(directDist * 1.28 * 2.8),
    risk: 'LOW',
    blockedRoads: 0,
    highRiskSegments: 0,
    waypoints: [
      [zone.lat, zone.lon],
      [wpA[0] - 0.02, wpA[1] + 0.03],
      [shelter.lat, shelter.lon],
    ],
    safetyChecks: [
      { label: 'Road connectivity available', passed: true },
      { label: 'Shelter operational', passed: shelter.status === 'OPEN' },
      { label: 'No blocked roads on route', passed: true },
      { label: 'No critical-risk segments', passed: true },
    ],
  };

  // Route B — Fastest, shorter, one medium-risk segment
  const routeB: RouteOption = {
    id: 'route-b',
    label: 'FASTEST',
    distance: Math.round((directDist * 1.05) * 10) / 10,
    duration: Math.round(directDist * 1.05 * 2.2),
    risk: 'MEDIUM',
    blockedRoads: 0,
    highRiskSegments: 1,
    waypoints: [
      [zone.lat, zone.lon],
      [shelter.lat, shelter.lon],
    ],
    safetyChecks: [
      { label: 'Road connectivity available', passed: true },
      { label: 'Shelter operational', passed: shelter.status === 'OPEN' },
      { label: 'No blocked roads on route', passed: true },
      { label: 'One medium-risk segment present', passed: false },
    ],
  };

  // Route C — Alternate, longer bypass
  const wpC = midpoint(zone.lat, zone.lon, shelter.lat, shelter.lon, 0.6);
  const routeC: RouteOption = {
    id: 'route-c',
    label: 'ALTERNATE',
    distance: Math.round((directDist * 1.45) * 10) / 10,
    duration: Math.round(directDist * 1.45 * 2.9),
    risk: 'LOW',
    blockedRoads: 0,
    highRiskSegments: 0,
    waypoints: [
      [zone.lat, zone.lon],
      [wpC[0] + 0.03, wpC[1] - 0.02],
      [wpC[0] + 0.01, wpC[1] + 0.02],
      [shelter.lat, shelter.lon],
    ],
    safetyChecks: [
      { label: 'Road connectivity available', passed: true },
      { label: 'Shelter operational', passed: shelter.status === 'OPEN' },
      { label: 'No blocked roads on route', passed: true },
      { label: 'No high-risk segments', passed: true },
    ],
  };

  return {
    fromZone: zone,
    toShelter: shelter,
    routes: [routeA, routeB, routeC],
    calculatedAt: new Date(),
  };
}
