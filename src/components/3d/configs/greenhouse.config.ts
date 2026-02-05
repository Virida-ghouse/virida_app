// Palette de couleurs Virida - Charte graphique officielle
export const VIRIDA_COLORS = {
  PRIMARY_GREEN: '#2AD368', // Vert vif de la charte
  LIGHT_GREEN: '#CBED62', // Vert clair de la charte
  DARK_GREEN: '#052E1C', // Vert foncé de la charte
  DARK_BLUE: '#121A21', // Gris foncé de la charte
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F5F5F5',
  SENSOR_BLUE: '#4A90E2',
  ACTUATOR_ORANGE: '#FF6B35',
  CONTROLLER_PURPLE: '#9B59B6',
  LIGHT_YELLOW: '#F1C40F',
};

// 🎯 CONFIGURATION 3D - Ajustez ces valeurs pour positionner/orienter le modèle
export const MODEL_CONFIG = {
  // Rotation (EN DEGRÉS - 0° à 360°) ✨
  rotation: {
    x: -90,         // Rotation sur l'axe X (en degrés) - -90° pour serre droite
    y: 0,           // Rotation sur l'axe Y (en degrés)
    z: 0,           // Rotation sur l'axe Z (en degrés)
  },
  // Position (ajustée automatiquement par le centrage)
  position: {
    x: 0,          // Décalage X après centrage
    y: 0,          // Décalage Y après centrage
    z: 0,          // Décalage Z après centrage
  },
  // Échelle / Zoom du modèle
  scale: {
    x: 1,          // Échelle X (1 = taille normale, >1 = plus grand, <1 = plus petit)
    y: 1,          // Échelle Y (1 = taille normale, >1 = plus grand, <1 = plus petit)
    z: 1,          // Échelle Z (1 = taille normale, >1 = plus grand, <1 = plus petit)
  },
  // 📷 Caméra / Zoom de la vue
  camera: {
    distance: 2.0,   // Distance de la caméra (plus grand = plus loin = dézoomer)
    fov: 25,         // Field of View (plus grand = plus large = dézoomer)
    position: {
      x: -0.5,        // Multiplicateur position X
      y: 0.75,        // Multiplicateur position Y
      z: -2,        // Multiplicateur position Z
    },
  },
};

// 🪴 CONFIGURATION POT - Ajustez ces valeurs pour positionner/orienter le pot
export const POT_CONFIG = {
  // Rotation (EN DEGRÉS - 0° à 360°) ✨
  rotation: {
    x: 90,          // Rotation sur l'axe X (en degrés)
    y: 0,          // Rotation sur l'axe Y (en degrés)
    z: 0,          // Rotation sur l'axe Z (en degrés)
  },
  // Position du pot dans la scène
  position: {
    x: -0.3,          // Position X (gauche/droite)
    y: 0.28,          // Position Y (haut/bas)
    z: 0.7,          // Position Z (avant/arrière)
  },
  // Échelle du pot
  scale: {
    x: 0.5,      // Échelle X (0.001 = très petit)
    y: 0.5,      // Échelle Y (0.001 = très petit)
    z: 0.5,      // Échelle Z (0.001 = très petit)
  },
};

// 📡 CONFIGURATION ÉLECTRONIQUE - Positions, rotations et échelles de tous les composants
// Base de référence: Pot à {x: -0.3, y: 0.28, z: 0.7}
// Pour chaque composant: position {x, y, z}, rotation {x, y, z} en degrés, scale {x, y, z}
export const ELECTRONICS_CONFIG = {
  // Capteurs d'environnement
  temperatureSensor: {
    position: { x: -0.2, y: 0.9, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  lightSensor: {
    position: { x: 0.1, y: 0.95, z: 0.3 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  co2Sensor: {
    position: { x: -0.154, y: 0.907, z: -0.091 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.1, y: 0.1, z: 0.1 },
  },

  // Capteurs du sol
  soilMoistureSensor: {
    position: { x: -0.132, y: 0.812, z: -0.280 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.001, y: 0.001, z: 0.001 },
  },
  phSensor: {
    position: { x: -0.5, y: 0.28, z: 0.75 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  tdsSensor: {
    position: { x: -0.2, y: 0.28, z: 0.55 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },

  // Irrigation
  waterPump: {
    position: { x: -0.7, y: 0.3, z: 0.3 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  mistingNozzle1: {
    position: { x: 0.1, y: 0.9, z: 0.6 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  mistingNozzle2: {
    position: { x: -0.4, y: 0.9, z: 0.4 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  mistingNozzle3: {
    position: { x: 0.3, y: 0.9, z: 0.2 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },

  // Ventilation
  fan1: {
    position: { x: 0.6, y: 0.7, z: 0.4 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.1, y: 0.1, z: 0.1 },
  },
  fan2: {
    position: { x: -0.6, y: 0.7, z: 0.2 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.1, y: 0.1, z: 0.1 },
  },

  // Éclairage
  uvLight1: {
    position: { x: -0.1, y: 1.0, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  uvLight2: {
    position: { x: 0.2, y: 1.0, z: 0.3 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },

  // Contrôleurs
  raspberryPi: {
    position: { x: -0.098, y: 0.637, z: -0.300 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.001, y: 0.001, z: 0.001 },
  },
  esp32: {
    position: { x: -0.112, y: 0.623, z: -0.237 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.001, y: 0.001, z: 0.001 },
  },

  // Servo et caméra
  servoMotor: {
    position: { x: 0.6, y: 0.5, z: -0.2 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  camera: {
    position: { x: 0.0, y: 1.0, z: -0.4 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
};

// Chemin vers le modèle 3D dans public/
export const serreModelPath = '/Serre.gltf';

// Fonction helper pour convertir degrés en radians
export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
