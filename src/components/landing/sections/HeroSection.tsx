import React from 'react';
import EveFloatingChat from '../EveFloatingChat';

interface HeroSectionProps {
  onNavigateToLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToLogin }) => {
  return (
    <section id="ecosystem" className="relative min-h-[100vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 md:py-20">
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
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-[#2AD368] animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest uppercase text-[#2AD368]">Agriculture 4.0</span>
        </div>
        
        {/* Main title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight mb-6 md:mb-8 px-4">
          Cultivez le futur <br/>avec <span className="text-[#CBED62] italic">Virida</span>
        </h1>
        
        {/* Slogan */}
        <div className="mb-10 md:mb-16 px-4">
          <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-3">
            <span className="font-semibold text-[var(--text-primary)]">Cultivez l'avenir, aujourd'hui.</span> L'agriculture de demain, à portée de main.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)]/70 max-w-xl mx-auto">
            La fusion parfaite entre l'IA et la nature.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full max-w-md sm:max-w-none px-4">
          <button 
            onClick={onNavigateToLogin}
            className="bg-[#2AD368] text-[var(--btn-primary-text)] text-base md:text-lg font-bold px-8 md:px-10 py-3 md:py-4 rounded-full shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all w-full sm:w-auto"
          >
            Lancer l'expérience
          </button>
          <button className="bg-[var(--glass-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-base md:text-lg font-bold px-8 md:px-10 py-3 md:py-4 rounded-full hover:bg-[var(--glass-hover)] transition-all backdrop-blur-xl w-full sm:w-auto">
            Découvrir la Serre
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
