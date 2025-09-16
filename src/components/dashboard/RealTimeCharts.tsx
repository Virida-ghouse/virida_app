import React from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';

const ChartsContainer = styled(motion.div)(({ theme }) => ({
  background: 'rgba(30, 41, 59, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  height: '400px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #3B82F6, #2AD388, #F59E0B)',
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    color: '#94A3B8',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    '&.Mui-selected': {
      backgroundColor: 'rgba(42, 211, 136, 0.2)',
      color: '#2AD388',
      border: '1px solid #2AD388',
    },
    '&:hover': {
      backgroundColor: 'rgba(42, 211, 136, 0.1)',
    },
  },
}));

const ChartWrapper = styled(motion.div)({
  height: '280px',
  width: '100%',
  '& .recharts-tooltip-wrapper': {
    '& .recharts-default-tooltip': {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid rgba(42, 211, 136, 0.3)',
      borderRadius: '8px',
      color: '#E2E8F0',
    },
  },
});

interface DataPoint {
  time: string;
  temperature: number;
  humidity: number;
  light: number;
  ph: number;
}

interface RealTimeChartsProps {
  data: DataPoint[];
}

const RealTimeCharts: React.FC<RealTimeChartsProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = React.useState('temperature');
  const [chartType, setChartType] = React.useState<'line' | 'area'>('area');

  // Données simulées si pas de données fournies
  const mockData: DataPoint[] = React.useMemo(() => {
    if (data && data.length > 0) return data;
    
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      temperature: 22 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
      humidity: 65 + Math.cos(i * 0.3) * 10 + Math.random() * 5,
      light: i > 6 && i < 20 ? 800 + Math.random() * 200 : Math.random() * 100,
      ph: 6.5 + Math.sin(i * 0.2) * 0.5 + Math.random() * 0.3,
    }));
  }, [data]);

  const metrics = [
    {
      key: 'temperature',
      label: 'Température',
      color: '#EF4444',
      unit: '°C',
      icon: '🌡️',
    },
    {
      key: 'humidity',
      label: 'Humidité',
      color: '#3B82F6',
      unit: '%',
      icon: '💧',
    },
    {
      key: 'light',
      label: 'Luminosité',
      color: '#F59E0B',
      unit: 'lux',
      icon: '☀️',
    },
    {
      key: 'ph',
      label: 'pH',
      color: '#10B981',
      unit: '',
      icon: '⚗️',
    },
  ];

  const currentMetric = metrics.find(m => m.key === selectedMetric) || metrics[0];
  const currentValue = mockData[mockData.length - 1]?.[selectedMetric as keyof DataPoint] || 0;
  const previousValue = mockData[mockData.length - 2]?.[selectedMetric as keyof DataPoint] || 0;
  const trend = currentValue > previousValue ? 'up' : 'down';
  const trendPercentage = Math.abs(((currentValue - previousValue) / previousValue) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(42, 211, 136, 0.3)',
            borderRadius: '8px',
            padding: 1.5,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: currentMetric.color, fontWeight: 600 }}
          >
            {payload[0].value.toFixed(1)} {currentMetric.unit}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <ChartsContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header avec métriques et contrôles */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon sx={{ color: '#2AD388' }} />
          <Typography
            variant="h6"
            sx={{
              color: '#E2E8F0',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Données Temps Réel
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Valeur actuelle et tendance */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="h5"
              sx={{
                color: currentMetric.color,
                fontWeight: 700,
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {currentMetric.icon}
              {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
              <Typography component="span" variant="caption" sx={{ color: '#94A3B8' }}>
                {currentMetric.unit}
              </Typography>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: trend === 'up' ? '#10B981' : '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.75rem',
              }}
            >
              {trend === 'up' ? '↗' : '↘'} {trendPercentage}%
            </Typography>
          </Box>

          {/* Toggle type de graphique */}
          <StyledToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, value) => value && setChartType(value)}
            size="small"
          >
            <ToggleButton value="area">
              <BarChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="line">
              <ShowChartIcon fontSize="small" />
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Box>
      </Box>

      {/* Sélecteur de métrique */}
      <Box sx={{ mb: 2 }}>
        <StyledToggleButtonGroup
          value={selectedMetric}
          exclusive
          onChange={(_, value) => value && setSelectedMetric(value)}
          size="small"
          sx={{ width: '100%' }}
        >
          {metrics.map((metric) => (
            <ToggleButton
              key={metric.key}
              value={metric.key}
              sx={{ flex: 1, fontSize: '0.75rem' }}
            >
              {metric.icon} {metric.label}
            </ToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Box>

      {/* Graphique */}
      <ChartWrapper variants={chartVariants}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={currentMetric.color}
                strokeWidth={2}
                fill={`url(#gradient-${selectedMetric})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: currentMetric.color,
                  stroke: 'rgba(255, 255, 255, 0.8)',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          ) : (
            <LineChart data={mockData}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={currentMetric.color}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: currentMetric.color,
                  stroke: 'rgba(255, 255, 255, 0.8)',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Indicateur de mise à jour en temps réel */}
      <motion.div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#10B981',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </ChartsContainer>
  );
};

export default RealTimeCharts;
