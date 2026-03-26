import { apiFetch } from './apiConfig';

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
  /**
   * Récupérer toutes les plantes
   */
  async getPlants(): Promise<Plant[]> {
    const response = await apiFetch('/api/plants');
    return response.json();
  }

  /**
   * Récupérer une plante par ID
   */
  async getPlant(id: string): Promise<Plant> {
    const response = await apiFetch(`/api/plants/${id}`);
    return response.json();
  }

  /**
   * Créer une nouvelle plante
   */
  async createPlant(data: CreatePlantData): Promise<Plant> {
    const response = await apiFetch('/api/plants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Mettre à jour une plante
   */
  async updatePlant(id: string, data: Partial<CreatePlantData>): Promise<Plant> {
    const response = await apiFetch(`/api/plants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Supprimer une plante
   */
  async deletePlant(id: string): Promise<void> {
    await apiFetch(`/api/plants/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Récupérer les tâches d'une plante
   */
  async getPlantTasks(plantId: string): Promise<PlantTask[]> {
    const response = await apiFetch(`/api/plants/${plantId}/tasks`);
    return response.json();
  }

  /**
   * Créer une tâche pour une plante
   */
  async createTask(plantId: string, task: Partial<PlantTask>): Promise<PlantTask> {
    const response = await apiFetch(`/api/plants/${plantId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.json();
  }

  /**
   * Mettre à jour une tâche
   */
  async updateTask(plantId: string, taskId: string, data: Partial<PlantTask>): Promise<PlantTask> {
    const response = await apiFetch(`/api/plants/${plantId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Supprimer une tâche
   */
  async deleteTask(plantId: string, taskId: string): Promise<void> {
    await apiFetch(`/api/plants/${plantId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Récupérer la bibliothèque de plantes
   */
  async getPlantLibrary(): Promise<any[]> {
    const response = await apiFetch('/api/plants/library');
    return response.json();
  }

  /**
   * Upload d'une photo de plante
   */
  async uploadPhoto(plantId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiFetch(`/api/plants/${plantId}/photos`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  }
}

export const plantService = new PlantService();
