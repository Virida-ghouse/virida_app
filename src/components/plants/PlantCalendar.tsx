import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Badge,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OpacityIcon from '@mui/icons-material/Opacity';
import SpaIcon from '@mui/icons-material/Spa';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ScienceIcon from '@mui/icons-material/Science';
import { useViridaStore } from '../../store/useViridaStore';

interface CalendarTask {
  id: string;
  plantName: string;
  type: 'WATER' | 'FERTILIZE' | 'PRUNE' | 'PEST_CHECK' | 'HARVEST' | 'REPOT' | 'PH_ADJUST';
  date: Date;
}

interface APITask {
  id: string;
  type: 'WATERING' | 'FERTILIZING' | 'PRUNING' | 'PEST_CONTROL' | 'HARVESTING' | 'REPOTTING' | 'PH_ADJUSTMENT';
  dueDate: string;
  plant: {
    name: string;
  };
}

const PlantCalendar: React.FC = () => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Mapper les types de l'API vers les types du calendrier
  const mapTaskType = (apiType: APITask['type']): CalendarTask['type'] => {
    switch (apiType) {
      case 'WATERING':
        return 'WATER';
      case 'FERTILIZING':
        return 'FERTILIZE';
      case 'PRUNING':
        return 'PRUNE';
      case 'PEST_CONTROL':
        return 'PEST_CHECK';
      case 'HARVESTING':
        return 'HARVEST';
      case 'REPOTTING':
        return 'REPOT';
      case 'PH_ADJUSTMENT':
        return 'PH_ADJUST';
      default:
        return 'WATER';
    }
  };

  // Récupérer les tâches
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('virida_token');

        // Récupérer toutes les tâches non complétées
        const response = await fetch(`${apiUrl}/api/plant-tasks?completed=false`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des tâches');
        }

        const data = await response.json();
        const apiTasks: APITask[] = data.data || [];

        // Convertir les tâches de l'API vers le format du calendrier
        const calendarTasks: CalendarTask[] = apiTasks.map((task) => ({
          id: task.id,
          plantName: task.plant.name,
          type: mapTaskType(task.type),
          date: new Date(task.dueDate),
        }));

        setTasks(calendarTasks);
      } catch (err) {
        console.error('Erreur chargement tâches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [apiUrl, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getTaskIcon = (type: CalendarTask['type']): React.ReactElement => {
    const size = 14;
    switch (type) {
      case 'WATER':
        return <OpacityIcon sx={{ fontSize: size, color: '#2196F3' }} />;
      case 'FERTILIZE':
        return <SpaIcon sx={{ fontSize: size, color: '#4CAF50' }} />;
      case 'PRUNE':
        return <ContentCutIcon sx={{ fontSize: size, color: '#FF9800' }} />;
      case 'PEST_CHECK':
        return <BugReportIcon sx={{ fontSize: size, color: '#F44336' }} />;
      case 'HARVEST':
        return <AgricultureIcon sx={{ fontSize: size, color: '#8BC34A' }} />;
      case 'REPOT':
        return <LocalFloristIcon sx={{ fontSize: size, color: '#9C27B0' }} />;
      case 'PH_ADJUST':
        return <ScienceIcon sx={{ fontSize: size, color: '#00BCD4' }} />;
      default:
        return <OpacityIcon sx={{ fontSize: size, color: '#2196F3' }} />;
    }
  };

  const getTaskLabel = (type: CalendarTask['type']): string => {
    switch (type) {
      case 'WATER':
        return 'Arrosage';
      case 'FERTILIZE':
        return 'Fertilisation';
      case 'PRUNE':
        return 'Taille';
      case 'PEST_CHECK':
        return 'Vérification parasites';
      case 'HARVEST':
        return 'Récolte';
      case 'REPOT':
        return 'Rempotage';
      case 'PH_ADJUST':
        return 'Ajustement pH';
      default:
        return 'Tâche';
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setDayDialogOpen(true);
  };

  const handleCloseDayDialog = () => {
    setDayDialogOpen(false);
    setSelectedDay(null);
  };

  const getSelectedDayTasks = () => {
    if (selectedDay === null) return [];
    return getTasksForDay(selectedDay);
  };

  // Générer les jours du calendrier
  const calendarDays: (number | null)[] = [];
  // Jours vides avant le début du mois (dimanche = 0, donc on ajuste)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  // Jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Chargement
  if (loading) {
    const loadingBoxStyle = { display: 'flex', justifyContent: 'center', py: 8 };
    const progressStyle = { color: '#2E7D32' };
    return (
      <Box sx={loadingBoxStyle}>
        <CircularProgress sx={progressStyle} size={60} />
      </Box>
    );
  }

  // État vide
  if (tasks.length === 0) {
    return (
      <Box>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21', mb: 1 }}>
            Calendrier
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575' }}>
            Visualisez vos tâches dans le temps
          </Typography>
        </Box>

        {/* Contrôles du mois */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            bgcolor: 'white',
            p: 2,
            borderRadius: 2,
            border: '1px solid #F0F0F0',
          }}
        >
          <IconButton onClick={handlePrevMonth} sx={{ color: '#757575' }}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <IconButton onClick={handleNextMonth} sx={{ color: '#757575' }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Calendrier */}
        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, border: '1px solid #F0F0F0' }}>
          {/* Jours de la semaine */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {dayNames.map((day) => (
              <Grid item xs={12 / 7} key={day}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#9E9E9E',
                    textTransform: 'uppercase',
                  }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Grille des jours */}
          <Grid container spacing={1}>
            {calendarDays.map((day, index) => (
              <Grid item xs={12 / 7} key={index}>
                {day ? (
                  <Paper
                    elevation={0}
                    onClick={() => handleDayClick(day)}
                    sx={{
                      p: 1,
                      minHeight: 80,
                      bgcolor: isToday(day) ? '#F0F9F4' : '#FAFAFA',
                      border: isToday(day) ? '2px solid #2E7D32' : '1px solid #F0F0F0',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#F5F5F5',
                        borderColor: '#2E7D32',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday(day) ? 700 : 500,
                        color: isToday(day) ? '#2E7D32' : '#121A21',
                        mb: 0.5,
                      }}
                    >
                      {day}
                    </Typography>
                  </Paper>
                ) : (
                  <Box sx={{ minHeight: 80 }} />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Message état vide */}
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            mt: 4,
            bgcolor: 'white',
            borderRadius: 2,
            border: '1px solid #F0F0F0',
          }}
        >
          <Typography sx={{ fontSize: '3rem', mb: 1 }}>📅</Typography>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#121A21' }}>
            Aucune tâche planifiée
          </Typography>
          <Typography variant="body2" color="#757575">
            Les tâches apparaîtront ici une fois que vous aurez des plantes en culture
          </Typography>
        </Box>

        {/* Modal de détails du jour */}
        <Dialog
          open={dayDialogOpen}
          onClose={handleCloseDayDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon sx={{ color: '#2E7D32' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedDay} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDayDialog} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Aucune tâche prévue pour ce jour
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDayDialog} sx={{ color: '#2E7D32' }}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Vue avec tâches
  return (
    <Box>
      {/* En-tête avec stats */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#121A21', mb: 1 }}>
          Calendrier
        </Typography>
        <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
          {tasks.length} tâche{tasks.length > 1 ? 's' : ''} ce mois-ci
        </Typography>

        {/* Légende */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<OpacityIcon sx={{ fontSize: 16 }} />}
            label="Arrosage"
            size="small"
            sx={{ bgcolor: '#E3F2FD', color: '#2196F3' }}
          />
          <Chip
            icon={<SpaIcon sx={{ fontSize: 16 }} />}
            label="Fertilisation"
            size="small"
            sx={{ bgcolor: '#E8F5E9', color: '#4CAF50' }}
          />
          <Chip
            icon={<ContentCutIcon sx={{ fontSize: 16 }} />}
            label="Taille"
            size="small"
            sx={{ bgcolor: '#FFF3E0', color: '#FF9800' }}
          />
          <Chip
            icon={<BugReportIcon sx={{ fontSize: 16 }} />}
            label="Parasites"
            size="small"
            sx={{ bgcolor: '#FFEBEE', color: '#F44336' }}
          />
          <Chip
            icon={<AgricultureIcon sx={{ fontSize: 16 }} />}
            label="Récolte"
            size="small"
            sx={{ bgcolor: '#F1F8E9', color: '#8BC34A' }}
          />
          <Chip
            icon={<LocalFloristIcon sx={{ fontSize: 16 }} />}
            label="Rempotage"
            size="small"
            sx={{ bgcolor: '#F3E5F5', color: '#9C27B0' }}
          />
          <Chip
            icon={<ScienceIcon sx={{ fontSize: 16 }} />}
            label="pH"
            size="small"
            sx={{ bgcolor: '#E0F7FA', color: '#00BCD4' }}
          />
        </Box>
      </Box>

      {/* Contrôles du mois */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          bgcolor: 'white',
          p: 2,
          borderRadius: 2,
          border: '1px solid #F0F0F0',
        }}
      >
        <IconButton onClick={handlePrevMonth} sx={{ color: '#757575' }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: '#757575' }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Calendrier */}
      <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, border: '1px solid #F0F0F0' }}>
        {/* Jours de la semaine */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {dayNames.map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#9E9E9E',
                  textTransform: 'uppercase',
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Grille des jours */}
        <Grid container spacing={1}>
          {calendarDays.map((day, index) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            return (
              <Grid item xs={12 / 7} key={index}>
                {day ? (
                  <Badge
                    badgeContent={dayTasks.length > 0 ? dayTasks.length : null}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: '#2E7D32',
                        right: 8,
                        top: 8,
                      },
                      width: '100%',
                    }}
                  >
                    <Paper
                      elevation={0}
                      onClick={() => handleDayClick(day)}
                      sx={{
                        p: 1,
                        minHeight: 80,
                        width: '100%',
                        bgcolor: isToday(day) ? '#F0F9F4' : '#FAFAFA',
                        border: isToday(day) ? '2px solid #2E7D32' : '1px solid #F0F0F0',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#F5F5F5',
                          borderColor: '#2E7D32',
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isToday(day) ? 700 : 500,
                          color: isToday(day) ? '#2E7D32' : '#121A21',
                          mb: 0.5,
                        }}
                      >
                        {day}
                      </Typography>
                      {/* Icônes des tâches */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {dayTasks.slice(0, 3).map((task) => (
                          <Box key={task.id}>{getTaskIcon(task.type)}</Box>
                        ))}
                      </Box>
                    </Paper>
                  </Badge>
                ) : (
                  <Box sx={{ minHeight: 80 }} />
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Modal de détails du jour */}
      <Dialog
        open={dayDialogOpen}
        onClose={handleCloseDayDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon sx={{ color: '#2E7D32' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedDay} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDayDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {getSelectedDayTasks().length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Aucune tâche prévue pour ce jour
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
                {getSelectedDayTasks().length} tâche{getSelectedDayTasks().length > 1 ? 's' : ''} prévue{getSelectedDayTasks().length > 1 ? 's' : ''}
              </Typography>
              <List sx={{ p: 0 }}>
                {getSelectedDayTasks().map((task, index) => (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Divider />}
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getTaskIcon(task.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={task.plantName}
                        secondary={getTaskLabel(task.type)}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          color: '#121A21',
                        }}
                        secondaryTypographyProps={{
                          color: '#757575',
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDayDialog} sx={{ color: '#2E7D32' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlantCalendar;
