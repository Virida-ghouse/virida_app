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
  async getCurrentReadings(): Promise<SensorReading> {
    const response = await apiFetch('/api/sensors/current');
    return response.json();
  }

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

  async getAllSensors(): Promise<SensorData[]> {
    const response = await apiFetch('/api/sensors');
    return response.json();
  }

  async getSensorAlerts(): Promise<any[]> {
    const response = await apiFetch('/api/sensors/alerts');
    return response.json();
  }

  async updateAlertThresholds(sensorType: string, thresholds: any): Promise<void> {
    await apiFetch(`/api/sensors/${sensorType}/thresholds`, {
      method: 'PUT',
      body: JSON.stringify(thresholds),
    });
  }

  async createSensor(data: any): Promise<any> {
    const response = await apiFetch('/api/sensors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateSensor(id: string, data: any): Promise<any> {
    const response = await apiFetch(`/api/sensors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteSensor(id: string): Promise<void> {
    await apiFetch(`/api/sensors/${id}`, {
      method: 'DELETE',
    });
  }

  async calibrateSensor(id: string): Promise<void> {
    await apiFetch(`/api/sensors/${id}/calibrate`, {
      method: 'POST',
    });
  }
}

export const sensorService = new SensorService();
