import React, { useState, useEffect } from 'react';
import { TaskDialogModern } from './TaskDialogModern';
import { plantService } from '../../../services/api';

interface PlantDetailsDialogModernProps {
  open: boolean;
  onClose: () => void;
  plantId: string | null;
  onPlantUpdated: () => void;
  onPlantDeleted: () => void;
}

export const PlantDetailsDialogModern: React.FC<PlantDetailsDialogModernProps> = ({
  open,
  onClose,
  plantId,
  onPlantUpdated,
  onPlantDeleted,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plant, setPlant] = useState<any>(null);

  // Form fields
  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [greenhouse, setGreenhouse] = useState('');
  const [greenhouseName, setGreenhouseName] = useState('');
  const [plantedAt, setPlantedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('PLANTED');

  // Tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Growth history
  const [photos, setPhotos] = useState<any[]>([]);
  const [growthLogs, setGrowthLogs] = useState<any[]>([]);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newLogHeight, setNewLogHeight] = useState('');
  const [newLogLeafCount, setNewLogLeafCount] = useState('');
  const [newLogNotes, setNewLogNotes] = useState('');

  // Harvests
  const [harvests, setHarvests] = useState<any[]>([]);
  const [showAddHarvest, setShowAddHarvest] = useState(false);
  const [newHarvestQuantity, setNewHarvestQuantity] = useState('');
  const [newHarvestUnit, setNewHarvestUnit] = useState('kg');
  const [newHarvestQuality, setNewHarvestQuality] = useState('GOOD');
  const [newHarvestNotes, setNewHarvestNotes] = useState('');
  const [newHarvestDate, setNewHarvestDate] = useState(new Date().toISOString().split('T')[0]);

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (open && plantId) {
      fetchPlantDetails();
      fetchTasks();
      fetchPhotos();
      fetchGrowthLogs();
      fetchHarvests();
    }
  }, [open, plantId]);

  const fetchPlantDetails = async () => {
    if (!plantId) return;
    setLoading(true);
    try {
      const response = await plantService.getPlant(plantId);
      const plantData = (response as any).data || response;
      setPlant(plantData);
      setName(plantData.name || '');
      setZone(plantData.zone || '');
      setGreenhouse(plantData.greenhouses?.id || plantData.greenhouse?.id || '');
      setGreenhouseName(plantData.greenhouses?.name || plantData.greenhouse?.name || '');
      setPlantedAt(plantData.plantedAt ? new Date(plantData.plantedAt).toISOString().split('T')[0] : '');
      setNotes(plantData.notes || '');
      setStatus(plantData.status || 'PLANTED');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!plantId) return;
    try {
      const data = await plantService.getAllTasks({ plantId });
      const tasksList = data.data || data.tasks || [];
      setTasks(tasksList);
    } catch (error) {
      console.error('Erreur fetch tasks:', error);
    }
  };

  const fetchPhotos = async () => {
    if (!plantId) return;
    try {
      const data = await plantService.getPhotos(plantId);
      setPhotos(data.data.photos || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchGrowthLogs = async () => {
    if (!plantId) return;
    try {
      const data = await plantService.getGrowthLogs(plantId);
      setGrowthLogs(data.data.logs || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchHarvests = async () => {
    if (!plantId) return;
    try {
      const data = await plantService.getHarvests(plantId);
      setHarvests(data.data.harvests || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSave = async () => {
    if (!plantId) return;
    setLoading(true);
    try {
      await plantService.updatePlant(plantId, { name, notes, status } as any);
      setIsEditing(false);
      fetchPlantDetails();
      onPlantUpdated();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!plantId || !confirm('Êtes-vous sûr de vouloir supprimer cette plante ?')) return;
    try {
      await plantService.deletePlant(plantId);
      onPlantDeleted();
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCompleteTask = async (taskId: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        await plantService.uncompleteTask(taskId);
      } else {
        await plantService.completeTask(taskId);
      }
      fetchTasks();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Supprimer cette tâche ?')) return;
    try {
      await plantService.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddHarvest = async () => {
    if (!plantId || !newHarvestQuantity) return;
    setLoading(true);
    try {
      await plantService.createHarvest(plantId, {
        quantity: parseFloat(newHarvestQuantity),
        unit: newHarvestUnit,
        quality: newHarvestQuality,
        notes: newHarvestNotes.trim() || undefined,
        harvestedAt: new Date(newHarvestDate).toISOString(),
      });
      fetchHarvests();
      setNewHarvestQuantity('');
      setNewHarvestUnit('kg');
      setNewHarvestQuality('GOOD');
      setNewHarvestNotes('');
      setNewHarvestDate(new Date().toISOString().split('T')[0]);
      setShowAddHarvest(false);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHarvest = async (harvestId: string) => {
    if (!plantId || !confirm('Supprimer cette récolte ?')) return;
    try {
      // deleteHarvest n'existe pas côté backend
      console.warn('Suppression de récolte non supportée par le backend');
      fetchHarvests();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddHistory = async () => {
    if (!plantId) return;
    setLoading(true);
    try {
      // Upload photo si présente
      if (selectedPhotoFile) {
        await plantService.uploadPhoto(plantId, selectedPhotoFile);
      }

      // Ajouter log de croissance si des données sont présentes
      if (newLogHeight || newLogLeafCount || newLogNotes) {
        const logPayload: any = {};
        if (newLogHeight) logPayload.height = parseFloat(newLogHeight);
        if (newLogLeafCount) logPayload.leafCount = parseInt(newLogLeafCount);
        if (newLogNotes) logPayload.notes = newLogNotes;
        await plantService.createGrowthLog(plantId, logPayload);
      }

      // Rafraîchir les données
      fetchPhotos();
      fetchGrowthLogs();

      // Réinitialiser le formulaire
      setSelectedPhotoFile(null);
      setNewPhotoCaption('');
      setNewLogHeight('');
      setNewLogLeafCount('');
      setNewLogNotes('');
      setShowAddHistory(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'entrée d\'historique');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !plant) return null;

  const tabs = [
    { id: 0, label: 'Vue d\'ensemble', icon: 'info' },
    { id: 1, label: 'Soins', icon: 'spa' },
    { id: 2, label: 'Historique', icon: 'history' },
    { id: 3, label: 'Récoltes', icon: 'agriculture' },
  ];

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-[#2AD368]';
    if (health >= 70) return 'text-[#CBED62]';
    if (health >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PLANTED': 'Planté',
      'GROWING': 'En croissance',
      'FLOWERING': 'En floraison',
      'FRUITING': 'En fructification',
      'HARVESTED': 'Récolté',
      'DORMANT': 'Dormant',
      'DEAD': 'Mort',
    };
    return labels[status] || status;
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'WATERING': return 'water_drop';
      case 'FERTILIZING': return 'grass';
      case 'PRUNING': return 'content_cut';
      case 'PEST_CONTROL': return 'bug_report';
      default: return 'task';
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'WATERING': return 'text-blue-400';
      case 'FERTILIZING': return 'text-[#CBED62]';
      case 'PRUNING': return 'text-orange-400';
      case 'PEST_CONTROL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/60 dark:bg-black/60 backdrop-blur-sm">
        <div className="bg-[var(--bg-secondary)] backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-2 border-[#2AD368]/20 shadow-2xl flex flex-col">
          {/* Header avec image */}
          <div className="relative">
            <div className="h-48 md:h-64 bg-gradient-to-br from-[#1a1f26] to-[#0a0f14] relative overflow-hidden">
              {plant.imageUrl ? (
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover opacity-40"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl md:text-9xl opacity-20">{plant.iconEmoji || '🌱'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121A21] via-[#121A21]/60 to-transparent" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-[var(--text-primary)] hover:bg-black/60 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Plant info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex items-end justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2 truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {plant.name}
                  </h2>
                  <p className="text-sm md:text-base text-white/90 italic truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {plant.species}
                  </p>
                </div>
                
                {plant.health !== undefined && (
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-white/80 mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Santé</p>
                    <p className={`text-3xl md:text-4xl font-black ${getHealthColor(plant.health)}`}>
                      {plant.health}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border-color)] px-4 md:px-6 bg-[var(--bg-primary)]">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-semibold text-sm md:text-base whitespace-nowrap transition-all border-b-2 flex-shrink-0 ${
                    currentTab === tab.id
                      ? 'text-[#2AD368] border-[#2AD368]'
                      : 'text-gray-400 border-transparent hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            {loading && currentTab === 0 ? (
              <div className="flex justify-center py-12">
                <div className="size-12 border-4 border-[#2AD368] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Tab 0: Vue d'ensemble */}
                {currentTab === 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">Informations</h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 rounded-xl bg-[#2AD368]/10 border border-[#2AD368]/30 text-[#2AD368] font-semibold hover:bg-[#2AD368]/20 transition-all flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                          <span>Modifier</span>
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">save</span>
                            <span>Sauvegarder</span>
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-gray-300 font-semibold hover:text-[var(--text-primary)] transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nom */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-gray-400 mb-2 block">Nom</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                          />
                        ) : (
                          <p className="text-[var(--text-primary)] font-semibold">{name}</p>
                        )}
                      </div>

                      {/* Zone (lecture seule) */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-gray-400 mb-2 block">Zone</label>
                        <p className="text-[var(--text-primary)] font-semibold">{zone || 'Non défini'}</p>
                      </div>

                      {/* Statut */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-gray-400 mb-2 block">Statut</label>
                        {isEditing ? (
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                          >
                            <option value="PLANTED">Planté</option>
                            <option value="GROWING">En croissance</option>
                            <option value="FLOWERING">En floraison</option>
                            <option value="FRUITING">En fructification</option>
                            <option value="HARVESTED">Récolté</option>
                            <option value="DORMANT">Dormant</option>
                            <option value="DEAD">Mort</option>
                          </select>
                        ) : (
                          <p className="text-[var(--text-primary)] font-semibold">{getStatusLabel(status)}</p>
                        )}
                      </div>

                      {/* Serre (lecture seule) */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-gray-400 mb-2 block">Serre</label>
                        <p className="text-[var(--text-primary)] font-semibold">{greenhouseName || 'Non défini'}</p>
                      </div>

                      {/* Date de plantation (lecture seule) */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-gray-400 mb-2 block">Date de plantation</label>
                        <p className="text-[var(--text-primary)] font-semibold">
                          {plantedAt ? new Date(plantedAt).toLocaleDateString('fr-FR') : 'Non défini'}
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                      <label className="text-xs text-gray-400 mb-2 block">Notes</label>
                      {isEditing ? (
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] resize-none"
                        />
                      ) : (
                        <p className="text-[var(--text-primary)]">{notes || 'Aucune note'}</p>
                      )}
                    </div>

                    {/* Conditions optimales */}
                    {(plant.optimalWatering || plant.optimalLight || plant.optimalTemp || plant.optimalPH) && (
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <h4 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#2AD368]">eco</span>
                          Conditions optimales
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {plant.optimalWatering && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-blue-400">water_drop</span>
                              <span className="text-sm text-gray-300">Arrosage: {plant.optimalWatering}</span>
                            </div>
                          )}
                          {plant.optimalLight && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-orange-400">light_mode</span>
                              <span className="text-sm text-gray-300">Lumière: {plant.optimalLight}</span>
                            </div>
                          )}
                          {plant.optimalTemp && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-red-400">thermostat</span>
                              <span className="text-sm text-gray-300">Température: {plant.optimalTemp}</span>
                            </div>
                          )}
                          {plant.optimalPH && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-purple-400">science</span>
                              <span className="text-sm text-gray-300">pH: {plant.optimalPH}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 1: Soins (Tâches) */}
                {currentTab === 1 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">Tâches de soins</h3>
                      <button
                        onClick={() => {
                          setSelectedTaskId(null);
                          setTaskDialogOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Nouvelle tâche</span>
                      </button>
                    </div>

                    {tasks.length === 0 ? (
                      <div className="text-center py-12">
                        <span className="material-symbols-outlined text-[var(--text-tertiary)] text-6xl mb-4">task</span>
                        <p className="text-gray-400">Aucune tâche pour cette plante</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleCompleteTask(task.id, task.completed)}
                                className={`size-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  task.completed
                                    ? 'border-[#2AD368] bg-[#2AD368]/20'
                                    : 'border-white/30 hover:border-[#2AD368]'
                                }`}
                              >
                                {task.completed && (
                                  <span className="material-symbols-outlined text-[#2AD368] text-lg">check</span>
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`material-symbols-outlined text-lg ${getTaskColor(task.type)}`}>
                                    {getTaskIcon(task.type)}
                                  </span>
                                  <h4 className="text-[var(--text-primary)] font-semibold">{task.description}</h4>
                                </div>
                                <p className="text-xs text-gray-400">
                                  {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Historique */}
                {currentTab === 2 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">Historique de croissance</h3>
                      <button
                        onClick={() => setShowAddHistory(!showAddHistory)}
                        className="px-4 py-2 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Ajouter une entrée</span>
                      </button>
                    </div>

                    {/* Formulaire d'ajout */}
                    {showAddHistory && (
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] space-y-3">
                        <h4 className="font-bold text-[var(--text-primary)]">Nouvelle entrée d'historique</h4>
                        
                        {/* Upload photo */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Photo</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedPhotoFile(file);
                            }}
                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2AD368] file:text-[var(--btn-primary-text)] file:font-semibold file:shadow-[0_4px_10px_rgba(42,211,104,0.3)] hover:file:shadow-[0_6px_15px_rgba(42,211,104,0.5)]"
                          />
                          {selectedPhotoFile && (
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                              {selectedPhotoFile.name} ({(selectedPhotoFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>

                        {/* Légende */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Légende de la photo</label>
                          <input
                            type="text"
                            value={newPhotoCaption}
                            onChange={(e) => setNewPhotoCaption(e.target.value)}
                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                            placeholder="Description..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Hauteur */}
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Hauteur (cm)</label>
                            <input
                              type="number"
                              value={newLogHeight}
                              onChange={(e) => setNewLogHeight(e.target.value)}
                              className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                              placeholder="0"
                              min="0"
                              step="0.1"
                            />
                          </div>

                          {/* Nombre de feuilles */}
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Nombre de feuilles</label>
                            <input
                              type="number"
                              value={newLogLeafCount}
                              onChange={(e) => setNewLogLeafCount(e.target.value)}
                              className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                          <textarea
                            value={newLogNotes}
                            onChange={(e) => setNewLogNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] resize-none"
                            placeholder="Observations..."
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setShowAddHistory(false);
                              setSelectedPhotoFile(null);
                              setNewPhotoCaption('');
                              setNewLogHeight('');
                              setNewLogLeafCount('');
                              setNewLogNotes('');
                            }}
                            className="px-4 py-2 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-gray-300 font-semibold hover:text-[var(--text-primary)] transition-all"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleAddHistory}
                            disabled={loading}
                            className="px-4 py-2 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all disabled:opacity-50"
                          >
                            {loading ? 'Ajout...' : 'Ajouter'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Photos */}
                    {photos.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#2AD368]">photo_library</span>
                          Photos
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {photos.map((photo: any) => (
                            <div key={photo.id} className="glass-card backdrop-blur-xl rounded-2xl overflow-hidden border border-[var(--border-color)]">
                              <img
                                src={photo.url}
                                alt={photo.caption || 'Photo'}
                                className="w-full h-32 object-cover"
                              />
                              {photo.caption && (
                                <div className="p-2">
                                  <p className="text-xs text-gray-300">{photo.caption}</p>
                                  <p className="text-xs text-[var(--text-tertiary)]">
                                    {new Date(photo.createdAt).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Logs de croissance */}
                    {growthLogs.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#2AD368]">trending_up</span>
                          Logs de croissance
                        </h4>
                        <div className="space-y-3">
                          {growthLogs.map((log: any) => (
                            <div key={log.id} className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-400">
                                  {new Date(log.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-2">
                                {log.height && (
                                  <div>
                                    <p className="text-xs text-gray-400">Hauteur</p>
                                    <p className="text-[var(--text-primary)] font-semibold">{log.height} cm</p>
                                  </div>
                                )}
                                {log.leafCount && (
                                  <div>
                                    <p className="text-xs text-gray-400">Feuilles</p>
                                    <p className="text-[var(--text-primary)] font-semibold">{log.leafCount}</p>
                                  </div>
                                )}
                              </div>
                              {log.notes && (
                                <p className="text-sm text-gray-300">{log.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message si vide */}
                    {photos.length === 0 && growthLogs.length === 0 && !showAddHistory && (
                      <div className="text-center py-12">
                        <span className="material-symbols-outlined text-[var(--text-tertiary)] text-6xl mb-4">history</span>
                        <p className="text-gray-400">Aucune entrée d'historique</p>
                        <p className="text-xs text-white/80 mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Commencez à documenter la croissance de votre plante</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Récoltes */}
                {currentTab === 3 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">Récoltes</h3>
                      <button
                        onClick={() => setShowAddHarvest(!showAddHarvest)}
                        className="px-4 py-2 rounded-xl bg-[#2AD368] text-[var(--btn-primary-text)] font-semibold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Ajouter</span>
                      </button>
                    </div>

                    {/* Formulaire d'ajout */}
                    {showAddHarvest && (
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)] space-y-3">
                        <h4 className="font-bold text-[var(--text-primary)]">Nouvelle récolte</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Quantité</label>
                            <input
                              type="number"
                              value={newHarvestQuantity}
                              onChange={(e) => setNewHarvestQuantity(e.target.value)}
                              className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                              placeholder="0"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Unité</label>
                            <select
                              value={newHarvestUnit}
                              onChange={(e) => setNewHarvestUnit(e.target.value)}
                              className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                            >
                              <option value="kg">Kilogrammes (kg)</option>
                              <option value="g">Grammes (g)</option>
                              <option value="lb">Livres (lb)</option>
                              <option value="unités">Unités</option>
                              <option value="pièces">Pièces</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Qualité</label>
                            <select
                              value={newHarvestQuality}
                              onChange={(e) => setNewHarvestQuality(e.target.value)}
                              className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                            >
                              <option value="EXCELLENT">Excellente</option>
                              <option value="GOOD">Bonne</option>
                              <option value="FAIR">Moyenne</option>
                              <option value="POOR">Faible</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Date</label>
                            <input
                              type="date"
                              value={newHarvestDate}
                              onChange={(e) => setNewHarvestDate(e.target.value)}
                              className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                          <textarea
                            value={newHarvestNotes}
                            onChange={(e) => setNewHarvestNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] resize-none"
                            placeholder="Observations..."
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setShowAddHarvest(false)}
                            className="px-4 py-2 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-gray-300 font-semibold hover:text-[var(--text-primary)] transition-all"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleAddHarvest}
                            disabled={loading || !newHarvestQuantity}
                            className="px-4 py-2 rounded-xl bg-[#2AD368] text-[#121A21] font-semibold hover:bg-[#1fc75c] transition-all disabled:opacity-50"
                          >
                            {loading ? 'Ajout...' : 'Ajouter'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Liste des récoltes */}
                    {harvests.length === 0 ? (
                      <div className="text-center py-12">
                        <span className="material-symbols-outlined text-[var(--text-tertiary)] text-6xl mb-4">agriculture</span>
                        <p className="text-gray-400">Aucune récolte enregistrée</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {harvests.map((harvest) => (
                          <div
                            key={harvest.id}
                            className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-[var(--text-primary)] font-bold text-lg">
                                  {harvest.quantity} {harvest.unit}
                                </h4>
                                <p className="text-xs text-gray-400">
                                  {new Date(harvest.harvestedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                                {harvest.notes && (
                                  <p className="text-sm text-gray-300 mt-2">{harvest.notes}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  harvest.quality === 'EXCELLENT' ? 'bg-[#2AD368]/20 text-[#2AD368]' :
                                  harvest.quality === 'GOOD' ? 'bg-blue-500/20 text-blue-400' :
                                  harvest.quality === 'FAIR' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {harvest.quality === 'EXCELLENT' ? 'Excellente' :
                                   harvest.quality === 'GOOD' ? 'Bonne' :
                                   harvest.quality === 'FAIR' ? 'Moyenne' : 'Faible'}
                                </span>
                                <button
                                  onClick={() => handleDeleteHarvest(harvest.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[var(--border-color)] p-4 md:p-6 flex flex-wrap gap-3 justify-between bg-[var(--bg-primary)]">
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              <span className="hidden sm:inline">Supprimer</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-4 md:px-6 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-gray-300 font-semibold hover:text-[var(--text-primary)] transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      {plantId && (
        <TaskDialogModern
          open={taskDialogOpen}
          onClose={() => setTaskDialogOpen(false)}
          plantId={plantId}
          taskId={selectedTaskId}
          onTaskSaved={() => {
            fetchTasks();
            setTaskDialogOpen(false);
          }}
        />
      )}
    </>
  );
};
