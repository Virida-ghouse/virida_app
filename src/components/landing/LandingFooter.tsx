import React from 'react';

interface LandingFooterProps {
  onNavigateToLegal?: (page: 'mentions' | 'confidentialite') => void;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigateToLegal }) => {
  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      <div className="flex flex-col md:flex-row justify-between items-start px-6 sm:px-8 md:px-12 py-12 md:py-16 max-w-7xl mx-auto text-xs text-[var(--text-secondary)]">
        <div className="mb-10 md:mb-0">
          <div className="bg-[#1a3d2e] rounded-xl inline-block mb-4 md:mb-6">
            <img
              alt="Virida Logo"
              className="h-6 sm:h-7 md:h-8"
              src="/virida_logo.png"
            />
          </div>
          <p className="max-w-xs mb-6 md:mb-8 text-xs sm:text-sm leading-relaxed">
            La serre connectée pilotée par votre IA abeille locale.<br/>
            Projet étudiant Epitech Paris.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/virida-ghouse/"
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-color)] flex items-center justify-center hover:border-[#2AD368] hover:text-[#2AD368] transition-all text-[var(--text-secondary)]"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a
              href="mailto:virida.ghouse@gmail.com"
              className="size-9 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-color)] flex items-center justify-center hover:border-[#2AD368] hover:text-[#2AD368] transition-all text-[var(--text-secondary)]"
              title="Email"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16 w-full md:w-auto">
          <div className="flex flex-col gap-5">
            <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[10px]">Produit</span>
            <a className="hover:text-[#2AD368] transition-colors" href="#serre">La Serre</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#eve">EVE (IA)</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#marche">Marketplace</a>
            <a className="hover:text-[#2AD368] transition-colors" href="#tarifs">Offre</a>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[10px]">Légal</span>
            <button onClick={() => onNavigateToLegal?.('mentions')} className="hover:text-[#2AD368] transition-colors text-left">Mentions légales</button>
            <button onClick={() => onNavigateToLegal?.('confidentialite')} className="hover:text-[#2AD368] transition-colors text-left">Confidentialité</button>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[10px]">Contact</span>
            <a className="hover:text-[#2AD368] transition-colors" href="#contact">Formulaire</a>
            <a className="hover:text-[#2AD368] transition-colors" href="mailto:virida.ghouse@gmail.com">virida.ghouse@gmail.com</a>
            <a className="hover:text-[#2AD368] transition-colors" href="https://www.linkedin.com/company/virida-ghouse/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 pb-8 md:pb-12 text-center md:text-left border-t border-[var(--border-color)] pt-6 md:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">
            &copy; 2024-2026 Virida. Projet Epitech Paris.
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)]">
            24 rue Pasteur, Le Kremlin-Bicêtre
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
