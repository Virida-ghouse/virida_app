import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { PlantCardMinimal } from './ui';
import { StatCard } from './ui/StatCard';
import { useViridaStore } from '../../store/useViridaStore';
import PlantDetails from './PlantDetails';

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
}

const PlantsPageNew: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const apiUrl = useViridaStore((state) => state.apiUrl);

  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedHealthRange, setSelectedHealthRange] = useState('');

  // Charger les plantes depuis l'API
  useEffect(() => {
    const fetchPlants = async () => {
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
          throw new Error('Erreur lors du chargement des plantes');
        }

        const data = await response.json();
        const catalogPlants = data.data?.plants || [];

        // Convertir le format du catalogue vers le format Plant
        const formattedPlants = catalogPlants.map((p: any) => ({
          id: p.id,
          name: p.commonName || p.species,
          species: p.species,
          category: p.category,
          difficulty: p.difficulty,
          health: 100, // Mock - sera remplacé par données réelles IoT
          growthStage: 'VEGETATIVE', // Mock
          daysToHarvest: p.totalGrowthDays,
          imageUrl: p.imageUrl,
          iconEmoji: p.iconEmoji,
        }));

        setPlants(formattedPlants);
      } catch (err) {
        console.error('Erreur chargement plantes:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [apiUrl]);

  // Filtrer les plantes
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchText.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory = !selectedCategory || plant.category === selectedCategory;

    let matchesHealth = true;
    if (selectedHealthRange === 'excellent') matchesHealth = plant.health >= 80;
    else if (selectedHealthRange === 'good') matchesHealth = plant.health >= 60 && plant.health < 80;
    else if (selectedHealthRange === 'fair') matchesHealth = plant.health >= 40 && plant.health < 60;
    else if (selectedHealthRange === 'poor') matchesHealth = plant.health < 40;

    return matchesSearch && matchesCategory && matchesHealth;
  });

  // Stats globales
  const totalPlants = filteredPlants.length;
  const excellentHealth = filteredPlants.filter((p) => p.health >= 80).length;
  const toWatch = filteredPlants.filter((p) => p.health < 60).length;
  const avgHealth = totalPlants > 0
    ? Math.round(filteredPlants.reduce((acc, p) => acc + p.health, 0) / totalPlants)
    : 0;

  // Catégories uniques
  const categories = [...new Set(plants.map((p) => p.category))];

  // Calculer progression moyenne
  const avgProgress = totalPlants > 0
    ? Math.round(filteredPlants.reduce((acc, p) => {
        const progress = p.daysToHarvest ? Math.max(0, 100 - (p.daysToHarvest / 60 * 100)) : 0;
        return acc + progress;
      }, 0) / totalPlants)
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header avec titre et actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          mb: 4,
          gap: isMobile ? 2 : 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ backgroundColor: '#2E7D32', width: 56, height: 56 }}>
            <LocalFloristIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: '#2E7D32', fontWeight: 700 }}>
              Mes Plantes
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
              Gérez et surveillez vos cultures en temps réel
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth={isMobile}
          sx={{
            backgroundColor: '#2E7D32',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            '&:hover': {
              backgroundColor: '#1B5E20',
              boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
            },
          }}
        >
          Ajouter une plante
        </Button>
      </Box>

      {/* Stats simplifiées */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Plantes"
            value={totalPlants}
            subtitle={excellentHealth > 0 ? `${excellentHealth} en bonne santé` : ''}
            color="#2AD388"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Santé moyenne"
            value={`${avgHealth}%`}
            color={avgHealth >= 80 ? '#2AD388' : avgHealth >= 60 ? '#FFA726' : '#EF5350'}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="À surveiller"
            value={toWatch}
            subtitle={toWatch === 0 ? 'Tout va bien' : ''}
            color={toWatch === 0 ? '#2AD388' : '#FFA726'}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Progression"
            value={`${avgProgress}%`}
            subtitle="Vers récolte"
            color="#2AD388"
          />
        </Grid>
      </Grid>

      {/* Barre de recherche et filtres */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Rechercher une plante..."
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
                '&:hover fieldset': { borderColor: '#2AD388' },
                '&.Mui-focused fieldset': { borderColor: '#2AD388' },
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
                borderColor: '#2AD388',
                color: '#2AD388',
              },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

          {/* Filtres avancés */}
          {showFilters && (
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Catégorie"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2AD388',
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

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Santé</InputLabel>
                <Select
                  value={selectedHealthRange}
                  onChange={(e) => setSelectedHealthRange(e.target.value)}
                  label="Santé"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2AD388',
                    },
                  }}
                >
                  <MenuItem value="">Toutes</MenuItem>
                  <MenuItem value="excellent">💚 Excellente (≥80%)</MenuItem>
                  <MenuItem value="good">✅ Bonne (60-79%)</MenuItem>
                  <MenuItem value="fair">⚠️ Acceptable (40-59%)</MenuItem>
                  <MenuItem value="poor">❌ Mauvaise (&lt;40%)</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchText('');
                  setSelectedCategory('');
                  setSelectedHealthRange('');
                }}
                sx={{
                  color: '#757575',
                  borderColor: '#E0E0E0',
                  '&:hover': {
                    borderColor: '#2AD388',
                    color: '#2AD388',
                    bgcolor: '#2AD38810',
                  },
                }}
              >
                Réinitialiser
              </Button>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2AD388' }} size={60} />
        </Box>
      )}

      {/* Grille de plantes avec nouveau PlantCard */}
      {!loading && filteredPlants.length > 0 ? (
        <Grid container spacing={4}>
          {filteredPlants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
              <PlantCardMinimal
                id={plant.id}
                name={plant.name}
                emoji={plant.iconEmoji}
                photo={plant.imageUrl}
                healthScore={plant.health}
                daysToHarvest={plant.daysToHarvest || 0}
                onClick={() => setSelectedPlant(plant)}
              />
            </Grid>
          ))}
        </Grid>
      ) : !loading && filteredPlants.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              🔍 Aucune plante trouvée
            </Typography>
            <Typography variant="body1" color="#757575" sx={{ mb: 3 }}>
              {plants.length > 0
                ? 'Aucune plante ne correspond à vos filtres. Essayez de modifier vos critères.'
                : 'Commencez par ajouter une nouvelle plante à votre serre !'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#2AD388',
                color: 'white',
                fontWeight: 600,
                px: 4,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#23A075',
                },
              }}
            >
              Ajouter ma première plante
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Modal de détails de la plante */}
      {selectedPlant && (
        <PlantDetails plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}
    </Container>
  );
};

export default PlantsPageNew;
