import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRGPD } from '../../contexts/RGPDContext';
import { useChatHistory } from '../../contexts/ChatHistoryContext';
import PrivacyPolicy from '../rgpd/PrivacyPolicy';

export default function SettingsPanelNew() {
  const { user, logout } = useAuth();
  const { theme: currentTheme, setTheme } = useTheme();
  const { openPreferences } = useRGPD();
  const { exportHistory, clearAllHistory } = useChatHistory();
  const [activeTab, setActiveTab] = useState('general');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      timezone: 'UTC+1',
      dateFormat: 'DD/MM/YYYY',
      temperatureUnit: 'celsius',
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      alertThreshold: 'medium',
      dailyReports: true,
      maintenanceAlerts: true,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiration: 90,
      ipWhitelist: ['192.168.1.0/24'],
    },
    display: {
      theme: 'dark',
      dashboardLayout: 'compact',
      refreshRate: 5,
      showGridLines: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      lastBackup: '2025-02-18T10:00:00',
    },
    storage: {
      dataRetention: 90,
      compressionEnabled: true,
      archiveOldData: true,
      storageLocation: 'local',
    },
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: 'language' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Sécurité', icon: 'security' },
    { id: 'display', label: 'Affichage', icon: 'display_settings' },
    { id: 'backup', label: 'Sauvegarde', icon: 'backup' },
    { id: 'storage', label: 'Stockage', icon: 'storage' },
    { id: 'privacy', label: 'Confidentialité', icon: 'shield' },
    { id: 'account', label: 'Compte', icon: 'person' },
  ];

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 3000);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[var(--bg-primary)] dark:bg-background-dark p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="size-12 md:size-14 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#2AD368] text-2xl md:text-3xl">
                settings
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-1">
                Paramètres <span className="text-[#CBED62]">& Configuration</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-sm md:text-base">
                Personnalisez votre expérience Virida
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 rounded-xl bg-[#2AD368] hover:bg-[#1fc75c] text-[#121A21] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2AD368]/20 whitespace-nowrap"
          >
            <span className="material-symbols-outlined">save</span>
            <span>Enregistrer</span>
          </button>
        </div>

        {/* Success Alert */}
        {showSavedAlert && (
          <div className="glass-card backdrop-blur-xl rounded-xl p-4 border border-[#2AD368]/30 bg-[#2AD368]/10 mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2AD368]">check_circle</span>
              <p className="text-[#2AD368] font-semibold">Paramètres enregistrés avec succès !</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#2AD368] text-[var(--btn-primary-text)]'
                : 'glass-card backdrop-blur-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card backdrop-blur-xl rounded-2xl border border-[var(--border-color)]">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Paramètres généraux</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Langue</label>
                <select
                  value={settings.general.language}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, language: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Fuseau horaire</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, timezone: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value="UTC+0">UTC+0</option>
                  <option value="UTC+1">UTC+1 (Paris)</option>
                  <option value="UTC+2">UTC+2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Format de date</label>
                <select
                  value={settings.general.dateFormat}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, dateFormat: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Unité de température</label>
                <select
                  value={settings.general.temperatureUnit}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, temperatureUnit: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Notifications</h2>
            
            {[
              { key: 'emailAlerts', label: 'Alertes par email', desc: 'Recevoir les alertes importantes par email' },
              { key: 'pushNotifications', label: 'Notifications push', desc: 'Recevoir les alertes dans le navigateur' },
              { key: 'dailyReports', label: 'Rapports quotidiens', desc: 'Recevoir un résumé quotidien' },
              { key: 'maintenanceAlerts', label: 'Alertes de maintenance', desc: 'Être notifié des maintenances' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [item.key]: !settings.notifications[item.key as keyof typeof settings.notifications] }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-[#2AD368]' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">Seuil d'alerte</label>
              <select
                value={settings.notifications.alertThreshold}
                onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, alertThreshold: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
              </select>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Sécurité</h2>
            
            <div className="flex items-center justify-between p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Authentification à deux facteurs</p>
                <p className="text-xs text-[var(--text-tertiary)]">Sécurité renforcée avec 2FA</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, security: { ...settings.security, twoFactorAuth: !settings.security.twoFactorAuth } })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security.twoFactorAuth ? 'bg-[#2AD368]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Délai d'expiration de session (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: Number(e.target.value) } })}
                className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
              />
            </div>

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Expiration du mot de passe (jours)</label>
              <input
                type="number"
                value={settings.security.passwordExpiration}
                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, passwordExpiration: Number(e.target.value) } })}
                className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
              />
            </div>

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)]">Liste blanche IP</label>
                  <p className="text-xs text-[var(--text-tertiary)]">Restreindre l'accès à des adresses IP spécifiques</p>
                </div>
                <button className="p-2 hover:text-[var(--text-primary)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.security.ipWhitelist.map((ip, index) => (
                  <span key={index} className="px-3 py-1 rounded-lg bg-[#2AD368]/20 border border-[#2AD368]/30 text-[#2AD368] text-xs font-semibold">
                    {ip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Display Settings */}
        {activeTab === 'display' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Affichage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Thème</label>
                <select
                  value={currentTheme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value="dark">Sombre</option>
                  <option value="light">Clair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Disposition du tableau de bord</label>
                <select
                  value={settings.display.dashboardLayout}
                  onChange={(e) => setSettings({ ...settings, display: { ...settings.display, dashboardLayout: e.target.value } })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Confortable</option>
                  <option value="spacious">Spacieux</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Taux de rafraîchissement (secondes)</label>
                <select
                  value={settings.display.refreshRate}
                  onChange={(e) => setSettings({ ...settings, display: { ...settings.display, refreshRate: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value={5}>5 secondes</option>
                  <option value={10}>10 secondes</option>
                  <option value={30}>30 secondes</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)] mt-6">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Afficher les lignes de grille</p>
                <p className="text-xs text-[var(--text-tertiary)]">Afficher les lignes de grille sur les graphiques</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, display: { ...settings.display, showGridLines: !settings.display.showGridLines } })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.display.showGridLines ? 'bg-[#2AD368]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.display.showGridLines ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Backup Settings */}
        {activeTab === 'backup' && (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Sauvegarde</h2>
            
            <div className="flex items-center justify-between p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Sauvegarde automatique</p>
                <p className="text-xs text-[var(--text-tertiary)]">Sauvegardes programmées</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, backup: { ...settings.backup, autoBackup: !settings.backup.autoBackup } })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.backup.autoBackup ? 'bg-[#2AD368]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Fréquence de sauvegarde</label>
              <select
                value={settings.backup.backupFrequency}
                onChange={(e) => setSettings({ ...settings, backup: { ...settings.backup, backupFrequency: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
              >
                <option value="hourly">Toutes les heures</option>
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
              </select>
            </div>

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Période de rétention (jours)</label>
              <input
                type="number"
                value={settings.backup.retentionPeriod}
                onChange={(e) => setSettings({ ...settings, backup: { ...settings.backup, retentionPeriod: Number(e.target.value) } })}
                className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
              />
            </div>

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Dernière sauvegarde</p>
                <p className="text-xs text-[var(--text-tertiary)]">{new Date(settings.backup.lastBackup).toLocaleString('fr-FR')}</p>
              </div>
              <button className="w-full px-4 py-2.5 rounded-xl bg-[#2AD368] hover:bg-[#1fc75c] text-[#121A21] font-semibold transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">backup</span>
                <span>Sauvegarder maintenant</span>
              </button>
            </div>
          </div>
        )}

        {/* Storage Settings */}
        {activeTab === 'storage' && (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Stockage</h2>
            
            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Rétention des données (jours)</label>
              <p className="text-xs text-[var(--text-tertiary)] mb-3">Durée de conservation des données historiques</p>
              <input
                type="number"
                value={settings.storage.dataRetention}
                onChange={(e) => setSettings({ ...settings, storage: { ...settings.storage, dataRetention: Number(e.target.value) } })}
                className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Compression des données</p>
                <p className="text-xs text-[var(--text-tertiary)]">Activer la compression pour économiser de l'espace</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, storage: { ...settings.storage, compressionEnabled: !settings.storage.compressionEnabled } })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.storage.compressionEnabled ? 'bg-[#2AD368]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.storage.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Archiver les anciennes données</p>
                <p className="text-xs text-[var(--text-tertiary)]">Archiver automatiquement les données anciennes</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, storage: { ...settings.storage, archiveOldData: !settings.storage.archiveOldData } })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.storage.archiveOldData ? 'bg-[#2AD368]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.storage.archiveOldData ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)]">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Emplacement de stockage</label>
              <p className="text-xs text-[var(--text-tertiary)] mb-3">Où stocker les données et sauvegardes</p>
              <select
                value={settings.storage.storageLocation}
                onChange={(e) => setSettings({ ...settings, storage: { ...settings.storage, storageLocation: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
              >
                <option value="local">Local</option>
                <option value="cloud">Cloud</option>
                <option value="hybrid">Hybride</option>
              </select>
            </div>
          </div>
        )}

        {/* Privacy & RGPD Settings */}
        {activeTab === 'privacy' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2AD368]">shield</span>
                Confidentialité & RGPD
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Gérez vos données personnelles et vos préférences de confidentialité
              </p>
            </div>

            {/* Statut des cookies */}
            <div className="glass-card backdrop-blur-xl rounded-xl p-6 border border-[var(--border-color)] bg-gradient-to-br from-[#2AD368]/5 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Statut des cookies</h3>
                  <p className="text-xs text-[var(--text-tertiary)]">2 catégories activées sur 3</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#2AD368]/20 border border-[#2AD368]/30 text-[#2AD368] text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Configuré
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#2AD368] text-[var(--text-primary)] text-xs font-semibold">
                  Essentiels
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#CBED62] text-[#121A21] text-xs font-semibold">
                  Fonctionnels
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#CBED62] text-[#121A21] text-xs font-semibold">
                  Analytiques
                </span>
              </div>
            </div>

            {/* Actions principales */}
            <div className="space-y-3">
              {/* Gérer les cookies */}
              <button onClick={openPreferences} className="w-full p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#2AD368]/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#2AD368]">cookie</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Gérer les cookies</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Modifier vos préférences de cookies et traceurs</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">chevron_right</span>
              </button>

              {/* Politique de confidentialité */}
              <button onClick={() => setShowPrivacyPolicy(true)} className="w-full p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#2AD368]/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#2AD368]">description</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Politique de confidentialité</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Consulter notre politique RGPD complète</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">chevron_right</span>
              </button>

              <div className="border-t border-[var(--border-color)] my-4"></div>

              {/* Exporter conversations avec Eve */}
              <button onClick={() => { exportHistory(); alert('Conversations exportées !'); }} className="w-full p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#2AD368]/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#2AD368]">chat</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Exporter mes conversations avec Eve</p>
                    <p className="text-xs text-[var(--text-tertiary)]">3 messages dans 1 conversation(s)</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">chevron_right</span>
              </button>

              {/* Supprimer conversations avec Eve */}
              <button onClick={() => { if (confirm('Supprimer toutes vos conversations avec Eve ?')) { clearAllHistory(); alert('Conversations supprimées.'); } }} className="w-full p-4 glass-card backdrop-blur-xl rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-400">delete</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-red-400">Supprimer mes conversations avec Eve</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Effacer tout l'historique de chat (Art. 17 RGPD)</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-red-400">chevron_right</span>
              </button>

              <div className="border-t border-[var(--border-color)] my-4"></div>

              {/* Exporter données RGPD */}
              <button onClick={() => {
                const data = { user, consent: localStorage.getItem('virida_rgpd_consent'), consentDate: localStorage.getItem('virida_rgpd_consent_date'), theme: currentTheme };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'virida-rgpd-export.json'; a.click(); URL.revokeObjectURL(url);
              }} className="w-full p-4 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#2AD368]/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#2AD368]">download</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Exporter mes données RGPD</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Télécharger vos données de consentement (Art. 20 RGPD)</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">chevron_right</span>
              </button>

              {/* Supprimer données RGPD */}
              <button onClick={() => { if (confirm('Supprimer toutes vos données de consentement RGPD ?')) { localStorage.removeItem('virida_rgpd_consent'); localStorage.removeItem('virida_rgpd_consent_date'); alert('Données RGPD supprimées. La page va se recharger.'); window.location.reload(); } }} className="w-full p-4 glass-card backdrop-blur-xl rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-400">delete_forever</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-red-400">Supprimer mes données RGPD</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Effacer toutes les données de consentement (Art. 17 RGPD)</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-red-400">chevron_right</span>
              </button>
            </div>

            {/* Informations protection données */}
            <div className="glass-card backdrop-blur-xl rounded-xl p-4 border-l-4 border-[#2AD368] bg-[#2AD368]/5">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-[var(--text-primary)]">🇫🇷 Protection de vos données :</strong> Toutes vos données sont hébergées en France (Clever Cloud). Vous pouvez exercer vos droits RGPD à tout moment via virida.ghouse@gmail.com
              </p>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Mon compte</h2>
            
            {user && (
              <div className="glass-card backdrop-blur-xl rounded-xl p-6 border border-[var(--border-color)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-16 bg-[#2AD368]/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#2AD368] text-3xl">person</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--text-primary)]">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#2AD368]/30 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">edit</span>
                    <span>Modifier le profil</span>
                  </button>
                  
                  <button className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#2AD368]/30 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">lock</span>
                    <span>Changer le mot de passe</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal Politique de confidentialité */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9000] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowPrivacyPolicy(false)}>
          <div className="bg-[var(--bg-secondary)] w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl border border-[var(--border-color)] shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#2AD368]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#2AD368]">shield</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">Politique de confidentialité</h2>
                  <p className="text-[10px] text-[var(--text-secondary)]">Conforme au RGPD (UE 2016/679)</p>
                </div>
              </div>
              <button onClick={() => setShowPrivacyPolicy(false)} className="size-8 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <PrivacyPolicy />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
