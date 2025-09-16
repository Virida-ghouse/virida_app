import React from 'react';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import WifiIcon from '@mui/icons-material/Wifi';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';

const StatusContainer = styled(motion.div)(({ theme }) => ({
  background: 'rgba(30, 41, 59, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  height: '300px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #10B981, #2AD388, #10B981)',
  },
}));

const StatusItem = styled(motion.div)<{ status: 'success' | 'warning' | 'error' | 'info' }>(({ theme, status }) => {
  const colors = {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  };

  return {
    background: 'rgba(15, 23, 42, 0.6)',
    border: `1px solid ${colors[status]}40`,
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
      background: colors[status],
    },
  };
});

const StyledLinearProgress = styled(LinearProgress)<{ status: 'success' | 'warning' | 'error' }>(({ status }) => {
  const colors = {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  return {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: colors[status],
      borderRadius: 3,
    },
  };
});

interface SystemMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'success' | 'warning' | 'error';
  icon: React.ReactNode;
  description: string;
}

interface SystemStatusWidgetProps {
  metrics?: SystemMetric[];
}

const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({ metrics }) => {
  // Données simulées si pas de métriques fournies
  const defaultMetrics: SystemMetric[] = [
    {
      id: 'cpu',
      label: 'CPU',
      value: 45,
      unit: '%',
      status: 'success',
      icon: <MemoryIcon />,
      description: 'Processeur système',
    },
    {
      id: 'memory',
      label: 'Mémoire',
      value: 72,
      unit: '%',
      status: 'warning',
      icon: <StorageIcon />,
      description: 'RAM utilisée',
    },
    {
      id: 'storage',
      label: 'Stockage',
      value: 38,
      unit: '%',
      status: 'success',
      icon: <StorageIcon />,
      description: 'Espace disque',
    },
    {
      id: 'network',
      label: 'Réseau',
      value: 95,
      unit: '%',
      status: 'success',
      icon: <WifiIcon />,
      description: 'Connectivité',
    },
    {
      id: 'power',
      label: 'Alimentation',
      value: 88,
      unit: '%',
      status: 'success',
      icon: <BatteryFullIcon />,
      description: 'Niveau batterie',
    },
  ];

  const systemMetrics = metrics || defaultMetrics;
  const overallStatus = systemMetrics.some(m => m.status === 'error') 
    ? 'error' 
    : systemMetrics.some(m => m.status === 'warning') 
    ? 'warning' 
    : 'success';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon sx={{ color: '#10B981' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#F59E0B' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#EF4444' }} />;
      default:
        return <InfoIcon sx={{ color: '#3B82F6' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Optimal';
      case 'warning':
        return 'Attention';
      case 'error':
        return 'Critique';
      default:
        return 'Info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

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
  };

  return (
    <StatusContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header avec statut global */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getStatusIcon(overallStatus)}
          <Typography
            variant="h6"
            sx={{
              color: '#E2E8F0',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            État Système
          </Typography>
        </Box>

        <Chip
          label={getStatusText(overallStatus)}
          size="small"
          sx={{
            backgroundColor: `${getStatusColor(overallStatus)}20`,
            color: getStatusColor(overallStatus),
            border: `1px solid ${getStatusColor(overallStatus)}`,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* Liste des métriques */}
      <Box sx={{ height: '240px', overflowY: 'auto' }}>
        {systemMetrics.map((metric) => (
          <StatusItem
            key={metric.id}
            status={metric.status}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: getStatusColor(metric.status) }}>
                  {metric.icon}
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#E2E8F0', fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    {metric.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#94A3B8', fontSize: '0.75rem' }}
                  >
                    {metric.description}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: getStatusColor(metric.status),
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                {metric.value}{metric.unit}
              </Typography>
            </Box>

            {/* Barre de progression */}
            <Box sx={{ mt: 1 }}>
              <StyledLinearProgress
                variant="determinate"
                value={metric.value}
                status={metric.status}
              />
            </Box>

            {/* Indicateur d'activité pour les métriques critiques */}
            {metric.status === 'error' && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#EF4444',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Effet de pulse pour les métriques en warning */}
            {metric.status === 'warning' && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 90% 10%, #F59E0B20, transparent)',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </StatusItem>
        ))}
      </Box>

      {/* Footer avec timestamp */}
      <Box
        sx={{
          mt: 1,
          pt: 1,
          borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: '#64748B', fontSize: '0.7rem' }}
        >
          Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
        </Typography>
      </Box>

      {/* Indicateur de mise à jour en temps réel */}
      <motion.div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#10B981',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </StatusContainer>
  );
};

export default SystemStatusWidget;
