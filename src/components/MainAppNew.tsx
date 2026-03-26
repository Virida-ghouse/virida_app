import React from 'react';
import DashboardNew from './dashboard/DashboardNew';
import HeaderNew from './layout/HeaderNew';
import SidebarNew from './layout/SidebarNew';
import BottomNav from './layout/BottomNav';
import PlantsLayoutNew from './plants/PlantsLayoutNew';
import IrrigationScheduleNew from './schedules/IrrigationScheduleNew';
import AutomationRulesNew from './automation/AutomationRulesNew';
import EnergyManagementNew from './energy/EnergyManagementNew';
import SettingsPanelNew from './settings/SettingsPanelNew';
import ChatBotNew from './chatbot/ChatBotNew';
import AdminPage from './admin/AdminPage';

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
        return <IrrigationScheduleNew />;
      case 'automation':
        return <AutomationRulesNew />;
      case 'energy':
        return <EnergyManagementNew />;
      case 'settings':
        return <SettingsPanelNew />;
      case 'admin':
        return <AdminPage />;
      case 'reports':
        return (
          <div className="p-8 text-[var(--text-primary)]">
            Cette fonctionnalité sera bientôt disponible
          </div>
        );
      default:
        return <DashboardNew />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sidebar Navigation */}
      <SidebarNew
        open={sidebarOpen}
        onToggle={() => {}}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <HeaderNew currentView={currentView} />

        {/* Dashboard Content */}
        {renderView()}
      </main>

      {/* Chatbot EVE */}
      <ChatBotNew sensorData={sensorData} />

      {/* Bottom Navigation (Mobile only) */}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default MainAppNew;
