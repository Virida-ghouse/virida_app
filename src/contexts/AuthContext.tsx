import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Vérifier si un token existe dans le localStorage au démarrage
    const storedToken = localStorage.getItem('virida_token');
    const storedUser = localStorage.getItem('virida_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('virida_token');
        localStorage.removeItem('virida_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      const data = await authService.login({ email, password });

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user as User);

        localStorage.setItem('virida_token', data.token);
        localStorage.setItem('virida_user', JSON.stringify(data.user));
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      setIsLoading(true);

      const data = await authService.register({
        email: userData.email,
        password: userData.password,
        username: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user as User);

        localStorage.setItem('virida_token', data.token);
        localStorage.setItem('virida_user', JSON.stringify(data.user));
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('virida_token');
    localStorage.removeItem('virida_user');
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  }), [user, token, isLoading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
