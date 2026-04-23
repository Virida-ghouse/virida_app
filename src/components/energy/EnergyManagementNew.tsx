// EnergyManagementNew.tsx — Énergie estimée + Diagnostic IoT temps réel
import React, { useState, useMemo } from 'react';
import { useViridaSensors, LiveSensor } from '../../hooks/useViridaSensors';

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(ts: string | null): string {
  if (!ts) return 'Jamais';
  const diff = Date.now() - new Date(ts).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

function isStale(ts: string | null, maxMinutes = 15): boolean {
  if (!ts) return true;
  return Date.now() - new Date(ts).getTime() > maxMinutes * 60 * 1000;
}

const SENSOR_META: Record<string, { icon: string; color: string; label: string; unit: string; min: number; max: number; goodMin: number; goodMax: number }> = {
  temperature:   { icon: 'thermostat',   color: '#FF7043', label: 'Température',      unit: '°C',  min: 0,    max: 50,   goodMin: 18,  goodMax: 28  },
  humidity:      { icon: 'water_drop',   color: '#64B5F6', label: 'Humidité Air',     unit: '%',   min: 0,    max: 100,  goodMin: 40,  goodMax: 80  },
  light:         { icon: 'light_mode',   color: '#CBED62', label: 'Luminosité',       unit: 'lux', min: 0,    max: 5000, goodMin: 500, goodMax: 4000 },
  soil_moisture: { icon: 'grass',        color: '#81C784', label: 'Humidité Sol',     unit: '%',   min: 0,    max: 100,  goodMin: 30,  goodMax: 70  },
  ph:            { icon: 'science',      color: '#CE93D8', label: 'pH Solution',      unit: 'pH',  min: 0,    max: 14,   goodMin: 5.5, goodMax: 7.5 },
  tds:           { icon: 'biotech',      color: '#4DD0E1', label: 'TDS Nutriments',   unit: 'ppm', min: 0,    max: 3000, goodMin: 150, goodMax: 800 },
  water_level:   { icon: 'water',        color: '#29B6F6', label: 'Niveau Eau',       unit: 'cm',  min: 0,    max: 30,   goodMin: 5,   goodMax: 28  },
  co2:           { icon: 'air',          color: '#A5D6A7', label: 'CO₂',              unit: 'ppm', min: 0,    max: 5000, goodMin: 400, goodMax: 1500 },
};

function getMeta(type: string) {
  return SENSOR_META[type] || { icon: 'sensors', color: '#90CAF9', label: type, unit: '', min: 0, max: 100, goodMin: 20, goodMax: 80 };
}

function sensorHealth(s: LiveSensor): 'ok' | 'warn' | 'critical' | 'offline' {
  if (s.status === 'offline' || s.value == null) return 'offline';
  if (isStale(s.lastReadingTs)) return 'warn';
  const m = getMeta(s.type);
  if (s.value < m.goodMin || s.value > m.goodMax) return 'warn';
  return 'ok';
}

const HEALTH_COLOR = { ok: '#2AD368', warn: '#FFB74D', critical: '#FF6B6B', offline: 'rgba(255,255,255,0.25)' };
const HEALTH_LABEL = { ok: 'OK', warn: 'Attention', critical: 'Critique', offline: 'Hors ligne' };
const HEALTH_BG    = { ok: 'rgba(42,211,104,0.1)', warn: 'rgba(255,183,77,0.1)', critical: 'rgba(255,107,107,0.1)', offline: 'rgba(255,255,255,0.04)' };

// Estimated watt-hours used by each sensor type being active
const SENSOR_WATT: Record<string, number> = {
  temperature: 0.3, humidity: 0.3, light: 0.5,
  soil_moisture: 0.3, ph: 1.2, tds: 1.2,
  water_level: 0.8, co2: 2.0,
};

// ── Mini bar ──────────────────────────────────────────────────────────────────
function ValueBar({ value, min, max, goodMin, goodMax, color }: {
  value: number; min: number; max: number; goodMin: number; goodMax: number; color: string;
}) {
  const range = max - min || 1;
  const pct = Math.min(100, Math.max(0, ((value - min) / range) * 100));
  const goodMinPct = ((goodMin - min) / range) * 100;
  const goodMaxPct = ((goodMax - min) / range) * 100;
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', width: '100%' }}>
      {/* Good zone */}
      <div className="absolute top-0 h-full rounded-full" style={{
        left: `${goodMinPct}%`, width: `${goodMaxPct - goodMinPct}%`,
        background: 'rgba(42,211,104,0.2)',
      }} />
      {/* Value */}
      <div className="absolute top-0 h-full rounded-full transition-all duration-700" style={{
        width: `${pct}%`, background: color, boxShadow: `0 0 4px ${color}`,
      }} />
    </div>
  );
}

// ── Sensor row ────────────────────────────────────────────────────────────────
function SensorRow({ sensor }: { sensor: LiveSensor }) {
  const m = getMeta(sensor.type);
  const health = sensorHealth(sensor);
  const hColor = HEALTH_COLOR[health];
  const stale = isStale(sensor.lastReadingTs);

  return (
    <div className="grid items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.025] rounded-xl"
      style={{ gridTemplateColumns: '14px 1fr 130px 100px 110px 80px' }}>

      {/* Status dot */}
      <div className="relative flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: hColor, boxShadow: health !== 'offline' ? `0 0 6px ${hColor}` : 'none' }} />
        {health === 'ok' && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ background: hColor, opacity: 0.3 }} />
        )}
      </div>

      {/* Name + ID */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="material-symbols-outlined flex-shrink-0" style={{ color: m.color, fontSize: 16 }}>{m.icon}</span>
          <span className="font-semibold text-sm truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{sensor.name}</span>
        </div>
        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{sensor.id}</span>
      </div>

      {/* Value + bar */}
      <div>
        {sensor.value != null ? (
          <>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-black text-sm" style={{ color: hColor, textShadow: `0 0 8px ${hColor}55` }}>
                {sensor.value % 1 === 0 ? sensor.value : sensor.value.toFixed(2)}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{sensor.unit || m.unit}</span>
            </div>
            <ValueBar value={sensor.value} min={m.min} max={m.max} goodMin={m.goodMin} goodMax={m.goodMax} color={hColor} />
          </>
        ) : (
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>— {sensor.unit || m.unit}</span>
        )}
      </div>

      {/* Normal range */}
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>Cible </span>
        {m.goodMin}–{m.goodMax} {m.unit}
      </div>

      {/* Last seen */}
      <div className="text-xs flex flex-col gap-0.5">
        <span style={{ color: stale ? '#FFB74D' : 'rgba(255,255,255,0.5)' }}>
          {stale && sensor.status !== 'offline' && '⚠ '}
          {timeAgo(sensor.lastReadingTs)}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>
          {sensor.lastReadingTs ? new Date(sensor.lastReadingTs).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
        </span>
      </div>

      {/* Badge */}
      <div className="flex justify-end">
        <span className="font-bold text-xs px-2.5 py-1 rounded-full"
          style={{ background: HEALTH_BG[health], color: hColor, border: `1px solid ${hColor}30`, fontSize: 10, letterSpacing: '0.06em' }}>
          {HEALTH_LABEL[health]}
        </span>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EnergyManagementNew() {
  const { sensors, map, connected, onlineSensors, offlineSensors } = useViridaSensors(5000);
  const [activeTab, setActiveTab] = useState<'energy' | 'iot'>('iot');

  const lastUpdate = useMemo(() => {
    const ts = sensors
      .map(s => s.lastReadingTs ? new Date(s.lastReadingTs).getTime() : 0)
      .filter(t => t > 0);
    return ts.length > 0 ? new Date(Math.max(...ts)) : null;
  }, [sensors]);

  // Estimated power consumption based on active sensors
  const estimatedWatts = useMemo(() => {
    let w = 8; // ESP32 base board
    onlineSensors.forEach(s => { w += SENSOR_WATT[s.type] || 0.5; });
    if (map.light != null && map.light < 300) w += 18; // LED补光
    if (map.soil_moisture != null && map.soil_moisture < 30) w += 40; // pump
    if (map.temperature != null && map.temperature > 28) w += 25; // fan
    return w;
  }, [onlineSensors, map]);

  const healthOk = sensors.filter(s => sensorHealth(s) === 'ok').length;
  const healthWarn = sensors.filter(s => sensorHealth(s) === 'warn').length;
  const healthCritical = sensors.filter(s => sensorHealth(s) === 'critical').length;
  const healthOffline = sensors.filter(s => sensorHealth(s) === 'offline').length;

  const sortedSensors = useMemo(() => {
    const order = { critical: 0, warn: 1, offline: 2, ok: 3 };
    return [...sensors].sort((a, b) => order[sensorHealth(a)] - order[sensorHealth(b)]);
  }, [sensors]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-20 lg:pb-0"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="px-6 md:px-8 pt-6 pb-8">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(42,211,104,0.1)', border: '1px solid rgba(42,211,104,0.2)' }}>
              <span className="material-symbols-outlined" style={{ color: '#2AD368', fontSize: 24 }}>bolt</span>
            </div>
            <div>
              <h1 className="font-black" style={{ fontSize: 'clamp(20px,3vw,30px)', color: '#fff', letterSpacing: '0.01em' }}>
                Énergie <span style={{ color: '#CBED62' }}>&</span> Diagnostic IoT
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ color: connected ? '#2AD368' : '#FF6B6B' }}>●</span>{' '}
                {onlineSensors.length}/{sensors.length} capteurs en ligne
                {lastUpdate && (
                  <> · Màj {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>
                )}
              </p>
            </div>
          </div>

          {/* Tab switch */}
          <div className="flex rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {([
              { key: 'iot', icon: 'sensors', label: 'Diagnostic' },
              { key: 'energy', icon: 'bolt', label: 'Énergie' },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all"
                style={activeTab === tab.key
                  ? { background: '#2AD368', color: '#0a1510' }
                  : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── GLOBAL STATUS STRIP ────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { v: healthOk, l: 'EN BONNE SANTÉ', c: '#2AD368', icon: 'check_circle' },
            { v: healthWarn, l: 'À SURVEILLER', c: '#FFB74D', icon: 'warning_amber' },
            { v: healthCritical, l: 'CRITIQUES', c: '#FF6B6B', icon: 'error' },
            { v: healthOffline, l: 'HORS LIGNE', c: 'rgba(255,255,255,0.35)', icon: 'sensors_off' },
          ].map(({ v, l, c, icon }) => (
            <div key={l} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: `${c === 'rgba(255,255,255,0.35)' ? 'rgba(255,255,255,0.03)' : c + '10'}`, border: `1px solid ${c === 'rgba(255,255,255,0.35)' ? 'rgba(255,255,255,0.07)' : c + '25'}` }}>
              <span className="material-symbols-outlined flex-shrink-0" style={{ color: c, fontSize: 22 }}>{icon}</span>
              <div>
                <div className="font-black text-2xl leading-none" style={{ color: c, textShadow: c !== 'rgba(255,255,255,0.35)' ? `0 0 10px ${c}55` : 'none' }}>{v}</div>
                <div className="text-xs font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TAB: DIAGNOSTIC IoT
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'iot' && (
          <div className="space-y-5">

            {/* Table */}
            <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Table header */}
              <div className="grid items-center gap-3 px-4 py-3"
                style={{ gridTemplateColumns: '14px 1fr 130px 100px 110px 80px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div />
                <span className="text-xs font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>CAPTEUR</span>
                <span className="text-xs font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>VALEUR</span>
                <span className="text-xs font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>PLAGE CIBLE</span>
                <span className="text-xs font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>DERNIÈRE MAJ</span>
                <span className="text-xs font-black tracking-widest text-right" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>STATUT</span>
              </div>

              {sensors.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="material-symbols-outlined text-5xl mb-3" style={{ color: 'rgba(255,255,255,0.15)' }}>sensors_off</span>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Chargement des capteurs...</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.035)' }}>
                  {sortedSensors.map(s => <SensorRow key={s.id} sensor={s} />)}
                </div>
              )}
            </div>

            {/* Offline suggestions */}
            {offlineSensors.length > 0 && (
              <div className="rounded-3xl p-5 space-y-3"
                style={{ background: 'rgba(255,107,107,0.03)', border: '1px solid rgba(255,107,107,0.15)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined" style={{ color: '#FF6B6B', fontSize: 18 }}>build</span>
                  <span className="font-black text-sm tracking-wider" style={{ color: '#FF6B6B', letterSpacing: '0.08em' }}>GUIDE DE DÉPANNAGE</span>
                </div>
                {offlineSensors.map(s => {
                  const m = getMeta(s.type);
                  const actions: Record<string, string[]> = {
                    co2:      ['Vérifier alimentation capteur MH-Z19', 'Contrôler câble UART (TX↔RX)', 'Redémarrer l\'ESP32'],
                    humidity: ['Vérifier câble DHT22/SHT31', 'Tester avec multimètre (VCC=3.3V)', 'Vérifier soudures sur PCB'],
                    default:  ['Vérifier connexion physique', 'Contrôler l\'alimentation (3.3V/5V)', 'Redémarrer l\'ESP32 via MQTT reset'],
                  };
                  const tips = actions[s.type] || actions.default;
                  return (
                    <div key={s.id} className="rounded-2xl p-4" style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.12)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined" style={{ color: m.color, fontSize: 16 }}>{m.icon}</span>
                        <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{s.name}</span>
                        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>· {s.id}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            <span className="flex-shrink-0 font-bold" style={{ color: '#FF6B6B' }}>{i + 1}.</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Stale sensors warning */}
            {(() => {
              const stale = onlineSensors.filter(s => isStale(s.lastReadingTs, 30));
              if (stale.length === 0) return null;
              return (
                <div className="rounded-3xl p-4 flex items-start gap-3"
                  style={{ background: 'rgba(255,183,77,0.04)', border: '1px solid rgba(255,183,77,0.2)' }}>
                  <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ color: '#FFB74D', fontSize: 18 }}>schedule</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#FFB74D' }}>Données anciennes détectées</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {stale.map(s => s.name).join(', ')} — dernière lecture il y a plus de 30 min.
                      Vérifier la connexion MQTT du broker ou l'alimentation de l'ESP32.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB: ÉNERGIE
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'energy' && (
          <div className="space-y-5">

            {/* Estimated consumption */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: 'bolt', label: 'CONSOMMATION ESTIMÉE', value: `${estimatedWatts.toFixed(1)}`, unit: 'W',
                  sub: `${onlineSensors.length} capteurs actifs`, color: '#FF7043',
                  note: 'Calculé depuis les capteurs actifs + actionneurs',
                },
                {
                  icon: 'memory', label: 'CAPTEURS ACTIFS', value: String(onlineSensors.length), unit: `/ ${sensors.length}`,
                  sub: `${offlineSensors.length} hors ligne`, color: '#2AD368',
                  note: 'ESP32 principal + modules connectés',
                },
                {
                  icon: 'database', label: 'LECTURES STOCKÉES', value: sensors.reduce((a, s) => a + ((s as any)._count?.sensor_readings || 0), 0).toLocaleString('fr-FR'),
                  unit: '', sub: 'Base TimescaleDB', color: '#64B5F6',
                  note: 'Total historique PostgreSQL',
                },
              ].map(({ icon, label, value, unit, sub, color, note }) => (
                <div key={label} className="rounded-3xl p-6 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}22`, boxShadow: `0 0 20px ${color}08` }}>
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                      <span className="material-symbols-outlined" style={{ color, fontSize: 18 }}>{icon}</span>
                    </div>
                    <span className="font-black text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{label}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="font-black" style={{ fontSize: 36, color, textShadow: `0 0 16px ${color}55` }}>{value}</span>
                    {unit && <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{unit}</span>}
                  </div>
                  <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
                  <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>{note}</p>
                </div>
              ))}
            </div>

            {/* Real sensors contributing to consumption */}
            <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full" style={{ background: '#2AD368', boxShadow: '0 0 8px #2AD368' }} />
                <span className="font-black text-sm tracking-wider" style={{ color: '#fff', letterSpacing: '0.08em' }}>CONSOMMATION PAR MODULE</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Estimations basées sur fiches techniques ESP32</span>
              </div>

              <div className="space-y-3">
                {/* Base */}
                {(() => {
                  const items = [
                    { label: 'ESP32 — carte principale', w: 8, color: '#90CAF9', icon: 'developer_board' },
                    ...onlineSensors.map(s => {
                      const m = getMeta(s.type);
                      return { label: s.name, w: SENSOR_WATT[s.type] || 0.5, color: m.color, icon: m.icon };
                    }),
                    ...(map.light != null && map.light < 300 ? [{ label: 'Éclairage LED (compensation luminosité basse)', w: 18, color: '#CBED62', icon: 'light_mode' }] : []),
                    ...(map.soil_moisture != null && map.soil_moisture < 30 ? [{ label: 'Pompe irrigation (sol sec)', w: 40, color: '#64B5F6', icon: 'water_drop' }] : []),
                    ...(map.temperature != null && map.temperature > 28 ? [{ label: 'Ventilation (température haute)', w: 25, color: '#FF7043', icon: 'air' }] : []),
                  ];
                  const total = items.reduce((a, i) => a + i.w, 0);
                  return items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined" style={{ color: item.color, fontSize: 15 }}>{item.icon}</span>
                          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {((item.w / total) * 100).toFixed(0)}%
                          </span>
                          <span className="font-bold text-sm" style={{ color: item.color }}>{item.w}W</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div style={{ width: `${(item.w / total) * 100}%`, height: '100%', background: item.color, borderRadius: 9999, boxShadow: `0 0 4px ${item.color}66`, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="font-black text-sm" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>TOTAL ESTIMÉ</span>
                <span className="font-black text-xl" style={{ color: '#2AD368', textShadow: '0 0 12px #2AD36866' }}>{estimatedWatts.toFixed(1)} W</span>
              </div>
            </div>

            {/* Info notice */}
            <div className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(100,181,246,0.04)', border: '1px solid rgba(100,181,246,0.15)' }}>
              <span className="material-symbols-outlined flex-shrink-0" style={{ color: '#64B5F6', fontSize: 18 }}>info</span>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Les valeurs énergétiques sont des <strong style={{ color: 'rgba(255,255,255,0.7)' }}>estimations</strong> basées sur les fiches techniques des composants.
                La serre Virida n'est pas encore équipée de capteurs de courant (INA226/CT clamp) —
                l'ajout d'un tel capteur permettrait un suivi précis en temps réel.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
