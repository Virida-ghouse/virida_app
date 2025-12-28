import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PlantCardMinimal, ConfirmDialog, AddPlantDialog, PlantDetailsDialog } from './ui';
import { useViridaStore } from '../../store/useViridaStore';

interface UserPlant {
  id: string;
  name: string;
  species: string;
  imageUrl?: string;
  iconEmoji?: string;
  health: number;
  daysToHarvest?: number;
  status: string;
  plantedAt?: string;
}

const MyGarden: React.FC = () => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'active' | 'ready'>('all');
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<{ id: string; name: string } | null>(null);
  const [addPlantDialogOpen, setAddPlantDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  // Récupérer les plantes de l'utilisateur
  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('virida_token');
        const response = await fetch(`${apiUrl}/api/plants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des plantes');
        }

        const data = await response.json();
        setUserPlants(data.data || []);
      } catch (err) {
        console.error('Erreur chargement plantes utilisateur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlants();
  }, [apiUrl]);

  // Ouvrir le dialogue de confirmation de suppression
  const handleDeletePlant = (plantId: string) => {
    const plant = userPlants.find(p => p.id === plantId);
    if (plant) {
      setPlantToDelete({ id: plant.id, name: plant.name });
      setConfirmDialogOpen(true);
    }
  };

  // Confirmer la suppression
  const confirmDeletePlant = async () => {
    if (!plantToDelete) return;

    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plants/${plantToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la plante');
      }

      // Retirer la plante de la liste localement
      setUserPlants((prev) => prev.filter((plant) => plant.id !== plantToDelete.id));

      // Fermer le dialogue
      setConfirmDialogOpen(false);
      setPlantToDelete(null);
    } catch (err) {
      console.error('Erreur suppression plante:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      setConfirmDialogOpen(false);
    }
  };

  // Annuler la suppression
  const cancelDeletePlant = () => {
    setConfirmDialogOpen(false);
    setPlantToDelete(null);
  };

  // Ouvrir le dialogue d'ajout de plante
  const handleOpenAddPlant = () => {
    setAddPlantDialogOpen(true);
  };

  // Fermer le dialogue d'ajout
  const handleCloseAddPlant = () => {
    setAddPlantDialogOpen(false);
  };

  // Callback après ajout réussi d'une plante
  const handlePlantAdded = () => {
    // Recharger la liste des plantes
    const fetchUserPlants = async () => {
      try {
        const token = localStorage.getItem('virida_token');
        const response = await fetch(`${apiUrl}/api/plants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserPlants(data.data || []);
        }
      } catch (err) {
        console.error('Erreur rechargement plantes:', err);
      }
    };
    fetchUserPlants();
  };

  // Ouvrir le dialogue de détails de plante
  const handleOpenPlantDetails = (plantId: string) => {
    setSelectedPlantId(plantId);
    setDetailsDialogOpen(true);
  };

  // Fermer le dialogue de détails
  const handleClosePlantDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedPlantId(null);
  };

  // Callback après mise à jour d'une plante
  const handlePlantUpdated = () => {
    // Recharger la liste des plantes
    const fetchUserPlants = async () => {
      try {
        const token = localStorage.getItem('virida_token');
        const response = await fetch(`${apiUrl}/api/plants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserPlants(data.data || []);
        }
      } catch (err) {
        console.error('Erreur rechargement plantes:', err);
      }
    };
    fetchUserPlants();
  };

  // Callback après suppression d'une plante depuis les détails
  const handlePlantDeleted = () => {
    // Recharger la liste des plantes
    const fetchUserPlants = async () => {
      try {
        const token = localStorage.getItem('virida_token');
        const response = await fetch(`${apiUrl}/api/plants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserPlants(data.data || []);
        }
      } catch (err) {
        console.error('Erreur rechargement plantes:', err);
      }
    };
    fetchUserPlants();
  };

  const filteredPlants = userPlants.filter((plant) => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return (plant.daysToHarvest || 0) > 0;
    if (currentFilter === 'ready') return plant.daysToHarvest === 0;
    return true;
  });

  // Stats
  const totalPlants = userPlants.length;
  const activePlants = userPlants.filter(p => (p.daysToHarvest || 0) > 0).length;
  const readyToHarvest = userPlants.filter(p => p.daysToHarvest === 0).length;
  const avgHealth = totalPlants > 0
    ? Math.round(userPlants.reduce((acc, p) => acc + p.health, 0) / totalPlants)
    : 0;

  // Loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#2E7D32' }} size={60} />
      </Box>
    );
  }

  // Erreur
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // État vide élégant
  if (userPlants.length === 0) {
    return (
      <Box>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21', mb: 1 }}>
            Mon Jardin
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575' }}>
            Gérez vos plantes en culture
          </Typography>
        </Box>

        {/* État vide */}
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            bgcolor: 'white',
            borderRadius: 3,
            border: '1px solid #F0F0F0',
          }}
        >
          <Typography sx={{ fontSize: '4rem', mb: 2 }}>🌱</Typography>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#121A21' }}>
            Votre jardin est vide
          </Typography>
          <Typography variant="body1" color="#757575" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Commencez votre culture en ajoutant une plante depuis la bibliothèque.
            Suivez sa croissance et recevez des conseils personnalisés.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddPlant}
            sx={{
              bgcolor: '#2E7D32',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                bgcolor: '#1B5E20',
                boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
              },
            }}
          >
            Ajouter ma première plante
          </Button>
        </Box>

        {/* Modal d'ajout de plante */}
        <AddPlantDialog
          open={addPlantDialogOpen}
          onClose={handleCloseAddPlant}
          onPlantAdded={handlePlantAdded}
        />
      </Box>
    );
  }

  // Vue avec plantes
  return (
    <Box>
      {/* En-tête avec stats */}
      <Box sx={{ mb: 4 }}>
        {/* Titre et bouton Ajouter */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21', mb: 0.5 }}>
              Mon Jardin
            </Typography>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              {totalPlants} plante{totalPlants > 1 ? 's' : ''} en culture
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddPlant}
            sx={{
              bgcolor: '#2E7D32',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
              '&:hover': {
                bgcolor: '#1B5E20',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
              },
            }}
          >
            Ajouter une plante
          </Button>
        </Box>

        {/* Chips de stats */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 3, mb: 3 }}>
          <Chip
            label={`${activePlants} en croissance`}
            sx={{
              bgcolor: '#F0F9F4',
              color: '#2E7D32',
              fontWeight: 600,
            }}
          />
          {readyToHarvest > 0 && (
            <Chip
              label={`${readyToHarvest} prêt${readyToHarvest > 1 ? 'es' : ''} à récolter`}
              sx={{
                bgcolor: '#FFF4E5',
                color: '#F57C00',
                fontWeight: 600,
              }}
            />
          )}
          <Chip
            label={`Santé moyenne: ${avgHealth}%`}
            sx={{
              bgcolor: avgHealth >= 80 ? '#E8F5E9' : '#FFF3E0',
              color: avgHealth >= 80 ? '#2E7D32' : '#F57C00',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Filtres par tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={currentFilter}
          onChange={(_, newValue) => setCurrentFilter(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#757575',
              '&.Mui-selected': {
                color: '#2E7D32',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2E7D32',
              height: 3,
            },
          }}
        >
          <Tab label="Toutes" value="all" />
          <Tab label="En croissance" value="active" />
          <Tab label="Prêtes à récolter" value="ready" />
        </Tabs>
      </Box>

      {/* Grille de plantes */}
      {filteredPlants.length > 0 ? (
        <Grid container spacing={3}>
          {filteredPlants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
              <PlantCardMinimal
                id={plant.id}
                name={plant.name}
                emoji={plant.iconEmoji}
                photo={plant.imageUrl}
                healthScore={plant.health}
                daysToHarvest={plant.daysToHarvest || 0}
                onClick={() => handleOpenPlantDetails(plant.id)}
                onDelete={handleDeletePlant}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
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
            Aucune plante dans ce filtre
          </Typography>
          <Typography variant="body1" color="#757575">
            Essayez un autre filtre
          </Typography>
        </Box>
      )}

      {/* Dialogue de confirmation de suppression */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Supprimer cette plante ?"
        message={`Êtes-vous sûr de vouloir supprimer "${plantToDelete?.name}" ? Cette action est irréversible et supprimera également toutes les données associées (tâches, photos, etc.).`}
        onConfirm={confirmDeletePlant}
        onCancel={cancelDeletePlant}
        confirmText="Supprimer"
        cancelText="Annuler"
        isDanger={true}
      />

      {/* Modal d'ajout de plante */}
      <AddPlantDialog
        open={addPlantDialogOpen}
        onClose={handleCloseAddPlant}
        onPlantAdded={handlePlantAdded}
      />

      {/* Modal de détails de plante */}
      <PlantDetailsDialog
        open={detailsDialogOpen}
        onClose={handleClosePlantDetails}
        plantId={selectedPlantId}
        onPlantUpdated={handlePlantUpdated}
        onPlantDeleted={handlePlantDeleted}
      />
    </Box>
  );
};

export default MyGarden;
