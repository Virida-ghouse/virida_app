import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'eve';
  timestamp: Date;
  metadata?: {
    method?: string;
    processingTime?: number;
    ragUsed?: boolean;
    sources?: any[];
  };
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

  // Configuration de l'API
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || `${API_BASE_URL}/api/eve/chat-n8n`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fonction pour appeler l'API EVE via n8n/virida_api
  const callEveAPI = async (message: string) => {
    try {
      console.log('Calling EVE API with message:', message);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: 'frontend-user',
          sensorData: sensorData || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('EVE API response:', data);

      if (data.success) {
        return {
          text: data.response,
          metadata: data.metadata
        };
      } else {
        throw new Error(data.error || 'API error');
      }
    } catch (error) {
      console.error('Error calling EVE API:', error);

      // Fallback en cas d'erreur
      return {
        text: "Désolée, je rencontre une difficulté technique. Pouvez-vous répéter votre question ? En attendant, je peux vous aider avec des conseils généraux sur votre serre ! 🌱",
        metadata: {
          method: 'fallback',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    const messageToSend = inputText;
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Appeler l'API EVE
      const eveResult = await callEveAPI(messageToSend);

      const eveResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: eveResult.text,
        sender: 'eve',
        timestamp: new Date(),
        metadata: eveResult.metadata
      };

      setMessages(prev => [...prev, eveResponse]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);

      // Message d'erreur en cas d'échec total
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolée, je ne peux pas répondre pour le moment. Veuillez réessayer dans quelques instants. 🤖",
        sender: 'eve',
        timestamp: new Date(),
        metadata: {
          method: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
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
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {message.sender === 'eve' && message.metadata && (
                      <div className="flex items-center space-x-1">
                        {message.metadata.ragUsed && (
                          <span
                            className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded"
                            title="Réponse IA avancée"
                          >
                            🧠
                          </span>
                        )}
                        {message.metadata.method === 'quick' && (
                          <span
                            className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded"
                            title="Réponse rapide"
                          >
                            ⚡
                          </span>
                        )}
                        {message.metadata.cached && (
                          <span
                            className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded"
                            title="Réponse mise en cache"
                          >
                            💾
                          </span>
                        )}
                      </div>
                    )}
                  </div>
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
