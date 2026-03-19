import React from 'react';

const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      <div className="flex flex-col md:flex-row justify-between items-start px-6 sm:px-8 md:px-12 py-12 md:py-16 max-w-7xl mx-auto text-xs text-[var(--text-secondary)]">
        <div className="mb-10 md:mb-0">
          <img 
            alt="Virida Logo" 
            className="h-6 sm:h-7 md:h-8 mb-4 md:mb-6" 
            src="/virida_logo.png"
          />
          <p className="max-w-xs mb-6 md:mb-8 text-xs sm:text-sm leading-relaxed">
            Conservatoire Néo-Futuriste.<br/>
            L'excellence technologique au service de la biodiversité.
          </p>
          <div className="flex gap-6">
            <a className="material-symbols-outlined text-[var(--text-secondary)] hover:text-[#2AD368] transition-colors text-xl" href="#">
              public
            </a>
            <a className="material-symbols-outlined text-[var(--text-secondary)] hover:text-[#2AD368] transition-colors text-xl" href="#">
              share
            </a>
            <a className="material-symbols-outlined text-[var(--text-secondary)] hover:text-[#2AD368] transition-colors text-xl" href="#">
              mail
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16 w-full md:w-auto">
          <div className="flex flex-col gap-5">
            <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[10px]">Produit</span>
            <a className="hover:text-[#2AD368] transition-colors" href="#serre">La Serre</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#marche">Marché</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#tarifs">Abonnements</a>
          </div>
          
          <div className="flex flex-col gap-5">
            <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[10px]">Légal</span>
            <a className="hover:text-[#2AD368] transition-colors" href="#">Confidentialité</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#">CGV</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#">Cookies</a>
          </div>
          
          <div className="flex flex-col gap-5">
            <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[10px]">Support</span>
            <a className="hover:text-[#2AD368] transition-colors" href="#">Aide</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#">Newsletter</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#">API Docs</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 pb-8 md:pb-12 text-center md:text-left border-t border-[var(--border-color)] pt-6 md:pt-8">
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">
          © 2024 Virida Neon Conservatory. Cultivez avec intelligence.
        </span>
      </div>
    </footer>
  );
};

export default LandingFooter;
