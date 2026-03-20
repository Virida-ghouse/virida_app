import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormNewProps {
  onToggleMode: () => void;
  onError: (error: string) => void;
}

const RegisterFormNew: React.FC<RegisterFormNewProps> = ({
  onToggleMode,
  onError
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }

    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!acceptTerms) {
      errors.terms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
    } catch (err: any) {
      console.error('Erreur d\'inscription:', err);
      onError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-[var(--text-primary)] mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
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
        <p className="text-[var(--text-secondary)] text-sm">
          Créez votre compte pour accéder à votre serre
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
              Prénom
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">
                person
              </span>
              <input
                type="text"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                  validationErrors.firstName ? 'border-red-500' : 'border-[var(--border-color)]'
                } rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[#2AD368] focus:ring-2 focus:ring-[#2AD368]/20 transition-all disabled:opacity-50`}
                placeholder="John"
              />
            </div>
            {validationErrors.firstName && (
              <p className="mt-1 text-xs text-red-400">{validationErrors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
              Nom
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">
                badge
              </span>
              <input
                type="text"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                disabled={isLoading}
                className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                  validationErrors.lastName ? 'border-red-500' : 'border-[var(--border-color)]'
                } rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[#2AD368] focus:ring-2 focus:ring-[#2AD368]/20 transition-all disabled:opacity-50`}
                placeholder="Doe"
              />
            </div>
            {validationErrors.lastName && (
              <p className="mt-1 text-xs text-red-400">{validationErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
            Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">
              mail
            </span>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={isLoading}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                validationErrors.email ? 'border-red-500' : 'border-[var(--border-color)]'
              } rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[#2AD368] focus:ring-2 focus:ring-[#2AD368]/20 transition-all disabled:opacity-50`}
              placeholder="john.doe@example.com"
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">
              lock
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              disabled={isLoading}
              className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${
                validationErrors.password ? 'border-red-500' : 'border-[var(--border-color)]'
              } rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[#2AD368] focus:ring-2 focus:ring-[#2AD368]/20 transition-all disabled:opacity-50`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-xs text-red-400">{validationErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">
              lock
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              disabled={isLoading}
              className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${
                validationErrors.confirmPassword ? 'border-red-500' : 'border-[var(--border-color)]'
              } rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-[#2AD368] focus:ring-2 focus:ring-[#2AD368]/20 transition-all disabled:opacity-50`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (validationErrors.terms) {
                  setValidationErrors(prev => ({ ...prev, terms: '' }));
                }
              }}
              disabled={isLoading}
              className="mt-1 size-4 rounded border-[var(--border-color)] bg-[var(--glass-bg)] text-[#2AD368] focus:ring-2 focus:ring-[#2AD368]/20 disabled:opacity-50 accent-[#2AD368]"
            />
            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-secondary)] transition-colors">
              J'accepte les{' '}
              <a href="#" className="text-[#2AD368] hover:underline">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-[#2AD368] hover:underline">
                politique de confidentialité
              </a>
            </span>
          </label>
          {validationErrors.terms && (
            <p className="mt-1 text-xs text-red-400">{validationErrors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-[#2AD368] to-[#1fc75c] text-[#121A21] rounded-xl font-bold text-sm shadow-[0_8px_20px_rgba(42,211,104,0.4)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="size-5 border-2 border-[#121A21] border-t-transparent rounded-full animate-spin" />
              <span>Création du compte...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">person_add</span>
              <span>Créer mon compte</span>
            </>
          )}
        </button>

        {/* Toggle to Login */}
        <div className="text-[var(--text-primary)] pt-4">
          <p className="text-[var(--text-secondary)] text-sm">
            Déjà un compte ?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              disabled={isLoading}
              className="text-[#2AD368] font-semibold hover:underline transition-all disabled:opacity-50"
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterFormNew;
