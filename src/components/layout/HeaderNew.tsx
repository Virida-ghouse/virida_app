import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationMenu } from '../plants/ui/NotificationMenu';

interface HeaderNewProps {
  currentView?: string;
}

const HeaderNew: React.FC<HeaderNewProps> = ({ currentView = 'dashboard' }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Mapping des vues vers les titres
  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    plants: 'Plantes',
    irrigation: 'Irrigation',
    automation: 'Automation',
    energy: 'Énergie',
    reports: 'Rapports',
    settings: 'Paramètres'
  };

  return (
    <header className="h-20 px-8 border-b border-glass-border flex items-center justify-between bg-background-dark/20 backdrop-blur-md relative z-40">
      {/* Breadcrumb Dynamique */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Organisation</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-white font-medium">Serre Alpha-1</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#2AD368] font-medium">{viewTitles[currentView] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationMenu />

        {/* Divider */}
        <div className="h-8 w-[1px] bg-glass-border"></div>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-2 relative">
            <div className="text-right">
              <p className="text-sm font-bold text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-[#2AD368] uppercase font-bold">Admin</p>
            </div>
            <div
              className="size-10 rounded-full border-2 border-[#2AD368]/50 overflow-hidden cursor-pointer bg-[#2AD368] flex items-center justify-center text-background-dark font-bold shadow-[0_0_15px_rgba(42,211,104,0.4)] hover:shadow-[0_0_25px_rgba(42,211,104,0.6)] transition-all relative z-50"
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
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl p-2 z-[101] bg-[#1a2332] backdrop-blur-xl border border-white/20 shadow-2xl">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle profile click
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-[#2AD368] hover:text-[#121A21] transition-all font-medium"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle settings click
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-[#2AD368] hover:text-[#121A21] transition-all font-medium"
                  >
                    Paramètres
                  </button>
                  <div className="h-[1px] bg-white/10 my-2"></div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500 hover:text-white transition-all font-medium"
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
