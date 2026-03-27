import React from 'react';

const highlights = [
  { icon: 'smart_toy', title: 'Automatisation IA', desc: 'EVE pilote l\'arrosage, l\'éclairage et surveille vos plantes 24/7.' },
  { icon: 'sensors', title: '8 capteurs intégrés', desc: 'Humidité, pH, luminosité, niveaux d\'eau, et plus encore.' },
  { icon: 'photo_camera', title: 'Caméra', desc: 'Photo & vidéo pour que l\'IA analyse visuellement vos plantes.' },
  { icon: 'tv', title: 'Écran de contrôle', desc: 'Pilotez la serre directement, sans ouvrir le dashboard.' },
];

const allSpecs = [
  'Capteur humidité du sol',
  'Capteur pH',
  'Capteur luminosité',
  '2 capteurs niveaux d\'eau',
  'LED UV réglable',
  'Pompe à eau automatisée',
  'Caméra (photo & vidéo)',
  'Écran intégré',
  'Parois plexiglas aimantées',
];

const GreenhouseSection: React.FC = () => {
  return (
    <section id="serre" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block text-sm">
              La Serre
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-[var(--text-primary)]">
              Plantez. On s'occupe du reste.
            </h2>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-8 leading-relaxed">
              Un kit complet prêt à l'emploi. Vous plantez vos graines,
              et EVE gère automatiquement l'arrosage, la lumière et la santé
              de vos plantes. Parois en plexiglas maintenues par aimants
              pour ouvrir et accéder facilement à vos cultures.
            </p>

            {/* 4 highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {highlights.map((h) => (
                <div key={h.title} className="p-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-color)] backdrop-blur-xl">
                  <span className="material-symbols-outlined text-[#2AD368] text-2xl mb-2 block">{h.icon}</span>
                  <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">{h.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>

            {/* Full specs inline */}
            <div className="flex flex-wrap gap-2">
              {allSpecs.map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[11px] font-semibold text-[var(--text-secondary)]"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-10 bg-[#2AD368]/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="glass-card rounded-[3rem] p-4 overflow-hidden shadow-2xl relative border-2 border-[var(--border-color)]">
              <img
                src="/serre.jpg"
                alt="Prototype de la serre Virida"
                className="w-full aspect-[4/5] object-cover rounded-[2.5rem]"
              />
              {/* Prototype badge on image */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#CBED62] animate-pulse"></span>
                  <span className="text-xs font-bold text-white">Prototype — Design final en cours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreenhouseSection;
