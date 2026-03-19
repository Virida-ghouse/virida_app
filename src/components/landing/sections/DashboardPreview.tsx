import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

const DashboardPreview: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block">
            L'Interface
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-[var(--text-primary)]">
            Contrôle total, <br/>du bout des doigts
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto px-4">
            Visualisez vos récoltes et gérez vos automatisations via une interface conçue pour la performance.
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Glowing background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-[#2AD368]/10 rounded-full blur-[120px]"></div>
          
          <div className="glass-card rounded-xl md:rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative">
            <img 
              alt="Dashboard Virida" 
              className="w-full h-auto" 
              src={theme === 'dark' ? '/dashboard_dark.png' : '/dashboard_light.png'}
            />
          </div>
          
          {/* Floating KPI cards */}
          <div 
            className="absolute -bottom-10 -left-10 hidden lg:block glass-card p-6 rounded-2xl w-64 border-l-4 border-l-[#2AD368] backdrop-blur-xl"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Santé Globale</span>
              <span className="text-[#2AD368] text-xs font-bold">98%</span>
            </div>
            <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
              <div className="h-full bg-[#2AD368] w-[98%]"></div>
            </div>
          </div>
          
          <div 
            className="absolute top-10 -right-10 hidden lg:block glass-card p-6 rounded-2xl w-64 border-l-4 border-l-[#CBED62] backdrop-blur-xl" 
            style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '-2s' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-[#CBED62]">trending_up</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">Productivité +14%</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Optimisation spectrale active.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
