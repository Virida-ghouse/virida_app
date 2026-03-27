import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { plantService } from '../../../services/api';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  plantId: string;
  taskId?: string | null;
  onTaskSaved: () => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onClose,
  plantId,
  taskId,
  onTaskSaved,
}) => {
  const [loading, setLoading] = useState(false);

  // Form fields
  const [taskType, setTaskType] = useState('WATERING');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequencyDays, setFrequencyDays] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PENDING');

  // Charger les données de la tâche si on édite
  useEffect(() => {
    if (open && taskId) {
      fetchTaskDetails();
    } else if (open && !taskId) {
      // Nouvelle tâche - réinitialiser les champs
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
      const data = await plantService.getTaskById(taskId);
      const task = data.data;

      setTaskType(task.taskType || 'WATERING');
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setFrequencyDays(task.frequencyDays ? task.frequencyDays.toString() : '');
      setPriority(task.priority || 'MEDIUM');
      setStatus(task.status || 'PENDING');
    } catch (error) {
      console.error('Erreur lors du chargement de la tâche:', error);
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
      // Construire le payload de base
      const createPayload: any = {
        plantId,
        type: taskType,
        description: title,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        recurring: false,
      };

      // Ajouter les champs optionnels seulement s'ils ont des valeurs valides
      if (description && description.trim()) {
        createPayload.notes = description.trim();
      }

      // Gérer la récurrence
      if (frequencyDays && frequencyDays.trim()) {
        const interval = parseInt(frequencyDays);
        if (!isNaN(interval) && interval > 0) {
          createPayload.recurring = true;
          createPayload.recurringInterval = interval;
        }
      }

      // Payload pour mise à jour (PUT)
      const updatePayload = {
        ...createPayload,
        status,
      };

      const payload = taskId ? updatePayload : createPayload;

      if (taskId) {
        await plantService.updateStandaloneTask(taskId, payload);
      } else {
        await plantService.createStandaloneTask(payload);
      }

      onTaskSaved();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Erreur sauvegarde tâche:', error);
      if (error?.data?.details && Array.isArray(error.data.details)) {
        const errorMessages = error.data.details.map((e: any) => `• ${e.msg} (${e.param})`).join('\n');
        alert(`Erreur de validation:\n${errorMessages}`);
      } else {
        alert('Erreur lors de la sauvegarde de la tâche');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    if (!taskId) {
      resetForm();
    }
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

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      'LOW': 'Basse',
      'MEDIUM': 'Moyenne',
      'HIGH': 'Haute',
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'En attente',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée',
      'SKIPPED': 'Ignorée',
    };
    return labels[status] || status;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: 10000,
      }}
      PaperProps={{
        sx: {
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 600,
        }}
      >
        {taskId ? 'Modifier la tâche' : 'Nouvelle tâche'}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel>Type de tâche</InputLabel>
            <Select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              label="Type de tâche"
            >
              <MenuItem value="WATERING">{getTaskTypeLabel('WATERING')}</MenuItem>
              <MenuItem value="FERTILIZING">{getTaskTypeLabel('FERTILIZING')}</MenuItem>
              <MenuItem value="PRUNING">{getTaskTypeLabel('PRUNING')}</MenuItem>
              <MenuItem value="HARVESTING">{getTaskTypeLabel('HARVESTING')}</MenuItem>
              <MenuItem value="PEST_CONTROL">{getTaskTypeLabel('PEST_CONTROL')}</MenuItem>
              <MenuItem value="REPOTTING">{getTaskTypeLabel('REPOTTING')}</MenuItem>
              <MenuItem value="PH_ADJUSTMENT">{getTaskTypeLabel('PH_ADJUSTMENT')}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ex: Arroser les tomates"
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            placeholder="Ajoutez des détails sur cette tâche..."
          />

          <TextField
            fullWidth
            label="Date d'échéance"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Fréquence (jours)"
            type="number"
            value={frequencyDays}
            onChange={(e) => setFrequencyDays(e.target.value)}
            placeholder="Ex: 7 pour répéter chaque semaine"
            helperText="Laissez vide pour une tâche unique"
          />

          <FormControl fullWidth>
            <InputLabel>Priorité</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priorité"
            >
              <MenuItem value="LOW">{getPriorityLabel('LOW')}</MenuItem>
              <MenuItem value="MEDIUM">{getPriorityLabel('MEDIUM')}</MenuItem>
              <MenuItem value="HIGH">{getPriorityLabel('HIGH')}</MenuItem>
            </Select>
          </FormControl>

          {taskId && (
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Statut"
              >
                <MenuItem value="PENDING">{getStatusLabel('PENDING')}</MenuItem>
                <MenuItem value="IN_PROGRESS">{getStatusLabel('IN_PROGRESS')}</MenuItem>
                <MenuItem value="COMPLETED">{getStatusLabel('COMPLETED')}</MenuItem>
                <MenuItem value="SKIPPED">{getStatusLabel('SKIPPED')}</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !title.trim()}
          sx={{
            bgcolor: '#052E1C',
            '&:hover': { bgcolor: '#041E13' },
          }}
        >
          {loading ? 'Enregistrement...' : taskId ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
