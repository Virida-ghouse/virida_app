import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import GrowthTimeline from './GrowthTimeline';
import PhotoGallery from './PhotoGallery';
import CareEvents from './CareEvents';
import HealthStatus from './HealthStatus';
import { useViridaStore } from '../../store/useViridaStore';

interface Plant {
  id: string;
  name: string;
  species: string;
  category: string;
  difficulty: string;
  health: number;
  growthStage: string;
  daysToHarvest?: number;
  imageUrl?: string;
  iconEmoji?: string;
  optimalTempMin?: number;
  optimalTempMax?: number;
  optimalHumidityMin?: number;
  optimalHumidityMax?: number;
}

interface PlantDetailsProps {
  plant: Plant;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    background: '#FFFFFF',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    maxWidth: '900px',
  },
}));

const TabsWrapper = styled(Tabs)(() => ({
  borderBottom: '1px solid #E1E8EE',
  minHeight: '48px',
  '& .MuiTab-root': {
    color: '#8091A0',
    textTransform: 'none',
    fontWeight: 500,
    minHeight: '48px',
    '&.Mui-selected': {
      color: '#2AD388',
    },
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#2AD388',
  },
}));

const TabPanel = styled(Box)(() => ({
  py: 3,
}));

const ConditionCard = styled(Card)(() => ({
  background: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

function TabPanel_Component(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plant-tabpanel-${index}`}
      aria-labelledby={`plant-tab-${index}`}
      {...other}
    >
      {value === index && <TabPanel>{children}</TabPanel>}
    </div>
  );
}

const PlantDetails: React.FC<PlantDetailsProps> = ({ plant, onClose }) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plantData, setPlantData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger les données complètes de la plante
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        // Récupérer les données de santé
        const healthResponse = await fetch(`${apiUrl}/api/plant-advanced/${plant.id}/health`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (healthResponse.ok) {
          const healthRes = await healthResponse.json();
          setHealthData(healthRes.data);
        }

        // Récupérer les recommandations EVE
        const recsResponse = await fetch(`${apiUrl}/api/plant-advanced/${plant.id}/recommendations`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (recsResponse.ok) {
          const recsRes = await recsResponse.json();
          setRecommendations(recsRes.data.recommendations);
        }

        setPlantData(plant);
      } catch (err) {
        console.error('Erreur chargement données:', err);
        setError('Impossible de charger les données de la plante');
      } finally {
        setLoading(false);
      }
    };

    if (plant.id) {
      fetchPlantData();
    }
  }, [plant, apiUrl]);

  const getHealthColor = (health: number) => {
    if (health >= 80) return '#2AD388';
    if (health >= 60) return '#f1c40f';
    if (health >= 40) return '#FF9800';
    return '#e74c3c';
  };

  return (
    <StyledDialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      {/* En-tête du dialog */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FFFFFF',
          borderBottom: '1px solid #E1E8EE',
          pb: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              fontSize: '2rem',
              lineHeight: 1,
            }}
          >
            {plant.iconEmoji || '🌱'}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#121A21', fontWeight: 700 }}>
              {plant.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8091A0' }}>
              {plant.species}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#8091A0',
            '&:hover': {
              color: '#2AD388',
              background: '#2AD38810',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 2 }}>
        {/* Barre de santé */}
        {healthData && (
          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#8091A0', fontWeight: 600 }}>
                Santé générale
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: getHealthColor(healthData.healthScore),
                  fontWeight: 700,
                }}
              >
                {healthData.healthScore}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={healthData.healthScore}
              sx={{
                height: '8px',
                borderRadius: '4px',
                background: '#E1E8EE',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getHealthColor(healthData.healthScore),
                  borderRadius: '4px',
                },
              }}
            />
          </Box>
        )}

        {/* Alertes */}
        {healthData?.alerts && healthData.alerts.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {healthData.alerts.map((alert: any, idx: number) => (
              <Alert
                key={idx}
                severity={alert.type === 'danger' ? 'error' : 'warning'}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">{alert.message}</Typography>
              </Alert>
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2AD388' }} />
          </Box>
        )}

        {!loading && (
          <>
            {/* Infos rapides */}
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap={2}
              sx={{ mb: 3 }}
            >
              <ConditionCard>
                <CardContent sx={{ pb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#8091A0' }}>
                    Difficulté
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#121A21', fontWeight: 700, mt: 0.5 }}
                  >
                    {plant.difficulty === 'EASY'
                      ? 'Facile'
                      : plant.difficulty === 'MEDIUM'
                      ? 'Moyen'
                      : 'Difficile'}
                  </Typography>
                </CardContent>
              </ConditionCard>

              <ConditionCard>
                <CardContent sx={{ pb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#8091A0' }}>
                    Stade de croissance
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#121A21', fontWeight: 700, mt: 0.5 }}
                  >
                    {plant.growthStage}
                  </Typography>
                </CardContent>
              </ConditionCard>
            </Box>

            {/* Conditions optimales */}
            {healthData?.optimalConditions && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#121A21', fontWeight: 700, mb: 1.5 }}
                >
                  Conditions optimales
                </Typography>
                <Grid container spacing={1}>
                  {healthData.optimalConditions.temperature && (
                    <Grid item xs={6}>
                      <Chip
                        label={`🌡️ ${healthData.optimalConditions.temperature.min}-${healthData.optimalConditions.temperature.max}°C`}
                        size="small"
                        variant="outlined"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  )}
                  {healthData.optimalConditions.humidity && (
                    <Grid item xs={6}>
                      <Chip
                        label={`💧 ${healthData.optimalConditions.humidity.min}-${healthData.optimalConditions.humidity.max}%`}
                        size="small"
                        variant="outlined"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  )}
                  {healthData.optimalConditions.ph && (
                    <Grid item xs={6}>
                      <Chip
                        label={`🧪 pH ${healthData.optimalConditions.ph.min}-${healthData.optimalConditions.ph.max}`}
                        size="small"
                        variant="outlined"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Tabs */}
            <TabsWrapper
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              aria-label="plant details tabs"
            >
              <Tab label="Santé" id="plant-tab-0" aria-controls="plant-tabpanel-0" />
              <Tab label="Photos" id="plant-tab-1" aria-controls="plant-tabpanel-1" />
              <Tab label="Soins" id="plant-tab-2" aria-controls="plant-tabpanel-2" />
              <Tab label="Croissance" id="plant-tab-3" aria-controls="plant-tabpanel-3" />
            </TabsWrapper>

            {/* Contenu des tabs */}
            <TabPanel_Component value={tabValue} index={0}>
              <HealthStatus plant={plant} healthData={healthData} />
            </TabPanel_Component>

            <TabPanel_Component value={tabValue} index={1}>
              <PhotoGallery plantId={plant.id} />
            </TabPanel_Component>

            <TabPanel_Component value={tabValue} index={2}>
              <CareEvents plantId={plant.id} />
            </TabPanel_Component>

            <TabPanel_Component value={tabValue} index={3}>
              <GrowthTimeline plantId={plant.id} recommendations={recommendations} />
            </TabPanel_Component>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #E1E8EE', pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#8091A0',
            textTransform: 'none',
            '&:hover': {
              color: '#2AD388',
            },
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default PlantDetails;
