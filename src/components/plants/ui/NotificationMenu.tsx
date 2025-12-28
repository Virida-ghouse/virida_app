import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import OpacityIcon from '@mui/icons-material/Opacity';
import SpaIcon from '@mui/icons-material/Spa';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BugReportIcon from '@mui/icons-material/BugReport';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ScienceIcon from '@mui/icons-material/Science';
import { useViridaStore } from '../../../store/useViridaStore';

interface TaskNotification {
  id: string;
  plantName: string;
  plantId: string;
  type: string;
  description: string;
  dueDate: string;
  priority: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
}

export const NotificationMenu: React.FC = () => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchNotifications();
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('virida_token');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const twoDaysFromNow = new Date(today);
      twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

      const response = await fetch(
        `${apiUrl}/api/plant-tasks?completed=false&fromDate=${today.toISOString()}&toDate=${twoDaysFromNow.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const tasks = data.data || [];

        const processedNotifications: TaskNotification[] = tasks.map((task: any) => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          const isOverdue = dueDate < today;
          const isToday = dueDate.getTime() === today.getTime();
          const isTomorrow = dueDate.getTime() === tomorrow.getTime();

          return {
            id: task.id,
            plantName: task.plant?.name || 'Plante inconnue',
            plantId: task.plantId,
            type: task.type,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            isOverdue,
            isToday,
            isTomorrow,
          };
        });

        // Trier par priorité et date
        processedNotifications.sort((a, b) => {
          if (a.isOverdue && !b.isOverdue) return -1;
          if (!a.isOverdue && b.isOverdue) return 1;
          if (a.isToday && !b.isToday) return -1;
          if (!a.isToday && b.isToday) return 1;

          const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        setNotifications(processedNotifications);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (!open) {
      fetchNotifications(); // Rafraîchir à l'ouverture
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getTaskIcon = (type: string) => {
    const size = 20;
    switch (type) {
      case 'WATERING':
        return <OpacityIcon sx={{ fontSize: size, color: '#2196F3' }} />;
      case 'FERTILIZING':
        return <SpaIcon sx={{ fontSize: size, color: '#4CAF50' }} />;
      case 'PRUNING':
        return <ContentCutIcon sx={{ fontSize: size, color: '#FF9800' }} />;
      case 'PEST_CONTROL':
        return <BugReportIcon sx={{ fontSize: size, color: '#F44336' }} />;
      case 'HARVESTING':
        return <AgricultureIcon sx={{ fontSize: size, color: '#8BC34A' }} />;
      case 'REPOTTING':
        return <LocalFloristIcon sx={{ fontSize: size, color: '#9C27B0' }} />;
      case 'PH_ADJUSTMENT':
        return <ScienceIcon sx={{ fontSize: size, color: '#00BCD4' }} />;
      default:
        return <OpacityIcon sx={{ fontSize: size, color: '#2196F3' }} />;
    }
  };

  const getTaskLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'WATERING': 'Arrosage',
      'FERTILIZING': 'Fertilisation',
      'PRUNING': 'Taille',
      'PEST_CONTROL': 'Contrôle parasites',
      'HARVESTING': 'Récolte',
      'REPOTTING': 'Rempotage',
      'PH_ADJUSTMENT': 'Ajustement pH',
    };
    return labels[type] || type;
  };

  const getNotificationChip = (notification: TaskNotification) => {
    if (notification.isOverdue) {
      return <Chip label="En retard" size="small" sx={{ bgcolor: '#FFEBEE', color: '#C62828' }} />;
    }
    if (notification.isToday) {
      return <Chip label="Aujourd'hui" size="small" sx={{ bgcolor: '#E3F2FD', color: '#1976d2' }} />;
    }
    if (notification.isTomorrow) {
      return <Chip label="Demain" size="small" sx={{ bgcolor: '#FFF3E0', color: '#F57C00' }} />;
    }
    return null;
  };

  const urgentNotificationsCount = notifications.filter(
    n => n.isOverdue || n.isToday
  ).length;

  // Grouper et limiter les notifications
  const overdueNotifications = notifications.filter(n => n.isOverdue).slice(0, 5);
  const todayNotifications = notifications.filter(n => n.isToday && !n.isOverdue).slice(0, 3);
  const upcomingNotifications = notifications.filter(n => n.isTomorrow && !n.isToday && !n.isOverdue).slice(0, 2);

  const displayedNotifications = [
    ...overdueNotifications,
    ...todayNotifications,
    ...upcomingNotifications,
  ];

  const hasMoreNotifications = notifications.length > displayedNotifications.length;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: '#FFFFFF',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
        }}
      >
        <Badge badgeContent={urgentNotificationsCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 400,
              maxHeight: 500,
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#121A21' }}>
            Notifications
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575' }}>
            {notifications.length} tâche{notifications.length > 1 ? 's' : ''} à venir
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chargement...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Aucune notification
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vous êtes à jour avec vos tâches !
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              {/* Tâches en retard */}
              {overdueNotifications.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, bgcolor: '#FFEBEE' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#C62828' }}>
                      EN RETARD ({overdueNotifications.length})
                    </Typography>
                  </Box>
                  {overdueNotifications.map((notification) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': { bgcolor: '#f5f5f5' },
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Box sx={{ mt: 0.5 }}>
                            {getTaskIcon(notification.type)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#121A21' }}>
                                {notification.plantName}
                              </Typography>
                              {getNotificationChip(notification)}
                            </Box>
                            <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                              {getTaskLabel(notification.type)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>
                              {notification.description}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Tâches d'aujourd'hui */}
              {todayNotifications.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, bgcolor: '#E3F2FD' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      AUJOURD'HUI ({todayNotifications.length})
                    </Typography>
                  </Box>
                  {todayNotifications.map((notification) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': { bgcolor: '#f5f5f5' },
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Box sx={{ mt: 0.5 }}>
                            {getTaskIcon(notification.type)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#121A21' }}>
                                {notification.plantName}
                              </Typography>
                              {getNotificationChip(notification)}
                            </Box>
                            <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                              {getTaskLabel(notification.type)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>
                              {notification.description}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* Tâches de demain */}
              {upcomingNotifications.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, bgcolor: '#FFF3E0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#F57C00' }}>
                      DEMAIN ({upcomingNotifications.length})
                    </Typography>
                  </Box>
                  {upcomingNotifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&:hover': { bgcolor: '#f5f5f5' },
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Box sx={{ mt: 0.5 }}>
                            {getTaskIcon(notification.type)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#121A21' }}>
                                {notification.plantName}
                              </Typography>
                              {getNotificationChip(notification)}
                            </Box>
                            <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                              {getTaskLabel(notification.type)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>
                              {notification.description}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < upcomingNotifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </>
              )}
            </List>

            {/* Message "plus de tâches" */}
            {hasMoreNotifications && (
              <>
                <Divider />
                <Box sx={{ px: 2, py: 1.5, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    + {notifications.length - displayedNotifications.length} autre{notifications.length - displayedNotifications.length > 1 ? 's' : ''} tâche{notifications.length - displayedNotifications.length > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#2E7D32', display: 'block', mt: 0.5, fontWeight: 600, cursor: 'pointer' }}>
                    Voir le calendrier complet
                  </Typography>
                </Box>
              </>
            )}
          </>
        )}
      </Menu>
    </>
  );
};
