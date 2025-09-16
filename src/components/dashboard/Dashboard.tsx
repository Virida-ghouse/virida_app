import React from 'react';
import { Paper, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import GreenhouseModel from '../3d/GreenhouseModel';
import EnhancedSensorWidget from './EnhancedSensorWidget';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
}));

const GridOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    linear-gradient(90deg, rgba(46, 125, 50, 0.03) 1px, transparent 1px),
    linear-gradient(0deg, rgba(46, 125, 50, 0.03) 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px',
  pointerEvents: 'none',
  zIndex: 0,
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const mockSensors = [
    { 
      id: 1, 
      type: 'temperature', 
      value: 24.5, 
      unit: '°C', 
      status: 'normal',
      trend: [23.2, 23.8, 24.1, 24.5, 24.3, 24.7, 24.5],
      min: 18,
      max: 30,
      target: 24,
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      id: 2, 
      type: 'humidity', 
      value: 65, 
      unit: '%', 
      status: 'warning',
      trend: [62, 64, 66, 65, 67, 65, 65],
      min: 40,
      max: 80,
      target: 60,
      position: { x: 1, y: 0, z: 0 }
    },
    { 
      id: 3, 
      type: 'ph', 
      value: 6.5, 
      unit: 'pH', 
      status: 'normal',
      trend: [6.3, 6.4, 6.5, 6.6, 6.5, 6.4, 6.5],
      min: 5.5,
      max: 7.5,
      target: 6.5,
      position: { x: 0, y: 1, z: 0 }
    },
    { 
      id: 4, 
      type: 'light', 
      value: 850, 
      unit: 'lux', 
      status: 'alert',
      trend: [820, 840, 860, 850, 870, 850, 850],
      min: 200,
      max: 1000,
      target: 800,
      position: { x: 1, y: 1, z: 0 }
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', background: '#FFFFFF' }}>
      <GridOverlay />
      
      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Title */}
        <Typography variant="h4" sx={{ mb: 3, color: '#2E7D32', textAlign: 'center', fontFamily: 'Chillax, sans-serif', fontWeight: 600 }}>
          Greenhouse Monitor
        </Typography>
        
        {/* Responsive Layout */}
        {isMobile ? (
          // Mobile Layout: 3D Model first, then widgets
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 3D Model for Mobile */}
            <StyledPaper sx={{ p: 2, height: '300px', position: 'relative' }}>
              <GreenhouseModel />
            </StyledPaper>
            
            {/* Sensor Widgets Grid for Mobile */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 1
            }}>
              <EnhancedSensorWidget sensor={mockSensors[0]} />
              <EnhancedSensorWidget sensor={mockSensors[1]} />
              <EnhancedSensorWidget sensor={mockSensors[2]} />
              <EnhancedSensorWidget sensor={mockSensors[3]} />
            </Box>
          </Box>
        ) : isTablet ? (
          // Tablet Layout: 2x2 grid with 3D model above
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <StyledPaper sx={{ p: 2, height: '300px', position: 'relative' }}>
              <GreenhouseModel />
            </StyledPaper>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <EnhancedSensorWidget sensor={mockSensors[0]} />
              <EnhancedSensorWidget sensor={mockSensors[1]} />
              <EnhancedSensorWidget sensor={mockSensors[2]} />
              <EnhancedSensorWidget sensor={mockSensors[3]} />
            </Box>
          </Box>
        ) : (
          // Desktop Layout: Original side-by-side layout
          <Box sx={{ display: 'flex', gap: 0, height: '80vh', alignItems: 'stretch' }}>
            {/* Left Side Widgets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '300px' }}>
              <EnhancedSensorWidget sensor={mockSensors[0]} />
              <EnhancedSensorWidget sensor={mockSensors[1]} />
            </Box>
            
            {/* Central 3D Model */}
            <Box sx={{ flex: 1, position: 'relative' }}>
              <StyledPaper sx={{ p: 2, height: '100%', position: 'relative' }}>
                <GreenhouseModel />
              </StyledPaper>
            </Box>
            
            {/* Right Side Widgets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '300px' }}>
              <EnhancedSensorWidget sensor={mockSensors[2]} />
              <EnhancedSensorWidget sensor={mockSensors[3]} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
