import { beforeEach, describe, expect, it, vi } from 'vitest';
import { contactService } from './contactService';
import * as apiConfig from './apiConfig';

describe('contactService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submits contact payload with POST', async () => {
    const json = vi.fn().mockResolvedValue({ success: true, id: 'c1' });
    const apiFetchSpy = vi
      .spyOn(apiConfig, 'apiFetch')
      .mockResolvedValue({ json } as unknown as Response);

    const result = await contactService.submitContact({
      fullName: 'John Doe',
      email: 'john@example.com',
      interest: 'demo',
      message: 'hello',
    });

    expect(apiFetchSpy).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'John Doe',
        email: 'john@example.com',
        interest: 'demo',
        message: 'hello',
      }),
    });
    expect(result).toEqual({ success: true, id: 'c1' });
  });

  it('builds contacts query params including optional interest', async () => {
    const json = vi.fn().mockResolvedValue({ data: [], pagination: { total: 0, page: 2, limit: 25 } });
    const apiFetchSpy = vi
      .spyOn(apiConfig, 'apiFetch')
      .mockResolvedValue({ json } as unknown as Response);

    await contactService.getContacts(2, 25, 'automation');

    expect(apiFetchSpy).toHaveBeenCalledWith('/api/contact?page=2&limit=25&interest=automation');
  });

  it('deletes a contact with DELETE method', async () => {
    const apiFetchSpy = vi
      .spyOn(apiConfig, 'apiFetch')
      .mockResolvedValue({} as Response);

    await contactService.deleteContact('contact-42');

    expect(apiFetchSpy).toHaveBeenCalledWith('/api/contact/contact-42', {
      method: 'DELETE',
    });
  });
});
