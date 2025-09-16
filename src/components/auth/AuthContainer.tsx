import React, { useState } from 'react';
import { Box, Paper, Alert, Typography } from '@mui/material';
import { Settings } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          background: 'linear-gradient(180deg, #2E7D32 0%, #1B5E20 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo and Brand */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
            }}
          >
            <img 
              src="/logo - vert - vert foncé.svg" 
              alt="Virida Logo" 
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              fontSize: '2.5rem',
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
              fontSize: '1.1rem',
            }}
          >
            Smart Greenhouse
            <br />
            Management
          </Typography>
        </Box>

        {/* Decorative elements */}
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
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: 6,
            borderRadius: 4,
            maxWidth: 480,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
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
