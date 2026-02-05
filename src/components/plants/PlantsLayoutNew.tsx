import React, { useState } from 'react';
import MyGardenNew from './MyGardenNew';
import PlantLibraryNew from './PlantLibraryNew';
import PlantCareNew from './PlantCareNew';
import PlantCalendarNew from './PlantCalendarNew';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

const PlantsLayoutNew: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    { id: 0, label: 'Mon Jardin', icon: 'yard' },
    { id: 1, label: 'Bibliothèque', icon: 'menu_book' },
    { id: 2, label: 'Soins', icon: 'checklist' },
    { id: 3, label: 'Calendrier', icon: 'calendar_month' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-background-dark p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-14 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[#2AD368] text-3xl">
              local_florist
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              Mes <span className="text-[#CBED62]">Plantes</span>
            </h1>
            <p className="text-gray-400">
              Gérez et surveillez vos cultures en temps réel
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 glass-card backdrop-blur-xl rounded-2xl p-2 border border-white/10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-semibold ${
                currentTab === tab.id
                  ? 'bg-[#2AD368] text-[#121A21] shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {tab.icon}
              </span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <TabPanel value={currentTab} index={0}>
          <MyGardenNew />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <PlantLibraryNew />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <PlantCareNew />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <PlantCalendarNew />
        </TabPanel>
      </div>
    </div>
  );
};

export default PlantsLayoutNew;
