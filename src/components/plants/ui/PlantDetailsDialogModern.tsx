import React, { useState, useEffect } from 'react';
import { TaskDialogModern } from './TaskDialogModern';
import { plantService } from '../../../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [camInfo, setCamInfo] = useState<{ stream?: string; online?: boolean } | null>(null);
  const [capturing, setCapturing] = useState(false);
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


  const captureFromCam = async () => {
    setCapturing(true);
    try {
      const token = localStorage.getItem('virida_token');
      // Utilise le proxy API (évite CORS — le Pi fetche directement l'ESP32-CAM)
      const res = await fetch(`${API_BASE}/api/cameras/espcam-1/snapshot`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Snapshot impossible');
      const blob = await res.blob();
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedPhotoFile(file);
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error('Capture échouée:', e);
    }
    setCapturing(false);
  };

  const handleAddHistory = async () => {
    if (!plantId) return;
    setLoading(true);
    try {
      // 1. Créer le log en premier pour obtenir son ID
      let logId: string | undefined;
      if (newLogHeight || newLogLeafCount || newLogNotes) {
        const logPayload: any = {};
        if (newLogHeight) logPayload.height = parseFloat(newLogHeight);
        if (newLogLeafCount) logPayload.leafCount = parseInt(newLogLeafCount);
        if (newLogNotes) logPayload.notes = newLogNotes;
        const logRes = await plantService.createGrowthLog(plantId, logPayload);
        logId = logRes.data?.id;
      }

      // 2. Upload photo liée au log (growthLogId → relation DB persistante)
      let uploadedPhoto: any = null;
      if (selectedPhotoFile) {
        const caption = newPhotoCaption.trim() || newLogNotes.trim() || undefined;
        const photoRes = await plantService.uploadPhoto(plantId, selectedPhotoFile, caption, logId);
        uploadedPhoto = photoRes.data || photoRes;
      }

      // 3. Rafraîchir les listes
      fetchPhotos();
      fetchGrowthLogs();

      // Réinitialiser le formulaire
      setSelectedPhotoFile(null);
      if (photoPreviewUrl) { URL.revokeObjectURL(photoPreviewUrl); setPhotoPreviewUrl(null); }
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
      default: return 'text-[var(--text-secondary)]';
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
                      : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
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
                            className="px-4 py-2 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nom */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-[var(--text-secondary)] font-semibold mb-2 block">Nom</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                          />
                        ) : (
                          <p className="text-[var(--text-primary)] font-semibold">{name}</p>
                        )}
                      </div>

                      {/* Zone (lecture seule) */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-[var(--text-secondary)] font-semibold mb-2 block">Zone</label>
                        <p className="text-[var(--text-primary)] font-semibold">{zone || 'Non défini'}</p>
                      </div>

                      {/* Statut */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-[var(--text-secondary)] font-semibold mb-2 block">Statut</label>
                        {isEditing ? (
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
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
                        <label className="text-xs text-[var(--text-secondary)] font-semibold mb-2 block">Serre</label>
                        <p className="text-[var(--text-primary)] font-semibold">{greenhouseName || 'Non défini'}</p>
                      </div>

                      {/* Date de plantation (lecture seule) */}
                      <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                        <label className="text-xs text-[var(--text-secondary)] font-semibold mb-2 block">Date de plantation</label>
                        <p className="text-[var(--text-primary)] font-semibold">
                          {plantedAt ? new Date(plantedAt).toLocaleDateString('fr-FR') : 'Non défini'}
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
                      <label className="text-xs text-[var(--text-secondary)] font-semibold mb-2 block">Notes</label>
                      {isEditing ? (
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] resize-none"
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
                              <span className="text-sm text-[var(--text-secondary)]">Arrosage: {plant.optimalWatering}</span>
                            </div>
                          )}
                          {plant.optimalLight && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-orange-400">light_mode</span>
                              <span className="text-sm text-[var(--text-secondary)]">Lumière: {plant.optimalLight}</span>
                            </div>
                          )}
                          {plant.optimalTemp && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-red-400">thermostat</span>
                              <span className="text-sm text-[var(--text-secondary)]">Température: {plant.optimalTemp}</span>
                            </div>
                          )}
                          {plant.optimalPH && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-purple-400">science</span>
                              <span className="text-sm text-[var(--text-secondary)]">pH: {plant.optimalPH}</span>
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
                        <p className="text-[var(--text-secondary)]">Aucune tâche pour cette plante</p>
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
                                <p className="text-xs text-[var(--text-secondary)]">
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
                        onClick={async () => {
                          setShowAddHistory(!showAddHistory);
                          if (!showAddHistory) {
                            // Charger info caméra à l'ouverture du formulaire
                            try {
                              const token = localStorage.getItem('virida_token');
                              const r = await fetch(`${API_BASE}/api/cameras/espcam-1`, {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              const d = await r.json();
                              setCamInfo(d.data || null);
                            } catch { setCamInfo(null); }
                          }
                        }}
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
                        
                        {/* Vue caméra serre */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-[var(--text-secondary)] font-semibold">
                              📹 Caméra serre
                            </label>
                            {camInfo?.online ? (
                              <span className="text-xs text-[#2AD368] font-semibold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#2AD368] inline-block animate-pulse" />
                                Live
                              </span>
                            ) : (
                              <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                                Hors ligne
                              </span>
                            )}
                          </div>
                          <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black/40 h-48 flex items-center justify-center">
                            {camInfo?.online && camInfo?.stream ? (
                              <img
                                src={camInfo.stream}
                                alt="live"
                                className="w-full h-full object-cover"
                                onError={() => setCamInfo(prev => prev ? { ...prev, online: false } : null)}
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-2 opacity-40">
                                <span className="material-symbols-outlined text-4xl text-white">videocam_off</span>
                                <span className="text-xs text-white">Caméra indisponible</span>
                              </div>
                            )}
                            {/* Bouton capture en bas à droite */}
                            {camInfo?.online && (
                              <button
                                type="button"
                                onClick={captureFromCam}
                                disabled={capturing}
                                className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2AD368]/90 hover:bg-[#2AD368] text-[#052E1C] font-semibold text-sm transition-all disabled:opacity-60 shadow-lg"
                              >
                                {capturing ? (
                                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                                  </svg>
                                ) : (
                                  <span className="material-symbols-outlined text-base">photo_camera</span>
                                )}
                                {capturing ? 'Capture...' : 'Capturer'}
                              </button>
                            )}
                            {/* Indicateur snapshot pris */}
                            {selectedPhotoFile && !capturing && (
                              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60">
                                <span className="material-symbols-outlined text-[#2AD368] text-sm">check_circle</span>
                                <span className="text-xs text-white font-medium">Photo capturée</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Upload photo — zone cliquable avec preview */}
                        <div>
                          <label className="text-xs text-[var(--text-secondary)] font-semibold mb-2 block">
                            📷 Photo de la note <span className="font-normal opacity-60">(optionnel)</span>
                          </label>
                          <input
                            id="log-photo-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setSelectedPhotoFile(file);
                              const url = URL.createObjectURL(file);
                              setPhotoPreviewUrl(url);
                              e.target.value = '';
                            }}
                          />
                          {photoPreviewUrl ? (
                            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] h-48 group cursor-pointer"
                              onClick={() => document.getElementById('log-photo-input')?.click()}>
                              <img src={photoPreviewUrl} alt="preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                <span className="text-white text-sm font-semibold">Changer la photo</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  URL.revokeObjectURL(photoPreviewUrl);
                                  setSelectedPhotoFile(null);
                                  setPhotoPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500/80 transition-colors"
                              >
                                <span className="material-symbols-outlined text-white text-sm">close</span>
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-white text-xs truncate">{selectedPhotoFile?.name}</p>
                              </div>
                            </div>
                          ) : (
                            <label htmlFor="log-photo-input"
                              className="flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-[#2AD368]/60 hover:bg-[#2AD368]/5 transition-all cursor-pointer">
                              <span className="material-symbols-outlined text-[var(--text-tertiary)] text-3xl">add_photo_alternate</span>
                              <span className="text-xs text-[var(--text-secondary)]">Cliquer pour ajouter une photo</span>
                            </label>
                          )}

                          {/* Légende — visible seulement si photo sélectionnée */}
                          {selectedPhotoFile && (
                            <input
                              type="text"
                              value={newPhotoCaption}
                              onChange={(e) => setNewPhotoCaption(e.target.value)}
                              className="mt-2 w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#2AD368]"
                              placeholder="Légende (optionnel)..."
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Hauteur */}
                          <div>
                            <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Hauteur (cm)</label>
                            <input
                              type="number"
                              value={newLogHeight}
                              onChange={(e) => setNewLogHeight(e.target.value)}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                              placeholder="0"
                              min="0"
                              step="0.1"
                            />
                          </div>

                          {/* Nombre de feuilles */}
                          <div>
                            <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Nombre de feuilles</label>
                            <input
                              type="number"
                              value={newLogLeafCount}
                              onChange={(e) => setNewLogLeafCount(e.target.value)}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Notes</label>
                          <textarea
                            value={newLogNotes}
                            onChange={(e) => setNewLogNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] resize-none"
                            placeholder="Observations..."
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setShowAddHistory(false);
                              setSelectedPhotoFile(null);
                              if (photoPreviewUrl) { URL.revokeObjectURL(photoPreviewUrl); setPhotoPreviewUrl(null); }
                              setNewPhotoCaption('');
                              setNewLogHeight('');
                              setNewLogLeafCount('');
                              setNewLogNotes('');
                            }}
                            className="px-4 py-2 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] transition-all"
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
                          {growthLogs.map((log: any) => {
                            const logDate = log.timestamp || log.recordedAt || log.createdAt
                            const linkedPhoto = log.plant_photos?.[0]
                            return (
                              <div key={log.id} className="glass-card backdrop-blur-xl rounded-2xl border border-[var(--border-color)] overflow-hidden">
                                {/* Photo liée au log */}
                                {linkedPhoto && (
                                  <div className="relative h-40 bg-black/30">
                                    <img
                                      src={`${API_BASE}${linkedPhoto.url}`}
                                      alt={linkedPhoto.caption || 'Photo'}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <span className="absolute bottom-2 left-3 text-xs text-white/70 font-medium">📷 Photo serre</span>
                                  </div>
                                )}
                                <div className="p-4">
                                  <div className="flex justify-between items-start mb-3">
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {logDate ? new Date(logDate).toLocaleDateString('fr-FR', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                      }) : '—'}
                                    </p>
                                    <button
                                      onClick={async () => {
                                        await plantService.deleteGrowthLog(plantId!, log.id)
                                        setGrowthLogs(prev => prev.filter((l: any) => l.id !== log.id))
                                      }}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                      title="Supprimer"
                                    >
                                      <span className="material-symbols-outlined text-base">delete</span>
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {log.height != null && (
                                      <span className="px-2 py-1 rounded-lg bg-[#CBED62]/10 border border-[#CBED62]/30 text-[#CBED62] text-xs font-semibold">
                                        ↕ {log.height} cm
                                      </span>
                                    )}
                                    {log.leafCount != null && (
                                      <span className="px-2 py-1 rounded-lg bg-[#2AD368]/10 border border-[#2AD368]/30 text-[#2AD368] text-xs font-semibold">
                                        🌿 {log.leafCount} feuilles
                                      </span>
                                    )}
                                    {log.fruitCount != null && (
                                      <span className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                                        🍅 {log.fruitCount} fruits
                                      </span>
                                    )}
                                    {log.eventType && (
                                      <span className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                                        {log.eventType}
                                      </span>
                                    )}
                                  </div>
                                  {log.notes && (
                                    <p className="text-sm text-[var(--text-secondary)] italic">{log.notes}</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Message si vide */}
                    {photos.length === 0 && growthLogs.length === 0 && !showAddHistory && (
                      <div className="text-center py-12">
                        <span className="material-symbols-outlined text-[var(--text-tertiary)] text-6xl mb-4">history</span>
                        <p className="text-[var(--text-secondary)]">Aucune entrée d'historique</p>
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
                            <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Quantité</label>
                            <input
                              type="number"
                              value={newHarvestQuantity}
                              onChange={(e) => setNewHarvestQuantity(e.target.value)}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                              placeholder="0"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Unité</label>
                            <select
                              value={newHarvestUnit}
                              onChange={(e) => setNewHarvestUnit(e.target.value)}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                            >
                              <option value="kg">Kilogrammes (kg)</option>
                              <option value="g">Grammes (g)</option>
                              <option value="lb">Livres (lb)</option>
                              <option value="unités">Unités</option>
                              <option value="pièces">Pièces</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Qualité</label>
                            <select
                              value={newHarvestQuality}
                              onChange={(e) => setNewHarvestQuality(e.target.value)}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                            >
                              <option value="EXCELLENT">Excellente</option>
                              <option value="GOOD">Bonne</option>
                              <option value="FAIR">Moyenne</option>
                              <option value="POOR">Faible</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Date</label>
                            <input
                              type="date"
                              value={newHarvestDate}
                              onChange={(e) => setNewHarvestDate(e.target.value)}
                              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-[var(--text-secondary)] font-semibold mb-1 block">Notes</label>
                          <textarea
                            value={newHarvestNotes}
                            onChange={(e) => setNewHarvestNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2AD368] resize-none"
                            placeholder="Observations..."
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setShowAddHarvest(false)}
                            className="px-4 py-2 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] transition-all"
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
                        <p className="text-[var(--text-secondary)]">Aucune récolte enregistrée</p>
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
                                <p className="text-xs text-[var(--text-secondary)]">
                                  {new Date(harvest.harvestedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                                {harvest.notes && (
                                  <p className="text-sm text-[var(--text-secondary)] mt-2">{harvest.notes}</p>
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
              className="px-4 md:px-6 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] transition-all"
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
