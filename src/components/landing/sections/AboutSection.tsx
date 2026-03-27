import React from 'react';


const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block text-sm">
            Notre histoire
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-[var(--text-primary)]">
            10 étudiants, 1 idée, 1 serre
          </h2>
        </div>

        {/* Story + photo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16">
          <div>
            <div className="relative">
              <div className="absolute -inset-10 bg-[#2AD368]/20 rounded-full blur-[100px]"></div>
              <div className="glass-card rounded-[3rem] p-4 overflow-hidden shadow-2xl relative border-2 border-[var(--border-color)]">
                <img
                  src="/team_photo.jpg"
                  alt="L'équipe Virida avec le prototype de la serre"
                  className="w-full h-full min-h-[400px] md:min-h-[500px] object-cover object-top rounded-[2.5rem]"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="glass-card rounded-2xl p-6 border border-[#CBED62]/30 bg-[#CBED62]/5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#CBED62] text-2xl">lightbulb</span>
                <h3 className="font-bold text-lg text-[var(--text-primary)]">La naissance de Virida</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Tout est parti de Christophe, passionné de jumeaux numériques mais qui n'a
                absolument pas la main verte. Son idée : <span className="font-semibold text-[var(--text-primary)]">et si on créait
                un jumeau numérique pour les plantes ?</span> Une IA qui comprend, surveille
                et s'occupe de tout à votre place.
              </p>
            </div>

            <p className="text-[var(--text-secondary)] text-base mb-4 leading-relaxed">
              On est 10 étudiants à Epitech Paris. Décembre 2024, l'idée de Christophe
              nous accroche tous. On regarde ce qui existe sur le marché : rien. Pas de
              serre connectée abordable, pas d'IA embarquée, pas d'open source. Le créneau
              est vide.
            </p>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              Alors on construit. La serre, l'IA, le dashboard — <span className="font-semibold text-[var(--text-primary)]">tout
              de zéro, tout nous-mêmes.</span> Parce qu'on pense que tout le monde
              devrait pouvoir faire pousser ses propres plantes, même en appartement,
              même sans y connaître quoi que ce soit.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="glass-card rounded-xl p-3 border border-[var(--border-color)] text-center">
                <div className="text-xl font-black text-[#2AD368]">10</div>
                <div className="text-[10px] text-[var(--text-secondary)] font-semibold">Membres</div>
              </div>
              <div className="glass-card rounded-xl p-3 border border-[var(--border-color)] text-center">
                <div className="text-xl font-black text-[#CBED62]">6</div>
                <div className="text-[10px] text-[var(--text-secondary)] font-semibold">Domaines tech</div>
              </div>
              <div className="glass-card rounded-xl p-3 border border-[var(--border-color)] text-center">
                <div className="text-xl font-black text-[#2AD368]">Déc. 2024</div>
                <div className="text-[10px] text-[var(--text-secondary)] font-semibold">Lancement</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team signature */}
        <p className="text-center text-sm md:text-base text-[var(--text-secondary)] italic max-w-2xl mx-auto leading-relaxed">
          Setayesh, Christophe, Gaspard, Mathieu, Ludovic, Brandon, Tuan, Armand, Curtis & Alexis
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
