import { apiFetch, getAuthHeaders } from './apiConfig';

export interface Plant {
  id: string;
  name: string;
  species?: string;
  plantedDate?: string;
  imageUrl?: string;
  status?: string;
  location?: string;
  notes?: string;
  [key: string]: any;
}

export interface PlantTask {
  id: string;
  plantId: string;
  type: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  [key: string]: any;
}

export interface CreatePlantData {
  name: string;
  species?: string;
  plantedDate?: string;
  imageUrl?: string;
  location?: string;
  notes?: string;
}

export interface UpdatePlantData extends Partial<CreatePlantData> {
  id: string;
}

class PlantService {
  // ==========================================
  // Plants CRUD
  // ==========================================

  async getPlants(): Promise<Plant[]> {
    const response = await apiFetch('/api/plants');
    return response.json();
  }

  async getPlant(id: string): Promise<Plant> {
    const response = await apiFetch(`/api/plants/${id}`);
    return response.json();
  }

  async createPlant(data: CreatePlantData): Promise<Plant> {
    const response = await apiFetch('/api/plants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updatePlant(id: string, data: Partial<CreatePlantData>): Promise<Plant> {
    const response = await apiFetch(`/api/plants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deletePlant(id: string): Promise<void> {
    await apiFetch(`/api/plants/${id}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // Plant Tasks (nested under /api/plants)
  // ==========================================

  async getPlantTasks(plantId: string): Promise<PlantTask[]> {
    const response = await apiFetch(`/api/plants/${plantId}/tasks`);
    return response.json();
  }

  async createTask(plantId: string, task: Partial<PlantTask>): Promise<PlantTask> {
    const response = await apiFetch(`/api/plants/${plantId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.json();
  }

  async updateTask(plantId: string, taskId: string, data: Partial<PlantTask>): Promise<PlantTask> {
    const response = await apiFetch(`/api/plants/${plantId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteTask(plantId: string, taskId: string): Promise<void> {
    await apiFetch(`/api/plants/${plantId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // Standalone Tasks (/api/plant-tasks)
  // ==========================================

  async getAllTasks(params?: Record<string, string>): Promise<any> {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const response = await apiFetch(`/api/plant-tasks${query}`);
    return response.json();
  }

  async getTaskById(taskId: string): Promise<any> {
    const response = await apiFetch(`/api/plant-tasks/${taskId}`);
    return response.json();
  }

  async createStandaloneTask(data: any): Promise<any> {
    const response = await apiFetch('/api/plant-tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateStandaloneTask(taskId: string, data: any): Promise<any> {
    const response = await apiFetch(`/api/plant-tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteStandaloneTask(taskId: string): Promise<void> {
    await apiFetch(`/api/plant-tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskStatus(taskId: string, endpoint: string): Promise<void> {
    await apiFetch(`/api/plant-tasks/${taskId}/${endpoint}`, {
      method: 'PATCH',
    });
  }

  // ==========================================
  // Plant Catalog (/api/plant-catalog)
  // ==========================================

  async getPlantCatalog(params?: Record<string, string>): Promise<any> {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const response = await apiFetch(`/api/plant-catalog${query}`);
    return response.json();
  }

  async getPlantCatalogItem(plantId: string): Promise<any> {
    const response = await apiFetch(`/api/plant-catalog/${plantId}`);
    return response.json();
  }

  // ==========================================
  // Plant Library (legacy endpoint)
  // ==========================================

  async getPlantLibrary(): Promise<any[]> {
    const response = await apiFetch('/api/plants/library');
    return response.json();
  }

  // ==========================================
  // Plant Advanced - Photos
  // ==========================================

  async getPhotos(plantId: string): Promise<any> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/photos`);
    return response.json();
  }

  async uploadPhoto(plantId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiFetch(`/api/plant-advanced/${plantId}/photos`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  }

  async uploadPhotoLegacy(plantId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiFetch(`/api/plant-advanced/${plantId}/photos/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  }

  async deletePhoto(plantId: string, photoId: string): Promise<void> {
    await apiFetch(`/api/plant-advanced/${plantId}/photos/${photoId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // Plant Advanced - Growth Logs
  // ==========================================

  async getGrowthLogs(plantId: string, params?: Record<string, string>): Promise<any> {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const response = await apiFetch(`/api/plant-advanced/${plantId}/growth-logs${query}`);
    return response.json();
  }

  async createGrowthLog(plantId: string, data: any): Promise<any> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/growth-logs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteGrowthLog(plantId: string, logId: string): Promise<void> {
    await apiFetch(`/api/plant-advanced/${plantId}/growth-logs/${logId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // Plant Advanced - Harvests
  // ==========================================

  async getHarvests(plantId: string): Promise<any> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/harvests`);
    return response.json();
  }

  async createHarvest(plantId: string, data: any): Promise<any> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/harvests`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteHarvest(plantId: string, harvestId: string): Promise<void> {
    await apiFetch(`/api/plant-advanced/${plantId}/harvests/${harvestId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // Care Events
  // ==========================================

  async getCareEvents(plantId: string): Promise<any> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/care-events`);
    return response.json();
  }
}

export const plantService = new PlantService();
