import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  CardMedia,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpaIcon from '@mui/icons-material/Spa';
import BugReportIcon from '@mui/icons-material/BugReport';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ScienceIcon from '@mui/icons-material/Science';
import HeightIcon from '@mui/icons-material/Height';
import { useViridaStore } from '../../../store/useViridaStore';

interface PlantLibraryDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  plantId: string;
  plantName: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plant-tabpanel-${index}`}
      aria-labelledby={`plant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface CatalogData {
  id: string;
  commonName: string;
  scientificName?: string;
  botanicalName?: string; // Alias pour compatibilité
  species?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  imageUrl?: string;
  iconEmoji?: string;
  totalGrowthDays?: number;
  yieldMin?: number;
  yieldMax?: number;
  yieldUnit?: string;
  spaceRequiredWidth?: number;
  spaceRequiredHeight?: number;
  wateringFrequency?: string;
  wateringAmount?: string;
  sunlightHours?: string;
  optimalTempMin?: number;
  optimalTempMax?: number;
  optimalHumidityMin?: number;
  optimalHumidityMax?: number;
  optimalSeasons?: string | string[];
  careInstructions?: string | string[];
  commonProblems?: string | string[];
  pests?: string | string[];
  tips?: string[];
  commonIssues?: string[];
  companions?: string[];
  tags?: string[];
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
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [plantDetails, setPlantDetails] = useState<PlantDetail | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (open && plantId) {
      fetchCatalogData();
      fetchPlantDetails();
    }
  }, [open, plantId]);

  const fetchCatalogData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('virida_token');

      const response = await fetch(`${apiUrl}/api/plant-catalog/${plantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Impossible de charger les données du catalogue');
      }

      const data = await response.json();
      console.log('📊 Data received from backend:', data);
      console.log('📋 Catalog data:', data.plant);
      setCatalogData(data.plant || data || {});
    } catch (err) {
      console.error('Erreur chargement catalogue:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlantDetails = async () => {
    try {
      const token = localStorage.getItem('virida_token');

      // Appel à l'endpoint RAG pour obtenir les détails enrichis (optionnel)
      const response = await fetch(
        `${apiUrl}/api/plants/plant-info?plantName=${encodeURIComponent(plantName)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPlantDetails(data.data || {});
      }
    } catch (err) {
      console.log('RAG data non disponible, affichage des données du catalogue uniquement');
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'facile':
      case 'very easy':
      case 'très facile':
        return { bg: '#E8F5E9', color: '#2E7D32' };
      case 'medium':
      case 'moyen':
      case 'moderate':
        return { bg: '#FFF3E0', color: '#F57C00' };
      case 'difficult':
      case 'difficile':
      case 'hard':
        return { bg: '#FFEBEE', color: '#C62828' };
      default:
        return { bg: '#F5F5F5', color: '#757575' };
    }
  };

  const formatYield = (yieldMin?: number, yieldMax?: number, yieldUnit?: string): string | null => {
    if (!yieldMin && !yieldMax) return null;

    const unit = yieldUnit || 'g';
    if (yieldMin && yieldMax) {
      if (unit === 'g' && yieldMin >= 1000) {
        return `${(yieldMin / 1000).toFixed(1)}-${(yieldMax / 1000).toFixed(1)}kg`;
      }
      return `${yieldMin}-${yieldMax}${unit}`;
    }
    if (yieldMin) return `~${yieldMin}${unit}`;
    if (yieldMax) return `~${yieldMax}${unit}`;
    return null;
  };

  const difficultyColors = getDifficultyColor(catalogData?.difficulty);
  const yieldDisplay = formatYield(catalogData?.yieldMin, catalogData?.yieldMax, catalogData?.yieldUnit);
  const tempDisplay = catalogData?.optimalTempMin && catalogData?.optimalTempMax
    ? `${catalogData.optimalTempMin}-${catalogData.optimalTempMax}°C`
    : null;

  const parseArrayField = (field?: string | string[] | any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field; // Déjà un tableau parsé par le backend
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [field];
      } catch {
        return field.split('\n').filter(Boolean);
      }
    }
    return [];
  };

  const careInstructions = parseArrayField(catalogData?.careInstructions || plantDetails?.careInstructions?.join('\n'));
  const commonProblems = parseArrayField(catalogData?.commonProblems || plantDetails?.commonProblems?.join('\n'));
  const pests = parseArrayField(catalogData?.pests || plantDetails?.pests?.join('\n'));

  console.log('🔍 Avant rendu - catalogData:', catalogData);
  console.log('🔍 loading:', loading, 'error:', error);
  console.log('🔍 Condition tabs:', catalogData && Object.keys(catalogData).length > 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          bgcolor: 'white',
        },
      }}
    >
      {/* Header compact et moderne */}
      <Box sx={{ bgcolor: '#FAFAFA', borderBottom: '1px solid #E0E0E0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
          {/* Image compacte à gauche */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {catalogData?.imageUrl ? (
              <img
                src={catalogData.imageUrl}
                alt={catalogData.commonName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '3rem' }}>
                  {catalogData?.iconEmoji || '🌱'}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Infos à droite */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#121A21', mb: 0.5 }}>
              {catalogData?.commonName || plantName}
            </Typography>
            {catalogData?.scientificName && (
              <Typography variant="body2" sx={{ color: '#757575', fontStyle: 'italic', mb: 1.5 }}>
                {catalogData.scientificName}
              </Typography>
            )}

            {/* Badges compacts */}
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {catalogData?.category && (
                <Chip
                  label={catalogData.category.replace('_', ' ')}
                  size="small"
                  sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontSize: '0.75rem' }}
                />
              )}
              {catalogData?.difficulty && (
                <Chip
                  label={catalogData.difficulty}
                  size="small"
                  sx={{
                    bgcolor: difficultyColors.bg,
                    color: difficultyColors.color,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              )}
              {catalogData?.totalGrowthDays && (
                <Chip
                  label={`${catalogData.totalGrowthDays}j`}
                  size="small"
                  icon={<AgricultureIcon sx={{ fontSize: '0.9rem !important' }} />}
                  sx={{ bgcolor: '#FFF3E0', color: '#F57C00', fontWeight: 600, fontSize: '0.75rem' }}
                />
              )}
              {yieldDisplay && (
                <Chip
                  label={yieldDisplay}
                  size="small"
                  sx={{ bgcolor: '#FFF9E6', color: '#F57C00', fontWeight: 600, fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Box>

          {/* Bouton fermer */}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: '#F5F5F5',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#2E7D32' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 3 }}>
            {error}
          </Alert>
        ) : catalogData && Object.keys(catalogData).length > 0 ? (
          <>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  },
                  '& .Mui.selected': {
                    color: '#2E7D32',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#2E7D32',
                  },
                }}
              >
                <Tab label="Infos de base" />
                <Tab label="Soins" />
                <Tab label="Problèmes" />
                <Tab label="Récolte" />
              </Tabs>
            </Box>

            {/* Tab 0: Infos de base */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 3 }}>
                {/* Description simple */}
                {catalogData.description && (
                  <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7, mb: 3 }}>
                    {catalogData.description}
                  </Typography>
                )}

                {/* Titre section paramètres IoT */}
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21', mb: 2 }}>
                  Paramètres recommandés
                </Typography>

                {/* Grille d'informations IoT */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2.5 }}>
                  {/* Arrosage */}
                  {(catalogData.wateringFrequency || catalogData.wateringAmount) && (
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
                      {catalogData.wateringFrequency && (
                        <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                          {catalogData.wateringFrequency}
                        </Typography>
                      )}
                      {catalogData.wateringAmount && (
                        <Typography variant="caption" sx={{ color: '#757575' }}>
                          {catalogData.wateringAmount}
                        </Typography>
                      )}
                    </Paper>
                  )}

                  {/* Lumière */}
                  {catalogData.sunlightHours && (
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
                      <Typography variant="body2" sx={{ color: '#424242' }}>
                        {catalogData.sunlightHours}
                      </Typography>
                    </Paper>
                  )}

                  {/* Température */}
                  {tempDisplay && (
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
                      <Typography variant="body2" sx={{ color: '#424242' }}>
                        {tempDisplay}
                      </Typography>
                    </Paper>
                  )}

                  {/* Espace requis */}
                  {(catalogData.spaceRequiredWidth || catalogData.spaceRequiredHeight) && (
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
                        <HeightIcon sx={{ color: '#9C27B0', fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#121A21' }}>
                          Espace requis
                        </Typography>
                      </Box>
                      {catalogData.spaceRequiredWidth && catalogData.spaceRequiredHeight && (
                        <Typography variant="body2" sx={{ color: '#424242' }}>
                          {catalogData.spaceRequiredWidth} × {catalogData.spaceRequiredHeight} cm
                        </Typography>
                      )}
                    </Paper>
                  )}
                </Box>
              </Box>
            </TabPanel>

            {/* Tab 1: Soins */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 3 }}>
                {/* Instructions de soin */}
                {careInstructions.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <SpaIcon sx={{ color: '#4CAF50', fontSize: 22 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                        Instructions de soin
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {careInstructions.map((instruction, index) => (
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
                {plantDetails?.fertilizingInfo && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ScienceIcon sx={{ color: '#8BC34A', fontSize: 22 }} />
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

                {/* Info Sol (from RAG) */}
                {plantDetails?.soilInfo && (
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
            </TabPanel>

            {/* Tab 2: Problèmes */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 3 }}>
                {/* Problèmes courants */}
                {commonProblems.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BugReportIcon sx={{ color: '#F44336', fontSize: 22 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                        Problèmes courants
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {commonProblems.map((problem, index) => (
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
                {pests.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BugReportIcon sx={{ color: '#FF9800', fontSize: 22 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                        Parasites à surveiller
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {pests.map((pest, index) => (
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

                {commonProblems.length === 0 && pests.length === 0 && (
                  <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center', py: 4 }}>
                    Aucune information sur les problèmes disponible
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Tab 3: Récolte */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AgricultureIcon sx={{ color: '#8BC34A', fontSize: 22 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                    Informations de récolte
                  </Typography>
                </Box>

                {/* Durée jusqu'à récolte */}
                {catalogData.daysToHarvest && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: '#F0F9F4',
                      borderRadius: 2,
                      border: '1px solid #E8F5E9',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                      <strong>Durée jusqu'à récolte:</strong> {catalogData.daysToHarvest} jours
                    </Typography>
                  </Paper>
                )}

                {/* Rendement */}
                {yieldDisplay && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: '#FFF9E6',
                      borderRadius: 2,
                      border: '1px solid #FFF3E0',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                      <strong>Rendement attendu:</strong> {yieldDisplay}
                    </Typography>
                  </Paper>
                )}

                {/* Saisons optimales */}
                {catalogData.optimalSeasons && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: '#E3F2FD',
                      borderRadius: 2,
                      border: '1px solid #BBDEFB',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#424242', mb: 1 }}>
                      <strong>Saisons optimales:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {parseArrayField(catalogData.optimalSeasons).map((season, index) => (
                        <Chip
                          key={index}
                          label={season}
                          size="small"
                          sx={{
                            bgcolor: '#1976D2',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}

                {/* Conseils de récolte (from RAG) */}
                {plantDetails?.harvestInfo?.tips && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: '#F3E5F5',
                      borderRadius: 2,
                      border: '1px solid #E1BEE7',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#424242' }}>
                      <strong>Conseils:</strong> {plantDetails.harvestInfo.tips}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </TabPanel>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
