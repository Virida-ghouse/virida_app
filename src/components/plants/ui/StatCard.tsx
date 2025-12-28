import React from 'react';
import { Box, Typography } from '@mui/material';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  color = '#2AD388',
}) => {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'white',
        borderRadius: 2,
        border: '1px solid #F0F0F0',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {/* Label */}
      <Typography
        variant="caption"
        sx={{
          color: '#9E9E9E',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: 600,
          fontSize: '0.7rem',
          display: 'block',
          mb: 1,
        }}
      >
        {label}
      </Typography>

      {/* Value */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: color,
          mb: subtitle ? 0.5 : 0,
          fontSize: '2rem',
        }}
      >
        {value}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: '#BDBDBD',
            fontSize: '0.8rem',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
