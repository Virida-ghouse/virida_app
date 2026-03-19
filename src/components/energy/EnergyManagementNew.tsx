import React, { useState, useEffect } from 'react';

interface EnergyData {
  currentConsumption: number;
  solarProduction: number;
  gridConsumption: number;
  batteryLevel: number;
  batteryCharging: boolean;
  savings: number;
  distribution: Array<{ name: string; value: number; color: string }>;
}

export default function EnergyManagementNew() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoMode, setAutoMode] = useState(true);
  const [lightingIntensity, setLightingIntensity] = useState(70);
  const [climateControl, setClimateControl] = useState(65);
  const [batteryUsage, setBatteryUsage] = useState(80);
  
  const [energyData, setEnergyData] = useState<EnergyData>({
    currentConsumption: 45.2,
    solarProduction: 32.8,
    gridConsumption: 12.4,
    batteryLevel: 85,
    batteryCharging: true,
    savings: 28,
    distribution: [
      { name: 'Éclairage', value: 35, color: '#2AD368' },
      { name: 'Climatisation', value: 25, color: '#CBED62' },
      { name: 'Irrigation', value: 20, color: '#3498db' },
      { name: 'Ventilation', value: 15, color: '#9b59b6' },
      { name: 'Monitoring', value: 5, color: '#e74c3c' },
    ],
  });

  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const generateData = () => {
      const baseConsumption = 40;
      const baseSolar = 25;
      return Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(Date.now() - (23 - i) * 3600000).getHours();
        return {
          time: `${hour}h`,
          consumption: baseConsumption + Math.random() * 10,
          solar: (baseSolar + Math.random() * 15) * (hour > 6 && hour < 18 ? 1 : 0.1),
          grid: Math.max(0, (baseConsumption + Math.random() * 10) - (baseSolar + Math.random() * 15)),
        };
      });
    };
    setHistoricalData(generateData());
  }, [selectedTimeRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData(prev => ({
        ...prev,
        currentConsumption: Math.max(0, prev.currentConsumption + (Math.random() - 0.5) * 2),
        solarProduction: Math.max(0, prev.solarProduction + (Math.random() - 0.5) * 1.5),
        gridConsumption: Math.max(0, prev.gridConsumption + (Math.random() - 0.5)),
        batteryLevel: Math.min(100, Math.max(0, prev.batteryLevel + (Math.random() - 0.5) * 2)),
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = () => {
    console.log('Saving settings:', { lightingIntensity, climateControl, batteryUsage });
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)] dark:bg-background-dark text-[var(--text-primary)] p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="size-12 md:size-14 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#2AD368] text-2xl md:text-3xl">
                bolt
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-1">
                Energy <span className="text-[#CBED62]">Management</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-sm md:text-base">
                Surveillez et optimisez votre consommation énergétique
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:border-[#2AD368] focus:outline-none transition-all"
            >
              <option value="24h">24 heures</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
            </select>
            <button
              onClick={() => setLastUpdate(new Date())}
              className="p-2 glass-card backdrop-blur-xl rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#2AD368]/30 transition-all"
              title="Actualiser"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>
        <p className="text-[var(--text-primary)] text-xs">
          Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-8 space-y-6">
          {/* Real-time Metrics */}
          <div className="glass-card backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Métriques en temps réel</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Consumption */}
              <div className="glass-card backdrop-blur-xl rounded-xl p-4 border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#e74c3c]">bolt</span>
                  <p className="text-[var(--text-primary)] text-xs">Consommation</p>
                </div>
                <p className="text-2xl font-black text-[var(--text-primary)]">{energyData.currentConsumption.toFixed(1)}</p>
                <p className="text-[var(--text-primary)] text-xs">kW</p>
              </div>

              {/* Solar */}
              <div className="glass-card backdrop-blur-xl rounded-xl p-4 border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#2AD368]">wb_sunny</span>
                  <p className="text-[var(--text-primary)] text-xs">Solaire</p>
                </div>
                <p className="text-2xl font-black text-[#2AD368]">{energyData.solarProduction.toFixed(1)}</p>
                <p className="text-[var(--text-primary)] text-xs">kW</p>
              </div>

              {/* Grid */}
              <div className="glass-card backdrop-blur-xl rounded-xl p-4 border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#3498db]">power</span>
                  <p className="text-[var(--text-primary)] text-xs">Réseau</p>
                </div>
                <p className="text-2xl font-black text-[#3498db]">{energyData.gridConsumption.toFixed(1)}</p>
                <p className="text-[var(--text-primary)] text-xs">kW</p>
              </div>

              {/* Battery */}
              <div className="glass-card backdrop-blur-xl rounded-xl p-4 border border-[var(--border-color)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#CBED62]">battery_charging_full</span>
                  <p className="text-[var(--text-primary)] text-xs">Batterie</p>
                </div>
                <p className="text-2xl font-black text-[var(--text-primary)]">{energyData.batteryLevel}</p>
                <p className="text-[var(--text-primary)] text-xs">%</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  energyData.batteryCharging ? 'bg-[#2AD368]/20 text-[#2AD368]' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {energyData.batteryCharging ? 'En charge' : 'Décharge'}
                </span>
              </div>
            </div>
          </div>

          {/* Energy Distribution */}
          <div className="glass-card backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Distribution énergétique</h2>
            <div className="space-y-3">
              {energyData.distribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--text-secondary)]">{item.name}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{item.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Chart */}
          <div className="glass-card backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Historique de consommation</h2>
            
            {/* Chart */}
            <div className="relative h-80 mb-6">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-[var(--text-tertiary)] pr-2">
                <span>60kW</span>
                <span>45kW</span>
                <span>30kW</span>
                <span>15kW</span>
                <span>0kW</span>
              </div>
              
              {/* Grid lines */}
              <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full border-t border-white/5" />
                ))}
              </div>
              
              {/* Bars */}
              <div className="absolute left-12 right-0 top-0 bottom-0 flex items-end justify-between gap-1">
                {historicalData.map((data, index) => {
                  const maxValue = 60;
                  const solarHeight = (data.solar / maxValue) * 100;
                  const consumptionHeight = (data.consumption / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      {/* Bars container */}
                      <div className="w-full h-full flex items-end justify-center gap-0.5">
                        {/* Solar bar */}
                        <div className="relative flex-1 flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-[#2AD368] to-[#2AD368]/60 rounded-t transition-all hover:from-[#2AD368] hover:to-[#2AD368]/80"
                            style={{ height: `${solarHeight}%`, minHeight: solarHeight > 0 ? '4px' : '0' }}
                          >
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#121A21] rounded text-[10px] text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {data.solar.toFixed(1)}kW
                            </div>
                          </div>
                        </div>
                        
                        {/* Consumption bar */}
                        <div className="relative flex-1 flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-[#e74c3c] to-[#e74c3c]/60 rounded-t transition-all hover:from-[#e74c3c] hover:to-[#e74c3c]/80"
                            style={{ height: `${consumptionHeight}%`, minHeight: consumptionHeight > 0 ? '4px' : '0' }}
                          >
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#121A21] rounded text-[10px] text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {data.consumption.toFixed(1)}kW
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Time label */}
                      {index % 3 === 0 && (
                        <span className="text-[10px] text-[var(--text-tertiary)] font-medium">{data.time}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-t from-[#2AD368] to-[#2AD368]/60" />
                <span className="text-sm text-[var(--text-secondary)] font-medium">Production Solaire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-t from-[#e74c3c] to-[#e74c3c]/60" />
                <span className="text-sm text-[var(--text-secondary)] font-medium">Consommation Totale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls - Right Side */}
        <div className="lg:col-span-4 space-y-6">
          {/* Energy Controls */}
          <div className="glass-card backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-color)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Contrôles énergétiques</h2>
            
            {/* Auto Mode */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border-color)]">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Mode automatique</p>
                <p className="text-[var(--text-primary)] text-xs">Optimisation IA</p>
              </div>
              <button
                onClick={() => setAutoMode(!autoMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoMode ? 'bg-[#2AD368]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Lighting Intensity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Intensité lumineuse</label>
                <span className="text-sm font-bold text-[var(--text-primary)]">{lightingIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={lightingIntensity}
                onChange={(e) => setLightingIntensity(Number(e.target.value))}
                disabled={autoMode}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, #2AD368 0%, #2AD368 ${lightingIntensity}%, rgba(255,255,255,0.1) ${lightingIntensity}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>

            {/* Climate Control */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Climatisation</label>
                <span className="text-sm font-bold text-[var(--text-primary)]">{climateControl}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={climateControl}
                onChange={(e) => setClimateControl(Number(e.target.value))}
                disabled={autoMode}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, #2AD368 0%, #2AD368 ${climateControl}%, rgba(255,255,255,0.1) ${climateControl}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>

            {/* Battery Usage */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Utilisation batterie</label>
                <span className="text-sm font-bold text-[var(--text-primary)]">{batteryUsage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={batteryUsage}
                onChange={(e) => setBatteryUsage(Number(e.target.value))}
                disabled={autoMode}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, #2AD368 0%, #2AD368 ${batteryUsage}%, rgba(255,255,255,0.1) ${batteryUsage}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={autoMode}
              className="w-full px-4 py-3 rounded-xl bg-[#2AD368] hover:bg-[#1fc75c] text-[#121A21] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2AD368]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">save</span>
              <span>Enregistrer</span>
            </button>
          </div>

          {/* Savings Card */}
          <div className="glass-card backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-color)] bg-gradient-to-br from-[#2AD368]/10 to-transparent">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 bg-[#2AD368]/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#2AD368] text-2xl">savings</span>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Économies ce mois</p>
                <p className="text-3xl font-black text-[#2AD368]">{energyData.savings}%</p>
              </div>
            </div>
            <p className="text-[var(--text-primary)] text-xs">
              Vous économisez grâce à l'énergie solaire et à l'optimisation automatique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
