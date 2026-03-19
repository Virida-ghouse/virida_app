import React, { useState, useEffect } from 'react';

interface EveFloatingChatProps {
  position: 'left' | 'right';
}

const messagesLeft = [
  "Vos tomates sont prêtes pour la récolte",
  "Température parfaite pour la croissance",
  "Toutes vos plantes sont en pleine forme"
];

const messagesRight = [
  "Humidité optimale détectée",
  "Niveau de CO2 idéal",
  "Irrigation programmée avec succès"
];

const EveFloatingChat: React.FC<EveFloatingChatProps> = ({ position }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [verticalOffset, setVerticalOffset] = useState(0);
  
  const messages = position === 'left' ? messagesLeft : messagesRight;
  const interval = position === 'left' ? 7000 : 9500; // Entre 5 et 10 secondes, différent

  useEffect(() => {
    // Délai initial différent pour chaque Eve
    const initialDelay = position === 'left' ? 0 : 8000;
    
    const timeout = setTimeout(() => {
      const messageInterval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentMessage((prev) => (prev + 1) % messages.length);
          // Variation verticale aléatoire entre -20px et +20px
          setVerticalOffset(Math.floor(Math.random() * 41) - 20);
          setIsVisible(true);
        }, 500);
      }, interval);

      return () => clearInterval(messageInterval);
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [messages.length, interval, position]);

  // Position et design différents pour chaque Eve
  const positionClasses = position === 'left' 
    ? 'absolute left-8 top-[25%]' 
    : 'absolute right-8 top-[35%]';
  
  // Couleurs pour design moderne
  const accentColor = position === 'left' ? '#CBED62' : '#2AD368';

  return (
    <div 
      className={`${positionClasses} hidden lg:block transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} z-20`}
      style={{ 
        animation: 'float 12s ease-in-out infinite', 
        animationDelay: position === 'right' ? '-6s' : '0s',
        transform: `translateY(${verticalOffset}px)`
      }}
    >
      <div className="flex items-start gap-3">
        {/* Eve image - verte pour visibilité */}
        <div className="flex-shrink-0">
          <img 
            alt="Eve the Bee" 
            className="w-16 h-16" 
            src="/abeillevd.svg"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(64%) sepia(89%) saturate(419%) hue-rotate(76deg) brightness(95%) contrast(92%)'
            }}
          />
        </div>
        
        {/* Speech bubble - design moderne */}
        <div 
          className="relative rounded-2xl px-4 py-3 max-w-[240px] glass-card"
          style={{ 
            background: 'var(--glass-bg)',
            borderLeft: `3px solid ${accentColor}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {/* Nom Eve */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold" style={{ color: accentColor }}>Eve</span>
          </div>
          {/* Message */}
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">{messages[currentMessage]}</p>
        </div>
      </div>
    </div>
  );
};

export default EveFloatingChat;
