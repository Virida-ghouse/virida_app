import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormNewProps {
  onToggleMode: () => void;
  onError: (error: string) => void;
}

const LoginFormNew: React.FC<LoginFormNewProps> = ({ onToggleMode, onError }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      onError(error.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo et Titre */}
      <div className="text-[var(--text-primary)] text-white mb-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-[#1a3d2e] rounded-xl">
            <img 
              src="/virida_logo.png" 
              alt="Virida Logo" 
              className="size-12 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-[var(--text-primary)]">Vir</span><span className="text-[#CBED62]">ida</span><span className="text-[var(--text-primary)]">.</span>
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Bienvenue !
        </h2>
        <p className="text-[var(--text-secondary)]">
          Connectez-vous pour gérer votre serre intelligente
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
            Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
              mail
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className={`w-full pl-12 pr-4 py-3 glass-card backdrop-blur-xl rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-[var(--border-color)] focus:ring-[#2AD368]/50'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
              lock
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-12 pr-12 py-3 glass-card backdrop-blur-xl rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-[var(--border-color)] focus:ring-[#2AD368]/50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="material-symbols-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
          )}
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#2AD368] hover:bg-[#1fc75c] disabled:bg-gray-600 text-[#121A21] font-bold rounded-xl transition-all shadow-[0_8px_30px_rgba(42,211,104,0.4)] hover:shadow-[0_12px_40px_rgba(42,211,104,0.6)] hover:scale-[1.02] disabled:shadow-none disabled:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-[#121A21]/30 border-t-[#121A21] rounded-full animate-spin"></span>
              Connexion...
            </span>
          ) : (
            'Se connecter'
          )}
        </button>

        {/* Lien inscription */}
        <div className="text-[var(--text-primary)] text-white">
          <p className="text-[var(--text-secondary)] text-sm">
            Pas encore de compte ?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-[#2AD368] font-semibold hover:text-[#1fc75c] transition-colors"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </form>

    </div>
  );
};

export default LoginFormNew;
