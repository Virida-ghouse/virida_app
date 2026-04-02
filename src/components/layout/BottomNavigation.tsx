import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BoltIcon from '@mui/icons-material/Bolt';
import SettingsIcon from '@mui/icons-material/Settings';

const StyledBottomNavigation = styled(BottomNavigation)(() => ({
  backgroundColor: '#2E7D32',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiBottomNavigationAction-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#FFFFFF',
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.7rem',
      fontWeight: 500,
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
}));


interface BottomNavigationBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  currentView,
  onViewChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  const navigationItems = [
    { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { value: 'plants', label: 'Plants', icon: <LocalFloristIcon /> },
    { value: 'irrigation', label: 'Irrigation', icon: <WaterDropIcon /> },
    { value: 'automation', label: 'Automation', icon: <SmartToyIcon /> },
    { value: 'energy', label: 'Energy', icon: <BoltIcon /> },
    { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    onViewChange(newValue);
  };

  return (
    <Paper sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: '100%',
      maxWidth: '500px', 
      zIndex: 1000, 
      borderRadius: '20px 20px 0 0' 
    }} elevation={3}>
      <StyledBottomNavigation
        value={currentView}
        onChange={handleChange}
        showLabels
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </StyledBottomNavigation>
    </Paper>
  );
};

export default BottomNavigationBar;
