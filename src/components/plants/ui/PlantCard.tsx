import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Badge,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { CircularGauge } from './CircularGauge';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
}

interface PlantCardProps {
  id: string;
  name: string;
  species: string;
  photo?: string;
  emoji?: string;
  healthScore: number;
  growthProgress: number; // 0-100 (% vers récolte)
  daysToHarvest: number;
  category: string;
  growthStage: string;
  alerts?: Alert[];
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  HERB: '#81C784',
  VEGETABLE: '#FFB74D',
  FRUIT: '#EF5350',
  LEAFY_GREEN: '#66BB6A',
};

const stageLabels: Record<string, string> = {
  SEED: 'Graine',
  GERMINATING: 'Germination',
  SEEDLING: 'Jeune pousse',
  VEGETATIVE: 'Croissance',
  FLOWERING: 'Floraison',
  FRUITING: 'Fructification',
  HARVEST_READY: 'Prêt',
};

export const PlantCard: React.FC<PlantCardProps> = ({
  id,
  name,
  species,
  photo,
  emoji,
  healthScore,
  growthProgress,
  daysToHarvest,
  category,
  growthStage,
  alerts = [],
  onClick,
}) => {
  const hasAlerts = alerts.length > 0;
  const categoryColor = categoryColors[category] || '#9E9E9E';

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Header with photo/emoji */}
      <Box
        sx={{
          position: 'relative',
          height: 160,
          bgcolor: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `4px solid ${categoryColor}`,
        }}
      >
        {photo ? (
          <CardMedia
            component="img"
            height="160"
            image={photo}
            alt={name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Typography sx={{ fontSize: '4rem' }}>
            {emoji || '🌱'}
          </Typography>
        )}

        {/* Alert badge */}
        {hasAlerts && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          >
            <Badge badgeContent={alerts.length} color="error">
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: '#FAFAFA',
                  },
                }}
              >
                <NotificationsIcon fontSize="small" color="error" />
              </IconButton>
            </Badge>
          </Box>
        )}

        {/* Health gauge overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'white',
            borderRadius: '50%',
            p: 0.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <CircularGauge value={healthScore} size="small" showPercentage={false} />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 5, pb: 2 }}>
        {/* Plant name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#121A21',
            mb: 0.5,
            textAlign: 'center',
          }}
        >
          {name}
        </Typography>

        {/* Species */}
        <Typography
          variant="caption"
          sx={{
            color: '#9E9E9E',
            display: 'block',
            textAlign: 'center',
            mb: 1.5,
            fontStyle: 'italic',
          }}
        >
          {species}
        </Typography>

        {/* Category & Stage chips */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={category.replace('_', ' ')}
            size="small"
            sx={{
              bgcolor: categoryColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.65rem',
            }}
          />
          <Chip
            label={stageLabels[growthStage] || growthStage}
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#2AD388',
              color: '#2AD388',
              fontWeight: 600,
              fontSize: '0.65rem',
            }}
          />
        </Box>

        {/* Growth progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#757575', fontWeight: 600 }}>
              Progression
            </Typography>
            <Typography variant="caption" sx={{ color: '#2AD388', fontWeight: 700 }}>
              {growthProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={growthProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#F5F5F5',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#2AD388',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Days to harvest */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1,
            bgcolor: '#F5F5F5',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#757575' }}>
            ⏱️
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#121A21' }}>
            {daysToHarvest > 0 ? `${daysToHarvest}j → Récolte` : 'Récolte possible !'}
          </Typography>
        </Box>

        {/* Health status */}
        <Box sx={{ mt: 1.5, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: healthScore >= 80 ? '#2AD388' : healthScore >= 60 ? '#FFA726' : '#EF5350',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.7rem',
            }}
          >
            Santé: {healthScore}% •{' '}
            {healthScore >= 80 ? 'Excellente' : healthScore >= 60 ? 'Bonne' : 'À surveiller'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
