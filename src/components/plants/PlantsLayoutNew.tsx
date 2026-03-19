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
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)] dark:bg-background-dark text-[var(--text-primary)] p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="size-12 md:size-14 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#2AD368] text-2xl md:text-3xl">
              local_florist
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-[var(--text-primary)]">
              Mes <span className="text-[#CBED62]">Plantes</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-sm md:text-base">
              Gérez et surveillez vos cultures en temps réel
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto glass-card backdrop-blur-xl rounded-2xl p-2 border border-white/10 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl transition-all font-semibold whitespace-nowrap flex-shrink-0 ${
                currentTab === tab.id
                  ? 'bg-[#2AD368] text-[var(--btn-primary-text)] shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                {tab.icon}
              </span>
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
          </div>
          {/* Gradient indicators pour montrer qu'on peut slider */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#121A21] to-transparent pointer-events-none lg:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#121A21] to-transparent pointer-events-none lg:hidden" />
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
