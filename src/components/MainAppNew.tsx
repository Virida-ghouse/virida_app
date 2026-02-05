import React from 'react';
import DashboardNew from './dashboard/DashboardNew';
import HeaderNew from './layout/HeaderNew';
import SidebarNew from './layout/SidebarNew';
import PlantsLayoutNew from './plants/PlantsLayoutNew';
import IrrigationSchedule from './schedules/IrrigationSchedule';
import AutomationRules from './automation/AutomationRules';
import EnergyManagement from './energy/EnergyManagement';
import SettingsPanel from './settings/SettingsPanel';
import ChatBotNew from './chatbot/ChatBotNew';

const MainAppNew: React.FC = () => {
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [sidebarOpen] = React.useState(true);
  
  // Données des capteurs simulées pour EVE
  const [sensorData] = React.useState({
    temperature: 24.5,
    humidity: 65,
    light: 850,
    soilMoisture: 45
  });

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardNew />;
      case 'plants':
        return <PlantsLayoutNew />;
      case 'irrigation':
        return <IrrigationSchedule />;
      case 'automation':
        return <AutomationRules />;
      case 'energy':
        return <EnergyManagement />;
      case 'settings':
        return <SettingsPanel />;
      case 'reports':
        return (
          <div className="p-8 text-white">
            Cette fonctionnalité sera bientôt disponible
          </div>
        );
      default:
        return <DashboardNew />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-dark text-white">
      {/* Sidebar Navigation */}
      <SidebarNew
        open={sidebarOpen}
        onToggle={() => {}}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <HeaderNew currentView={currentView} />

        {/* Dashboard Content */}
        {renderView()}
      </main>

      {/* Chatbot EVE */}
      <ChatBotNew sensorData={sensorData} />
    </div>
  );
};

export default MainAppNew;
