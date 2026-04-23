export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** ID DOM de l'élément à mettre en évidence */
  targetId?: string;
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
      "Dans Crops, suis la croissance de chaque plante individuellement. Note les arrosages, les soins et observe leur évolution dans le temps.",
    targetId: 'onboarding-plants',
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
