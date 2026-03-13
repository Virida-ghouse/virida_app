import React, { useState, useRef, useEffect } from 'react';
import { useChatHistory } from '../../contexts/ChatHistoryContext';
import type { ChatMessage } from '../../contexts/ChatHistoryContext';

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
    cached?: boolean;
    error?: string;
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

const ChatBotNew: React.FC<ChatBotProps> = ({ sensorData }) => {
  const { currentConversation, addMessage, startNewConversation } = useChatHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Configuration de l'API
  const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || import.meta.env.REACT_APP_N8N_WEBHOOK_URL || `${API_BASE_URL}/api/eve/chat-n8n`;

  // 📥 Charger l'historique de conversation au démarrage
  useEffect(() => {
    if (isInitialized.current) return;

    if (currentConversation && currentConversation.messages.length > 0) {
      const historyMessages: Message[] = currentConversation.messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp,
        metadata: msg.metadata
      }));
      setMessages(historyMessages);
      isInitialized.current = true;
    } else if (currentConversation && currentConversation.messages.length === 0) {
      const welcomeMessage: Message = {
        id: `welcome_${Date.now()}`,
        text: "Bonjour ! Je suis EVE, votre assistante IA pour la serre Virida. Comment puis-je vous aider aujourd'hui ? 🌱",
        sender: 'eve',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

      const welcomeChatMessage: ChatMessage = {
        id: welcomeMessage.id,
        text: welcomeMessage.text,
        sender: welcomeMessage.sender,
        timestamp: welcomeMessage.timestamp
      };
      addMessage(welcomeChatMessage);
      isInitialized.current = true;
    } else if (!currentConversation) {
      startNewConversation();
    }
  }, [currentConversation, addMessage, startNewConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callEveAPI = async (message: string) => {
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
        timestamp: msg.timestamp.toISOString()
      }));

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: 'frontend-user',
          conversationHistory,
          ...(sensorData && { sensorData })
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

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
      return {
        text: "Désolée, je rencontre une difficulté technique. Pouvez-vous répéter votre question ? 🌱",
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

    const userChatMessage: ChatMessage = {
      id: userMessage.id,
      text: userMessage.text,
      sender: userMessage.sender,
      timestamp: userMessage.timestamp
    };
    addMessage(userChatMessage);

    try {
      const eveResult = await callEveAPI(messageToSend);

      const eveResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: eveResult.text,
        sender: 'eve',
        timestamp: new Date(),
        metadata: eveResult.metadata
      };

      setMessages(prev => [...prev, eveResponse]);

      const eveChatMessage: ChatMessage = {
        id: eveResponse.id,
        text: eveResponse.text,
        sender: eveResponse.sender,
        timestamp: eveResponse.timestamp,
        metadata: eveResponse.metadata
      };
      addMessage(eveChatMessage);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolée, je ne peux pas répondre pour le moment. Veuillez réessayer. 🤖",
        sender: 'eve',
        timestamp: new Date(),
        metadata: {
          method: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      setMessages(prev => [...prev, errorResponse]);

      const errorChatMessage: ChatMessage = {
        id: errorResponse.id,
        text: errorResponse.text,
        sender: errorResponse.sender,
        timestamp: errorResponse.timestamp,
        metadata: errorResponse.metadata
      };
      addMessage(errorChatMessage);
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
    <div className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[9999]">
      {/* Chat Toggle Button - Abeille EVE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group transition-all duration-300 hover:scale-110"
          aria-label="Ouvrir le chat avec EVE"
        >
          <img 
            src="/abeillevd.svg" 
            alt="EVE" 
            className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-[0_8px_30px_rgba(42,211,104,0.6)] group-hover:drop-shadow-[0_12px_40px_rgba(42,211,104,0.9)] transition-all animate-bee-fly"
            style={{
              filter: 'brightness(0) saturate(100%) invert(68%) sepia(85%) saturate(445%) hue-rotate(84deg) brightness(95%) contrast(89%)'
            }}
          />
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CBED62] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CBED62]"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card backdrop-blur-xl rounded-3xl shadow-2xl w-[calc(100vw-2rem)] sm:w-96 max-w-sm border-2 border-[#2AD368]/30 overflow-hidden">
          {/* Header */}
          <div className="bg-[#121A21] text-white p-5 flex items-center justify-between border-b border-[#2AD368]/30">
            <div className="flex items-center space-x-4">
              <img 
                src="/abeillevd.svg" 
                alt="EVE" 
                className="w-12 h-12 lg:w-14 lg:h-14 animate-bee-fly-header"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(68%) sepia(85%) saturate(445%) hue-rotate(84deg) brightness(95%) contrast(89%)'
                }}
              />
              <div>
                <h3 className="font-black text-xl text-white">
                  EVE <span className="text-[#2AD368]">IA</span>
                </h3>
                <p className="text-sm text-gray-400 font-medium">Assistante Jardinage</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/5 p-2 rounded-full transition-all"
            >
              <span className="material-symbols-outlined text-white text-2xl">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 h-96 bg-[#121A21]/95 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-[#2AD368] text-[#121A21] shadow-lg'
                      : 'glass-card backdrop-blur-xl text-white border border-white/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {message.sender === 'eve' && message.metadata && (
                      <div className="flex items-center space-x-1">
                        {message.metadata.ragUsed && (
                          <span className="text-xs bg-[#2AD368]/20 text-[#2AD368] px-2 py-0.5 rounded-full font-bold" title="IA avancée">
                            🧠
                          </span>
                        )}
                        {message.metadata.method === 'quick' && (
                          <span className="text-xs bg-[#CBED62]/20 text-[#CBED62] px-2 py-0.5 rounded-full font-bold" title="Rapide">
                            ⚡
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
                <div className="glass-card backdrop-blur-xl text-white border border-white/20 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#2AD368] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#2AD368] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#2AD368] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-[#121A21]/95 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question à EVE..."
                className="flex-1 px-4 py-3 glass-card backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2AD368] text-sm text-white placeholder-gray-400 transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-[#2AD368] hover:bg-[#1fc75c] disabled:bg-gray-600 text-[#121A21] p-3 rounded-xl transition-all shadow-lg hover:shadow-[0_8px_20px_rgba(42,211,104,0.4)] disabled:shadow-none"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotNew;
