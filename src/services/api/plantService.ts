import { apiFetch } from './apiConfig';

export interface Plant {
  id: string;
  name?: string;
  species?: string;
  variety?: string;
  catalogId?: string;
  greenhouseId: string;
  zone?: string;
  status?: string;
  plantedAt?: string;
  harvestAt?: string;
  notes?: string;
  optimalTemp?: any;
  optimalHumidity?: any;
  optimalPh?: any;
  [key: string]: any;
}

export interface PlantTask {
  id: string;
  plantId: string;
  type: string;
  description?: string;
  notes?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  recurring?: boolean;
  recurringInterval?: string;
  source?: string;
  [key: string]: any;
}

export interface CreatePlantData {
  catalogId?: string;
  name?: string;
  species?: string;
  variety?: string;
  greenhouseId: string;
  zone?: string;
  plantedAt?: string;
  harvestAt?: string;
  notes?: string;
  optimalTemp?: any;
  optimalHumidity?: any;
  optimalPh?: any;
}

export interface UpdatePlantData {
  name?: string;
  variety?: string;
  status?: string;
  harvestAt?: string;
  notes?: string;
  optimalTemp?: any;
  optimalHumidity?: any;
  optimalPh?: any;
}

export interface HarvestData {
  quantity: number;
  unit?: string;
  quality: string;
  notes?: string;
  harvestedAt?: string;
}

export interface CareEventData {
  eventType: string;
  amount?: number;
  unit?: string;
  notes?: string;
  automatic?: boolean;
}

export interface GrowthLogData {
  height?: number;
  leafCount?: number;
  fruitCount?: number;
  notes?: string;
  eventType?: string;
}

class PlantService {
  // ==========================================
  // Plants CRUD
  // ==========================================

  async getPlants(params?: { greenhouseId?: string; status?: string; species?: string }): Promise<{ success: boolean; data: Plant[]; count: number }> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    const response = await apiFetch(`/api/plants${query}`);
    return response.json();
  }

  async getPlant(id: string): Promise<{ success: boolean; data: Plant }> {
    const response = await apiFetch(`/api/plants/${id}`);
    return response.json();
  }

  async createPlant(data: CreatePlantData): Promise<{ success: boolean; data: Plant; message: string }> {
    const response = await apiFetch('/api/plants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updatePlant(id: string, data: UpdatePlantData): Promise<{ success: boolean; data: Plant; message: string }> {
    const response = await apiFetch(`/api/plants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deletePlant(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiFetch(`/api/plants/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // ==========================================
  // Plant Tasks (/api/plant-tasks)
  // ==========================================

  async getAllTasks(params?: Record<string, string>): Promise<{ success: boolean; data: PlantTask[]; count: number }> {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const response = await apiFetch(`/api/plant-tasks${query}`);
    return response.json();
  }

  async getTaskById(taskId: string): Promise<{ success: boolean; data: PlantTask }> {
    const response = await apiFetch(`/api/plant-tasks/${taskId}`);
    return response.json();
  }

  async createTask(data: {
    plantId: string;
    type: string;
    description: string;
    notes?: string;
    dueDate?: string;
    priority?: string;
    recurring?: boolean;
    recurringInterval?: string;
    source?: string;
  }): Promise<{ success: boolean; data: PlantTask }> {
    const response = await apiFetch('/api/plant-tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateTask(taskId: string, data: Partial<PlantTask>): Promise<{ success: boolean; data: PlantTask }> {
    const response = await apiFetch(`/api/plant-tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async completeTask(taskId: string): Promise<{ success: boolean; data: PlantTask }> {
    const response = await apiFetch(`/api/plant-tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
    return response.json();
  }

  async uncompleteTask(taskId: string): Promise<{ success: boolean; data: PlantTask }> {
    const response = await apiFetch(`/api/plant-tasks/${taskId}/uncomplete`, {
      method: 'PATCH',
    });
    return response.json();
  }

  async deleteTask(taskId: string): Promise<{ success: boolean }> {
    const response = await apiFetch(`/api/plant-tasks/${taskId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // ==========================================
  // Plant Catalog (/api/plant-catalog)
  // ==========================================

  async getPlantCatalog(params?: Record<string, string>): Promise<any> {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const response = await apiFetch(`/api/plant-catalog${query}`);
    return response.json();
  }

  async getPlantCatalogItem(identifier: string): Promise<{ success: boolean; plant: any }> {
    const response = await apiFetch(`/api/plant-catalog/${identifier}`);
    return response.json();
  }

  async getPlantCatalogCategories(): Promise<{ success: boolean; data: Array<{ name: string; count: number }> }> {
    const response = await apiFetch('/api/plant-catalog/meta/categories');
    return response.json();
  }

  // ==========================================
  // Plant Info (RAG)
  // ==========================================

  async getPlantInfo(plantName: string): Promise<{ success: boolean; data: any; sources: any; method: string }> {
    const response = await apiFetch(`/api/plants/plant-info?plantName=${encodeURIComponent(plantName)}`);
    return response.json();
  }

  // ==========================================
  // Plant Harvests (/api/plants/:id/harvest(s))
  // ==========================================

  async getHarvests(plantId: string, params?: { limit?: string; offset?: string }): Promise<any> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    const response = await apiFetch(`/api/plants/${plantId}/harvests${query}`);
    return response.json();
  }

  async createHarvest(plantId: string, data: HarvestData): Promise<{ success: boolean; data: any; message: string }> {
    const response = await apiFetch(`/api/plants/${plantId}/harvest`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // ==========================================
  // Plant Advanced - Photos
  // ==========================================

  async getPhotos(plantId: string, params?: { limit?: string; offset?: string }): Promise<any> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    const response = await apiFetch(`/api/plant-advanced/${plantId}/photos${query}`);
    return response.json();
  }

  async addPhotoByUrl(plantId: string, data: { url: string; caption?: string; height?: number; width?: number; takenAt?: string }): Promise<any> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/photos`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async uploadPhoto(plantId: string, file: File, caption?: string, growthLogId?: string): Promise<any> {
    const formData = new FormData();
    formData.append('photo', file);
    if (caption) formData.append('caption', caption);
    if (growthLogId) formData.append('growthLogId', growthLogId);

    const token = localStorage.getItem('virida_token');
    const response = await apiFetch(`/api/plant-advanced/${plantId}/photos/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  }

  async deletePhoto(plantId: string, photoId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/photos/${photoId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // ==========================================
  // Plant Advanced - Growth Logs
  // ==========================================

  async getGrowthLogs(plantId: string, params?: Record<string, string>): Promise<any> {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const response = await apiFetch(`/api/plant-advanced/${plantId}/growth-logs${query}`);
    return response.json();
  }

  async createGrowthLog(plantId: string, data: GrowthLogData): Promise<{ success: boolean; data: any; message: string }> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/growth-logs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteGrowthLog(plantId: string, logId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/growth-logs/${logId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // ==========================================
  // Plant Advanced - Care Events
  // ==========================================

  async getCareEvents(plantId: string, params?: { limit?: string; offset?: string; eventType?: string }): Promise<any> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    const response = await apiFetch(`/api/plant-advanced/${plantId}/care-events${query}`);
    return response.json();
  }

  async createCareEvent(plantId: string, data: CareEventData): Promise<{ success: boolean; data: any; message: string }> {
    const response = await apiFetch(`/api/plant-advanced/${plantId}/care-events`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const plantService = new PlantService();
