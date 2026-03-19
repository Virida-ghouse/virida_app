import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from '@mui/material';
import MainAppNew from './components/MainAppNew';
import AuthContainerNew from './components/auth/AuthContainerNew';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RGPDProvider } from './contexts/RGPDContext';
import { ChatHistoryProvider } from './contexts/ChatHistoryContext';
import CookieConsentBanner from './components/rgpd/CookieConsentBanner';
import CookiePreferencesModal from './components/rgpd/CookiePreferencesModal';
import theme from './theme';

// Composant pour gérer l'état d'authentification
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--bg-primary)]">
        <CircularProgress size={60} sx={{ color: '#1fc75c' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainerNew />;
  }

  return <MainAppNew />;
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
