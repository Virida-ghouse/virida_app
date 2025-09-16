import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'eve';
  timestamp: Date;
}

interface ChatBotProps {
  sensorData?: {
    temperature: number;
    humidity: number;
    light?: number;
    soilMoisture?: number;
  };
}

const ChatBot: React.FC<ChatBotProps> = ({ sensorData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis EVE, votre assistante IA pour la serre Virida. Comment puis-je vous aider aujourd'hui ? 🌱",
      sender: 'eve',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateEveResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Réponses basées sur les données des capteurs
    if (sensorData) {
      if (message.includes('température') || message.includes('temp') || message.includes('chaude') || message.includes('chaud') || message.includes('froide') || message.includes('froid')) {
        const temp = sensorData.temperature;
        if (temp < 18) {
          return `La température actuelle est de ${temp}°C. C'est un peu froid pour la plupart des plantes. Je recommande d'augmenter le chauffage ou de fermer les ouvertures pour maintenir une température entre 20-25°C. 🌡️`;
        } else if (temp > 28) {
          return `La température est de ${temp}°C, c'est assez chaud ! Pensez à aérer la serre ou à activer l'ombrage pour éviter le stress thermique des plantes. 🔥`;
        } else {
          return `Parfait ! La température de ${temp}°C est idéale pour la croissance des plantes. Vos cultures se développent dans de bonnes conditions. ✨`;
        }
      }
      
      if (message.includes('humidité') || message.includes('humid') || message.includes('sec') || message.includes('sèche') || message.includes('mouillé') || message.includes('humide')) {
        const humidity = sensorData.humidity;
        if (humidity < 50) {
          return `L'humidité est de ${humidity}%, c'est un peu sec. Je suggère d'augmenter l'arrosage ou d'utiliser un humidificateur pour atteindre 60-70%. 💧`;
        } else if (humidity > 80) {
          return `L'humidité de ${humidity}% est élevée. Attention aux risques de moisissures ! Améliorez la ventilation pour réduire l'humidité. 🌪️`;
        } else {
          return `Excellent ! L'humidité de ${humidity}% est parfaite pour vos plantes. Elles peuvent bien absorber l'eau et les nutriments. 🌿`;
        }
      }
      
      if (message.includes('conditions') || message.includes('état')) {
        return `Actuellement dans votre serre : 🌡️ ${sensorData.temperature}°C, 💧 ${sensorData.humidity}%. ${sensorData.temperature >= 20 && sensorData.temperature <= 26 && sensorData.humidity >= 50 && sensorData.humidity <= 75 ? 'Les conditions sont optimales !' : 'Quelques ajustements pourraient améliorer l\'environnement.'}`;
      }
    }

    // Réponses générales sur le jardinage
    if (message.includes('arrosage') || message.includes('arroser')) {
      return "Pour l'arrosage, vérifiez l'humidité du sol avec votre doigt. Arrosez tôt le matin ou en fin de journée. Les plantes préfèrent un arrosage profond mais moins fréquent ! 🚿";
    }
    
    if (message.includes('plantation') || message.includes('planter')) {
      return "Pour planter, choisissez des variétés adaptées à votre climat. Préparez bien le sol avec du compost. Respectez les distances de plantation et la profondeur des graines ! 🌱";
    }
    
    if (message.includes('maladie') || message.includes('problème') || message.includes('jaunisse') || message.includes('tache') || message.includes('flétr') || message.includes('pourr')) {
      return "Pour identifier les maladies, observez les feuilles : jaunissement, taches, déformation. Assurez-vous d'une bonne circulation d'air et évitez l'excès d'humidité. En cas de doute, envoyez-moi une photo ! 🔍";
    }
    
    if (message.includes('fertilisant') || message.includes('engrais')) {
      return "Utilisez un engrais équilibré NPK pour la croissance générale. Les plantes à fleurs ont besoin de plus de phosphore, les légumes verts de plus d'azote. L'engrais organique est toujours préférable ! 🌿";
    }
    
    if (message.includes('saison') || message.includes('calendrier')) {
      return "Chaque saison a ses tâches : printemps (semis, repiquage), été (arrosage, récolte), automne (préparation hivernale), hiver (planification, entretien). Voulez-vous des conseils pour une saison spécifique ? 📅";
    }

    // Réponses par défaut
    const defaultResponses = [
      "C'est une excellente question ! Pouvez-vous me donner plus de détails pour que je puisse mieux vous aider ? 🤔",
      "Je suis là pour vous aider avec votre serre ! Parlez-moi de vos plantes, des conditions ou de tout problème que vous rencontrez. 🌱",
      "En tant qu'assistante IA spécialisée en jardinage, je peux vous conseiller sur l'arrosage, la plantation, les maladies, et bien plus ! Que souhaitez-vous savoir ? 💚",
      "N'hésitez pas à me poser des questions sur la température, l'humidité, l'arrosage, ou tout autre aspect de votre serre ! 🏡"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simuler un délai de réponse
    setTimeout(() => {
      const eveResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateEveResponse(inputText),
        sender: 'eve',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, eveResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Ouvrir le chat avec EVE"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 max-w-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-900 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-800 font-bold text-sm">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">EVE - Assistant IA</h3>
            <p className="text-xs text-green-100">Spécialiste jardinage</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-green-700 p-1 rounded"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-green-700 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-80 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-green-800 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question à EVE..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-green-800 hover:bg-green-900 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
