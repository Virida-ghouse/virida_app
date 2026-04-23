import React, { useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from './useOnboarding';
import EveCharacter from './EveCharacter';
import SpeechBubble from './SpeechBubble';
import EveMascote from '../../Eve_mascote.png';

// Context pour permettre à n'importe quel composant de relancer l'onboarding
interface OnboardingCtx { reopen: () => void; }
const OnboardingContext = createContext<OnboardingCtx>({ reopen: () => {} });
export const useOnboardingContext = () => useContext(OnboardingContext);

const OnboardingOverlay: React.FC = () => {
  const { isOpen, currentStep, step, total, isFirst, isLast, next, prev, goTo, close, forceOpen } =
    useOnboarding();

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

  return (
    <OnboardingContext.Provider value={{ reopen: forceOpen }}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 8999,
                background: isFirst ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.55)',
                backdropFilter: isFirst ? 'blur(6px)' : 'blur(2px)',
                pointerEvents: 'none',
              }}
            />

            {/* Progress bar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9100, height: 3, background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }}>
              <motion.div
                animate={{ width: `${((currentStep + 1) / total) * 100}%` }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #1fc75c, #4ade80)', borderRadius: '0 3px 3px 0' }}
              />
            </div>

            {/* Skip button */}
            <motion.button
              key="skip"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={close}
              style={{
                position: 'fixed', top: 18, right: 22, zIndex: 9100,
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.18)', borderRadius: 18,
                padding: '5px 14px', fontSize: 12, cursor: 'pointer',
                backdropFilter: 'blur(8px)', transition: 'all 0.18s', pointerEvents: 'auto',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              Passer ✕
            </motion.button>

            {/* ── STEP 0 : écran d'accueil héroïque centré ── */}
            <AnimatePresence mode="wait">
              {isFirst ? (
                <motion.div
                  key="welcome-hero"
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -20 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0,
                    pointerEvents: 'auto',
                    textAlign: 'center',
                    padding: '0 24px',
                  }}
                >
                  {/* Eve grande version */}
                  <motion.img
                    src={EveMascote}
                    alt="Eve"
                    animate={{ y: [0, -18, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 12px 40px rgba(31,199,92,0.5))',
                      marginBottom: 32,
                    }}
                  />

                  {/* Titre */}
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                      fontSize: 'clamp(28px, 5vw, 48px)',
                      fontWeight: 800,
                      color: '#fff',
                      margin: '0 0 16px',
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.title}
                  </motion.h1>

                  {/* Sous-titre */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{
                      fontSize: 'clamp(15px, 2vw, 20px)',
                      color: 'rgba(255,255,255,0.72)',
                      maxWidth: 520,
                      lineHeight: 1.6,
                      margin: '0 0 48px',
                    }}
                  >
                    {step.description}
                  </motion.p>

                  {/* CTA */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(31,199,92,0.55)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={next}
                    style={{
                      padding: '14px 44px',
                      fontSize: 17,
                      fontWeight: 700,
                      borderRadius: 16,
                      border: 'none',
                      background: 'linear-gradient(135deg, #1fc75c, #15a34a)',
                      color: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 6px 24px rgba(31,199,92,0.42)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Commencer la visite →
                  </motion.button>

                  {/* Step dots */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    style={{ display: 'flex', gap: 8, marginTop: 32 }}
                  >
                    {Array.from({ length: total }).map((_, i) => (
                      <motion.div
                        key={i}
                        onClick={() => goTo(i)}
                        animate={{ width: i === currentStep ? 24 : 8, background: i === currentStep ? '#1fc75c' : 'rgba(255,255,255,0.3)' }}
                        transition={{ duration: 0.25 }}
                        style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                /* ── STEPS 1-5 : bulle bas-droite avec Eve ── */
                <motion.div
                  key="bubble-zone"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: 'fixed',
                    bottom: 28,
                    right: 28,
                    zIndex: 9100,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 14,
                    pointerEvents: 'auto',
                  }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </OnboardingContext.Provider>
  );
};

export default OnboardingOverlay;
