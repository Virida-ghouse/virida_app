import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface HealthStatusProps {
  plant: any;
  healthData: any;
}

const ConditionCard = styled(Card)(() => ({
  background: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const HealthStatus: React.FC<HealthStatusProps> = ({ plant, healthData }) => {
  if (!healthData) {
    return (
      <Typography variant="body2" color="#8091A0">
        Chargement des données de santé...
      </Typography>
    );
  }

  const getConditionStatus = (current: number, min: number, max: number) => {
    if (current >= min && current <= max) return { status: 'optimal', label: '✓ Optimal' };
    if (current < min) return { status: 'low', label: '↓ Trop bas' };
    return { status: 'high', label: '↑ Trop haut' };
  };

  const getStatusColor = (status: string) => {
    if (status === 'optimal') return '#2AD388';
    if (status === 'low' || status === 'high') return '#f1c40f';
    return '#8091A0';
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ color: '#121A21', fontWeight: 700, mb: 2 }}>
        État actuel des capteurs
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {healthData.currentConditions?.temperature && (
          <Grid item xs={12}>
            <ConditionCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ color: '#8091A0' }}>
                      🌡️ Température
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#121A21', fontWeight: 700 }}>
                    {healthData.currentConditions.temperature}°C
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (healthData.currentConditions.temperature / 35) * 100)}
                    sx={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: '#E1E8EE',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#2AD388',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#2AD388', fontWeight: 600 }}>
                    {getConditionStatus(
                      healthData.currentConditions.temperature,
                      healthData.optimalConditions.temperature?.min || 15,
                      healthData.optimalConditions.temperature?.max || 30
                    ).label}
                  </Typography>
                </Box>
              </CardContent>
            </ConditionCard>
          </Grid>
        )}

        {healthData.currentConditions?.humidity && (
          <Grid item xs={12}>
            <ConditionCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ color: '#8091A0' }}>
                      💧 Humidité
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#121A21', fontWeight: 700 }}>
                    {healthData.currentConditions.humidity}%
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <LinearProgress
                    variant="determinate"
                    value={healthData.currentConditions.humidity}
                    sx={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: '#E1E8EE',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#2AD388',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#2AD388', fontWeight: 600 }}>
                    {getConditionStatus(
                      healthData.currentConditions.humidity,
                      healthData.optimalConditions.humidity?.min || 50,
                      healthData.optimalConditions.humidity?.max || 80
                    ).label}
                  </Typography>
                </Box>
              </CardContent>
            </ConditionCard>
          </Grid>
        )}

        {healthData.currentConditions?.soil_ph && (
          <Grid item xs={12}>
            <ConditionCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ color: '#8091A0' }}>
                      🧪 pH du sol
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#121A21', fontWeight: 700 }}>
                    {healthData.currentConditions.soil_ph.toFixed(1)}
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (healthData.currentConditions.soil_ph / 14) * 100)}
                    sx={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: '#E1E8EE',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#2AD388',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#2AD388', fontWeight: 600 }}>
                    {getConditionStatus(
                      healthData.currentConditions.soil_ph,
                      healthData.optimalConditions.ph?.min || 6.0,
                      healthData.optimalConditions.ph?.max || 7.5
                    ).label}
                  </Typography>
                </Box>
              </CardContent>
            </ConditionCard>
          </Grid>
        )}
      </Grid>

      {/* Récapitulatif */}
      <Typography variant="subtitle2" sx={{ color: '#121A21', fontWeight: 700, mb: 1.5 }}>
        Recommandations
      </Typography>
      <ConditionCard>
        <CardContent>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#121A21' }}>
            {healthData.alerts && healthData.alerts.length > 0 ? (
              healthData.alerts.map((alert: any, idx: number) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  <Typography variant="body2" component="span" sx={{ color: '#121A21' }}>
                    {alert.message}
                  </Typography>
                </li>
              ))
            ) : (
              <li>
                <Typography variant="body2" sx={{ color: '#2AD388', fontWeight: 600 }}>
                  ✓ Les conditions sont optimales pour votre plante
                </Typography>
              </li>
            )}
          </ul>
        </CardContent>
      </ConditionCard>
    </Box>
  );
};

export default HealthStatus;
