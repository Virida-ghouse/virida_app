import React, { useState } from 'react';
import ContactsList from './ContactsList';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts'>('contacts');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-2">
            Administration
          </h1>
          <p className="text-[var(--text-secondary)]">
            Gérez les données de la plateforme Virida
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card rounded-2xl p-2 mb-6 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`
              px-6 py-3 rounded-xl font-bold text-sm transition-all
              ${activeTab === 'contacts'
                ? 'bg-[#2AD368] text-white shadow-lg'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">mail</span>
              Contacts
            </span>
          </button>
          
          {/* Futurs onglets */}
          <button
            disabled
            className="px-6 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)]/40 cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">settings</span>
              Paramètres (bientôt)
            </span>
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'contacts' && <ContactsList />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
