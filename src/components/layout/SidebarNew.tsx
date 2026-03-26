import React from 'react';

interface SidebarProps {
  open?: boolean;
  onToggle?: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
  { id: 'plants', label: 'Crops', icon: 'potted_plant' },
  { id: 'irrigation', label: 'Sensors', icon: 'sensors' },
  { id: 'automation', label: 'Automation', icon: 'bolt' },
  { id: 'energy', label: 'Energy', icon: 'bolt' },
  { id: 'reports', label: 'Reports', icon: 'analytics' },
];

const SidebarNew: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <aside className="hidden lg:flex w-64 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] dark:bg-background-dark/50 flex-col justify-between p-6 fixed h-screen">
      {/* Top Section */}
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-[#1a3d2e] rounded-full">
            <img 
              src="/virida_logo.png" 
              alt="Virida Logo" 
              className="size-10 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-[var(--text-primary)]">Vir</span><span className="text-[#CBED62] text-2xl">ida</span><span className="text-primary">.</span>
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all
                  ${
                    isActive
                      ? 'glass-card backdrop-blur-xl text-[#2AD368] border border-[#2AD368]/30 bg-[#2AD368]/10 shadow-[0_0_15px_rgba(42,211,104,0.2)]'
                      : 'text-[var(--text-secondary)] hover:glass-card hover:backdrop-blur-xl hover:bg-[#2AD368]/5 hover:text-[#2AD368] hover:border hover:border-[#2AD368]/20'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        {/* Admin - TODO: Conditionner selon le rôle utilisateur */}
        <div
          onClick={() => onViewChange('admin')}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all
            ${currentView === 'admin'
              ? 'glass-card backdrop-blur-xl text-[#2AD368] border border-[#2AD368]/30 bg-[#2AD368]/10'
              : 'text-[var(--text-secondary)] hover:glass-card hover:backdrop-blur-xl hover:bg-[#2AD368]/5 hover:text-[#2AD368] hover:border hover:border-[#2AD368]/20'
            }
          `}
        >
          <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
          <span className="text-sm font-medium">Admin</span>
        </div>

        {/* Settings */}
        <div
          onClick={() => onViewChange('settings')}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all
            ${currentView === 'settings'
              ? 'glass-card backdrop-blur-xl text-[#2AD368] border border-[#2AD368]/30 bg-[#2AD368]/10'
              : 'text-[var(--text-secondary)] hover:glass-card hover:backdrop-blur-xl hover:bg-[#2AD368]/5 hover:text-[#2AD368] hover:border hover:border-[#2AD368]/20'
            }
          `}
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span className="text-sm font-medium">Paramètres</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNew;
