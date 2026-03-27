import React from 'react';

const categories = [
  {
    icon: 'eco',
    title: 'Graines & semences',
    desc: 'Tomates, basilic, laitue, fraises... Des variétés sélectionnées pour la culture en serre.',
    examples: ['Tomates cerises', 'Basilic italien', 'Laitue romaine', 'Fraises des bois'],
  },
  {
    icon: 'science',
    title: 'Engrais & nutriments',
    desc: 'Solutions nutritives adaptées à chaque stade de croissance de vos plantes.',
    examples: ['Bio-Boost croissance', 'Nutriments floraison', 'Solution pH'],
  },
  {
    icon: 'potted_plant',
    title: 'Substrats & supports',
    desc: 'Terreau, billes d\'argile, laine de roche et tout ce qu\'il faut pour vos plantations.',
    examples: ['Terreau bio', 'Billes d\'argile', 'Perlite'],
  },
  {
    icon: 'build',
    title: 'Accessoires serre',
    desc: 'Pièces de rechange et accessoires compatibles pour customiser votre serre Virida.',
    examples: ['Capteurs additionnels', 'Bacs de culture', 'Tuyaux irrigation'],
  },
];

const MarketplaceSection: React.FC = () => {
  return (
    <section id="marche" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 md:mb-14">
        <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block text-sm">
          Marketplace
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
          Tout pour votre serre
        </h2>
        <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Graines, engrais, substrats et accessoires : trouvez tout ce dont vous avez besoin
          pour vos cultures, directement depuis l'app Virida.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="glass-card p-5 md:p-6 rounded-2xl border border-[var(--border-color)] backdrop-blur-xl hover:border-[#2AD368]/40 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-[#2AD368]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2AD368]/20 transition-colors">
                <span className="material-symbols-outlined text-[#2AD368] text-2xl">{cat.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)] group-hover:text-[#2AD368] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">{cat.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.examples.map((ex) => (
                    <span
                      key={ex}
                      className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-secondary)]"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div className="mt-10 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#2AD368]/10 border border-[#2AD368]/30">
          <span className="w-2 h-2 rounded-full bg-[#CBED62] animate-pulse"></span>
          <span className="text-sm font-bold text-[#2AD368]">Marketplace en cours de développement — Bientôt disponible</span>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
