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

  it('speak returns a blob response', async () => {
    const mockBlob = new Blob(['audio']);
    const blob = vi.fn().mockResolvedValue(mockBlob);
    vi.spyOn(apiConfig, 'apiFetch').mockResolvedValue({ blob } as unknown as Response);

    const result = await chatService.speak('bonjour');

    expect(result).toBe(mockBlob);
  });
});
