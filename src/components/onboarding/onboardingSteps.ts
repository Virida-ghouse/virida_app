export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** ID DOM de l'élément à mettre en évidence (sidebar ou bouton chat) */
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
      "Clique sur Dashboard pour voir tous tes capteurs en temps réel : température, humidité, pH, luminosité… Tout d'un coup d'œil !",
    targetId: 'onboarding-dashboard',
  },
  {
    id: 'plants',
    emoji: '🌱',
    title: 'Mes Plantes',
    description:
      "Dans Crops, suis la croissance de chaque plante individuellement, note les arrosages, les soins et observe leur évolution.",
    targetId: 'onboarding-plants',
  },
  {
    id: 'automation',
    emoji: '⚡',
    title: 'Automatisation',
    description:
      "Avec Automation, crée des règles intelligentes : si l'humidité du sol chute, la pompe se déclenche toute seule !",
    targetId: 'onboarding-automation',
  },
  {
    id: 'chat',
    emoji: '💬',
    title: 'Discute avec moi',
    description:
      "Ce bouton 🐝 en bas à droite, c'est moi ! Clique dessus pour me poser n'importe quelle question sur ta serre en langage naturel.",
    targetId: 'onboarding-chat',
  },
  {
    id: 'ready',
    emoji: '🚀',
    title: "C'est parti !",
    description:
      "Tu es prêt(e) ! Explore chaque section librement. Je reste disponible en permanence dans le chat. Bonne culture 🌿 !",
  },
];

export const STORAGE_KEY = 'virida_onboarding_v1';
