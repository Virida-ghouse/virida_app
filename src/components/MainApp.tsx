import React from 'react';
import { Box } from '@mui/material';
import Dashboard from './dashboard/Dashboard';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import PlantConfiguration from './plants/PlantConfiguration';
import SystemStats from './statistics/SystemStats';
import IrrigationSchedule from './schedules/IrrigationSchedule';
import AutomationRules from './automation/AutomationRules';
import EnergyManagement from './energy/EnergyManagement';
import SettingsPanel from './settings/SettingsPanel';
import ChatBot from './chatbot/ChatBot';

const MainApp: React.FC = () => {
  console.log('🎯 MainApp.tsx - Composant MainApp en cours de rendu');
  
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
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

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      background: '#FFFFFF',
      position: 'relative',
    }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <Box
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? '240px' : '72px',
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Header />
        <Box sx={{ p: 0 }}>
          {renderView()}
        </Box>
      </Box>
      
      {/* Chatbot EVE - Toujours visible */}
      <ChatBot sensorData={sensorData} />
    </Box>
  );
};

export default MainApp;
