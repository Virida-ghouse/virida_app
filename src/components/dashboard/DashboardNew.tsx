import React from 'react';
import GlassCard from '../ui/GlassCard';
import StatCard from '../ui/StatCard';
import GreenhouseModel from '../3d/GreenhouseModel';

const DashboardNew: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [irrigationEnabled, setIrrigationEnabled] = React.useState(true);
  const [lightEnabled, setLightEnabled] = React.useState(true);
  const [phEnabled, setPhEnabled] = React.useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 custom-scrollbar bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      {/* Gradient Orbs for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="relative z-10">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
            <span className="text-[var(--text-primary)]">Serre </span><span className="text-[#CBED62] text-4xl md:text-5xl">Alpha-1</span>
          </h2>
          <p className="text-[var(--text-secondary)] flex items-center gap-2 text-sm md:text-base">
            <span className="flex h-2 w-2 rounded-full bg-[#2AD368] animate-pulse shadow-[0_0_8px_rgba(42,211,104,0.6)]"></span>
            <span className="hidden sm:inline">Tous les systèmes <span className="text-[#2AD368]">opérationnels</span> • Dernière synchro il y a 2 min</span>
            <span className="sm:hidden text-[#2AD368]">Opérationnel</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-[18px]">
              calendar_today
            </span>
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
        {/* Stats Section (Left 8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="thermostat"
              iconColor="text-[#2AD368]"
              iconBg="bg-[#2AD368]/10"
              label="TEMPÉRATURE"
              value={24.5}
              unit="°C"
              trend="+2.4%"
              trendColor="text-[#2AD368]"
            />
            <StatCard
              icon="humidity_percentage"
              iconColor="text-blue-400"
              iconBg="bg-blue-400/10"
              label="HUMIDITÉ"
              value={65}
              unit="%"
              trend="-1.1%"
              trendColor="text-red-400"
            />
            <StatCard
              icon="science"
              iconColor="text-purple-400"
              iconBg="bg-purple-400/10"
              label="NIVEAU PH"
              value={6.5}
              unit=" pH"
              trend="Stable"
              trendColor="text-[var(--text-tertiary)]"
            />
            <StatCard
              icon="light_mode"
              iconColor="text-orange-400"
              iconBg="bg-orange-400/10"
              label="LUMIÈRE"
              value={850}
              unit=" lux"
              trend="+12%"
              trendColor="text-[#2AD368]"
            />
          </div>

          {/* 3D Visualization / Hero Area */}
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
                  <span className="material-symbols-outlined">
                    {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                  </span>
                </button>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between pointer-events-auto gap-3">
                <div className="bg-[var(--bg-secondary)]/95 backdrop-blur-xl px-4 py-3 md:px-5 md:py-4 rounded-2xl border border-[var(--border-color)] shadow-xl">
                  <h3 className="text-base md:text-xl font-bold mb-1">
                    <span className="text-[var(--text-primary)]">Visualisation </span><span className="text-[#CBED62]">3D</span><span className="text-[var(--text-primary)] hidden md:inline"> de la Serre</span>
                  </h3>
                  <p className="text-[var(--text-secondary)] text-xs md:text-sm hidden md:block">
                    Modèle 3D en temps réel pour le monitoring environnemental.
                  </p>
                </div>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  <div className="text-center bg-[var(--bg-secondary)]/95 backdrop-blur-xl px-3 py-2 md:px-5 md:py-3 rounded-xl border border-[var(--border-color)] shadow-lg">
                    <p className="text-[9px] md:text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">
                      Capteurs
                    </p>
                    <p className="text-xl md:text-2xl font-black text-[#CBED62]">4</p>
                  </div>
                  <div className="text-center bg-[var(--bg-secondary)]/95 backdrop-blur-xl px-3 py-2 md:px-5 md:py-3 rounded-xl border border-[var(--border-color)] shadow-lg">
                    <p className="text-[9px] md:text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">
                      Disponibilité
                    </p>
                    <p className="text-2xl font-black text-[var(--text-primary)]">99.9%</p>
                  </div>
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

        {/* Side Panel (Right 4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Automations */}
          <GlassCard className="p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold">Automations</h4>
              <span className="material-symbols-outlined text-primary text-xl">
                tune
              </span>
            </div>
            <div className="space-y-3">
              {/* Auto-Irrigation */}
              <div className="flex items-center justify-between p-4 bg-[var(--glass-bg)] rounded-2xl border border-[var(--border-color)] hover:bg-[var(--glass-hover)] hover:border-blue-400/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined">water_drop</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Irrigation Automatique</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] font-medium">
                      Toutes les 6h • Secteur A
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIrrigationEnabled(!irrigationEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                    irrigationEnabled 
                      ? 'bg-gradient-to-r from-[#2AD368] to-[#1fc75c] shadow-[0_0_15px_rgba(42,211,104,0.4)]' 
                      : 'bg-[var(--border-color)]'
                  }`}
                >
                  <div className={`size-5 bg-white rounded-full absolute top-0.5 shadow-lg transition-all duration-300 ${
                    irrigationEnabled ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>

              {/* Spectral Optimization */}
              <div className="flex items-center justify-between p-4 bg-[var(--glass-bg)] rounded-2xl border border-[var(--border-color)] hover:bg-[var(--glass-hover)] hover:border-orange-400/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400">
                    <span className="material-symbols-outlined">light_mode</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Optimisation Spectrale</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] font-medium">
                      Dynamique • Cycle Complet
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setLightEnabled(!lightEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                    lightEnabled 
                      ? 'bg-gradient-to-r from-[#2AD368] to-[#1fc75c] shadow-[0_0_15px_rgba(42,211,104,0.4)]' 
                      : 'bg-[var(--border-color)]'
                  }`}
                >
                  <div className={`size-5 bg-white rounded-full absolute top-0.5 shadow-lg transition-all duration-300 ${
                    lightEnabled ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>

              {/* pH Control */}
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
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                    phEnabled 
                      ? 'bg-gradient-to-r from-[#2AD368] to-[#1fc75c] shadow-[0_0_15px_rgba(42,211,104,0.4)]' 
                      : 'bg-[var(--border-color)]'
                  }`}
                >
                  <div className={`size-5 rounded-full absolute top-0.5 shadow-lg transition-all duration-300 ${
                    phEnabled ? 'bg-white right-0.5' : 'bg-[var(--text-tertiary)] left-0.5'
                  }`}></div>
                </button>
              </div>
            </div>
            <button className="w-full mt-4 py-3 border border-dashed border-[var(--border-color)] rounded-2xl text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest hover:border-primary/40 hover:text-[var(--text-primary)] transition-all">
              Créer une Nouvelle Routine
            </button>
          </GlassCard>

        </div>
      </div>
      </div>
    </div>
  );
};

export default DashboardNew;
