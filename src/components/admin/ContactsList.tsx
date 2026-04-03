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
      setContacts(data.data || data.contacts || []);
      const pag = data.pagination;
      setPagination({
        total: pag?.total || 0,
        page: pag?.page || 1,
        limit: pag?.limit || 10,
        totalPages: pag?.pages || pag?.totalPages || 0,
      });
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
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Obtenir une démo':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Partenariat':
        return 'bg-[#2AD368]/20 text-[#2AD368] border-[#2AD368]/30';
      case 'Investissement':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Barre filtres + stats */}
      <div className="glass-card rounded-2xl p-4 md:p-5 border border-[var(--border-color)]">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-[#2AD368]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">contacts</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Prises de contact
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {pagination.total} contact{pagination.total > 1 ? 's' : ''} au total
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={filterInterest}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none text-sm"
            >
              <option value="">Tous les types</option>
              <option value="Participer à la beta">Beta</option>
              <option value="Obtenir une démo">Démo</option>
              <option value="Partenariat">Partenariat</option>
              <option value="Investissement">Investissement</option>
              <option value="Autre">Autre</option>
            </select>

            <button
              onClick={() => fetchContacts(pagination.page, filterInterest)}
              className="size-9 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#2AD368] hover:text-[#2AD368] transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="glass-card rounded-2xl p-12 border border-[var(--border-color)] text-center">
          <div className="animate-spin inline-block">
            <span className="material-symbols-outlined text-4xl text-[#2AD368]">progress_activity</span>
          </div>
          <p className="text-[var(--text-secondary)] mt-4">Chargement...</p>
        </div>
      ) : error ? (
        <div className="glass-card rounded-2xl p-12 border border-red-500/30 bg-red-500/5 text-center">
          <span className="material-symbols-outlined text-4xl text-red-400">error</span>
          <p className="text-red-400 mt-4 font-semibold">{error}</p>
          <button
            onClick={() => fetchContacts(1, filterInterest)}
            className="mt-4 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-sm font-semibold"
          >
            Réessayer
          </button>
        </div>
      ) : contacts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-[var(--border-color)] text-center">
          <span className="material-symbols-outlined text-5xl text-[var(--text-secondary)]/30">inbox</span>
          <p className="text-[var(--text-secondary)] mt-4 font-semibold">Aucun contact pour le moment</p>
          <p className="text-[var(--text-secondary)]/60 text-sm mt-1">Les soumissions du formulaire de contact apparaîtront ici</p>
        </div>
      ) : (
        <>
          {/* Liste */}
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="glass-card rounded-2xl p-4 md:p-5 border border-[var(--border-color)] hover:border-[#2AD368]/30 transition-all cursor-pointer group"
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[#2AD368] transition-colors">
                        {contact.fullName}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getInterestBadgeColor(contact.interest)}`}>
                        {contact.interest}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
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
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                    {contact.message && (
                      <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-1">
                        {contact.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact.id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="glass-card rounded-2xl p-3 border border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#2AD368] transition-colors text-sm"
                >
                  Précédent
                </button>

                <span className="text-xs text-[var(--text-secondary)]">
                  Page {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#2AD368] transition-colors text-sm"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal détails contact */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9000] flex items-center justify-center p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="glass-card rounded-3xl border-2 border-[var(--border-color)] max-w-lg w-full max-h-[80vh] overflow-y-auto custom-scrollbar shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-[var(--text-primary)]">
                  {selectedContact.fullName}
                </h3>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getInterestBadgeColor(selectedContact.interest)}`}>
                  {selectedContact.interest}
                </span>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] transition-colors text-[var(--text-secondary)]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)]">
                <span className="material-symbols-outlined text-[var(--text-secondary)]">mail</span>
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Email</p>
                  <a href={`mailto:${selectedContact.email}`} className="text-sm text-[#2AD368] hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              {selectedContact.company && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)]">
                  <span className="material-symbols-outlined text-[var(--text-secondary)]">business</span>
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Entreprise</p>
                    <p className="text-sm text-[var(--text-primary)]">{selectedContact.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)]">
                <span className="material-symbols-outlined text-[var(--text-secondary)]">schedule</span>
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Date</p>
                  <p className="text-sm text-[var(--text-primary)]">
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

              {selectedContact.message && (
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold mb-2">Message</p>
                  <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-2">
              <button
                onClick={() => handleDelete(selectedContact.id)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-semibold hover:bg-red-500/20 transition-all text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
                Supprimer
              </button>
              <button
                onClick={() => setSelectedContact(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:border-[#2AD368] transition-all text-sm"
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
