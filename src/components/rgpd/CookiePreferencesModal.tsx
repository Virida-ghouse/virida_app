import React, { useState, useEffect } from 'react';
import { useRGPD, CookieConsent } from '../../contexts/RGPDContext';

const cookieCategories = [
  {
    key: 'essential' as keyof CookieConsent,
    title: 'Cookies essentiels',
    icon: 'shield',
    color: '#2AD368',
    description: 'Nécessaires au fonctionnement de Virida : navigation, connexion et sécurité.',
    examples: 'Session utilisateur, authentification JWT, préférences de langue, sécurité',
    required: true,
  },
  {
    key: 'functional' as keyof CookieConsent,
    title: 'Cookies fonctionnels',
    icon: 'tune',
    color: '#4A90E2',
    description: 'Mémorisent vos préférences pour améliorer votre expérience (thème, unités, disposition).',
    examples: 'Thème sombre/clair, unités °C/°F, disposition des widgets, notifications',
    required: false,
  },
  {
    key: 'analytics' as keyof CookieConsent,
    title: 'Cookies analytiques',
    icon: 'bar_chart',
    color: '#FF6B35',
    description: 'Nous aident à comprendre comment vous utilisez Virida. Données anonymisées, hébergées en France.',
    examples: 'Pages visitées, temps passé, fonctionnalités utilisées',
    required: false,
  },
  {
    key: 'marketing' as keyof CookieConsent,
    title: 'Cookies marketing',
    icon: 'campaign',
    color: '#9B59B6',
    description: 'Non utilisés par Virida. Catégorie présente par conformité réglementaire.',
    examples: 'Non utilisé',
    required: false,
  },
];

const CookiePreferencesModal: React.FC = () => {
  const { showPreferencesModal, closePreferences, savePreferences, consent } = useRGPD();
  const [preferences, setPreferences] = useState<CookieConsent>({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
  });
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    if (consent) setPreferences(consent);
  }, [consent, showPreferencesModal]);

  const handleToggle = (key: keyof CookieConsent) => {
    if (key === 'essential') return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => savePreferences(preferences);

  const handleAcceptAll = () => {
    const all = { essential: true, analytics: true, functional: true, marketing: false };
    setPreferences(all);
    savePreferences(all);
  };

  const handleRefuseAll = () => {
    const min = { essential: true, analytics: false, functional: false, marketing: false };
    setPreferences(min);
    savePreferences(min);
  };

  if (!showPreferencesModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={closePreferences}>
      <div
        className="bg-[var(--bg-secondary)] w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl border border-[var(--border-color)] shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#2AD368]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#2AD368]">shield</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">Préférences cookies</h2>
              <p className="text-[10px] text-[var(--text-secondary)]">Conformité CNIL — Conservation 13 mois</p>
            </div>
          </div>
          <button onClick={closePreferences} className="size-8 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
            Vous avez le contrôle total sur vos données. Choisissez les cookies que vous souhaitez autoriser.
          </p>

          {cookieCategories.map((cat) => (
            <div
              key={cat.key}
              className={`rounded-2xl border transition-all ${
                expandedKey === cat.key ? 'border-[#2AD368]/50' : 'border-[var(--border-color)]'
              }`}
            >
              {/* Summary */}
              <div className="p-4 flex items-center gap-3">
                <div
                  className="size-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <span className="material-symbols-outlined text-lg" style={{ color: cat.color }}>{cat.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{cat.title}</span>
                    {cat.required && (
                      <span className="text-[9px] font-bold text-[#2AD368] px-1.5 py-0.5 rounded-full bg-[#2AD368]/10">Requis</span>
                    )}
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => !cat.required && handleToggle(cat.key)}
                  className={`relative rounded-full transition-colors shrink-0 ${
                    preferences[cat.key] ? 'bg-[#2AD368]' : 'bg-[var(--border-color)]'
                  } ${cat.required ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  style={{ width: '40px', height: '22px' }}
                >
                  <span
                    className="absolute top-[2px] rounded-full bg-white shadow-sm transition-all duration-200"
                    style={{
                      width: '18px',
                      height: '18px',
                      left: preferences[cat.key] ? '20px' : '2px',
                    }}
                  />
                </button>

                {/* Expand */}
                <button
                  onClick={() => setExpandedKey(expandedKey === cat.key ? null : cat.key)}
                  className="size-7 rounded-lg hover:bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] shrink-0"
                >
                  <span className={`material-symbols-outlined text-lg transition-transform ${expandedKey === cat.key ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
              </div>

              {/* Details */}
              {expandedKey === cat.key && (
                <div className="px-4 pb-4 pt-0 space-y-2">
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{cat.description}</p>
                  <div className="p-2.5 rounded-lg bg-[var(--bg-primary)]">
                    <p className="text-[10px] font-bold text-[var(--text-primary)] mb-0.5">Exemples :</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">{cat.examples}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* RGPD info */}
          <div className="p-3 rounded-xl bg-[#2AD368]/5 border border-[#2AD368]/20">
            <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">Vos droits RGPD :</strong> Vous pouvez accéder, modifier, supprimer vos données ou exercer votre droit à la portabilité à tout moment. Données hébergées en France (Clever Cloud).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleRefuseAll}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
          >
            Tout refuser
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-xl border border-[#2AD368] text-[#2AD368] text-sm font-semibold hover:bg-[#2AD368]/10 transition-all"
            >
              Tout accepter
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#2AD368] text-white text-sm font-bold shadow-lg shadow-[#2AD368]/20 hover:bg-[#25B876] transition-all"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;
