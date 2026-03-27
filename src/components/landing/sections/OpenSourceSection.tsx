import React from 'react';

const OpenSourceSection: React.FC = () => {
  return (
    <section id="opensource" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block text-sm">
            Open Source
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
            Transparent par nature
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Virida est un projet open source. Tout notre code, nos schémas et nos modèles IA
            sont accessibles librement. Pas de boîte noire, pas de surprises.
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
                <p className="text-xs text-[#2AD368] font-bold">Libre • Transparent • Communautaire</p>
              </div>
            </div>
            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
              Le <span className="font-bold text-[var(--text-primary)]">code source</span> du dashboard,
              les <span className="font-bold text-[var(--text-primary)]">schémas électroniques</span> de la serre,
              le <span className="font-bold text-[var(--text-primary)]">firmware des capteurs</span> et
              les <span className="font-bold text-[var(--text-primary)]">modèles IA d'EVE</span> sont
              accessibles à tous. Vous savez exactement ce qui tourne chez vous.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-[#2AD368]">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>Virida appartient à sa communauté</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl">
            <span className="material-symbols-outlined text-[#2AD368] mb-4 text-4xl">construction</span>
            <h4 className="font-bold text-lg mb-3 text-[var(--text-primary)]">Plans & schémas</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Plans de construction de la serre et schémas électroniques complets.
              Construisez, modifiez et partagez vos améliorations.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl">
            <span className="material-symbols-outlined text-[#2AD368] mb-4 text-4xl">terminal</span>
            <h4 className="font-bold text-lg mb-3 text-[var(--text-primary)]">Dashboard & API</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Le code du dashboard, des capteurs et de l'API backend est entièrement ouvert.
              Contribuez et adaptez selon vos besoins.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl">
            <span className="material-symbols-outlined text-[#2AD368] mb-4 text-4xl">psychology</span>
            <h4 className="font-bold text-lg mb-3 text-[var(--text-primary)]">Modèle IA (Qwen)</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Le modèle d'EVE et son jeu de données agronomique sont open source.
              Entraînez, améliorez et partagez vos découvertes.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-4">Le repo GitHub sera bientôt disponible publiquement.</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--glass-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold">
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span className="text-sm">Restez informé via le formulaire de contact</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
