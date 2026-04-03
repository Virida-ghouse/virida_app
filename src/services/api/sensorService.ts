import { apiFetch } from './apiConfig';

export interface Sensor {
  id: string;
  name: string;
  type: string;
  unit: string;
  greenhouseId: string;
  location?: string;
  minValue?: number;
  maxValue?: number;
  isActive?: boolean;
  lastReading?: number;
  lastReadingAt?: string;
  [key: string]: any;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  value: number;
  timestamp: string;
  quality?: string;
}

export interface SensorReadingsResponse {
  success: boolean;
  data: {
    sensor: Sensor;
    readings: SensorReading[];
    stats: Record<string, any>;
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export interface CreateSensorData {
  name: string;
  type: string;
  unit: string;
  greenhouseId: string;
  location?: string;
  minValue?: number;
  maxValue?: number;
}

export interface UpdateSensorData {
  name?: string;
  location?: string;
  minValue?: number;
  maxValue?: number;
  isActive?: boolean;
}

class SensorService {
  /**
   * Liste tous les capteurs (filtres optionnels)
   */
  async getSensors(params?: { greenhouseId?: string; type?: string; active?: string }): Promise<{ success: boolean; data: Sensor[]; count: number }> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    const response = await apiFetch(`/api/sensors${query}`);
    return response.json();
  }

  /**
   * Récupère un capteur par ID
   */
  async getSensor(id: string): Promise<{ success: boolean; data: Sensor }> {
    const response = await apiFetch(`/api/sensors/${id}`);
    return response.json();
  }

  /**
   * Crée un nouveau capteur
   */
  async createSensor(data: CreateSensorData): Promise<{ success: boolean; data: Sensor; message: string }> {
    const response = await apiFetch('/api/sensors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Met à jour un capteur
   */
  async updateSensor(id: string, data: UpdateSensorData): Promise<{ success: boolean; data: Sensor; message: string }> {
    const response = await apiFetch(`/api/sensors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Supprime un capteur
   */
  async deleteSensor(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiFetch(`/api/sensors/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  /**
   * Récupère les lectures d'un capteur
   */
  async getSensorReadings(
    sensorId: string,
    params?: { limit?: string; offset?: string; from?: string; to?: string }
  ): Promise<SensorReadingsResponse> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    const response = await apiFetch(`/api/sensors/${sensorId}/readings${query}`);
    return response.json();
  }

  /**
   * Ajoute une lecture à un capteur
   */
  async addSensorReading(
    sensorId: string,
    data: { value: number; timestamp?: string; quality?: string }
  ): Promise<{ success: boolean; data: SensorReading; message: string }> {
    const response = await apiFetch(`/api/sensors/${sensorId}/readings`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const sensorService = new SensorService();
