import React from 'react';

const GreenhouseSection: React.FC = () => {
  return (
    <section id="serre" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block">
              Le Matériel
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
              La Serre Néo-Futuriste
            </h2>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
              Conçue avec des matériaux aéronautiques et équipée de capteurs laser de haute précision, 
              la serre Virida n'est pas qu'un simple bac à plantes. C'est un laboratoire vivant automatisé.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-xl">
                <span className="material-symbols-outlined text-[#2AD368] mb-3 text-3xl">sensors</span>
                <h4 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Capteurs Spectraux</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Analyse en temps réel de la chlorophylle et de la santé des sols.
                </p>
              </div>
              
              <div className="p-4 md:p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-xl">
                <span className="material-symbols-outlined text-[#2AD368] mb-3 text-3xl">water_drop</span>
                <h4 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Irrigation Micronisée</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Distribution d'eau et nutriments au millilitre près.
                </p>
              </div>
              
              <div className="p-4 md:p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-xl">
                <span className="material-symbols-outlined text-[#2AD368] mb-3 text-3xl">light_mode</span>
                <h4 className="font-bold text-lg mb-2 text-[var(--text-primary)]">LED Full Spectrum</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Imitation parfaite de la lumière naturelle du soleil.
                </p>
              </div>
              
              <div className="p-4 md:p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-xl">
                <span className="material-symbols-outlined text-[#2AD368] mb-3 text-3xl">shield</span>
                <h4 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Châssis Renforcé</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Aluminium brossé et verre trempé antireflet.
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-10 bg-[#2AD368]/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="glass-card rounded-[3rem] p-4 overflow-hidden shadow-2xl relative border-2 border-[var(--border-color)]">
              <img 
                src="/serre.jpg" 
                alt="Serre Virida Néo-Futuriste" 
                className="w-full aspect-[4/5] object-cover rounded-[2.5rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreenhouseSection;
