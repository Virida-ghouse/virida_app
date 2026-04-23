import React, { useState, useEffect } from 'react';
import EveMascote from '../../Eve_mascote.png';

const ONBOARDING_KEY = 'virida_onboarding_done';

interface OnboardingStep {
  id: number;
  title: string;
  message: string;
  highlight?: string; // view name to hint visually
  emoji: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 0,
    emoji: '🐝',
    title: 'Bienvenue dans Virida !',
    message:
      "Salut ! Je m'appelle Eve 🐝, ton assistante jardinage. Je suis là pour t'aider à prendre soin de ta serre. Laisse-moi te faire visiter !",
  },
  {
    id: 1,
    emoji: '📊',
    title: 'Le Dashboard',
    message:
      "Le tableau de bord te donne une vue d'ensemble de ta serre en temps réel : température, humidité, pH, luminosité… Tout est là d'un coup d'œil !",
    highlight: 'dashboard',
  },
  {
    id: 2,
    emoji: '🌱',
    title: 'Mes Plantes',
    message:
      "Dans l'onglet Plantes, tu suis la croissance de chaque plante, tu enregistres les arrosages, les soins, et tu observes leur évolution au fil du temps.",
    highlight: 'plants',
  },
  {
    id: 3,
    emoji: '💧',
    title: 'Irrigation & Automatisation',
    message:
      "Planifie tes arrosages et crée des règles automatiques : si la température dépasse 30°C, le ventilateur se déclenche. Ta serre s'occupe d'elle-même !",
    highlight: 'irrigation',
  },
  {
    id: 4,
    emoji: '💬',
    title: 'Discute avec Eve',
    message:
      "Tu peux me poser toutes tes questions sur la serre ! Clique sur le bouton 🐝 en bas à droite de l'écran pour ouvrir le chat et je te réponds en temps réel.",
    highlight: 'chat',
  },
  {
    id: 5,
    emoji: '🚀',
    title: "C'est parti !",
    message:
      "Tu es prêt(e) ! N'hésite pas à explorer chaque section. Je reste disponible en permanence dans le chat si tu as besoin de moi. Bonne culture 🌿 !",
  },
];

interface Props {
  onDone: () => void;
}

const OnboardingOverlay: React.FC<Props> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const current = STEPS[step];

  const goNext = () => {
    if (step === STEPS.length - 1) {
      finish();
      return;
    }
    // Animate out then in
    setBubbleVisible(false);
    setTimeout(() => {
      setStep((s) => s + 1);
      setBubbleVisible(true);
    }, 250);
  };

  const goPrev = () => {
    setBubbleVisible(false);
    setTimeout(() => {
      setStep((s) => s - 1);
      setBubbleVisible(true);
    }, 250);
  };

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    onDone();
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step]);

  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <style>{`
        @keyframes eveFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes bubbleOut {
          from { opacity: 1; transform: translateY(0)   scale(1); }
          to   { opacity: 0; transform: translateY(-10px) scale(0.96); }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
        .eve-float { animation: eveFloat 3s ease-in-out infinite; }
        .bubble-in  { animation: bubbleIn  0.28s cubic-bezier(0.22,1,0.36,1) forwards; }
        .bubble-out { animation: bubbleOut 0.22s ease-in forwards; }
        .dot-1 { animation: dotBlink 1.4s infinite 0s; }
        .dot-2 { animation: dotBlink 1.4s infinite 0.2s; }
        .dot-3 { animation: dotBlink 1.4s infinite 0.4s; }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
          background: 'rgba(0,0,0,0.52)',
          backdropFilter: 'blur(3px)',
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Skip button */}
      <button
        onClick={finish}
        style={{
          position: 'fixed',
          top: 20,
          right: 24,
          zIndex: 9100,
          background: 'rgba(255,255,255,0.12)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 20,
          padding: '6px 16px',
          fontSize: 13,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
      >
        Passer ✕
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9100,
          height: 4,
          background: 'rgba(255,255,255,0.15)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #1fc75c, #4ade80)',
            transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
            borderRadius: '0 4px 4px 0',
          }}
        />
      </div>

      {/* Step dots */}
      <div
        style={{
          position: 'fixed',
          bottom: 200,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9100,
          display: 'flex',
          gap: 8,
        }}
      >
        {STEPS.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              setBubbleVisible(false);
              setTimeout(() => { setStep(s.id); setBubbleVisible(true); }, 200);
            }}
            style={{
              width: s.id === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: s.id === step ? '#1fc75c' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Eve + Bubble zone */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9100,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 16,
          maxWidth: 560,
        }}
      >
        {/* Speech bubble */}
        <div
          className={bubbleVisible ? 'bubble-in' : 'bubble-out'}
          style={{
            flex: 1,
            background: 'rgba(18, 28, 22, 0.92)',
            border: '1px solid rgba(31,199,92,0.35)',
            borderRadius: 20,
            borderBottomRightRadius: 6,
            padding: '20px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(31,199,92,0.12)',
            position: 'relative',
            backdropFilter: 'blur(12px)',
            minWidth: 280,
            maxWidth: 380,
          }}
        >
          {/* Bubble tail */}
          <div
            style={{
              position: 'absolute',
              bottom: 18,
              right: -14,
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: '14px solid rgba(18, 28, 22, 0.92)',
            }}
          />

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>{current.emoji}</span>
            <span
              style={{
                fontSize: 12,
                color: '#1fc75c',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {step + 1} / {STEPS.length}
            </span>
          </div>

          <h3
            style={{
              margin: '0 0 10px',
              fontSize: 17,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.3,
            }}
          >
            {current.title}
          </h3>

          <p
            style={{
              margin: '0 0 20px',
              fontSize: 14,
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.6,
            }}
          >
            {current.message}
          </p>

          {/* Typing dots decoration */}
          <div style={{ position: 'absolute', top: 16, right: 18, display: 'flex', gap: 4 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`dot-${i}`}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#1fc75c',
                }}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            {step > 0 && (
              <button
                onClick={goPrev}
                style={{
                  padding: '8px 18px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                ← Retour
              </button>
            )}
            <button
              onClick={goNext}
              style={{
                padding: '8px 22px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #1fc75c, #16a34a)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(31,199,92,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(31,199,92,0.55)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(31,199,92,0.4)';
              }}
            >
              {isLast ? '🚀 Commencer !' : 'Suivant →'}
            </button>
          </div>
        </div>

        {/* Eve mascot */}
        <div className="eve-float" style={{ flexShrink: 0 }}>
          <img
            src={EveMascote}
            alt="Eve l'abeille"
            style={{
              width: 120,
              height: 120,
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(31,199,92,0.35))',
            }}
          />
        </div>
      </div>
    </>
  );
};

export { ONBOARDING_KEY };
export default OnboardingOverlay;
