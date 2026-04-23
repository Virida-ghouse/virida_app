// ReportsNew.tsx — Virida Mission Control — inspired by Stitch design
import React, { useState, useEffect, useCallback } from 'react';
import { useViridaSensors } from '../../hooks/useViridaSensors';
import { plantService, Plant } from '../../services/api/plantService';
import { chatService } from '../../services/api/chatService';

type Period = '7j' | '30j' | '90j';

// ── Score ─────────────────────────────────────────────────────────────
function calcScore(map: Record<string, number | null>): number {
  let s = 0, t = 0;
  if (map.ph != null) { t += 30; const p = map.ph; if (p >= 5.5 && p <= 7.0) s += 30; else if ((p >= 5.0 && p < 5.5) || (p > 7.0 && p <= 7.5)) s += 18; else if (p >= 4.5) s += 8; }
  if (map.light != null) { t += 25; const l = map.light; if (l >= 2000) s += 25; else if (l >= 500) s += 16; else if (l >= 100) s += 8; }
  if (map.soil_moisture != null) { t += 25; const sm = map.soil_moisture; if (sm >= 30 && sm <= 70) s += 25; else if ((sm >= 20 && sm < 30) || (sm > 70 && sm <= 80)) s += 15; else s += 5; }
  if (map.tds != null) { t += 15; const td = map.tds; if (td >= 150 && td <= 800) s += 15; else if ((td >= 100 && td < 150) || (td > 800 && td <= 1200)) s += 9; else s += 3; }
  if (map.temperature != null) { t += 10; const tp = map.temperature; if (tp >= 18 && tp <= 28) s += 10; else if ((tp >= 15 && tp < 18) || (tp > 28 && tp <= 32)) s += 6; else if (tp >= 10) s += 3; }
  return t === 0 ? 50 : Math.round((s / t) * 100);
}
function scoreColor(s: number) { return s >= 75 ? '#2AD368' : s >= 45 ? '#FFB74D' : '#FF6B6B'; }
function scoreLabel(s: number) { return s >= 75 ? 'Bonne santé' : s >= 45 ? 'Attention requise' : 'État critique'; }

interface Anomaly { label: string; value: string; severity: 'critical' | 'warning'; action: string; }
function getAnomalies(map: Record<string, number | null>): Anomaly[] {
  const r: Anomaly[] = [];
  if (map.ph != null) {
    if (map.ph < 4.5 || map.ph > 8.5) r.push({ label: 'pH solution', value: `${map.ph.toFixed(2)} pH`, severity: 'critical', action: map.ph < 5.5 ? 'Ajouter solution pH+' : 'Ajouter solution pH-' });
    else if (map.ph < 5.5 || map.ph > 7.5) r.push({ label: 'pH solution', value: `${map.ph.toFixed(2)} pH`, severity: 'warning', action: map.ph < 5.5 ? 'Corriger avec pH+' : 'Corriger avec pH-' });
  }
  if (map.light != null && map.light < 500) r.push({ label: 'Luminosité', value: `${Math.round(map.light)} lux`, severity: map.light < 50 ? 'critical' : 'warning', action: 'Activer éclairage LED' });
  if (map.soil_moisture != null && map.soil_moisture < 20) r.push({ label: 'Humidité sol', value: `${Math.round(map.soil_moisture)}%`, severity: 'critical', action: 'Arrosage urgent' });
  if (map.temperature != null && (map.temperature < 15 || map.temperature > 32)) r.push({ label: 'Température', value: `${map.temperature.toFixed(1)}°C`, severity: map.temperature < 10 || map.temperature > 40 ? 'critical' : 'warning', action: map.temperature < 15 ? 'Activer chauffage' : 'Activer ventilation' });
  return r;
}

// ── Sparkline SVG ─────────────────────────────────────────────────────
function Sparkline({ data, color, height = 36 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const w = 80, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
}

// ── Mini Area Chart (EVE) ─────────────────────────────────────────────
function AreaChart({ color = '#2AD368' }: { color?: string }) {
  const data = [45, 52, 48, 61, 55, 70, 65, 78, 72, 81, 76, 81];
  const w = 200, h = 60;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#area-grad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

// ── Circular health ring for plant cards ──────────────────────────────
function HealthRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────
function BigScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 72, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${color}28 0%, transparent 65%)`, animation: 'pulse 3s ease-in-out infinite' }} />
      <svg width="180" height="180" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${color})`, transition: 'stroke-dasharray 1.5s ease' }} />
      </svg>
      <div className="relative flex flex-col items-center">
        <span className="font-black leading-none" style={{ fontSize: 52, color, textShadow: `0 0 24px ${color}` }}>{score}</span>
        <span className="font-bold" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>/ 100</span>
      </div>
    </div>
  );
}

// ── Markdown parser ───────────────────────────────────────────────────
type MdBlock = { type: 'heading'; text: string } | { type: 'list'; items: string[] } | { type: 'paragraph'; text: string };

function parseMarkdown(raw: string): MdBlock[] {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const blocks: MdBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // H2: **Title**
    if (/^\*\*[^*]+\*\*$/.test(line)) {
      blocks.push({ type: 'heading', text: line.replace(/\*\*/g, '') });
      i++;
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
        items.push(lines[i].replace(/^[-•]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
    } else {
      blocks.push({ type: 'paragraph', text: line });
      i++;
    }
  }
  return blocks;
}

// Inline markdown: bold + italic
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(p)) return <em key={i} style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}

const SECTION_COLORS: Record<string, string> = {
  'bilan': '#CBED62', 'général': '#CBED62', 'résumé': '#CBED62',
  'positifs': '#2AD368', 'positif': '#2AD368', 'bien': '#2AD368',
  'attention': '#FFB74D', 'surveiller': '#FFB74D', 'améliorer': '#FFB74D',
  'recommandation': '#64B5F6', 'prioritaire': '#64B5F6', 'action': '#64B5F6',
};
function sectionColor(heading: string): string {
  const lower = heading.toLowerCase();
  for (const [k, v] of Object.entries(SECTION_COLORS)) if (lower.includes(k)) return v;
  return 'rgba(255,255,255,0.5)';
}
function sectionIcon(heading: string): string {
  const lower = heading.toLowerCase();
  if (lower.includes('bilan') || lower.includes('général') || lower.includes('résumé')) return 'analytics';
  if (lower.includes('positif') || lower.includes('bien')) return 'check_circle';
  if (lower.includes('attention') || lower.includes('surveiller') || lower.includes('améliorer')) return 'warning_amber';
  if (lower.includes('recommand') || lower.includes('action') || lower.includes('priorit')) return 'bolt';
  return 'eco';
}

function EveSummaryRender({ text }: { text: string }) {
  if (!text) return null;
  const blocks = parseMarkdown(text);
  // If no headings found, just render as paragraphs nicely
  const hasStructure = blocks.some(b => b.type === 'heading');
  if (!hasStructure) {
    // Fallback: split by sentences and display cleanly
    return (
      <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7 }}>
        {renderInline(text)}
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          const col = sectionColor(block.text);
          const icon = sectionIcon(block.text);
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: col, fontSize: 15 }}>{icon}</span>
              <span className="font-black text-xs tracking-widest uppercase" style={{ color: col, letterSpacing: '0.1em' }}>{block.text}</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${col}40, transparent)` }} />
            </div>
          );
        }
        if (block.type === 'list') {
          // Find previous heading to get color
          const prevHeading = blocks.slice(0, i).reverse().find(b => b.type === 'heading');
          const col = prevHeading ? sectionColor((prevHeading as any).text) : 'rgba(255,255,255,0.5)';
          return (
            <ul key={i} className="space-y-1.5 pl-2">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col, boxShadow: `0 0 4px ${col}` }} />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        // paragraph
        const prevHeading = blocks.slice(0, i).reverse().find(b => b.type === 'heading');
        const isRecommendation = prevHeading && (prevHeading as any).text.toLowerCase().includes('recommand');
        if (isRecommendation) {
          return (
            <div key={i} className="px-4 py-3 rounded-2xl flex items-start gap-3"
              style={{ background: 'rgba(100,181,246,0.07)', border: '1px solid rgba(100,181,246,0.2)' }}>
              <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ color: '#64B5F6', fontSize: 16 }}>bolt</span>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{renderInline(block.text)}</p>
            </div>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed pl-2" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

// ── Fake sparkline data (7 days) ──────────────────────────────────────
const genSparkData = (base: number | null, variance = 0.1) => {
  if (base == null) return [0, 0, 0, 0, 0, 0, 0];
  return Array.from({ length: 7 }, (_, i) => {
    const offset = (Math.sin(i * 1.2 + base) * variance * base);
    return Math.max(0, base + offset * (0.5 + Math.random() * 0.5));
  });
};

const STAGE_LABELS: Record<string, string> = { SEED: 'Germ.', SEEDLING: 'Plantule', VEGETATIVE: 'Végétatif', FLOWERING: 'Floraison', FRUITING: 'Fructif.', HARVEST: 'Récolte', PLANTED: 'Planté' };
const STAGE_COLORS: Record<string, string> = { SEED: '#64B5F6', SEEDLING: '#81C784', VEGETATIVE: '#2AD368', FLOWERING: '#CE93D8', FRUITING: '#FFB74D', HARVEST: '#CBED62', PLANTED: '#2AD368' };

// ── MAIN ──────────────────────────────────────────────────────────────
const ReportsNew: React.FC = () => {
  const { map, sensors, connected, onlineSensors, offlineSensors } = useViridaSensors(5000);
  const [period, setPeriod] = useState<Period>('7j');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [eveSummary, setEveSummary] = useState('');
  const [eveLoading, setEveLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const score = calcScore(map);
  const anomalies = getAnomalies(map);
  const criticals = anomalies.filter(a => a.severity === 'critical').length;

  useEffect(() => {
    plantService.getPlants().then(r => setPlants(Array.isArray(r?.data) ? r.data : [])).catch(() => {});
  }, []);

  const fetchEveSummary = useCallback(async () => {
    setEveLoading(true);
    try {
      const sd: Record<string, any> = {};
      Object.entries(map).forEach(([k, v]) => { if (v != null) sd[k] = v; });
      const prompt = `Génère un rapport d'analyse de la serre. Score santé : ${score}/100. Réponds UNIQUEMENT avec ce format exact, sans texte avant ou après :

**Bilan général**
[1-2 phrases sur l'état global de la serre]

**Points positifs**
- [point positif 1]
- [point positif 2]

**Points d'attention**
- [point à surveiller 1]
- [point à surveiller 2]

**Recommandation prioritaire**
[1 action concrète à faire en priorité]`;
      const res = await chatService.sendMessage(prompt, undefined, undefined, sd);
      setEveSummary(res?.eveResponse?.replace(/^🐝\s*/, '') || '');
    } catch { /**/ } finally { setEveLoading(false); }
  }, [map, score]);

  useEffect(() => { if (sensors.length > 0 && !eveSummary) fetchEveSummary(); }, [sensors]);

  const handleRefresh = async () => { setRefreshing(true); setEveSummary(''); await fetchEveSummary(); setRefreshing(false); };

  // Sparklines
  const sparkPh = genSparkData(map.ph, 0.05);
  const sparkLight = genSparkData(map.light, 0.15);
  const sparkTds = genSparkData(map.tds, 0.1);
  const sparkTemp = genSparkData(map.temperature, 0.06);

  const dliVal = map.light != null ? Math.round((map.light * 0.0185 * 12) * 10) / 10 : 0;

  // Limiting factors
  const limits: string[] = [];
  if (map.ph != null && (map.ph < 5.5 || map.ph > 7.5)) limits.push(`pH ${map.ph.toFixed(1)} — absorption réduite`);
  if (map.light != null && map.light < 500) limits.push(`Lumière ${Math.round(map.light)} lux — photosynthèse limitée`);
  if (map.soil_moisture != null && map.soil_moisture < 30) limits.push(`Sol sec (${Math.round(map.soil_moisture)}%) — stress hydrique`);
  if (offlineSensors.length > 0) limits.push(`${offlineSensors.length} capteur(s) hors ligne`);

  const opps: string[] = [];
  if (map.tds != null && map.tds >= 150 && map.tds <= 800) opps.push('Nutriments optimaux — maintenir dosage');
  if (map.temperature != null && map.temperature >= 18 && map.temperature <= 28) opps.push(`Température idéale (${map.temperature.toFixed(1)}°C)`);
  if (anomalies.length === 0) opps.push('Tous capteurs dans les normes ✓');
  if (map.soil_moisture != null && map.soil_moisture >= 30 && map.soil_moisture <= 70) opps.push('Humidité sol parfaite');

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-20 lg:pb-0"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── SCANLINE OVERLAY (subtle) ── */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(42,211,104,0.012) 2px, rgba(42,211,104,0.012) 4px)', zIndex: 0 }} />

      <div className="relative z-10">

        {/* ══ HEADER ════════════════════════════════════════════════ */}
        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {/* Accent line */}
              <div className="w-1 h-10 rounded-full" style={{ background: 'linear-gradient(180deg, #2AD368, #CBED62)', boxShadow: '0 0 12px #2AD36888' }} />
              <div>
                <h1 className="font-black tracking-wide" style={{ fontSize: 'clamp(20px,3vw,32px)', color: '#fff', letterSpacing: '0.05em', textShadow: '0 0 30px rgba(42,211,104,0.3)' }}>
                  RAPPORTS <span style={{ color: '#2AD368' }}>&</span> ANALYSES
                </h1>
                <p className="text-xs font-bold tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>
                  <span style={{ color: connected ? '#2AD368' : '#FF6B6B' }}>●</span> {onlineSensors.length} NŒUDS EN LIGNE · {plants.length} CULTURE{plants.length > 1 ? 'S' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* System status badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(42,211,104,0.08)', border: '1px solid rgba(42,211,104,0.2)', color: '#2AD368' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2AD368] animate-pulse" style={{ boxShadow: '0 0 6px #2AD368' }} />
                SYSTÈME ACTIF
              </div>
              {/* Period */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                {(['7j', '30j', '90j'] as Period[]).map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className="px-3 py-1.5 text-xs font-bold transition-all"
                    style={period === p
                      ? { background: '#2AD368', color: '#0a1510' }
                      : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={handleRefresh} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`} style={{ color: '#2AD368', fontSize: 18 }}>refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-8 pb-8 space-y-5">

          {/* ══ ROW 1 : SCORE + EVE + MINI STATS ═════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* SCORE CARD */}
            <div className="lg:col-span-3 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${scoreColor(score)}28`, boxShadow: `0 0 40px ${scoreColor(score)}12, inset 0 0 40px ${scoreColor(score)}06` }}>
              <div className="absolute top-3 left-3">
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>VIRIDA SCORE</span>
              </div>
              <BigScoreRing score={score} />
              <div className="text-center">
                <p className="font-black text-sm tracking-wider" style={{ color: scoreColor(score), textShadow: `0 0 12px ${scoreColor(score)}` }}>{scoreLabel(score)}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Période : {period}</p>
              </div>
              {/* 3 chips */}
              <div className="w-full grid grid-cols-3 gap-1.5">
                {[
                  { v: `${score}%`, l: 'SANTÉ', c: scoreColor(score) },
                  { v: String(criticals), l: 'ALERTES', c: criticals > 0 ? '#FF6B6B' : '#2AD368' },
                  { v: String(onlineSensors.length), l: 'EN LIGNE', c: '#2AD368' },
                ].map(({ v, l, c }) => (
                  <div key={l} className="rounded-2xl p-2 text-center" style={{ background: `${c}10`, border: `1px solid ${c}25` }}>
                    <div className="font-black leading-none mb-0.5" style={{ fontSize: 18, color: c, textShadow: `0 0 10px ${c}` }}>{v}</div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* EVE INTELLIGENCE */}
            <div className="lg:col-span-9 rounded-3xl overflow-hidden flex flex-col"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(203,237,98,0.15)', boxShadow: '0 0 30px rgba(203,237,98,0.06)' }}>
              {/* EVE Header */}
              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(203,237,98,0.03)' }}>
                <div className="flex items-center gap-3">
                  <img src="/abeillevd.svg" alt="EVE" className="w-8 h-8"
                    style={{ filter: 'brightness(0) saturate(100%) invert(93%) sepia(18%) saturate(700%) hue-rotate(30deg)' }} />
                  <div>
                    <span className="font-black tracking-wider text-sm" style={{ color: '#CBED62', letterSpacing: '0.08em' }}>EVE INTELLIGENCE</span>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em' }}>GEMMA 4 · ANALYSE EN TEMPS RÉEL</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AreaChart color="#CBED62" />
                  {eveLoading && (
                    <div className="flex gap-1">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#CBED62', animationDelay: `${d}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* EVE body */}
              <div className="flex-1 px-6 py-5 overflow-y-auto" style={{ maxHeight: 340 }}>
                {eveLoading ? (
                  <div className="space-y-4">
                    {/* Simulated section skeleton */}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'rgba(203,237,98,0.3)' }} />
                      <div className="h-2.5 rounded-full animate-pulse" style={{ width: '30%', background: 'rgba(203,237,98,0.2)' }} />
                      <div className="flex-1 h-px" style={{ background: 'rgba(203,237,98,0.1)' }} />
                    </div>
                    <div className="space-y-2 pl-2">
                      {[90, 75].map((w, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'rgba(42,211,104,0.4)' }} />
                          <div className="h-2.5 rounded-full animate-pulse" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.07)' }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'rgba(255,183,77,0.3)' }} />
                      <div className="h-2.5 rounded-full animate-pulse" style={{ width: '35%', background: 'rgba(255,183,77,0.2)' }} />
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,183,77,0.1)' }} />
                    </div>
                    <div className="space-y-2 pl-2">
                      {[80, 65].map((w, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'rgba(255,183,77,0.4)' }} />
                          <div className="h-2.5 rounded-full animate-pulse" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.07)' }} />
                        </div>
                      ))}
                    </div>
                    <div className="h-12 rounded-2xl animate-pulse" style={{ background: 'rgba(100,181,246,0.07)', border: '1px solid rgba(100,181,246,0.12)' }} />
                  </div>
                ) : eveSummary ? (
                  <EveSummaryRender text={eveSummary} />
                ) : (
                  <div className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16, color: '#CBED62' }}>autorenew</span>
                    <span className="text-sm italic">Connexion à EVE en cours...</span>
                  </div>
                )}
              </div>

              {/* Freins / Opportunités */}
              <div className="grid grid-cols-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="px-6 py-4" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="font-black text-xs tracking-widest mb-3" style={{ color: '#FF6B6B', letterSpacing: '0.12em' }}>▼ FREINS</p>
                  {limits.length === 0
                    ? <p className="text-sm" style={{ color: '#2AD368' }}>Aucun facteur limitant ✓</p>
                    : limits.map((f, i) => <p key={i} className="text-sm mb-1.5 flex gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#FF6B6B' }}>•</span>{f}</p>)
                  }
                </div>
                <div className="px-6 py-4">
                  <p className="font-black text-xs tracking-widest mb-3" style={{ color: '#2AD368', letterSpacing: '0.12em' }}>▲ OPPORTUNITÉS</p>
                  {opps.length === 0
                    ? <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Calcul...</p>
                    : opps.map((o, i) => <p key={i} className="text-sm mb-1.5 flex gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#2AD368' }}>•</span>{o}</p>)
                  }
                </div>
              </div>
            </div>
          </div>

          {/* ══ ROW 2 : KPI METRICS WITH SPARKLINES ══════════════════ */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { icon: 'light_mode', label: 'DLI ESTIMÉ', value: String(dliVal), unit: 'mol/m²/j', color: map.light != null && map.light >= 500 ? '#2AD368' : '#FFB74D', spark: sparkLight, sub: 'Cible : 12 mol/m²/j', barPct: Math.min(100, (dliVal / 12) * 100) },
              { icon: 'science', label: 'NIVEAU pH', value: map.ph != null ? map.ph.toFixed(2) : '—', unit: 'pH', color: map.ph != null && map.ph >= 5.5 && map.ph <= 7.0 ? '#a855f7' : '#FF6B6B', spark: sparkPh, sub: 'Optimal : 5.5 – 7.0', barPct: map.ph != null ? Math.min(100, (map.ph / 14) * 100) : 0 },
              { icon: 'water_drop', label: 'NUTRIMENTS', value: map.tds != null ? String(Math.round(map.tds)) : '—', unit: 'ppm', color: map.tds != null && map.tds >= 150 ? '#2AD368' : '#FFB74D', spark: sparkTds, sub: 'Optimal : 150 – 800 ppm', barPct: map.tds != null ? Math.min(100, (map.tds / 800) * 100) : 0 },
              { icon: 'thermostat', label: 'TEMPÉRATURE', value: map.temperature != null ? map.temperature.toFixed(1) : '—', unit: '°C', color: map.temperature != null && map.temperature >= 18 && map.temperature <= 28 ? '#2AD368' : '#FF6B6B', spark: sparkTemp, sub: 'Optimal : 18 – 28°C', barPct: map.temperature != null ? Math.min(100, (map.temperature / 40) * 100) : 0 },
            ].map(({ icon, label, value, unit, color, spark, sub, barPct }) => (
              <div key={label} className="rounded-3xl p-5 relative overflow-hidden transition-transform hover:-translate-y-0.5 duration-300"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, boxShadow: `0 0 20px ${color}08` }}>
                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${color}20, transparent 70%)` }} />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <span className="material-symbols-outlined" style={{ color, fontSize: 18 }}>{icon}</span>
                  </div>
                  <span className="font-black" style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}>{label}</span>
                </div>
                <div className="flex items-end justify-between mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="font-black leading-none" style={{ fontSize: 34, color, textShadow: `0 0 16px ${color}66` }}>{value}</span>
                    <span className="font-bold" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{unit}</span>
                  </div>
                  <Sparkline data={spark} color={color} height={36} />
                </div>
                {/* Bar */}
                <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ width: `${barPct}%`, height: '100%', background: color, boxShadow: `0 0 6px ${color}`, transition: 'width 1s ease', borderRadius: 9999 }} />
                </div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* ══ ROW 3 : LIVE BIO-ZONES (plants) ══════════════════════ */}
          {plants.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ background: '#2AD368', boxShadow: '0 0 8px #2AD368' }} />
                <span className="font-black tracking-widest text-sm" style={{ color: '#fff', letterSpacing: '0.1em' }}>LIVE BIO-ZONES</span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: 'rgba(42,211,104,0.1)', border: '1px solid rgba(42,211,104,0.2)', color: '#2AD368' }}>
                  {plants.length} CULTURE{plants.length > 1 ? 'S' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {plants.map((p, i) => {
                  const health = (p as any).health ?? 70;
                  const stage = (p as any).growthStage ?? p.status ?? '—';
                  const stageColor = STAGE_COLORS[stage] || '#2AD368';
                  const hColor = health >= 70 ? '#2AD368' : health >= 40 ? '#FFB74D' : '#FF6B6B';
                  const daysPlanted = p.plantedAt ? Math.round((Date.now() - new Date(p.plantedAt).getTime()) / 86400000) : null;
                  const imgSrc = (p as any).imageUrl || `/plantes/${(p.name || '').toLowerCase().replace(/\s+/g, '_')}.jpg`;
                  const reco: string[] = [];
                  if (map.ph != null && (map.ph < 5.5 || map.ph > 7.5)) reco.push(`pH ${map.ph.toFixed(1)} → corrige avant dommages racinaires`);
                  return (
                    <div key={i} className="rounded-3xl overflow-hidden group transition-transform hover:-translate-y-1 duration-300"
                      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${hColor}18`, boxShadow: `0 0 20px ${hColor}08` }}>
                      {/* Image zone */}
                      <div className="relative h-44 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a2214, #0a1208)' }}>
                        <img src={imgSrc} alt={p.name || ''}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                          style={{ opacity: 0.75 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,18,8,0.95) 0%, rgba(10,18,8,0.3) 50%, transparent 100%)' }} />
                        {/* Health ring overlay top-right */}
                        <div className="absolute top-3 right-3 flex flex-col items-center gap-0.5">
                          <div className="relative">
                            <HealthRing pct={health} color={hColor} size={52} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-black text-xs" style={{ color: hColor }}>{health}</span>
                            </div>
                          </div>
                        </div>
                        {/* Stage badge */}
                        <div className="absolute top-3 left-3">
                          <span className="font-bold text-xs px-2.5 py-1 rounded-full" style={{ background: `${stageColor}22`, border: `1px solid ${stageColor}40`, color: stageColor, backdropFilter: 'blur(8px)' }}>
                            {STAGE_LABELS[stage] || stage}
                          </span>
                        </div>
                        {/* Days */}
                        {daysPlanted != null && (
                          <div className="absolute bottom-3 right-3">
                            <span className="font-black text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}>J+{daysPlanted}</span>
                          </div>
                        )}
                        {/* Plant name overlay */}
                        <div className="absolute bottom-3 left-4">
                          <h3 className="font-black text-base text-white leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{p.name?.toUpperCase()}</h3>
                          {p.species && <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.species}</p>}
                        </div>
                      </div>
                      {/* Body */}
                      <div className="px-4 py-3">
                        {/* Health bar */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>VITALITÉ</span>
                          <span className="text-xs font-black" style={{ color: hColor }}>{health}%</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div style={{ width: `${health}%`, height: '100%', background: `linear-gradient(90deg, ${hColor}, ${hColor}aa)`, boxShadow: `0 0 8px ${hColor}`, transition: 'width 1s ease', borderRadius: 9999 }} />
                        </div>
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

          {/* ══ ROW 4 : ANOMALIES / THREAT MATRIX ════════════════════ */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ background: anomalies.length > 0 ? '#FF6B6B' : '#2AD368', boxShadow: `0 0 8px ${anomalies.length > 0 ? '#FF6B6B' : '#2AD368'}` }} />
              <span className="font-black tracking-widest text-sm" style={{ color: '#fff', letterSpacing: '0.1em' }}>ANOMALIES ACTIVES</span>
              <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{
                background: anomalies.length > 0 ? 'rgba(255,107,107,0.1)' : 'rgba(42,211,104,0.1)',
                border: `1px solid ${anomalies.length > 0 ? 'rgba(255,107,107,0.25)' : 'rgba(42,211,104,0.2)'}`,
                color: anomalies.length > 0 ? '#FF6B6B' : '#2AD368',
              }}>
                {anomalies.length === 0 ? 'TOUT OK' : `${anomalies.length} ALERTE${anomalies.length > 1 ? 'S' : ''}`}
              </span>
            </div>

            <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${anomalies.length > 0 ? 'rgba(255,107,107,0.15)' : 'rgba(42,211,104,0.12)'}` }}>
              {anomalies.length === 0 ? (
                <div className="py-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(42,211,104,0.08)', border: '1px solid rgba(42,211,104,0.15)' }}>
                    <span className="material-symbols-outlined text-4xl" style={{ color: '#2AD368' }}>eco</span>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-sm tracking-wider" style={{ color: '#2AD368', letterSpacing: '0.1em' }}>TOUS LES SYSTÈMES OPÉRATIONNELS</p>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Votre serre est en parfaite santé 🌿</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {anomalies.map((a, i) => {
                    const ac = a.severity === 'critical' ? '#FF6B6B' : '#FFB74D';
                    return (
                      <div key={i} className="flex items-center gap-4 p-5 relative"
                        style={{
                          borderBottom: i < anomalies.length - 1 && (anomalies.length <= 2 || i % 2 === 0) ? '1px solid rgba(255,255,255,0.04)' : undefined,
                          borderLeft: i % 2 === 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                        }}>
                        {/* Pulse dot */}
                        <div className="relative flex-shrink-0">
                          <div className="w-3 h-3 rounded-full" style={{ background: ac, boxShadow: `0 0 8px ${ac}` }} />
                          <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping" style={{ background: ac, opacity: 0.4 }} />
                        </div>
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${ac}15`, border: `1px solid ${ac}25` }}>
                          <span className="material-symbols-outlined" style={{ color: ac, fontSize: 18 }}>
                            {a.severity === 'critical' ? 'error' : 'warning_amber'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="font-black text-sm" style={{ color: ac }}>{a.label}</span>
                            <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{a.value}</span>
                          </div>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>→ {a.action}</p>
                        </div>
                        <span className="font-black text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ background: `${ac}15`, border: `1px solid ${ac}25`, color: ac, letterSpacing: '0.08em' }}>
                          {a.severity === 'critical' ? 'CRITIQUE' : 'ATTENTION'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ══ CAPTEURS HORS LIGNE ══════════════════════════════════ */}
          {offlineSensors.length > 0 && (
            <div className="rounded-3xl p-5" style={{ background: 'rgba(255,183,77,0.03)', border: '1px solid rgba(255,183,77,0.15)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-xl" style={{ color: '#FFB74D' }}>sensors_off</span>
                <span className="font-black text-xs tracking-widest" style={{ color: '#FFB74D', letterSpacing: '0.12em' }}>CAPTEURS HORS LIGNE</span>
                <span className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{offlineSensors.length}/{sensors.length}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {offlineSensors.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,183,77,0.05)', border: '1px solid rgba(255,183,77,0.1)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    <span className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ReportsNew;
