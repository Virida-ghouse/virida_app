import React, { useEffect } from 'react';

interface MentionsLegalesProps {
  onBack: () => void;
}

const MentionsLegales: React.FC<MentionsLegalesProps> = ({ onBack }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#2AD368] transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Retour
        </button>

        <h1 className="text-3xl md:text-4xl font-black mb-2">Mentions légales</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-10">Dernière mise à jour : 27 mars 2026</p>

        <div className="space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">1. Éditeur du site</h2>
            <p>
              Le site <strong className="text-[var(--text-primary)]">virida.org</strong> est édité dans le cadre
              d'un projet étudiant réalisé à Epitech Paris.
            </p>
            <ul className="mt-3 space-y-1">
              <li><strong className="text-[var(--text-primary)]">Projet :</strong> Virida</li>
              <li><strong className="text-[var(--text-primary)]">Établissement :</strong> Epitech Paris</li>
              <li><strong className="text-[var(--text-primary)]">Adresse :</strong> 24 rue Pasteur, 94270 Le Kremlin-Bicêtre, France</li>
              <li><strong className="text-[var(--text-primary)]">Email :</strong> <a href="mailto:virida.ghouse@gmail.com" className="text-[#2AD368] hover:underline">virida.ghouse@gmail.com</a></li>
              <li><strong className="text-[var(--text-primary)]">Responsable de publication :</strong> Setayesh (cheffe de projet)</li>
            </ul>
            <p className="mt-3">
              Virida est un projet étudiant sans structure juridique (pas de SIRET, pas de société).
              Il ne constitue pas une activité commerciale.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">2. Hébergement</h2>
            <ul className="space-y-1">
              <li><strong className="text-[var(--text-primary)]">Hébergeur :</strong> Clever Cloud SAS</li>
              <li><strong className="text-[var(--text-primary)]">Adresse :</strong> 3 rue de l'Allier, 44000 Nantes, France</li>
              <li><strong className="text-[var(--text-primary)]">Site :</strong> <a href="https://www.clever-cloud.com" target="_blank" rel="noopener noreferrer" className="text-[#2AD368] hover:underline">www.clever-cloud.com</a></li>
            </ul>
            <p className="mt-3">Les données sont hébergées en France.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">3. Propriété intellectuelle</h2>
            <p>
              Le code source de Virida est open source. Les contenus du site (textes, images, logo)
              sont la propriété de l'équipe Virida sauf mention contraire. Le logo EVE et le logo
              Virida sont des créations originales du projet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">4. Données personnelles</h2>
            <p>
              Les données collectées via le formulaire de contact (nom, email, entreprise, message)
              sont utilisées uniquement pour répondre aux demandes des utilisateurs. Elles ne sont
              ni vendues ni partagées avec des tiers.
            </p>
            <p className="mt-2">
              Pour plus d'informations, consultez notre{' '}
              <a href="/confidentialite" className="text-[#2AD368] hover:underline">politique de confidentialité</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">5. Cookies</h2>
            <p>
              Le site utilise uniquement des cookies essentiels au fonctionnement de l'application
              (authentification, préférences de thème, consentement cookies). Aucun cookie de
              tracking ou publicitaire n'est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">6. Limitation de responsabilité</h2>
            <p>
              Virida est un projet étudiant fourni en l'état, sans garantie d'aucune sorte.
              L'équipe Virida ne saurait être tenue responsable des dommages directs ou indirects
              liés à l'utilisation du site ou de l'application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">7. Contact</h2>
            <p>
              Pour toute question concernant ces mentions légales :{' '}
              <a href="mailto:virida.ghouse@gmail.com" className="text-[#2AD368] hover:underline">virida.ghouse@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
