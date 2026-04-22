/**
 * Configuration centralisée pour les appels API
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  TIMEOUT: 30000, // 30 secondes
};

/**
 * Récupère les headers d'authentification
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('virida_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Gère les erreurs HTTP de manière centralisée
 */
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `Erreur HTTP ${response.status}`,
    }));
    const apiError = new Error(error?.error ?? `Erreur HTTP ${response.status}`) as Error & {
      status: number;
      data: unknown;
    };
    apiError.status = response.status;
    apiError.data = error;
    throw apiError;
  }
  return response;
};

/**
 * Wrapper fetch avec configuration par défaut
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  return handleApiError(response);
};
