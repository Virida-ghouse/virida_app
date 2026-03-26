import { apiFetch } from './apiConfig';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

class ChatService {
  /**
   * Envoyer un message au chatbot
   */
  async sendMessage(message: string, context?: any): Promise<ChatResponse> {
    const response = await apiFetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
      }),
    });
    return response.json();
  }

  /**
   * Récupérer l'historique des conversations
   */
  async getChatHistory(): Promise<ChatMessage[]> {
    const response = await apiFetch('/api/chat/history');
    return response.json();
  }

  /**
   * Supprimer l'historique
   */
  async clearHistory(): Promise<void> {
    await apiFetch('/api/chat/history', {
      method: 'DELETE',
    });
  }

  /**
   * Obtenir des suggestions basées sur le contexte
   */
  async getSuggestions(context: any): Promise<string[]> {
    const response = await apiFetch('/api/chat/suggestions', {
      method: 'POST',
      body: JSON.stringify(context),
    });
    return response.json();
  }
}

export const chatService = new ChatService();
