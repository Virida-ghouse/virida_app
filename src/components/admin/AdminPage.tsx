import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ContactsList from './ContactsList';

type AdminTab = 'contacts' | 'users' | 'logs';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('contacts');

  const tabs: { id: AdminTab; label: string; icon: string; disabled?: boolean }[] = [
    { id: 'contacts', label: 'Contacts', icon: 'mail' },
    { id: 'users', label: 'Utilisateurs', icon: 'group', disabled: true },
    { id: 'logs', label: 'Logs', icon: 'terminal', disabled: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-[#2AD368]/10 border border-[#2AD368]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#2AD368]">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">
                Administration
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Connecté en tant que <span className="text-[#2AD368] font-semibold">{user?.firstName} {user?.lastName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card rounded-2xl p-1.5 mb-6 inline-flex gap-1 border border-[var(--border-color)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`
                px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2
                ${activeTab === tab.id
                  ? 'bg-[#2AD368] text-white shadow-lg shadow-[#2AD368]/20'
                  : tab.disabled
                    ? 'text-[var(--text-secondary)]/30 cursor-not-allowed'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
              {tab.disabled && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--border-color)] text-[var(--text-secondary)]">
                  Bientôt
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'contacts' && <ContactsList />}
        {activeTab === 'users' && (
          <div className="glass-card rounded-2xl p-12 border border-[var(--border-color)] text-center">
            <span className="material-symbols-outlined text-4xl text-[var(--text-secondary)]">group</span>
            <p className="text-[var(--text-secondary)] mt-4">Gestion des utilisateurs bientôt disponible</p>
          </div>
        )}
        {activeTab === 'logs' && (
          <div className="glass-card rounded-2xl p-12 border border-[var(--border-color)] text-center">
            <span className="material-symbols-outlined text-4xl text-[var(--text-secondary)]">terminal</span>
            <p className="text-[var(--text-secondary)] mt-4">Logs système bientôt disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
