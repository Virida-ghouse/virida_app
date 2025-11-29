import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Link,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Shield, Cookie, Settings } from 'lucide-react';
import { useRGPD } from '../../contexts/RGPDContext';

/**
 * 🍪 Bannière de consentement RGPD
 *
 * Affichée au premier chargement de l'application et tous les 13 mois
 * (conformité CNIL - renouvellement du consentement)
 *
 * Selon l'Art. 82 de la loi Informatique et Libertés modifiée
 */
const CookieConsentBanner: React.FC = () => {
  const { showBanner, acceptAll, refuseAll, openPreferences } = useRGPD();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!showBanner) {
    return null;
  }

  return (
    <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: '#FFFFFF',
          borderTop: `3px solid #2AD388`,
          borderRadius: '16px 16px 0 0',
          maxWidth: isMobile ? '100%' : '900px',
          margin: '0 auto',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box
          sx={{
            padding: isMobile ? 2 : 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* 🔒 En-tête avec icône */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Shield size={28} color="#2AD388" />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#052E1C',
                fontSize: isMobile ? '1.1rem' : '1.25rem',
              }}
            >
              Protection de vos données personnelles
            </Typography>
          </Box>

          {/* 📝 Message d'information */}
          <Typography
            variant="body2"
            sx={{
              color: '#333333',
              lineHeight: 1.6,
              fontSize: isMobile ? '0.875rem' : '0.95rem',
            }}
          >
            Nous utilisons des cookies et technologies similaires pour améliorer votre
            expérience, analyser le trafic et personnaliser le contenu. Les cookies
            essentiels sont nécessaires au fonctionnement de Virida.
          </Typography>

          {/* 📋 Informations RGPD */}
          <Box
            sx={{
              backgroundColor: '#F5F5F5',
              padding: 1.5,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Cookie size={20} color="#666666" />
            <Typography variant="caption" sx={{ color: '#666666', flex: 1 }}>
              Vos données sont hébergées en France 🇫🇷 (Scaleway/OVH) et chiffrées
              (AES-256). Conformément au RGPD, vous pouvez exercer vos droits à tout
              moment.
            </Typography>
          </Box>

          {/* 🔗 Liens vers politique de confidentialité */}
          <Typography variant="caption" sx={{ color: '#666666' }}>
            En savoir plus :{' '}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Ouvrir la page de politique de confidentialité
                console.log('Ouvrir politique de confidentialité');
              }}
              sx={{
                color: '#2AD388',
                textDecoration: 'underline',
                fontWeight: 500,
                '&:hover': { color: '#25B876' },
              }}
            >
              Politique de confidentialité
            </Link>
            {' • '}
            <Link
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#2AD388',
                textDecoration: 'underline',
                fontWeight: 500,
                '&:hover': { color: '#25B876' },
              }}
            >
              CNIL
            </Link>
          </Typography>

          {/* 🎛️ Boutons d'action */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1.5,
              marginTop: 1,
            }}
          >
            {/* Tout refuser */}
            <Button
              variant="outlined"
              onClick={refuseAll}
              sx={{
                flex: 1,
                borderColor: '#CCCCCC',
                color: '#666666',
                fontWeight: 500,
                textTransform: 'none',
                padding: '10px 20px',
                '&:hover': {
                  borderColor: '#999999',
                  backgroundColor: '#F5F5F5',
                },
              }}
            >
              Refuser tout
            </Button>

            {/* Personnaliser */}
            <Button
              variant="outlined"
              startIcon={<Settings size={18} />}
              onClick={openPreferences}
              sx={{
                flex: 1,
                borderColor: '#2AD388',
                color: '#2AD388',
                fontWeight: 500,
                textTransform: 'none',
                padding: '10px 20px',
                '&:hover': {
                  borderColor: '#25B876',
                  backgroundColor: '#E8F8F1',
                },
              }}
            >
              Personnaliser
            </Button>

            {/* Tout accepter */}
            <Button
              variant="contained"
              onClick={acceptAll}
              sx={{
                flex: 1,
                backgroundColor: '#2AD388',
                color: '#FFFFFF',
                fontWeight: 600,
                textTransform: 'none',
                padding: '10px 20px',
                boxShadow: '0 2px 8px rgba(42, 211, 136, 0.3)',
                '&:hover': {
                  backgroundColor: '#25B876',
                  boxShadow: '0 4px 12px rgba(42, 211, 136, 0.4)',
                },
              }}
            >
              Accepter tout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};

export default CookieConsentBanner;
