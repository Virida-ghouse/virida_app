import React, { useState, useEffect } from 'react';
import { useViridaStore } from '../../../store/useViridaStore';

interface TaskDialogModernProps {
  open: boolean;
  onClose: () => void;
  plantId: string;
  taskId?: string | null;
  onTaskSaved: () => void;
}

export const TaskDialogModern: React.FC<TaskDialogModernProps> = ({
  open,
  onClose,
  plantId,
  taskId,
  onTaskSaved,
}) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [loading, setLoading] = useState(false);

  const [taskType, setTaskType] = useState('WATERING');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    if (open && taskId) {
      fetchTaskDetails();
    } else if (open && !taskId) {
      resetForm();
    }
  }, [open, taskId]);

  const resetForm = () => {
    setTaskType('WATERING');
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setFrequencyDays('');
    setPriority('MEDIUM');
    setStatus('PENDING');
  };

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plant-tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const task = data.data;
        setTaskType(task.taskType || 'WATERING');
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setFrequencyDays(task.frequencyDays ? task.frequencyDays.toString() : '');
        setPriority(task.priority || 'MEDIUM');
        setStatus(task.status || 'PENDING');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Veuillez entrer un titre pour la tâche');
      return;
    }
    if (!dueDate) {
      alert('Veuillez entrer une date d\'échéance');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('virida_token');
      const createPayload: any = {
        plantId,
        type: taskType,
        description: title,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        recurring: false,
      };

      if (description && description.trim()) {
        createPayload.notes = description.trim();
      }

      if (frequencyDays && frequencyDays.trim()) {
        const interval = parseInt(frequencyDays);
        if (!isNaN(interval) && interval > 0) {
          createPayload.recurring = true;
          createPayload.recurringInterval = interval;
        }
      }

      const updatePayload = { ...createPayload, status };
      const url = taskId ? `${apiUrl}/api/plant-tasks/${taskId}` : `${apiUrl}/api/plant-tasks`;
      const method = taskId ? 'PUT' : 'POST';
      const payload = taskId ? updatePayload : createPayload;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onTaskSaved();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        console.error('❌ Erreur serveur:', error);
        if (error.details && Array.isArray(error.details)) {
          const errorMessages = error.details.map((e: any) => `• ${e.msg} (${e.param})`).join('\n');
          alert(`Erreur de validation:\n${errorMessages}`);
        } else {
          alert('Erreur lors de la sauvegarde de la tâche');
        }
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      alert('Erreur de connexion lors de la sauvegarde de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    if (!taskId) resetForm();
  };

  const getTaskTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'WATERING': 'Arrosage',
      'FERTILIZING': 'Fertilisation',
      'PRUNING': 'Taille',
      'HARVESTING': 'Récolte',
      'PEST_CONTROL': 'Contrôle des nuisibles',
      'REPOTTING': 'Rempotage',
      'PH_ADJUSTMENT': 'Ajustement pH',
    };
    return labels[type] || type;
  };

  const getTaskTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'WATERING': 'water_drop',
      'FERTILIZING': 'eco',
      'PRUNING': 'content_cut',
      'HARVESTING': 'agriculture',
      'PEST_CONTROL': 'pest_control',
      'REPOTTING': 'potted_plant',
      'PH_ADJUSTMENT': 'science',
    };
    return icons[type] || 'task';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-2 border-[#2AD368]/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 md:p-6 bg-gradient-to-r from-[#052E1C] to-[#121A21]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2AD368]">task_alt</span>
              {taskId ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4">
          {/* Type de tâche */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Type de tâche *</label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#2AD368] transition-all"
            >
              <option value="WATERING">{getTaskTypeLabel('WATERING')}</option>
              <option value="FERTILIZING">{getTaskTypeLabel('FERTILIZING')}</option>
              <option value="PRUNING">{getTaskTypeLabel('PRUNING')}</option>
              <option value="HARVESTING">{getTaskTypeLabel('HARVESTING')}</option>
              <option value="PEST_CONTROL">{getTaskTypeLabel('PEST_CONTROL')}</option>
              <option value="REPOTTING">{getTaskTypeLabel('REPOTTING')}</option>
              <option value="PH_ADJUSTMENT">{getTaskTypeLabel('PH_ADJUSTMENT')}</option>
            </select>
          </div>

          {/* Titre */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Arroser les tomates"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2AD368] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Ajoutez des détails sur cette tâche..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2AD368] transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date d'échéance */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Date d'échéance *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#2AD368] transition-all"
              />
            </div>

            {/* Fréquence */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Fréquence (jours)</label>
              <input
                type="number"
                value={frequencyDays}
                onChange={(e) => setFrequencyDays(e.target.value)}
                placeholder="Ex: 7 pour chaque semaine"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2AD368] transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Laissez vide pour une tâche unique</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priorité */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#2AD368] transition-all"
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
              </select>
            </div>

            {/* Statut (seulement en édition) */}
            {taskId && (
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-[#2AD368] transition-all"
                >
                  <option value="PENDING">En attente</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Terminée</option>
                  <option value="SKIPPED">Ignorée</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 md:p-6 flex flex-wrap gap-3 justify-end bg-[#121A21]/50">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-white/10 text-gray-300 font-semibold hover:text-white transition-all disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#2AD368] text-[#121A21] font-semibold hover:bg-[#1fc75c] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">
              {loading ? 'progress_activity' : 'check'}
            </span>
            <span>{loading ? 'Enregistrement...' : taskId ? 'Mettre à jour' : 'Créer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
