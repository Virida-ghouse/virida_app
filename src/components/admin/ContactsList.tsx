import React, { useState, useEffect } from 'react';
import { contactService, Contact } from '../../services/api/contactService';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterInterest, setFilterInterest] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async (page: number = 1, interest: string = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await contactService.getContacts(page, pagination.limit, interest);
      setContacts(data.contacts || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      return;
    }

    try {
      await contactService.deleteContact(id);
      fetchContacts(pagination.page, filterInterest);
      setSelectedContact(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    fetchContacts(pagination.page, filterInterest);
  }, []);

  const handleFilterChange = (interest: string) => {
    setFilterInterest(interest);
    fetchContacts(1, interest);
  };

  const handlePageChange = (newPage: number) => {
    fetchContacts(newPage, filterInterest);
  };

  const getInterestBadgeColor = (interest: string) => {
    switch (interest) {
      case 'Participer à la beta':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'Obtenir une démo':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'Partenariat':
        return 'bg-[#2AD368]/20 text-[#2AD368] border-[#2AD368]/50';
      case 'Investissement':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres et stats */}
      <div className="glass-card rounded-2xl p-6 border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
              Prises de contact
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {pagination.total} contact{pagination.total > 1 ? 's' : ''} au total
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={filterInterest}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none text-sm"
            >
              <option value="">Tous les types</option>
              <option value="Participer à la beta">Participer à la beta</option>
              <option value="Obtenir une démo">Obtenir une démo</option>
              <option value="Partenariat">Partenariat</option>
              <option value="Investissement">Investissement</option>
              <option value="Autre">Autre</option>
            </select>

            <button
              onClick={() => fetchContacts(pagination.page, filterInterest)}
              className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#2AD368] transition-colors"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des contacts */}
      {isLoading ? (
        <div className="glass-card rounded-2xl p-12 border border-[var(--border-color)] text-center">
          <span className="material-symbols-outlined text-4xl text-[#2AD368] animate-spin">progress_activity</span>
          <p className="text-[var(--text-secondary)] mt-4">Chargement...</p>
        </div>
      ) : error ? (
        <div className="glass-card rounded-2xl p-12 border border-red-500/50 bg-red-500/10 text-center">
          <span className="material-symbols-outlined text-4xl text-red-500">error</span>
          <p className="text-red-500 mt-4 font-bold">{error}</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-[var(--border-color)] text-center">
          <span className="material-symbols-outlined text-4xl text-[var(--text-secondary)]">inbox</span>
          <p className="text-[var(--text-secondary)] mt-4">Aucun contact pour le moment</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="glass-card rounded-2xl p-6 border border-[var(--border-color)] hover:border-[#2AD368]/40 transition-all cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-[var(--text-primary)]">
                        {contact.fullName}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getInterestBadgeColor(contact.interest)}`}>
                        {contact.interest}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        {contact.email}
                      </span>
                      {contact.company && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">business</span>
                          {contact.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {contact.message && (
                      <p className="mt-3 text-sm text-[var(--text-secondary)] line-clamp-2">
                        {contact.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact.id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="glass-card rounded-2xl p-4 border border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#2AD368] transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <span className="text-sm text-[var(--text-secondary)]">
                  Page {pagination.page} sur {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#2AD368] transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal détails contact */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="glass-card rounded-3xl p-8 border-2 border-[var(--border-color)] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-[var(--text-primary)]">
                Détails du contact
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Nom</label>
                <p className="text-lg font-bold text-[var(--text-primary)]">{selectedContact.fullName}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Email</label>
                <p className="text-lg text-[var(--text-primary)]">{selectedContact.email}</p>
              </div>

              {selectedContact.company && (
                <div>
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Entreprise</label>
                  <p className="text-lg text-[var(--text-primary)]">{selectedContact.company}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Intérêt</label>
                <p className="text-lg text-[var(--text-primary)]">{selectedContact.interest}</p>
              </div>

              {selectedContact.message && (
                <div>
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Message</label>
                  <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Date de soumission</label>
                <p className="text-lg text-[var(--text-primary)]">
                  {new Date(selectedContact.createdAt).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => handleDelete(selectedContact.id)}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">delete</span>
                  Supprimer
                </span>
              </button>
              <button
                onClick={() => setSelectedContact(null)}
                className="flex-1 px-6 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold hover:border-[#2AD368] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
