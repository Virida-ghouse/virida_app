import React, { useEffect, useState } from 'react';
import { PlantCardModern } from './ui/PlantCardModern';
import { PlantLibraryDetailsDialogModern } from './ui/PlantLibraryDetailsDialogModern';
import { plantService } from '../../services/api';

interface PlantCatalog {
  id: string;
  commonName: string;
  species: string;
  category: string;
  difficulty: string;
  totalGrowthDays: number;
  imageUrl?: string;
  iconEmoji?: string;
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

const PlantLibraryNew: React.FC = () => {
  const [plants, setPlants] = useState<PlantCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantCatalog | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await plantService.getPlantLibrary();
        setPlants(data as any || []);
      } catch (err) {
        console.error('Erreur chargement catalogue:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      (plant.commonName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (plant.species?.toLowerCase() || '').includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || plant.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || plant.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleOpenDetails = (plant: PlantCatalog) => {
    setSelectedPlant(plant);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedPlant(null);
  };

  const categories = Array.from(new Set(plants.map(p => p.category)));
  const difficulties = Array.from(new Set(plants.map(p => p.difficulty)));

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-16 h-16 border-4 border-[#2AD368]/30 border-t-[#2AD368] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 glass-card bg-[var(--bg-primary)] dark:bg-background-darkblur-xl rounded-2xl border border-red-500/30 bg-black/5 dark:bg-white/5d-500/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-red-400">error</span>
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header avec recherche */}
      <div className="mb-6">
        <p className="text-[var(--text-secondary)] mb-4">
          Explorez notre catalogue de {plants.length} plantes pour votre serre
        </p>

        <div className="flex gap-3">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher par nom ou espèce..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card bg-[var(--bg-primary)] dark:bg-background-darkblur-xl rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2AD368]/50 transition-all border border-[var(--border-color)]"
            />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
              showFilters
                ? 'bg-[#2AD368] text-[#121A21]'
                : 'glass-card bg-[var(--bg-primary)] dark:bg-background-darkblur-xl text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10xt-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 glass-card bg-[var(--bg-primary)] dark:bg-background-darkblur-xl rounded-2xl p-4 border border-[var(--border-color)]">
            <div className="grid grid-cols-2 gap-4">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 glass-card bg-[var(--bg-primary)] dark:bg-background-darkblur-xl rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2AD368]/50 transition-all border border-[var(--border-color)]"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulté */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  Difficulté
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 glass-card bg-[var(--bg-primary)] dark:bg-background-darkblur-xl rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2AD368]/50 transition-all border border-[var(--border-color)]"
                >
                  <option value="">Toutes les difficultés</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="text-[#2AD368] font-semibold">{filteredPlants.length}</span> plante{filteredPlants.length > 1 ? 's' : ''} trouvée{filteredPlants.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille de plantes */}
      {filteredPlants.length === 0 ? (
        <div className="glass-card bg-[var(--bg-primary)] dark:bg-background-darkblur-xl rounded-3xl p-12 text-center border border-[var(--border-color)]">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Aucune plante trouvée
          </h3>
          <p className="text-[var(--text-secondary)]">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => handleOpenDetails(plant)}
              className="cursor-pointer"
            >
              <PlantCardModern
                plant={{
                  id: plant.id,
                  name: plant.commonName,
                  species: plant.species,
                  imageUrl: plant.imageUrl,
                  iconEmoji: plant.iconEmoji,
                  health: 100,
                  status: plant.difficulty,
                }}
                onDelete={() => {}}
                onClick={() => handleOpenDetails(plant)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Dialog de détails */}
      {selectedPlant && (
        <PlantLibraryDetailsDialogModern
          open={detailsDialogOpen}
          onClose={handleCloseDetails}
          plantId={selectedPlant.id}
          plantName={selectedPlant.commonName || selectedPlant.species || ''}
        />
      )}
    </div>
  );
};

export default PlantLibraryNew;
