import React, { useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from '@mui/material';
import MainAppNew from './components/MainAppNew';
import AuthContainerNew from './components/auth/AuthContainerNew';
import LandingPage from './components/landing/LandingPage';
import MentionsLegales from './components/legal/MentionsLegales';
import PolitiqueConfidentialite from './components/legal/PolitiqueConfidentialite';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RGPDProvider } from './contexts/RGPDContext';
import { ChatHistoryProvider } from './contexts/ChatHistoryContext';
import CookieConsentBanner from './components/rgpd/CookieConsentBanner';
import CookiePreferencesModal from './components/rgpd/CookiePreferencesModal';
import { OnboardingProvider } from './components/onboarding/OnboardingContext';
import OnboardingOverlay from './components/onboarding/OnboardingOverlay';
import theme from './theme';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [legalPage, setLegalPage] = useState<'mentions' | 'confidentialite' | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--bg-primary)]">
        <CircularProgress size={60} sx={{ color: '#1fc75c' }} />
      </div>
    );
  }

  if (legalPage === 'mentions') {
    return <MentionsLegales onBack={() => { setLegalPage(null); window.scrollTo(0, 0); }} />;
  }
  if (legalPage === 'confidentialite') {
    return <PolitiqueConfidentialite onBack={() => { setLegalPage(null); window.scrollTo(0, 0); }} />;
  }

  if (isAuthenticated) {
    return (
      // OnboardingProvider ici → accessible par MainAppNew (Settings) ET OnboardingOverlay
      <OnboardingProvider>
        <MainAppNew />
        <OnboardingOverlay />
      </OnboardingProvider>
    );
  }

  if (showLanding) {
    return <LandingPage onNavigateToLogin={() => setShowLanding(false)} onNavigateToLegal={setLegalPage} />;
  }

  return <AuthContainerNew onBackToLanding={() => { window.scrollTo(0, 0); setShowLanding(true); }} onNavigateToLegal={setLegalPage} />;
};

function App() {
  return (
    <ThemeProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <RGPDProvider>
          <AuthProvider>
            <ChatHistoryProvider>
              <AppContent />
              <CookieConsentBanner />
              <CookiePreferencesModal />
            </ChatHistoryProvider>
          </AuthProvider>
        </RGPDProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export default App;
