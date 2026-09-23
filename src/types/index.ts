// Core domain types for NER Landslide EWS

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SensorStatus = 'ONLINE' | 'OFFLINE' | 'WARNING';
export type AlertStatus = 'ACTIVE' | 'MONITORING' | 'SENT' | 'RESOLVED';
export type RoadStatus = 'OPEN' | 'PARTIALLY_BLOCKED' | 'BLOCKED';
export type InfrastructureType = 'ROAD' | 'BRIDGE' | 'HOSPITAL' | 'SCHOOL' | 'SHELTER' | 'VILLAGE';

export interface Zone {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  risk: RiskLevel;
  rainfall: number; // mm / 24h
  soilMoisture: number; // %
  temperature: number; // °C
  slope: number; // degrees
  fos: number; // Factor of Safety
  mlProbability: number; // 0–1
  finalRiskScore: number; // 0–1
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  lastUpdate: Date;
  affectedVillages: number;
  affectedRoads: number;
  population: number;
}

export interface Sensor {
  id: string;
  type: 'RAINFALL' | 'SOIL_MOISTURE' | 'TEMPERATURE';
  zoneId: string;
  zoneName: string;
  lat: number;
  lon: number;
  status: SensorStatus;
  value: number;
  unit: string;
  battery: number; // %
  lastUpdate: Date;
  history: { time: Date; value: number }[];
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  risk: RiskLevel;
  status: AlertStatus;
  trigger: string;
  triggeredAt: Date;
  headline: string;
  description: string;
  instruction: string;
  recipients: string[];
  channels: string[];
  affectedArea: string;
}

export interface FieldReport {
  id: string;
  type: 'CRACK' | 'SLOPE_MOVEMENT' | 'BLOCKED_ROAD' | 'ROCKFALL' | 'WATERLOGGING' | 'OTHER';
  lat: number;
  lon: number;
  location: string;
  severity: RiskLevel;
  description: string;
  reporterType: 'CITIZEN' | 'FIELD_OFFICER';
  reportedAt: Date;
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED';
  photoUrl?: string;
}

export interface Infrastructure {
  id: string;
  type: InfrastructureType;
  name: string;
  lat: number;
  lon: number;
  lng?: number;
  zoneId?: string;
  vulnerability?: 'high' | 'medium' | 'low';
  description?: string;
  status: RoadStatus | 'OPERATIONAL' | 'CLOSED' | 'DAMAGED';
  lastUpdated: Date;
  details?: string;
}

export interface Road {
  id: string;
  code?: string;
  name: string;
  status: RoadStatus;
  lengthKm?: number;
  alternateRoute?: string;
  from: string;
  to: string;
  reason?: string;
  lastReported?: Date;
  coordinates: [number, number][];
}

export interface Shelter {
  id: string;
  name: string;
  location?: string;
  contactPerson?: string;
  contactPhone?: string;
  lat: number;
  lon: number;
  capacity: number;
  currentOccupancy: number;
  status: 'OPEN' | 'FULL' | 'CLOSED';
  facilities: string[];
  district: string;
}

export interface WeatherForecast {
  time: string; // e.g. 'Next 6h'
  rainfall: number;
  risk: RiskLevel;
  condition: string;
}

export interface RouteOption {
  id: string;
  label: 'LOW_RISK' | 'FASTEST' | 'ALTERNATE';
  distance: number; // km
  duration: number; // min
  risk: RiskLevel;
  blockedRoads: number;
  highRiskSegments: number;
  waypoints: [number, number][];
  safetyChecks: { label: string; passed: boolean }[];
}

export interface EvacuationPlan {
  fromZone: Zone;
  toShelter: Shelter;
  routes: RouteOption[];
  calculatedAt: Date;
}
