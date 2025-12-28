import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LineChart as RechartLineChart, Line as RechartLine, ResponsiveContainer as RechartResponsiveContainer, XAxis as RechartXAxis, YAxis as RechartYAxis, CartesianGrid as RechartCartesianGrid, Tooltip as RechartTooltip } from 'recharts';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useViridaStore } from '../../store/useViridaStore';

interface GrowthTimelineProps {
  plantId: string;
  recommendations?: any;
}

interface GrowthLog {
  id: string;
  timestamp: string;
  healthScore: number;
  temperature?: number;
  humidity?: number;
  light?: number;
  soilMoisture?: number;
  height?: number;
  leafCount?: number;
  fruitCount?: number;
  notes?: string;
}

const StyledCard = styled(Card)(() => ({
  background: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const RecommendationCard = styled(Card)(() => ({
  background: '#2AD38810',
  border: '1px solid #2AD38840',
  borderRadius: '8px',
}));

const GrowthTimeline: React.FC<GrowthTimelineProps> = ({ plantId, recommendations }) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [logs, setLogs] = useState<GrowthLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'historique de croissance
  useEffect(() => {
    const fetchGrowthLogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          `${apiUrl}/api/plant-advanced/${plantId}/growth-logs?limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLogs(data.data.logs);
          setStats(data.data.stats);
        }
      } catch (err) {
        console.error('Erreur chargement growth logs:', err);
        setError('Impossible de charger l\'historique de croissance');
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchGrowthLogs();
    }
  }, [plantId, apiUrl]);

  const chartData = logs
    .slice()
    .reverse()
    .map((log) => ({
      date: new Date(log.timestamp).toLocaleDateString('fr-FR'),
      health: log.healthScore,
      temp: log.temperature || null,
      humidity: log.humidity || null,
    }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#2AD388' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      {/* Recommandations EVE */}
      {recommendations && (
        <RecommendationCard sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <TrendingUpIcon sx={{ color: '#2AD388', mt: 0.5, flexShrink: 0 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#2AD388', fontWeight: 700, mb: 1 }}>
                  💡 Recommandations d'EVE
                </Typography>
                <Typography variant="body2" sx={{ color: '#121A21', lineHeight: 1.6 }}>
                  {recommendations?.answer ||
                    'EVE analyse votre plante pour vous fournir des recommandations personnalisées.'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </RecommendationCard>
      )}

      {/* Statistiques */}
      {stats && (
        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2} sx={{ mb: 3 }}>
          <StyledCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="#8091A0" sx={{ mb: 1, display: 'block' }}>
                Santé moyenne
              </Typography>
              <Typography variant="h6" sx={{ color: '#2AD388', fontWeight: 700 }}>
                {stats.averageHealth}%
              </Typography>
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="#8091A0" sx={{ mb: 1, display: 'block' }}>
                Température moyenne
              </Typography>
              <Typography variant="h6" sx={{ color: '#2AD388', fontWeight: 700 }}>
                {stats.averageTemperature ? `${stats.averageTemperature}°C` : 'N/A'}
              </Typography>
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="#8091A0" sx={{ mb: 1, display: 'block' }}>
                Tendance de santé
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: stats.healthTrend >= 0 ? '#2AD388' : '#e74c3c',
                  fontWeight: 700,
                }}
              >
                {stats.healthTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.healthTrend)}%
              </Typography>
            </CardContent>
          </StyledCard>
        </Box>
      )}

      {/* Graphique de santé */}
      {chartData.length > 0 ? (
        <StyledCard sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: '#121A21', fontWeight: 700, mb: 2 }}>
              📈 Évolution de la santé
            </Typography>
            <RechartResponsiveContainer width="100%" height={300}>
              <RechartLineChart data={chartData}>
                <RechartCartesianGrid strokeDasharray="3 3" stroke="#E1E8EE" />
                <RechartXAxis dataKey="date" stroke="#8091A0" />
                <RechartYAxis stroke="#8091A0" />
                <RechartTooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E1E8EE',
                    borderRadius: '6px',
                  }}
                />
                <RechartLine
                  type="monotone"
                  dataKey="health"
                  stroke="#2AD388"
                  strokeWidth={2}
                  dot={{ fill: '#2AD388', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Santé"
                />
              </RechartLineChart>
            </RechartResponsiveContainer>
          </CardContent>
        </StyledCard>
      ) : (
        <Alert severity="info">
          Pas encore de données de croissance. Les logs de croissance s'accumuleront au fil du temps.
        </Alert>
      )}

      {/* Détails des logs récents */}
      {logs.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#121A21', fontWeight: 700, mb: 2 }}>
            📋 Détails récents
          </Typography>
          {logs.slice(0, 5).map((log) => (
            <StyledCard key={log.id} sx={{ mb: 1.5 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ color: '#121A21', fontWeight: 700 }}>
                      {new Date(log.timestamp).toLocaleDateString('fr-FR')}
                    </Typography>
                    <Typography variant="caption" color="#8091A0">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2AD388',
                        fontWeight: 700,
                      }}
                    >
                      Santé: {log.healthScore}%
                    </Typography>
                    {log.height && (
                      <Typography variant="caption" color="#8091A0">
                        Hauteur: {log.height}cm
                      </Typography>
                    )}
                  </Box>
                </Box>
                {log.notes && (
                  <Typography variant="caption" sx={{ color: '#121A21', mt: 1, display: 'block' }}>
                    📝 {log.notes}
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GrowthTimeline;
