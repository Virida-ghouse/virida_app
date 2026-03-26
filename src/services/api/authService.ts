import { apiFetch } from './apiConfig';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

class AuthService {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Vérification du token
   */
  async verifyToken(): Promise<{ valid: boolean; user?: any }> {
    const response = await apiFetch('/api/auth/verify');
    return response.json();
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('token');
  }

  /**
   * Récupération du profil utilisateur
   */
  async getProfile(): Promise<any> {
    const response = await apiFetch('/api/auth/profile');
    return response.json();
  }
}

export const authService = new AuthService();
