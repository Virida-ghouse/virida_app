import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { PlantCardMinimal } from './ui';
import { PlantLibraryDetailsDialog } from './ui/PlantLibraryDetailsDialog';
import { useViridaStore } from '../../store/useViridaStore';

interface PlantCatalog {
  id: string;
  commonName: string;
  species: string;
  category: string;
  difficulty: string;
  totalGrowthDays: number;
  imageUrl?: string;
  iconEmoji?: string;

  // Nouvelles données pour Plant Care
  yieldMin?: number;
  yieldMax?: number;
  yieldUnit?: string;
  spaceRequiredWidth?: number;
  spaceRequiredHeight?: number;
  wateringFrequency?: string;
  wateringAmount?: string;
  sunlightHours?: string;
  optimalSeasons?: string;
  optimalTempMin?: number;
  optimalTempMax?: number;
  optimalHumidityMin?: number;
  optimalHumidityMax?: number;
}

const PlantLibrary: React.FC = () => {
  const apiUrl = useViridaStore((state) => state.apiUrl);

  const [plants, setPlants] = useState<PlantCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Dialog de détails
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantCatalog | null>(null);

  // Charger le catalogue depuis l'API
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);
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
        setPlants(data.data?.plants || []);
      } catch (err) {
        console.error('Erreur chargement catalogue:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [apiUrl]);

  // Filtrer les plantes
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.commonName.toLowerCase().includes(searchText.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory = !selectedCategory || plant.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || plant.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Catégories et difficultés uniques
  const categories = [...new Set(plants.map((p) => p.category))];
  const difficulties = [...new Set(plants.map((p) => p.difficulty))];

  // Stats
  const totalPlants = filteredPlants.length;

  return (
    <Box>
      {/* En-tête avec stats */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21', mb: 1 }}>
          Bibliothèque de Plantes
        </Typography>
        <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
          Explorez notre catalogue de {plants.length} plantes pour votre serre
        </Typography>

        {/* Chips de stats */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Chip
            label={`${totalPlants} plante${totalPlants > 1 ? 's' : ''}`}
            sx={{
              bgcolor: '#F0F9F4',
              color: '#2E7D32',
              fontWeight: 600,
            }}
          />
          {selectedCategory && (
            <Chip
              label={selectedCategory.replace('_', ' ')}
              onDelete={() => setSelectedCategory('')}
              sx={{
                bgcolor: '#E8F5E9',
                color: '#2E7D32',
              }}
            />
          )}
          {selectedDifficulty && (
            <Chip
              label={`Difficulté: ${selectedDifficulty}`}
              onDelete={() => setSelectedDifficulty('')}
              sx={{
                bgcolor: '#E8F5E9',
                color: '#2E7D32',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Barre de recherche et filtres */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Rechercher par nom ou espèce..."
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: 250,
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#E0E0E0' },
                '&:hover fieldset': { borderColor: '#2E7D32' },
                '&.Mui-focused fieldset': { borderColor: '#2E7D32' },
              },
            }}
          />

          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              bgcolor: showFilters ? '#F5F5F5' : 'white',
              color: '#757575',
              border: '1px solid #E0E0E0',
              '&:hover': {
                bgcolor: '#F5F5F5',
                borderColor: '#2E7D32',
                color: '#2E7D32',
              },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        {/* Filtres avancés */}
        {showFilters && (
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2E7D32',
                  },
                }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
              <InputLabel>Difficulté</InputLabel>
              <Select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                label="Difficulté"
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2E7D32',
                  },
                }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {difficulties.map((diff) => (
                  <MenuItem key={diff} value={diff}>
                    {diff}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {/* Erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: '#2E7D32' }} size={60} />
        </Box>
      )}

      {/* Grille de plantes */}
      {!loading && filteredPlants.length > 0 ? (
        <Grid container spacing={3}>
          {filteredPlants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
              <PlantCardMinimal
                id={plant.id}
                name={plant.commonName || plant.species}
                emoji={plant.iconEmoji}
                photo={plant.imageUrl}
                healthScore={100}
                daysToHarvest={plant.totalGrowthDays}
                category={plant.category}
                difficulty={plant.difficulty}
                yieldMin={plant.yieldMin}
                yieldMax={plant.yieldMax}
                yieldUnit={plant.yieldUnit}
                wateringFrequency={plant.wateringFrequency}
                sunlightHours={plant.sunlightHours}
                optimalTempMin={plant.optimalTempMin}
                optimalTempMax={plant.optimalTempMax}
                onClick={() => {
                  setSelectedPlant(plant);
                  setDetailsDialogOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : !loading && filteredPlants.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'white',
            borderRadius: 2,
            border: '1px solid #F0F0F0',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#121A21' }}>
            Aucune plante trouvée
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575' }}>
            Essayez de modifier vos critères de recherche
          </Typography>
        </Box>
      ) : null}

      {/* Dialog de détails de la plante */}
      {selectedPlant && (
        <PlantLibraryDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setSelectedPlant(null);
          }}
          plantId={selectedPlant.id}
          plantName={selectedPlant.commonName || selectedPlant.species}
        />
      )}
    </Box>
  );
};

export default PlantLibrary;
