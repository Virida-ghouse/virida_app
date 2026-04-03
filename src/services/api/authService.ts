import { apiFetch } from './apiConfig';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  token: string;
  refreshToken: string;
  message: string;
}

export interface MeResponse {
  success: boolean;
  data: AuthUser & { greenhouseCount?: number };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
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
   * Récupération du profil utilisateur courant
   */
  async getMe(): Promise<MeResponse> {
    const response = await apiFetch('/api/auth/me');
    return response.json();
  }

  /**
   * Mise à jour du profil utilisateur
   */
  async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; data: AuthUser; message: string }> {
    const response = await apiFetch('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(refreshToken: string): Promise<{ success: boolean; data: { accessToken: string; refreshToken: string }; message: string }> {
    const response = await apiFetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    return response.json();
  }

  /**
   * Déconnexion
   */
  async logout(refreshToken?: string): Promise<void> {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.removeItem('virida_token');
    localStorage.removeItem('virida_user');
  }
}

export const authService = new AuthService();
