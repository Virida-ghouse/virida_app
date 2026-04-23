import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
  ReferenceLine, ReferenceArea,
  AreaChart, Area,
} from 'recharts';
import { sensorService } from '../../services/api/sensorService';
import { useViridaSensors, type LiveSensor } from '../../hooks/useViridaSensors';

// ─── Sensor meta ──────────────────────────────────────────────────────────────
const SENSOR_META: Record<string, { label: string; icon: string; color: string; unit: string; alertMin?: number; alertMax?: number }> = {
  temperature:   { label: 'Température', icon: 'thermostat',  color: '#f87171', unit: '°C',  alertMin: 15,  alertMax: 35  },
  humidity:      { label: 'Humidité',     icon: 'water_drop',  color: '#60a5fa', unit: '%',   alertMin: 40,  alertMax: 90  },
  ph:            { label: 'pH',           icon: 'science',     color: '#a78bfa', unit: 'pH',  alertMin: 5.5, alertMax: 7.5 },
  light:         { label: 'Lumière',      icon: 'wb_sunny',    color: '#fbbf24', unit: 'lux'  },
  tds:           { label: 'TDS',          icon: 'water',       color: '#34d399', unit: 'ppm'  },
  soil_moisture: { label: 'Hum. Sol',     icon: 'grass',       color: '#a3e635', unit: '%',   alertMin: 30,  alertMax: 80  },
  co2:           { label: 'CO₂',          icon: 'air',         color: '#94a3b8', unit: 'ppm'  },
};

const TYPE_FILTERS = ['Tous','Température','Humidité','pH','Lumière','TDS','Sol'];
const TYPE_FILTER_MAP: Record<string,string> = {
  'Température':'temperature','Humidité':'humidity','pH':'ph',
  'Lumière':'light','TDS':'tds','Sol':'soil_moisture',
};

// ─── Period ───────────────────────────────────────────────────────────────────
type Period = '1h'|'24h'|'7j'|'30j';
const PERIODS: Record<Period,{ label:string; limit:string; tickFmt:(t:string)=>string; ttFmt:(t:string)=>string }> = {
  '1h':  { label:'1h',  limit:'60',  tickFmt:(t)=>new Date(t).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), ttFmt:(t)=>new Date(t).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) },
  '24h': { label:'24h', limit:'144', tickFmt:(t)=>new Date(t).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), ttFmt:(t)=>new Date(t).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) },
  '7j':  { label:'7j',  limit:'336', tickFmt:(t)=>new Date(t).toLocaleDateString('fr-FR',{weekday:'short',day:'2-digit'}),   ttFmt:(t)=>new Date(t).toLocaleString('fr-FR',{weekday:'long',day:'2-digit',month:'long',hour:'2-digit',minute:'2-digit'}) },
  '30j': { label:'30j', limit:'720', tickFmt:(t)=>new Date(t).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'}),     ttFmt:(t)=>new Date(t).toLocaleDateString('fr-FR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}) },
};

// ─── Annotation type ──────────────────────────────────────────────────────────
interface Annotation { id: string; ts: string; label: string; color: string }

// ─── Threshold type ───────────────────────────────────────────────────────────
interface Threshold { min: number|null; max: number|null }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getMeta = (t:string) => SENSOR_META[t] ?? { label:t, icon:'sensors', color:'#6b7280', unit:'' };
const isAlert = (s:LiveSensor) => {
  const m = getMeta(s.type); const v = s.value;
  if (v==null||s.status!=='online') return false;
  return (m.alertMin!=null&&v<m.alertMin)||(m.alertMax!=null&&v>m.alertMax);
};
const fmt  = (v:number|null,d=1) => v==null?'—':(Number.isInteger(v)?`${v}`:v.toFixed(d));
const ago  = (ts:string|null) => { if(!ts) return '—'; const d=Math.floor((Date.now()-new Date(ts).getTime())/1000); if(d<60) return `${d}s`; if(d<3600) return `${Math.floor(d/60)}min`; return `${Math.floor(d/3600)}h`; };
const ticks6 = (data:{ts:string}[]) => data.length<2?[]:Array.from({length:Math.min(6,data.length)},(_,i)=>data[Math.floor(i*(data.length-1)/5)].ts);

// CSV export
function exportCSV(name:string, data:{ts:string;value:number}[], unit:string) {
  const rows = ['timestamp,valeur,unite',
    ...data.map(d=>`${d.ts},${d.value},${unit}`)].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([rows],{type:'text/csv'}));
  a.download = `${name.replace(/\s+/g,'_')}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

// Normalize 0-100
function normalize(vals:number[]):number[] {
  const mn=Math.min(...vals), mx=Math.max(...vals);
  if(mx===mn) return vals.map(()=>50);
  return vals.map(v=>((v-mn)/(mx-mn))*100);
}

// localStorage helpers
const lsGet = <T,>(k:string,def:T):T => { try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch{ return def; } };
const lsSet = (k:string,v:unknown) => { try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} };

// ─── StatusDot ────────────────────────────────────────────────────────────────
const StatusDot:React.FC<{status:string;alert:boolean}> = ({status,alert}) => {
  if(status!=='online') return <span className="inline-block w-2 h-2 rounded-full bg-gray-500"/>;
  const c = alert?'#fbbf24':'#2AD368';
  return <span className="relative inline-flex"><span className="animate-ping absolute inline-flex w-2 h-2 rounded-full opacity-60" style={{background:c}}/><span className="inline-block w-2 h-2 rounded-full" style={{background:c}}/></span>;
};

// ─── Mini sparkline ───────────────────────────────────────────────────────────
const Sparkline:React.FC<{data:{value:number}[];color:string;offline?:boolean}> = ({data,color,offline}) => {
  const c=offline?'#6b7280':color;
  if(!data||data.length<2) return <div className="h-12 w-full rounded-xl opacity-10" style={{background:`linear-gradient(90deg,${c}55,transparent)`}}/>;
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{top:2,right:0,bottom:0,left:0}}>
        <defs><linearGradient id={`sp${c.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.3}/><stop offset="95%" stopColor={c} stopOpacity={0}/></linearGradient></defs>
        <Tooltip contentStyle={{background:'#1c2026',border:'none',borderRadius:'8px',fontSize:'11px',padding:'4px 8px'}} itemStyle={{color:c}} labelFormatter={()=>''} formatter={(v:number)=>[v.toFixed(1),'']}/>
        <Area type="monotone" dataKey="value" stroke={c} strokeWidth={1.5} fill={`url(#sp${c.slice(1)})`} dot={false} activeDot={{r:3,fill:c}}/>
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ─── History chart (with thresholds + annotations) ────────────────────────────
const HistoryChart:React.FC<{
  data:{ts:string;value:number}[];
  color:string; period:Period; unit:string;
  threshold:Threshold; annotations:Annotation[];
}> = ({data,color,period,unit,threshold,annotations}) => {
  const cfg=PERIODS[period];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{top:8,right:8,bottom:0,left:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false}/>
        <XAxis dataKey="ts" ticks={ticks6(data)} tickFormatter={cfg.tickFmt} tick={{fill:'#6b7280',fontSize:10}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fill:'#6b7280',fontSize:10}} axisLine={false} tickLine={false} width={44} tickFormatter={v=>`${v}${unit}`}/>
        <Tooltip
          contentStyle={{background:'#1c2026',border:'1px solid #262a31',borderRadius:'12px',fontSize:'12px'}}
          labelStyle={{color:'#6b7280',fontSize:'11px'}}
          itemStyle={{color}}
          labelFormatter={(ts:string)=>cfg.ttFmt(ts)}
          formatter={(v:number)=>[`${v.toFixed(2)} ${unit}`,'']}
        />
        {/* ── Threshold zone OK ── */}
        {threshold.min!=null&&threshold.max!=null&&(
          <ReferenceArea y1={threshold.min} y2={threshold.max} fill="#2AD368" fillOpacity={0.06}/>
        )}
        {/* ── Threshold lines ── */}
        {threshold.min!=null&&(
          <ReferenceLine y={threshold.min} stroke="#fbbf24" strokeDasharray="4 2" strokeWidth={1}
            label={{value:`Min ${threshold.min}${unit}`,fill:'#fbbf24',fontSize:10,position:'insideBottomLeft'}}/>
        )}
        {threshold.max!=null&&(
          <ReferenceLine y={threshold.max} stroke="#f87171" strokeDasharray="4 2" strokeWidth={1}
            label={{value:`Max ${threshold.max}${unit}`,fill:'#f87171',fontSize:10,position:'insideTopLeft'}}/>
        )}
        {/* ── Annotations ── */}
        {annotations.map(a=>(
          <ReferenceLine key={a.id} x={a.ts} stroke={a.color} strokeDasharray="3 2" strokeWidth={1.5}
            label={{value:a.label,fill:a.color,fontSize:10,position:'insideTopRight'}}/>
        ))}
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{r:4,fill:color,strokeWidth:0}}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

// ─── History Modal ─────────────────────────────────────────────────────────────
const HistoryModal:React.FC<{sensor:LiveSensor;onClose:()=>void}> = ({sensor,onClose}) => {
  const meta = getMeta(sensor.type);
  const [period,  setPeriod]  = useState<Period>('24h');
  const [data,    setData]    = useState<{ts:string;value:number}[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Thresholds (persisted) ──────────────────────────────────────────────────
  const thKey = `virida_thr_${sensor.id}`;
  const [threshold, setThreshold] = useState<Threshold>(() => lsGet(thKey,{min:null,max:null}));
  const [showThr, setShowThr] = useState(false);
  const [thrDraft, setThrDraft] = useState({ min: threshold.min??'', max: threshold.max??'' });

  const applyThreshold = () => {
    const t = { min: thrDraft.min!==''?Number(thrDraft.min):null, max: thrDraft.max!==''?Number(thrDraft.max):null };
    setThreshold(t); lsSet(thKey,t); setShowThr(false);
  };

  // ── Annotations (persisted) ─────────────────────────────────────────────────
  const annKey = `virida_ann_${sensor.id}`;
  const [annotations, setAnnotations] = useState<Annotation[]>(() => lsGet(annKey,[]));
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annDraft, setAnnDraft] = useState({ ts: new Date().toISOString().slice(0,16), label:'', color:'#a78bfa' });
  const ANN_COLORS = ['#a78bfa','#60a5fa','#2AD368','#fbbf24','#f87171','#34d399'];

  const addAnnotation = () => {
    if(!annDraft.label.trim()) return;
    const updated = [...annotations,{ id: Date.now().toString(), ts: new Date(annDraft.ts).toISOString(), label: annDraft.label.trim(), color: annDraft.color }];
    setAnnotations(updated); lsSet(annKey,updated); setShowAnnForm(false);
    setAnnDraft({ ts: new Date().toISOString().slice(0,16), label:'', color:'#a78bfa' });
  };
  const removeAnnotation = (id:string) => {
    const updated = annotations.filter(a=>a.id!==id);
    setAnnotations(updated); lsSet(annKey,updated);
  };

  // ── Data loading ────────────────────────────────────────────────────────────
  const load = useCallback(async(p:Period) => {
    setLoading(true);
    try {
      const res = await sensorService.getSensorReadings(sensor.id,{limit:PERIODS[p].limit});
      setData((res?.data?.readings??[]).slice().reverse().map((r:any)=>({ts:r.timestamp,value:Number(r.value)})));
    } catch { setData([]); }
    finally { setLoading(false); }
  },[sensor.id]);
  useEffect(()=>{ load(period); },[period,load]);

  const stats = data.length>0 ? {
    min: Math.min(...data.map(d=>d.value)).toFixed(2),
    max: Math.max(...data.map(d=>d.value)).toFixed(2),
    avg: (data.reduce((a,d)=>a+d.value,0)/data.length).toFixed(2),
    count: data.length,
  } : null;

  // Annotations inside current data range
  const visibleAnns = annotations.filter(a => data.some(d=>d.ts===a.ts) || data.length===0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        style={{background:'#1c2026',boxShadow:`0 0 80px ${meta.color}20`,maxHeight:'90vh',overflowY:'auto'}}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{background:'#181c22'}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:`${meta.color}18`}}>
              <span className="material-symbols-outlined text-xl" style={{color:meta.color}}>{meta.icon}</span>
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">{sensor.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{meta.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Period */}
            <div className="flex gap-1 rounded-full p-1" style={{background:'#262a31'}}>
              {(Object.keys(PERIODS) as Period[]).map(p=>(
                <button key={p} onClick={()=>setPeriod(p)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={p===period?{background:meta.color,color:'#0a0e14'}:{color:'#6b7280'}}>
                  {PERIODS[p].label}
                </button>
              ))}
            </div>
            {/* Export CSV */}
            <button onClick={()=>exportCSV(sensor.name,data,meta.unit)}
              title="Exporter CSV"
              className="p-2 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              disabled={data.length===0}>
              <span className="material-symbols-outlined text-base">download</span>
            </button>
            {/* Thresholds */}
            <button onClick={()=>setShowThr(s=>!s)}
              title="Seuils d'alerte"
              className="p-2 rounded-xl transition-colors"
              style={showThr?{background:`${meta.color}20`,color:meta.color}:{color:'var(--text-secondary)'}}>
              <span className="material-symbols-outlined text-base">tune</span>
            </button>
            {/* Annotate */}
            <button onClick={()=>setShowAnnForm(s=>!s)}
              title="Ajouter annotation"
              className="p-2 rounded-xl transition-colors"
              style={showAnnForm?{background:'#a78bfa20',color:'#a78bfa'}:{color:'var(--text-secondary)'}}>
              <span className="material-symbols-outlined text-base">edit_note</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Threshold panel */}
        {showThr && (
          <div className="px-5 py-4 flex flex-wrap items-end gap-3" style={{background:'#181c22',borderTop:'1px solid #262a31'}}>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest w-full">Seuils ({meta.unit})</p>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs text-[var(--text-secondary)] mb-1">Minimum</label>
              <input type="number" value={thrDraft.min} onChange={e=>setThrDraft(d=>({...d,min:e.target.value}))}
                placeholder="—"
                className="w-full px-3 py-2 rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-2"
                style={{background:'#262a31',focusRingColor:meta.color}}/>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs text-[var(--text-secondary)] mb-1">Maximum</label>
              <input type="number" value={thrDraft.max} onChange={e=>setThrDraft(d=>({...d,max:e.target.value}))}
                placeholder="—"
                className="w-full px-3 py-2 rounded-xl text-sm text-[var(--text-primary)] outline-none focus:ring-2"
                style={{background:'#262a31'}}/>
            </div>
            <div className="flex gap-2">
              <button onClick={applyThreshold}
                className="px-4 py-2 rounded-xl text-xs font-semibold"
                style={{background:meta.color,color:'#0a0e14'}}>
                Appliquer
              </button>
              <button onClick={()=>{ setThreshold({min:null,max:null}); lsSet(thKey,{min:null,max:null}); setShowThr(false); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold"
                style={{background:'#262a31',color:'var(--text-secondary)'}}>
                Réinitialiser
              </button>
            </div>
          </div>
        )}

        {/* Annotation form */}
        {showAnnForm && (
          <div className="px-5 py-4 space-y-3" style={{background:'#181c22',borderTop:'1px solid #262a31'}}>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">Nouvelle annotation</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Date / heure</label>
                <input type="datetime-local" value={annDraft.ts} onChange={e=>setAnnDraft(d=>({...d,ts:e.target.value}))}
                  className="w-full px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] outline-none"
                  style={{background:'#262a31'}}/>
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Texte</label>
                <input type="text" value={annDraft.label} onChange={e=>setAnnDraft(d=>({...d,label:e.target.value}))}
                  placeholder="ex: Changement nutriments"
                  className="w-full px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] placeholder-gray-600 outline-none"
                  style={{background:'#262a31'}}/>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Couleur</label>
                <div className="flex gap-1">
                  {ANN_COLORS.map(c=>(
                    <button key={c} onClick={()=>setAnnDraft(d=>({...d,color:c}))}
                      className="w-6 h-6 rounded-full transition-transform"
                      style={{background:c,transform:annDraft.color===c?'scale(1.3)':'scale(1)',outline:annDraft.color===c?`2px solid ${c}`:undefined,outlineOffset:'2px'}}/>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={addAnnotation}
              className="px-4 py-2 rounded-xl text-xs font-semibold"
              style={{background:'#a78bfa20',color:'#a78bfa',border:'1px solid #a78bfa40'}}>
              + Ajouter
            </button>
          </div>
        )}

        {/* Current value + stats */}
        <div className="px-6 pt-5 flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-2">
            <span className="font-bold tracking-tight leading-none" style={{fontSize:'3.5rem',color:meta.color}}>
              {fmt(sensor.value,2)}
            </span>
            <span className="text-lg text-[var(--text-secondary)] mb-1">{meta.unit}</span>
          </div>
          {stats&&(
            <div className="flex gap-5 text-right">
              {[{label:'Min',v:stats.min},{label:'Moy',v:stats.avg},{label:'Max',v:stats.max},{label:'N',v:String(stats.count)}].map(s=>(
                <div key={s.label}>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">{s.label}</p>
                  <p className="font-semibold text-[var(--text-primary)] tabular-nums">{s.v}<span className="text-xs text-[var(--text-secondary)] ml-0.5">{s.label!=='N'?meta.unit:''}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="px-6 pt-3 pb-2">
          {loading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{borderColor:`${meta.color}30`,borderTopColor:meta.color}}/>
            </div>
          ) : data.length===0 ? (
            <div className="h-56 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl opacity-20 text-[var(--text-secondary)]">show_chart</span>
              <p className="text-xs text-[var(--text-secondary)]">Aucune donnée pour cette période</p>
            </div>
          ) : (
            <HistoryChart data={data} color={meta.color} period={period} unit={meta.unit}
              threshold={threshold} annotations={visibleAnns}/>
          )}
          <p className="text-xs text-center text-[var(--text-secondary)] mt-1 opacity-50">
            {data.length} mesures · {period==='1h'?'dernière heure':period==='24h'?'24h':period==='7j'?'7 jours':'30 jours'}
            {(threshold.min!=null||threshold.max!=null)&&<span className="ml-2 text-amber-400">⚠ seuils actifs</span>}
          </p>
        </div>

        {/* Annotations list */}
        {annotations.length>0&&(
          <div className="px-6 pb-5">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Annotations</p>
            <div className="space-y-1.5">
              {annotations.map(a=>(
                <div key={a.id} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:'#262a31'}}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:a.color}}/>
                  <span className="text-xs text-[var(--text-primary)] flex-1">{a.label}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{new Date(a.ts).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span>
                  <button onClick={()=>removeAnnotation(a.id)} className="p-0.5 rounded hover:text-red-400 text-[var(--text-secondary)] transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Compare Modal (multi-capteurs) ───────────────────────────────────────────
const CompareModal:React.FC<{sensors:LiveSensor[];onClose:()=>void}> = ({sensors,onClose}) => {
  const [period,     setPeriod]     = useState<Period>('24h');
  const [normalized, setNormalized] = useState(false);
  const [rawData,    setRawData]    = useState<Record<string,{ts:string;value:number}[]>>({});
  const [loading,    setLoading]    = useState(false);

  const load = useCallback(async(p:Period) => {
    setLoading(true);
    const out:Record<string,{ts:string;value:number}[]> = {};
    await Promise.allSettled(sensors.map(async s=>{
      try {
        const res = await sensorService.getSensorReadings(s.id,{limit:PERIODS[p].limit});
        out[s.id] = (res?.data?.readings??[]).slice().reverse().map((r:any)=>({ts:r.timestamp,value:Number(r.value)}));
      } catch { out[s.id]=[]; }
    }));
    setRawData(out);
    setLoading(false);
  },[sensors]);
  useEffect(()=>{ load(period); },[period,load]);

  // Build merged dataset aligned by index
  const merged = React.useMemo(()=>{
    const lens = sensors.map(s=>rawData[s.id]?.length??0);
    const maxLen = Math.max(...lens,0);
    if(maxLen===0) return [];

    // normalised values per sensor
    const normVals:Record<string,number[]> = {};
    if(normalized) {
      sensors.forEach(s=>{
        const vals=(rawData[s.id]??[]).map(d=>d.value);
        normVals[s.id]=normalize(vals);
      });
    }

    return Array.from({length:maxLen},(_,i)=>{
      const refSensor = sensors.find(s=>(rawData[s.id]??[]).length>i);
      const point:Record<string,any> = { ts: refSensor?(rawData[refSensor.id][i]?.ts??''):'', index:i };
      sensors.forEach(s=>{
        const arr = rawData[s.id]??[];
        if(i<arr.length) {
          point[s.id] = normalized ? (normVals[s.id]?.[i]??null) : arr[i].value;
        }
      });
      return point;
    });
  },[rawData,sensors,normalized]);

  const cfg = PERIODS[period];
  const ticks = ticks6(merged);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl"
        style={{background:'#1c2026',boxShadow:'0 0 80px #a78bfa15',maxHeight:'90vh',overflowY:'auto'}}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{background:'#181c22'}}>
          <div>
            <p className="font-bold text-[var(--text-primary)]">Comparaison multi-capteurs</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{sensors.length} capteurs sélectionnés</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Period */}
            <div className="flex gap-1 rounded-full p-1" style={{background:'#262a31'}}>
              {(Object.keys(PERIODS) as Period[]).map(p=>(
                <button key={p} onClick={()=>setPeriod(p)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={p===period?{background:'#a78bfa',color:'#0a0e14'}:{color:'#6b7280'}}>
                  {PERIODS[p].label}
                </button>
              ))}
            </div>
            {/* Normalize toggle */}
            <button onClick={()=>setNormalized(n=>!n)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={normalized?{background:'#a78bfa20',color:'#a78bfa',border:'1px solid #a78bfa50'}:{background:'#262a31',color:'var(--text-secondary)'}}>
              <span className="material-symbols-outlined text-sm">percent</span>
              {normalized?'Normalisé':'Valeurs brutes'}
            </button>
            {/* Export CSV merged */}
            <button onClick={()=>{
              const rows=['timestamp,...sensors'.replace('...sensors',sensors.map(s=>s.name).join(',')),...merged.map(p=>[p.ts,...sensors.map(s=>p[s.id]??'')].join(','))].join('\n');
              const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([rows],{type:'text/csv'})); a.download=`compare_${new Date().toISOString().split('T')[0]}.csv`; a.click();
            }} title="Export CSV fusionné" className="p-2 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] transition-colors" disabled={merged.length===0}>
              <span className="material-symbols-outlined text-base">download</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Legend chips */}
        <div className="px-5 pt-4 flex flex-wrap gap-2">
          {sensors.map(s=>{
            const m=getMeta(s.type);
            return (
              <div key={s.id} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                style={{background:`${m.color}18`,color:m.color}}>
                <span className="w-2 h-2 rounded-full" style={{background:m.color}}/>
                {s.name} {normalized?'(%)':m.unit}
              </div>
            );
          })}
          {normalized && <span className="text-xs text-[var(--text-secondary)] flex items-center">— normalisé 0-100%</span>}
        </div>

        {/* Chart */}
        <div className="px-5 py-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{borderColor:'#a78bfa30',borderTopColor:'#a78bfa'}}/>
            </div>
          ) : merged.length===0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl opacity-20 text-[var(--text-secondary)]">show_chart</span>
              <p className="text-xs text-[var(--text-secondary)]">Aucune donnée</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={merged} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false}/>
                <XAxis dataKey="ts" ticks={ticks} tickFormatter={cfg.tickFmt} tick={{fill:'#6b7280',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#6b7280',fontSize:10}} axisLine={false} tickLine={false} width={44}
                  tickFormatter={v=>normalized?`${Math.round(v)}%`:`${v}`}/>
                <Tooltip
                  contentStyle={{background:'#1c2026',border:'1px solid #262a31',borderRadius:'12px',fontSize:'12px'}}
                  labelStyle={{color:'#6b7280',fontSize:'10px'}}
                  labelFormatter={(ts:string)=>cfg.ttFmt(ts)}
                  formatter={(v:number,_:unknown,props:any)=>{
                    const s=sensors.find(s=>s.id===props.dataKey);
                    if(!s) return [v,''];
                    const m=getMeta(s.type);
                    return [normalized?`${v.toFixed(1)}%`:`${v.toFixed(2)} ${m.unit}`, s.name];
                  }}
                />
                <Legend formatter={(_:any,entry:any)=>{ const s=sensors.find(s=>s.id===entry.dataKey); return s?.name??entry.dataKey; }} wrapperStyle={{fontSize:'11px',paddingTop:'8px'}}/>
                {sensors.map(s=>{
                  const m=getMeta(s.type);
                  return <Line key={s.id} type="monotone" dataKey={s.id} stroke={m.color} strokeWidth={2} dot={false} activeDot={{r:4,strokeWidth:0,fill:m.color}} connectNulls={false}/>;
                })}
              </ComposedChart>
            </ResponsiveContainer>
          )}
          {merged.length>0&&(
            <p className="text-xs text-center text-[var(--text-secondary)] mt-1 opacity-50">
              {merged.length} points · {period==='1h'?'1h':period==='24h'?'24h':period==='7j'?'7 jours':'30 jours'}
            </p>
          )}
        </div>

        {/* Per-sensor stats table */}
        {merged.length>0&&(
          <div className="px-5 pb-6">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Statistiques période</p>
            <div className="rounded-2xl overflow-hidden" style={{background:'#181c22'}}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{borderBottom:'1px solid #262a31'}}>
                    {['Capteur','Unité','Min','Moy','Max','Dernière val.'].map(h=>(
                      <th key={h} className="text-left px-3 py-2 text-[var(--text-secondary)] font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensors.map(s=>{
                    const m=getMeta(s.type);
                    const vals=(rawData[s.id]??[]).map(d=>d.value).filter(v=>v!=null);
                    if(vals.length===0) return null;
                    const mn=Math.min(...vals),mx=Math.max(...vals),av=vals.reduce((a,b)=>a+b,0)/vals.length;
                    return (
                      <tr key={s.id} style={{borderBottom:'1px solid #262a3140'}}>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{background:m.color}}/>
                            <span className="text-[var(--text-primary)] font-medium">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-[var(--text-secondary)]">{m.unit}</td>
                        <td className="px-3 py-2 tabular-nums text-[var(--text-primary)]">{mn.toFixed(2)}</td>
                        <td className="px-3 py-2 tabular-nums text-[var(--text-primary)]">{av.toFixed(2)}</td>
                        <td className="px-3 py-2 tabular-nums text-[var(--text-primary)]">{mx.toFixed(2)}</td>
                        <td className="px-3 py-2 tabular-nums" style={{color:m.color}}>{fmt(s.value,2)} {m.unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Sensor Card ──────────────────────────────────────────────────────────────
const SensorCard:React.FC<{
  sensor:LiveSensor; sparkData:{value:number}[];
  onEdit:(s:LiveSensor)=>void; onDelete:(id:string)=>void;
  onClick:()=>void;
  compareMode:boolean; selected:boolean; onToggleSelect:()=>void;
}> = ({sensor,sparkData,onEdit,onDelete,onClick,compareMode,selected,onToggleSelect}) => {
  const meta=getMeta(sensor.type), alert=isAlert(sensor), offline=sensor.status!=='online';
  return (
    <div onClick={compareMode?onToggleSelect:onClick}
      className={`relative rounded-3xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:translate-y-[-2px] ${offline?'opacity-55':''}`}
      style={{background:'#1c2026',
        boxShadow:compareMode&&selected?`0 0 0 2px ${meta.color}`:alert?`0 0 0 1px ${meta.color}50`:undefined}}>
      {/* compare checkbox */}
      {compareMode&&(
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
          style={{borderColor:meta.color,background:selected?meta.color:'transparent'}}>
          {selected&&<span className="material-symbols-outlined text-xs" style={{color:'#0a0e14',fontSize:'12px'}}>check</span>}
        </div>
      )}
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:`${meta.color}18`}}>
            <span className="material-symbols-outlined text-xl" style={{color:meta.color}}>{meta.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{sensor.name}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{meta.label}</p>
          </div>
        </div>
        {!compareMode&&(
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <StatusDot status={sensor.status} alert={alert}/>
            {alert&&<span className="text-xs font-medium text-amber-400">Alerte</span>}
            {offline&&<span className="text-xs font-medium text-gray-500">Hors ligne</span>}
          </div>
        )}
      </div>
      {/* big value */}
      <div className="flex items-end gap-1.5">
        <span className="font-bold tracking-tight leading-none" style={{fontSize:'2.75rem',color:offline?'#4b5563':alert?'#fbbf24':meta.color}}>
          {fmt(sensor.value)}
        </span>
        <span className="text-base font-medium text-[var(--text-secondary)] mb-1">{meta.unit}</span>
      </div>
      {/* sparkline */}
      <Sparkline data={sparkData} color={meta.color} offline={offline}/>
      {/* footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <span className="material-symbols-outlined text-sm opacity-50">schedule</span>
          <span>{ago(sensor.lastReadingTs)}</span>
        </div>
        {!compareMode&&(
          <div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>onEdit(sensor)} className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
            <button onClick={()=>onDelete(sensor.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-colors">
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const SensorsPageNew:React.FC = () => {
  const { sensors } = useViridaSensors(8000);
  const [sparklines,       setSparklines]       = useState<Record<string,{value:number}[]>>({});
  const [activeFilter,     setActiveFilter]     = useState('Tous');
  const [expandedSensor,   setExpandedSensor]   = useState<LiveSensor|null>(null);
  const [compareMode,      setCompareMode]      = useState(false);
  const [selectedIds,      setSelectedIds]      = useState<string[]>([]);
  const [showCompare,      setShowCompare]      = useState(false);
  const [editSensor,       setEditSensor]       = useState<LiveSensor|null>(null);
  const [showDialog,       setShowDialog]       = useState(false);
  const [isAddMode,        setIsAddMode]        = useState(false);
  const [formData,         setFormData]         = useState({name:'',type:'temperature',unit:'°C',location:''});

  const loadSparklines = useCallback(async(list:LiveSensor[])=>{
    const out:Record<string,{value:number}[]>={};
    await Promise.allSettled(list.map(async s=>{
      try {
        const res=await sensorService.getSensorReadings(s.id,{limit:'20'});
        out[s.id]=(res?.data?.readings??[]).slice().reverse().map((r:any)=>({value:Number(r.value)}));
      } catch { out[s.id]=[]; }
    }));
    setSparklines(out);
  },[]);
  useEffect(()=>{ if(sensors.length>0) loadSparklines(sensors); },[sensors.length,loadSparklines]);

  const total  = sensors.length;
  const online = sensors.filter(s=>s.status==='online').length;
  const offl   = sensors.filter(s=>s.status!=='online').length;
  const alrt   = sensors.filter(s=>isAlert(s)).length;

  const filteredType = TYPE_FILTER_MAP[activeFilter];
  const filtered = filteredType?sensors.filter(s=>s.type===filteredType):sensors;

  const toggleSelect=(id:string)=>setSelectedIds(ids=>ids.includes(id)?ids.filter(i=>i!==id):[...ids,id]);
  const selectedSensors = sensors.filter(s=>selectedIds.includes(s.id));

  const handleEdit=(s:LiveSensor)=>{ setEditSensor(s); setFormData({name:s.name,type:s.type,unit:getMeta(s.type).unit,location:''}); setIsAddMode(false); setShowDialog(true); };
  const handleAdd=()=>{ setEditSensor(null); setFormData({name:'',type:'temperature',unit:'°C',location:''}); setIsAddMode(true); setShowDialog(true); };
  const handleDelete=async(id:string)=>{ if(!confirm('Supprimer ce capteur ?')) return; try{ await sensorService.deleteSensor(id); }catch{} };
  const handleSave=async()=>{
    try {
      if(isAddMode) await sensorService.createSensor({name:formData.name,type:formData.type.toUpperCase(),unit:formData.unit,greenhouseId:'',location:formData.location||undefined});
      else if(editSensor) await sensorService.updateSensor(editSensor.id,{name:formData.name,location:formData.location||undefined});
    } catch{}
    setShowDialog(false);
  };

  const STATS=[
    {label:'Total',      value:total,  icon:'sensors',      color:'#60a5fa',bg:'#60a5fa18'},
    {label:'En ligne',   value:online, icon:'check_circle', color:'#2AD368',bg:'#2AD36818'},
    {label:'Alertes',    value:alrt,   icon:'warning',      color:'#fbbf24',bg:'#fbbf2418'},
    {label:'Hors ligne', value:offl,   icon:'wifi_off',     color:'#f87171',bg:'#f8717118'},
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" style={{background:'var(--bg-primary,#10141a)'}}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] tracking-tight">Capteurs</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {compareMode
                ? `Mode comparaison — ${selectedIds.length} capteur${selectedIds.length!==1?'s':''} sélectionné${selectedIds.length!==1?'s':''}`
                : 'Surveillance IoT · Cliquez pour l'historique · Comparez plusieurs capteurs'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Compare button */}
            <button onClick={()=>{ setCompareMode(m=>!m); setSelectedIds([]); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all"
              style={compareMode
                ?{background:'#a78bfa',color:'#0a0e14'}
                :{background:'#1c2026',color:'var(--text-secondary)'}}>
              <span className="material-symbols-outlined text-base">compare_arrows</span>
              {compareMode?'Annuler':'Comparer'}
            </button>
            <button onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{background:'#2AD368',color:'#003916',boxShadow:'0 0 24px #2AD36840'}}>
              <span className="material-symbols-outlined text-lg">add</span>
              Nouveau
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(stat=>(
            <div key={stat.label} className="rounded-2xl p-4 flex items-center gap-3" style={{background:'#1c2026'}}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:stat.bg}}>
                <span className="material-symbols-outlined text-xl" style={{color:stat.color}}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                <p className="text-2xl font-bold leading-tight" style={{color:stat.color}}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map(f=>(
            <button key={f} onClick={()=>setActiveFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={f===activeFilter?{background:'#2AD368',color:'#003916'}:{background:'#1c2026',color:'var(--text-secondary)'}}>
              {f}
            </button>
          ))}
        </div>

        {/* Sensor grid */}
        {filtered.length===0 ? (
          <div className="rounded-3xl p-16 flex flex-col items-center justify-center gap-4" style={{background:'#1c2026'}}>
            <span className="material-symbols-outlined text-5xl opacity-20 text-[var(--text-secondary)]">sensors_off</span>
            <p className="text-[var(--text-secondary)] text-sm">Aucun capteur trouvé</p>
            <button onClick={handleAdd} className="px-5 py-2 rounded-full text-sm font-semibold" style={{background:'#2AD368',color:'#003916'}}>
              + Ajouter un capteur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(sensor=>(
              <SensorCard key={sensor.id} sensor={sensor} sparkData={sparklines[sensor.id]??[]}
                onEdit={handleEdit} onDelete={handleDelete}
                onClick={()=>setExpandedSensor(sensor)}
                compareMode={compareMode} selected={selectedIds.includes(sensor.id)}
                onToggleSelect={()=>toggleSelect(sensor.id)}/>
            ))}
          </div>
        )}
      </div>

      {/* Compare floating bar */}
      {compareMode && selectedIds.length>=2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl"
          style={{background:'#a78bfa',boxShadow:'0 0 40px #a78bfa60'}}>
          <span className="material-symbols-outlined text-[#0a0e14]">analytics</span>
          <span className="font-semibold text-[#0a0e14] text-sm">Comparer {selectedIds.length} capteurs</span>
          <button onClick={()=>setShowCompare(true)}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
            style={{background:'#0a0e14',color:'#a78bfa'}}>
            Voir le graphique →
          </button>
        </div>
      )}

      {/* History modal */}
      {expandedSensor&&<HistoryModal sensor={expandedSensor} onClose={()=>setExpandedSensor(null)}/>}

      {/* Compare modal */}
      {showCompare&&<CompareModal sensors={selectedSensors} onClose={()=>setShowCompare(false)}/>}

      {/* Add / Edit dialog */}
      {showDialog&&(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            style={{background:'#1c2026',boxShadow:'0 0 60px #2AD36820'}}>
            <div className="p-6" style={{background:'#181c22'}}>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{isAddMode?'Nouveau capteur':'Modifier'}</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                {label:'Nom',key:'name',placeholder:'ex: Temp-Serre-1',type:'text'},
                {label:'Localisation',key:'location',placeholder:'ex: Zone A, Bac hydroponique',type:'text'},
              ].map(f=>(
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{f.label}</label>
                  <input type={f.type} value={(formData as any)[f.key]}
                    onChange={e=>setFormData(d=>({...d,[f.key]:e.target.value}))}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-2xl text-sm text-[var(--text-primary)] placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#2AD368]/40"
                    style={{background:'#262a31'}}/>
                </div>
              ))}
              {isAddMode&&(
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Type</label>
                  <select value={formData.type} onChange={e=>setFormData(d=>({...d,type:e.target.value,unit:getMeta(e.target.value).unit}))}
                    className="w-full px-4 py-3 rounded-2xl text-sm text-[var(--text-primary)] outline-none" style={{background:'#262a31'}}>
                    {Object.entries(SENSOR_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="p-6 flex gap-3" style={{borderTop:'1px solid #262a31'}}>
              <button onClick={()=>setShowDialog(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-[var(--text-secondary)] transition-colors" style={{background:'#262a31'}}>Annuler</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105" style={{background:'#2AD368',color:'#003916'}}>{isAddMode?'Créer':'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorsPageNew;
