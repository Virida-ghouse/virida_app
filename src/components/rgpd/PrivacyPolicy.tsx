import React from 'react';

const sections = [
  {
    icon: 'shield',
    title: '1. Responsable du Traitement',
    items: [
      'Virida est responsable de la collecte et du traitement de vos données personnelles.',
      'Contact : virida.ghouse@gmail.com',
      'Adresse : 24 rue Pasteur, 94270 Le Kremlin-Bicêtre (Epitech Paris)',
    ],
  },
  {
    icon: 'database',
    title: '2. Données collectées',
    subsections: [
      {
        subtitle: 'Données d\'identification (Art. 4 §1 RGPD)',
        items: ['Nom, prénom', 'Adresse e-mail', 'Identifiant unique'],
      },
      {
        subtitle: 'Données d\'usage (Art. 6 §4 RGPD)',
        items: ['Logs de connexion', 'Actions dans l\'application', 'Préférences utilisateur'],
      },
      {
        subtitle: 'Conversations avec Eve (IA)',
        items: [
          'Historique des conversations avec l\'assistant Eve',
          'Messages envoyés et réponses reçues',
          'Métadonnées (horodatage, méthode RAG utilisée)',
          'Stockage local et synchronisation serveur',
          'Vous pouvez exporter ou supprimer vos conversations à tout moment',
        ],
      },
      {
        subtitle: 'Données environnementales (non personnelles)',
        items: [
          'Humidité du sol, température, CO2, niveau d\'eau, pH, luminosité',
          'Ces données sont associées à votre compte mais ne deviennent personnelles que par association',
        ],
      },
    ],
  },
  {
    icon: 'description',
    title: '3. Base juridique (Art. 6 RGPD)',
    subsections: [
      {
        subtitle: 'Consentement (Art. 6 §1-a)',
        items: ['Collecte des données lors de l\'inscription', 'Popup de consentement explicite'],
      },
      {
        subtitle: 'Exécution du contrat (Art. 6 §1-b)',
        items: ['Fourniture du service Virida', 'Gestion de votre serre connectée'],
      },
      {
        subtitle: 'Intérêt légitime (Art. 6 §1-f)',
        items: ['Amélioration du service', 'Détection d\'anomalies'],
      },
    ],
  },
  {
    icon: 'lock',
    title: '4. Sécurité et protection (Art. 32 RGPD)',
    items: [
      'Hébergement en France (Clever Cloud, Nantes)',
      'Authentification sécurisée par JWT',
      'Mots de passe hashés (bcrypt)',
      'Communications chiffrées HTTPS',
      'Communication MQTT chiffrée (TLS 1.2+)',
    ],
  },
  {
    icon: 'visibility',
    title: '5. Vos droits (Art. 15-21 RGPD)',
    subsections: [
      {
        subtitle: 'Droits disponibles',
        items: [
          'Droit d\'accès (Art. 15) : consulter vos données',
          'Droit de rectification (Art. 16) : corriger vos données',
          'Droit à l\'effacement (Art. 17) : supprimer vos données',
          'Droit à la portabilité (Art. 20) : exporter vos données',
          'Droit d\'opposition (Art. 21) : refuser le traitement',
          'Droit de limitation (Art. 18) : limiter l\'utilisation',
        ],
      },
      {
        subtitle: 'Comment exercer vos droits ?',
        items: [
          'Par e-mail : virida.ghouse@gmail.com',
          'Depuis l\'application : Paramètres > Confidentialité',
          'Délai de réponse : maximum 30 jours (Art. 12 §3 RGPD)',
        ],
      },
    ],
  },
  {
    icon: 'schedule',
    title: '6. Conservation des données',
    items: [
      'Données de compte : durée du contrat + 3 ans',
      'Données de connexion : 1 an (conformité CNIL)',
      'Conversations avec Eve : durée du contrat (suppression possible à tout moment)',
      'Données environnementales : conservation illimitée (non personnelles)',
      'Consentement cookies : renouvellement tous les 13 mois (Art. 82 LIL)',
    ],
  },
  {
    icon: 'cookie',
    title: '7. Cookies et traceurs',
    subsections: [
      {
        subtitle: 'Types de cookies utilisés',
        items: [
          'Cookies essentiels : authentification, sécurité (toujours actifs)',
          'Cookies fonctionnels : préférences utilisateur (avec consentement)',
          'Cookies analytiques : statistiques d\'usage (avec consentement)',
          'Cookies marketing : non utilisés par Virida',
        ],
      },
      {
        subtitle: 'Gestion des cookies',
        items: [
          'Modifiable à tout moment depuis Paramètres > Confidentialité',
        ],
      },
    ],
  },
];

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-5 md:p-8 space-y-6">
      {/* Intro */}
      <div className="p-4 rounded-xl bg-[var(--bg-primary)] border-l-4 border-[#2AD368]">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Chez <strong className="text-[var(--text-primary)]">Virida</strong>, nous prenons la protection
          de vos données personnelles très au sérieux. Cette politique explique comment nous collectons,
          utilisons et protégeons vos informations conformément au RGPD et à la loi Informatique et Libertés.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#2AD368] text-xl">{section.icon}</span>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">{section.title}</h3>
          </div>

          {section.items && (
            <ul className="space-y-1.5 pl-8">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="material-symbols-outlined text-[#2AD368] text-sm mt-0.5 shrink-0">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.subsections && section.subsections.map((sub, k) => (
            <div key={k} className="pl-8 space-y-1.5">
              <p className="text-xs font-semibold text-[var(--text-primary)]">{sub.subtitle}</p>
              <ul className="space-y-1">
                {sub.items.map((item, l) => (
                  <li key={l} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                    <span className="material-symbols-outlined text-[#2AD368] text-sm mt-0.5 shrink-0">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="p-4 rounded-xl bg-[var(--bg-primary)] border-l-4 border-[#2AD368] space-y-2">
        <p className="text-xs font-bold text-[var(--text-primary)]">Contact et réclamations</p>
        <p className="text-xs text-[var(--text-secondary)]">
          Email : <a href="mailto:virida.ghouse@gmail.com" className="text-[#2AD368] hover:underline">virida.ghouse@gmail.com</a>
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#2AD368] hover:underline">www.cnil.fr</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
