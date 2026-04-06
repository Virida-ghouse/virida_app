import React from 'react';
import GlassCard from '../ui/GlassCard';
import StatCard from '../ui/StatCard';
import GreenhouseModel from '../3d/GreenhouseModel';
import { useViridaSensors } from '../../hooks/useViridaSensors';

const DashboardNew: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [irrigationEnabled, setIrrigationEnabled] = React.useState(true);
  const [lightEnabled, setLightEnabled] = React.useState(true);
  const [phEnabled, setPhEnabled] = React.useState(false);

  const { map, alerts, loading, lastSync, connected, onlineSensors, offlineSensors } = useViridaSensors(5000);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Formatage dernière synchro
  const syncLabel = React.useMemo(() => {
    if (!lastSync) return 'En attente…';
    const diffSec = Math.round((Date.now() - lastSync.getTime()) / 1000);
    if (diffSec < 5) return 'À l\'instant';
    if (diffSec < 60) return `il y a ${diffSec}s`;
    return `il y a ${Math.round(diffSec / 60)} min`;
  }, [lastSync]);

  // Couleur pH pour StatCard
  const phColor = map.ph == null ? 'text-[var(--text-secondary)]'
    : (map.ph < 5.5 || map.ph > 7.5) ? 'text-red-400' : 'text-purple-400';

  // Compteurs pour la section 3D
  const criticalCount = alerts.filter(a => a.level === 'critical').length;

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 custom-scrollbar bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
              <span className="text-[var(--text-primary)]">Serre </span>
              <span className="text-[#CBED62] text-4xl md:text-5xl">Alpha-1</span>
            </h2>
            <p className="text-[var(--text-secondary)] flex items-center gap-2 text-sm md:text-base">
              <span className={`flex h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(42,211,104,0.6)] ${connected ? 'bg-[#2AD368]' : 'bg-red-400'}`}></span>
              {loading ? (
                <span className="text-[var(--text-secondary)]">Connexion aux capteurs…</span>
              ) : connected ? (
                <>
                  <span className="hidden sm:inline">
                    {criticalCount > 0
                      ? <><span className="text-red-400">{criticalCount} alerte{criticalCount > 1 ? 's' : ''} critique{criticalCount > 1 ? 's' : ''}</span> • Dernière synchro {syncLabel}</>
                      : <><span className="text-[#2AD368]">Tous les systèmes opérationnels</span> • Dernière synchro {syncLabel}</>
                    }
                  </span>
                  <span className="sm:hidden text-[#2AD368]">Opérationnel</span>
                </>
              ) : (
                <span className="text-red-400">Hors ligne — vérifiez la connexion au Pi</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Planning
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-[#2AD368] text-[var(--btn-primary-text)] rounded-xl text-sm font-bold shadow-[0_8px_20px_rgba(42,211,104,0.5)] hover:shadow-[0_12px_30px_rgba(42,211,104,0.8)] hover:scale-105 transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nouveau Module
            </button>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left (8 col) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Stats — vraies données */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon="thermostat"
                iconColor="text-[#2AD368]"
                iconBg="bg-[#2AD368]/10"
                label="TEMPÉRATURE"
                value={map.temperature != null ? map.temperature.toFixed(1) : '—'}
                unit="°C"
                trend={map.temperature != null ? '' : 'Hors ligne'}
                trendColor={map.temperature != null ? 'text-[#2AD368]' : 'text-[var(--text-tertiary)]'}
              />
              <StatCard
                icon="humidity_percentage"
                iconColor="text-blue-400"
                iconBg="bg-blue-400/10"
                label="HUMIDITÉ"
                value={map.humidity != null ? Math.round(map.humidity) : '—'}
                unit="%"
                trend={map.humidity != null ? '' : 'Hors ligne'}
                trendColor="text-[var(--text-tertiary)]"
              />
              <StatCard
                icon="science"
                iconColor={phColor}
                iconBg="bg-purple-400/10"
                label="NIVEAU PH"
                value={map.ph != null ? map.ph.toFixed(2) : '—'}
                unit=" pH"
                trend={map.ph != null ? ((map.ph < 5.5 || map.ph > 7.5) ? '⚠ Anormal' : 'Stable') : 'Hors ligne'}
                trendColor={map.ph != null ? ((map.ph < 5.5 || map.ph > 7.5) ? 'text-red-400' : 'text-[var(--text-tertiary)]') : 'text-[var(--text-tertiary)]'}
              />
              <StatCard
                icon="light_mode"
                iconColor="text-orange-400"
                iconBg="bg-orange-400/10"
                label="LUMIÈRE"
                value={map.light != null ? Math.round(map.light) : '—'}
                unit=" lux"
                trend={map.light != null ? (map.light < 500 ? '⚠ Faible' : 'Normal') : 'Hors ligne'}
                trendColor={map.light != null ? (map.light < 500 ? 'text-orange-400' : 'text-[#2AD368]') : 'text-[var(--text-tertiary)]'}
              />
            </div>

            {/* Alertes dynamiques */}
            {alerts.length > 0 && (
              <GlassCard className="p-5 rounded-3xl border border-red-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400 text-xl">warning</span>
                    <h4 className="font-bold text-[var(--text-primary)]">Alertes actives</h4>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${criticalCount > 0 ? 'bg-red-500/15 text-red-400' : 'bg-orange-400/15 text-orange-400'}`}>
                    {alerts.length} alerte{alerts.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {alerts.map((a, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-2xl border-l-4 ${
                        a.level === 'critical'
                          ? 'bg-red-500/8 border-red-500 border border-red-500/20'
                          : 'bg-orange-400/8 border-orange-400 border border-orange-400/20'
                      }`}
                    >
                      <div className={`size-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        a.level === 'critical' ? 'bg-red-500/15 text-red-400' : 'bg-orange-400/15 text-orange-400'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {a.level === 'critical' ? 'error' : 'warning_amber'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className={`text-sm font-bold ${a.level === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                            {a.label}
                          </p>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                            a.level === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-400/20 text-orange-400'
                          }`}>
                            {a.level === 'critical' ? 'CRITIQUE' : 'ATTENTION'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">{a.message}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">→ {a.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* 3D Visualization */}
            <GlassCard className="rounded-3xl overflow-hidden relative group border-2 border-[var(--border-color)] shadow-xl hover:shadow-2xl transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent z-[5]"></div>
              <div className="w-full h-[300px] md:h-[400px] relative z-[1]">
                <GreenhouseModel />
              </div>
              <div className="absolute inset-0 z-[100] p-4 md:p-8 flex flex-col justify-between pointer-events-none">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#2AD368] text-[#121A21] text-[10px] font-black px-4 py-1.5 rounded-full uppercase pointer-events-auto shadow-[0_4px_20px_rgba(42,211,104,0.8)] border-2 border-[#2AD368] ring-2 ring-[#2AD368]/30">
                      Zone Active
                    </span>
                    <span className="bg-[var(--bg-secondary)] backdrop-blur-xl text-[var(--text-primary)] text-[10px] font-black px-4 py-1.5 rounded-full uppercase pointer-events-auto border-2 border-[#CBED62] shadow-[0_4px_20px_rgba(203,237,98,0.5)] ring-2 ring-[#CBED62]/20">
                      Secteur 01
                    </span>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="bg-[var(--bg-secondary)]/95 backdrop-blur-xl size-10 rounded-full flex items-center justify-center text-[var(--text-primary)] pointer-events-auto hover:bg-primary hover:text-white transition-all border border-[var(--border-color)] shadow-lg"
                  >
                    <span className="material-symbols-outlined">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                  </button>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between pointer-events-auto gap-3">
                  <div className="bg-[var(--bg-secondary)]/95 backdrop-blur-xl px-4 py-3 md:px-5 md:py-4 rounded-2xl border border-[var(--border-color)] shadow-xl">
                    <h3 className="text-base md:text-xl font-bold mb-1">
                      <span className="text-[var(--text-primary)]">Visualisation </span>
                      <span className="text-[#CBED62]">3D</span>
                      <span className="text-[var(--text-primary)] hidden md:inline"> de la Serre</span>
                    </h3>
                    <p className="text-[var(--text-secondary)] text-xs md:text-sm hidden md:block">
                      Modèle 3D en temps réel pour le monitoring environnemental.
                    </p>
                  </div>
                  <div className="flex gap-2 md:gap-3 flex-wrap">
                    <div className="text-center bg-[var(--bg-secondary)]/95 backdrop-blur-xl px-3 py-2 md:px-5 md:py-3 rounded-xl border border-[var(--border-color)] shadow-lg">
                      <p className="text-[9px] md:text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">Capteurs</p>
                      <p className="text-xl md:text-2xl font-black text-[#CBED62]">{onlineSensors.length}</p>
                    </div>
                    <div className="text-center bg-[var(--bg-secondary)]/95 backdrop-blur-xl px-3 py-2 md:px-5 md:py-3 rounded-xl border border-[var(--border-color)] shadow-lg">
                      <p className="text-[9px] md:text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">Disponibilité</p>
                      <p className="text-2xl font-black text-[var(--text-primary)]">
                        {onlineSensors.length + offlineSensors.length > 0
                          ? `${Math.round((onlineSensors.length / (onlineSensors.length + offlineSensors.length)) * 100)}%`
                          : '—'}
                      </p>
                    </div>
                    {alerts.length > 0 && (
                      <div className="text-center bg-red-500/10 backdrop-blur-xl px-3 py-2 md:px-5 md:py-3 rounded-xl border border-red-500/30 shadow-lg">
                        <p className="text-[9px] md:text-[10px] text-red-400 font-bold uppercase mb-1">Alertes</p>
                        <p className="text-xl md:text-2xl font-black text-red-400">{alerts.length}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Fullscreen Modal */}
            {isFullscreen && (
              <div className="fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-md flex items-center justify-center p-8">
                <div className="w-full h-full relative">
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 glass-card backdrop-blur-xl size-12 rounded-full flex items-center justify-center text-[var(--text-primary)] hover:bg-primary/30 hover:border-primary transition-all border border-[var(--border-color)] z-10"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="w-full h-full rounded-3xl overflow-hidden glass-card border-2 border-primary/30">
                    <GreenhouseModel />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right (4 col) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Capteurs supplémentaires */}
            {(map.soil_moisture != null || map.tds != null) && (
              <GlassCard className="p-5 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">Capteurs avancés</h4>
                  <span className="material-symbols-outlined text-[#2AD368] text-xl">sensors</span>
                </div>
                <div className="space-y-3">
                  {map.soil_moisture != null && (
                    <div className="flex items-center justify-between p-3 bg-[var(--glass-bg)] rounded-2xl border border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <div className="size-9 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400">
                          <span className="material-symbols-outlined text-[18px]">grass</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Humidité Sol</p>
                          <p className="text-[10px] text-[var(--text-tertiary)]">
                            {map.soil_moisture < 30 ? '⚠ Trop sec' : map.soil_moisture > 80 ? '⚠ Trop humide' : 'Optimal'}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xl font-black ${map.soil_moisture < 30 || map.soil_moisture > 80 ? 'text-orange-400' : 'text-[#2AD368]'}`}>
                        {Math.round(map.soil_moisture)}%
                      </p>
                    </div>
                  )}
                  {map.tds != null && (
                    <div className="flex items-center justify-between p-3 bg-[var(--glass-bg)] rounded-2xl border border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <div className="size-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                          <span className="material-symbols-outlined text-[18px]">water_drop</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Nutriments (TDS)</p>
                          <p className="text-[10px] text-[var(--text-tertiary)]">
                            {map.tds < 150 ? '⚠ Insuffisant' : map.tds > 1200 ? '⚠ Trop élevé' : 'Optimal'}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xl font-black ${map.tds < 150 ? 'text-orange-400' : 'text-[#2AD368]'}`}>
                        {Math.round(map.tds)}<span className="text-xs font-normal text-[var(--text-tertiary)]">ppm</span>
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* Active Automations */}
            <GlassCard className="p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Automations</h4>
                <span className="material-symbols-outlined text-primary text-xl">tune</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[var(--glass-bg)] rounded-2xl border border-[var(--border-color)] hover:bg-[var(--glass-hover)] hover:border-blue-400/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                      <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Irrigation Automatique</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] font-medium">Toutes les 6h • Secteur A</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIrrigationEnabled(!irrigationEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${irrigationEnabled ? 'bg-gradient-to-r from-[#2AD368] to-[#1fc75c] shadow-[0_0_15px_rgba(42,211,104,0.4)]' : 'bg-[var(--border-color)]'}`}
                  >
                    <div className={`size-5 bg-white rounded-full absolute top-0.5 shadow-lg transition-all duration-300 ${irrigationEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--glass-bg)] rounded-2xl border border-[var(--border-color)] hover:bg-[var(--glass-hover)] hover:border-orange-400/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400">
                      <span className="material-symbols-outlined">light_mode</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Optimisation Spectrale</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] font-medium">Dynamique • Cycle Complet</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLightEnabled(!lightEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${lightEnabled ? 'bg-gradient-to-r from-[#2AD368] to-[#1fc75c] shadow-[0_0_15px_rgba(42,211,104,0.4)]' : 'bg-[var(--border-color)]'}`}
                  >
                    <div className={`size-5 bg-white rounded-full absolute top-0.5 shadow-lg transition-all duration-300 ${lightEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--glass-bg)] rounded-2xl border border-[var(--border-color)] hover:bg-[var(--glass-hover)] hover:border-purple-400/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                      <span className="material-symbols-outlined">science</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Contrôle pH</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] font-medium">
                        {phEnabled ? 'Automatique' : 'Manuel Uniquement'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPhEnabled(!phEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${phEnabled ? 'bg-gradient-to-r from-[#2AD368] to-[#1fc75c] shadow-[0_0_15px_rgba(42,211,104,0.4)]' : 'bg-[var(--border-color)]'}`}
                  >
                    <div className={`size-5 rounded-full absolute top-0.5 shadow-lg transition-all duration-300 ${phEnabled ? 'bg-white right-0.5' : 'bg-[var(--text-tertiary)] left-0.5'}`}></div>
                  </button>
                </div>
              </div>
              <button className="w-full mt-4 py-3 border border-dashed border-[var(--border-color)] rounded-2xl text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest hover:border-primary/40 hover:text-[var(--text-primary)] transition-all">
                Créer une Nouvelle Routine
              </button>
            </GlassCard>

            {/* Capteurs hors ligne */}
            {offlineSensors.length > 0 && (
              <GlassCard className="p-5 rounded-3xl border border-orange-400/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-400 text-lg">sensors_off</span>
                    <h4 className="font-bold text-sm">Capteurs hors ligne</h4>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-orange-400/15 text-orange-400">
                    {offlineSensors.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {offlineSensors.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-[var(--glass-bg)]">
                      <p className="text-xs text-[var(--text-secondary)]">{s.name}</p>
                      <span className="text-[10px] font-bold text-orange-400">OFFLINE</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew;
