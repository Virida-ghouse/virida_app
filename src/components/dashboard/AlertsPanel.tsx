import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AlertsContainer = styled(motion.div)(({ theme }) => ({
  background: 'rgba(30, 41, 59, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  height: '300px',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #F59E0B, #EF4444, #F59E0B)',
  },
}));

const AlertItem = styled(motion.div)<{ alertType: string }>(({ theme, alertType }) => ({
  background: 'rgba(15, 23, 42, 0.6)',
  border: `1px solid ${
    alertType === 'error' ? '#EF4444' :
    alertType === 'warning' ? '#F59E0B' :
    alertType === 'success' ? '#10B981' : '#3B82F6'
  }`,
  borderRadius: '8px',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: alertType === 'error' ? '#EF4444' :
                alertType === 'warning' ? '#F59E0B' :
                alertType === 'success' ? '#10B981' : '#3B82F6',
  },
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  height: '240px',
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(148, 163, 184, 0.1)',
    borderRadius: '2px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(42, 211, 136, 0.5)',
    borderRadius: '2px',
  },
}));

interface Alert {
  id: number;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  time: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'error':
      return <ErrorIcon fontSize="small" sx={{ color: '#EF4444' }} />;
    case 'warning':
      return <WarningIcon fontSize="small" sx={{ color: '#F59E0B' }} />;
    case 'success':
      return <CheckCircleIcon fontSize="small" sx={{ color: '#10B981' }} />;
    default:
      return <InfoIcon fontSize="small" sx={{ color: '#3B82F6' }} />;
  }
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AlertsContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <WarningIcon sx={{ color: '#F59E0B', mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            color: '#E2E8F0',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          Alertes Système
        </Typography>
        <Box
          sx={{
            ml: 'auto',
            px: 1,
            py: 0.25,
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #F59E0B',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#F59E0B', fontWeight: 600, fontSize: '10px' }}
          >
            {alerts.length}
          </Typography>
        </Box>
      </Box>

      <ScrollableContent>
        <AnimatePresence>
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alertType={alert.type}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ scale: 1.02, x: 4 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ mt: 0.25 }}>
                  {getAlertIcon(alert.type)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#E2E8F0',
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                      mb: 0.5,
                    }}
                  >
                    {alert.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94A3B8',
                      fontSize: '0.75rem',
                    }}
                  >
                    {alert.time}
                  </Typography>
                </Box>
              </Box>

              {/* Effet de pulse pour les nouvelles alertes */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 10% 50%, ${
                    alert.type === 'error' ? '#EF4444' :
                    alert.type === 'warning' ? '#F59E0B' :
                    alert.type === 'success' ? '#10B981' : '#3B82F6'
                  }20, transparent)`,
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </AlertItem>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#64748B',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 48, mb: 2, color: '#10B981' }} />
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Aucune alerte active
              </Typography>
              <Typography variant="caption" sx={{ textAlign: 'center', mt: 0.5 }}>
                Tous les systèmes fonctionnent normalement
              </Typography>
            </Box>
          </motion.div>
        )}
      </ScrollableContent>

      {/* Indicateur de statut global */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: alerts.some(a => a.type === 'error') ? '#EF4444' :
                         alerts.some(a => a.type === 'warning') ? '#F59E0B' : '#10B981',
            }}
          />
        </motion.div>
        <Typography
          variant="caption"
          sx={{
            color: '#94A3B8',
            fontSize: '10px',
            fontWeight: 500,
          }}
        >
          {alerts.some(a => a.type === 'error') ? 'CRITIQUE' :
           alerts.some(a => a.type === 'warning') ? 'ATTENTION' : 'NORMAL'}
        </Typography>
      </Box>
    </AlertsContainer>
  );
};

export default AlertsPanel;
