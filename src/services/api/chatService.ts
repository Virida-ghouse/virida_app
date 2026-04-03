import { apiFetch } from './apiConfig';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponseData {
  conversationId: string;
  userMessage: string;
  eveResponse: string;
  timestamp: string;
  context: {
    sensorData: Record<string, any> | null;
    plantCount: number;
  };
  processing: {
    method: string;
    processingTime: number;
    ragUsed: boolean;
    sources: string[];
    cached: boolean;
    fallbackUsed: boolean;
  };
  tasksCreated?: any[];
}

class ChatService {
  /**
   * Envoyer un message à EVE
   */
  async sendMessage(
    message: string,
    conversationId?: string,
    greenhouseId?: string
  ): Promise<ChatResponseData> {
    const response = await apiFetch('/api/eve/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId, greenhouseId }),
    });
    const json = await response.json();
    return json.data;
  }

  /**
   * Récupérer les conversations EVE
   */
  async getConversations(limit = 20, offset = 0): Promise<{ success: boolean; data: any[]; pagination: any }> {
    const response = await apiFetch(
      `/api/eve/conversations?limit=${limit}&offset=${offset}`
    );
    return response.json();
  }

  /**
   * Récupérer l'historique de chat d'un utilisateur
   */
  async getChatHistory(userId: string): Promise<{ success: boolean; conversations: any[] }> {
    const response = await apiFetch(`/api/chat-history/${userId}`);
    return response.json();
  }

  /**
   * Supprimer tout l'historique d'un utilisateur (RGPD)
   */
  async clearHistory(userId: string): Promise<{ success: boolean; message: string; deletedCount: number }> {
    const response = await apiFetch(`/api/chat-history/${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  /**
   * Supprimer une conversation spécifique
   */
  async deleteConversation(userId: string, conversationId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiFetch(`/api/chat-history/${userId}/conversation/${conversationId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  /**
   * Exporter l'historique de chat (RGPD)
   */
  async exportHistory(userId: string): Promise<Blob> {
    const response = await apiFetch(`/api/chat-history/${userId}/export`);
    return response.blob();
  }

  /**
   * Synthèse vocale EVE (text-to-speech)
   */
  async speak(text: string): Promise<Blob> {
    const response = await apiFetch('/api/eve/speak', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.blob();
  }

  /**
   * Synchroniser les conversations depuis le frontend
   */
  async syncHistory(userId: string, conversations: any[]): Promise<{ success: boolean; message: string; syncedConversations: any }> {
    const response = await apiFetch('/api/chat-history/sync', {
      method: 'POST',
      body: JSON.stringify({ userId, conversations }),
    });
    return response.json();
  }
}

export const chatService = new ChatService();
