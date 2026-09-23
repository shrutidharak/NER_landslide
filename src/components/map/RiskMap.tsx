import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Zone, RouteOption } from '../../types';
import { getRiskColor } from '../../data/zones';
import { FIELD_REPORTS, ROADS, SHELTERS } from '../../data/infrastructure';
import { SENSORS } from '../../data/sensors';

// Fix Leaflet default icon path issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Layers {
  mlRisk: boolean;
  rainfall: boolean;
  soilMoisture: boolean;
  roads: boolean;
  villages: boolean;
  infrastructure: boolean;
  sensors: boolean;
  fieldReports: boolean;
  shelters: boolean;
  history: boolean;
}

interface RiskMapProps {
  zones: Zone[];
  selectedZoneId?: string;
  onZoneClick?: (zone: Zone) => void;
  layers?: Partial<Layers>;
  evacuationRoute?: RouteOption | null;
  height?: string;
  showRoute?: boolean;
}

const defaultLayers: Layers = {
  mlRisk: true,
  rainfall: false,
  soilMoisture: false,
  roads: true,
  villages: true,
  infrastructure: true,
  sensors: true,
  fieldReports: true,
  shelters: true,
  history: false,
};

function makeZonePolygon(zone: Zone): [number, number][] {
  // Generate a small realistic polygon around the zone's lat/lon
  const spread = 0.04 + (zone.slope / 1000);
  const lat = zone.lat;
  const lon = zone.lon;
  return [
    [lat + spread * 0.6, lon - spread * 0.8],
    [lat + spread * 1.0, lon + spread * 0.2],
    [lat + spread * 0.4, lon + spread * 1.0],
    [lat - spread * 0.4, lon + spread * 0.7],
    [lat - spread * 0.8, lon - spread * 0.1],
    [lat - spread * 0.3, lon - spread * 0.9],
    [lat + spread * 0.6, lon - spread * 0.8],
  ];
}

function sensorIcon(type: string): L.DivIcon {
  const emoji = type === 'RAINFALL' ? '🌧' : type === 'SOIL_MOISTURE' ? '💧' : '🌡';
  return L.divIcon({
    className: '',
    html: `<div style="font-size:16px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))">${emoji}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function shelterIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="background:#1a2744;color:white;border-radius:4px;padding:2px 5px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.3)">🏠 Shelter</div>`,
    iconSize: [70, 22],
    iconAnchor: [35, 11],
  });
}

function reportIcon(type: string): L.DivIcon {
  const emoji =
    type === 'CRACK' ? '⚡' :
    type === 'BLOCKED_ROAD' ? '🚧' :
    type === 'SLOPE_MOVEMENT' ? '⚠' :
    type === 'ROCKFALL' ? '🪨' :
    type === 'WATERLOGGING' ? '🌊' : '📋';
  return L.divIcon({
    className: '',
    html: `<div style="font-size:16px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3))">${emoji}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function RiskMap({
  zones,
  selectedZoneId,
  onZoneClick,
  layers: layerOverrides,
  evacuationRoute,
  height = '100%',
}: RiskMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerGroupsRef = useRef<Record<string, L.LayerGroup>>({});
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const layers = { ...defaultLayers, ...layerOverrides };

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [25.0, 93.0],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update zone polygons on zone data change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing zone layers
    if (layerGroupsRef.current.zones) {
      layerGroupsRef.current.zones.clearLayers();
    } else {
      layerGroupsRef.current.zones = L.layerGroup().addTo(map);
    }

    const lg = layerGroupsRef.current.zones;

    zones.forEach(zone => {
      if (!layers.mlRisk) return;
      const color = getRiskColor(zone.risk);
      const poly = L.polygon(makeZonePolygon(zone), {
        color,
        weight: 2,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: zone.risk === 'CRITICAL' ? 0.38 : zone.risk === 'HIGH' ? 0.28 : 0.18,
      });

      const isSelected = zone.id === selectedZoneId;
      if (isSelected) {
        poly.setStyle({ weight: 3, opacity: 1, fillOpacity: 0.45 });
      }

      poly.bindTooltip(
        `<div style="padding:6px 8px;min-width:150px">
          <div style="font-weight:600;font-size:12px;margin-bottom:4px">${zone.name}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <span style="background:${color};color:white;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700">${zone.risk}</span>
          </div>
          <div style="font-size:11px;color:#6b7280">
            Rainfall: ${zone.rainfall} mm &nbsp;|&nbsp; FoS: ${zone.fos}
          </div>
        </div>`,
        { sticky: true, opacity: 1, className: '' }
      );

      poly.on('click', () => onZoneClick?.(zone));
      lg.addLayer(poly);

      // Zone label
      const center: [number, number] = [zone.lat, zone.lon];
      const labelIcon = L.divIcon({
        className: '',
        html: `<div style="
          background:${color};color:white;
          padding:2px 6px;border-radius:3px;
          font-size:10px;font-weight:700;
          white-space:nowrap;
          box-shadow:0 1px 3px rgba(0,0,0,0.2);
          cursor:pointer;
        ">${zone.name}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      const marker = L.marker(center, { icon: labelIcon });
      marker.on('click', () => onZoneClick?.(zone));
      lg.addLayer(marker);
    });
  }, [zones, selectedZoneId, layers.mlRisk]);

  // Sensors layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layerGroupsRef.current.sensors) {
      layerGroupsRef.current.sensors.clearLayers();
    } else {
      layerGroupsRef.current.sensors = L.layerGroup().addTo(map);
    }
    if (!layers.sensors) return;
    const lg = layerGroupsRef.current.sensors;
    SENSORS.forEach(s => {
      const icon = sensorIcon(s.type);
      const m = L.marker([s.lat, s.lon], { icon });
      m.bindTooltip(
        `<div style="padding:5px 8px;font-size:11px">
          <div style="font-weight:600;margin-bottom:2px">${s.id}</div>
          <div style="color:#6b7280">${s.zoneName}</div>
          <div style="margin-top:3px;font-weight:600">${s.value} ${s.unit}</div>
          <div style="color:${s.status === 'ONLINE' ? '#16a34a' : '#dc2626'};font-size:10px">● ${s.status}</div>
        </div>`,
        { opacity: 1 }
      );
      lg.addLayer(m);
    });
  }, [layers.sensors]);

  // Roads layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layerGroupsRef.current.roads) {
      layerGroupsRef.current.roads.clearLayers();
    } else {
      layerGroupsRef.current.roads = L.layerGroup().addTo(map);
    }
    if (!layers.roads) return;
    const lg = layerGroupsRef.current.roads;
    ROADS.forEach(road => {
      const color =
        road.status === 'BLOCKED' ? '#dc2626' :
        road.status === 'PARTIALLY_BLOCKED' ? '#d97706' : '#16a34a';
      const dashArray = road.status === 'BLOCKED' ? '8,6' : undefined;
      const line = L.polyline(road.coordinates as [number, number][], {
        color, weight: 3, opacity: 0.8, dashArray,
      });
      line.bindTooltip(
        `<div style="padding:5px 8px;font-size:11px">
          <div style="font-weight:600">${road.name}</div>
          <div style="color:${color};font-weight:600">${road.status.replace('_', ' ')}</div>
          ${road.reason ? `<div style="color:#6b7280;font-size:10px;margin-top:2px">${road.reason}</div>` : ''}
        </div>`,
        { opacity: 1 }
      );
      lg.addLayer(line);
    });
  }, [layers.roads]);

  // Shelters layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layerGroupsRef.current.shelters) {
      layerGroupsRef.current.shelters.clearLayers();
    } else {
      layerGroupsRef.current.shelters = L.layerGroup().addTo(map);
    }
    if (!layers.shelters) return;
    const lg = layerGroupsRef.current.shelters;
    SHELTERS.forEach(s => {
      const m = L.marker([s.lat, s.lon], { icon: shelterIcon() });
      m.bindTooltip(
        `<div style="padding:5px 8px;font-size:11px;min-width:140px">
          <div style="font-weight:600;margin-bottom:3px">${s.name}</div>
          <div>Capacity: ${s.currentOccupancy}/${s.capacity}</div>
          <div style="color:${s.status === 'OPEN' ? '#16a34a' : '#dc2626'};font-weight:600">● ${s.status}</div>
          <div style="color:#6b7280;font-size:10px;margin-top:2px">${s.facilities.slice(0,3).join(' · ')}</div>
        </div>`,
        { opacity: 1 }
      );
      lg.addLayer(m);
    });
  }, [layers.shelters]);

  // Field reports layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (layerGroupsRef.current.reports) {
      layerGroupsRef.current.reports.clearLayers();
    } else {
      layerGroupsRef.current.reports = L.layerGroup().addTo(map);
    }
    if (!layers.fieldReports) return;
    const lg = layerGroupsRef.current.reports;
    FIELD_REPORTS.forEach(r => {
      const m = L.marker([r.lat, r.lon], { icon: reportIcon(r.type) });
      m.bindTooltip(
        `<div style="padding:5px 8px;font-size:11px">
          <div style="font-weight:600;margin-bottom:2px">${r.type.replace('_', ' ')}</div>
          <div style="color:#6b7280">${r.location}</div>
          <div style="font-weight:600;color:${r.severity === 'HIGH' || r.severity === 'CRITICAL' ? '#dc2626' : '#d97706'}">${r.severity}</div>
        </div>`,
        { opacity: 1 }
      );
      lg.addLayer(m);
    });
  }, [layers.fieldReports]);

  // Evacuation route layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    } else {
      routeLayerRef.current = L.layerGroup().addTo(map);
    }

    if (!evacuationRoute) return;

    const riskColor =
      evacuationRoute.risk === 'LOW' ? '#16a34a' :
      evacuationRoute.risk === 'MEDIUM' ? '#d97706' : '#ea580c';

    const line = L.polyline(evacuationRoute.waypoints, {
      color: riskColor, weight: 4, opacity: 0.9,
      dashArray: evacuationRoute.risk === 'LOW' ? undefined : '10,6',
    });

    // Arrow decoration
    line.addTo(routeLayerRef.current);

    // Start/end markers
    const startIcon = L.divIcon({
      className: '',
      html: `<div style="background:#1a2744;color:white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)">S</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    const endIcon = L.divIcon({
      className: '',
      html: `<div style="background:${riskColor};color:white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)">E</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const wps = evacuationRoute.waypoints;
    if (wps.length > 0) {
      L.marker(wps[0], { icon: startIcon }).addTo(routeLayerRef.current);
      L.marker(wps[wps.length - 1], { icon: endIcon }).addTo(routeLayerRef.current);
      map.fitBounds(line.getBounds(), { padding: [40, 40] });
    }
  }, [evacuationRoute]);

  return (
    <div ref={containerRef} style={{ width: '100%', height, minHeight: 300, position: 'relative' }} />
  );
}
