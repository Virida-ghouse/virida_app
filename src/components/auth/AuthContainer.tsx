import React, { useState } from 'react';
import { Box, Paper, Alert, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Settings } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📱 Détection mobile
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // 🎨 Styles conditionnels pour éviter les types complexes
  const sidebarWidth = isMobile ? '100%' : 280;
  const sidebarMinHeight = isMobile ? '35vh' : 'auto';
  const sidebarShadow = isMobile ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '4px 0 20px rgba(0, 0, 0, 0.1)';
  const sidebarPadding = isMobile ? 3 : 0;
  const logoSize = isMobile ? 60 : 80;
  const logoImgSize = isMobile ? '45px' : '60px';
  const titleFontSize = isMobile ? '2rem' : '2.5rem';
  const subtitleFontSize = isMobile ? '0.95rem' : '1.1rem';
  const contentPadding = isMobile ? 2 : 4;
  const paperPadding = isMobile ? 3 : 6;
  const paperShadow = isMobile ? '0 2px 10px rgba(0, 0, 0, 0.05)' : '0 10px 25px rgba(0, 0, 0, 0.08)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', // 📱 Colonne sur mobile
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Sidebar - Partie verte avec logo */}
      <Box
        sx={{
          width: sidebarWidth,
          minHeight: sidebarMinHeight,
          background: 'linear-gradient(180deg, #2E7D32 0%, #1B5E20 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: sidebarShadow,
          padding: sidebarPadding,
        }}
      >
        {/* Logo and Brand */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            mb: isMobile ? 2 : 4,
          }}
        >
          <Box
            sx={{
              width: logoSize,
              height: logoSize,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: isMobile ? 2 : 3,
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
            }}
          >
            <img
              src="/logo - vert - vert foncé.svg"
              alt="Virida Logo"
              style={{
                width: logoImgSize,
                height: logoImgSize,
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              fontSize: titleFontSize,
              letterSpacing: '-0.02em',
            }}
          >
            Virida
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              textAlign: 'center',
              mt: 1,
              fontSize: subtitleFontSize,
            }}
          >
            Smart Greenhouse
            <br />
            Management
          </Typography>
        </Box>

        {/* Decorative elements - Caché sur mobile */}
        {!isMobile && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: 40,
              width: 60,
              height: 60,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={24} color="rgba(255, 255, 255, 0.7)" />
          </Box>
        )}
      </Box>

      {/* Main Content - Formulaire */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: contentPadding,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: paperPadding,
            borderRadius: 4,
            maxWidth: 480,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: paperShadow,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          {isLogin ? (
            <LoginForm onToggleMode={handleToggleMode} onError={handleError} />
          ) : (
            <RegisterForm onToggleMode={handleToggleMode} onError={handleError} />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthContainer;
