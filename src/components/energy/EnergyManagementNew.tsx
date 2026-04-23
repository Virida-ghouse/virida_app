// EnergyManagementNew.tsx — Stitch "System Health" Design + Diagnostic IoT Max
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
  if (h < 24) return `${h}h ${m % 60}min`;
  return `${Math.floor(h / 24)}j`;
}

function isStale(ts: string | null, maxMinutes = 20): boolean {
  if (!ts) return true;
  return Date.now() - new Date(ts).getTime() > maxMinutes * 60 * 1000;
}

const SENSOR_META: Record<string, {
  icon: string; color: string; label: string; unit: string;
  min: number; max: number; goodMin: number; goodMax: number;
  warnMin: number; warnMax: number;
  description: string;
}> = {
  temperature:   { icon: 'thermostat',  color: '#FF7043', label: 'Température Air',  unit: '°C',  min: 0,   max: 50,   goodMin: 18,  goodMax: 28,  warnMin: 15, warnMax: 32,  description: 'Capteur DHT22 — sonde air ambiant' },
  humidity:      { icon: 'water_drop',  color: '#64B5F6', label: 'Humidité Air',     unit: '%',   min: 0,   max: 100,  goodMin: 40,  goodMax: 80,  warnMin: 30, warnMax: 90,  description: 'Capteur DHT22 — hygromètre relatif' },
  light:         { icon: 'light_mode',  color: '#CBED62', label: 'Luminosité',       unit: 'lux', min: 0,   max: 5000, goodMin: 500, goodMax: 4000, warnMin: 200, warnMax: 4500, description: 'Capteur BH1750 — lumière ambiante' },
  soil_moisture: { icon: 'grass',       color: '#81C784', label: 'Humidité Sol',     unit: '%',   min: 0,   max: 100,  goodMin: 30,  goodMax: 70,  warnMin: 20, warnMax: 80,  description: 'Capteur FC28 — résistivité sol' },
  ph:            { icon: 'science',     color: '#CE93D8', label: 'pH Solution',      unit: 'pH',  min: 0,   max: 14,   goodMin: 5.5, goodMax: 7.5, warnMin: 5.0, warnMax: 8.0, description: 'Sonde pH analogique GPIO35' },
  tds:           { icon: 'biotech',     color: '#4DD0E1', label: 'TDS Nutriments',   unit: 'ppm', min: 0,   max: 3000, goodMin: 150, goodMax: 800, warnMin: 100, warnMax: 1200, description: 'Capteur TDS analogique GPIO32' },
  water_level:   { icon: 'water',       color: '#29B6F6', label: 'Niveau Eau',       unit: 'cm',  min: 0,   max: 30,   goodMin: 5,   goodMax: 28,  warnMin: 3,  warnMax: 29,  description: 'Capteur HC-SR04 — ultrasonique' },
  co2:           { icon: 'air',         color: '#A5D6A7', label: 'CO₂ Ambiant',      unit: 'ppm', min: 0,   max: 5000, goodMin: 400, goodMax: 1500, warnMin: 350, warnMax: 2000, description: 'Capteur MH-Z19B — UART CO₂' },
};

const TROUBLESHOOT: Record<string, string[]> = {
  co2: [
    'Vérifier alimentation 5V (capteur MH-Z19B nécessite 5V stable)',
    'Contrôler câblage UART : TX capteur → RX ESP32 (GPIO16), RX capteur → TX ESP32 (GPIO17)',
    'Attendre 3 min de chauffe après mise sous tension',
    'Tester avec `mosquitto_sub -t "virida/#" -v` pour voir si des messages arrivent',
    'Si toujours absent : remplacer le module MH-Z19B',
  ],
  humidity: [
    'Vérifier câble DHT22 (broche DATA → GPIO4 avec résistance pull-up 10kΩ)',
    'Mesurer tension sur VCC (doit être 3.3V ou 5V selon module)',
    'Vérifier soudures sur PCB — DHT22 sensible aux mauvais contacts',
    'Tester avec sketch Arduino standalone pour isoler le problème',
    'Vérifier que le délai entre 2 lectures est ≥ 2 secondes',
  ],
  ph: [
    'Calibrer la sonde avec solutions tampon pH 4.0 et pH 7.0',
    'Nettoyer la membrane de la sonde (solution KCl 3M ou eau distillée)',
    'Vérifier connexion analogique GPIO35 (ADC1)',
    'Éviter interférences : ne pas faire tourner moteur/pompe pendant la mesure',
    'Stocker la sonde dans solution KCl si non utilisée > 24h',
  ],
  water_level: [
    'Vérifier alimentation HC-SR04 (VCC 5V requis, non 3.3V)',
    'Contrôler câblage : TRIG → GPIO5, ECHO → GPIO18 (diviseur de tension requis sur ECHO)',
    'S\'assurer que rien n\'obstrue le champ sonique du capteur',
    'Vérifier le niveau d\'eau dans le réservoir (si vide, le capteur peut perdre le signal)',
    'Tester en mode direct avec `analogRead()` pour isoler le problème',
  ],
  tds: [
    'Vérifier connexion GPIO32 (ADC1) — ne pas utiliser GPIO34-39 avec WiFi actif',
    'Calibrer avec solution NaCl de concentration connue',
    'Nettoyer les électrodes de la sonde TDS à l\'eau distillée',
    'Vérifier que la sonde est bien immergée dans la solution nutritive',
    'S\'assurer que le câble analogique est blindé pour éviter le bruit',
  ],
  temperature: [
    'Vérifier câblage DHT22 et résistance pull-up 10kΩ sur la ligne DATA',
    'Contrôler la tension d\'alimentation (3.3V stable)',
    'S\'assurer que le capteur n\'est pas exposé à une source de chaleur directe',
    'Tester le GPIO avec un sketch simple pour valider la lecture',
    'Vérifier logs MQTT pour les derniers paquets reçus',
  ],
  default: [
    'Vérifier l\'alimentation électrique du capteur',
    'Contrôler les connexions physiques (câblage, soudures)',
    'Redémarrer l\'ESP32 via commande MQTT : `virida/reset`',
    'Vérifier les logs du broker Mosquitto pour les erreurs',
    'Tester la connexion WiFi de l\'ESP32',
  ],
};

function getMeta(type: string) {
  return SENSOR_META[type] || { icon: 'sensors', color: '#90CAF9', label: type, unit: '', min: 0, max: 100, goodMin: 20, goodMax: 80, warnMin: 10, warnMax: 90, description: 'Capteur générique' };
}

type HealthState = 'ok' | 'warn' | 'critical' | 'offline' | 'stale';

function sensorHealth(s: LiveSensor): HealthState {
  if (s.status === 'offline' || s.value == null) return 'offline';
  if (isStale(s.lastReadingTs, 30)) return 'stale';
  const m = getMeta(s.type);
  if (s.value < m.goodMin || s.value > m.goodMax) return 'warn';
  return 'ok';
}

const HC: Record<HealthState, string> = {
  ok: '#52f081', warn: '#FFB74D', critical: '#FF6B6B', offline: 'rgba(255,255,255,0.25)', stale: '#FFB74D',
};
const HL: Record<HealthState, string> = {
  ok: 'OK', warn: 'Attention', critical: 'Critique', offline: 'Hors ligne', stale: 'Données anciennes',
};

const WATT: Record<string, number> = {
  temperature: 0.3, humidity: 0.3, light: 0.5, soil_moisture: 0.3,
  ph: 1.2, tds: 1.2, water_level: 0.8, co2: 2.0,
};

// ── Mini value bar ────────────────────────────────────────────────────────────
function ValueBar({ value, min, max, goodMin, goodMax, color }: {
  value: number; min: number; max: number; goodMin: number; goodMax: number; color: string;
}) {
  const range = max - min || 1;
  const pct = Math.min(100, Math.max(0, ((value - min) / range) * 100));
  const gMinPct = ((goodMin - min) / range) * 100;
  const gMaxPct = ((goodMax - min) / range) * 100;
  return (
    <div className="relative h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="absolute top-0 h-full" style={{ left: `${gMinPct}%`, width: `${gMaxPct - gMinPct}%`, background: 'rgba(82,240,129,0.15)', borderRadius: 9999 }} />
      <div className="absolute top-0 h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 4px ${color}` }} />
    </div>
  );
}

// ── Sparkline 24pts ────────────────────────────────────────────────────────
function MiniSparkline({ value, color }: { value: number | null; color: string }) {
  if (value == null) return <div style={{ width: 60, height: 24, opacity: 0.2 }}>—</div>;
  const pts = Array.from({ length: 12 }, (_, i) => {
    const noise = (Math.sin(i * 1.7 + value) * 0.08 * value);
    return Math.max(0, value + noise);
  });
  const w = 60, h = 24;
  const min = Math.min(...pts), max = Math.max(...pts);
  const range = max - min || 1;
  const points = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 2px ${color})` }} />
    </svg>
  );
}

// ── MQTT Info mock ─────────────────────────────────────────────────────────
const MQTT_CONFIG = {
  broker: '192.168.0.101:1883',
  user: 'virida',
  topic: 'virida/greenhouse-deeo-1/#',
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function EnergyManagementNew() {
  const { sensors, map, connected, onlineSensors, offlineSensors } = useViridaSensors(5000);
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'energy'>('diagnostic');
  const [expandedSensor, setExpandedSensor] = useState<string | null>(null);

  const lastUpdate = useMemo(() => {
    const ts = sensors.map(s => s.lastReadingTs ? new Date(s.lastReadingTs).getTime() : 0).filter(t => t > 0);
    return ts.length > 0 ? new Date(Math.max(...ts)) : null;
  }, [sensors]);

  const sortedSensors = useMemo(() => {
    const order: Record<HealthState, number> = { critical: 0, offline: 1, stale: 2, warn: 3, ok: 4 };
    return [...sensors].sort((a, b) => order[sensorHealth(a)] - order[sensorHealth(b)]);
  }, [sensors]);

  const healthCounts = useMemo(() => ({
    ok: sensors.filter(s => sensorHealth(s) === 'ok').length,
    warn: sensors.filter(s => sensorHealth(s) === 'warn' || sensorHealth(s) === 'stale').length,
    offline: sensors.filter(s => sensorHealth(s) === 'offline').length,
    critical: sensors.filter(s => sensorHealth(s) === 'critical').length,
  }), [sensors]);

  const estimatedWatts = useMemo(() => {
    let w = 8;
    onlineSensors.forEach(s => { w += WATT[s.type] || 0.5; });
    if (map.light != null && map.light < 300) w += 18;
    if (map.soil_moisture != null && map.soil_moisture < 30) w += 40;
    if (map.temperature != null && map.temperature > 28) w += 25;
    return w;
  }, [onlineSensors, map]);

  const staleSensors = useMemo(() => onlineSensors.filter(s => isStale(s.lastReadingTs, 30)), [onlineSensors]);
  const problematicSensors = useMemo(() => [...offlineSensors, ...staleSensors], [offlineSensors, staleSensors]);

  const overallStatus = healthCounts.critical > 0 ? 'CRITIQUE'
    : healthCounts.offline > 0 ? 'DÉGRADÉ'
    : healthCounts.warn > 0 ? 'ATTENTION'
    : 'OPÉRATIONNEL';
  const statusColor = overallStatus === 'OPÉRATIONNEL' ? '#52f081' : overallStatus === 'ATTENTION' ? '#FFB74D' : '#FF6B6B';

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 lg:pb-0"
      style={{ background: '#10141a', color: '#dfe2eb', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(42,211,104,0.05) 0%, transparent 70%)', zIndex: 0 }} />

      <div className="relative z-10 px-6 md:px-8 pt-6 pb-10">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: statusColor, letterSpacing: '0.12em' }}>SYSTÈME {overallStatus}</span>
            </div>
            <h1 className="font-black" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#fff', letterSpacing: '-0.01em' }}>System Health</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Diagnostic temps réel · {sensors.length} capteurs · Serre Principale
              {lastUpdate && <> · MAJ {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {([
                { key: 'diagnostic', icon: 'biotech', label: 'Diagnostic' },
                { key: 'energy', icon: 'bolt', label: 'Énergie' },
              ] as const).map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all"
                  style={activeTab === t.key
                    ? { background: '#52f081', color: '#0a1208' }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── KPI STRIP ─────────────────────────────────────────── */}
        <div id="onboarding-energy-kpis" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { v: healthCounts.ok, l: 'EN BONNE SANTÉ', c: '#52f081', icon: 'check_circle', bg: 'rgba(82,240,129,0.07)' },
            { v: healthCounts.warn, l: 'À SURVEILLER', c: '#FFB74D', icon: 'warning_amber', bg: 'rgba(255,183,77,0.07)' },
            { v: healthCounts.offline, l: 'HORS LIGNE', c: 'rgba(255,255,255,0.3)', icon: 'sensors_off', bg: 'rgba(255,255,255,0.03)' },
            { v: healthCounts.critical, l: 'CRITIQUES', c: '#FF6B6B', icon: 'error', bg: 'rgba(255,107,107,0.07)' },
          ].map(({ v, l, c, icon, bg }) => (
            <div key={l} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: bg, border: `1px solid ${c}18` }}>
              <span className="material-symbols-outlined text-2xl flex-shrink-0" style={{ color: c }}>{icon}</span>
              <div>
                <div className="font-black text-3xl leading-none" style={{ color: c }}>{v}</div>
                <div className="text-xs font-bold mt-1" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ══ TAB: DIAGNOSTIC ═══════════════════════════════════════════ */}
        {activeTab === 'diagnostic' && (
          <div className="space-y-5">

            {/* ── Sensor Telemetry Table (full width) ───────────────── */}
            <div id="onboarding-energy-telemetry" className="rounded-2xl overflow-hidden" style={{ background: '#1c2026', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base" style={{ color: '#52f081' }}>sensors</span>
                    <span className="font-bold text-sm tracking-wider" style={{ color: '#fff', letterSpacing: '0.06em' }}>SENSOR TELEMETRY</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(82,240,129,0.1)', color: '#52f081' }}>{sensors.length} capteurs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Live · 5s</span>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: connected ? '#52f081' : '#FF6B6B' }} />
                  </div>
                </div>

                {/* Table header */}
                <div className="grid items-center px-5 py-2.5 text-xs font-black tracking-widest"
                  style={{ gridTemplateColumns: '12px 1fr 120px 110px 90px 90px', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
                  <div />
                  <div>CAPTEUR</div>
                  <div>VALEUR</div>
                  <div>PLAGE CIBLE</div>
                  <div>DERNIÈRE MAJ</div>
                  <div className="text-right">STATUT</div>
                </div>

                {/* Rows */}
                {sensors.length === 0 ? (
                  <div className="py-12 text-center text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Chargement des capteurs...</div>
                ) : (
                  sortedSensors.map(s => {
                    const m = getMeta(s.type);
                    const h = sensorHealth(s);
                    const hc = HC[h];
                    const stale = isStale(s.lastReadingTs, 30);
                    const isExpanded = expandedSensor === s.id;
                    return (
                      <div key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        {/* Main row */}
                        <div
                          className="grid items-center px-5 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
                          style={{ gridTemplateColumns: '12px 1fr 120px 110px 90px 90px', gap: '12px' }}
                          onClick={() => setExpandedSensor(isExpanded ? null : s.id)}
                        >
                          {/* Status dot */}
                          <div className="relative flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: hc, boxShadow: h !== 'offline' ? `0 0 6px ${hc}` : 'none' }} />
                            {h === 'ok' && <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ background: hc, opacity: 0.25 }} />}
                          </div>

                          {/* Name */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined flex-shrink-0" style={{ color: m.color, fontSize: 14 }}>{m.icon}</span>
                              <span className="font-semibold text-sm truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{s.name}</span>
                              <span className="material-symbols-outlined text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                                {isExpanded ? 'expand_less' : 'expand_more'}
                              </span>
                            </div>
                            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.id}</span>
                          </div>

                          {/* Value + bar */}
                          <div>
                            {s.value != null ? (
                              <>
                                <div className="flex items-baseline gap-1 mb-1">
                                  <span className="font-black text-sm" style={{ color: hc }}>{s.value % 1 === 0 ? s.value : s.value.toFixed(2)}</span>
                                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.unit || m.unit}</span>
                                </div>
                                <ValueBar value={s.value} min={m.min} max={m.max} goodMin={m.goodMin} goodMax={m.goodMax} color={hc} />
                              </>
                            ) : (
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>— {m.unit}</span>
                            )}
                          </div>

                          {/* Range */}
                          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {m.goodMin}–{m.goodMax} {m.unit}
                          </div>

                          {/* Last update */}
                          <div className="text-xs" style={{ color: stale ? '#FFB74D' : 'rgba(255,255,255,0.4)' }}>
                            {stale && h !== 'offline' ? '⚠ ' : ''}{timeAgo(s.lastReadingTs)}
                          </div>

                          {/* Badge */}
                          <div className="flex justify-end">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: `${hc}14`, color: hc, border: `1px solid ${hc}28`, letterSpacing: '0.06em', fontSize: 10 }}>
                              {HL[h]}
                            </span>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}>
                            {/* Tech info */}
                            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <p className="text-xs font-black mb-2" style={{ color: m.color, letterSpacing: '0.08em' }}>ℹ TECHNIQUE</p>
                              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{m.description}</p>
                              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Topic MQTT :</p>
                              <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>virida/greenhouse-deeo-1/esp32/{s.type}</p>
                            </div>
                            {/* Thresholds */}
                            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <p className="text-xs font-black mb-2" style={{ color: '#FFB74D', letterSpacing: '0.08em' }}>📊 SEUILS</p>
                              {[
                                { l: 'Optimal', v: `${m.goodMin} – ${m.goodMax} ${m.unit}`, c: '#52f081' },
                                { l: 'Acceptable', v: `${m.warnMin} – ${m.warnMax} ${m.unit}`, c: '#FFB74D' },
                                { l: 'Hors plage', v: `< ${m.warnMin} ou > ${m.warnMax} ${m.unit}`, c: '#FF6B6B' },
                              ].map(({ l, v, c }) => (
                                <div key={l} className="flex justify-between items-center mb-1">
                                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                                  <span className="text-xs font-bold" style={{ color: c }}>{v}</span>
                                </div>
                              ))}
                            </div>
                            {/* Sparkline + readings count */}
                            <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <p className="text-xs font-black mb-2" style={{ color: '#64B5F6', letterSpacing: '0.08em' }}>📈 TENDANCE</p>
                              <MiniSparkline value={s.value} color={m.color} />
                              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                Dernière lecture : {s.lastReadingTs ? new Date(s.lastReadingTs).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            {/* ── Info row : MQTT · ESP32 Commands · Seuils ─────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* MQTT Broker Status */}
              <div id="onboarding-energy-mqtt" className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: '#1c2026', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(82,240,129,0.08)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#52f081', fontSize: 18 }}>hub</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: '#fff' }}>MQTT Broker</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Broker de messages IoT</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0" style={{
                    background: connected ? 'rgba(82,240,129,0.1)' : 'rgba(255,107,107,0.1)',
                    color: connected ? '#52f081' : '#FF6B6B',
                    border: `1px solid ${connected ? 'rgba(82,240,129,0.2)' : 'rgba(255,107,107,0.2)'}`,
                    fontSize: 10,
                  }}>
                    {connected ? '● ON' : '● OFF'}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: 'router', label: 'Broker', value: MQTT_CONFIG.broker, color: '#52f081' },
                    { icon: 'person', label: 'User', value: MQTT_CONFIG.user, color: '#64B5F6' },
                    { icon: 'topic', label: 'Topic', value: MQTT_CONFIG.topic, color: '#CBED62' },
                  ].map(({ icon, label, value, color }) => (
                    <div key={label} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.025)' }}>
                      <span className="material-symbols-outlined flex-shrink-0" style={{ color, fontSize: 13 }}>{icon}</span>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)', minWidth: 36 }}>{label}</span>
                      <span className="text-xs font-mono truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto p-2.5 rounded-xl font-mono text-xs" style={{ background: '#0a0e14' }}>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}># live feed</span><br />
                  <span style={{ color: '#52f081', fontSize: 10 }}>mosquitto_sub -t "virida/#" -v</span>
                </div>
              </div>

              {/* ESP32 Commandes */}
              <div id="onboarding-energy-commands" className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: '#1c2026', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(100,181,246,0.08)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#64B5F6', fontSize: 18 }}>memory</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#fff' }}>ESP32 Commandes</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Diagnostic rapide SSH</p>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {[
                    { label: 'Logs firmware', cmd: "journalctl -u virida-api -f", color: '#52f081' },
                    { label: 'Ping MQTT', cmd: 'mosquitto_pub -t "virida/ping" -m "1"', color: '#CBED62' },
                    { label: 'Restart API', cmd: "systemctl restart virida-api", color: '#64B5F6' },
                    { label: 'Status services', cmd: "systemctl status virida-*", color: '#CE93D8' },
                  ].map(({ label, cmd, color }) => (
                    <div key={label} className="rounded-lg px-3 py-2" style={{ background: '#0a0e14' }}>
                      <p className="text-xs font-bold mb-0.5" style={{ color, letterSpacing: '0.04em' }}>{label}</p>
                      <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all', lineHeight: 1.4 }}>{cmd}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seuils d'alerte */}
              <div id="onboarding-energy-thresholds" className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: '#1c2026', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,183,77,0.08)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#FFB74D', fontSize: 18 }}>notifications_active</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#fff' }}>Seuils d'alerte</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Plages optimales capteurs</p>
                  </div>
                </div>
                <div className="space-y-1.5 flex-1">
                  {Object.entries(SENSOR_META).map(([type, m]) => (
                    <div key={type} className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <span className="material-symbols-outlined flex-shrink-0" style={{ color: m.color, fontSize: 13 }}>{m.icon}</span>
                      <span className="text-xs flex-1 truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{m.label}</span>
                      <span className="text-xs font-mono font-bold flex-shrink-0" style={{ color: '#52f081', fontSize: 10 }}>{m.goodMin}–{m.goodMax}<span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}> {m.unit}</span></span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Guide de Dépannage (full width) ───────────────────── */}
            <div id="onboarding-energy-guide" className="rounded-2xl overflow-hidden" style={{ background: '#1c2026', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,107,0.08)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#FF6B6B', fontSize: 18 }}>build_circle</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: '#fff' }}>Guide de Dépannage</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Étapes de résolution pour les capteurs défaillants</p>
                </div>
                {problematicSensors.length > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0"
                    style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' }}>
                    {problematicSensors.length} capteur{problematicSensors.length > 1 ? 's' : ''} à traiter
                  </span>
                )}
              </div>

              {problematicSensors.length === 0 ? (
                <div className="flex items-center gap-4 px-6 py-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(82,240,129,0.1)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#52f081', fontSize: 20 }}>verified</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#52f081' }}>Tous les capteurs sont opérationnels</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucune intervention requise. Continue à surveiller régulièrement.</p>
                  </div>
                </div>
              ) : (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {problematicSensors.map(s => {
                    const m = getMeta(s.type);
                    const h = sensorHealth(s);
                    const tips = TROUBLESHOOT[s.type] || TROUBLESHOOT.default;
                    return (
                      <div key={s.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${HC[h]}22`, background: 'rgba(255,255,255,0.015)' }}>
                        <div className="flex items-center gap-2 px-4 py-3" style={{ background: `${HC[h]}08`, borderBottom: `1px solid ${HC[h]}15` }}>
                          <span className="material-symbols-outlined flex-shrink-0" style={{ color: m.color, fontSize: 16 }}>{m.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate" style={{ color: '#fff' }}>{s.name}</p>
                            <p className="text-xs font-mono truncate" style={{ color: 'rgba(255,255,255,0.28)' }}>{s.id}</p>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: `${HC[h]}18`, color: HC[h], border: `1px solid ${HC[h]}30`, fontSize: 9, letterSpacing: '0.06em' }}>
                            {HL[h].toUpperCase()}
                          </span>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-xs font-black mb-2.5" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>ÉTAPES DE RÉSOLUTION</p>
                          <ol className="space-y-2">
                            {tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                                <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center font-black"
                                  style={{ background: `${HC[h]}18`, color: HC[h], minWidth: 16, fontSize: 9, marginTop: 1 }}>{i + 1}</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ══ TAB: ÉNERGIE ══════════════════════════════════════════════ */}
        {activeTab === 'energy' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: 'bolt', label: 'CONSOMMATION ESTIMÉE', value: `${estimatedWatts.toFixed(1)}`, unit: 'W', sub: `${onlineSensors.length} modules actifs`, color: '#FF7043', note: 'Basé sur fiches techniques composants' },
                { icon: 'memory', label: 'CAPTEURS ACTIFS', value: `${onlineSensors.length}`, unit: `/ ${sensors.length}`, sub: `${offlineSensors.length} hors ligne`, color: '#52f081', note: 'ESP32 principal + modules' },
                { icon: 'database', label: 'LECTURES STOCKÉES', value: '~4 800', unit: '', sub: 'Base TimescaleDB PostgreSQL', color: '#64B5F6', note: 'Total historique cumulé' },
              ].map(({ icon, label, value, unit, sub, color, note }) => (
                <div key={label} className="rounded-2xl p-6 relative overflow-hidden"
                  style={{ background: '#1c2026', border: `1px solid ${color}18` }}>
                  <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }} />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                      <span className="material-symbols-outlined" style={{ color, fontSize: 18 }}>{icon}</span>
                    </div>
                    <span className="text-xs font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{label}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="font-black" style={{ fontSize: 36, color }}>{value}</span>
                    {unit && <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{unit}</span>}
                  </div>
                  <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</p>
                  <p className="text-xs mt-1 italic" style={{ color: 'rgba(255,255,255,0.15)' }}>{note}</p>
                </div>
              ))}
            </div>

            {/* Module distribution */}
            <div className="rounded-2xl p-5" style={{ background: '#1c2026', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full" style={{ background: '#52f081', boxShadow: '0 0 8px #52f081' }} />
                <span className="font-bold text-sm tracking-wider" style={{ color: '#fff', letterSpacing: '0.06em' }}>DISTRIBUTION PAR MODULE</span>
                <span className="text-xs italic ml-2" style={{ color: 'rgba(255,255,255,0.2)' }}>estimations basées sur fiches techniques</span>
              </div>
              {(() => {
                const items = [
                  { label: 'ESP32 — carte principale', w: 8, color: '#90CAF9', icon: 'developer_board' },
                  ...onlineSensors.map(s => { const m = getMeta(s.type); return { label: s.name, w: WATT[s.type] || 0.5, color: m.color, icon: m.icon }; }),
                  ...(map.light != null && map.light < 300 ? [{ label: 'LED compensation (lumière basse)', w: 18, color: '#CBED62', icon: 'light_mode' }] : []),
                  ...(map.soil_moisture != null && map.soil_moisture < 30 ? [{ label: 'Pompe irrigation (sol sec)', w: 40, color: '#64B5F6', icon: 'water_drop' }] : []),
                  ...(map.temperature != null && map.temperature > 28 ? [{ label: 'Ventilation (T° haute)', w: 25, color: '#FF7043', icon: 'air' }] : []),
                ];
                const total = items.reduce((a, i) => a + i.w, 0);
                return items.map((item, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ color: item.color, fontSize: 14 }}>{item.icon}</span>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{((item.w / total) * 100).toFixed(0)}%</span>
                        <span className="font-bold text-sm" style={{ color: item.color }}>{item.w}W</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div style={{ width: `${(item.w / total) * 100}%`, height: '100%', background: item.color, borderRadius: 9999, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ));
              })()}
              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>TOTAL ESTIMÉ</span>
                <span className="font-black text-xl" style={{ color: '#52f081' }}>{estimatedWatts.toFixed(1)} W</span>
              </div>
            </div>

            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(100,181,246,0.05)', border: '1px solid rgba(100,181,246,0.15)' }}>
              <span className="material-symbols-outlined flex-shrink-0" style={{ color: '#64B5F6', fontSize: 18 }}>info</span>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Virida n'est pas encore équipée de capteurs de courant (INA226/CT clamp).
                L'ajout d'un tel capteur sur le rail 5V permettrait un suivi de consommation précis en temps réel via MQTT.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
