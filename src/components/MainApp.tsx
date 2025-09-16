import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Dashboard from './dashboard/Dashboard';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import BottomNavigationBar from './layout/BottomNavigation';
import PlantConfiguration from './plants/PlantConfiguration';
import SystemStats from './statistics/SystemStats';
import IrrigationSchedule from './schedules/IrrigationSchedule';
import AutomationRules from './automation/AutomationRules';
import EnergyManagement from './energy/EnergyManagement';
import SettingsPanel from './settings/SettingsPanel';
import ChatBot from './chatbot/ChatBot';

const MainApp: React.FC = () => {
  console.log('🎯 MainApp.tsx - Composant MainApp en cours de rendu');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [configureOpen, setConfigureOpen] = React.useState(false);
  
  // Données des capteurs simulées pour EVE
  const [sensorData] = React.useState({
    temperature: 24.5,
    humidity: 65,
    light: 850,
    soilMoisture: 45
  });
  
  console.log('📊 État MainApp:', { sidebarOpen, currentView, configureOpen });

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'plants':
        return (
          <>
            <PlantConfiguration
              open={configureOpen}
              onClose={() => setConfigureOpen(false)}
            />
            <SystemStats />
          </>
        );
      case 'irrigation':
        return <IrrigationSchedule />;
      case 'automation':
        return <AutomationRules />;
      case 'energy':
        return <EnergyManagement />;
      case 'settings':
        return <SettingsPanel />;
      case 'reports':
        return <Box p={3}>Cette fonctionnalité sera bientôt disponible</Box>;
      default:
        return <Dashboard />;
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      background: '#FFFFFF',
      position: 'relative',
      width: '100%',
      overflow: 'hidden'
    }}>
      <Sidebar 
        open={sidebarOpen} 
        onToggle={handleSidebarToggle}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginLeft: isMobile ? 0 : (sidebarOpen ? '240px' : '72px'),
        transition: 'margin-left 0.3s ease',
        width: isMobile ? '100%' : 'auto',
        maxWidth: isMobile ? '100vw' : 'none',
        overflow: isMobile ? 'hidden' : 'visible'
      }}>
        <Header />
        <Box sx={{ flexGrow: 1, overflow: 'auto', paddingBottom: isMobile ? '80px' : 0 }}>
          {renderView()}
        </Box>
      </Box>
      
      <BottomNavigationBar 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      {/* Chatbot EVE - Visible seulement sur mobile */}
      {isMobile && <ChatBot sensorData={sensorData} />}
      
    </Box>
  );
};

export default MainApp;
