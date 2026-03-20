import React from 'react';

const EveSection: React.FC = () => {
  return (
    <section id="eve" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-[#CBED62] font-bold tracking-widest uppercase mb-4 block">
              L'Intelligence Artificielle
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
              Rencontrez <span className="text-[#CBED62] italic">EVE</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-6 leading-relaxed">
              EVE n'est pas qu'un simple assistant. C'est votre abeille numérique, 
              une IA locale qui analyse, apprend et optimise votre serre 24/7.
            </p>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
              Grâce à la vision par ordinateur et aux modèles de langage embarqués, 
              EVE détecte les maladies, prédit les récoltes et vous conseille en temps réel.
            </p>
            
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#CBED62]/10 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-[#CBED62] text-2xl">psychology</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)]">IA Embarquée</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Traitement local, zéro latence, données 100% privées
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#2AD368]/10 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-[#2AD368] text-2xl">visibility</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)]">Vision Intelligente</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Détection automatique des maladies et parasites par analyse d'image
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#CBED62]/10 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-[#CBED62] text-2xl">chat</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)]">Dialogue Naturel</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Posez vos questions en langage naturel, EVE vous répond instantanément
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-10 bg-[#CBED62]/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="glass-card rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl relative border-2 border-[var(--border-color)] backdrop-blur-xl flex items-center justify-center min-h-[400px] md:min-h-[500px]">
              <img 
                src="/abeillevd.svg" 
                alt="EVE - Assistant IA" 
                className="w-64 h-64 md:w-80 md:h-80"
                style={{ 
                  animation: 'float 6s ease-in-out infinite',
                  filter: 'brightness(0) saturate(100%) invert(64%) sepia(89%) saturate(419%) hue-rotate(76deg) brightness(95%) contrast(92%) drop-shadow(0 0 30px rgba(203,237,98,0.4)) drop-shadow(0 0 15px rgba(42,211,104,0.3))'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EveSection;
