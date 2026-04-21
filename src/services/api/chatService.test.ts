import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chatService } from './chatService';
import * as apiConfig from './apiConfig';

describe('chatService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sendMessage returns nested data payload', async () => {
    const payload = {
      data: {
        conversationId: 'conv-1',
        userMessage: 'hi',
        eveResponse: 'hello',
        timestamp: '2026-01-01',
        context: { sensorData: null, plantCount: 0 },
        processing: {
          method: 'default',
          processingTime: 10,
          ragUsed: false,
          sources: [],
          cached: false,
          fallbackUsed: false,
        },
      },
    };
    const json = vi.fn().mockResolvedValue(payload);
    vi.spyOn(apiConfig, 'apiFetch').mockResolvedValue({ json } as unknown as Response);

    const result = await chatService.sendMessage('hi', 'conv-1', 'gh-1');

    expect(result.conversationId).toBe('conv-1');
    expect(result.eveResponse).toBe('hello');
  });

  it('getConversations uses limit and offset in query string', async () => {
    const json = vi.fn().mockResolvedValue({ success: true, data: [], pagination: {} });
    const apiFetchSpy = vi
      .spyOn(apiConfig, 'apiFetch')
      .mockResolvedValue({ json } as unknown as Response);

    await chatService.getConversations(5, 15);

    expect(apiFetchSpy).toHaveBeenCalledWith('/api/eve/conversations?limit=5&offset=15');
  });

  it('clearHistory sends delete request to rgpd endpoint', async () => {
    const json = vi.fn().mockResolvedValue({ success: true, message: 'ok', deletedCount: 4 });
    const apiFetchSpy = vi
      .spyOn(apiConfig, 'apiFetch')
      .mockResolvedValue({ json } as unknown as Response);

    await chatService.clearHistory('user-1');

    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/user-1', {
      method: 'DELETE',
    });
  });

  it('covers conversation and history helper endpoints', async () => {
    const json = vi.fn().mockResolvedValue({ success: true, data: [] });
    const blob = vi.fn().mockResolvedValue(new Blob(['history']));
    const apiFetchSpy = vi
      .spyOn(apiConfig, 'apiFetch')
      .mockResolvedValue({ json, blob } as unknown as Response);

    await chatService.getChatHistory('user-1');
    await chatService.deleteConversation('user-1', 'conv-9');
    await chatService.exportHistory('user-1');
    await chatService.syncHistory('user-1', [{ id: 'conv-1' }]);

    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/user-1');
    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/user-1/conversation/conv-9', {
      method: 'DELETE',
    });
    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/user-1/export');
    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/sync', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-1', conversations: [{ id: 'conv-1' }] }),
    });
  });

  it('speak returns a blob response', async () => {
    const mockBlob = new Blob(['audio']);
    const blob = vi.fn().mockResolvedValue(mockBlob);
    vi.spyOn(apiConfig, 'apiFetch').mockResolvedValue({ blob } as unknown as Response);

    const result = await chatService.speak('bonjour');

    expect(result).toBe(mockBlob);
  });

  it('covers remaining chat history endpoints', async () => {
    const json = vi.fn().mockResolvedValue({ success: true, conversations: [] });
    const blob = vi.fn().mockResolvedValue(new Blob(['export']));
    const apiFetchSpy = vi.spyOn(apiConfig, 'apiFetch');
    apiFetchSpy
      .mockResolvedValueOnce({ json } as unknown as Response)
      .mockResolvedValueOnce({ json } as unknown as Response)
      .mockResolvedValueOnce({ blob } as unknown as Response)
      .mockResolvedValueOnce({ json } as unknown as Response);

    await chatService.getChatHistory('u1');
    await chatService.deleteConversation('u1', 'c1');
    await chatService.exportHistory('u1');
    await chatService.syncHistory('u1', [{ id: 'c1' }]);

    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/u1');
    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/u1/conversation/c1', {
      method: 'DELETE',
    });
    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/u1/export');
    expect(apiFetchSpy).toHaveBeenCalledWith('/api/chat-history/sync', {
      method: 'POST',
      body: JSON.stringify({ userId: 'u1', conversations: [{ id: 'c1' }] }),
    });
  });
});
