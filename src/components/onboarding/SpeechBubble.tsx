import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingStep } from './onboardingSteps';

interface Props {
  step: OnboardingStep;
  currentStep: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onDotClick: (i: number) => void;
}

const SpeechBubble: React.FC<Props> = ({
  step,
  currentStep,
  total,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onClose,
  onDotClick,
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={step.id}
      initial={{ opacity: 0, scale: 0.82, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -10 }}
      transition={{ type: 'spring', damping: 18, stiffness: 260 }}
      style={{
        background: 'rgba(10, 20, 14, 0.93)',
        border: '2px solid #1fc75c',
        borderRadius: 20,
        borderBottomRightRadius: 4,
        padding: '20px 22px 18px',
        width: 300,
        boxShadow:
          '0 0 0 1px rgba(31,199,92,0.15), 0 12px 40px rgba(0,0,0,0.55), 4px 4px 0px rgba(31,199,92,0.18)',
        position: 'relative',
      }}
    >
      {/* Bubble tail pointing to Eve */}
      <div
        style={{
          position: 'absolute',
          bottom: 22,
          right: -16,
          width: 0,
          height: 0,
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderLeft: '16px solid #1fc75c',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: -12,
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '12px solid rgba(10,20,14,0.93)',
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Passer l'onboarding"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 16,
          cursor: 'pointer',
          lineHeight: 1,
          padding: 2,
          transition: 'color 0.15s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >
        ✕
      </button>

      {/* Step label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{step.emoji}</span>
        <span style={{ fontSize: 11, color: '#1fc75c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {currentStep + 1} / {total}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
        {step.title}
      </h3>

      {/* Content */}
      <p style={{ margin: '0 0 18px', fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>
        {step.description}
      </p>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            onClick={() => onDotClick(i)}
            animate={{ width: i === currentStep ? 20 : 7, background: i === currentStep ? '#1fc75c' : 'rgba(255,255,255,0.25)' }}
            transition={{ duration: 0.25 }}
            style={{
              height: 7,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {!isFirst && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onPrev}
            style={{
              padding: '7px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            ← Retour
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 6px 22px rgba(31,199,92,0.5)' }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          style={{
            padding: '7px 20px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #1fc75c, #15a34a)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(31,199,92,0.38)',
          }}
        >
          {isLast ? '🚀 Commencer !' : 'Suivant →'}
        </motion.button>
      </div>
    </motion.div>
  </AnimatePresence>
);

export default SpeechBubble;
