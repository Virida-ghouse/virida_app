import { apiFetch } from './apiConfig';

export interface ContactFormData {
  fullName: string;
  email: string;
  company?: string;
  interest: string;
  message?: string;
}

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  interest: string;
  message?: string;
  createdAt: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContactSubmitResponse {
  success: boolean;
  id: string;
}

export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

class ContactService {
  /**
   * Soumettre un nouveau contact (formulaire public)
   */
  async submitContact(data: ContactFormData): Promise<ContactSubmitResponse> {
    const response = await apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Récupérer la liste des contacts (ADMIN uniquement)
   */
  async getContacts(page: number = 1, limit: number = 10, interest?: string): Promise<ContactsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(interest && { interest })
    });

    const response = await apiFetch(`/api/contact?${params}`);
    return response.json();
  }

  /**
   * Supprimer un contact (ADMIN uniquement)
   */
  async deleteContact(id: string): Promise<void> {
    await apiFetch(`/api/contact/${id}`, {
      method: 'DELETE',
    });
  }
}

export const contactService = new ContactService();
