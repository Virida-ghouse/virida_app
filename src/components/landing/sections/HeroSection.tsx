import React from 'react';
import EveFloatingChat from '../EveFloatingChat';

interface HeroSectionProps {
  onNavigateToLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToLogin }) => {
  return (
    <section id="ecosystem" className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 py-12 md:py-20">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 md:left-1/4 w-72 md:w-96 h-72 md:h-96 bg-[#CBED62]/25 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-0 md:right-1/4 w-80 md:w-[500px] h-80 md:h-[500px] bg-[#2AD368]/25 rounded-full blur-[160px]"></div>
      </div>
      
      {/* Eve floating chats on absolute sides - restent dans le hero */}
      <EveFloatingChat position="left" />
      <EveFloatingChat position="right" />
      
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-[#2AD368] animate-pulse"></span>
          <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#2AD368]">Agriculture 4.0</span>
        </div>
        
        {/* Main title */}
        <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight mb-4 md:mb-8 px-4 leading-[1.1]">
          Cultivez le futur. <br/>Laissez <span className="text-[#CBED62] italic">EVE</span> <br/>faire le reste.
        </h1>
        
        {/* Slogan */}
        <div className="mb-8 md:mb-16 px-4">
          <p className="text-base sm:text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Votre serre intelligente. Plantez, EVE s'occupe du reste.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center w-full max-w-md sm:max-w-none px-4 mb-6 md:mb-8">
          <button 
            onClick={onNavigateToLogin}
            className="bg-[#2AD368] text-[var(--btn-primary-text)] text-sm md:text-lg font-bold px-6 md:px-10 py-2 md:py-4 rounded-full shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all w-full sm:w-auto">
            Lancer l'expérience
          </button>
          <a
            href="#serre"
            className="bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] text-sm md:text-lg font-bold px-6 md:px-10 py-2 md:py-4 rounded-full hover:border-[#2AD368] transition-all w-full sm:w-auto text-center"
          >
            Découvrir la Serre
          </a>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[var(--text-secondary)]/60 px-4">
          <span>avec la participation d'</span>
          <img 
            src="/Epitech_Official_Logo.png" 
            alt="Epitech" 
            className="h-4 sm:h-5 opacity-70"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
