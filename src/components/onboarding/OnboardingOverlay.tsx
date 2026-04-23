import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingContext } from './OnboardingContext';
import EveCharacter from './EveCharacter';
import SpeechBubble from './SpeechBubble';
import EveMascote from '../../Eve_mascote.png';

// Re-export pour compatibilité avec les imports existants
export { useOnboardingContext } from './OnboardingContext';
export { OnboardingProvider } from './OnboardingContext';

interface TargetRect { top: number; left: number; right: number; bottom: number; width: number; height: number; }
const PADDING = 10;

/** Compute where to place the [bubble + Eve] container */
const getContainerPos = (
  rect: TargetRect | null,
  isMobile: boolean,
): { top: number; left: number } => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const BUBBLE_W = 300;
  const EVE_W = 110;
  const GAP = 14;
  const TOTAL_W = BUBBLE_W + EVE_W + GAP;
  const TOTAL_H = 220; // approx total height

  if (!rect) {
    if (isMobile) return { top: H - TOTAL_H - 120, left: Math.max(8, W / 2 - TOTAL_W / 2) };
    return { top: H - TOTAL_H - 28, left: Math.max(8, W - TOTAL_W - 28) };
  }

  if (isMobile) {
    const left = Math.max(8, Math.min(W - TOTAL_W - 8, rect.left + rect.width / 2 - TOTAL_W / 2));
    const top = Math.max(16, rect.top - TOTAL_H - 16);
    return { top, left };
  }

  // Desktop: sidebar items have rect.right < 280, content items are wider
  const isSidebarItem = rect.right < 280;

  if (isSidebarItem) {
    const top = Math.max(16, Math.min(H - TOTAL_H - 16, rect.top + rect.height / 2 - TOTAL_H / 2));
    const left = rect.right + 20;
    return { top, left };
  }

  // Content area: place below the element, centered
  const candidateTop = rect.bottom + 20;
  const top = candidateTop + TOTAL_H > H - 16
    ? Math.max(16, rect.top - TOTAL_H - 20)
    : candidateTop;
  const left = Math.max(8, Math.min(W - TOTAL_W - 8, rect.left + rect.width / 2 - TOTAL_W / 2));
  return { top, left };
};

const OnboardingOverlay: React.FC = () => {
  const { isOpen, currentStep, step, total, isFirst, isLast, next, prev, goTo, close } =
    useOnboardingContext();

  const [targetRect, setTargetRect] = React.useState<TargetRect | null>(null);

  const updateRect = React.useCallback(() => {
    if (!step.targetId) { setTargetRect(null); return; }
    const el = document.getElementById(step.targetId);
    if (!el) { setTargetRect(null); return; }
    const r = el.getBoundingClientRect();
    setTargetRect({
      top: r.top - PADDING,
      left: r.left - PADDING,
      right: r.right + PADDING,
      bottom: r.bottom + PADDING,
      width: r.width + PADDING * 2,
      height: r.height + PADDING * 2,
    });
  }, [step.targetId]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [updateRect]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, next, prev, close]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const containerPos = getContainerPos(targetRect, isMobile);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop : fort blur + très léger voile ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 8999,
              // Step 0: visible blur with faint tint — steps 1+: no overlay at all
              background: 'transparent',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              pointerEvents: 'none',
            }}
          />

          {/* ── Spotlight ring (steps 1+) ── */}
          <AnimatePresence>
            {!isFirst && targetRect && (
              <motion.div
                key={`spotlight-${step.id}`}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'fixed',
                  top: targetRect.top, left: targetRect.left,
                  width: targetRect.width, height: targetRect.height,
                  zIndex: 9050, borderRadius: 16,
                  border: '2px solid #1fc75c',
                  boxShadow: '0 0 0 6px rgba(31,199,92,0.12), 0 0 40px rgba(31,199,92,0.5)',
                  pointerEvents: 'none',
                  background: 'rgba(31,199,92,0.04)',
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Cadre vert tout autour de l'écran ── */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 9080, pointerEvents: 'none', borderRadius: 0,
            border: '2.5px solid #1fc75c',
            boxShadow: '0 0 18px rgba(31,199,92,0.7), inset 0 0 18px rgba(31,199,92,0.12)',
          }} />

          {/* ── Progress bar (en haut, fine) ── */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9100, height: 3, background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }}>
            <motion.div
              animate={{ width: `${((currentStep + 1) / total) * 100}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #1fc75c, #4ade80)' }}
            />
          </div>

          {/* ── Skip button ── */}
          <motion.button
            key="skip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed', top: 18, right: 22, zIndex: 9100,
              background: 'rgba(10,20,14,0.85)', color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(31,199,92,0.25)', borderRadius: 18,
              padding: '5px 14px', fontSize: 12, cursor: 'pointer',
              backdropFilter: 'blur(12px)', transition: 'all 0.18s', pointerEvents: 'auto',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(31,199,92,0.2)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(10,20,14,0.85)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            Passer ✕
          </motion.button>

          <AnimatePresence mode="wait">
            {/* ── STEP 0 : hero centré — app visible derrière blur ── */}
            {isFirst ? (
              <motion.div
                key="welcome-hero"
                initial={{ opacity: 0, scale: 0.88, y: 32 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                style={{
                  position: 'fixed', inset: 0, zIndex: 9100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {/* Glass card centré */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  style={{
                    pointerEvents: 'auto',
                    background: 'rgba(8,18,12,0.10)',
                    border: '2px solid #1fc75c',
                    borderRadius: 28,
                    padding: 'clamp(32px,5vw,48px) clamp(28px,5vw,52px)',
                    maxWidth: 520,
                    width: '90vw',
                    textAlign: 'center',
                    boxShadow: '0 0 0 1px rgba(31,199,92,0.25), 0 0 40px rgba(31,199,92,0.45), 0 0 80px rgba(31,199,92,0.18), inset 0 0 30px rgba(31,199,92,0.04)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                  }}
                >
                  <motion.img
                    src={EveMascote}
                    alt="Eve"
                    animate={{ y: [0, -16, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 'clamp(120px,16vw,180px)', height: 'clamp(120px,16vw,180px)', objectFit: 'contain', filter: 'drop-shadow(0 12px 40px rgba(31,199,92,0.55))', marginBottom: 24, marginLeft: 'auto', marginRight: 'auto', display: 'block', transform: 'translateX(8px)' }}
                  />
                  <motion.h1
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    style={{ fontSize: 'clamp(22px,4vw,40px)', fontWeight: 800, color: '#fff', margin: '0 0 14px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
                  >
                    {step.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                    style={{ fontSize: 'clamp(13px,2vw,17px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: '0 0 36px' }}
                  >
                    {step.description}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(31,199,92,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={next}
                    style={{
                      padding: 'clamp(10px,1.5vw,13px) clamp(26px,4vw,40px)',
                      fontSize: 'clamp(13px,1.5vw,16px)', fontWeight: 700,
                      borderRadius: 14, border: 'none',
                      background: 'linear-gradient(135deg, #1fc75c, #15a34a)',
                      color: '#fff', cursor: 'pointer',
                      boxShadow: '0 6px 24px rgba(31,199,92,0.42)',
                    }}
                  >
                    Commencer la visite →
                  </motion.button>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}
                  >
                    {Array.from({ length: total }).map((_, i) => (
                      <motion.div
                        key={i} onClick={() => goTo(i)}
                        animate={{ width: i === currentStep ? 22 : 7, background: i === currentStep ? '#1fc75c' : 'rgba(255,255,255,0.25)' }}
                        transition={{ duration: 0.25 }}
                        style={{ height: 7, borderRadius: 4, cursor: 'pointer' }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              /* ── STEPS 1+ : Eve animée + bulle positionnée près de la cible ── */
              <motion.div
                key="bubble-zone"
                animate={{
                  top: containerPos.top,
                  left: containerPos.left,
                  opacity: 1,
                }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 160 }}
                style={{
                  position: 'fixed',
                  zIndex: 9100,
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 14,
                  // Green glow around the whole unit (Eve + bubble)
                  filter: 'drop-shadow(0 0 28px rgba(31,199,92,0.35))',
                }}
              >
                {/* On mobile: Eve above bubble (column layout) */}
                {isMobile ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <EveCharacter onClick={next} />
                    <SpeechBubble
                      step={step}
                      currentStep={currentStep}
                      total={total}
                      isFirst={isFirst}
                      isLast={isLast}
                      onNext={next}
                      onPrev={prev}
                      onClose={close}
                      onDotClick={goTo}
                    />
                  </div>
                ) : (
                  <>
                    <SpeechBubble
                      step={step}
                      currentStep={currentStep}
                      total={total}
                      isFirst={isFirst}
                      isLast={isLast}
                      onNext={next}
                      onPrev={prev}
                      onClose={close}
                      onDotClick={goTo}
                    />
                    <EveCharacter onClick={next} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
