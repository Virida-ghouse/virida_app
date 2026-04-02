import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ResponsiveContainer, Area, AreaChart, Tooltip } from 'recharts';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ScienceIcon from '@mui/icons-material/Science';

const WidgetContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(46, 125, 50, 0.2)',
  borderRadius: '16px',
  padding: theme.spacing(2),
  width: '100%',
  height: 'auto',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(46, 125, 50, 0.15)',
  },
}));

const ValueDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const StatusIndicator = styled(Box)<{ status: string }>(({ status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: 
    status === 'normal' ? '#2AD388' :
    status === 'warning' ? '#FFA726' : '#FF5252',
  animation: status !== 'normal' ? 'pulse 2s infinite' : 'none',
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 },
  },
}));

interface SensorData {
  id: number;
  type: string;
  value: number;
  unit: string;
  status: string;
  position: { top: string; left: string };
  trend: number[];
  min: number;
  max: number;
  target?: number;
}

interface EnhancedSensorWidgetProps {
  sensor: SensorData;
}

const EnhancedSensorWidget: React.FC<EnhancedSensorWidgetProps> = ({ sensor }) => {
  const getIcon = () => {
    switch (sensor.type) {
      case 'temperature': return <ThermostatIcon sx={{ color: '#2E7D32' }} />;
      case 'humidity': return <OpacityIcon sx={{ color: '#2E7D32' }} />;
      case 'light': return <WbSunnyIcon sx={{ color: '#2E7D32' }} />;
      case 'ph': return <ScienceIcon sx={{ color: '#2E7D32' }} />;
      default: return null;
    }
  };

  const getColor = () => {
    switch (sensor.type) {
      case 'temperature': return '#2E7D32';
      case 'humidity': return '#2E7D32';
      case 'light': return '#2E7D32';
      case 'ph': return '#2E7D32';
      default: return '#2E7D32';
    }
  };

  const chartData = sensor.trend.map((value, index) => ({
    time: index,
    value: value,
  }));

  const progress = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;

  return (
    <WidgetContainer>
      <ValueDisplay>
        {getIcon()}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: '#666', textTransform: 'capitalize' }}>
            {sensor.type}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#121A21' }}>
              {sensor.value}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {sensor.unit}
            </Typography>
            <StatusIndicator status={sensor.status} />
          </Box>
        </Box>
      </ValueDisplay>

      {/* Progress Bar */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            Min: {sensor.min}{sensor.unit}
          </Typography>
          <Typography variant="caption" sx={{ color: '#666' }}>
            Max: {sensor.max}{sensor.unit}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getColor(),
              borderRadius: 3,
            }
          }}
        />
        {sensor.target && (
          <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
            Target: {sensor.target}{sensor.unit}
          </Typography>
        )}
      </Box>

      {/* Mini Chart */}
      <Box sx={{ height: 60, mt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`colorGradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getColor()} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getColor()} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              fill='url(#colorGradient)'
              stroke="#2E7D32"
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: `1px solid ${getColor()}`,
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value}${sensor.unit}`, sensor.type]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Status Message */}
      <Typography 
        variant="caption" 
        sx={{ 
          color: sensor.status === 'normal' ? '#2AD388' : 
                sensor.status === 'warning' ? '#FFA726' : '#FF5252',
          fontWeight: 'medium',
          textAlign: 'center',
          display: 'block',
          mt: 1
        }}
      >
        {sensor.status === 'normal' ? 'Optimal' : 
         sensor.status === 'warning' ? 'Attention Required' : 'Critical Alert'}
      </Typography>
    </WidgetContainer>
  );
};

export default EnhancedSensorWidget;
