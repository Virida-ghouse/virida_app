import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThermostatIcon from '@mui/icons-material/Thermostat';

interface PlantCardMinimalProps {
  id: string;
  name: string;
  photo?: string;
  emoji?: string;
  healthScore: number;
  daysToHarvest: number;
  category?: string;
  difficulty?: string;

  // Nouvelles props pour Plant Care
  yieldMin?: number;
  yieldMax?: number;
  yieldUnit?: string;
  wateringFrequency?: string;
  sunlightHours?: string;
  optimalTempMin?: number;
  optimalTempMax?: number;

  onClick: () => void;
  onDelete?: (id: string) => void;
}

const getHealthColor = (health: number): string => {
  if (health >= 90) return '#2AD388';
  if (health >= 70) return '#81C784';
  if (health >= 50) return '#FFA726';
  return '#EF5350';
};

const getDifficultyConfig = (difficulty?: string) => {
  const normalizedDifficulty = difficulty?.toLowerCase();

  if (normalizedDifficulty === 'easy' || normalizedDifficulty === 'facile' || normalizedDifficulty === 'very easy' || normalizedDifficulty === 'très facile') {
    return { label: 'Facile', color: '#4CAF50', bgcolor: '#E8F5E9' };
  }
  if (normalizedDifficulty === 'medium' || normalizedDifficulty === 'moyen' || normalizedDifficulty === 'moderate') {
    return { label: 'Moyen', color: '#FF9800', bgcolor: '#FFF3E0' };
  }
  if (normalizedDifficulty === 'difficult' || normalizedDifficulty === 'difficile' || normalizedDifficulty === 'hard') {
    return { label: 'Difficile', color: '#F44336', bgcolor: '#FFEBEE' };
  }
  return null;
};

const formatYield = (yieldMin?: number, yieldMax?: number, yieldUnit?: string): string | null => {
  if (!yieldMin && !yieldMax) return null;

  const unit = yieldUnit || 'g';
  if (yieldMin && yieldMax) {
    // Convertir en kg si > 1000g
    if (unit === 'g' && yieldMin >= 1000) {
      return `${(yieldMin / 1000).toFixed(1)}-${(yieldMax / 1000).toFixed(1)}kg`;
    }
    return `${yieldMin}-${yieldMax}${unit}`;
  }
  if (yieldMin) return `~${yieldMin}${unit}`;
  if (yieldMax) return `~${yieldMax}${unit}`;
  return null;
};

export const PlantCardMinimal: React.FC<PlantCardMinimalProps> = ({
  id,
  name,
  photo,
  emoji,
  healthScore,
  daysToHarvest,
  category,
  difficulty,
  yieldMin,
  yieldMax,
  yieldUnit,
  wateringFrequency,
  sunlightHours,
  optimalTempMin,
  optimalTempMax,
  onClick,
  onDelete,
}) => {
  const healthColor = getHealthColor(healthScore);
  const [isHovered, setIsHovered] = useState(false);
  const difficultyConfig = getDifficultyConfig(difficulty);
  const yieldDisplay = formatYield(yieldMin, yieldMax, yieldUnit);

  const tempDisplay = optimalTempMin && optimalTempMax
    ? `${optimalTempMin}-${optimalTempMax}°C`
    : null;

  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Photo grande */}
      <Box
        sx={{
          position: 'relative',
          height: 240,
          bgcolor: '#F9FAFB',
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <CardMedia
            component="img"
            height="240"
            image={photo}
            alt={name}
            sx={{
              objectFit: 'cover',
              width: '100%',
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '5rem' }}>
              {emoji || '🌱'}
            </Typography>
          </Box>
        )}

        {/* Badge de catégorie en haut à gauche */}
        {category && (
          <Chip
            label={category.replace('_', ' ')}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: onDelete && isHovered ? 60 : 12,
              bgcolor: 'rgba(46, 125, 50, 0.95)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'left 0.2s ease',
            }}
          />
        )}

        {/* Bouton de suppression - apparaît au survol */}
        {onDelete && isHovered && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(239, 83, 80, 0.95)',
              color: 'white',
              padding: '8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#D32F2F',
                transform: 'scale(1.1)',
              },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        )}
      </Box>

      {/* Infos */}
      <Box sx={{ p: 2.5 }}>
        {/* Nom */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#121A21',
            mb: 1.5,
            fontSize: '1.1rem',
            lineHeight: 1.3,
          }}
        >
          {name}
        </Typography>

        {/* Difficulté et rendement */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {difficultyConfig && (
            <Chip
              label={difficultyConfig.label}
              size="small"
              sx={{
                bgcolor: difficultyConfig.bgcolor,
                color: difficultyConfig.color,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          )}

          {yieldDisplay && (
            <Chip
              label={`🏆 ${yieldDisplay}`}
              size="small"
              sx={{
                bgcolor: '#FFF9E6',
                color: '#F57C00',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          )}
        </Box>

        {/* Besoins en ressources - détaillés */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mb: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {wateringFrequency && (
            <Tooltip title={`Arrosage: ${wateringFrequency}`} arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <OpacityIcon sx={{ fontSize: 16, color: '#2196F3' }} />
                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                  {wateringFrequency}
                </Typography>
              </Box>
            </Tooltip>
          )}

          {sunlightHours && (
            <Tooltip title={`Lumière: ${sunlightHours}`} arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WbSunnyIcon sx={{ fontSize: 16, color: '#FFA726' }} />
                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                  {sunlightHours}
                </Typography>
              </Box>
            </Tooltip>
          )}

          {tempDisplay && (
            <Tooltip title={`Température optimale: ${tempDisplay}`} arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ThermostatIcon sx={{ fontSize: 16, color: '#F44336' }} />
                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                  {tempDisplay}
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Jours restants */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#9E9E9E',
              fontSize: '0.875rem',
            }}
          >
            {daysToHarvest > 0 ? `${daysToHarvest}j → Récolte` : 'Prêt à récolter'}
          </Typography>
        </Box>

        {/* Barre de progression discrète */}
        <LinearProgress
          variant="determinate"
          value={healthScore}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: '#F5F5F5',
            '& .MuiLinearProgress-bar': {
              bgcolor: healthColor,
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </Card>
  );
};
