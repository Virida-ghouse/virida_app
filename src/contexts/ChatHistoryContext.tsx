import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
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

const getConversationTitle = (message: ChatMessage, existingTitle?: string): string => {
  return existingTitle ?? (message.sender === 'user' ? message.text.substring(0, 50) : 'Conversation sans titre');
};

const parseStoredConversations = (storedHistory: string): Conversation[] => {
  const parsed = JSON.parse(storedHistory);
  return parsed.map((conv: any) => ({
    ...conv,
    createdAt: new Date(conv.createdAt),
    updatedAt: new Date(conv.updatedAt),
    messages: conv.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  }));
};

const buildConversationExport = (conv: Conversation) => ({
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
});

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
          const conversations = parseStoredConversations(storedHistory);

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
        await chatService.syncHistory(user.id, conversations);
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
  const startNewConversation = useCallback((): string => {
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
  }, []);

  const createConversationWithFirstMessage = useCallback((message: ChatMessage): Conversation => {
    return {
      id: `conv_${Date.now()}`,
      messages: [message],
      createdAt: new Date(),
      updatedAt: new Date(),
      title: message.sender === 'user' ? message.text.substring(0, 50) : undefined,
    };
  }, []);

  const appendMessageToConversation = useCallback((conversation: Conversation, message: ChatMessage): Conversation => {
    return {
      ...conversation,
      messages: [...conversation.messages, message],
      updatedAt: new Date(),
      title: getConversationTitle(message, conversation.title),
    };
  }, []);

  // ➕ Ajouter un message à la conversation courante
  const addMessage = useCallback((message: ChatMessage) => {
    if (!currentConversation) {
      const convId = startNewConversation();
      const newConv = {
        ...createConversationWithFirstMessage(message),
        id: convId,
      };
      setConversations(prev => {
        const filtered = prev.filter(conv => conv.id !== convId);
        return [...filtered, newConv];
      });
      setCurrentConversation(newConv);
      console.log('➕ Message ajouté à la conversation:', message.sender, message.text.substring(0, 30));
      return;
    }

    const currentId = currentConversation.id;
    setConversations(prev => prev.map(conv => (
      conv.id === currentId ? appendMessageToConversation(conv, message) : conv
    )));

    setCurrentConversation(prev => {
      if (!prev || prev.id !== currentId) return prev;
      return appendMessageToConversation(prev, message);
    });

    console.log('➕ Message ajouté à la conversation:', message.sender, message.text.substring(0, 30));
  }, [appendMessageToConversation, createConversationWithFirstMessage, currentConversation, startNewConversation]);

  // 📖 Récupérer une conversation par ID
  const getConversation = useCallback((conversationId: string): Conversation | undefined => {
    return conversations.find(c => c.id === conversationId);
  }, [conversations]);

  // 🗑️ Supprimer une conversation (RGPD - Droit à l'effacement)
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }

    console.log('🗑️ Conversation supprimée:', conversationId);
  }, [currentConversation?.id]);

  // 🧹 Effacer tout l'historique (RGPD - Droit à l'effacement)
  const clearAllHistory = useCallback(() => {
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
  }, [user]);

  // 📊 Statistiques
  const getTotalMessages = useCallback((): number => {
    return conversations.reduce((total, conv) => total + conv.messages.length, 0);
  }, [conversations]);

  const getConversationCount = useCallback((): number => {
    return conversations.length;
  }, [conversations]);

  // 📥 Exporter l'historique (RGPD - Droit à la portabilité)
  const exportHistory = useCallback(() => {
    const exportData = {
      userId: user?.id,
      exportDate: new Date().toISOString(),
      conversationsCount: conversations.length,
      totalMessages: getTotalMessages(),
      conversations: conversations.map(buildConversationExport),
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
  }, [conversations, getTotalMessages, user?.id]);

  const value: ChatHistoryContextType = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
};
