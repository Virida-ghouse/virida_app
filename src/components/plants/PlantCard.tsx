import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import InfoIcon from '@mui/icons-material/Info';

interface Plant {
  id: string;
  name: string;
  species: string;
  category: string;
  difficulty: string;
  health: number;
  growthStage: string;
  daysToHarvest?: number;
  imageUrl?: string;
  iconEmoji?: string;
}

interface PlantCardProps {
  plant: Plant;
  onSelect: () => void;
}

const StyledCard = styled(Card)<{ health: number }>(({ theme, health }) => {
  let borderTopColor = '#2AD388'; // excellent
  if (health < 60) borderTopColor = '#f1c40f'; // warning
  if (health < 40) borderTopColor = '#e74c3c'; // critical

  return {
    background: '#FFFFFF',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    borderTop: `3px solid ${borderTopColor}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(42, 211, 136, 0.15)',
      transform: 'translateY(-2px)',
    },
  };
});

const IconWrapper = styled(Box)(() => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: '#2AD38820',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2AD388',
  fontSize: '1.5rem',
}));

const HealthBar = styled(LinearProgress)(() => ({
  height: '6px',
  borderRadius: '3px',
  background: '#E1E8EE',
  '& .MuiLinearProgress-bar': {
    borderRadius: '3px',
  },
}));

const getHealthColor = (health: number) => {
  if (health >= 80) return '#2AD388';
  if (health >= 60) return '#f1c40f';
  if (health >= 40) return '#FF9800';
  return '#e74c3c';
};

const getHealthLabel = (health: number) => {
  if (health >= 80) return 'Excellente';
  if (health >= 60) return 'Bonne';
  if (health >= 40) return 'Acceptable';
  return 'Mauvaise';
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return { bg: '#2AD38820', text: '#2AD388' };
    case 'MEDIUM':
      return { bg: '#f1c40f20', text: '#f1c40f' };
    case 'HARD':
      return { bg: '#e74c3c20', text: '#e74c3c' };
    default:
      return { bg: '#E1E8EE', text: '#8091A0' };
  }
};

const getStageLabel = (stage: string) => {
  const stageLabels: Record<string, string> = {
    SEED: '🌱 Graine',
    GERMINATING: '🌱 Germination',
    SEEDLING: '🌿 Jeune plant',
    VEGETATIVE: '🌿 Croissance',
    FLOWERING: '🌸 Floraison',
    FRUITING: '🍅 Fructification',
    RIPENING: '🟡 Maturation',
    HARVESTED: '✂️ Récolté',
    DORMANT: '💤 Dormant',
  };
  return stageLabels[stage] || stage;
};

const PlantCard: React.FC<PlantCardProps> = ({ plant, onSelect }) => {
  const difficultyColor = getDifficultyColor(plant.difficulty);

  return (
    <StyledCard health={plant.health} onClick={onSelect}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5 }}>
        {/* Header avec icône et nom */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5} sx={{ flex: 1 }}>
            <IconWrapper>
              {plant.iconEmoji ? plant.iconEmoji : <LocalFloristIcon />}
            </IconWrapper>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#121A21', fontWeight: 700, mb: 0.25 }}>
                {plant.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8091A0' }}>
                {plant.species}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            sx={{ color: '#2AD388' }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Catégorie et difficulté */}
        <Box display="flex" gap={1}>
          <Chip
            label={plant.category}
            size="small"
            variant="outlined"
            sx={{
              height: '24px',
              fontSize: '0.75rem',
              color: '#8091A0',
              borderColor: '#E1E8EE',
            }}
          />
          <Chip
            label={plant.difficulty === 'EASY' ? 'Facile' : plant.difficulty === 'MEDIUM' ? 'Moyen' : 'Difficile'}
            size="small"
            sx={{
              height: '24px',
              fontSize: '0.75rem',
              background: difficultyColor.bg,
              color: difficultyColor.text,
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Stade de croissance */}
        <Box>
          <Typography variant="caption" sx={{ color: '#8091A0', display: 'block', mb: 0.5 }}>
            {getStageLabel(plant.growthStage)}
          </Typography>
          {plant.daysToHarvest !== undefined && plant.daysToHarvest > 0 && (
            <Typography variant="caption" sx={{ color: '#2AD388', fontWeight: 600 }}>
              📅 {plant.daysToHarvest} jours jusqu'à récolte
            </Typography>
          )}
        </Box>

        {/* Santé */}
        <Box sx={{ mt: 'auto' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: '#8091A0' }}>
              Santé
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: getHealthColor(plant.health),
                fontWeight: 700,
              }}
            >
              {plant.health}% - {getHealthLabel(plant.health)}
            </Typography>
          </Box>
          <HealthBar
            variant="determinate"
            value={plant.health}
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: getHealthColor(plant.health),
              },
            }}
          />
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PlantCard;
