import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ScienceIcon from '@mui/icons-material/Science';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export type SensorType = 'temperature' | 'humidity' | 'light' | 'ph' | 'ec' | 'vwc';
export type SensorStatus = 'ok' | 'warning' | 'critical';
export type Trend = 'up' | 'down' | 'stable';

interface SensorIndicatorProps {
  type: SensorType;
  value: number;
  unit: string;
  optimalRange?: [number, number];
  status?: SensorStatus;
  trend?: Trend;
  compact?: boolean;
}

const sensorIcons: Record<SensorType, React.ReactNode> = {
  temperature: <ThermostatIcon />,
  humidity: <OpacityIcon />,
  light: <WbSunnyIcon />,
  ph: <ScienceIcon />,
  ec: <FlashOnIcon />,
  vwc: <WaterDropIcon />,
};

const sensorLabels: Record<SensorType, string> = {
  temperature: 'Température',
  humidity: 'Humidité',
  light: 'Luminosité',
  ph: 'pH',
  ec: 'EC',
  vwc: 'Humidité Sol',
};

const statusColors: Record<SensorStatus, string> = {
  ok: '#2AD388',
  warning: '#FFA726',
  critical: '#EF5350',
};

const trendIcons: Record<Trend, React.ReactNode> = {
  up: <TrendingUpIcon fontSize="small" />,
  down: <TrendingDownIcon fontSize="small" />,
  stable: <TrendingFlatIcon fontSize="small" />,
};

export const SensorIndicator: React.FC<SensorIndicatorProps> = ({
  type,
  value,
  unit,
  optimalRange,
  status = 'ok',
  trend,
  compact = false,
}) => {
  const getStatus = (): SensorStatus => {
    if (!optimalRange) return status;
    const [min, max] = optimalRange;
    if (value < min || value > max) return 'critical';
    if (value < min * 1.1 || value > max * 0.9) return 'warning';
    return 'ok';
  };

  const currentStatus = getStatus();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: compact ? 1 : 2,
        borderRadius: 2,
        bgcolor: '#FAFAFA',
        border: `2px solid ${statusColors[currentStatus]}`,
        transition: 'all 0.3s ease',
        minWidth: compact ? '80px' : '120px',
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          color: statusColors[currentStatus],
          display: 'flex',
          alignItems: 'center',
          fontSize: compact ? '20px' : '28px',
        }}
      >
        {sensorIcons[type]}
      </Box>

      {/* Value */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant={compact ? 'h6' : 'h5'}
          sx={{
            fontWeight: 700,
            color: statusColors[currentStatus],
            lineHeight: 1,
          }}
        >
          {value}
          <Typography
            component="span"
            variant={compact ? 'caption' : 'body2'}
            sx={{ ml: 0.5, fontWeight: 500 }}
          >
            {unit}
          </Typography>
        </Typography>
      </Box>

      {/* Label */}
      {!compact && (
        <Typography
          variant="caption"
          sx={{
            color: '#757575',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 600,
            fontSize: '0.65rem',
          }}
        >
          {sensorLabels[type]}
        </Typography>
      )}

      {/* Status chip */}
      <Chip
        size="small"
        label={currentStatus === 'ok' ? '✓ OK' : currentStatus === 'warning' ? '⚠ Attention' : '✗ Critique'}
        sx={{
          bgcolor: statusColors[currentStatus],
          color: 'white',
          fontWeight: 600,
          fontSize: '0.65rem',
          height: compact ? '20px' : '24px',
        }}
      />

      {/* Trend indicator */}
      {trend && (
        <Box
          sx={{
            color: '#9E9E9E',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
          }}
        >
          {trendIcons[trend]}
        </Box>
      )}

      {/* Optimal range */}
      {optimalRange && !compact && (
        <Typography
          variant="caption"
          sx={{
            color: '#BDBDBD',
            fontSize: '0.625rem',
          }}
        >
          {optimalRange[0]}-{optimalRange[1]} {unit}
        </Typography>
      )}
    </Box>
  );
};
