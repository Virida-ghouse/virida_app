// ReportsNew.tsx — Cerveau analytique Virida — design premium
import React, { useState, useEffect, useCallback } from 'react';
import { useViridaSensors } from '../../hooks/useViridaSensors';
import { plantService, Plant } from '../../services/api/plantService';
import { chatService } from '../../services/api/chatService';

// ── Types ─────────────────────────────────────────────────────────────
type Period = '7j' | '30j' | '90j';

interface Anomaly {
  label: string; value: string;
  severity: 'critical' | 'warning'; action: string;
}

// ── Virida Score ──────────────────────────────────────────────────────
function calcViridaScore(map: Record<string, number | null>): number {
  let score = 0, total = 0;
  if (map.ph != null) {
    total += 30;
    const p = map.ph;
    if (p >= 5.5 && p <= 7.0) score += 30;
    else if ((p >= 5.0 && p < 5.5) || (p > 7.0 && p <= 7.5)) score += 18;
    else if (p >= 4.5) score += 8;
  }
  if (map.light != null) {
    total += 25;
    const l = map.light;
    if (l >= 2000) score += 25; else if (l >= 500) score += 16; else if (l >= 100) score += 8;
  }
  if (map.soil_moisture != null) {
    total += 25;
    const s = map.soil_moisture;
    if (s >= 30 && s <= 70) score += 25;
    else if ((s >= 20 && s < 30) || (s > 70 && s <= 80)) score += 15;
    else score += 5;
  }
  if (map.tds != null) {
    total += 15;
    const t = map.tds;
    if (t >= 150 && t <= 800) score += 15;
    else if ((t >= 100 && t < 150) || (t > 800 && t <= 1200)) score += 9;
    else score += 3;
  }
  if (map.temperature != null) {
    total += 10;
    const t = map.temperature;
    if (t >= 18 && t <= 28) score += 10;
    else if ((t >= 15 && t < 18) || (t > 28 && t <= 32)) score += 6;
    else if (t >= 10) score += 3;
  }
  return total === 0 ? 50 : Math.round((score / total) * 100);
}

function scoreColor(s: number) { return s >= 75 ? '#2AD368' : s >= 45 ? '#FFB74D' : '#FF6B6B'; }
function scoreLabel(s: number) { return s >= 75 ? 'Bonne santé' : s >= 45 ? 'Attention requise' : 'État critique'; }
function scoreGradient(s: number) {
  if (s >= 75) return 'from-[#2AD368]/20 to-[#CBED62]/5';
  if (s >= 45) return 'from-[#FFB74D]/20 to-[#FF8C00]/5';
  return 'from-[#FF6B6B]/20 to-[#FF0000]/5';
}

// ── Anomalies ─────────────────────────────────────────────────────────
function getAnomalies(map: Record<string, number | null>): Anomaly[] {
  const r: Anomaly[] = [];
  if (map.ph != null) {
    if (map.ph < 4.5 || map.ph > 8.5) r.push({ label: 'pH solution', value: `${map.ph.toFixed(2)} pH`, severity: 'critical', action: map.ph < 5.5 ? 'Ajouter solution pH+' : 'Ajouter solution pH-' });
    else if (map.ph < 5.5 || map.ph > 7.5) r.push({ label: 'pH solution', value: `${map.ph.toFixed(2)} pH`, severity: 'warning', action: map.ph < 5.5 ? 'Corriger avec pH+' : 'Corriger avec pH-' });
  }
  if (map.light != null) {
    if (map.light < 50) r.push({ label: 'Luminosité', value: `${Math.round(map.light)} lux`, severity: 'critical', action: 'Activer éclairage LED' });
    else if (map.light < 500) r.push({ label: 'Luminosité', value: `${Math.round(map.light)} lux`, severity: 'warning', action: 'Augmenter durée éclairage' });
  }
  if (map.soil_moisture != null) {
    if (map.soil_moisture < 20) r.push({ label: 'Humidité sol', value: `${Math.round(map.soil_moisture)}%`, severity: 'critical', action: 'Arrosage urgent' });
    else if (map.soil_moisture > 85) r.push({ label: 'Humidité sol', value: `${Math.round(map.soil_moisture)}%`, severity: 'warning', action: 'Réduire arrosage' });
  }
  if (map.tds != null) {
    if (map.tds < 80) r.push({ label: 'Nutriments', value: `${Math.round(map.tds)} ppm`, severity: 'critical', action: 'Fertiliser immédiatement' });
    else if (map.tds > 1500) r.push({ label: 'Nutriments', value: `${Math.round(map.tds)} ppm`, severity: 'warning', action: 'Diluer la solution' });
  }
  if (map.temperature != null) {
    if (map.temperature < 10 || map.temperature > 40) r.push({ label: 'Température', value: `${map.temperature.toFixed(1)}°C`, severity: 'critical', action: map.temperature < 15 ? 'Activer chauffage' : 'Activer ventilation' });
    else if (map.temperature < 15 || map.temperature > 32) r.push({ label: 'Température', value: `${map.temperature.toFixed(1)}°C`, severity: 'warning', action: map.temperature < 15 ? 'Augmenter température' : 'Réduire température' });
  }
  return r;
}

function calcDLI(lux: number | null) {
  const target = 12;
  if (lux == null) return { value: 0, target, pct: 0 };
  const v = Math.round((lux * 0.0185 * 12) * 10) / 10;
  return { value: v, target, pct: Math.min(100, Math.round((v / target) * 100)) };
}

// ── Score Ring ────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 60, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 156, height: 156 }}>
      {/* Glow */}
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${color}22 0%, transparent 70%)` }} />
      <svg width="156" height="156" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="78" cy="78" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle cx="78" cy="78" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="relative flex flex-col items-center justify-center">
        <span className="font-black leading-none" style={{ fontSize: 42, color, textShadow: `0 0 20px ${color}66` }}>{score}</span>
        <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>/ 100</span>
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────
function Bar({ value, max, color, h = 6 }: { value: number; max: number; color: string; h?: number }) {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div className="rounded-full overflow-hidden" style={{ height: h, background: 'rgba(255,255,255,0.06)' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 9999, boxShadow: `0 0 8px ${color}88`, transition: 'width 0.8s ease' }} />
    </div>
  );
}

// ── Metric Hero Card ──────────────────────────────────────────────────
function MetricCard({ icon, label, value, unit, barVal, barMax, color, sub, gradient }: {
  icon: string; label: string; value: string; unit: string;
  barVal: number; barMax: number; color: string; sub: string; gradient: string;
}) {
  return (
    <div className={`glass-card rounded-3xl p-5 border border-white/5 flex flex-col gap-3 bg-gradient-to-br ${gradient} hover:scale-[1.02] transition-transform duration-300 cursor-default`}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <span className="material-symbols-outlined" style={{ color, fontSize: 20 }}>{icon}</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-black leading-none" style={{ fontSize: 36, color, textShadow: `0 0 16px ${color}55` }}>{value}</span>
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{unit}</span>
      </div>
      <Bar value={barVal} max={barMax} color={color} />
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</span>
    </div>
  );
}

// ── Stage helpers ─────────────────────────────────────────────────────
const STAGE_LABELS: Record<string, string> = {
  SEED: 'Germination', SEEDLING: 'Plantule', VEGETATIVE: 'Végétatif',
  FLOWERING: 'Floraison', FRUITING: 'Fructification', HARVEST: 'Récolte', PLANTED: 'Planté',
};
const STAGE_COLORS: Record<string, string> = {
  SEED: '#64B5F6', SEEDLING: '#81C784', VEGETATIVE: '#2AD368',
  FLOWERING: '#CE93D8', FRUITING: '#FFB74D', HARVEST: '#CBED62', PLANTED: '#2AD368',
};

// ── Main ──────────────────────────────────────────────────────────────
const ReportsNew: React.FC = () => {
  const { map, sensors, connected, onlineSensors, offlineSensors } = useViridaSensors(5000);
  const [period, setPeriod] = useState<Period>('7j');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [eveSummary, setEveSummary] = useState('');
  const [eveLoading, setEveLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const score = calcViridaScore(map);
  const anomalies = getAnomalies(map);
  const dli = calcDLI(map.light);
  const criticals = anomalies.filter(a => a.severity === 'critical').length;

  useEffect(() => {
    plantService.getPlants().then(r => setPlants(Array.isArray(r?.data) ? r.data : [])).catch(() => {});
  }, []);

  const fetchEveSummary = useCallback(async () => {
    setEveLoading(true);
    try {
      const sensorData: Record<string, any> = {};
      Object.entries(map).forEach(([k, v]) => { if (v != null) sensorData[k] = v; });
      const result = await chatService.sendMessage(
        `Donne-moi un résumé de l'état de la serre en 2-3 phrases maximum. Score de santé: ${score}/100. Sois direct et actionnable.`,
        undefined, undefined, sensorData
      );
      setEveSummary(result?.eveResponse?.replace(/^🐝\s*/, '') || '');
    } catch { /**/ } finally { setEveLoading(false); }
  }, [map, score]);

  useEffect(() => {
    if (sensors.length > 0 && !eveSummary) fetchEveSummary();
  }, [sensors]);

  const handleRefresh = async () => {
    setRefreshing(true); setEveSummary('');
    await fetchEveSummary(); setRefreshing(false);
  };

  // Insights
  const limitingFactors: string[] = [];
  const opportunities: string[] = [];
  if (map.ph != null && (map.ph < 5.5 || map.ph > 7.5)) limitingFactors.push(`pH ${map.ph.toFixed(1)} → absorption nutriments réduite`);
  if (map.light != null && map.light < 500) limitingFactors.push(`Lumière ${Math.round(map.light)} lux → photosynthèse limitée`);
  if (map.soil_moisture != null && map.soil_moisture < 30) limitingFactors.push(`Sol trop sec (${Math.round(map.soil_moisture)}%) → stress hydrique`);
  if (map.temperature != null && (map.temperature < 15 || map.temperature > 32)) limitingFactors.push(`Température ${map.temperature.toFixed(1)}°C → hors plage`);
  if (offlineSensors.length > 0) limitingFactors.push(`${offlineSensors.length} capteur(s) hors ligne`);
  if (map.tds != null && map.tds >= 150 && map.tds <= 800) opportunities.push('Nutriments optimaux — maintenir le dosage actuel');
  if (map.soil_moisture != null && map.soil_moisture >= 30 && map.soil_moisture <= 70) opportunities.push('Humidité sol parfaite — réduire fréquence arrosage');
  if (dli.pct < 50) opportunities.push(`+2h LED → croissance estimée améliorée`);
  if (map.temperature != null && map.temperature >= 18 && map.temperature <= 28) opportunities.push(`Température optimale (${map.temperature.toFixed(1)}°C) — conditions idéales`);
  if (anomalies.length === 0) opportunities.push('Tous les capteurs dans les normes ✓');

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[var(--bg-primary)] text-[var(--text-primary)] pb-20 lg:pb-0">

      {/* ══ HERO HEADER ══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${scoreColor(score)}18, transparent 70%)` }} />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(203,237,98,0.08), transparent 70%)' }} />

        <div className="relative p-6 md:p-8 lg:p-10 pb-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            {/* Title block */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${scoreColor(score)}18`, border: `1px solid ${scoreColor(score)}30` }}>
                <span className="material-symbols-outlined text-3xl" style={{ color: scoreColor(score) }}>analytics</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] leading-tight">
                  Rapports <span style={{ color: '#CBED62' }}>&</span> Analyses
                </h1>
                <p className="text-[var(--text-secondary)] text-sm mt-1 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${connected ? 'bg-[#2AD368] animate-pulse' : 'bg-red-400'}`} style={{ boxShadow: connected ? '0 0 6px #2AD368' : undefined }} />
                  {connected ? `${onlineSensors.length} capteurs en ligne · ${plants.length} culture${plants.length > 1 ? 's' : ''}` : 'Hors ligne'}
                </p>
              </div>
            </div>

            {/* Period + Refresh */}
            <div className="flex items-center gap-2">
              <div className="glass-card rounded-2xl p-1.5 flex gap-1 border border-white/8">
                {(['7j', '30j', '90j'] as Period[]).map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${period === p ? 'bg-[#2AD368] text-[#0a1510] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >{p}</button>
                ))}
              </div>
              <button onClick={handleRefresh} title="Rafraîchir EVE"
                className="w-10 h-10 rounded-2xl flex items-center justify-center glass-card border border-white/8 hover:border-[#2AD368]/30 transition-all"
              >
                <span className={`material-symbols-outlined text-[#2AD368] text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 lg:px-10 space-y-6 pb-8">

        {/* ══ ROW 1 : SCORE + EVE ANALYSIS ══════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Score card */}
          <div className={`lg:col-span-4 glass-card rounded-3xl p-6 border border-white/5 bg-gradient-to-br ${scoreGradient(score)} flex flex-col items-center justify-center gap-4 relative overflow-hidden`}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.03), transparent 60%)' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Virida Score</span>
            <ScoreRing score={score} />
            <div className="text-center">
              <p className="font-bold text-sm" style={{ color: scoreColor(score) }}>{scoreLabel(score)}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Période : {period === '7j' ? '7 jours' : period === '30j' ? '30 jours' : '90 jours'}</p>
            </div>
            {/* Mini stats row */}
            <div className="w-full grid grid-cols-3 gap-2 mt-1">
              {[
                { val: `${score}%`, label: 'Santé', color: scoreColor(score) },
                { val: String(criticals), label: 'Critiques', color: criticals > 0 ? '#FF6B6B' : '#2AD368' },
                { val: String(onlineSensors.length), label: 'En ligne', color: '#2AD368' },
              ].map(({ val, label, color }) => (
                <div key={label} className="rounded-2xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-xl font-black leading-none mb-1" style={{ color }}>{val}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* EVE Analysis */}
          <div className="lg:col-span-8 glass-card rounded-3xl border border-[#CBED62]/15 flex flex-col overflow-hidden">
            {/* EVE header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5" style={{ background: 'rgba(203,237,98,0.04)' }}>
              <div className="flex items-center gap-3">
                <img src="/abeillevd.svg" alt="EVE" className="w-8 h-8 animate-bee-fly-header"
                  style={{ filter: 'brightness(0) saturate(100%) invert(93%) sepia(18%) saturate(700%) hue-rotate(30deg)' }} />
                <div>
                  <span className="font-bold text-sm text-[#CBED62]">Analyse EVE</span>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Intelligence artificielle · Gemma 4</p>
                </div>
              </div>
              {eveLoading && (
                <div className="flex gap-1">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#CBED62] animate-bounce" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              )}
            </div>
            {/* EVE text */}
            <div className="flex-1 px-6 py-5">
              {eveLoading ? (
                <div className="space-y-2.5">
                  {[100, 80, 60].map((w, i) => (
                    <div key={i} className="h-3 rounded-full animate-pulse" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.07)' }} />
                  ))}
                </div>
              ) : (
                <p className="text-[var(--text-primary)] leading-relaxed text-sm md:text-base">
                  {eveSummary || <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Connexion à EVE pour l'analyse...</span>}
                </p>
              )}
            </div>
            {/* Insights bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/5">
              <div className="px-6 py-4 border-b md:border-b-0 md:border-r border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-sm" style={{ color: '#FF6B6B', fontSize: 16 }}>trending_down</span>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#FF6B6B' }}>Freins</span>
                </div>
                {limitingFactors.length === 0
                  ? <p className="text-sm text-[#2AD368]">Aucun facteur limitant ✓</p>
                  : <ul className="space-y-1.5">{limitingFactors.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--text-primary)] leading-snug">
                      <span className="flex-shrink-0 mt-0.5" style={{ color: '#FF6B6B' }}>•</span>{f}
                    </li>
                  ))}</ul>
                }
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-sm text-[#2AD368]" style={{ fontSize: 16 }}>trending_up</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2AD368]">Opportunités</span>
                </div>
                {opportunities.length === 0
                  ? <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Calcul en cours...</p>
                  : <ul className="space-y-1.5">{opportunities.map((o, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--text-primary)] leading-snug">
                      <span className="flex-shrink-0 mt-0.5 text-[#2AD368]">•</span>{o}
                    </li>
                  ))}</ul>
                }
              </div>
            </div>
          </div>
        </div>

        {/* ══ ROW 2 : KPI METRICS ═══════════════════════════════════ */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            icon="light_mode" label="DLI Estimé"
            value={String(dli.value)} unit="mol/m²/j"
            barVal={dli.value} barMax={dli.target}
            color={dli.pct < 30 ? '#FF6B6B' : dli.pct < 70 ? '#FFB74D' : '#2AD368'}
            sub={`Cible : ${dli.target} mol · ${dli.pct}%`}
            gradient={dli.pct < 30 ? 'from-red-500/8 to-transparent' : dli.pct < 70 ? 'from-orange-400/8 to-transparent' : 'from-[#2AD368]/8 to-transparent'}
          />
          <MetricCard
            icon="science" label="Niveau pH"
            value={map.ph != null ? map.ph.toFixed(2) : '—'} unit="pH"
            barVal={map.ph != null ? Math.max(0, Math.min(14, map.ph)) : 0} barMax={14}
            color={map.ph != null && (map.ph < 5.5 || map.ph > 7.5) ? '#FF6B6B' : '#a855f7'}
            sub="Optimal : 5.5 – 7.0"
            gradient={map.ph != null && (map.ph < 5.5 || map.ph > 7.5) ? 'from-red-500/8 to-transparent' : 'from-purple-500/8 to-transparent'}
          />
          <MetricCard
            icon="water_drop" label="Nutriments"
            value={map.tds != null ? String(Math.round(map.tds)) : '—'} unit="ppm"
            barVal={map.tds != null ? Math.min(map.tds, 1200) : 0} barMax={1200}
            color={map.tds != null && map.tds >= 150 ? '#2AD368' : '#FFB74D'}
            sub="Optimal : 150 – 800 ppm"
            gradient={map.tds != null && map.tds >= 150 ? 'from-[#2AD368]/8 to-transparent' : 'from-orange-400/8 to-transparent'}
          />
          <MetricCard
            icon="thermostat" label="Température"
            value={map.temperature != null ? map.temperature.toFixed(1) : '—'} unit="°C"
            barVal={map.temperature != null ? Math.max(0, Math.min(map.temperature, 40)) : 0} barMax={40}
            color={map.temperature != null && map.temperature >= 18 && map.temperature <= 28 ? '#2AD368' : map.temperature != null && (map.temperature < 15 || map.temperature > 32) ? '#FF6B6B' : '#FFB74D'}
            sub="Optimal : 18 – 28°C"
            gradient={map.temperature != null && map.temperature >= 18 && map.temperature <= 28 ? 'from-[#2AD368]/8 to-transparent' : 'from-red-500/8 to-transparent'}
          />
        </div>

        {/* ══ ROW 3 : CULTURES ═════════════════════════════════════ */}
        {plants.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#2AD368] text-2xl">spa</span>
                <h2 className="text-lg font-black text-[var(--text-primary)]">Cultures <span className="text-[#2AD368]">en cours</span></h2>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#2AD368]/10 border border-[#2AD368]/20 text-[#2AD368]">
                {plants.length} plante{plants.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {plants.map((p, i) => {
                const health = (p as any).health ?? 70;
                const stage = (p as any).growthStage ?? p.status ?? '—';
                const stageColor = STAGE_COLORS[stage] || '#2AD368';
                const daysPlanted = p.plantedAt ? Math.round((Date.now() - new Date(p.plantedAt).getTime()) / 86400000) : null;
                const imgSrc = (p as any).imageUrl || `/plantes/${(p.name || '').toLowerCase().replace(/\s+/g, '_')}.jpg`;
                const hColor = health >= 70 ? '#2AD368' : health >= 40 ? '#FFB74D' : '#FF6B6B';
                const reco: string[] = [];
                if (map.ph != null && (map.ph < 5.5 || map.ph > 7.5)) reco.push(`pH ${map.ph.toFixed(1)} → corrige avant dommages racinaires`);
                if (map.light != null && map.light < 500) reco.push(`Lumière ${Math.round(map.light)} lux → photosynthèse insuffisante`);
                return (
                  <div key={i} className="glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-[#2AD368]/25 transition-all duration-300 hover:-translate-y-0.5 group">
                    {/* Image zone */}
                    <div className="relative h-36 bg-gradient-to-br from-[#1a2214] to-[#0a1208] overflow-hidden">
                      <img src={imgSrc} alt={p.name || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
                      {/* Emoji fallback */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>{(p as any).iconEmoji || '🌱'}</span>
                      </div>
                      {/* Stage badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${stageColor}22`, border: `1px solid ${stageColor}40`, color: stageColor }}>
                          {STAGE_LABELS[stage] || stage}
                        </span>
                      </div>
                      {/* Days */}
                      {daysPlanted != null && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.6)' }}>J+{daysPlanted}</span>
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-[var(--text-primary)]">{p.name}</h3>
                          {p.species && <p className="text-xs italic text-[var(--text-secondary)] mt-0.5">{p.species}</p>}
                        </div>
                        <span className="text-sm font-black" style={{ color: hColor }}>{health}%</span>
                      </div>
                      <Bar value={health} max={100} color={hColor} h={5} />
                      <p className="text-xs mt-1.5 mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Santé de la plante</p>
                      {reco.length > 0 && (
                        <div className="px-3 py-2 rounded-2xl text-xs" style={{ background: 'rgba(255,107,107,0.07)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF8A80' }}>
                          ⚠ {reco[0]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ ROW 4 : ANOMALIES ════════════════════════════════════ */}
        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${anomalies.length > 0 ? 'bg-orange-400/10' : 'bg-[#2AD368]/10'}`}>
                <span className={`material-symbols-outlined text-lg ${anomalies.length > 0 ? 'text-orange-400' : 'text-[#2AD368]'}`}>
                  {anomalies.length > 0 ? 'warning_amber' : 'check_circle'}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-[var(--text-primary)]">Anomalies actives</h2>
                <p className="text-xs text-[var(--text-secondary)]">Surveillance en temps réel</p>
              </div>
            </div>
            <span className={`text-sm font-black px-3 py-1.5 rounded-full ${anomalies.length > 0 ? 'bg-red-500/10 text-red-400' : 'bg-[#2AD368]/10 text-[#2AD368]'}`}>
              {anomalies.length === 0 ? 'Tout est OK' : `${anomalies.length} alerte${anomalies.length > 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            {anomalies.length === 0 ? (
              <div className="py-6 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#2AD368]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-[#2AD368]">eco</span>
                </div>
                <p className="text-[#2AD368] font-bold">Tous les capteurs dans les plages normales</p>
                <p className="text-sm text-[var(--text-secondary)]">Votre serre est en parfaite santé 🌿</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {anomalies.map((a, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-l-4 ${a.severity === 'critical' ? 'border-red-500 bg-red-500/6' : 'border-orange-400 bg-orange-400/6'}`}
                    style={{ borderLeft: `3px solid ${a.severity === 'critical' ? '#FF6B6B' : '#FFB74D'}` }}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${a.severity === 'critical' ? 'bg-red-500/15' : 'bg-orange-400/15'}`}>
                      <span className={`material-symbols-outlined text-lg ${a.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                        {a.severity === 'critical' ? 'error' : 'warning_amber'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-bold text-sm ${a.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>{a.label}</span>
                        <span className="text-sm text-[var(--text-primary)]">{a.value}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">→ {a.action}</p>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 ${a.severity === 'critical' ? 'bg-red-500/15 text-red-400' : 'bg-orange-400/15 text-orange-400'}`}>
                      {a.severity === 'critical' ? 'CRITIQUE' : 'WARN'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ ROW 5 : CAPTEURS HORS LIGNE (conditionnel) ═══════════ */}
        {offlineSensors.length > 0 && (
          <div className="glass-card rounded-3xl p-5 border border-orange-400/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-orange-400">sensors_off</span>
                <h3 className="font-bold text-orange-400">Capteurs hors ligne</h3>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{offlineSensors.length} / {sensors.length}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {offlineSensors.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,183,77,0.06)', border: '1px solid rgba(255,183,77,0.12)' }}>
                  <div className="w-2 h-2 rounded-full bg-white/20 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)] truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportsNew;
