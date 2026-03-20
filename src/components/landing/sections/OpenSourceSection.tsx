import React from 'react';

const OpenSourceSection: React.FC = () => {
  return (
    <section id="opensource" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block">
            Open Source
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
            Un Écosystème Ouvert
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Virida est bien plus qu'un produit. C'est un écosystème complet, entièrement open source, 
            conçu pour être accessible, modifiable et améliorable par tous.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="glass-card rounded-2xl p-8 md:p-12 border border-[#2AD368] backdrop-blur-xl bg-[#2AD368]/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#2AD368] p-2.5 rounded-lg">
                <span className="material-symbols-outlined text-white text-xl">code</span>
              </div>
              <div>
                <h4 className="font-bold text-lg md:text-xl text-[var(--text-primary)]">100% Open Source</h4>
                <p className="text-xs text-[#2AD368] font-bold">Libre • Gratuit • Communautaire</p>
              </div>
            </div>
            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
              Tous nos <span className="font-bold text-[var(--text-primary)]">plans</span>, <span className="font-bold text-[var(--text-primary)]">schémas électroniques</span>, <span className="font-bold text-[var(--text-primary)]">code source</span> et <span className="font-bold text-[var(--text-primary)]">modèles IA</span> sont librement accessibles. 
              Réparez, modifiez et améliorez l'écosystème Virida comme bon vous semble.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-[#2AD368]">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>Virida appartient à la communauté</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl">
            <span className="material-symbols-outlined text-[#2AD368] mb-4 text-4xl">construction</span>
            <h4 className="font-bold text-lg mb-3 text-[var(--text-primary)]">Plans & Schémas</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Tous les plans de construction et schémas électroniques de la serre sont disponibles. 
              Construisez, modifiez et partagez vos améliorations.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl">
            <span className="material-symbols-outlined text-[#2AD368] mb-4 text-4xl">terminal</span>
            <h4 className="font-bold text-lg mb-3 text-[var(--text-primary)]">Code Source</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Le code du dashboard, des capteurs et de l'API est entièrement ouvert. 
              Contribuez, forkez et adaptez selon vos besoins.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl">
            <span className="material-symbols-outlined text-[#2AD368] mb-4 text-4xl">psychology</span>
            <h4 className="font-bold text-lg mb-3 text-[var(--text-primary)]">Modèles IA</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Les modèles de vision et de langage d'EVE sont open source. 
              Entraînez vos propres modèles et partagez vos découvertes.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#2AD368] text-[var(--btn-primary-text)] font-bold px-8 py-4 rounded-full shadow-xl shadow-[#2AD368]/20 hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined">code</span>
            <span>Voir sur GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
