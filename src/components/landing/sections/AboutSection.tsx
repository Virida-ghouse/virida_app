import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="order-1">
            <div className="relative">
              <div className="absolute -inset-10 bg-[#2AD368]/20 rounded-full blur-[100px]"></div>
              <div className="glass-card rounded-[3rem] p-4 overflow-hidden shadow-2xl relative border-2 border-[var(--border-color)]">
                <img 
                  src="/team_photo.jpg" 
                  alt="L'équipe Virida" 
                  className="w-full aspect-[3/3] object-cover rounded-[2.5rem]"
                />
              </div>
            </div>
          </div>
          
          <div className="order-2">
            <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block">
              Notre Histoire
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
              Qui sommes-nous ?
            </h2>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-6 leading-relaxed">
              Virida est né d'une vision simple : rendre l'agriculture de précision accessible à tous. 
              Nous sommes une équipe passionnée d'ingénieurs, de designers et d'agronomes qui croient 
              en un futur où la technologie et la nature coexistent en harmonie.
            </p>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-6 leading-relaxed">
              Notre mission est de démocratiser l'agriculture intelligente en créant des outils 
              open source, abordables et puissants. Chaque serre Virida est conçue pour durer, 
              évoluer et s'adapter à vos besoins.
            </p>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
              Nous croyons fermement que l'avenir de l'alimentation passe par l'innovation locale, 
              la transparence et le partage des connaissances.
            </p>
            
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#2AD368] mb-2">500+</div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">Serres installées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#CBED62] mb-2">98%</div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">Satisfaction client</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#2AD368] mb-2">24/7</div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">Support actif</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
