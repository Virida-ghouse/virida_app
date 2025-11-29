import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import MainApp from './components/MainApp';
import AuthContainer from './components/auth/AuthContainer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#FFFFFF' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  return <MainApp />;
};

function App() {
  console.log('🎯 App.tsx - Composant App en cours de rendu');

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
