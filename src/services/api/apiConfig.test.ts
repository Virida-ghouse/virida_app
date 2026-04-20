import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, getAuthHeaders, handleApiError } from './apiConfig';

describe('apiConfig helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('returns base headers when no token exists', () => {
    const headers = getAuthHeaders() as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers.Authorization).toBeUndefined();
  });

  it('adds Authorization header when token exists', () => {
    localStorage.setItem('virida_token', 'token-123');
    const headers = getAuthHeaders() as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer token-123');
  });

  it('throws normalized error when response is not ok', async () => {
    const response = {
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue({ error: 'Invalid payload' }),
    } as unknown as Response;

    await expect(handleApiError(response)).rejects.toEqual({
      status: 422,
      data: { error: 'Invalid payload' },
    });
  });

  it('uses fallback error message when json parsing fails', async () => {
    const response = {
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('bad json')),
    } as unknown as Response;

    await expect(handleApiError(response)).rejects.toEqual({
      status: 500,
      data: { error: 'Erreur HTTP 500' },
    });
  });

  it('calls fetch with merged options and returns successful response', async () => {
    const mockedResponse = {
      ok: true,
      status: 200,
      json: vi.fn(),
    } as unknown as Response;

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockedResponse);

    const response = await apiFetch('/api/contact', { method: 'GET' });

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3001/api/contact',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
    expect(response).toBe(mockedResponse);
  });
});
