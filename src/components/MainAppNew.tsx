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
import { useAuth } from '../contexts/AuthContext';
import { useViridaSensors } from '../hooks/useViridaSensors';

const MainAppNew: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [sidebarOpen] = React.useState(true);
  const [plantsDefaultTab, setPlantsDefaultTab] = React.useState(0);

  const handleNavigatePlantsCare = () => {
    setPlantsDefaultTab(2); // Onglet Soins
    setCurrentView('plants');
  };

  // Vraies données capteurs pour EVE + nom serre primaire
  const { map, primaryGreenhouse } = useViridaSensors(10000);
  const sensorData = React.useMemo(() => ({
    temperature: map.temperature ?? 0,
    humidity:    map.humidity    ?? 0,
    light:       map.light       ?? 0,
    soilMoisture: map.soil_moisture ?? 0,
    ph:          map.ph          ?? 0,
    tds:         map.tds         ?? 0,
  }), [map]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardNew greenhouseName={primaryGreenhouse?.name} />;
      case 'plants':
        return <PlantsLayoutNew defaultTab={plantsDefaultTab} onTabConsumed={() => setPlantsDefaultTab(0)} />;
      case 'irrigation':
        return <IrrigationScheduleNew />;
      case 'automation':
        return <AutomationRulesNew />;
      case 'energy':
        return <EnergyManagementNew />;
      case 'settings':
        return <SettingsPanelNew />;
      case 'admin':
        return user?.role === 'ADMIN' ? <AdminPage /> : <DashboardNew greenhouseName={primaryGreenhouse?.name} />;
      case 'reports':
        return (
          <div className="p-8 text-[var(--text-primary)]">
            Cette fonctionnalité sera bientôt disponible
          </div>
        );
      default:
        return <DashboardNew greenhouseName={primaryGreenhouse?.name} />;
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
        <HeaderNew currentView={currentView} onNotificationClick={handleNavigatePlantsCare} greenhouseName={primaryGreenhouse?.name} />

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
