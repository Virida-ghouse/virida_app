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
  Divider,
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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
  species?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  history?: string;
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

const VIRIDA_GREEN = '#2E7D32';
const VIRIDA_LIGHT_GREEN = '#E8F5E9';

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
      // fetchPlantDetails(); // Temporairement désactivé - endpoint RAG non disponible
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
      setCatalogData(data.plant || data || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlantDetails = async () => {
    try {
      const token = localStorage.getItem('virida_token');

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
      // RAG data non disponible
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

  const getDifficultyLabel = (difficulty?: string): string => {
    const d = difficulty?.toLowerCase();
    if (d === 'easy' || d === 'facile' || d === 'very easy' || d === 'très facile') return 'Facile';
    if (d === 'medium' || d === 'moyen' || d === 'moderate') return 'Moyen';
    if (d === 'difficult' || d === 'difficile' || d === 'hard') return 'Difficile';
    return difficulty || '';
  };

  const parseArrayField = (field?: string | string[] | any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
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

  const yieldDisplay = formatYield(catalogData?.yieldMin, catalogData?.yieldMax, catalogData?.yieldUnit);
  const tempDisplay = catalogData?.optimalTempMin && catalogData?.optimalTempMax
    ? `${catalogData.optimalTempMin}-${catalogData.optimalTempMax}°C`
    : null;

  const careInstructions = parseArrayField(catalogData?.careInstructions || catalogData?.tips || plantDetails?.careInstructions?.join('\n'));
  const commonProblems = parseArrayField(catalogData?.commonProblems || catalogData?.commonIssues || plantDetails?.commonProblems?.join('\n'));
  const pests = parseArrayField(catalogData?.pests || plantDetails?.pests?.join('\n'));
  const companions = parseArrayField(catalogData?.companions);

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
      {/* Clean minimalist header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E0E0E0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
          {/* Compact image */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(46,125,50,0.15)',
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
                  background: `linear-gradient(135deg, ${VIRIDA_GREEN} 0%, #1B5E20 100%)`,
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

          {/* Info section - clean and minimal */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#121A21', mb: 0.5 }}>
              {catalogData?.commonName || plantName}
            </Typography>
            {catalogData?.scientificName && (
              <Typography variant="body2" sx={{ color: '#757575', fontStyle: 'italic', mb: 1 }}>
                {catalogData.scientificName}
              </Typography>
            )}

            {/* Subtle metadata - Virida green only */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {catalogData?.category && (
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                  {catalogData.category.replace('_', ' ')}
                </Typography>
              )}
              {catalogData?.category && catalogData?.difficulty && (
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CCC' }} />
              )}
              {catalogData?.difficulty && (
                <Typography variant="caption" sx={{ color: VIRIDA_GREEN, fontWeight: 600 }}>
                  {getDifficultyLabel(catalogData.difficulty)}
                </Typography>
              )}
              {catalogData?.totalGrowthDays && (
                <>
                  <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CCC' }} />
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                    {catalogData.totalGrowthDays} jours
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Close button */}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: '#F5F5F5',
              '&:hover': {
                bgcolor: '#E0E0E0',
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
            <CircularProgress sx={{ color: VIRIDA_GREEN }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 3 }}>
            {error}
          </Alert>
        ) : catalogData && Object.keys(catalogData).length > 0 ? (
          <>
            {/* Clean tabs with Virida green accent */}
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
                    color: '#666',
                  },
                  '& .Mui-selected': {
                    color: VIRIDA_GREEN,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: VIRIDA_GREEN,
                    height: 3,
                  },
                }}
              >
                <Tab label="À propos" />
                <Tab label="Soins" />
                <Tab label="Problèmes" />
                <Tab label="Récolte" />
              </Tabs>
            </Box>

            {/* Tab 0: À propos (About/Info) */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 2.5 }}>
                {/* Plant description section */}
                {catalogData.description && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <MenuBookIcon sx={{ color: VIRIDA_GREEN, fontSize: 22 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21' }}>
                        Description
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, letterSpacing: 0.1 }}>
                      {catalogData.description}
                    </Typography>
                  </Box>
                )}

                {/* Plant history section */}
                {catalogData.history && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <MenuBookIcon sx={{ color: VIRIDA_GREEN, fontSize: 22 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21' }}>
                        Histoire
                      </Typography>
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: VIRIDA_LIGHT_GREEN,
                        borderRadius: 2,
                        border: `1px solid ${VIRIDA_GREEN}20`,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, letterSpacing: 0.1, fontStyle: 'italic' }}>
                        {catalogData.history}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                <Divider sx={{ my: 2.5 }} />

                {/* Clean parameters section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <InfoOutlinedIcon sx={{ color: VIRIDA_GREEN, fontSize: 22 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21' }}>
                    Paramètres de culture
                  </Typography>
                </Box>

                {/* Grid with white cards and subtle shadows */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1.5 }}>
                  {/* Arrosage */}
                  {(catalogData.wateringFrequency || catalogData.wateringAmount) && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(46,125,50,0.12)',
                          borderColor: VIRIDA_LIGHT_GREEN,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <OpacityIcon sx={{ color: VIRIDA_GREEN, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#121A21', fontSize: '0.85rem' }}>
                          Arrosage
                        </Typography>
                      </Box>
                      {catalogData.wateringFrequency && (
                        <Typography variant="body2" sx={{ color: '#555', mb: 0.5, lineHeight: 1.5, fontSize: '0.8rem' }}>
                          {catalogData.wateringFrequency}
                        </Typography>
                      )}
                      {catalogData.wateringAmount && (
                        <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
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
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(46,125,50,0.12)',
                          borderColor: VIRIDA_LIGHT_GREEN,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WbSunnyIcon sx={{ color: VIRIDA_GREEN, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#121A21', fontSize: '0.85rem' }}>
                          Luminosité
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.5, fontSize: '0.8rem' }}>
                        {catalogData.sunlightHours}
                      </Typography>
                    </Paper>
                  )}

                  {/* Température */}
                  {tempDisplay && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(46,125,50,0.12)',
                          borderColor: VIRIDA_LIGHT_GREEN,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ThermostatIcon sx={{ color: VIRIDA_GREEN, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#121A21', fontSize: '0.85rem' }}>
                          Température
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.5, fontSize: '0.8rem' }}>
                        {tempDisplay}
                      </Typography>
                      {(catalogData.optimalHumidityMin || catalogData.optimalHumidityMax) && (
                        <Typography variant="caption" sx={{ color: '#888', mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                          Humidité: {catalogData.optimalHumidityMin}-{catalogData.optimalHumidityMax}%
                        </Typography>
                      )}
                    </Paper>
                  )}

                  {/* Espace */}
                  {(catalogData.spaceRequiredWidth || catalogData.spaceRequiredHeight) && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(46,125,50,0.12)',
                          borderColor: VIRIDA_LIGHT_GREEN,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <HeightIcon sx={{ color: VIRIDA_GREEN, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#121A21', fontSize: '0.85rem' }}>
                          Espace requis
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.5, fontSize: '0.8rem' }}>
                        {catalogData.spaceRequiredWidth} × {catalogData.spaceRequiredHeight} cm
                      </Typography>
                    </Paper>
                  )}
                </Box>

                {/* Companions section */}
                {companions.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#121A21', mb: 1.5 }}>
                      Plantes compagnes
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                      {companions.map((companion, index) => (
                        <Chip
                          key={index}
                          label={companion}
                          size="small"
                          sx={{
                            bgcolor: VIRIDA_LIGHT_GREEN,
                            color: VIRIDA_GREEN,
                            fontWeight: 500,
                            border: `1px solid ${VIRIDA_GREEN}20`,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Tab 1: Soins (Care) */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 2.5 }}>
                {careInstructions.length > 0 ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <SpaIcon sx={{ color: VIRIDA_GREEN, fontSize: 22 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21' }}>
                        Instructions de soin
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {careInstructions.map((instruction, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: 'white',
                            borderRadius: 2,
                            border: '1px solid #E8E8E8',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            borderLeft: `3px solid ${VIRIDA_GREEN}`,
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Typography
                              sx={{
                                minWidth: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: VIRIDA_LIGHT_GREEN,
                                color: VIRIDA_GREEN,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                flexShrink: 0,
                              }}
                            >
                              {index + 1}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, flex: 1, fontSize: '0.85rem' }}>
                              {instruction}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Box>

                    {/* Fertilisation info if available */}
                    {plantDetails?.fertilizingInfo && (
                      <Box sx={{ mt: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <ScienceIcon sx={{ color: VIRIDA_GREEN, fontSize: 22 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21' }}>
                            Fertilisation
                          </Typography>
                        </Box>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            bgcolor: 'white',
                            borderRadius: 2,
                            border: '1px solid #E8E8E8',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          }}
                        >
                          {plantDetails.fertilizingInfo.frequency && (
                            <Typography variant="body2" sx={{ color: '#555', mb: 1, lineHeight: 1.6 }}>
                              <strong>Fréquence:</strong> {plantDetails.fertilizingInfo.frequency}
                            </Typography>
                          )}
                          {plantDetails.fertilizingInfo.type && (
                            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                              <strong>Type:</strong> {plantDetails.fertilizingInfo.type}
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    )}

                    {/* Soil info if available */}
                    {plantDetails?.soilInfo && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21', mb: 2 }}>
                          Sol recommandé
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            bgcolor: 'white',
                            borderRadius: 2,
                            border: '1px solid #E8E8E8',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          }}
                        >
                          {plantDetails.soilInfo.type && (
                            <Typography variant="body2" sx={{ color: '#555', mb: 1, lineHeight: 1.6 }}>
                              {plantDetails.soilInfo.type}
                            </Typography>
                          )}
                          {plantDetails.soilInfo.ph && (
                            <Typography variant="caption" sx={{ color: '#888' }}>
                              pH optimal: {plantDetails.soilInfo.ph}
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <SpaIcon sx={{ color: '#CCC', fontSize: 48, mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#999' }}>
                      Aucune instruction de soin disponible
                    </Typography>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Tab 2: Problèmes (Issues) */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 2.5 }}>
                {commonProblems.length > 0 || pests.length > 0 ? (
                  <>
                    {/* Common problems */}
                    {commonProblems.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <BugReportIcon sx={{ color: VIRIDA_GREEN, fontSize: 22 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21' }}>
                            Problèmes courants
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {commonProblems.map((problem, index) => {
                            const problemText = typeof problem === 'string' ? problem : (problem as any)?.problem;
                            const solutionText = typeof problem === 'object' && problem !== null && (problem as any)?.solution
                              ? (problem as any).solution
                              : null;

                            return (
                              <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                  p: 2,
                                  bgcolor: 'white',
                                  borderRadius: 2,
                                  border: '1px solid #E8E8E8',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                }}
                              >
                                <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontSize: '0.85rem' }}>
                                  • {problemText}
                                </Typography>
                                {solutionText && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: VIRIDA_GREEN,
                                      lineHeight: 1.6,
                                      mt: 1,
                                      ml: 2,
                                      fontWeight: 500,
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    💡 Solution: {solutionText}
                                  </Typography>
                                )}
                              </Paper>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Pests */}
                    {pests.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21', mb: 2 }}>
                          Parasites à surveiller
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {pests.map((pest, index) => (
                            <Chip
                              key={index}
                              label={pest}
                              size="medium"
                              sx={{
                                bgcolor: 'white',
                                color: '#555',
                                border: '1px solid #E8E8E8',
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <BugReportIcon sx={{ color: '#CCC', fontSize: 48, mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#999' }}>
                      Aucune information sur les problèmes disponible
                    </Typography>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Tab 3: Récolte (Harvest) */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <AgricultureIcon sx={{ color: VIRIDA_GREEN, fontSize: 22 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#121A21' }}>
                    Informations de récolte
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  {/* Growth days */}
                  {catalogData.totalGrowthDays && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#888', mb: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Durée de croissance
                      </Typography>
                      <Typography variant="h6" sx={{ color: VIRIDA_GREEN, fontWeight: 700 }}>
                        {catalogData.totalGrowthDays} jours
                      </Typography>
                    </Paper>
                  )}

                  {/* Yield */}
                  {yieldDisplay && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#888', mb: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Rendement attendu
                      </Typography>
                      <Typography variant="h6" sx={{ color: VIRIDA_GREEN, fontWeight: 700 }}>
                        {yieldDisplay}
                      </Typography>
                    </Paper>
                  )}

                  {/* Optimal seasons */}
                  {catalogData.optimalSeasons && parseArrayField(catalogData.optimalSeasons).length > 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#888', mb: 1.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Saisons optimales
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {parseArrayField(catalogData.optimalSeasons).map((season, index) => (
                          <Chip
                            key={index}
                            label={season}
                            size="medium"
                            sx={{
                              bgcolor: VIRIDA_LIGHT_GREEN,
                              color: VIRIDA_GREEN,
                              fontWeight: 600,
                              border: `1px solid ${VIRIDA_GREEN}40`,
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  )}

                  {/* Harvest tips from RAG */}
                  {plantDetails?.harvestInfo?.tips && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        borderLeft: `4px solid ${VIRIDA_GREEN}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Conseils de récolte
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7 }}>
                        {plantDetails.harvestInfo.tips}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            </TabPanel>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
