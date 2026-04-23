// ReportsNew.tsx — Cerveau analytique de la serre Virida (desktop/mobile)
import React, { useState, useEffect, useCallback } from 'react';
import { useViridaSensors } from '../../hooks/useViridaSensors';
import { plantService, Plant } from '../../services/api/plantService';
import { chatService } from '../../services/api/chatService';

// ── Types ────────────────────────────────────────────────────────────
type Period = '7j' | '30j' | '90j';

interface Anomaly {
  sensor: string;
  label: string;
  value: string;
  severity: 'critical' | 'warning';
  action: string;
}

// ── Virida Score ─────────────────────────────────────────────────────
function calcViridaScore(map: Record<string, number | null>): number {
  let score = 0, total = 0;

  if (map.ph != null) {
    total += 30;
    const ph = map.ph;
    if (ph >= 5.5 && ph <= 7.0) score += 30;
    else if ((ph >= 5.0 && ph < 5.5) || (ph > 7.0 && ph <= 7.5)) score += 18;
    else if (ph >= 4.5 && ph < 5.0) score += 8;
  }
  if (map.light != null) {
    total += 25;
    const lux = map.light;
    if (lux >= 2000) score += 25;
    else if (lux >= 500) score += 16;
    else if (lux >= 100) score += 8;
  }
  if (map.soil_moisture != null) {
    total += 25;
    const sm = map.soil_moisture;
    if (sm >= 30 && sm <= 70) score += 25;
    else if ((sm >= 20 && sm < 30) || (sm > 70 && sm <= 80)) score += 15;
    else score += 5;
  }
  if (map.tds != null) {
    total += 15;
    const tds = map.tds;
    if (tds >= 150 && tds <= 800) score += 15;
    else if ((tds >= 100 && tds < 150) || (tds > 800 && tds <= 1200)) score += 9;
    else score += 3;
  }
  if (map.temperature != null) {
    total += 10;
    const t = map.temperature;
    if (t >= 18 && t <= 28) score += 10;
    else if ((t >= 15 && t < 18) || (t > 28 && t <= 32)) score += 6;
    else if (t >= 10 && t < 15) score += 3;
  }

  return total === 0 ? 50 : Math.round((score / total) * 100);
}

function scoreColor(s: number): string {
  if (s >= 75) return '#2AD368';
  if (s >= 45) return '#FFB74D';
  return '#FF6B6B';
}
function scoreLabel(s: number): string {
  if (s >= 75) return 'Bonne santé';
  if (s >= 45) return 'Attention requise';
  return 'État critique';
}

// ── Anomalies ────────────────────────────────────────────────────────
function getAnomalies(map: Record<string, number | null>): Anomaly[] {
  const result: Anomaly[] = [];

  if (map.ph != null) {
    if (map.ph < 4.5 || map.ph > 8.5)
      result.push({ sensor: 'pH', label: 'pH solution', value: `${map.ph} pH`, severity: 'critical', action: map.ph < 5.5 ? 'Ajouter solution pH+' : 'Ajouter solution pH-' });
    else if (map.ph < 5.5 || map.ph > 7.5)
      result.push({ sensor: 'pH', label: 'pH solution', value: `${map.ph} pH`, severity: 'warning', action: map.ph < 5.5 ? 'Corriger avec pH+' : 'Corriger avec pH-' });
  }
  if (map.light != null) {
    if (map.light < 50)
      result.push({ sensor: 'Lumière', label: 'Luminosité', value: `${map.light} lux`, severity: 'critical', action: 'Activer éclairage LED' });
    else if (map.light < 500)
      result.push({ sensor: 'Lumière', label: 'Luminosité', value: `${Math.round(map.light)} lux`, severity: 'warning', action: 'Augmenter durée éclairage' });
  }
  if (map.soil_moisture != null) {
    if (map.soil_moisture < 20)
      result.push({ sensor: 'Sol', label: 'Humidité sol', value: `${Math.round(map.soil_moisture)}%`, severity: 'critical', action: 'Arrosage urgent' });
    else if (map.soil_moisture > 85)
      result.push({ sensor: 'Sol', label: 'Humidité sol', value: `${Math.round(map.soil_moisture)}%`, severity: 'warning', action: 'Réduire arrosage' });
  }
  if (map.tds != null) {
    if (map.tds < 80)
      result.push({ sensor: 'TDS', label: 'Nutriments', value: `${map.tds} ppm`, severity: 'critical', action: 'Fertiliser immédiatement' });
    else if (map.tds > 1500)
      result.push({ sensor: 'TDS', label: 'Nutriments', value: `${Math.round(map.tds)} ppm`, severity: 'warning', action: 'Diluer la solution' });
  }
  if (map.temperature != null) {
    if (map.temperature < 10 || map.temperature > 40)
      result.push({ sensor: 'Temp', label: 'Température', value: `${map.temperature.toFixed(1)}°C`, severity: 'critical', action: map.temperature < 15 ? 'Activer chauffage' : 'Activer ventilation' });
    else if (map.temperature < 15 || map.temperature > 32)
      result.push({ sensor: 'Temp', label: 'Température', value: `${map.temperature.toFixed(1)}°C`, severity: 'warning', action: map.temperature < 15 ? 'Augmenter température' : 'Réduire température' });
  }

  return result;
}

// ── DLI ─────────────────────────────────────────────────────────────
function calcDLI(lux: number | null) {
  const target = 12;
  if (lux == null) return { value: 0, target, pct: 0 };
  const estimated = Math.round((lux * 0.0185 * 12) * 10) / 10;
  return { value: estimated, target, pct: Math.min(100, Math.round((estimated / target) * 100)) };
}

// ── Score Gauge SVG ──────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 56;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="11" />
          <circle
            cx="70" cy="70" r={r} fill="none"
            stroke={color} strokeWidth="11"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black leading-none" style={{ fontSize: 34, color }}>{score}</span>
          <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>/ 100</span>
        </div>
      </div>
      <span className="text-xs font-bold" style={{ color }}>{scoreLabel(score)}</span>
    </div>
  );
}

// ── Mini progress bar ────────────────────────────────────────────────
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
      <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 9999, boxShadow: `0 0 5px ${color}` }} />
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────
function KpiCard({ label, value, unit, bar, barMax, color, sub, icon }: {
  label: string; value: string; unit: string;
  bar: number; barMax: number; color: string; sub: string; icon?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-2 border border-white/5">
      <div className="flex items-center gap-1.5">
        {icon && <span className="material-symbols-outlined text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{icon}</span>}
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-black leading-none" style={{ fontSize: 32, color }}>{value}</span>
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{unit}</span>
      </div>
      <MiniBar value={bar} max={barMax} color={color} />
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{sub}</span>
    </div>
  );
}

// ── Stage helpers ────────────────────────────────────────────────────
const STAGE_LABELS: Record<string, string> = {
  SEED: 'Germination', SEEDLING: 'Plantule', VEGETATIVE: 'Végétatif',
  FLOWERING: 'Floraison', FRUITING: 'Fructification', HARVEST: 'Récolte', PLANTED: 'Planté',
};
const STAGE_COLORS: Record<string, string> = {
  SEED: '#64B5F6', SEEDLING: '#81C784', VEGETATIVE: '#2AD368',
  FLOWERING: '#CE93D8', FRUITING: '#FFB74D', HARVEST: '#CBED62', PLANTED: '#2AD368',
};

// ── Main component ───────────────────────────────────────────────────
const PERIOD_LABELS: Record<Period, string> = { '7j': '7 jours', '30j': '30 jours', '90j': '90 jours' };

const ReportsNew: React.FC = () => {
  const { map, sensors, alerts, connected, onlineSensors, offlineSensors } = useViridaSensors(5000);
  const [period, setPeriod] = useState<Period>('7j');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [eveSummary, setEveSummary] = useState('');
  const [eveLoading, setEveLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const score = calcViridaScore(map);
  const anomalies = getAnomalies(map);
  const dli = calcDLI(map.light);

  // Charger plantes
  useEffect(() => {
    plantService.getPlants().then(r => setPlants(Array.isArray(r?.data) ? r.data : [])).catch(() => {});
  }, []);

  // Résumé EVE
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
    } catch { /* */ } finally { setEveLoading(false); }
  }, [map, score]);

  useEffect(() => {
    if (sensors.length > 0 && !eveSummary) fetchEveSummary();
  }, [sensors]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setEveSummary('');
    await fetchEveSummary();
    setRefreshing(false);
  };

  // Insights
  const limitingFactors: string[] = [];
  const opportunities: string[] = [];

  if (map.ph != null && (map.ph < 5.5 || map.ph > 7.5))
    limitingFactors.push(`pH ${map.ph.toFixed(1)} → absorption nutriments réduite`);
  if (map.light != null && map.light < 500)
    limitingFactors.push(`Lumière ${Math.round(map.light)} lux → photosynthèse limitée`);
  if (map.soil_moisture != null && map.soil_moisture < 30)
    limitingFactors.push(`Sol trop sec (${Math.round(map.soil_moisture)}%) → stress hydrique`);
  if (map.temperature != null && (map.temperature < 15 || map.temperature > 32))
    limitingFactors.push(`Température ${map.temperature.toFixed(1)}°C → hors plage optimale`);
  if (offlineSensors.length > 0)
    limitingFactors.push(`${offlineSensors.length} capteur(s) hors ligne → données manquantes`);

  if (map.tds != null && map.tds >= 150 && map.tds <= 800)
    opportunities.push('Nutriments optimaux — maintenir le dosage actuel');
  if (map.soil_moisture != null && map.soil_moisture >= 30 && map.soil_moisture <= 70)
    opportunities.push('Humidité sol parfaite — réduire fréquence arrosage');
  if (dli.pct < 50)
    opportunities.push(`Activer LED 2h de plus → croissance estimée améliorée`);
  if (map.temperature != null && map.temperature >= 18 && map.temperature <= 28)
    opportunities.push(`Température optimale (${map.temperature.toFixed(1)}°C) — conditions idéales`);
  if (anomalies.length === 0)
    opportunities.push('Tous les capteurs actifs dans les normes ✓');

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 custom-scrollbar bg-[var(--bg-primary)] text-[var(--text-primary)]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-1">
            Rapports <span className="text-[#2AD368]">& Analyses</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-[#2AD368] animate-pulse' : 'bg-red-400'}`} style={{ boxShadow: connected ? '0 0 6px #2AD368' : undefined }} />
            {connected ? `${onlineSensors.length} capteurs en ligne` : 'Hors ligne'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['7j', '30j', '90j'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                period === p
                  ? 'bg-[#2AD368]/15 border-[#2AD368]/40 text-[#2AD368]'
                  : 'border-white/8 text-[var(--text-secondary)] hover:border-white/20'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={handleRefresh}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#2AD368]/8 border border-[#2AD368]/20 hover:bg-[#2AD368]/15 transition-all"
            title="Rafraîchir l'analyse EVE"
          >
            {refreshing
              ? <span className="material-symbols-outlined text-[#2AD368] animate-spin text-base">autorenew</span>
              : <span className="material-symbols-outlined text-[#2AD368] text-base">refresh</span>
            }
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* ── Section 1 : Score + EVE Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Score gauge */}
          <div className="lg:col-span-3 glass-card rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Virida Score</span>
            <ScoreGauge score={score} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{PERIOD_LABELS[period]}</span>
          </div>

          {/* EVE Summary */}
          <div className="lg:col-span-9 glass-card rounded-3xl p-6 border border-[#2AD368]/12 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="/abeillevd.svg" alt="EVE" className="w-6 h-6"
                style={{ filter: 'brightness(0) saturate(100%) invert(93%) sepia(18%) saturate(700%) hue-rotate(30deg)' }} />
              <span className="text-sm font-bold text-[#CBED62]">Analyse EVE</span>
            </div>
            <div className="flex-1 min-h-[48px] flex items-center">
              {eveLoading ? (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[0, 0.1, 0.2].map((d, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#CBED62] animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                  <span className="text-sm italic" style={{ color: 'rgba(255,255,255,0.4)' }}>EVE analyse votre serre...</span>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {eveSummary || "Connexion à EVE pour l'analyse en cours..."}
                </p>
              )}
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: `${score}%`, label: 'Santé', color: scoreColor(score) },
                { val: `${anomalies.filter(a => a.severity === 'critical').length}`, label: 'Critiques', color: anomalies.some(a => a.severity === 'critical') ? '#FF6B6B' : '#2AD368' },
                { val: `${onlineSensors.length}`, label: 'En ligne', color: '#2AD368' },
              ].map(({ val, label, color }) => (
                <div key={label} className="glass-card rounded-2xl p-3 text-center border border-white/5">
                  <div className="text-2xl font-black leading-none mb-1" style={{ color }}>{val}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 2 : Cultures ── */}
        <div className="glass-card rounded-3xl p-6 border border-[#2AD368]/12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2AD368] text-xl">spa</span>
              <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-sm">Cultures</h3>
            </div>
            {plants.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2AD368]/10 border border-[#2AD368]/20 text-[#2AD368]">
                {plants.length} plante{plants.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {plants.length === 0 ? (
            <p className="text-sm italic text-[var(--text-secondary)]">Aucune culture enregistrée</p>
          ) : (
            <div className="space-y-4">
              {plants.map((p, i) => {
                const health = (p as any).health ?? 70;
                const stage = (p as any).growthStage ?? p.status ?? '—';
                const stageColor = STAGE_COLORS[stage] || '#2AD368';
                const daysPlanted = p.plantedAt ? Math.round((Date.now() - new Date(p.plantedAt).getTime()) / 86400000) : null;
                const imgSrc = (p as any).imageUrl || `/plantes/${(p.name || '').toLowerCase().replace(/\s+/g, '_')}.jpg`;
                const reco: string[] = [];
                if (map.ph != null && (map.ph < 5.5 || map.ph > 7.5))
                  reco.push(`pH ${map.ph.toFixed(1)} → corrige avant dommages racinaires`);
                if (map.light != null && map.light < 500)
                  reco.push(`Lumière ${Math.round(map.light)} lux → photosynthèse insuffisante`);
                return (
                  <div key={i} className={`flex items-start gap-4 ${i < plants.length - 1 ? 'pb-4 border-b border-white/5' : ''}`}>
                    {/* Image */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-[#2AD368]/8 border border-[#2AD368]/15 flex items-center justify-center relative">
                      <img src={imgSrc} alt={p.name || ''} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="absolute text-2xl">{(p as any).iconEmoji || '🌱'}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[var(--text-primary)]">{p.name}</span>
                        <span className="text-sm font-bold" style={{ color: health >= 70 ? '#2AD368' : health >= 40 ? '#FFB74D' : '#FF6B6B' }}>
                          {health}% santé
                        </span>
                      </div>
                      <MiniBar value={health} max={100} color={health >= 70 ? '#2AD368' : health >= 40 ? '#FFB74D' : '#FF6B6B'} />
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: `${stageColor}18`, color: stageColor, border: `1px solid ${stageColor}30` }}>
                          {STAGE_LABELS[stage] || stage}
                        </span>
                        {daysPlanted != null && <span className="text-xs text-[var(--text-secondary)]">J+{daysPlanted}</span>}
                        {p.species && <span className="text-xs italic text-[var(--text-secondary)]">{p.species}</span>}
                      </div>
                      {reco.length > 0 && (
                        <div className="mt-2 px-3 py-2 rounded-xl text-xs" style={{ background: 'rgba(255,107,107,0.06)', borderLeft: '2px solid rgba(255,107,107,0.4)', color: '#FF8A80' }}>
                          ⚠ {reco[0]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Section 3 : Insights — Freins / Opportunités ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`glass-card rounded-3xl p-5 border ${limitingFactors.length > 0 ? 'border-red-500/20' : 'border-white/5'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm" style={{ color: '#FF6B6B' }}>trending_down</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#FF6B6B' }}>Freins</span>
            </div>
            {limitingFactors.length === 0 ? (
              <p className="text-sm text-[#2AD368]">Aucun facteur limitant détecté ✓</p>
            ) : limitingFactors.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="text-sm flex-shrink-0" style={{ color: '#FF6B6B' }}>•</span>
                <span className="text-sm text-[var(--text-primary)] leading-snug">{f}</span>
              </div>
            ))}
          </div>

          <div className={`glass-card rounded-3xl p-5 border ${opportunities.length > 0 ? 'border-[#2AD368]/20' : 'border-white/5'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm text-[#2AD368]">trending_up</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2AD368]">Opportunités</span>
            </div>
            {opportunities.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">Calcul en cours...</p>
            ) : opportunities.map((o, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="text-sm flex-shrink-0 text-[#2AD368]">•</span>
                <span className="text-sm text-[var(--text-primary)] leading-snug">{o}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 4 : KPIs ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="DLI Estimé"
            value={String(dli.value)}
            unit="mol/m²/j"
            bar={dli.value}
            barMax={dli.target}
            color={dli.pct < 30 ? '#FF6B6B' : dli.pct < 70 ? '#FFB74D' : '#2AD368'}
            sub={`Cible : ${dli.target} mol — ${dli.pct}%`}
            icon="light_mode"
          />
          <KpiCard
            label="Niveau pH"
            value={map.ph != null ? map.ph.toFixed(2) : '—'}
            unit="pH"
            bar={map.ph != null ? Math.max(0, Math.min(14, map.ph)) : 0}
            barMax={14}
            color={map.ph != null && (map.ph < 5.5 || map.ph > 7.5) ? '#FF6B6B' : '#2AD368'}
            sub="Optimal : 5.5 – 7.0"
            icon="science"
          />
          <KpiCard
            label="Nutriments"
            value={map.tds != null ? String(Math.round(map.tds)) : '—'}
            unit="ppm"
            bar={map.tds != null ? Math.min(map.tds, 1200) : 0}
            barMax={1200}
            color={map.tds != null && map.tds >= 150 ? '#2AD368' : '#FFB74D'}
            sub="Optimal : 150 – 800 ppm"
            icon="water_drop"
          />
          <KpiCard
            label="Température"
            value={map.temperature != null ? map.temperature.toFixed(1) : '—'}
            unit="°C"
            bar={map.temperature != null ? Math.max(0, Math.min(map.temperature, 40)) : 0}
            barMax={40}
            color={map.temperature != null && map.temperature >= 18 && map.temperature <= 28 ? '#2AD368' : map.temperature != null && (map.temperature < 15 || map.temperature > 32) ? '#FF6B6B' : '#FFB74D'}
            sub="Optimal : 18 – 28°C"
            icon="thermostat"
          />
        </div>

        {/* ── Section 5 : Anomalies actives ── */}
        <div className="glass-card rounded-3xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-[#FFB74D]">warning_amber</span>
              <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-sm">Anomalies actives</h3>
            </div>
            <span className={`text-xs font-black px-2.5 py-1 rounded-full ${anomalies.length > 0 ? 'bg-red-500/10 text-red-400' : 'bg-[#2AD368]/10 text-[#2AD368]'}`}>
              {anomalies.length}
            </span>
          </div>

          {anomalies.length === 0 ? (
            <div className="flex items-center gap-3 text-[#2AD368]">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="text-sm">Tous les capteurs dans les plages normales</span>
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((a, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl border-l-4 ${
                  a.severity === 'critical'
                    ? 'bg-red-500/6 border-red-500'
                    : 'bg-orange-400/6 border-orange-400'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${a.severity === 'critical' ? 'bg-[#FF6B6B]' : 'bg-[#FFB74D]'}`}
                    style={{ boxShadow: `0 0 6px ${a.severity === 'critical' ? '#FF6B6B' : '#FFB74D'}` }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${a.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>{a.label}</span>
                      <span className="text-sm text-[var(--text-primary)]">{a.value}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">→ {a.action}</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                    a.severity === 'critical' ? 'bg-red-500/15 text-red-400' : 'bg-orange-400/15 text-orange-400'
                  }`}>
                    {a.severity === 'critical' ? 'CRITIQUE' : 'ATTENTION'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 6 : Capteurs hors ligne ── */}
        {offlineSensors.length > 0 && (
          <div className="glass-card rounded-3xl p-6 border border-orange-400/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-[#FFB74D]">sensors_off</span>
                <h3 className="font-bold text-[#FFB74D] uppercase tracking-wider text-sm">Capteurs hors ligne</h3>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{offlineSensors.length} / {sensors.length}</span>
            </div>
            <div className="space-y-2">
              {offlineSensors.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white/20 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{s.name}</span>
                  <span className="ml-auto text-xs font-bold text-white/20">Hors ligne</span>
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
