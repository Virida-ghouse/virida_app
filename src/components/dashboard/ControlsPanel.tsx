import React from 'react';
import { Box, Typography, Switch, Slider, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const ControlsContainer = styled(motion.div)(({ theme }) => ({
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
    background: 'linear-gradient(90deg, #3B82F6, #2AD388, #3B82F6)',
  },
}));

const ControlItem = styled(motion.div)<{ active: boolean }>(({ theme, active }) => ({
  background: 'rgba(15, 23, 42, 0.6)',
  border: `1px solid ${active ? '#2AD388' : 'rgba(148, 163, 184, 0.2)'}`,
  borderRadius: '8px',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: active ? '#2AD388' : 'transparent',
  },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#2AD388',
    '&:hover': {
      backgroundColor: 'rgba(42, 211, 136, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#2AD388',
  },
  '& .MuiSwitch-track': {
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#2AD388',
  '& .MuiSlider-track': {
    background: 'linear-gradient(90deg, #2AD388, #10B981)',
  },
  '& .MuiSlider-thumb': {
    backgroundColor: '#2AD388',
    border: '2px solid rgba(42, 211, 136, 0.3)',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(42, 211, 136, 0.16)',
    },
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
  },
}));

interface SystemStatus {
  irrigation: boolean;
  lighting: boolean;
  ventilation: boolean;
  heating: boolean;
}

interface ControlsPanelProps {
  systemStatus: SystemStatus;
  onSystemToggle: (system: keyof SystemStatus, status: boolean) => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ systemStatus, onSystemToggle }) => {
  const [lightingIntensity, setLightingIntensity] = React.useState(75);
  const [ventilationSpeed, setVentilationSpeed] = React.useState(60);
  const [targetTemperature, setTargetTemperature] = React.useState(24);

  const controls = [
    {
      id: 'irrigation',
      title: 'Irrigation',
      icon: <WaterDropIcon />,
      active: systemStatus.irrigation,
      color: '#3B82F6',
      description: 'Système d\'arrosage automatique',
    },
    {
      id: 'lighting',
      title: 'Éclairage',
      icon: <WbIncandescentIcon />,
      active: systemStatus.lighting,
      color: '#F59E0B',
      description: 'LED de croissance',
    },
    {
      id: 'ventilation',
      title: 'Ventilation',
      icon: <AirIcon />,
      active: systemStatus.ventilation,
      color: '#06B6D4',
      description: 'Circulation d\'air',
    },
    {
      id: 'heating',
      title: 'Chauffage',
      icon: <ThermostatIcon />,
      active: systemStatus.heating,
      color: '#EF4444',
      description: 'Régulation thermique',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
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
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <ControlsContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PlayArrowIcon sx={{ color: '#2AD388', mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            color: '#E2E8F0',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          Contrôles
        </Typography>
        <Box
          sx={{
            ml: 'auto',
            px: 1,
            py: 0.25,
            borderRadius: '12px',
            background: 'rgba(42, 211, 136, 0.2)',
            border: '1px solid #2AD388',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#2AD388', fontWeight: 600, fontSize: '10px' }}
          >
            AUTO
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: '240px', overflowY: 'auto' }}>
        {controls.map((control) => (
          <ControlItem
            key={control.id}
            active={control.active}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: control.color }}>
                  {control.icon}
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#E2E8F0', fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    {control.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#94A3B8', fontSize: '0.75rem' }}
                  >
                    {control.description}
                  </Typography>
                </Box>
              </Box>
              <StyledSwitch
                checked={control.active}
                onChange={(e) => onSystemToggle(control.id as keyof SystemStatus, e.target.checked)}
                size="small"
              />
            </Box>

            {/* Contrôles spécifiques selon le système */}
            {control.id === 'lighting' && control.active && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>
                  Intensité: {lightingIntensity}%
                </Typography>
                <StyledSlider
                  value={lightingIntensity}
                  onChange={(_, value) => setLightingIntensity(value as number)}
                  min={0}
                  max={100}
                  size="small"
                />
              </Box>
            )}

            {control.id === 'ventilation' && control.active && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>
                  Vitesse: {ventilationSpeed}%
                </Typography>
                <StyledSlider
                  value={ventilationSpeed}
                  onChange={(_, value) => setVentilationSpeed(value as number)}
                  min={0}
                  max={100}
                  size="small"
                />
              </Box>
            )}

            {control.id === 'heating' && control.active && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>
                  Cible: {targetTemperature}°C
                </Typography>
                <StyledSlider
                  value={targetTemperature}
                  onChange={(_, value) => setTargetTemperature(value as number)}
                  min={15}
                  max={35}
                  size="small"
                />
              </Box>
            )}

            {/* Indicateur d'activité */}
            {control.active && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: control.color,
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Effet de pulse pour les systèmes actifs */}
            {control.active && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 90% 10%, ${control.color}20, transparent)`,
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </ControlItem>
        ))}
      </Box>

      {/* Actions rapides */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <IconButton
          size="small"
          sx={{
            background: 'rgba(42, 211, 136, 0.2)',
            color: '#2AD388',
            border: '1px solid #2AD388',
            '&:hover': {
              background: 'rgba(42, 211, 136, 0.3)',
            },
          }}
        >
          <PlayArrowIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            border: '1px solid #EF4444',
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.3)',
            },
          }}
        >
          <PauseIcon fontSize="small" />
        </IconButton>
      </Box>
    </ControlsContainer>
  );
};

export default ControlsPanel;
