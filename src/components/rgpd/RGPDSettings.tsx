import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Chip,
  Dialog,
} from '@mui/material';
import {
  Shield,
  Cookie,
  FileText,
  Download,
  Trash2,
  ChevronRight,
  CheckCircle,
  XCircle,
  MessageCircle,
} from 'lucide-react';
import { useRGPD } from '../../contexts/RGPDContext';
import { useChatHistory } from '../../contexts/ChatHistoryContext';
import PrivacyPolicy from './PrivacyPolicy';

/**
 * 🔒 Composant des paramètres RGPD
 *
 * À intégrer dans le SettingsPanel
 * Permet de gérer les préférences de confidentialité
 */
const RGPDSettings: React.FC = () => {
  const { consent, openPreferences } = useRGPD();
  const { exportHistory, clearAllHistory, getTotalMessages, getConversationCount } = useChatHistory();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Statistiques des consentements
  const activeConsents = consent
    ? Object.entries(consent).filter(([key, value]) => value && key !== 'essential').length
    : 0;

  const handleExportData = () => {
    // Export des données utilisateur (conformité Art. 20 RGPD)
    const userData = {
      consentData: consent,
      consentLogs: JSON.parse(localStorage.getItem('virida_rgpd_logs') || '[]'),
      exportDate: new Date().toISOString(),
      format: 'JSON',
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `virida-donnees-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteData = () => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir supprimer toutes vos données RGPD ? Cette action est irréversible.'
      )
    ) {
      localStorage.removeItem('virida_rgpd_consent');
      localStorage.removeItem('virida_rgpd_consent_date');
      localStorage.removeItem('virida_rgpd_logs');
      window.location.reload();
    }
  };

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Shield size={28} color="#2AD388" />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21' }}>
            Confidentialité & RGPD
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#121A21', opacity: 0.7 }}>
          Gérez vos données personnelles et vos préférences de confidentialité
        </Typography>
      </Box>

      {/* Statut des consentements */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: '#F5F5F5',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          borderRadius: '12px',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#052E1C', mb: 0.5 }}>
                Statut des cookies
              </Typography>
              <Typography variant="body2" sx={{ color: '#121A21', opacity: 0.7 }}>
                {activeConsents} catégorie{activeConsents > 1 ? 's' : ''} activée{activeConsents > 1 ? 's' : ''} sur 3
              </Typography>
            </Box>
            <Chip
              icon={consent ? <CheckCircle size={16} /> : <XCircle size={16} />}
              label={consent ? 'Configuré' : 'Non configuré'}
              color={consent ? 'success' : 'warning'}
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Détails des consentements */}
          {consent && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label="Essentiels"
                sx={{ backgroundColor: '#2AD388', color: '#FFFFFF' }}
              />
              {consent.functional && (
                <Chip
                  size="small"
                  label="Fonctionnels"
                  sx={{ backgroundColor: '#CBED82', color: '#052E1C' }}
                />
              )}
              {consent.analytics && (
                <Chip
                  size="small"
                  label="Analytiques"
                  sx={{ backgroundColor: '#CBED82', color: '#052E1C' }}
                />
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Actions principales */}
      <List>
        {/* Gérer les préférences de cookies */}
        <ListItem
          button
          onClick={openPreferences}
          sx={{
            borderRadius: '12px',
            mb: 1,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <ListItemIcon>
            <Cookie size={24} color="#2AD388" />
          </ListItemIcon>
          <ListItemText
            primary="Gérer les cookies"
            secondary="Modifier vos préférences de cookies et traceurs"
            primaryTypographyProps={{ fontWeight: 500, color: '#121A21' }}
            secondaryTypographyProps={{ color: '#121A21', sx: { opacity: 0.7 } }}
          />
          <ChevronRight size={20} color="#121A21" />
        </ListItem>

        {/* Politique de confidentialité */}
        <ListItem
          button
          onClick={() => setShowPrivacyPolicy(true)}
          sx={{
            borderRadius: '12px',
            mb: 1,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <ListItemIcon>
            <FileText size={24} color="#2AD388" />
          </ListItemIcon>
          <ListItemText
            primary="Politique de confidentialité"
            secondary="Consulter notre politique RGPD complète"
            primaryTypographyProps={{ fontWeight: 500, color: '#121A21' }}
            secondaryTypographyProps={{ color: '#121A21', sx: { opacity: 0.7 } }}
          />
          <ChevronRight size={20} color="#121A21" />
        </ListItem>

        <Divider sx={{ my: 2 }} />

        {/* 💬 Historique des conversations avec Eve */}
        <ListItem
          button
          onClick={exportHistory}
          sx={{
            borderRadius: '12px',
            mb: 1,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <ListItemIcon>
            <MessageCircle size={24} color="#2AD388" />
          </ListItemIcon>
          <ListItemText
            primary="Exporter mes conversations avec Eve"
            secondary={`${getTotalMessages()} messages dans ${getConversationCount()} conversation(s)`}
            primaryTypographyProps={{ fontWeight: 500, color: '#121A21' }}
            secondaryTypographyProps={{ color: '#121A21', sx: { opacity: 0.7 } }}
          />
          <ChevronRight size={20} color="#121A21" />
        </ListItem>

        {/* Supprimer l'historique des conversations */}
        <ListItem
          button
          onClick={clearAllHistory}
          sx={{
            borderRadius: '12px',
            mb: 1,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#FEE',
            },
          }}
        >
          <ListItemIcon>
            <Trash2 size={24} color="#E53935" />
          </ListItemIcon>
          <ListItemText
            primary="Supprimer mes conversations avec Eve"
            secondary="Effacer tout l'historique de chat (Art. 17 RGPD)"
            primaryTypographyProps={{ fontWeight: 500, color: '#E53935' }}
            secondaryTypographyProps={{ color: '#121A21', sx: { opacity: 0.7 } }}
          />
          <ChevronRight size={20} color="#E53935" />
        </ListItem>

        <Divider sx={{ my: 2 }} />

        {/* Exporter mes données */}
        <ListItem
          button
          onClick={handleExportData}
          sx={{
            borderRadius: '12px',
            mb: 1,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <ListItemIcon>
            <Download size={24} color="#2AD388" />
          </ListItemIcon>
          <ListItemText
            primary="Exporter mes données RGPD"
            secondary="Télécharger vos données de consentement (Art. 20 RGPD)"
            primaryTypographyProps={{ fontWeight: 500, color: '#121A21' }}
            secondaryTypographyProps={{ color: '#121A21', sx: { opacity: 0.7 } }}
          />
          <ChevronRight size={20} color="#121A21" />
        </ListItem>

        {/* Supprimer mes données */}
        <ListItem
          button
          onClick={handleDeleteData}
          sx={{
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#FEE',
            },
          }}
        >
          <ListItemIcon>
            <Trash2 size={24} color="#E53935" />
          </ListItemIcon>
          <ListItemText
            primary="Supprimer mes données RGPD"
            secondary="Effacer toutes les données de consentement (Art. 17 RGPD)"
            primaryTypographyProps={{ fontWeight: 500, color: '#E53935' }}
            secondaryTypographyProps={{ color: '#121A21', sx: { opacity: 0.7 } }}
          />
          <ChevronRight size={20} color="#E53935" />
        </ListItem>
      </List>

      {/* Informations complémentaires */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#F5F5F5',
          borderRadius: '12px',
          borderLeft: '4px solid #2AD388',
        }}
      >
        <Typography variant="caption" sx={{ color: '#121A21', lineHeight: 1.6 }}>
          <strong>🇫🇷 Protection de vos données :</strong> Toutes vos données sont hébergées en
          France (Scaleway/OVH) et chiffrées AES-256. Vous pouvez exercer vos droits RGPD à tout
          moment via privacy@virida.fr
        </Typography>
      </Box>

      {/* Dialog Politique de confidentialité */}
      <Dialog
        open={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Button
            onClick={() => setShowPrivacyPolicy(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              zIndex: 1,
              minWidth: 'auto',
              color: '#121A21',
            }}
          >
            Fermer
          </Button>
          <PrivacyPolicy />
        </Box>
      </Dialog>
    </Box>
  );
};

export default RGPDSettings;
