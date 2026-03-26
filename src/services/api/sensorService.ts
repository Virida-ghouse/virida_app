import { apiFetch } from './apiConfig';

export interface SensorData {
  id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  greenhouseId?: string;
}

export interface SensorReading {
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  light?: number;
  ph?: number;
  ec?: number;
  co2?: number;
  timestamp: string;
}

export interface SensorHistory {
  sensor: string;
  data: Array<{
    timestamp: string;
    value: number;
  }>;
}

class SensorService {
  /**
   * Récupérer les données actuelles de tous les capteurs
   */
  async getCurrentReadings(): Promise<SensorReading> {
    const response = await apiFetch('/api/sensors/current');
    return response.json();
  }

  /**
   * Récupérer l'historique d'un capteur
   */
  async getSensorHistory(
    sensorType: string,
    startDate?: string,
    endDate?: string
  ): Promise<SensorHistory> {
    const params = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    const endpoint = `/api/sensors/${sensorType}/history${params.toString() ? `?${params}` : ''}`;
    const response = await apiFetch(endpoint);
    return response.json();
  }

  /**
   * Récupérer toutes les données des capteurs
   */
  async getAllSensors(): Promise<SensorData[]> {
    const response = await apiFetch('/api/sensors');
    return response.json();
  }

  /**
   * Récupérer les alertes des capteurs
   */
  async getSensorAlerts(): Promise<any[]> {
    const response = await apiFetch('/api/sensors/alerts');
    return response.json();
  }

  /**
   * Configurer les seuils d'alerte
   */
  async updateAlertThresholds(sensorType: string, thresholds: any): Promise<void> {
    await apiFetch(`/api/sensors/${sensorType}/thresholds`, {
      method: 'PUT',
      body: JSON.stringify(thresholds),
    });
  }
}

export const sensorService = new SensorService();
