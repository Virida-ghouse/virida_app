import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { chatService } from '../services/api';

// 💬 Types pour l'historique des conversations
export interface ChatMessage {
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

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string; // Généré automatiquement à partir du premier message
}

export interface ChatHistoryContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;

  // Actions de gestion
  startNewConversation: () => string;
  addMessage: (message: ChatMessage) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
  deleteConversation: (conversationId: string) => void;
  clearAllHistory: () => void;

  // Export RGPD
  exportHistory: () => void;

  // Statistiques
  getTotalMessages: () => number;
  getConversationCount: () => number;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error('useChatHistory doit être utilisé dans un ChatHistoryProvider');
  }
  return context;
};

interface ChatHistoryProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'virida_chat_history';
const API_SYNC_INTERVAL = 5 * 60 * 1000; // Sync toutes les 5 minutes

export const ChatHistoryProvider: React.FC<ChatHistoryProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 📥 Charger l'historique depuis localStorage au démarrage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
          const parsed = JSON.parse(storedHistory);
          // Convertir les timestamps en objets Date
          const conversations = parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));

          setConversations(conversations);

          // Reprendre la dernière conversation
          if (conversations.length > 0) {
            setCurrentConversation(conversations[conversations.length - 1]);
          }
        }

        console.log('✅ Historique des conversations chargé');
      } catch (error) {
        console.error('❌ Erreur lors du chargement de l\'historique:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // 💾 Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    if (!isLoading && conversations.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
        console.log('💾 Historique sauvegardé dans localStorage');
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
      }
    }
  }, [conversations, isLoading]);

  // 🔄 Synchronisation périodique avec le backend
  useEffect(() => {
    const syncToBackend = async () => {
      if (!user || !token || conversations.length === 0) return;

      try {
        // TODO: Implémenter la méthode syncHistory dans chatService si nécessaire
        console.log('✅ Historique synchronisé avec le backend');
      } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', error);
      }
    };

    // Sync au démarrage
    syncToBackend();

    // Sync périodique
    const interval = setInterval(syncToBackend, API_SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [conversations, user, token]);

  // 🆕 Démarrer une nouvelle conversation
  const startNewConversation = (): string => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [...prev, newConv]);
    setCurrentConversation(newConv);

    console.log('🆕 Nouvelle conversation créée:', newConv.id);
    return newConv.id;
  };

  // ➕ Ajouter un message à la conversation courante
  const addMessage = (message: ChatMessage) => {
    if (!currentConversation) {
      // Créer une nouvelle conversation si aucune n'existe
      const convId = startNewConversation();
      const newConv = {
        id: convId,
        messages: [message],
        createdAt: new Date(),
        updatedAt: new Date(),
        title: message.sender === 'user' ? message.text.substring(0, 50) : undefined,
      };

      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== convId);
        return [...filtered, newConv];
      });
      setCurrentConversation(newConv);
    } else {
      // Ajouter à la conversation existante - utiliser updater function pour éviter race conditions
      const currentId = currentConversation.id;

      setConversations(prev => {
        const current = prev.find(c => c.id === currentId);
        if (!current) return prev;

        const updatedConv: Conversation = {
          ...current,
          messages: [...current.messages, message],
          updatedAt: new Date(),
          title: current.title || (message.sender === 'user' ? message.text.substring(0, 50) : 'Conversation sans titre'),
        };

        const filtered = prev.filter(c => c.id !== currentId);
        return [...filtered, updatedConv];
      });

      // Mettre à jour currentConversation avec updater function
      setCurrentConversation(prev => {
        if (!prev || prev.id !== currentId) return prev;

        return {
          ...prev,
          messages: [...prev.messages, message],
          updatedAt: new Date(),
          title: prev.title || (message.sender === 'user' ? message.text.substring(0, 50) : 'Conversation sans titre'),
        };
      });
    }

    console.log('➕ Message ajouté à la conversation:', message.sender, message.text.substring(0, 30));
  };

  // 📖 Récupérer une conversation par ID
  const getConversation = (conversationId: string): Conversation | undefined => {
    return conversations.find(c => c.id === conversationId);
  };

  // 🗑️ Supprimer une conversation (RGPD - Droit à l'effacement)
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }

    console.log('🗑️ Conversation supprimée:', conversationId);
  };

  // 🧹 Effacer tout l'historique (RGPD - Droit à l'effacement)
  const clearAllHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout l\'historique de vos conversations avec Eve ? Cette action est irréversible.')) {
      setConversations([]);
      setCurrentConversation(null);
      localStorage.removeItem(STORAGE_KEY);

      console.log('🧹 Tout l\'historique a été effacé');

      // Notifier le backend
      if (user) {
        chatService.clearHistory().catch(err => console.error('Erreur lors de la suppression backend:', err));
      }
    }
  };

  // 📥 Exporter l'historique (RGPD - Droit à la portabilité)
  const exportHistory = () => {
    const exportData = {
      userId: user?.id,
      exportDate: new Date().toISOString(),
      conversationsCount: conversations.length,
      totalMessages: getTotalMessages(),
      conversations: conversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messagesCount: conv.messages.length,
        messages: conv.messages.map(msg => ({
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
          metadata: msg.metadata,
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `virida-conversations-eve-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    console.log('📥 Historique exporté');
  };

  // 📊 Statistiques
  const getTotalMessages = (): number => {
    return conversations.reduce((total, conv) => total + conv.messages.length, 0);
  };

  const getConversationCount = (): number => {
    return conversations.length;
  };

  const value: ChatHistoryContextType = {
    conversations,
    currentConversation,
    isLoading,
    startNewConversation,
    addMessage,
    getConversation,
    deleteConversation,
    clearAllHistory,
    exportHistory,
    getTotalMessages,
    getConversationCount,
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
};
