import React from 'react';
import { useRGPD } from '../../contexts/RGPDContext';

const CookieConsentBanner: React.FC = () => {
  const { showBanner, acceptAll, refuseAll, openPreferences } = useRGPD();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] border-t-2 border-t-[#2AD368] rounded-2xl shadow-2xl">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#2AD368]/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#2AD368]">shield</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Protection de vos données</h3>
              <p className="text-[10px] text-[var(--text-secondary)]">Conformément au RGPD et à la loi Informatique et Libertés</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Nous utilisons des cookies essentiels au fonctionnement de Virida.
            Vous pouvez personnaliser vos préférences à tout moment.
            Données hébergées en France (Clever Cloud).
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={refuseAll}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-medium hover:border-[var(--text-secondary)] transition-all"
            >
              Refuser
            </button>
            <button
              onClick={openPreferences}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#2AD368] text-[#2AD368] text-sm font-medium hover:bg-[#2AD368]/10 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              Personnaliser
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#2AD368] text-white text-sm font-bold shadow-lg shadow-[#2AD368]/20 hover:bg-[#25B876] transition-all"
            >
              Accepter
            </button>
          </div>

          {/* Links */}
          <p className="text-[10px] text-[var(--text-secondary)]">
            En savoir plus :{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#2AD368] hover:underline">
              CNIL
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
