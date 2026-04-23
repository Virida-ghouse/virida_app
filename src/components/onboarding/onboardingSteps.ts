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
  // ── Sensors ──────────────────────────────────────────────────────────────
  {
    id: 'sensors-intro',
    emoji: '📡',
    title: 'Capteurs IoT',
    description:
      "Clique sur 'Sensors' dans le menu 👆 pour superviser tous tes capteurs en temps réel : température, humidité, pH, lumière, TDS et humidité du sol.",
    targetId: 'onboarding-sensors',
    viewNavigate: 'sensors',
  },
  {
    id: 'sensors-stats',
    emoji: '📊',
    title: 'Tableau de bord capteurs',
    description:
      "En haut tu vois d'un coup d'œil : combien de capteurs sont en ligne, combien ont des alertes. Les filtres par type permettent de ne voir qu'une catégorie.",
    targetId: 'onboarding-sensors-stats',
    viewNavigate: 'sensors',
  },
  {
    id: 'sensors-cards',
    emoji: '🌡️',
    title: 'Cartes & historique',
    description:
      "Chaque carte affiche la valeur en direct avec une sparkline. Clique dessus pour ouvrir l'historique complet : 1h, 24h, 7j ou 30j avec stats MIN/MOY/MAX.",
    targetId: 'onboarding-sensors-grid',
    viewNavigate: 'sensors',
  },
  {
    id: 'sensors-annotations',
    emoji: '📝',
    title: 'Annotations & seuils',
    description:
      "Dans l'historique tu peux : ajouter des **annotations** sur le graphique (ex: 'réglage pH fait'), configurer des **seuils d'alerte** visuels, et **exporter en CSV** pour tes rapports labo !",
    targetId: 'onboarding-sensors-grid',
    viewNavigate: 'sensors',
  },
  {
    id: 'sensors-compare',
    emoji: '🔀',
    title: 'Mode comparaison',
    description:
      "Clique sur 'Comparer' 👆 puis sélectionne plusieurs capteurs pour les superposer sur un même graphique — idéal pour corréler pH et TDS, ou comparer deux zones.",
    targetId: 'onboarding-sensors-compare',
    viewNavigate: 'sensors',
  },
  // ── Automation ───────────────────────────────────────────────────────────
  {
    id: 'automation-intro',
    emoji: '⚡',
    title: 'Automation',
    description:
      "Clique sur 'Automation' 👆 pour créer des règles intelligentes. Si le pH descend sous 5.5, le système peut déclencher automatiquement un correcteur !",
    targetId: 'onboarding-automation',
    viewNavigate: 'automation',
  },
  {
    id: 'automation-rules',
    emoji: '📋',
    title: 'Règles actives',
    description:
      "Ce tableau liste toutes tes règles : condition déclenchante, action automatique et statut actif/inactif. Active ou désactive chaque règle en un clic.",
    targetId: 'onboarding-automation-table',
    viewNavigate: 'automation',
  },
  {
    id: 'automation-add',
    emoji: '➕',
    title: 'Créer une règle',
    description:
      "Clique sur '+ Add Rule' 👆 pour créer ta propre règle : choisis le capteur, la condition seuil, et l'action à déclencher. Simple et puissant !",
    targetId: 'onboarding-automation-add',
    viewNavigate: 'automation',
  },
  // ── Energy / System Health ────────────────────────────────────────────────
  {
    id: 'energy-intro',
    emoji: '🔋',
    title: 'System Health',
    description:
      "Clique sur 'Energy' 👆 pour accéder au diagnostic complet de ta serre : état de tous les capteurs, alertes de santé, et guide de dépannage IoT.",
    targetId: 'onboarding-energy',
    viewNavigate: 'energy',
  },
  {
    id: 'energy-kpis',
    emoji: '💚',
    title: 'Indicateurs de santé',
    description:
      "Ces 4 compteurs résument l'état global : capteurs en bonne santé, à surveiller, hors ligne et critiques. Un seul regard pour savoir si ta serre va bien !",
    targetId: 'onboarding-energy-kpis',
    viewNavigate: 'energy',
  },
  {
    id: 'energy-telemetry',
    emoji: '📡',
    title: 'Sensor Telemetry',
    description:
      "Ce tableau liste tous tes capteurs en direct avec leur valeur, plage cible et statut. Clique sur une ligne pour ouvrir la carte détaillée avec statut santé, valeur live et timestamp !",
    targetId: 'onboarding-energy-telemetry',
    viewNavigate: 'energy',
  },
  {
    id: 'energy-mqtt',
    emoji: '🔗',
    title: 'MQTT Broker',
    description:
      "Ce widget affiche l'état de connexion au broker MQTT de ta serre. Broker, utilisateur, topic abonné — et la commande SSH pour surveiller les messages en direct.",
    targetId: 'onboarding-energy-mqtt',
    viewNavigate: 'energy',
  },
  {
    id: 'energy-guide',
    emoji: '🔧',
    title: 'Guide de Dépannage',
    description:
      "Si un capteur est défaillant, EVE affiche automatiquement les étapes de résolution ici ! Numérotées et contextuelles selon le type de capteur : pH, TDS, température...",
    targetId: 'onboarding-energy-guide',
    viewNavigate: 'energy',
  },
  {
    id: 'energy-commands',
    emoji: '💻',
    title: 'ESP32 Commandes',
    description:
      "Ces commandes SSH te permettent de diagnostiquer rapidement : logs firmware, ping MQTT, redémarrage API, statut des services Pi. Copie-les directement dans ton terminal !",
    targetId: 'onboarding-energy-commands',
    viewNavigate: 'energy',
  },
  {
    id: 'energy-thresholds',
    emoji: '🔔',
    title: 'Seuils d\'Alerte',
    description:
      "Ce récapitulatif affiche les plages idéales pour chaque capteur : température, humidité, pH, TDS, lumière... Si une valeur sort de ces bornes, une alerte se déclenche !",
    targetId: 'onboarding-energy-thresholds',
    viewNavigate: 'energy',
  },
  // ── Reports ───────────────────────────────────────────────────────────────
  {
    id: 'reports-intro',
    emoji: '📈',
    title: 'Rapports & Analyses',
    description:
      "Clique sur 'Reports' 👆 pour obtenir une analyse complète générée par EVE : score de santé global, tendances par culture, et recommandations personnalisées.",
    targetId: 'onboarding-reports',
    viewNavigate: 'reports',
  },
  {
    id: 'reports-score',
    emoji: '🏆',
    title: 'Score EVE',
    description:
      "Le score sur 100 reflète la santé globale de ta serre. Plus bas : clique sur 'Générer' pour obtenir un rapport EVE détaillé avec analyses et conseils d'optimisation.",
    targetId: 'onboarding-reports-score',
    viewNavigate: 'reports',
  },
  // ── EVE Chatbot ───────────────────────────────────────────────────────────
  {
    id: 'chat',
    emoji: '💬',
    title: 'Discute avec moi !',
    description:
      "Ce bouton 🐝 en bas à droite, c'est moi ! Clique pour me poser n'importe quelle question : état des capteurs, conseils de culture, diagnostic en langage naturel.",
    targetId: 'onboarding-chat',
  },
  {
    id: 'ready',
    emoji: '🐝',
    title: 'Virida est à toi !',
    description:
      "Tu connais maintenant toutes les fonctionnalités de ta serre connectée. Je reste disponible 24h/24 dans le chat pour t'aider. Bonne culture ! 🌿",
  },
];

export const STORAGE_KEY = 'virida_onboarding_v1';
