import React, { useEffect } from 'react';

interface PolitiqueConfidentialiteProps {
  onBack: () => void;
}

const PolitiqueConfidentialite: React.FC<PolitiqueConfidentialiteProps> = ({ onBack }) => {
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

        <h1 className="text-3xl md:text-4xl font-black mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-10">Dernière mise à jour : 27 mars 2026</p>

        <div className="space-y-8 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est l'équipe du projet Virida,
              projet étudiant réalisé à Epitech Paris.
            </p>
            <ul className="mt-3 space-y-1">
              <li><strong className="text-[var(--text-primary)]">Email :</strong> <a href="mailto:virida.ghouse@gmail.com" className="text-[#2AD368] hover:underline">virida.ghouse@gmail.com</a></li>
              <li><strong className="text-[var(--text-primary)]">Adresse :</strong> 24 rue Pasteur, 94270 Le Kremlin-Bicêtre, France</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">2. Données collectées</h2>

            <h3 className="font-semibold text-[var(--text-primary)] mt-4 mb-2">a) Formulaire de contact (landing page)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nom complet</li>
              <li>Adresse email</li>
              <li>Entreprise / organisation (optionnel)</li>
              <li>Type d'intérêt</li>
              <li>Message (optionnel)</li>
            </ul>
            <p className="mt-2"><strong className="text-[var(--text-primary)]">Finalité :</strong> répondre à votre demande de contact.</p>
            <p><strong className="text-[var(--text-primary)]">Base légale :</strong> consentement (Art. 6.1.a RGPD).</p>
            <p><strong className="text-[var(--text-primary)]">Conservation :</strong> 12 mois maximum après le dernier contact.</p>

            <h3 className="font-semibold text-[var(--text-primary)] mt-4 mb-2">b) Création de compte (dashboard)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prénom et nom</li>
              <li>Adresse email</li>
              <li>Mot de passe (hashé, jamais stocké en clair)</li>
            </ul>
            <p className="mt-2"><strong className="text-[var(--text-primary)]">Finalité :</strong> accéder aux fonctionnalités du dashboard Virida.</p>
            <p><strong className="text-[var(--text-primary)]">Base légale :</strong> exécution d'un contrat (Art. 6.1.b RGPD).</p>

            <h3 className="font-semibold text-[var(--text-primary)] mt-4 mb-2">c) Données de la serre (utilisateurs connectés)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Données des capteurs (température, humidité, pH, luminosité, niveaux d'eau)</li>
              <li>Photos des plantes (via caméra de la serre)</li>
              <li>Historique des conversations avec EVE</li>
              <li>Historique des soins et récoltes</li>
            </ul>
            <p className="mt-2"><strong className="text-[var(--text-primary)]">Finalité :</strong> fonctionnement de l'application et recommandations IA.</p>
            <p><strong className="text-[var(--text-primary)]">Base légale :</strong> exécution d'un contrat (Art. 6.1.b RGPD).</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">3. Cookies</h2>
            <p>Le site utilise uniquement des cookies essentiels :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-[var(--text-primary)]">Authentification :</strong> token JWT pour maintenir la session</li>
              <li><strong className="text-[var(--text-primary)]">Préférences :</strong> thème (clair/sombre), consentement cookies</li>
              <li><strong className="text-[var(--text-primary)]">Fonctionnel :</strong> historique de chat EVE (localStorage)</li>
            </ul>
            <p className="mt-3">
              Aucun cookie de tracking, publicitaire ou analytique n'est utilisé.
              Nous pourrons intégrer un outil d'analyse de fréquentation à l'avenir,
              auquel cas cette politique sera mise à jour et votre consentement sera requis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">4. Hébergement et sécurité</h2>
            <p>
              Vos données sont hébergées en France chez <strong className="text-[var(--text-primary)]">Clever Cloud</strong> (Nantes, France).
              Les mots de passe sont hashés avec bcrypt. Les communications sont chiffrées via HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">5. Partage des données</h2>
            <p>
              Vos données ne sont ni vendues, ni louées, ni partagées avec des tiers.
              L'IA EVE fonctionne en local (modèle Qwen) — vos données de serre ne
              transitent pas par des services tiers d'intelligence artificielle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">6. Vos droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-[var(--text-primary)]">Accès :</strong> obtenir une copie de vos données</li>
              <li><strong className="text-[var(--text-primary)]">Rectification :</strong> corriger vos données inexactes</li>
              <li><strong className="text-[var(--text-primary)]">Suppression :</strong> demander l'effacement de vos données</li>
              <li><strong className="text-[var(--text-primary)]">Portabilité :</strong> récupérer vos données dans un format standard</li>
              <li><strong className="text-[var(--text-primary)]">Opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong className="text-[var(--text-primary)]">Retrait du consentement :</strong> retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-3">
              Vous pouvez exercer ces droits directement depuis les paramètres de l'application
              (onglet Confidentialité) ou en écrivant à{' '}
              <a href="mailto:virida.ghouse@gmail.com" className="text-[#2AD368] hover:underline">virida.ghouse@gmail.com</a>.
            </p>
            <p className="mt-2">
              Vous avez également le droit d'introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#2AD368] hover:underline">CNIL</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">7. Modifications</h2>
            <p>
              Cette politique peut être modifiée à tout moment. En cas de changement significatif,
              les utilisateurs connectés seront informés via le dashboard. La date de dernière
              mise à jour est indiquée en haut de cette page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
