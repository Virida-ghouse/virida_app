import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { NotificationMenu } from '../plants/ui/NotificationMenu';

interface HeaderNewProps {
  currentView?: string;
  onNotificationClick?: () => void;
}

const HeaderNew: React.FC<HeaderNewProps> = ({ currentView = 'dashboard', onNotificationClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Mapping des vues vers les titres
  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    plants: 'Plantes',
    irrigation: 'Capteurs',
    automation: 'Automation',
    energy: 'Énergie',
    reports: 'Rapports',
    settings: 'Paramètres',
    admin: 'Administration',
  };

  return (
    <header className="h-16 md:h-20 px-4 md:px-8 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/80 backdrop-blur-md relative z-40">
      {/* Breadcrumb Dynamique */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[var(--text-secondary)]">
          <span className="hidden md:inline">Organisation</span>
          <span className="material-symbols-outlined text-xs hidden md:inline">chevron_right</span>
          <span className="text-[var(--text-primary)] font-medium hidden sm:inline">Serre Alpha-1</span>
          <span className="material-symbols-outlined text-xs hidden sm:inline">chevron_right</span>
          <span className="text-[#2AD368] font-medium">{viewTitles[currentView] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="size-9 md:size-10 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] flex items-center justify-center hover:border-[#2AD368]/30 transition-all group"
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          <span className="material-symbols-outlined text-lg md:text-xl text-[var(--text-secondary)] group-hover:text-[#2AD368] transition-colors">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <NotificationMenu onNotificationClick={onNotificationClick} />

        {/* Divider */}
        <div className="h-8 w-[1px] bg-[var(--border-color)]"></div>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-2 relative">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-[#2AD368] uppercase font-bold">{user.role || 'Utilisateur'}</p>
            </div>
            <div
              className="size-10 rounded-full border-2 border-[#2AD368]/50 overflow-hidden cursor-pointer bg-[#2AD368] flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(42,211,104,0.4)] hover:shadow-[0_0_25px_rgba(42,211,104,0.6)] transition-all relative z-50"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {getInitials(user.firstName, user.lastName)}
            </div>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <>
                {/* Overlay pour fermer le menu */}
                <div 
                  className="fixed inset-0 z-[100]" 
                  onClick={() => setShowUserMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl p-2 z-[101] bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-color)] shadow-2xl">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle profile click
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[#2AD368] hover:text-white transition-all font-medium"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle settings click
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[#2AD368] hover:text-white transition-all font-medium"
                  >
                    Paramètres
                  </button>
                  <div className="h-[1px] bg-[var(--border-color)] my-2"></div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all font-medium"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNew;
