/**
 * Point d'entrée centralisé pour tous les services API
 */

export { authService } from './authService';
export { plantService } from './plantService';
export { sensorService } from './sensorService';
export { chatService } from './chatService';
export { contactService } from './contactService';
export { API_CONFIG, getAuthHeaders, apiFetch } from './apiConfig';

// Export des types
export type { LoginCredentials, RegisterData, AuthResponse, AuthUser, MeResponse, UpdateProfileData } from './authService';
export type { Plant, PlantTask, CreatePlantData, UpdatePlantData, HarvestData, CareEventData, GrowthLogData } from './plantService';
export type { Sensor, SensorReading, SensorReadingsResponse, CreateSensorData, UpdateSensorData } from './sensorService';
export type { ChatMessage, ChatResponseData } from './chatService';
export type { Contact, ContactFormData, ContactsResponse } from './contactService';
