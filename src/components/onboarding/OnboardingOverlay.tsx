import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from './useOnboarding';
import EveCharacter from './EveCharacter';
import SpeechBubble from './SpeechBubble';

export { STORAGE_KEY as ONBOARDING_KEY } from './onboardingSteps';

const OnboardingOverlay: React.FC = () => {
  const { isOpen, currentStep, step, total, isFirst, isLast, next, prev, goTo, close } =
    useOnboarding();

  // Keyboard navigation
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — non-bloquant : pointer-events-none sur tout sauf éléments interactifs */}
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
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(2px)',
              pointerEvents: 'none', // l'app derrière reste visible sans bloquer
            }}
          />

          {/* Progress bar — top */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9100,
              height: 3,
              background: 'rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ width: `${((currentStep + 1) / total) * 100}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #1fc75c, #4ade80)',
                borderRadius: '0 3px 3px 0',
              }}
            />
          </div>

          {/* Skip button — top right */}
          <motion.button
            key="skip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed',
              top: 18,
              right: 22,
              zIndex: 9100,
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 18,
              padding: '5px 14px',
              fontSize: 12,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.18s',
              pointerEvents: 'auto',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            Passer ✕
          </motion.button>

          {/* Eve + Bubble — bottom right */}
          <div
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
            {/* Speech bubble */}
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

            {/* Eve mascot */}
            <EveCharacter onClick={next} />
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
