import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useViridaStore } from '../../../store/useViridaStore';

interface PlantCatalog {
  id: string;
  commonName: string;
  species: string;
  category: string;
  difficulty: string;
  totalGrowthDays: number;
  imageUrl?: string;
  iconEmoji?: string;
  wateringFrequencyDays?: number;
  fertilizingFrequencyDays?: number;
  description?: string;
}

interface Greenhouse {
  id: string;
  name: string;
  description?: string;
  location?: string;
}

interface AddPlantDialogProps {
  open: boolean;
  onClose: () => void;
  onPlantAdded: () => void;
}

export const AddPlantDialog: React.FC<AddPlantDialogProps> = ({
  open,
  onClose,
  onPlantAdded,
}) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Sélectionner', 'Configurer', 'Confirmer'];

  // Catalog state
  const [catalog, setCatalog] = useState<PlantCatalog[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Greenhouses state
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loadingGreenhouses, setLoadingGreenhouses] = useState(false);


  // Selected plant
  const [selectedPlant, setSelectedPlant] = useState<PlantCatalog | null>(null);

  // Configuration
  const [plantName, setPlantName] = useState('');
  const [zone, setZone] = useState('Zone 1');
  const [greenhouse, setGreenhouse] = useState('');
  const [plantedAt, setPlantedAt] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load catalog when dialog opens
  useEffect(() => {
    if (open) {
      fetchCatalog();
      fetchGreenhouses();
      // Reset state
      setActiveStep(0);
      setSelectedPlant(null);
      setPlantName('');
      setNotes('');
      setSubmitError(null);
    }
  }, [open]);

  const fetchCatalog = async () => {
    try {
      setLoadingCatalog(true);
      setCatalogError(null);
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plant-catalog`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du catalogue');
      }

      const data = await response.json();
      setCatalog(data.data?.plants || []);
    } catch (err) {
      console.error('Erreur chargement catalogue:', err);
      setCatalogError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoadingCatalog(false);
    }
  };

  const fetchGreenhouses = async () => {
    try {
      setLoadingGreenhouses(true);
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/greenhouses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch greenhouses');

      const data = await response.json();
      setGreenhouses(data.data || []);

      // Auto-select first greenhouse if none selected
      if (data.data && data.data.length > 0 && !greenhouse) {
        setGreenhouse(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching greenhouses:', error);
      setGreenhouses([]);
    } finally {
      setLoadingGreenhouses(false);
    }
  };


  const handleSelectPlant = (plant: PlantCatalog) => {
    setSelectedPlant(plant);
    setPlantName(plant.commonName); // Pre-fill with catalog name
    setActiveStep(1);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!selectedPlant) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const token = localStorage.getItem('virida_token');

      const payload = {
        catalogId: selectedPlant.id,
        name: plantName || selectedPlant.commonName,
        zone,
        greenhouse,
        plantedAt: new Date(plantedAt).toISOString(),
        notes: notes || undefined,
      };

      const response = await fetch(`${apiUrl}/api/plants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout de la plante');
      }

      // Success!
      onPlantAdded();
      onClose();
    } catch (err) {
      console.error('Erreur ajout plante:', err);
      setSubmitError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    // Step 1: Select plant from catalog
    if (activeStep === 0) {
      return (
        <Box>
          <Typography variant="body1" sx={{ mb: 3, color: '#757575' }}>
            Choisissez une plante de notre catalogue pour l'ajouter à votre jardin
          </Typography>

          {catalogError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {catalogError}
            </Alert>
          )}

          {loadingCatalog ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#2E7D32' }} />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
              {catalog.map((plant) => (
                <Grid item xs={6} sm={4} key={plant.id}>
                  <Card
                    onClick={() => handleSelectPlant(plant)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderRadius: 2,
                      border: '1px solid #F0F0F0',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(46, 125, 50, 0.15)',
                        borderColor: '#2E7D32',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 120,
                        bgcolor: '#F9FAFB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {plant.imageUrl ? (
                        <CardMedia
                          component="img"
                          height="120"
                          image={plant.imageUrl}
                          alt={plant.commonName}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: '3rem' }}>
                          {plant.iconEmoji || '🌱'}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#FFFFFF',
                          mb: 0.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        {plant.commonName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: '#9E9E9E', fontSize: '0.75rem' }}
                      >
                        {plant.totalGrowthDays}j
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );
    }

    // Step 2: Configure plant
    if (activeStep === 1) {
      return (
        <Box>
          {selectedPlant && (
            <>
              {/* Plant preview */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                  p: 2,
                  bgcolor: '#F0F9F4',
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedPlant.imageUrl ? (
                    <CardMedia
                      component="img"
                      sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover' }}
                      image={selectedPlant.imageUrl}
                      alt={selectedPlant.commonName}
                    />
                  ) : (
                    <Typography sx={{ fontSize: '2rem' }}>
                      {selectedPlant.iconEmoji || '🌱'}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                    {selectedPlant.commonName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    {selectedPlant.species}
                  </Typography>
                </Box>
              </Box>

              {/* Configuration form */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom personnalisé (optionnel)"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder={selectedPlant.commonName}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2E7D32' },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Zone</InputLabel>
                    <Select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      label="Zone"
                      sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2E7D32',
                        },
                      }}
                    >
                      <MenuItem value="Zone 1">Zone 1</MenuItem>
                      <MenuItem value="Zone 2">Zone 2</MenuItem>
                      <MenuItem value="Zone 3">Zone 3</MenuItem>
                      <MenuItem value="Zone 4">Zone 4</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Serre</InputLabel>
                    <Select
                      value={greenhouse}
                      onChange={(e) => setGreenhouse(e.target.value)}
                      label="Serre"
                      sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2E7D32',
                        },
                      }}
                    >
                      {loadingGreenhouses ? (
                        <MenuItem disabled>Chargement...</MenuItem>
                      ) : greenhouses.length === 0 ? (
                        <MenuItem disabled>Aucune serre disponible</MenuItem>
                      ) : (
                        greenhouses.map((gh) => (
                          <MenuItem key={gh.id} value={gh.id}>
                            {gh.name}
                            {gh.location && ` - ${gh.location}`}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Date de plantation"
                    type="date"
                    value={plantedAt}
                    onChange={(e) => setPlantedAt(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2E7D32' },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (optionnel)"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez des notes sur cette plante..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2E7D32' },
                    }}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      );
    }

    // Step 3: Confirm
    if (activeStep === 2) {
      return (
        <Box>
          {selectedPlant && (
            <>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CheckCircleIcon sx={{ fontSize: '4rem', color: '#2E7D32', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21', mb: 1 }}>
                  Prêt à ajouter votre plante
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575' }}>
                  Vérifiez les informations avant de confirmer
                </Typography>
              </Box>

              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              {/* Summary */}
              <Box
                sx={{
                  p: 3,
                  bgcolor: '#F9FAFB',
                  borderRadius: 2,
                  border: '1px solid #F0F0F0',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          bgcolor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: '2.5rem' }}>
                          {selectedPlant.iconEmoji || '🌱'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
                          {plantName || selectedPlant.commonName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575' }}>
                          {selectedPlant.species}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#9E9E9E', display: 'block' }}>
                      Zone
                    </Typography>
                    <Chip
                      label={zone}
                      size="small"
                      sx={{ mt: 0.5, bgcolor: '#E8F5E9', color: '#2E7D32' }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#9E9E9E', display: 'block' }}>
                      Serre
                    </Typography>
                    <Chip
                      label={greenhouse}
                      size="small"
                      sx={{ mt: 0.5, bgcolor: '#E8F5E9', color: '#2E7D32' }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#9E9E9E', display: 'block' }}>
                      Date de plantation
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#121A21', mt: 0.5 }}>
                      {new Date(plantedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Grid>

                  {notes && (
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: '#9E9E9E', display: 'block' }}>
                        Notes
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#121A21', mt: 0.5 }}>
                        {notes}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#9E9E9E', display: 'block' }}>
                      Durée de croissance
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#121A21', mt: 0.5 }}>
                      {selectedPlant.totalGrowthDays} jours
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      );
    }

    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, pt: 3 }}>
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: '#121A21' }}>
            Ajouter une plante
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
            Suivez les étapes pour ajouter une nouvelle plante à votre jardin
          </Typography>
        </Box>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: '#757575',
                    '&.Mui-active': { color: '#2E7D32', fontWeight: 600 },
                    '&.Mui-completed': { color: '#2E7D32' },
                  },
                  '& .MuiStepIcon-root': {
                    color: '#E0E0E0',
                    '&.Mui-active': { color: '#2E7D32' },
                    '&.Mui-completed': { color: '#2E7D32' },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 3, minHeight: 400 }}>
        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={submitting}
          sx={{
            borderColor: '#E0E0E0',
            color: '#616161',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1.2,
            borderRadius: 2,
            '&:hover': {
              borderColor: '#BDBDBD',
              bgcolor: '#FAFAFA',
            },
          }}
        >
          Annuler
        </Button>

        <Box sx={{ flex: 1 }} />

        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            disabled={submitting}
            startIcon={<ChevronLeftIcon />}
            sx={{
              color: '#757575',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1.2,
              '&:hover': {
                bgcolor: '#F5F5F5',
              },
            }}
          >
            Précédent
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!selectedPlant || submitting}
            endIcon={<ChevronRightIcon />}
            variant="contained"
            sx={{
              bgcolor: '#2E7D32',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1.2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                bgcolor: '#1B5E20',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
              },
              '&:disabled': {
                bgcolor: '#E0E0E0',
                color: '#9E9E9E',
              },
            }}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            variant="contained"
            sx={{
              bgcolor: '#2E7D32',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              px: 4,
              py: 1.2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                bgcolor: '#1B5E20',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
              },
            }}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Ajouter la plante'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
