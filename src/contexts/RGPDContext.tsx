import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 📋 Types de cookies selon le document juridique RGPD
export interface CookieConsent {
  essential: boolean;      // Toujours true - cookies nécessaires au fonctionnement
  analytics: boolean;      // Google Analytics, statistiques
  functional: boolean;     // Préférences utilisateur, paramètres
  marketing: boolean;      // Publicité (pas utilisé pour Virida mais inclus par conformité)
}

export interface RGPDContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  acceptAll: () => void;
  refuseAll: () => void;
  savePreferences: (preferences: CookieConsent) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  showPreferencesModal: boolean;
}

const defaultConsent: CookieConsent = {
  essential: true,         // Toujours activé
  analytics: false,
  functional: false,
  marketing: false,
};

const RGPDContext = createContext<RGPDContextType | undefined>(undefined);

export const useRGPD = () => {
  const context = useContext(RGPDContext);
  if (!context) {
    throw new Error('useRGPD doit être utilisé dans un RGPDProvider');
  }
  return context;
};

interface RGPDProviderProps {
  children: ReactNode;
}

export const RGPDProvider: React.FC<RGPDProviderProps> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // 🔄 Charger les préférences depuis localStorage au démarrage
  useEffect(() => {
    const storedConsent = localStorage.getItem('virida_rgpd_consent');
    const consentDate = localStorage.getItem('virida_rgpd_consent_date');

    if (storedConsent && consentDate) {
      // Vérifier si le consentement a plus de 13 mois (conformité CNIL)
      const consentTimestamp = parseInt(consentDate);
      const thirteenMonths = 13 * 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (now - consentTimestamp < thirteenMonths) {
        // Consentement toujours valide
        setConsent(JSON.parse(storedConsent));
        setShowBanner(false);
      } else {
        // Consentement expiré - demander à nouveau
        setShowBanner(true);
      }
    } else {
      // Aucun consentement enregistré - afficher la bannière
      setShowBanner(true);
    }
  }, []);

  // ✅ Accepter tous les cookies
  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: false, // Virida n'utilise pas de cookies marketing
    };
    saveConsentToStorage(fullConsent);
    setConsent(fullConsent);
    setShowBanner(false);
    console.log('✅ RGPD: Tous les cookies acceptés');
  };

  // ❌ Refuser les cookies non essentiels
  const refuseAll = () => {
    const minimalConsent: CookieConsent = {
      ...defaultConsent,
    };
    saveConsentToStorage(minimalConsent);
    setConsent(minimalConsent);
    setShowBanner(false);
    console.log('❌ RGPD: Cookies non essentiels refusés');
  };

  // 💾 Sauvegarder les préférences personnalisées
  const savePreferences = (preferences: CookieConsent) => {
    // S'assurer que les cookies essentiels restent activés
    const validatedPreferences = {
      ...preferences,
      essential: true,
    };
    saveConsentToStorage(validatedPreferences);
    setConsent(validatedPreferences);
    setShowBanner(false);
    setShowPreferencesModal(false);
    console.log('💾 RGPD: Préférences sauvegardées', validatedPreferences);
  };

  // 💾 Fonction helper pour sauvegarder dans localStorage
  const saveConsentToStorage = (consentData: CookieConsent) => {
    localStorage.setItem('virida_rgpd_consent', JSON.stringify(consentData));
    localStorage.setItem('virida_rgpd_consent_date', Date.now().toString());

    // 📊 Enregistrement dans le registre de traitement (conformité Art. 30 RGPD)
    const consentLog = {
      timestamp: new Date().toISOString(),
      consent: consentData,
      userAgent: navigator.userAgent,
    };

    // Stocker les logs de consentement (limiter à 50 derniers)
    const existingLogs = JSON.parse(localStorage.getItem('virida_rgpd_logs') || '[]');
    const updatedLogs = [consentLog, ...existingLogs].slice(0, 50);
    localStorage.setItem('virida_rgpd_logs', JSON.stringify(updatedLogs));
  };

  // 🔧 Ouvrir/fermer le modal de préférences
  const openPreferences = () => setShowPreferencesModal(true);
  const closePreferences = () => setShowPreferencesModal(false);

  const value: RGPDContextType = {
    consent,
    showBanner,
    acceptAll,
    refuseAll,
    savePreferences,
    openPreferences,
    closePreferences,
    showPreferencesModal,
  };

  return <RGPDContext.Provider value={value}>{children}</RGPDContext.Provider>;
};
