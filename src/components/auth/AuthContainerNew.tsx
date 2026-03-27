import React, { useState } from 'react';
import LoginFormNew from './LoginFormNew';
import RegisterFormNew from './RegisterFormNew';

interface AuthContainerNewProps {
  onBackToLanding?: () => void;
  onNavigateToLegal?: (page: 'mentions' | 'confidentialite') => void;
}

const AuthContainerNew: React.FC<AuthContainerNewProps> = ({ onBackToLanding, onNavigateToLegal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 md:left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#2AD368]/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-0 md:right-1/4 w-80 md:w-96 h-80 md:h-96 bg-[#CBED62]/15 rounded-full blur-[140px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Bouton retour landing */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="mb-4 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-semibold">Retour à l'accueil</span>
          </button>
        )}
        
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-[var(--border-color)] shadow-2xl">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Form */}
          {isLogin ? (
            <LoginFormNew onToggleMode={handleToggleMode} onError={handleError} />
          ) : (
            <RegisterFormNew onToggleMode={handleToggleMode} onError={handleError} onNavigateToLegal={onNavigateToLegal} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[var(--text-secondary)] text-xs">
            © 2024-2026 Virida. Projet Epitech Paris.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthContainerNew;
