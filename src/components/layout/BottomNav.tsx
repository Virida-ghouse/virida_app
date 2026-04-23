import React from 'react';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Home', icon: 'grid_view' },
  { id: 'plants', label: 'Crops', icon: 'potted_plant' },
  { id: 'energy', label: 'Energy', icon: 'bolt' },
  { id: 'automation', label: 'Auto', icon: 'smart_toy' },
  { id: 'settings', label: 'Plus', icon: 'more_horiz' },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-t border-[var(--border-color)] safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`onboarding-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px] ${
                isActive
                  ? 'text-[#2AD368]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <span className={`material-symbols-outlined text-[24px] ${
                  isActive ? 'font-bold' : ''
                }`}>
                  {item.icon}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2AD368] shadow-[0_0_8px_rgba(42,211,104,0.8)]" />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${
                isActive ? 'text-[#2AD368]' : 'text-[var(--text-secondary)]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
