import React from 'react';

const kitFeatures = [
  'Serre complète avec structure plexiglas',
  'Capteur humidité du sol',
  'Capteur pH',
  'Capteur luminosité',
  '2 capteurs niveaux d\'eau',
  'LED UV réglable',
  'Pompe à eau automatisée',
  'Caméra (photo & vidéo)',
  'Écran de contrôle intégré',
  'Parois aimantées pour accès facile',
];

const appFeatures = [
  'Dashboard de contrôle complet',
  'Assistant IA EVE (Qwen local)',
  'Analyse vision par caméra',
  'Automatisations intelligentes',
  'Suivi de croissance & historique',
  'Alertes et notifications',
  'Marketplace (bientôt)',
  'Mises à jour continues',
];

const PricingSection: React.FC = () => {
  return (
    <section id="tarifs" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block text-sm">
            Offre
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4">
            Une serre, tout inclus
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Un seul kit pour démarrer. Pas de choix compliqué :
            vous recevez la serre complète avec tous les capteurs, et 3 mois offerts
            avec EVE et toutes les fonctionnalités.
          </p>
        </div>

        {/* Main offer */}
        <div className="glass-card rounded-3xl border-2 border-[#2AD368] overflow-hidden backdrop-blur-xl relative mb-8">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2AD368]/10 rounded-full blur-[100px]"></div>

          {/* Badge */}
          <div className="bg-[#2AD368] text-center py-2.5">
            <span className="text-sm font-bold text-white tracking-wide">Kit Starter — Tout est inclus</span>
          </div>

          <div className="p-6 md:p-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Kit hardware */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-12 rounded-xl bg-[#2AD368]/10 border border-[#2AD368]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#2AD368] text-2xl">inventory_2</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[var(--text-primary)]">La Serre</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Matériel livré chez vous</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {kitFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <span className="material-symbols-outlined text-[#2AD368] text-lg mt-0.5 shrink-0">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* App features */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-12 rounded-xl bg-[#CBED62]/10 border border-[#CBED62]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#CBED62] text-2xl">dashboard</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[var(--text-primary)]">L'App + EVE</h3>
                    <p className="text-xs text-[#2AD368] font-bold">3 mois offerts</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {appFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <span className="material-symbols-outlined text-[#CBED62] text-lg mt-0.5 shrink-0">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Prix du kit bientôt annoncé</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Puis <span className="font-bold text-[#2AD368]">4,99 &euro;/mois</span> après les 3 mois offerts &bull; Sans engagement
                </p>
              </div>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-full bg-[#2AD368] text-white font-bold shadow-lg shadow-[#2AD368]/20 hover:scale-105 transition-all text-sm whitespace-nowrap"
              >
                Rejoindre la liste d'attente
              </a>
            </div>
          </div>
        </div>

        {/* Freemium note */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--border-color)]">
            <span className="material-symbols-outlined text-[var(--text-secondary)] text-lg">info</span>
            <span className="text-xs text-[var(--text-secondary)]">
              Le dashboard est gratuit en version de base. L'abonnement premium (4,99 &euro;/mois) débloque EVE et toutes les fonctionnalités.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
