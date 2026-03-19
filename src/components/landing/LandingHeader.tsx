import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface LandingHeaderProps {
  onNavigateToLogin: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigateToLogin }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img 
            alt="Virida Logo" 
            className="h-6 sm:h-7 md:h-8" 
            src="/virida_logo.png"
          />
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-wide">
          <a className="text-[#CBED62] border-b-2 border-[#CBED62] pb-1" href="#ecosystem">
            Écosystème
          </a>
          <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" href="#serre">
            Serre
          </a>
          <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" href="#marche">
            Marché
          </a>
          <a className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" href="#tarifs">
            Tarifs
          </a>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="material-symbols-outlined text-[var(--text-primary)] hover:bg-[var(--glass-hover)] rounded-full p-1.5 sm:p-2 transition-all text-xl sm:text-2xl"
          >
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </button>
          <button 
            onClick={onNavigateToLogin}
            className="bg-[#2AD368] text-[var(--btn-primary-text)] font-bold px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-[#2AD368]/20"
          >
            Connexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
