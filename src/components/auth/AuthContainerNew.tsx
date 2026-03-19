import React, { useState } from 'react';
import LoginFormNew from './LoginFormNew';
import RegisterFormNew from './RegisterFormNew';

const AuthContainerNew: React.FC = () => {
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
    <div className="min-h-screen bg-[var(--bg-primary)] dark:bg-[#0a1612] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2AD368]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1fc75c]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#CBED62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg0MiwyMTEsMTA0LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 md:p-8 border-2 border-[#2AD368]/20 shadow-2xl text-white">
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
            <RegisterFormNew onToggleMode={handleToggleMode} onError={handleError} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-[var(--text-primary)]">
          <p className="text-[var(--text-secondary)] text-xs">
            2024 Virida. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthContainerNew;
