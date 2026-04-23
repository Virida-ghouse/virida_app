export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** ID DOM de l'élément à mettre en évidence */
  targetId?: string;
  /** Vue à activer automatiquement lors de cette étape */
  viewNavigate?: string;
  /** Onglet à activer automatiquement dans PlantsLayout (0-3) */
  tabNavigate?: number;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    emoji: '🐝',
    title: 'Bienvenue dans Virida !',
    description:
      "Salut ! Je suis Eve, ton assistante jardinage. Je vais t'aider à prendre soin de ta serre connectée. Laisse-moi te faire visiter !",
  },
  {
    id: 'dashboard',
    emoji: '📊',
    title: 'Tableau de bord',
    description:
      "C'est ici que tout se passe ! Le Dashboard regroupe toutes les données de ta serre en temps réel. Un seul coup d'œil et tu sais tout !",
    targetId: 'onboarding-dashboard',
  },
  {
    id: 'dashboard-sensors',
    emoji: '🌡️',
    title: 'Capteurs en temps réel',
    description:
      "Température, humidité, pH et luminosité s'affichent ici en direct. Les couleurs changent si une valeur sort de la normale — réagis vite !",
    targetId: 'onboarding-sensors-grid',
  },
  {
    id: 'dashboard-3d',
    emoji: '🏗️',
    title: 'Serre en 3D',
    description:
      "Cette visualisation 3D interactive te montre ta serre en temps réel. Tourne, zoom, explore — chaque capteur est positionné à son emplacement physique !",
    targetId: 'onboarding-3d-view',
  },
  {
    id: 'plants',
    emoji: '🌱',
    title: 'Mes Plantes',
    description:
      "Clique sur 'Crops' dans le menu pour explorer tes cultures ! Tu peux y suivre chaque plante individuellement, planifier les soins et observer leur croissance.",
    targetId: 'onboarding-plants',
  },
  {
    id: 'plants-mon-jardin',
    emoji: '🪴',
    title: 'Mon Jardin',
    description:
      "Voici tes cultures en cartes ! Chaque carte affiche la santé, le stade et les derniers soins. Clique sur une plante pour ouvrir sa fiche détaillée.",
    targetId: 'onboarding-plants-grid',
    viewNavigate: 'plants',
    tabNavigate: 0,
  },
  {
    id: 'plants-bibliotheque',
    emoji: '📚',
    title: 'Bibliothèque de plantes',
    description:
      "Clique sur l'onglet 'Bibliothèque' 👆 pour explorer le catalogue complet : fiches techniques, pH idéal, température, besoins en eau pour chaque espèce.",
    targetId: 'onboarding-plants-tab-library',
    viewNavigate: 'plants',
    tabNavigate: 1,
  },
  {
    id: 'plants-soins',
    emoji: '💊',
    title: 'Soins & Rappels',
    description:
      "Clique sur 'Soins' 👆 — tous tes rappels du jour sont ici : arrosage, taille, fertilisation. Tu peux créer des tâches récurrentes pour ne jamais oublier !",
    targetId: 'onboarding-plants-tab-care',
    viewNavigate: 'plants',
    tabNavigate: 2,
  },
  {
    id: 'plants-calendrier',
    emoji: '📅',
    title: 'Calendrier',
    description:
      "Clique sur 'Calendrier' 👆 pour une vue mensuelle de toutes tes interventions planifiées. Parfait pour anticiper la charge de travail !",
    targetId: 'onboarding-plants-tab-calendar',
    viewNavigate: 'plants',
    tabNavigate: 3,
  },
  {
    id: 'plants-detail',
    emoji: '🔍',
    title: 'Fiche détaillée',
    description:
      "Reviens sur 'Mon Jardin' et clique sur une plante ! Sa fiche s'ouvre avec 4 onglets : Vue d'ensemble, Soins, Historique de croissance, et Récoltes 🌾",
    targetId: 'onboarding-plants-tab-garden',
    viewNavigate: 'plants',
    tabNavigate: 0,
  },
  {
    id: 'automation',
    emoji: '⚡',
    title: 'Automatisation',
    description:
      "Crée des règles intelligentes : si le pH descend sous 5.5, l'ajustement se déclenche automatiquement. Ta serre se gère toute seule !",
    targetId: 'onboarding-automation',
  },
  {
    id: 'chat',
    emoji: '💬',
    title: 'Discute avec moi !',
    description:
      "Ce bouton 🐝 en bas à droite, c'est moi ! Clique pour me poser n'importe quelle question sur ta serre, tes plantes, ou des conseils en langage naturel.",
    targetId: 'onboarding-chat',
  },
  {
    id: 'ready',
    emoji: '🚀',
    title: "C'est parti !",
    description:
      "Tu es prêt(e) à tout explorer ! Je reste disponible en permanence dans le chat. Bonne culture 🌿",
  },
];

export const STORAGE_KEY = 'virida_onboarding_v1';
