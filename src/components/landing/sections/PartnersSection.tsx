import React from 'react';

const PartnersSection: React.FC = () => {
  return (
    <section id="partners" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block">
          Nos Partenaires
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
          Ils nous font confiance
        </h2>
        <p className="text-[var(--text-secondary)] text-base md:text-lg mb-12 md:mb-16 max-w-2xl mx-auto">
          Virida est fier de collaborer avec des institutions et entreprises qui partagent notre vision 
          d'une agriculture durable et innovante.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-center justify-items-center max-w-5xl mx-auto">
          {/* Epitech */}
          <div className="glass-card p-8 md:p-10 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl hover:border-[#2AD368]/40 transition-all w-full flex items-center justify-center min-h-[120px]">
            <img 
              src="/Epitech_Official_Logo.png" 
              alt="Epitech" 
              className="h-12 md:h-14 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Clever Cloud */}
          <div className="glass-card p-8 md:p-10 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl hover:border-[#2AD368]/40 transition-all w-full flex items-center justify-center min-h-[120px]">
            <img 
              src="/logo_clever.svg" 
              alt="Clever Cloud" 
              className="h-12 md:h-14 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          
          {/* Galerie */}
          <div className="glass-card p-8 md:p-10 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl hover:border-[#2AD368]/40 transition-all w-full flex items-center justify-center min-h-[120px]">
            <img 
              src="/logo_galerie.jpg" 
              alt="Galerie" 
              className="h-12 md:h-14 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <p className="text-sm text-[var(--text-secondary)] italic">
            Vous souhaitez devenir partenaire ? <a href="#" className="text-[#2AD368] hover:underline font-bold">Contactez-nous</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
