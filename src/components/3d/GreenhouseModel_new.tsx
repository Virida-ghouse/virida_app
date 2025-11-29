import React, { useEffect, Suspense, useState, useRef, createContext, useContext } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Text, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

// Palette de couleurs Virida
const VIRIDA_COLORS = {
  PRIMARY_GREEN: '#2AD388',
  LIGHT_GREEN: '#CBED82',
  DARK_GREEN: '#052E1C',
  DARK_BLUE: '#121A21',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F5F5F5',
  SENSOR_BLUE: '#4A90E2',
  ACTUATOR_ORANGE: '#FF6B35',
  CONTROLLER_PURPLE: '#9B59B6',
  LIGHT_YELLOW: '#F1C40F',
};

// 🎮 MODE ÉDITION - Contexte pour gérer l'édition des composants
interface EditModeContextType {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedComponent: string | null;
  setSelectedComponent: (id: string | null) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  hoveredComponent: string | null;
  setHoveredComponent: (id: string | null) => void;
  updateComponentTransform: (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
  exportConfig: () => void;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
};

// Modèle 3D de la serre
// Chemin vers le modèle 3D dans public/
const serreModelPath = '/Serre.gltf';

// Fonction helper pour convertir degrés en radians
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// 🎯 CONFIGURATION 3D - Ajustez ces valeurs pour positionner/orienter le modèle
const MODEL_CONFIG = {
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
const POT_CONFIG = {
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
const ELECTRONICS_CONFIG = {
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
    position: { x: 0.2, y: 0.85, z: 0.1 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },

  // Capteurs du sol
  soilMoistureSensor: {
    position: { x: -0.4, y: 0.28, z: 0.65 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
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
    scale: { x: 1, y: 1, z: 1 },
  },
  fan2: {
    position: { x: -0.6, y: 0.7, z: 0.2 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
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
    position: { x: -0.7, y: 0.3, z: -0.3 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  esp32: {
    position: { x: -0.6, y: 0.3, z: -0.5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
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

// Hook pour charger le pot de plantation
const PlantPot = ({ onPotReady }: { onPotReady: (group: THREE.Group) => void }) => {
  const { scene } = useGLTF('/plant_pot/scene.gltf');

  useEffect(() => {
    // Créer un nouveau Group pour avoir un point pivot propre
    const group = new THREE.Group();

    // Cloner toute la scène du pot
    const clonedScene = scene.clone();

    // Réinitialiser les transformations pour avoir un point pivot propre
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);

    // Ajouter la scène clonée au groupe
    group.add(clonedScene);

    // Centrer le pot dans le groupe
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);

    // Notifier que le pot est prêt
    onPotReady(group);
  }, [scene, onPotReady]);

  return null; // Ne rend rien, le pot sera ajouté comme enfant de la serre
};

const SerreModel = ({ potGroup }: { potGroup: THREE.Group | null }) => {
  const { scene, materials } = useGLTF(serreModelPath);

  useEffect(() => {
    // Configuration pour les reflets
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1); // Taille minimale pour éviter les erreurs

    // Appliquer l'effet plexiglas/verre uniquement au matériau spécifique
    if (materials && materials['0.917647_0.917647_0.917647_0.000000_0.800000']) {
      const glassMaterial = materials['0.917647_0.917647_0.917647_0.000000_0.800000'];

      // Appliquer l'effet plexiglas/verre
      glassMaterial.transparent = true;
      glassMaterial.opacity = 0.40; // Très transparent

      // Appliquer des propriétés spécifiques selon le type de matériau
      if (glassMaterial instanceof THREE.MeshStandardMaterial) {
        glassMaterial.roughness = 0.05; // Très lisse
        glassMaterial.metalness = 0.2; // Légèrement métallique
        glassMaterial.envMapIntensity = 1.8; // Intensifier les reflets

        // Ajouter une légère teinte bleutée pour l'effet verre
        const glassColor = new THREE.Color(0xc4e0f9); // Bleu très pâle
        glassMaterial.color.lerp(glassColor, 0.5); // Mélanger avec la couleur existante
      }

      if (glassMaterial instanceof THREE.MeshPhongMaterial) {
        glassMaterial.shininess = 100;
        glassMaterial.specular = new THREE.Color(0xffffff);

        // Ajouter une légère teinte bleutée pour l'effet verre si c'est un matériau Phong
        // Vérification de type plus précise pour éviter l'erreur TypeScript
        if ('color' in glassMaterial && glassMaterial.color instanceof THREE.Color) {
          const glassColor = new THREE.Color(0xc4e0f9); // Bleu très pâle
          glassMaterial.color.lerp(glassColor, 0.5); // Mélanger avec la couleur existante
        }
      }
    }

    // Changer le matériau du plateau (beige/marron) en blanc
    if (materials && materials['0.729412_0.250980_0.105882_0.000000_0.000000']) {
      const platformMaterial = materials['0.729412_0.250980_0.105882_0.000000_0.000000'];

      if (platformMaterial instanceof THREE.MeshStandardMaterial || platformMaterial instanceof THREE.MeshPhongMaterial) {
        // Appliquer la couleur blanche
        platformMaterial.color = new THREE.Color(0xffffff); // Blanc pur
      }
    }

    // Parcourir la scène pour s'assurer que tous les matériaux sont correctement configurés
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Vérifier si le mesh utilise le matériau cible
        if (child.material instanceof THREE.Material &&
            materials &&
            child.material.name === '0.917647_0.917647_0.917647_0.000000_0.800000') {
          // Déjà traité ci-dessus
        } else if (Array.isArray(child.material)) {
          // Pour les meshes avec plusieurs matériaux
          child.material.forEach(mat => {
            if (mat instanceof THREE.Material &&
                materials &&
                mat.name === '0.917647_0.917647_0.917647_0.000000_0.800000') {
              // Déjà traité ci-dessus
            }
          });
        }
      }
    });

    // Nettoyer le renderer
    renderer.dispose();

    // Appliquer la rotation depuis MODEL_CONFIG (conversion degrés → radians)
    scene.rotation.x = toRadians(MODEL_CONFIG.rotation.x);
    scene.rotation.y = toRadians(MODEL_CONFIG.rotation.y);
    scene.rotation.z = toRadians(MODEL_CONFIG.rotation.z);

    // Centrer le modèle en calculant sa boîte englobante
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());

    // Ajuster la position du modèle (centrage + décalage depuis MODEL_CONFIG)
    scene.position.x = -center.x + MODEL_CONFIG.position.x;
    scene.position.y = -center.y + MODEL_CONFIG.position.y;
    scene.position.z = -center.z + MODEL_CONFIG.position.z;

    // Ajouter le pot comme enfant de la serre pour qu'il hérite de la rotation
    if (potGroup && !scene.children.includes(potGroup)) {
      scene.add(potGroup);
      // Positionner le pot dans le référentiel de la serre (depuis POT_CONFIG)
      potGroup.position.set(
        POT_CONFIG.position.x,
        POT_CONFIG.position.y,
        POT_CONFIG.position.z
      );
      potGroup.scale.set(
        POT_CONFIG.scale.x,
        POT_CONFIG.scale.y,
        POT_CONFIG.scale.z
      );
      potGroup.rotation.set(
        toRadians(POT_CONFIG.rotation.x),
        toRadians(POT_CONFIG.rotation.y),
        toRadians(POT_CONFIG.rotation.z)
      );
    }
  }, [scene, materials, potGroup]);

  return (
    <primitive
      object={scene}
      scale={[MODEL_CONFIG.scale.x, MODEL_CONFIG.scale.y, MODEL_CONFIG.scale.z]}
      position={[0, 0, 0]}
    />
  );
};

// 📡 COMPOSANTS ÉLECTRONIQUES - Représentations 3D géométriques

// 🎯 COMPOSANT ÉDITABLE - Wrapper qui ajoute les contrôles d'édition
interface EditableComponentProps {
  id: string;
  children: React.ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  showPivot?: boolean;
  onTransform?: (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
}

const EditableComponent: React.FC<EditableComponentProps> = ({
  id,
  children,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  showPivot = true,
  onTransform
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const transformRef = useRef<any>(null);
  const { editMode, selectedComponent, setSelectedComponent, transformMode, hoveredComponent, setHoveredComponent, updateComponentTransform } = useEditMode();
  const orbitControlsRef = useRef<any>(null);

  const isSelected = selectedComponent === id;
  const isHovered = hoveredComponent === id;

  // Désactiver les OrbitControls quand on utilise TransformControls
  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;
      const callback = (event: any) => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = !event.value;
        }
      };
      controls.addEventListener('dragging-changed', callback);
      return () => controls.removeEventListener('dragging-changed', callback);
    }
  }, []);

  // Gérer les transformations
  const handleTransform = () => {
    if (groupRef.current) {
      const pos = groupRef.current.position.toArray() as [number, number, number];
      const rot = groupRef.current.rotation.toArray().slice(0, 3) as [number, number, number];
      const scl = groupRef.current.scale.toArray() as [number, number, number];

      // Mettre à jour le contexte avec les nouvelles valeurs
      updateComponentTransform(id, pos, rot, scl);

      // Appeler le callback si fourni
      if (onTransform) {
        onTransform(pos, rot, scl);
      }
    }
  };

  return (
    <group>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={(e) => {
          if (editMode) {
            e.stopPropagation();
            setSelectedComponent(isSelected ? null : id);
          }
        }}
        onPointerOver={(e) => {
          if (editMode) {
            e.stopPropagation();
            setHoveredComponent(id);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          if (editMode) {
            setHoveredComponent(null);
            document.body.style.cursor = 'auto';
          }
        }}
      >
        {children}

        {/* Point pivot visible */}
        {editMode && showPivot && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <meshBasicMaterial
              color={isSelected ? VIRIDA_COLORS.PRIMARY_GREEN : isHovered ? VIRIDA_COLORS.LIGHT_GREEN : '#FF0000'}
              opacity={0.8}
              transparent
            />
          </mesh>
        )}
      </group>

      {/* TransformControls pour éditer la position/rotation/échelle */}
      {editMode && isSelected && groupRef.current && (
        <TransformControls
          ref={transformRef}
          object={groupRef.current}
          mode={transformMode}
          onChange={handleTransform}
        />
      )}
    </group>
  );
};

// Interface pour les props des composants électroniques
interface ElectronicComponentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

interface SensorProps extends ElectronicComponentProps {
  color: string;
  label: string;
}

// Capteur générique (petit cube avec couleur)
const Sensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1], color, label }: SensorProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.03, 0.03, 0.03]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, 0.04, 0]}
        fontSize={0.02}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

// Capteur de température DS18B20 (cylindre fin)
const TemperatureSensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
        <meshStandardMaterial color={VIRIDA_COLORS.SENSOR_BLUE} metalness={0.5} />
      </mesh>
      <Text
        position={[0, 0.04, 0]}
        fontSize={0.02}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Temp
      </Text>
    </group>
  );
};

// Capteur d'humidité du sol (fourche - 2 barres)
const SoilMoistureSensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow position={[-0.01, -0.02, 0]}>
        <boxGeometry args={[0.003, 0.05, 0.003]} />
        <meshStandardMaterial color={VIRIDA_COLORS.SENSOR_BLUE} />
      </mesh>
      <mesh castShadow position={[0.01, -0.02, 0]}>
        <boxGeometry args={[0.003, 0.05, 0.003]} />
        <meshStandardMaterial color={VIRIDA_COLORS.SENSOR_BLUE} />
      </mesh>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.025, 0.01, 0.008]} />
        <meshStandardMaterial color={VIRIDA_COLORS.SENSOR_BLUE} />
      </mesh>
      <Text
        position={[0, 0.02, 0]}
        fontSize={0.015}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Humid
      </Text>
    </group>
  );
};

// Capteur de lumière BH1750 (petit cube avec surface brillante)
const LightSensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.02, 0.015, 0.01]} />
        <meshStandardMaterial color={VIRIDA_COLORS.SENSOR_BLUE} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.008, 0.006]}>
        <boxGeometry args={[0.012, 0.012, 0.001]} />
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, 0.025, 0]}
        fontSize={0.015}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Lum
      </Text>
    </group>
  );
};

// Pompe à eau (cylindre avec tuyaux)
const WaterPump = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
        <meshStandardMaterial color={VIRIDA_COLORS.ACTUATOR_ORANGE} metalness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <Text
        position={[0, 0.05, 0]}
        fontSize={0.015}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Pompe
      </Text>
    </group>
  );
};

// Buse de brumisation (petit cône)
const MistingNozzle = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.008, 0.02, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      <Text
        position={[0, 0.025, 0]}
        fontSize={0.012}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Brum
      </Text>
    </group>
  );
};

// Ventilateur (cube avec grille)
const Fan = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color={VIRIDA_COLORS.ACTUATOR_ORANGE} />
      </mesh>
      <mesh position={[0, 0, 0.006]}>
        <cylinderGeometry args={[0.015, 0.015, 0.002, 16]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <Text
        position={[0, 0.03, 0]}
        fontSize={0.015}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Vent
      </Text>
    </group>
  );
};

// Lampe UV (tube lumineux)
const UVLight = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 16]} />
        <meshStandardMaterial
          color={VIRIDA_COLORS.LIGHT_YELLOW}
          emissive={VIRIDA_COLORS.LIGHT_YELLOW}
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={0.3} color={VIRIDA_COLORS.LIGHT_YELLOW} distance={0.3} />
      <Text
        position={[0, 0.03, 0]}
        fontSize={0.015}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        UV
      </Text>
    </group>
  );
};

// 📡 ESP32 - Microcontrôleur avec modèle 3D et point pivot centré automatiquement
interface ESP32Props {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const ESP32: React.FC<ESP32Props> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.001, 0.001, 0.001]
}) => {
  const { scene } = useGLTF('/esp32.glb');

  // Créer un groupe avec pivot centré (même technique que le Raspberry Pi et la caméra)
  const centeredGroup = React.useMemo(() => {
    const group = new THREE.Group();
    const clonedScene = scene.clone();

    // Réinitialiser les transformations
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);

    // Ajouter au groupe
    group.add(clonedScene);

    // 🎯 CENTRER LE PIVOT : calculer la boîte englobante et centrer
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center); // Déplace le modèle pour centrer le pivot

    return group;
  }, [scene]);

  return (
    <primitive
      object={centeredGroup}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

// Servomoteur (petit cube avec axe)
const ServoMotor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.022, 0.012, 0.022]} />
        <meshStandardMaterial color={VIRIDA_COLORS.ACTUATOR_ORANGE} />
      </mesh>
      <mesh castShadow position={[0, 0.008, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.008, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <Text
        position={[0, 0.02, 0]}
        fontSize={0.01}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Servo
      </Text>
    </group>
  );
};

// 📷 ESP32-CAM - Caméra avec modèle 3D et point pivot centré automatiquement
interface CameraProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const Camera: React.FC<CameraProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.001, 0.001, 0.001]
}) => {
  const { scene } = useGLTF('/esp32-cam.glb');

  // Créer un groupe avec pivot centré (même technique que le Raspberry Pi et le pot)
  const centeredGroup = React.useMemo(() => {
    const group = new THREE.Group();
    const clonedScene = scene.clone();

    // Réinitialiser les transformations
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);

    // Ajouter au groupe
    group.add(clonedScene);

    // 🎯 CENTRER LE PIVOT : calculer la boîte englobante et centrer
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center); // Déplace le modèle pour centrer le pivot

    return group;
  }, [scene]);

  return (
    <primitive
      object={centeredGroup}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

// 🖥️ Raspberry Pi 4 Modèle B - avec point pivot centré automatiquement
interface RaspberryPiProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

const RaspberryPi: React.FC<RaspberryPiProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.001, 0.001, 0.001]
}) => {
  const { scene } = useGLTF('/raspberry_pi_4b_ok.glb');

  // Créer un groupe avec pivot centré (même technique que le pot)
  const centeredGroup = React.useMemo(() => {
    const group = new THREE.Group();
    const clonedScene = scene.clone();

    // Réinitialiser les transformations
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);

    // Ajouter au groupe
    group.add(clonedScene);

    // 🎯 CENTRER LE PIVOT : calculer la boîte englobante et centrer
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center); // Déplace le modèle pour centrer le pivot

    return group;
  }, [scene]);

  return (
    <primitive
      object={centeredGroup}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
};

// Composant qui contient tous les éléments électroniques
const ElectronicsComponents = () => {
  const toArray = (obj: { x: number; y: number; z: number }): [number, number, number] => [obj.x, obj.y, obj.z];

  return (
    <group>
      {/* Capteurs d'environnement - en haut de la serre */}
      <EditableComponent
        id="temperatureSensor"
        position={toArray(ELECTRONICS_CONFIG.temperatureSensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <TemperatureSensor
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
      </EditableComponent>

      <EditableComponent
        id="lightSensor"
        position={toArray(ELECTRONICS_CONFIG.lightSensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <LightSensor
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
      </EditableComponent>

      <EditableComponent
        id="co2Sensor"
        position={toArray(ELECTRONICS_CONFIG.co2Sensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <Sensor
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
          color={VIRIDA_COLORS.SENSOR_BLUE}
          label="CO2"
        />
      </EditableComponent>

      {/* Capteurs du sol - près du pot */}
      <EditableComponent
        id="soilMoistureSensor"
        position={toArray(ELECTRONICS_CONFIG.soilMoistureSensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <SoilMoistureSensor position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="phSensor"
        position={toArray(ELECTRONICS_CONFIG.phSensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <Sensor position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} color={VIRIDA_COLORS.SENSOR_BLUE} label="pH" />
      </EditableComponent>

      <EditableComponent
        id="tdsSensor"
        position={toArray(ELECTRONICS_CONFIG.tdsSensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <Sensor position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} color={VIRIDA_COLORS.SENSOR_BLUE} label="TDS" />
      </EditableComponent>

      {/* Système d'irrigation - pompe au sol */}
      <EditableComponent
        id="waterPump"
        position={toArray(ELECTRONICS_CONFIG.waterPump.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <WaterPump position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="mistingNozzle1"
        position={toArray(ELECTRONICS_CONFIG.mistingNozzle1.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <MistingNozzle position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="mistingNozzle2"
        position={toArray(ELECTRONICS_CONFIG.mistingNozzle2.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <MistingNozzle position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="mistingNozzle3"
        position={toArray(ELECTRONICS_CONFIG.mistingNozzle3.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <MistingNozzle position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      {/* Ventilation - sur les côtés */}
      <EditableComponent
        id="fan1"
        position={toArray(ELECTRONICS_CONFIG.fan1.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <Fan position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="fan2"
        position={toArray(ELECTRONICS_CONFIG.fan2.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <Fan position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      {/* Éclairage UV - en haut au centre */}
      <EditableComponent
        id="uvLight1"
        position={toArray(ELECTRONICS_CONFIG.uvLight1.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <UVLight position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="uvLight2"
        position={toArray(ELECTRONICS_CONFIG.uvLight2.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <UVLight position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      {/* Contrôleurs - au sol, coin de la serre */}
      <EditableComponent
        id="raspberryPi"
        position={toArray(ELECTRONICS_CONFIG.raspberryPi.position)}
        rotation={[0, 0, 0]}
        scale={[0.001, 0.001, 0.001]}
      >
        <RaspberryPi position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="esp32"
        position={toArray(ELECTRONICS_CONFIG.esp32.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <ESP32 position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      {/* Servomoteur - pour ventilation/ouvertures */}
      <EditableComponent
        id="servoMotor"
        position={toArray(ELECTRONICS_CONFIG.servoMotor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <ServoMotor position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      {/* Caméra ESP32-CAM - en haut, vue d'ensemble */}
      <EditableComponent
        id="camera"
        position={toArray(ELECTRONICS_CONFIG.camera.position)}
        rotation={[0, 0, 0]}
        scale={[2, 2,2]}
      >
        <Camera position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>
    </group>
  );
};

// Composant qui gère la serre avec le pot comme enfant
const GreenhouseWithPot = () => {
  const [potGroup, setPotGroup] = React.useState<THREE.Group | null>(null);

  return (
    <>
      <PlantPot onPotReady={setPotGroup} />
      <SerreModel potGroup={potGroup} />
      {/* Les composants électroniques sont maintenant indépendants de la serre */}
      <ElectronicsComponents />
    </>
  );
};
