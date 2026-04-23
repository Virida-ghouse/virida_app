import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { sensorService } from '../../services/api/sensorService';
import { useViridaSensors, type LiveSensor } from '../../hooks/useViridaSensors';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SensorMeta {
  label: string;
  icon: string;
  color: string;
  unit: string;
  alertMin?: number;
  alertMax?: number;
}

const SENSOR_META: Record<string, SensorMeta> = {
  temperature:   { label: 'Température',  icon: 'thermostat',  color: '#f87171', unit: '°C',   alertMin: 15, alertMax: 35 },
  humidity:      { label: 'Humidité',      icon: 'water_drop',  color: '#60a5fa', unit: '%',    alertMin: 40, alertMax: 90 },
  ph:            { label: 'pH',            icon: 'science',     color: '#a78bfa', unit: 'pH',   alertMin: 5.5, alertMax: 7.5 },
  light:         { label: 'Lumière',       icon: 'wb_sunny',    color: '#fbbf24', unit: 'lux'  },
  tds:           { label: 'TDS',           icon: 'water',       color: '#34d399', unit: 'ppm'  },
  soil_moisture: { label: 'Hum. Sol',      icon: 'grass',       color: '#a3e635', unit: '%',    alertMin: 30, alertMax: 80 },
  co2:           { label: 'CO₂',           icon: 'air',         color: '#94a3b8', unit: 'ppm'  },
};

const TYPE_FILTERS = ['Tous', 'Température', 'Humidité', 'pH', 'Lumière', 'TDS', 'Sol'];
const TYPE_FILTER_MAP: Record<string, string> = {
  'Température': 'temperature',
  'Humidité': 'humidity',
  'pH': 'ph',
  'Lumière': 'light',
  'TDS': 'tds',
  'Sol': 'soil_moisture',
};

// ─── Period config ─────────────────────────────────────────────────────────
type Period = '1h' | '24h' | '7j' | '30j';
interface PeriodConfig {
  label: string;
  limit: string;
  tickFormat: (ts: string) => string;
  tooltipFormat: (ts: string) => string;
}

const PERIOD_CONFIGS: Record<Period, PeriodConfig> = {
  '1h': {
    label: '1h',
    limit: '60',
    tickFormat: (ts) => new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    tooltipFormat: (ts) => new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  '24h': {
    label: '24h',
    limit: '144',
    tickFormat: (ts) => new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    tooltipFormat: (ts) => new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
  },
  '7j': {
    label: '7j',
    limit: '336',
    tickFormat: (ts) => new Date(ts).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }),
    tooltipFormat: (ts) => new Date(ts).toLocaleString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }),
  },
  '30j': {
    label: '30j',
    limit: '720',
    tickFormat: (ts) => new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    tooltipFormat: (ts) => new Date(ts).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMeta(type: string): SensorMeta {
  return SENSOR_META[type] ?? { label: type, icon: 'sensors', color: '#6b7280', unit: '' };
}

function isAlert(sensor: LiveSensor): boolean {
  const meta = getMeta(sensor.type);
  const v = sensor.value;
  if (v == null || sensor.status !== 'online') return false;
  if (meta.alertMin != null && v < meta.alertMin) return true;
  if (meta.alertMax != null && v > meta.alertMax) return true;
  return false;
}

function formatValue(value: number | null): string {
  if (value == null) return '—';
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function timeAgo(ts: string | null): string {
  if (!ts) return '—';
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60)   return `il y a ${diff}s`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  return `il y a ${Math.floor(diff / 3600)}h`;
}

// ─── Status Dot ───────────────────────────────────────────────────────────────
const StatusDot: React.FC<{ status: string; alert: boolean }> = ({ status, alert }) => {
  if (status !== 'online') {
    return <span className="inline-block w-2 h-2 rounded-full bg-gray-500" />;
  }
  const c = alert ? '#fbbf24' : '#2AD368';
  return (
    <span className="relative inline-flex">
      <span className="animate-ping absolute inline-flex w-2 h-2 rounded-full opacity-60" style={{ background: c }} />
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: c }} />
    </span>
  );
};

// ─── Mini Sparkline (no axes) ─────────────────────────────────────────────────
const Sparkline: React.FC<{ data: { value: number }[]; color: string; offline?: boolean }> = ({ data, color, offline }) => {
  const c = offline ? '#6b7280' : color;
  if (!data || data.length < 2) {
    return <div className="h-12 w-full rounded-xl opacity-10" style={{ background: `linear-gradient(90deg, ${c}55, transparent)` }} />;
  }
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sp-${c.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
            <stop offset="95%" stopColor={c} stopOpacity={0}   />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{ background: '#1c2026', border: 'none', borderRadius: '8px', fontSize: '11px', padding: '4px 8px' }}
          itemStyle={{ color: c }}
          labelFormatter={() => ''}
          formatter={(v: number) => [v.toFixed(1), '']}
        />
        <Area type="monotone" dataKey="value" stroke={c} strokeWidth={1.5}
          fill={`url(#sp-${c.slice(1)})`} dot={false} activeDot={{ r: 3, fill: c }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ─── Full History Chart (with time axis) ──────────────────────────────────────
const HistoryChart: React.FC<{
  data: { ts: string; value: number }[];
  color: string;
  period: Period;
  unit: string;
}> = ({ data, color, period, unit }) => {
  const cfg = PERIOD_CONFIGS[period];
  // Pick ~6 evenly-spaced ticks
  const ticks = data.length > 0
    ? Array.from({ length: Math.min(6, data.length) }, (_, i) =>
        data[Math.floor(i * (data.length - 1) / Math.max(5, 1))].ts
      )
    : [];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`hc-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
        <XAxis
          dataKey="ts"
          ticks={ticks}
          tickFormatter={cfg.tickFormat}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => `${v}${unit}`}
        />
        <Tooltip
          contentStyle={{ background: '#1c2026', border: '1px solid #262a31', borderRadius: '12px', fontSize: '12px' }}
          labelStyle={{ color: '#6b7280', fontSize: '11px' }}
          itemStyle={{ color }}
          labelFormatter={(ts: string) => cfg.tooltipFormat(ts)}
          formatter={(v: number) => [`${v.toFixed(2)} ${unit}`, '']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// ─── Sensor Card ──────────────────────────────────────────────────────────────
const SensorCard: React.FC<{
  sensor: LiveSensor;
  sparkData: { value: number }[];
  onEdit: (s: LiveSensor) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
}> = ({ sensor, sparkData, onEdit, onDelete, onClick }) => {
  const meta    = getMeta(sensor.type);
  const alert   = isAlert(sensor);
  const offline = sensor.status !== 'online';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl p-5 flex flex-col gap-3 cursor-pointer
        transition-all duration-200 hover:translate-y-[-2px] hover:shadow-2xl
        ${offline ? 'opacity-55' : ''}`}
      style={{
        background: '#1c2026',
        boxShadow: alert ? `0 0 0 1px ${meta.color}50` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${meta.color}18` }}>
            <span className="material-symbols-outlined text-xl" style={{ color: meta.color }}>
              {meta.icon}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{sensor.name}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{meta.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusDot status={sensor.status} alert={alert} />
          {alert && <span className="text-xs font-medium text-amber-400">Alerte</span>}
          {offline && <span className="text-xs font-medium text-gray-500">Hors ligne</span>}
        </div>
      </div>

      {/* Big value */}
      <div className="flex items-end gap-1.5">
        <span className="font-bold tracking-tight leading-none"
          style={{ fontSize: '2.75rem', color: offline ? '#4b5563' : (alert ? '#fbbf24' : meta.color) }}>
          {formatValue(sensor.value)}
        </span>
        <span className="text-base font-medium text-[var(--text-secondary)] mb-1">{meta.unit}</span>
      </div>

      {/* Sparkline */}
      <Sparkline data={sparkData} color={meta.color} offline={offline} />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <span className="material-symbols-outlined text-sm opacity-50">schedule</span>
          <span>{timeAgo(sensor.lastReadingTs)}</span>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(sensor)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button onClick={() => onDelete(sensor.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-colors">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── History Modal ─────────────────────────────────────────────────────────────
const HistoryModal: React.FC<{
  sensor: LiveSensor;
  onClose: () => void;
}> = ({ sensor, onClose }) => {
  const meta = getMeta(sensor.type);
  const [period, setPeriod] = useState<Period>('24h');
  const [data, setData] = useState<{ ts: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const cfg = PERIOD_CONFIGS[p];
      const res = await sensorService.getSensorReadings(sensor.id, { limit: cfg.limit });
      const readings = res?.data?.readings ?? [];
      setData(
        readings
          .slice()
          .reverse()
          .map((r: any) => ({ ts: r.timestamp, value: Number(r.value) }))
      );
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [sensor.id]);

  useEffect(() => { load(period); }, [period, load]);

  const stats = data.length > 0 ? {
    min: Math.min(...data.map((d) => d.value)).toFixed(2),
    max: Math.max(...data.map((d) => d.value)).toFixed(2),
    avg: (data.reduce((acc, d) => acc + d.value, 0) / data.length).toFixed(2),
  } : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#1c2026', boxShadow: `0 0 80px ${meta.color}20` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6" style={{ background: '#181c22' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: `${meta.color}18` }}>
              <span className="material-symbols-outlined text-xl" style={{ color: meta.color }}>{meta.icon}</span>
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">{sensor.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{meta.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex gap-1 rounded-full p-1" style={{ background: '#262a31' }}>
              {(Object.keys(PERIOD_CONFIGS) as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={p === period
                    ? { background: meta.color, color: '#0a0e14' }
                    : { color: '#6b7280' }}>
                  {PERIOD_CONFIGS[p].label}
                </button>
              ))}
            </div>
            <button onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Current value + stats */}
        <div className="px-6 pt-5 flex items-end justify-between gap-4">
          <div className="flex items-end gap-2">
            <span className="font-bold tracking-tight leading-none"
              style={{ fontSize: '3.5rem', color: meta.color }}>
              {formatValue(sensor.value)}
            </span>
            <span className="text-lg text-[var(--text-secondary)] mb-1">{meta.unit}</span>
          </div>
          {stats && (
            <div className="flex gap-4 text-right">
              {[
                { label: 'Min', v: stats.min },
                { label: 'Moy', v: stats.avg },
                { label: 'Max', v: stats.max },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">{s.label}</p>
                  <p className="font-semibold text-[var(--text-primary)]">{s.v} <span className="text-xs text-[var(--text-secondary)]">{meta.unit}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="px-6 pt-4 pb-6">
          {loading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: `${meta.color}40`, borderTopColor: meta.color }} />
            </div>
          ) : data.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl opacity-20 text-[var(--text-secondary)]">show_chart</span>
              <p className="text-xs text-[var(--text-secondary)]">Aucune donnée pour cette période</p>
            </div>
          ) : (
            <HistoryChart data={data} color={meta.color} period={period} unit={meta.unit} />
          )}
          {/* Period label */}
          <p className="text-xs text-center text-[var(--text-secondary)] mt-2 opacity-60">
            {data.length} mesures — {PERIOD_CONFIGS[period].label === '1h' ? 'dernière heure' :
              PERIOD_CONFIGS[period].label === '24h' ? 'dernières 24h' :
              PERIOD_CONFIGS[period].label === '7j'  ? '7 derniers jours' : '30 derniers jours'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const SensorsPageNew: React.FC = () => {
  const { sensors } = useViridaSensors(8000);

  const [sparklines, setSparklines] = useState<Record<string, { value: number }[]>>({});
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [expandedSensor, setExpandedSensor] = useState<LiveSensor | null>(null);
  const [editSensor, setEditSensor] = useState<LiveSensor | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'temperature', unit: '°C', location: '' });

  const loadSparklines = useCallback(async (list: LiveSensor[]) => {
    const out: Record<string, { value: number }[]> = {};
    await Promise.allSettled(
      list.map(async (s) => {
        try {
          const res = await sensorService.getSensorReadings(s.id, { limit: '20' });
          out[s.id] = (res?.data?.readings ?? [])
            .slice().reverse()
            .map((r: any) => ({ value: Number(r.value) }));
        } catch { out[s.id] = []; }
      })
    );
    setSparklines(out);
  }, []);

  useEffect(() => {
    if (sensors.length > 0) loadSparklines(sensors);
  }, [sensors.length, loadSparklines]);

  const total   = sensors.length;
  const online  = sensors.filter((s) => s.status === 'online').length;
  const offline = sensors.filter((s) => s.status !== 'online').length;
  const alerts  = sensors.filter((s) => isAlert(s)).length;

  const filteredType = TYPE_FILTER_MAP[activeFilter];
  const filtered = filteredType ? sensors.filter((s) => s.type === filteredType) : sensors;

  const handleEdit = (s: LiveSensor) => {
    setEditSensor(s);
    setFormData({ name: s.name, type: s.type, unit: getMeta(s.type).unit, location: '' });
    setIsAddMode(false);
    setShowDialog(true);
  };
  const handleAdd = () => {
    setEditSensor(null);
    setFormData({ name: '', type: 'temperature', unit: '°C', location: '' });
    setIsAddMode(true);
    setShowDialog(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce capteur ?')) return;
    try { await sensorService.deleteSensor(id); } catch { /* ignore */ }
  };
  const handleSave = async () => {
    try {
      if (isAddMode) {
        await sensorService.createSensor({
          name: formData.name,
          type: formData.type.toUpperCase(),
          unit: formData.unit,
          greenhouseId: '',
          location: formData.location || undefined,
        });
      } else if (editSensor) {
        await sensorService.updateSensor(editSensor.id, {
          name: formData.name,
          location: formData.location || undefined,
        });
      }
    } catch { /* ignore */ }
    setShowDialog(false);
  };

  const STATS = [
    { label: 'Total',      value: total,   icon: 'sensors',      color: '#60a5fa', bg: '#60a5fa18' },
    { label: 'En ligne',   value: online,  icon: 'check_circle', color: '#2AD368', bg: '#2AD36818' },
    { label: 'Alertes',    value: alerts,  icon: 'warning',      color: '#fbbf24', bg: '#fbbf2418' },
    { label: 'Hors ligne', value: offline, icon: 'wifi_off',     color: '#f87171', bg: '#f8717118' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ background: 'var(--bg-primary, #10141a)' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] tracking-tight">Capteurs</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Surveillance IoT en temps réel · Cliquez sur une carte pour voir l'historique
            </p>
          </div>
          <button onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: '#2AD368', color: '#003916', boxShadow: '0 0 24px #2AD36840' }}>
            <span className="material-symbols-outlined text-lg">add</span>
            Nouveau capteur
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#1c2026' }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: stat.bg }}>
                <span className="material-symbols-outlined text-xl" style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                <p className="text-2xl font-bold leading-tight" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={f === activeFilter
                ? { background: '#2AD368', color: '#003916' }
                : { background: '#1c2026', color: 'var(--text-secondary)' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Sensor grid */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl p-16 flex flex-col items-center justify-center gap-4" style={{ background: '#1c2026' }}>
            <span className="material-symbols-outlined text-5xl opacity-20 text-[var(--text-secondary)]">sensors_off</span>
            <p className="text-[var(--text-secondary)] text-sm">Aucun capteur trouvé</p>
            <button onClick={handleAdd}
              className="px-5 py-2 rounded-full text-sm font-semibold"
              style={{ background: '#2AD368', color: '#003916' }}>
              + Ajouter un capteur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                sparkData={sparklines[sensor.id] ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={() => setExpandedSensor(sensor)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── History Modal ── */}
      {expandedSensor && (
        <HistoryModal sensor={expandedSensor} onClose={() => setExpandedSensor(null)} />
      )}

      {/* ── Add / Edit Dialog ── */}
      {showDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: '#1c2026', boxShadow: '0 0 60px #2AD36820' }}>
            <div className="p-6" style={{ background: '#181c22' }}>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {isAddMode ? 'Nouveau capteur' : 'Modifier le capteur'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Nom</label>
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Temp-Serre-1"
                  className="w-full px-4 py-3 rounded-2xl text-sm text-[var(--text-primary)] placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#2AD368]/40"
                  style={{ background: '#262a31' }} />
              </div>
              {isAddMode && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Type</label>
                  <select value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, unit: getMeta(e.target.value).unit })}
                    className="w-full px-4 py-3 rounded-2xl text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[#2AD368]/40"
                    style={{ background: '#262a31' }}>
                    {Object.entries(SENSOR_META).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Localisation</label>
                <input type="text" value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ex: Zone A, Bac hydroponique..."
                  className="w-full px-4 py-3 rounded-2xl text-sm text-[var(--text-primary)] placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#2AD368]/40"
                  style={{ background: '#262a31' }} />
              </div>
            </div>
            <div className="p-6 flex gap-3" style={{ borderTop: '1px solid #262a31' }}>
              <button onClick={() => setShowDialog(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                style={{ background: '#262a31' }}>
                Annuler
              </button>
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: '#2AD368', color: '#003916' }}>
                {isAddMode ? 'Créer' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorsPageNew;
