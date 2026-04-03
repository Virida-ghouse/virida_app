import React, { useState, useEffect, useRef } from 'react';

const conversation = [
  { role: 'eve', text: 'Bonjour ! Je suis EVE, votre assistante IA pour la serre Virida. Comment puis-je vous aider ? 🌱' },
  { role: 'user', text: 'Mes feuilles de basilic jaunissent, c\'est quoi le problème ?' },
  { role: 'eve', text: 'D\'après vos capteurs, l\'humidité du sol est à 28% — c\'est trop bas pour le basilic. Je viens d\'augmenter l\'arrosage automatiquement. Vérifiez aussi que le pH est entre 5.5 et 6.5.' },
  { role: 'user', text: 'Tu peux vérifier le pH pour moi ?' },
  { role: 'eve', text: 'Le pH est à 6.2, c\'est parfait ! Le problème vient bien du manque d\'eau. J\'ai programmé un arrosage toutes les 8h pendant 3 jours, je surveille l\'évolution. 💧' },
  { role: 'user', text: 'Et pour la lumière, c\'est bon ?' },
  { role: 'eve', text: 'La luminosité est à 650 lux, un peu faible. J\'ai activé les LED UV à 70% pour compenser. Le basilic a besoin de 6 à 8h de lumière par jour. Je m\'en occupe ! ☀️' },
];

const TYPING_DELAY = 1200;
const CHAR_SPEED = 25;
const USER_CHAR_SPEED = 40;
const PAUSE_BETWEEN = 2000;
const RESTART_DELAY = 4000;
const SEND_PAUSE = 600;

const EveFakeChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingIndex, setStreamingIndex] = useState(-1);
  const [inputText, setInputText] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isTyping, inputText]);

  useEffect(() => {
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= conversation.length) {
        timeoutRef.current = window.setTimeout(() => {
          setMessages([]);
          setStreamingText('');
          setStreamingIndex(-1);
          setInputText('');
          currentIndex = 0;
          playNext();
        }, RESTART_DELAY);
        return;
      }

      const msg = conversation[currentIndex];

      if (msg.role === 'user') {
        // Simulate typing in input
        timeoutRef.current = window.setTimeout(() => {
          let charIdx = 0;
          setInputText('');
          const typeInterval = setInterval(() => {
            if (charIdx < msg.text.length) {
              setInputText(msg.text.slice(0, charIdx + 1));
              charIdx++;
            } else {
              clearInterval(typeInterval);
              // Pause then "send"
              timeoutRef.current = window.setTimeout(() => {
                setInputText('');
                setMessages(prev => [...prev, msg]);
                currentIndex++;
                timeoutRef.current = window.setTimeout(playNext, PAUSE_BETWEEN);
              }, SEND_PAUSE);
            }
          }, USER_CHAR_SPEED);
        }, PAUSE_BETWEEN);
      } else {
        setIsTyping(true);
        timeoutRef.current = window.setTimeout(() => {
          setIsTyping(false);
          setStreamingIndex(currentIndex);
          setStreamingText('');

          let charIdx = 0;
          const streamInterval = setInterval(() => {
            if (charIdx < msg.text.length) {
              setStreamingText(msg.text.slice(0, charIdx + 1));
              charIdx++;
            } else {
              clearInterval(streamInterval);
              setMessages(prev => [...prev, msg]);
              setStreamingText('');
              setStreamingIndex(-1);
              currentIndex++;
              timeoutRef.current = window.setTimeout(playNext, PAUSE_BETWEEN);
            }
          }, CHAR_SPEED);
        }, TYPING_DELAY);
      }
    };

    playNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="glass-card rounded-[2rem] border-2 border-[var(--border-color)] backdrop-blur-xl overflow-hidden shadow-2xl h-[480px] md:h-[540px] flex flex-col relative max-w-md mx-auto">
      {/* Live preview badge */}
      <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-color)] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2AD368] animate-pulse"></span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Aperçu</span>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3 shrink-0">
        <div className="relative">
          <img
            src="/abeillevd.svg"
            alt="EVE"
            className="w-10 h-10"
            style={{
              filter: 'brightness(0) saturate(100%) invert(64%) sepia(89%) saturate(419%) hue-rotate(76deg) brightness(95%) contrast(92%)'
            }}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2AD368] rounded-full border-2 border-[var(--bg-secondary)]"></div>
        </div>
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">EVE <span className="text-[#CBED62]">IA</span></h4>
          <p className="text-[10px] text-[var(--text-secondary)]">Assistante Jardinage</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#2AD368] text-white rounded-br-md'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingIndex >= 0 && streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm leading-relaxed bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]">
              {streamingText}
              <span className="inline-block w-0.5 h-4 bg-[#2AD368] ml-0.5 animate-pulse align-middle"></span>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-[#2AD368] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-[#2AD368] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-[#2AD368] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fake input */}
      <div className="p-3 border-t border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] cursor-not-allowed">
          <span className={`text-sm flex-1 ${inputText ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/50'}`}>
            {inputText || 'Posez votre question à EVE...'}
            {inputText && <span className="inline-block w-0.5 h-3.5 bg-[var(--text-primary)] ml-0.5 animate-pulse align-middle"></span>}
          </span>
          <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${inputText ? 'bg-[#2AD368]' : 'bg-[var(--border-color)]'}`}>
            <span className="material-symbols-outlined text-white text-lg">send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EveSection: React.FC = () => {
  return (
    <section id="eve" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block text-sm">
              L'Intelligence Artificielle
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
              Rencontrez <span className="text-[#CBED62] italic">EVE</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-4 leading-relaxed">
              EVE est votre abeille numérique, une IA basée sur Qwen accessible
              depuis le dashboard et directement sur l'écran intégré de votre serre.
            </p>
            <p className="text-[var(--text-secondary)] text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
              Entraînée sur un jeu de données complet couvrant les maladies, les besoins
              spécifiques de chaque plante et les conditions de croissance optimales, EVE
              a aussi une connaissance parfaite de votre serre et de tous ses capteurs.
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#CBED62]/10 p-3 rounded-xl shrink-0">
                  <span className="material-symbols-outlined text-[#CBED62] text-2xl">visibility</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)]">Vision par caméra</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    EVE analyse vos plantes en photo et vidéo pour détecter maladies,
                    carences et parasites avant qu'il ne soit trop tard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#2AD368]/10 p-3 rounded-xl shrink-0">
                  <span className="material-symbols-outlined text-[#2AD368] text-2xl">sensors</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)]">Capteurs en temps réel</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Accès permanent à l'humidité, le pH, la luminosité et les niveaux d'eau
                    pour comprendre, prévenir et réagir automatiquement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#CBED62]/10 p-3 rounded-xl shrink-0">
                  <span className="material-symbols-outlined text-[#CBED62] text-2xl">smart_toy</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-[var(--text-primary)]">Coach & assistant</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Posez vos questions en langage naturel. EVE vous guide, vous conseille
                    et pilote automatiquement la pompe, les LED et l'arrosage.
                  </p>
                </div>
              </div>
            </div>

            {/* Open source badge */}
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBED62]/10 border border-[#CBED62]/30">
              <span className="material-symbols-outlined text-[#CBED62] text-lg">lock_open</span>
              <span className="text-xs font-bold text-[#CBED62]">IA open-source — Modèle Qwen — Dashboard + écran serre</span>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-10 bg-[#CBED62]/8 rounded-full blur-[120px]"></div>
            <div className="relative">
              <EveFakeChat />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EveSection;
