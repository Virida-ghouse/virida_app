import React, { useState, useEffect } from 'react';
import { PlantCardModern } from './ui/PlantCardModern';
import { PlantDetailsDialogModern } from './ui/PlantDetailsDialogModern';
import { ConfirmDialog, AddPlantDialog } from './ui';
import { plantService } from '../../services/api';

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

const MyGardenNew: React.FC = () => {
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
        const data = await plantService.getPlants();
        setUserPlants(data as any || []);
      } catch (err) {
        console.error('Erreur chargement plantes utilisateur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlants();
  }, []);

  const handleDeletePlant = (plantId: string) => {
    const plant = userPlants.find(p => p.id === plantId);
    if (plant) {
      setPlantToDelete({ id: plant.id, name: plant.name });
      setConfirmDialogOpen(true);
    }
  };

  const confirmDeletePlant = async () => {
    if (!plantToDelete) return;

    try {
      await plantService.deletePlant(plantToDelete.id);
      setUserPlants((prev) => prev.filter((plant) => plant.id !== plantToDelete.id));
      setConfirmDialogOpen(false);
      setPlantToDelete(null);
    } catch (err) {
      console.error('Erreur suppression plante:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleAddPlant = () => {
    setAddPlantDialogOpen(true);
  };

  const handleCloseAddPlant = () => {
    setAddPlantDialogOpen(false);
  };

  const handlePlantAdded = () => {
    const fetchUserPlants = async () => {
      try {
        const data = await plantService.getPlants();
        setUserPlants(data as any || []);
      } catch (err) {
        console.error('Erreur rechargement plantes:', err);
      }
    };
    fetchUserPlants();
  };

  const handleOpenPlantDetails = (plantId: string) => {
    setSelectedPlantId(plantId);
    setDetailsDialogOpen(true);
  };

  const handleClosePlantDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedPlantId(null);
  };

  const handlePlantUpdated = () => {
    const fetchUserPlants = async () => {
      try {
        const data = await plantService.getPlants();
        setUserPlants(data as any || []);
      } catch (err) {
        console.error('Erreur rechargement plantes:', err);
      }
    };
    fetchUserPlants();
  };

  const handlePlantDeleted = () => {
    const fetchUserPlants = async () => {
      try {
        const data = await plantService.getPlants();
        setUserPlants(data as any || []);
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

  const totalPlants = userPlants.length;
  const activePlants = userPlants.filter(p => (p.daysToHarvest || 0) > 0).length;
  const readyToHarvest = userPlants.filter(p => p.daysToHarvest === 0).length;

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-16 h-16 border-4 border-[var(--border-color)] border-t-[#2AD368] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="p-4 glass-card backdrop-blur-xl rounded-2xl border border-red-500/30 bg-black/5 dark:bg-white/5d-500/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[var(--text-secondary)]">error</span>
          <p className="text-[var(--text-secondary)] font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // État vide
  if (userPlants.length === 0) {
    return (
      <div>
        <div className="glass-card backdrop-blur-xl rounded-3xl p-12 text-center border border-[var(--border-color)]">
          <div className="mb-6">
            <span className="text-8xl">🌱</span>
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Votre jardin est vide
          </h3>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
            Commencez votre culture en ajoutant une plante depuis la bibliothèque. Suivez sa croissance et recevez des conseils personnalisés.
          </p>
          <button
            onClick={handleAddPlant}
            className="px-6 py-3 bg-[#2AD368] hover:bg-black/5 dark:hover:bg-white/10fc75c] text-[#121A21] fontbg-[var(--bg-primary)] dark:bg-background-dark-xl transition-all shadow-[0_8px_30px_rgba(42,211,104,0.4)] hover:shadow-[0_12px_40px_rgba(42,211,104,0.6)] hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined">add</span>
            Ajouter ma première plante
          </button>
        </div>

        <AddPlantDialog
          open={addPlantDialogOpen}
          onClose={handleCloseAddPlant}
          onPlantAdded={handlePlantAdded}
        />
      </div>
    );
  }

  // Contenu avec plantes
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="glass-card backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] text-[10px] md:text-xs font-semibold uppercase mb-1">Total</p>
          <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{totalPlants}</p>
        </div>
        <div className="glass-card backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] text-[10px] md:text-xs font-semibold uppercase mb-1 truncate">Croissance</p>
          <p className="text-2xl md:text-3xl font-black text-[#2AD368]">{activePlants}</p>
        </div>
        <div className="glass-card backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] text-[10px] md:text-xs font-semibold uppercase mb-1">Prêtes</p>
          <p className="text-2xl md:text-3xl font-black text-[#CBED62]">{readyToHarvest}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCurrentFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            currentFilter === 'all'
              ? 'bg-[#2AD368] text-[#121A21]'
              : 'glass-card backdrop-blur-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
          }`}
        >
          Toutes ({totalPlants})
        </button>
        <button
          onClick={() => setCurrentFilter('active')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            currentFilter === 'active'
              ? 'bg-[#2AD368] text-[#121A21]'
              : 'glass-card backdrop-blur-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
          }`}
        >
          En croissance ({activePlants})
        </button>
        <button
          onClick={() => setCurrentFilter('ready')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            currentFilter === 'ready'
              ? 'bg-[#2AD368] text-[#121A21]'
              : 'glass-card backdrop-blur-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
          }`}
        >
          Prêtes ({readyToHarvest})
        </button>
      </div>

      {/* Grille de plantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlants.map((plant) => (
          <PlantCardModern
            key={plant.id}
            plant={plant}
            onDelete={handleDeletePlant}
            onClick={handleOpenPlantDetails}
          />
        ))}
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDeletePlant}
        title="Supprimer cette plante ?"
        message={`Êtes-vous sûr de vouloir supprimer "${plantToDelete?.name}" ? Cette action est irréversible.`}
      />

      <AddPlantDialog
        open={addPlantDialogOpen}
        onClose={handleCloseAddPlant}
        onPlantAdded={handlePlantAdded}
      />

      {selectedPlantId && (
        <PlantDetailsDialogModern
          open={detailsDialogOpen}
          onClose={handleClosePlantDetails}
          plantId={selectedPlantId}
          onPlantUpdated={handlePlantUpdated}
          onPlantDeleted={handlePlantDeleted}
        />
      )}
    </div>
  );
};

export default MyGardenNew;
