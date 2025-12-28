import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export type HUDStatus = 'success' | 'warning' | 'danger' | 'neutral';

interface HUDCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: HUDStatus;
  subtitle?: string;
  onClick?: () => void;
}

const statusColors: Record<HUDStatus, string> = {
  success: '#2AD388',
  warning: '#FFA726',
  danger: '#EF5350',
  neutral: '#121A21',
};

export const HUDCard: React.FC<HUDCardProps> = ({
  title,
  value,
  icon,
  status = 'neutral',
  subtitle,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        borderLeft: `4px solid ${statusColors[status]}`,
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        } : {},
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Box
            sx={{
              color: statusColors[status],
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: '#757575',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: statusColors[status],
            mb: subtitle ? 0.5 : 0,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: '#9E9E9E',
              fontSize: '0.875rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
