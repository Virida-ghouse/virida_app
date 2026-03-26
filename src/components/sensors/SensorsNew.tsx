import React, { useState, useEffect } from 'react';
import { useViridaStore } from '../../store/useViridaStore';
import { sensorService } from '../../services/api';

interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'light' | 'ph' | 'co2';
  location: string;
  value: number;
  unit: string;
  batteryLevel: number;
  signalStrength: number;
  status: 'active' | 'warning' | 'error' | 'offline';
  lastCalibration: string;
  accuracy: number;
}

export const SensorsNew: React.FC = () => {
  console.log('🔧 SensorsNew - Composant en cours de rendu');
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [formData, setFormData] = useState<Partial<Sensor>>({
    type: 'temperature',
    status: 'active',
  });

  const sensorTypes = {
    temperature: {
      icon: 'thermostat',
      color: '#e74c3c',
      units: ['°C', '°F'],
      label: 'Température',
    },
    humidity: {
      icon: 'water_drop',
      color: '#3498db',
      units: ['%'],
      label: 'Humidité',
    },
    light: {
      icon: 'wb_sunny',
      color: '#f1c40f',
      units: ['lux', '%'],
      label: 'Lumière',
    },
    ph: {
      icon: 'science',
      color: '#9b59b6',
      units: ['pH'],
      label: 'pH',
    },
    co2: {
      icon: 'co2',
      color: '#34495e',
      units: ['ppm'],
      label: 'CO2',
    },
  };

  const locations = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Serre 1', 'Serre 2'];

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const data = await sensorService.getAllSensors();
      setSensors(data as any || []);
    } catch (error) {
      console.error('Erreur:', error);
      setSensors([
        {
          id: '1',
          name: 'Temp-01',
          type: 'temperature',
          location: 'Zone A',
          value: 23.5,
          unit: '°C',
          batteryLevel: 85,
          signalStrength: 92,
          status: 'active',
          lastCalibration: '2025-01-15',
          accuracy: 98,
        },
        {
          id: '2',
          name: 'Hum-01',
          type: 'humidity',
          location: 'Zone A',
          value: 65,
          unit: '%',
          batteryLevel: 72,
          signalStrength: 88,
          status: 'active',
          lastCalibration: '2025-01-15',
          accuracy: 95,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-[var(--text-secondary)] bg-gray-400/20';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 60) return 'text-green-400';
    if (level >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleAddSensor = () => {
    setEditingSensor(null);
    setFormData({
      type: 'temperature',
      status: 'active',
      unit: '°C',
    });
    setOpenDialog(true);
  };

  const handleEditSensor = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setFormData(sensor);
    setOpenDialog(true);
  };

  const handleDeleteSensor = async (id: string) => {
    if (!confirm('Supprimer ce capteur ?')) return;
    try {
      const token = localStorage.getItem('virida_token');
      await fetch(`${apiUrl}/api/sensors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchSensors();
    } catch (error) {
      console.error('Erreur:', error);
      setSensors(sensors.filter((s) => s.id !== id));
    }
  };

  const handleCalibrateSensor = async (id: string) => {
    try {
      const token = localStorage.getItem('virida_token');
      await fetch(`${apiUrl}/api/sensors/${id}/calibrate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchSensors();
    } catch (error) {
      console.error('Erreur:', error);
      setSensors(
        sensors.map((s) =>
          s.id === id
            ? { ...s, lastCalibration: new Date().toISOString().split('T')[0], accuracy: 100 }
            : s
        )
      );
    }
  };

  const handleSaveSensor = async () => {
    try {
      const token = localStorage.getItem('virida_token');
      if (editingSensor) {
        await fetch(`${apiUrl}/api/sensors/${editingSensor.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`${apiUrl}/api/sensors`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            batteryLevel: 100,
            signalStrength: 100,
            accuracy: 100,
            lastCalibration: new Date().toISOString().split('T')[0],
          }),
        });
      }
      fetchSensors();
      setOpenDialog(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121A21] via-[#1a2530] to-[#0a1015] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">Gestion des Capteurs</h1>
              <p className="text-[var(--text-secondary)]">Surveillez et gérez vos capteurs IoT</p>
            </div>
            <button
              onClick={handleAddSensor}
              className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl bg-[#2AD368] hover:bg-[#1fc75c] text-[var(--text-primary)] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2AD368]/20"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Ajouter un capteur</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-400/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400 text-2xl">sensors</span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Total Capteurs</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{sensors.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-400/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400 text-2xl">check_circle</span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Actifs</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {sensors.filter((s) => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-400 text-2xl">warning</span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Alertes</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {sensors.filter((s) => s.status === 'warning').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card backdrop-blur-xl rounded-2xl p-4 border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-400/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-2xl">battery_charging_full</span>
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Batterie Moy.</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {sensors.length > 0
                    ? Math.round(sensors.reduce((acc, s) => acc + s.batteryLevel, 0) / sensors.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sensors Table */}
        <div className="glass-card backdrop-blur-xl rounded-2xl border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left p-4 text-[var(--text-secondary)] font-semibold">Capteur</th>
                  <th className="text-left p-4 text-[var(--text-secondary)] font-semibold hidden md:table-cell">Localisation</th>
                  <th className="text-left p-4 text-[var(--text-secondary)] font-semibold">Valeur</th>
                  <th className="text-left p-4 text-[var(--text-secondary)] font-semibold hidden lg:table-cell">Batterie</th>
                  <th className="text-left p-4 text-[var(--text-secondary)] font-semibold hidden lg:table-cell">Signal</th>
                  <th className="text-left p-4 text-[var(--text-secondary)] font-semibold hidden sm:table-cell">Statut</th>
                  <th className="text-left p-4 text-[var(--text-secondary)] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AD368]"></div>
                      </div>
                    </td>
                  </tr>
                ) : sensors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[var(--text-secondary)]">
                      Aucun capteur configuré
                    </td>
                  </tr>
                ) : (
                  sensors.map((sensor) => (
                    <tr key={sensor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${sensorTypes[sensor.type].color}20` }}
                          >
                            <span
                              className="material-symbols-outlined text-xl"
                              style={{ color: sensorTypes[sensor.type].color }}
                            >
                              {sensorTypes[sensor.type].icon}
                            </span>
                          </div>
                          <div>
                            <p className="text-[var(--text-primary)] font-semibold">{sensor.name}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{sensorTypes[sensor.type].label}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[var(--text-secondary)] hidden md:table-cell">{sensor.location}</td>
                      <td className="p-4">
                        <div>
                          <p className="text-[var(--text-primary)] font-semibold">
                            {sensor.value} {sensor.unit}
                          </p>
                          <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                            <div
                              className="bg-green-400 h-1 rounded-full"
                              style={{ width: `${sensor.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined ${getBatteryColor(sensor.batteryLevel)}`}>
                            battery_charging_full
                          </span>
                          <span className="text-[var(--text-secondary)]">{sensor.batteryLevel}%</span>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined ${getSignalColor(sensor.signalStrength)}`}>
                            signal_cellular_alt
                          </span>
                          <span className="text-[var(--text-secondary)]">{sensor.signalStrength}%</span>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sensor.status)}`}>
                          {sensor.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCalibrateSensor(sensor.id)}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                            title="Calibrer"
                          >
                            <span className="material-symbols-outlined text-lg">refresh</span>
                          </button>
                          <button
                            onClick={() => handleEditSensor(sensor)}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-[var(--text-secondary)]"
                            title="Modifier"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSensor(sensor.id)}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-red-400"
                            title="Supprimer"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card backdrop-blur-xl rounded-3xl w-full max-w-md border-2 border-[#2AD368]/20 shadow-2xl">
            {/* Header */}
            <div className="border-b border-[var(--border-color)] p-6 bg-gradient-to-r from-[#052E1C] to-[#121A21]">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {editingSensor ? 'Modifier le capteur' : 'Ajouter un capteur'}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Nom du capteur</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] placeholder-gray-500 focus:border-[#2AD368] focus:outline-none transition-all"
                  placeholder="Ex: Temp-01"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Type</label>
                <select
                  value={formData.type || 'temperature'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Sensor['type'],
                      unit: sensorTypes[e.target.value as keyof typeof sensorTypes].units[0],
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  {Object.entries(sensorTypes).map(([type, data]) => (
                    <option key={type} value={type}>
                      {data.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Localisation</label>
                <select
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  <option value="">Sélectionner...</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Unité</label>
                <select
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-all"
                >
                  {formData.type &&
                    sensorTypes[formData.type].units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border-color)] p-6 flex gap-3">
              <button
                onClick={() => setOpenDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl glass-card backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:text-[var(--text-primary)] transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveSensor}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2AD368] hover:bg-[#1fc75c] text-[var(--text-primary)] font-semibold transition-all shadow-lg shadow-[#2AD368]/20"
              >
                {editingSensor ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
