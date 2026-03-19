import React from 'react';

const PricingSection: React.FC = () => {
  return (
    <section id="tarifs" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 text-[var(--text-primary)]">
            Prêt à récolter ?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg px-4">
            <span className="font-bold text-[var(--text-primary)]">Étape 1 :</span> Choisissez votre kit matériel<br/>
            <span className="font-bold text-[var(--text-primary)]">Étape 2 :</span> Ajoutez l'abonnement pour débloquer l'IA
          </p>
        </div>
        
        {/* Kits Matériel */}
        <div className="mb-10 md:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)] text-center flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[#2AD368] text-3xl">potted_plant</span>
            Kits Matériel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Kit Starter */}
            <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col hover:border-[#2AD368]/50 transition-all border border-[var(--border-color)] backdrop-blur-xl">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-[var(--text-primary)]">Kit Starter</h3>
              <p className="text-[var(--text-secondary)] mb-8 text-sm">
                Parfait pour les balcons urbains.
              </p>
              <div className="text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">299€</div>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Serre compacte (1m²)
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  5 capteurs environnementaux
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Système d'irrigation de base
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  LED 20W
                </li>
              </ul>
              <button className="w-full py-3 md:py-4 rounded-full border-2 border-[#2AD368] text-[#2AD368] font-bold hover:bg-[#2AD368] hover:text-[var(--btn-primary-text)] transition-all text-sm md:text-base">
                Commander
              </button>
            </div>
            
            {/* Kit Pro */}
            <div className="glass-card rounded-[2.5rem] p-10 flex flex-col hover:border-[#2AD368]/50 transition-all border border-[var(--border-color)] backdrop-blur-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#CBED62] text-[#052E1C] px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em]">
                POPULAIRE
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-[var(--text-primary)]">Kit Pro</h3>
              <p className="text-[var(--text-secondary)] mb-8 text-sm">
                Pour les maraîchers du futur.
              </p>
              <div className="text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">599€</div>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Grande serre (4m²)
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Caméra 4K & capteurs laser
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Irrigation auto-modulée
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  LED Full Spectrum 45W
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Support prioritaire
                </li>
              </ul>
              <button className="w-full py-3 md:py-4 rounded-full border-2 border-[#2AD368] text-[#2AD368] font-bold hover:bg-[#2AD368] hover:text-[var(--btn-primary-text)] transition-all text-sm md:text-base">
                Commander
              </button>
            </div>
          </div>
        </div>
        
        {/* Abonnement SaaS Optionnel */}
        <div className="mt-12 md:mt-16 pt-12 md:pt-16 border-t-2 border-[var(--border-color)]">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[var(--text-primary)] text-center flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[#2AD368] text-3xl">smart_toy</span>
            Abonnement Application <span className="text-[#CBED62]">(Optionnel)</span>
          </h3>
          <p className="text-center text-sm md:text-base text-[var(--text-secondary)] mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Débloquez tout le potentiel de votre serre avec l'IA Eve et un accès complet au dashboard
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative flex flex-col border-2 border-[#2AD368] shadow-[0_0_30px_rgba(42,211,104,0.2)] bg-[#2AD368]/5 backdrop-blur-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2AD368] text-[var(--btn-primary-text)] px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em]">
                RECOMMANDÉ
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-[var(--text-primary)]">Virida Premium</h3>
              <p className="text-[var(--text-secondary)] mb-8 text-sm">
                À ajouter à votre kit pour un accès débridé au dashboard et à l'IA Eve.
              </p>
              <div className="text-4xl md:text-5xl font-black mb-2 text-[var(--text-primary)]">
                +4.99€<span className="text-base md:text-lg font-normal text-[var(--text-secondary)]">/mois</span>
              </div>
              <p className="text-xs text-[#2AD368] font-bold mb-8">Sans engagement • Compatible avec tous les kits</p>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                <li className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">bolt</span> 
                  Assistant IA Eve Premium
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Analyse vision par IA illimitée
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Automatisations intelligentes
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Cloud Timelapses 4K
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Accès marketplace (0% commission)
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[#2AD368]">check_circle</span> 
                  Mises à jour et nouvelles fonctionnalités
                </li>
              </ul>
              <button className="w-full py-3 md:py-4 rounded-full bg-[#2AD368] text-[var(--btn-primary-text)] font-bold shadow-lg shadow-[#2AD368]/30 hover:brightness-110 transition-all text-sm md:text-base">
                S'abonner Maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
