import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { X, ChevronDown, Shield, BarChart3, Settings, Megaphone } from 'lucide-react';
import { useRGPD, CookieConsent } from '../../contexts/RGPDContext';

/**
 * 🍪 Modal de gestion des préférences des cookies
 *
 * Permet à l'utilisateur de personnaliser ses choix de cookies
 * conformément à l'Art. 82 de la loi Informatique et Libertés
 */
const CookiePreferencesModal: React.FC = () => {
  const { showPreferencesModal, closePreferences, savePreferences, consent } = useRGPD();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // État local des préférences
  const [preferences, setPreferences] = useState<CookieConsent>({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
  });

  // Charger les préférences actuelles quand le modal s'ouvre
  useEffect(() => {
    if (consent) {
      setPreferences(consent);
    }
  }, [consent, showPreferencesModal]);

  const handleToggle = (key: keyof CookieConsent) => {
    if (key === 'essential') return; // Les cookies essentiels ne peuvent pas être désactivés
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      analytics: true,
      functional: true,
      marketing: false,
    });
    savePreferences({
      essential: true,
      analytics: true,
      functional: true,
      marketing: false,
    });
  };

  const handleRefuseAll = () => {
    setPreferences({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
    savePreferences({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
  };

  // Configuration des catégories de cookies
  const cookieCategories = [
    {
      key: 'essential' as keyof CookieConsent,
      title: 'Cookies Essentiels',
      icon: <Shield size={24} color="#2AD368" />,
      description:
        'Ces cookies sont nécessaires au fonctionnement de Virida. Ils permettent la navigation, la connexion et la sécurité. Ils ne peuvent pas être désactivés.',
      required: true,
      examples: 'Session utilisateur, authentification, préférences de langue, sécurité CSRF',
    },
    {
      key: 'functional' as keyof CookieConsent,
      title: 'Cookies Fonctionnels',
      icon: <Settings size={24} color="#4A90E2" />,
      description:
        'Ces cookies permettent de mémoriser vos préférences et d\'améliorer votre expérience (thème, unités de mesure, disposition du dashboard).',
      required: false,
      examples: 'Thème sombre/clair, unités °C/°F, disposition des widgets, préférences de notifications',
    },
    {
      key: 'analytics' as keyof CookieConsent,
      title: 'Cookies Analytiques',
      icon: <BarChart3 size={24} color="#FF6B35" />,
      description:
        'Ces cookies nous aident à comprendre comment vous utilisez Virida pour améliorer nos services. Les données sont anonymisées et hébergées en France.',
      required: false,
      examples:
        'Pages visitées, temps passé, fonctionnalités utilisées, performances (hébergé en France 🇫🇷)',
    },
    {
      key: 'marketing' as keyof CookieConsent,
      title: 'Cookies Marketing',
      icon: <Megaphone size={24} color="#9B59B6" />,
      description:
        'Virida n\'utilise actuellement aucun cookie marketing ou publicitaire. Cette catégorie est présente par conformité réglementaire.',
      required: false,
      examples: 'Non utilisé par Virida',
    },
  ];

  return (
    <Dialog
      open={showPreferencesModal}
      onClose={closePreferences}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '16px',
          maxHeight: isMobile ? '100vh' : '90vh',
        },
      }}
    >
      {/* En-tête */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          borderBottom: '2px solid #2AD368',
          padding: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Shield size={28} color="#2AD368" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#052E1C' }}>
            Préférences de confidentialité
          </Typography>
        </Box>
        <IconButton onClick={closePreferences} size="small">
          <X size={24} />
        </IconButton>
      </DialogTitle>

      {/* Contenu */}
      <DialogContent sx={{ padding: 3 }}>
        <Typography variant="body2" sx={{ mb: 3, color: '#666666', lineHeight: 1.6 }}>
          Vous avez le contrôle total sur vos données. Choisissez les cookies que vous souhaitez
          autoriser. Vos préférences sont conservées pendant 13 mois (conformité CNIL).
        </Typography>

        {/* Liste des catégories de cookies */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {cookieCategories.map((category) => (
            <Accordion
              key={category.key}
              elevation={0}
              sx={{
                border: '1px solid #E0E0E0',
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: 0,
                  borderColor: '#2AD368',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} />}
                sx={{
                  padding: 2,
                  '& .MuiAccordionSummary-content': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: 0,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                  {category.icon}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#052E1C' }}>
                      {category.title}
                    </Typography>
                    {category.required && (
                      <Typography
                        variant="caption"
                        sx={{ color: '#2AD368', fontWeight: 500 }}
                      >
                        Toujours activé
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Switch
                  checked={preferences[category.key]}
                  disabled={category.required}
                  onChange={() => handleToggle(category.key)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#2AD368',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#2AD368',
                    },
                  }}
                />
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 2, paddingTop: 0 }}>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#666666' }}>
                  {category.description}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: '#F5F5F5',
                    padding: 1.5,
                    borderRadius: '8px',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: '#052E1C', display: 'block', mb: 0.5 }}
                  >
                    Exemples :
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666666' }}>
                    {category.examples}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Informations RGPD */}
        <Box
          sx={{
            mt: 3,
            padding: 2,
            backgroundColor: '#E8F8F1',
            borderRadius: '8px',
            borderLeft: '4px solid #2AD368',
          }}
        >
          <Typography variant="caption" sx={{ color: '#052E1C', lineHeight: 1.6 }}>
            <strong>🇫🇷 Vos droits RGPD :</strong> Vous pouvez à tout moment accéder, modifier,
            supprimer vos données ou exercer votre droit à la portabilité. Données hébergées en
            France (Scaleway/OVH) et chiffrées AES-256.
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <Divider />
      <DialogActions sx={{ padding: 2, gap: 1, justifyContent: 'space-between' }}>
        <Button
          variant="text"
          onClick={handleRefuseAll}
          sx={{
            color: '#666666',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Tout refuser
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleAcceptAll}
            sx={{
              borderColor: '#2AD368',
              color: '#2AD368',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#25B876',
                backgroundColor: '#E8F8F1',
              },
            }}
          >
            Tout accepter
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: '#2AD368',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#25B876',
              },
            }}
          >
            Sauvegarder mes choix
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CookiePreferencesModal;
