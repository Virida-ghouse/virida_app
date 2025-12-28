import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import SpaIcon from '@mui/icons-material/Spa';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useViridaStore } from '../../store/useViridaStore';

interface CareTask {
  id: string;
  plantId: string;
  type: 'WATERING' | 'FERTILIZING' | 'PRUNING' | 'PEST_CONTROL';
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  plant: {
    id: string;
    name: string;
    species: string;
    imageUrl?: string;
    iconEmoji?: string;
  };
}

const PlantCare: React.FC = () => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [currentTab, setCurrentTab] = useState<'today' | 'upcoming'>('today');
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Récupérer les tâches
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('virida_token');
        const response = await fetch(`${apiUrl}/api/plant-tasks?completed=false`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des tâches');
        }

        const data = await response.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error('Erreur chargement tâches:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [apiUrl]);

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  const upcomingTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() > today.getTime();
  });

  const displayedTasks = currentTab === 'today' ? todayTasks : upcomingTasks;

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      const token = localStorage.getItem('virida_token');
      const endpoint = currentCompleted ? 'uncomplete' : 'complete';

      const response = await fetch(`${apiUrl}/api/plant-tasks/${taskId}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la tâche');
      }

      // Mettre à jour localement
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !currentCompleted } : task
        )
      );
    } catch (err) {
      console.error('Erreur toggle tâche:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const getTaskIcon = (type: CareTask['type']) => {
    switch (type) {
      case 'WATERING':
        return <OpacityIcon sx={{ color: '#2196F3' }} />;
      case 'FERTILIZING':
        return <SpaIcon sx={{ color: '#4CAF50' }} />;
      case 'PRUNING':
        return <ContentCutIcon sx={{ color: '#FF9800' }} />;
      case 'PEST_CONTROL':
        return <BugReportIcon sx={{ color: '#F44336' }} />;
    }
  };

  const getPriorityColor = (priority: CareTask['priority']) => {
    switch (priority) {
      case 'HIGH':
        return '#EF5350';
      case 'MEDIUM':
        return '#FFA726';
      case 'LOW':
        return '#66BB6A';
    }
  };

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
  if (tasks.length === 0) {
    return (
      <Box>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21', mb: 1 }}>
            Soins & Rappels
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575' }}>
            Gérez les tâches d'entretien de vos plantes
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
          <Typography sx={{ fontSize: '4rem', mb: 2 }}>✅</Typography>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#121A21' }}>
            Aucune tâche pour le moment
          </Typography>
          <Typography variant="body1" color="#757575" sx={{ maxWidth: 400, mx: 'auto' }}>
            Les tâches d'entretien apparaîtront ici automatiquement selon les besoins de vos plantes.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête avec stats */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21', mb: 1 }}>
          Soins & Rappels
        </Typography>
        <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
          {todayTasks.length} tâche{todayTasks.length > 1 ? 's' : ''} pour aujourd'hui
        </Typography>

        {/* Chips de stats */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`${todayTasks.length} aujourd'hui`}
            sx={{
              bgcolor: '#FFF4E5',
              color: '#F57C00',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${upcomingTasks.length} à venir`}
            sx={{
              bgcolor: '#F0F9F4',
              color: '#2E7D32',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Filtres par tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
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
          <Tab label="Aujourd'hui" value="today" />
          <Tab label="À venir" value="upcoming" />
        </Tabs>
      </Box>

      {/* Liste des tâches */}
      {displayedTasks.length > 0 ? (
        <List sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #F0F0F0' }}>
          {displayedTasks.map((task, index) => (
            <ListItem
              key={task.id}
              sx={{
                borderBottom: index < displayedTasks.length - 1 ? '1px solid #F5F5F5' : 'none',
                py: 2,
                '&:hover': {
                  bgcolor: '#FAFAFA',
                },
              }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                  sx={{
                    color: '#E0E0E0',
                    '&.Mui-checked': {
                      color: '#2E7D32',
                    },
                  }}
                />
              </ListItemIcon>

              {/* Icône de la plante */}
              <Avatar
                src={task.plant.imageUrl}
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  bgcolor: '#F5F5F5',
                }}
              >
                {task.plant.iconEmoji || '🌱'}
              </Avatar>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {getTaskIcon(task.type)}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: '#121A21',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.description}
                    </Typography>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: getPriorityColor(task.priority),
                        ml: 'auto',
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    {task.plant.name} • {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
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
            Aucune tâche {currentTab === 'today' ? "pour aujourd'hui" : 'à venir'}
          </Typography>
          <Typography variant="body1" color="#757575">
            Profitez de cette pause !
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PlantCare;
