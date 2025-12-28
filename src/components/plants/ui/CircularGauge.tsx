import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

export type GaugeSize = 'small' | 'medium' | 'large';

interface CircularGaugeProps {
  value: number; // 0-100
  size?: GaugeSize;
  label?: string;
  showPercentage?: boolean;
}

const sizeMap: Record<GaugeSize, number> = {
  small: 60,
  medium: 100,
  large: 140,
};

const getColor = (value: number): string => {
  if (value >= 80) return '#2AD388'; // Vert - Excellent
  if (value >= 60) return '#CBED82'; // Vert clair - Bon
  if (value >= 40) return '#FFA726'; // Orange - Attention
  return '#EF5350'; // Rouge - Critique
};

const getStatus = (value: number): string => {
  if (value >= 80) return 'Excellente';
  if (value >= 60) return 'Bonne';
  if (value >= 40) return 'À surveiller';
  return 'Critique';
};

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  size = 'medium',
  label,
  showPercentage = true,
}) => {
  const dimension = sizeMap[size];
  const color = getColor(value);
  const status = getStatus(value);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Background circle */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={dimension}
          thickness={4}
          sx={{
            color: '#F5F5F5',
            position: 'absolute',
          }}
        />

        {/* Progress circle */}
        <CircularProgress
          variant="determinate"
          value={value}
          size={dimension}
          thickness={4}
          sx={{
            color: color,
            transition: 'all 0.3s ease',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />

        {/* Center value */}
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showPercentage && (
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: color,
                fontSize: size === 'small' ? '1rem' : size === 'medium' ? '1.5rem' : '2rem',
              }}
            >
              {value}%
            </Typography>
          )}
          <Typography
            variant="caption"
            sx={{
              color: '#9E9E9E',
              fontSize: size === 'small' ? '0.625rem' : '0.75rem',
            }}
          >
            {status}
          </Typography>
        </Box>
      </Box>

      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#121A21',
            textAlign: 'center',
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};
