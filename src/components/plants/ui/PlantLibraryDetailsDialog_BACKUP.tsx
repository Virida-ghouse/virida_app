import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpaIcon from '@mui/icons-material/Spa';
import BugReportIcon from '@mui/icons-material/BugReport';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ScienceIcon from '@mui/icons-material/Science';
import { useViridaStore } from '../../../store/useViridaStore';

interface PlantLibraryDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  plantId: string;
  plantName: string;
}

interface PlantDetail {
  commonName: string;
  botanicalName?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  wateringInfo?: {
    frequency?: string;
    amount?: string;
    difficulty?: string;
  };
  sunlightInfo?: {
    requirement?: string;
    hours?: string;
  };
  temperatureInfo?: {
    min?: number;
    max?: number;
    optimal?: string;
  };
  soilInfo?: {
    type?: string;
    ph?: string;
  };
  careInstructions?: string[];
  commonProblems?: string[];
  pests?: string[];
  harvestInfo?: {
    daysToHarvest?: number;
    season?: string;
    tips?: string;
  };
  fertilizingInfo?: {
    frequency?: string;
    type?: string;
  };
}

export const PlantLibraryDetailsDialog: React.FC<PlantLibraryDetailsDialogProps> = ({
  open,
  onClose,
  plantId,
  plantName,
}) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plantDetails, setPlantDetails] = useState<PlantDetail | null>(null);

  useEffect(() => {
    if (open && plantId) {
      fetchPlantDetails();
    }
  }, [open, plantId]);

  const fetchPlantDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('virida_token');

      // Appel à l'endpoint RAG pour obtenir les détails enrichis
      const response = await fetch(
        `${apiUrl}/api/plants/plant-info?plantName=${encodeURIComponent(plantName)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Impossible de charger les détails de la plante');
      }

      const data = await response.json();
      setPlantDetails(data.data || {});
    } catch (err) {
      console.error('Erreur chargement détails plante:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'facile':
        return { bg: '#E8F5E9', color: '#2E7D32' };
      case 'medium':
      case 'moyen':
        return { bg: '#FFF3E0', color: '#F57C00' };
      case 'difficult':
      case 'difficile':
        return { bg: '#FFEBEE', color: '#C62828' };
      default:
        return { bg: '#F5F5F5', color: '#757575' };
    }
  };

  const difficultyColors = plantDetails?.wateringInfo?.difficulty
    ? getDifficultyColor(plantDetails.wateringInfo.difficulty)
    : getDifficultyColor(plantDetails?.difficulty);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E0E0E0',
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#121A21' }}>
            {plantDetails?.commonName || plantName}
          </Typography>
          {plantDetails?.botanicalName && (
            <Typography variant="body2" sx={{ color: '#757575', fontStyle: 'italic', mt: 0.5 }}>
              {plantDetails.botanicalName}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#2E7D32' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : plantDetails ? (
          <Box>
            {/* Description */}
            {plantDetails.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#424242', lineHeight: 1.7 }}>
                  {plantDetails.description}
                </Typography>
              </Box>
            )}

            {/* Chips de catégorie et difficulté */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {plantDetails.category && (
                <Chip
                  label={plantDetails.category.replace('_', ' ')}
                  sx={{ bgcolor: '#F0F9F4', color: '#2E7D32', fontWeight: 600 }}
                />
              )}
              {(plantDetails.difficulty || plantDetails.wateringInfo?.difficulty) && (
                <Chip
                  label={`Difficulté: ${plantDetails.wateringInfo?.difficulty || plantDetails.difficulty}`}
                  sx={{
                    bgcolor: difficultyColors.bg,
                    color: difficultyColors.color,
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Informations de base en grille */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
              {/* Arrosage */}
              {plantDetails.wateringInfo && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#F0F9F4',
                    borderRadius: 2,
                    border: '1px solid #E8F5E9',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <OpacityIcon sx={{ color: '#2196F3', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#121A21' }}>
                      Arrosage
                    </Typography>
                  </Box>
                  {plantDetails.wateringInfo.frequency && (
                    <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                      {plantDetails.wateringInfo.frequency}
                    </Typography>
                  )}
                  {plantDetails.wateringInfo.amount && (
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      {plantDetails.wateringInfo.amount}
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Lumière */}
              {plantDetails.sunlightInfo && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#FFF9E6',
                    borderRadius: 2,
                    border: '1px solid #FFF3E0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <WbSunnyIcon sx={{ color: '#FFA726', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#121A21' }}>
                      Luminosité
                    </Typography>
                  </Box>
                  {plantDetails.sunlightInfo.requirement && (
                    <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                      {plantDetails.sunlightInfo.requirement}
                    </Typography>
                  )}
                  {plantDetails.sunlightInfo.hours && (
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      {plantDetails.sunlightInfo.hours}
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Température */}
              {plantDetails.temperatureInfo && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#FFE6E6',
                    borderRadius: 2,
                    border: '1px solid #FFEBEE',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ThermostatIcon sx={{ color: '#F44336', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#121A21' }}>
                      Température
                    </Typography>
                  </Box>
                  {plantDetails.temperatureInfo.optimal && (
                    <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                      {plantDetails.temperatureInfo.optimal}
                    </Typography>
                  )}
                  {(plantDetails.temperatureInfo.min || plantDetails.temperatureInfo.max) && (
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      {plantDetails.temperatureInfo.min && `Min: ${plantDetails.temperatureInfo.min}°C`}
                      {plantDetails.temperatureInfo.min && plantDetails.temperatureInfo.max && ' / '}
                      {plantDetails.temperatureInfo.max && `Max: ${plantDetails.temperatureInfo.max}°C`}
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Sol */}
              {plantDetails.soilInfo && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#F3E5F5',
                    borderRadius: 2,
                    border: '1px solid #E1BEE7',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ScienceIcon sx={{ color: '#9C27B0', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#121A21' }}>
                      Sol
                    </Typography>
                  </Box>
                  {plantDetails.soilInfo.type && (
                    <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                      {plantDetails.soilInfo.type}
                    </Typography>
                  )}
                  {plantDetails.soilInfo.ph && (
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      pH: {plantDetails.soilInfo.ph}
                    </Typography>
                  )}
                </Paper>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Instructions de soin */}
            {plantDetails.careInstructions && plantDetails.careInstructions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SpaIcon sx={{ color: '#4CAF50', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                    Instructions de soin
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {plantDetails.careInstructions.map((instruction, index) => (
                    <Typography
                      component="li"
                      key={index}
                      variant="body2"
                      sx={{ color: '#424242', mb: 1, lineHeight: 1.6 }}
                    >
                      {instruction}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Fertilisation */}
            {plantDetails.fertilizingInfo && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SpaIcon sx={{ color: '#8BC34A', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                    Fertilisation
                  </Typography>
                </Box>
                {plantDetails.fertilizingInfo.frequency && (
                  <Typography variant="body2" sx={{ color: '#424242', mb: 1 }}>
                    <strong>Fréquence:</strong> {plantDetails.fertilizingInfo.frequency}
                  </Typography>
                )}
                {plantDetails.fertilizingInfo.type && (
                  <Typography variant="body2" sx={{ color: '#424242' }}>
                    <strong>Type:</strong> {plantDetails.fertilizingInfo.type}
                  </Typography>
                )}
              </Box>
            )}

            {/* Récolte */}
            {plantDetails.harvestInfo && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AgricultureIcon sx={{ color: '#8BC34A', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                    Récolte
                  </Typography>
                </Box>
                {plantDetails.harvestInfo.daysToHarvest && (
                  <Typography variant="body2" sx={{ color: '#424242', mb: 1 }}>
                    <strong>Durée:</strong> {plantDetails.harvestInfo.daysToHarvest} jours
                  </Typography>
                )}
                {plantDetails.harvestInfo.season && (
                  <Typography variant="body2" sx={{ color: '#424242', mb: 1 }}>
                    <strong>Saison:</strong> {plantDetails.harvestInfo.season}
                  </Typography>
                )}
                {plantDetails.harvestInfo.tips && (
                  <Typography variant="body2" sx={{ color: '#424242' }}>
                    <strong>Conseils:</strong> {plantDetails.harvestInfo.tips}
                  </Typography>
                )}
              </Box>
            )}

            {/* Problèmes courants */}
            {plantDetails.commonProblems && plantDetails.commonProblems.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BugReportIcon sx={{ color: '#F44336', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                    Problèmes courants
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {plantDetails.commonProblems.map((problem, index) => (
                    <Typography
                      component="li"
                      key={index}
                      variant="body2"
                      sx={{ color: '#424242', mb: 1, lineHeight: 1.6 }}
                    >
                      {problem}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Parasites */}
            {plantDetails.pests && plantDetails.pests.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BugReportIcon sx={{ color: '#FF9800', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                    Parasites à surveiller
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {plantDetails.pests.map((pest, index) => (
                    <Chip
                      key={index}
                      label={pest}
                      size="small"
                      sx={{
                        bgcolor: '#FFF3E0',
                        color: '#F57C00',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
