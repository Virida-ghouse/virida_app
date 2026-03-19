import React, { useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from '@mui/material';
import MainAppNew from './components/MainAppNew';
import AuthContainerNew from './components/auth/AuthContainerNew';
import LandingPage from './components/landing/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RGPDProvider } from './contexts/RGPDContext';
import { ChatHistoryProvider } from './contexts/ChatHistoryContext';
import CookieConsentBanner from './components/rgpd/CookieConsentBanner';
import CookiePreferencesModal from './components/rgpd/CookiePreferencesModal';
import theme from './theme';

// Composant pour gérer l'état d'authentification et le routing
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--bg-primary)]">
        <CircularProgress size={60} sx={{ color: '#1fc75c' }} />
      </div>
    );
  }

  // Si authentifié, afficher l'app
  if (isAuthenticated) {
    return <MainAppNew />;
  }

  // Si non authentifié, afficher landing ou login selon l'état
  if (showLanding) {
    return <LandingPage onNavigateToLogin={() => setShowLanding(false)} />;
  }

  return <AuthContainerNew onBackToLanding={() => setShowLanding(true)} />;
};

function App() {
  console.log(' App.tsx - Composant App en cours de rendu');
  console.log('🎯 App.tsx - Composant App en cours de rendu');

  return (
    <ThemeProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <RGPDProvider>
          <AuthProvider>
            <ChatHistoryProvider>
              <AppContent />
              {/* 🍪 Composants RGPD - Affichés globalement */}
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
