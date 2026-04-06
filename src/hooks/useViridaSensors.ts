/**
 * Hook centralisé — données capteurs réelles depuis /api/sensors (polling 5s)
 * Remplace le mock data de useSensorData.ts
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { API_CONFIG, getAuthHeaders } from '../services/api/apiConfig';

export interface LiveSensor {
  id: string;
  name: string;
  type: string;         // 'ph' | 'light' | 'soil_moisture' | 'tds' | 'temperature' | 'humidity' | ...
  value: number | null;
  unit: string;
  status: 'online' | 'offline' | 'error';
  lastReading: string | null;
  greenhouseId?: string;
}

export interface SensorMap {
  ph:           number | null;
  light:        number | null;
  soil_moisture: number | null;
  tds:          number | null;
  temperature:  number | null;
  humidity:     number | null;
  [key: string]: number | null;
}

export interface SensorAlert {
  level: 'critical' | 'warning';
  sensor: string;
  label: string;
  message: string;
  action: string;
}

function parseSensors(raw: any[]): LiveSensor[] {
  return raw.map((s: any) => ({
    id: s.id,
    name: s.name || s.type,
    type: (s.type || '').toLowerCase(),
    value: s.current_value != null ? Number(s.current_value) : null,
    unit: s.unit || '',
    status: s.status === 'online' ? 'online' : 'offline',
    lastReading: s.last_reading || s.lastReading || null,
    greenhouseId: s.greenhouse_id || s.greenhouseId,
  }));
}

function buildMap(sensors: LiveSensor[]): SensorMap {
  const map: SensorMap = {
    ph: null, light: null, soil_moisture: null,
    tds: null, temperature: null, humidity: null,
  };
  sensors.forEach(s => {
    if (s.status === 'online' && s.value != null) map[s.type] = s.value;
  });
  return map;
}

function buildAlerts(map: SensorMap): SensorAlert[] {
  const alerts: SensorAlert[] = [];

  if (map.ph != null) {
    if (map.ph < 4.5 || map.ph > 8.5)
      alerts.push({ level: 'critical', sensor: 'pH', label: 'pH critique', message: `pH ${map.ph.toFixed(1)} — hors plage dangereuse`, action: map.ph < 5.5 ? 'Ajouter solution pH+' : 'Ajouter solution pH-' });
    else if (map.ph < 5.5 || map.ph > 7.5)
      alerts.push({ level: 'warning', sensor: 'pH', label: 'pH anormal', message: `pH ${map.ph.toFixed(1)} — plage non optimale (5.5–7.5)`, action: map.ph < 5.5 ? 'Corriger avec pH+' : 'Corriger avec pH-' });
  }
  if (map.light != null) {
    if (map.light < 50)
      alerts.push({ level: 'critical', sensor: 'Lumière', label: 'Obscurité totale', message: `${Math.round(map.light)} lux — photosynthèse impossible`, action: 'Activer éclairage LED immédiatement' });
    else if (map.light < 500)
      alerts.push({ level: 'warning', sensor: 'Lumière', label: 'Lumière insuffisante', message: `${Math.round(map.light)} lux — en dessous du seuil (500 lux)`, action: 'Augmenter durée ou intensité LED' });
  }
  if (map.soil_moisture != null) {
    if (map.soil_moisture < 20)
      alerts.push({ level: 'critical', sensor: 'Sol', label: 'Sol très sec', message: `${Math.round(map.soil_moisture)}% — stress hydrique critique`, action: 'Arrosage urgent requis' });
    else if (map.soil_moisture < 30)
      alerts.push({ level: 'warning', sensor: 'Sol', label: 'Sol sec', message: `${Math.round(map.soil_moisture)}% — humidité basse`, action: 'Arrosage recommandé' });
    else if (map.soil_moisture > 85)
      alerts.push({ level: 'warning', sensor: 'Sol', label: 'Sol trop humide', message: `${Math.round(map.soil_moisture)}% — risque pourriture racinaire`, action: 'Réduire arrosage' });
  }
  if (map.tds != null) {
    if (map.tds < 80)
      alerts.push({ level: 'critical', sensor: 'TDS', label: 'Nutriments insuffisants', message: `${Math.round(map.tds)} ppm — carence sévère`, action: 'Fertiliser immédiatement' });
    else if (map.tds < 150)
      alerts.push({ level: 'warning', sensor: 'TDS', label: 'Nutriments bas', message: `${Math.round(map.tds)} ppm — en dessous optimal (150–800 ppm)`, action: 'Ajouter fertilisant' });
    else if (map.tds > 1500)
      alerts.push({ level: 'warning', sensor: 'TDS', label: 'Surtension nutriments', message: `${Math.round(map.tds)} ppm — concentration trop élevée`, action: 'Diluer la solution nutritive' });
  }

  return alerts;
}

export function useViridaSensors(pollInterval = 5000) {
  const [sensors, setSensors] = useState<LiveSensor[]>([]);
  const [map, setMap]         = useState<SensorMap>({ ph: null, light: null, soil_moisture: null, tds: null, temperature: null, humidity: null });
  const [alerts, setAlerts]   = useState<SensorAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [connected, setConnected] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSensors = useCallback(async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/sensors`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const raw: any[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      const parsed = parseSensors(raw);
      const sensorMap = buildMap(parsed);
      setSensors(parsed);
      setMap(sensorMap);
      setAlerts(buildAlerts(sensorMap));
      setLastSync(new Date());
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSensors();
    intervalRef.current = setInterval(fetchSensors, pollInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchSensors, pollInterval]);

  const onlineSensors  = sensors.filter(s => s.status === 'online');
  const offlineSensors = sensors.filter(s => s.status === 'offline');

  return { sensors, map, alerts, loading, lastSync, connected, onlineSensors, offlineSensors, refetch: fetchSensors };
}
