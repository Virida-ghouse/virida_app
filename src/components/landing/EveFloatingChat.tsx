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
  
  // Couleurs et design subtil pour meilleure intégration
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
        
        {/* Speech bubble - design minimaliste avec contraste */}
        <div 
          className="relative rounded-xl px-3.5 py-2.5 max-w-[220px] bg-white dark:bg-[#0a1612] border border-[var(--border-color)]"
          style={{
            boxShadow: `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04), 0 0 0 1px ${accentColor}10`
          }}
        >
          {/* Message */}
          <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">{messages[currentMessage]}</p>
          {/* Petit accent coloré */}
          <div 
            className="absolute -bottom-1 left-4 w-10 h-1 rounded-full"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 2px 8px ${accentColor}40`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EveFloatingChat;
