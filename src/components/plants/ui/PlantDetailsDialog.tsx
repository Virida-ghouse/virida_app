import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  Grid,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  WaterDrop,
  WbSunny,
  Thermostat,
  Science,
  CalendarMonth,
  PhotoCamera,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle,
  MoreVert,
} from '@mui/icons-material';
import { useViridaStore } from '../../../store/useViridaStore';
import { TaskDialog } from './TaskDialog';

interface PlantDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  plantId: string | null;
  onPlantUpdated: () => void;
  onPlantDeleted: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plant-tabpanel-${index}`}
      aria-labelledby={`plant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export const PlantDetailsDialog: React.FC<PlantDetailsDialogProps> = ({
  open,
  onClose,
  plantId,
  onPlantUpdated,
  onPlantDeleted,
}) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [tabValue, setTabValue] = useState(0);
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

  // Tasks management
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Growth history management
  const [photos, setPhotos] = useState<any[]>([]);
  const [growthLogs, setGrowthLogs] = useState<any[]>([]);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newLogHeight, setNewLogHeight] = useState('');
  const [newLogLeafCount, setNewLogLeafCount] = useState('');
  const [newLogNotes, setNewLogNotes] = useState('');

  // Harvest management
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

  // Fetch plant details
  useEffect(() => {
    if (open && plantId) {
      fetchPlantDetails();
      fetchTasks();
    }
  }, [open, plantId]);

  const fetchPlantDetails = async () => {
    if (!plantId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plants/${plantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const plantData = data.data;
        setPlant(plantData);

        // Initialize form fields
        setName(plantData.name || '');
        setZone(plantData.zone || '');
        setGreenhouse(plantData.greenhouse?.id || '');
        setGreenhouseName(plantData.greenhouse?.name || '');
        setPlantedAt(plantData.plantedAt ? new Date(plantData.plantedAt).toISOString().split('T')[0] : '');
        setNotes(plantData.notes || '');
        setStatus(plantData.status || 'PLANTED');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la plante:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!plantId) return;

    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plant-tasks?plantId=${plantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    }
  };

  const fetchPhotos = async () => {
    if (!plantId) return;

    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plant-advanced/${plantId}/photos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos(data.data.photos || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
    }
  };

  const fetchGrowthLogs = async () => {
    if (!plantId) return;

    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plant-advanced/${plantId}/growth-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGrowthLogs(data.data.logs || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logs de croissance:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Charger les données spécifiques à l'onglet
    if (newValue === 1 && tasks.length === 0) {
      fetchTasks();
    } else if (newValue === 2) {
      fetchPhotos();
      fetchGrowthLogs();
    } else if (newValue === 3) {
      fetchHarvests();
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setName(plant?.name || '');
      setZone(plant?.zone || '');
      setGreenhouse(plant?.greenhouse?.id || '');
      setGreenhouseName(plant?.greenhouse?.name || '');
      setPlantedAt(plant?.plantedAt ? new Date(plant.plantedAt).toISOString().split('T')[0] : '');
      setNotes(plant?.notes || '');
      setStatus(plant?.status || 'PLANTED');
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!plantId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('virida_token');
      const payload = {
        name,
        zone: zone || undefined,
        greenhouse: greenhouse || undefined,
        plantedAt: plantedAt ? new Date(plantedAt).toISOString() : undefined,
        notes: notes || undefined,
        status,
      };

      const response = await fetch(`${apiUrl}/api/plants/${plantId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchPlantDetails();
        setIsEditing(false);
        onPlantUpdated();
      } else {
        console.error('Erreur lors de la mise à jour de la plante');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!plantId) return;

    setConfirmDialog({
      open: true,
      title: 'Supprimer la plante',
      message: 'Êtes-vous sûr de vouloir supprimer cette plante ? Toutes les données associées (photos, historique, tâches) seront également supprimées. Cette action est irréversible.',
      onConfirm: async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('virida_token');
          const response = await fetch(`${apiUrl}/api/plants/${plantId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setConfirmDialog({ ...confirmDialog, open: false });
            onPlantDeleted();
            onClose();
          } else {
            console.error('Erreur lors de la suppression de la plante');
            setConfirmDialog({ ...confirmDialog, open: false });
          }
        } catch (error) {
          console.error('Erreur:', error);
          setConfirmDialog({ ...confirmDialog, open: false });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Growth history functions
  const handleAddHistory = async () => {
    if (!plantId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('virida_token');

      // Uploader la photo si un fichier est sélectionné
      if (selectedPhotoFile) {
        const formData = new FormData();
        formData.append('photo', selectedPhotoFile);
        if (newPhotoCaption.trim()) {
          formData.append('caption', newPhotoCaption.trim());
        }

        await fetch(`${apiUrl}/api/plant-advanced/${plantId}/photos/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      }

      // Ajouter le log de croissance si des données sont fournies
      if (newLogHeight || newLogLeafCount || newLogNotes) {
        const logPayload: any = {};
        if (newLogHeight) logPayload.height = parseFloat(newLogHeight);
        if (newLogLeafCount) logPayload.leafCount = parseInt(newLogLeafCount);
        if (newLogNotes.trim()) logPayload.notes = newLogNotes.trim();

        await fetch(`${apiUrl}/api/plant-advanced/${plantId}/growth-logs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logPayload),
        });
      }

      // Recharger les données
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
      console.error('Erreur lors de l\'ajout de l\'historique:', error);
      alert('Erreur lors de l\'ajout de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!plantId) return;

    setConfirmDialog({
      open: true,
      title: 'Supprimer la photo',
      message: 'Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('virida_token');
          await fetch(`${apiUrl}/api/plant-advanced/${plantId}/photos/${photoId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          fetchPhotos();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error) {
          console.error('Erreur lors de la suppression de la photo:', error);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };

  const handleDeleteGrowthLog = async (logId: string) => {
    if (!plantId) return;

    setConfirmDialog({
      open: true,
      title: 'Supprimer le log de croissance',
      message: 'Êtes-vous sûr de vouloir supprimer ce log de croissance ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('virida_token');
          await fetch(`${apiUrl}/api/plant-advanced/${plantId}/growth-logs/${logId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          fetchGrowthLogs();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error) {
          console.error('Erreur lors de la suppression du log de croissance:', error);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };

  // Task management functions
  const handleOpenTaskDialog = (taskId?: string) => {
    setSelectedTaskId(taskId || null);
    setTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
    setSelectedTaskId(null);
  };

  const handleTaskSaved = () => {
    fetchTasks();
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plant-tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Erreur lors de la complétion de la tâche:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Supprimer la tâche',
      message: 'Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('virida_token');
          const response = await fetch(`${apiUrl}/api/plant-tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            fetchTasks();
            setConfirmDialog({ ...confirmDialog, open: false });
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la tâche:', error);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };

  const handleClose = () => {
    setIsEditing(false);
    setTabValue(0);
    onClose();
  };

  // Harvest management functions
  const fetchHarvests = async () => {
    if (!plantId) return;

    try {
      const token = localStorage.getItem('virida_token');
      const response = await fetch(`${apiUrl}/api/plant-advanced/${plantId}/harvests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHarvests(data.data.harvests || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des récoltes:', error);
    }
  };

  const handleAddHarvest = async () => {
    if (!plantId || !newHarvestQuantity) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('virida_token');
      const payload = {
        quantity: parseFloat(newHarvestQuantity),
        unit: newHarvestUnit,
        quality: newHarvestQuality,
        notes: newHarvestNotes.trim() || undefined,
        harvestedAt: new Date(newHarvestDate).toISOString(),
      };

      const response = await fetch(`${apiUrl}/api/plant-advanced/${plantId}/harvests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchHarvests();
        // Réinitialiser le formulaire
        setNewHarvestQuantity('');
        setNewHarvestUnit('kg');
        setNewHarvestQuality('GOOD');
        setNewHarvestNotes('');
        setNewHarvestDate(new Date().toISOString().split('T')[0]);
        setShowAddHarvest(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la récolte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHarvest = async (harvestId: string) => {
    if (!plantId) return;

    setConfirmDialog({
      open: true,
      title: 'Supprimer la récolte',
      message: 'Êtes-vous sûr de vouloir supprimer cette récolte ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('virida_token');
          await fetch(`${apiUrl}/api/plant-advanced/${plantId}/harvests/${harvestId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          fetchHarvests();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error) {
          console.error('Erreur lors de la suppression de la récolte:', error);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
    });
  };

  if (!plant) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANTED': return '#2E7D32';
      case 'GROWING': return '#1976d2';
      case 'FLOWERING': return '#9c27b0';
      case 'FRUITING': return '#ed6c02';
      case 'HARVESTED': return '#388e3c';
      case 'DORMANT': return '#757575';
      case 'DEAD': return '#d32f2f';
      default: return '#666';
    }
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

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {plant.imageUrl ? (
            <Avatar
              src={plant.imageUrl}
              alt={plant.name}
              sx={{ width: 56, height: 56 }}
            />
          ) : (
            <Avatar sx={{ width: 56, height: 56, fontSize: '2rem' }}>
              {plant.iconEmoji || '🌱'}
            </Avatar>
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {plant.name}
            </Typography>
            {plant.species && (
              <Typography variant="body2" color="text.secondary">
                {plant.species} {plant.variety && `- ${plant.variety}`}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isEditing ? (
            <IconButton onClick={handleEditToggle} size="small">
              <EditIcon />
            </IconButton>
          ) : (
            <>
              <IconButton onClick={handleSave} size="small" color="primary" disabled={loading}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleEditToggle} size="small" disabled={loading}>
                <CancelIcon />
              </IconButton>
            </>
          )}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: '1px solid #e0e0e0',
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Vue d'ensemble" />
          <Tab label="Soins" />
          <Tab label="Historique" />
          <Tab label="Récoltes" />
        </Tabs>

        <Box sx={{ px: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'standard'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant={isEditing ? 'outlined' : 'standard'}>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!isEditing}
                    label="Statut"
                  >
                    <MenuItem value="PLANTED">Planté</MenuItem>
                    <MenuItem value="GROWING">En croissance</MenuItem>
                    <MenuItem value="FLOWERING">En floraison</MenuItem>
                    <MenuItem value="FRUITING">En fructification</MenuItem>
                    <MenuItem value="HARVESTED">Récolté</MenuItem>
                    <MenuItem value="DORMANT">Dormant</MenuItem>
                    <MenuItem value="DEAD">Mort</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'standard'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {isEditing ? (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Serre</InputLabel>
                    <Select
                      value={greenhouse}
                      onChange={(e) => setGreenhouse(e.target.value)}
                      label="Serre"
                    >
                      <MenuItem value="greenhouse-demo-1">Serre Principale</MenuItem>
                      <MenuItem value="greenhouse-demo-2">Serre Expérimentale</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label="Serre"
                    value={greenhouseName}
                    disabled
                    variant="standard"
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de plantation"
                  type="date"
                  value={plantedAt}
                  onChange={(e) => setPlantedAt(e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'standard'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ pt: 1 }}>
                  <Chip
                    label={getStatusLabel(status)}
                    sx={{
                      backgroundColor: getStatusColor(status),
                      color: '#fff',
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'standard'}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Conditions optimales
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WaterDrop sx={{ color: '#1976d2', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Arrosage: {plant.optimalWatering || 'Non défini'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WbSunny sx={{ color: '#ed6c02', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Lumière: {plant.optimalLight || 'Non défini'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Thermostat sx={{ color: '#d32f2f', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Température: {plant.optimalTemp || 'Non défini'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Science sx={{ color: '#9c27b0', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    pH: {plant.optimalPH || 'Non défini'}
                  </Typography>
                </Box>
              </Grid>

              {plant.daysToHarvest && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: '#2E7D32', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Jours jusqu'à la récolte: {plant.daysToHarvest} jours
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Tâches de soins
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenTaskDialog()}
                  size="small"
                  sx={{
                    bgcolor: '#2E7D32',
                    '&:hover': { bgcolor: '#1B5E20' },
                    textTransform: 'none',
                  }}
                >
                  Nouvelle tâche
                </Button>
              </Box>

              {tasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune tâche pour le moment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Créez votre première tâche de soins
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      sx={{
                        bgcolor: task.status === 'COMPLETED' ? '#f5f5f5' : '#fff',
                        border: '1px solid #e0e0e0',
                        opacity: task.status === 'COMPLETED' ? 0.7 : 1,
                      }}
                    >
                      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                                }}
                              >
                                {task.title}
                              </Typography>
                              <Chip
                                label={task.taskType}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  bgcolor: '#E8F5E9',
                                  color: '#2E7D32',
                                }}
                              />
                              {task.priority === 'HIGH' || task.priority === 'URGENT' ? (
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: task.priority === 'URGENT' ? '#FFEBEE' : '#FFF3E0',
                                    color: task.priority === 'URGENT' ? '#D32F2F' : '#F57C00',
                                  }}
                                />
                              ) : null}
                            </Box>
                            {task.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                {task.description}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              {task.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                  📅 {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                                </Typography>
                              )}
                              {task.frequencyDays && (
                                <Typography variant="caption" color="text.secondary">
                                  🔄 Tous les {task.frequencyDays} jours
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {task.status !== 'COMPLETED' && (
                              <IconButton
                                size="small"
                                onClick={() => handleCompleteTask(task.id)}
                                sx={{ color: '#2E7D32' }}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => handleOpenTaskDialog(task.id)}
                              sx={{ color: '#666' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTask(task.id)}
                              sx={{ color: '#d32f2f' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Bouton pour ajouter une entrée */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Historique de croissance
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddHistory(!showAddHistory)}
                sx={{
                  bgcolor: '#2E7D32',
                  '&:hover': { bgcolor: '#1B5E20' },
                }}
              >
                Ajouter une entrée
              </Button>
            </Box>

            {/* Formulaire d'ajout */}
            {showAddHistory && (
              <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Nouvelle entrée d'historique
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="photo-upload-input"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedPhotoFile(file);
                            }
                          }}
                        />
                        <label htmlFor="photo-upload-input">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCamera />}
                            fullWidth
                            sx={{
                              borderColor: '#2E7D32',
                              color: '#2E7D32',
                              '&:hover': {
                                borderColor: '#1B5E20',
                                bgcolor: 'rgba(46, 125, 50, 0.04)',
                              },
                            }}
                          >
                            {selectedPhotoFile ? selectedPhotoFile.name : 'Choisir une photo'}
                          </Button>
                        </label>
                        {selectedPhotoFile && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            Fichier sélectionné : {selectedPhotoFile.name} ({(selectedPhotoFile.size / 1024 / 1024).toFixed(2)} MB)
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Légende de la photo"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="Description de la photo..."
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Hauteur (cm)"
                        type="number"
                        value={newLogHeight}
                        onChange={(e) => setNewLogHeight(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre de feuilles"
                        type="number"
                        value={newLogLeafCount}
                        onChange={(e) => setNewLogLeafCount(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        value={newLogNotes}
                        onChange={(e) => setNewLogNotes(e.target.value)}
                        multiline
                        rows={2}
                        placeholder="Observations, changements remarqués..."
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          onClick={() => setShowAddHistory(false)}
                          disabled={loading}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleAddHistory}
                          disabled={loading || (!selectedPhotoFile && !newLogHeight && !newLogLeafCount && !newLogNotes.trim())}
                          sx={{
                            bgcolor: '#2E7D32',
                            '&:hover': { bgcolor: '#1B5E20' },
                          }}
                        >
                          {loading ? 'Ajout...' : 'Ajouter'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Timeline des photos et logs */}
            <Box>
              {photos.length === 0 && growthLogs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <PhotoCamera sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Aucune entrée d'historique
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commencez à documenter la croissance de votre plante en ajoutant des photos et des observations.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {/* Afficher les photos */}
                  {photos.map((photo: any) => (
                    <Grid item xs={12} sm={6} md={4} key={photo.id}>
                      <Card>
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '75%',
                            bgcolor: '#f0f0f0',
                            backgroundImage: `url(${photo.url.startsWith('http') ? photo.url : apiUrl + photo.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <IconButton
                            onClick={() => handleDeletePhoto(photo.id)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'rgba(255,255,255,0.9)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                            }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <CardContent>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(photo.takenAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                          {photo.caption && (
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {photo.caption}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  {/* Afficher les logs de croissance */}
                  {growthLogs.map((log: any) => (
                    <Grid item xs={12} key={log.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                {new Date(log.timestamp).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Typography>
                              {log.eventType && (
                                <Chip
                                  label={log.eventType}
                                  size="small"
                                  sx={{ mt: 0.5, bgcolor: '#E8F5E9', color: '#2E7D32' }}
                                />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={`Santé: ${log.healthScore}%`}
                                size="small"
                                sx={{
                                  bgcolor: log.healthScore >= 80 ? '#E8F5E9' : log.healthScore >= 60 ? '#FFF3E0' : '#FFEBEE',
                                  color: log.healthScore >= 80 ? '#2E7D32' : log.healthScore >= 60 ? '#F57C00' : '#C62828',
                                }}
                              />
                              <IconButton
                                onClick={() => handleDeleteGrowthLog(log.id)}
                                sx={{
                                  color: '#d32f2f',
                                  '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' },
                                }}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            {log.height && (
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Hauteur
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {log.height} cm
                                </Typography>
                              </Grid>
                            )}
                            {log.leafCount && (
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Feuilles
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {log.leafCount}
                                </Typography>
                              </Grid>
                            )}
                            {log.fruitCount && (
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Fruits
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {log.fruitCount}
                                </Typography>
                              </Grid>
                            )}
                            {log.temperature && (
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary">
                                  Température
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {log.temperature}°C
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                          {log.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              {log.notes}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Bouton pour ajouter une récolte */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Historique des récoltes
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddHarvest(!showAddHarvest)}
                sx={{
                  bgcolor: '#2E7D32',
                  '&:hover': { bgcolor: '#1B5E20' },
                }}
              >
                Ajouter une récolte
              </Button>
            </Box>

            {/* Formulaire d'ajout */}
            {showAddHarvest && (
              <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Nouvelle récolte
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Quantité"
                        type="number"
                        value={newHarvestQuantity}
                        onChange={(e) => setNewHarvestQuantity(e.target.value)}
                        size="small"
                        required
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Unité</InputLabel>
                        <Select
                          value={newHarvestUnit}
                          onChange={(e) => setNewHarvestUnit(e.target.value)}
                          label="Unité"
                        >
                          <MenuItem value="kg">Kilogrammes (kg)</MenuItem>
                          <MenuItem value="g">Grammes (g)</MenuItem>
                          <MenuItem value="lb">Livres (lb)</MenuItem>
                          <MenuItem value="unités">Unités</MenuItem>
                          <MenuItem value="pièces">Pièces</MenuItem>
                          <MenuItem value="bouquets">Bouquets</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Qualité</InputLabel>
                        <Select
                          value={newHarvestQuality}
                          onChange={(e) => setNewHarvestQuality(e.target.value)}
                          label="Qualité"
                        >
                          <MenuItem value="EXCELLENT">Excellente</MenuItem>
                          <MenuItem value="GOOD">Bonne</MenuItem>
                          <MenuItem value="FAIR">Moyenne</MenuItem>
                          <MenuItem value="POOR">Faible</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date de récolte"
                        type="date"
                        value={newHarvestDate}
                        onChange={(e) => setNewHarvestDate(e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        value={newHarvestNotes}
                        onChange={(e) => setNewHarvestNotes(e.target.value)}
                        multiline
                        rows={2}
                        placeholder="Observations, goût, texture..."
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          onClick={() => setShowAddHarvest(false)}
                          disabled={loading}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleAddHarvest}
                          disabled={loading || !newHarvestQuantity}
                          sx={{
                            bgcolor: '#2E7D32',
                            '&:hover': { bgcolor: '#1B5E20' },
                          }}
                        >
                          {loading ? 'Ajout...' : 'Ajouter'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Liste des récoltes */}
            <Box>
              {harvests.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CalendarMonth sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Aucune récolte enregistrée
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commencez à documenter vos récoltes pour suivre votre production.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {harvests.map((harvest: any) => (
                    <Grid item xs={12} key={harvest.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {harvest.quantity} {harvest.unit}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(harvest.harvestedAt).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={harvest.quality === 'EXCELLENT' ? 'Excellente' : harvest.quality === 'GOOD' ? 'Bonne' : harvest.quality === 'FAIR' ? 'Moyenne' : 'Faible'}
                                size="small"
                                sx={{
                                  bgcolor: harvest.quality === 'EXCELLENT' ? '#E8F5E9' : harvest.quality === 'GOOD' ? '#E3F2FD' : harvest.quality === 'FAIR' ? '#FFF3E0' : '#FFEBEE',
                                  color: harvest.quality === 'EXCELLENT' ? '#2E7D32' : harvest.quality === 'GOOD' ? '#1976d2' : harvest.quality === 'FAIR' ? '#F57C00' : '#C62828',
                                }}
                              />
                              <IconButton
                                onClick={() => handleDeleteHarvest(harvest.id)}
                                sx={{
                                  color: '#d32f2f',
                                  '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' },
                                }}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          {harvest.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {harvest.notes}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button
          onClick={handleDelete}
          color="error"
          startIcon={<DeleteIcon />}
          disabled={loading}
        >
          Supprimer
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleClose} disabled={loading}>
          Fermer
        </Button>
      </DialogActions>
      </Dialog>

      {/* Task Dialog */}
      {plantId && (
        <TaskDialog
          open={taskDialogOpen}
          onClose={handleCloseTaskDialog}
          plantId={plantId}
          taskId={selectedTaskId}
          onTaskSaved={handleTaskSaved}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon sx={{ color: '#d32f2f' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {confirmDialog.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            sx={{ color: '#666' }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDialog.onConfirm}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' },
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
