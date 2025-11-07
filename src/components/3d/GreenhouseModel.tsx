import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Palette de couleurs Virida
const VIRIDA_COLORS = {
  PRIMARY_GREEN: '#2AD388',
  LIGHT_GREEN: '#CBED82',
  DARK_GREEN: '#052E1C',
  DARK_BLUE: '#121A21',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F5F5F5',
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

// Composant qui gère la serre avec le pot comme enfant
const GreenhouseWithPot = () => {
  const [potGroup, setPotGroup] = React.useState<THREE.Group | null>(null);

  return (
    <>
      <PlantPot onPotReady={setPotGroup} />
      <SerreModel potGroup={potGroup} />
    </>
  );
};

const GreenhouseModel: React.FC = () => {
  // Utiliser la distance de caméra depuis MODEL_CONFIG pour le zoom
  const d = MODEL_CONFIG.camera.distance;
  const camPos = MODEL_CONFIG.camera.position;

  // Calculer la position cible du pot (en tenant compte qu'il est enfant de la serre)
  const potTargetPosition: [number, number, number] = [
    POT_CONFIG.position.x,
    POT_CONFIG.position.y,
    POT_CONFIG.position.z
  ];

  return (
    <Canvas camera={{ position: [d * camPos.x, d * camPos.y, d * camPos.z], fov: MODEL_CONFIG.camera.fov }} shadows>
      <color attach="background" args={[VIRIDA_COLORS.LIGHT_GRAY]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <directionalLight
        position={[-5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="sunset" />
      <Suspense fallback={null}>
        <GreenhouseWithPot />
      </Suspense>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        target={potTargetPosition}
        minDistance={2}
        maxDistance={10}
      />
      {/* Grille aux couleurs Virida */}
      <gridHelper
        args={[10, 10, VIRIDA_COLORS.PRIMARY_GREEN, VIRIDA_COLORS.LIGHT_GREEN]}
        position={[0, -0.01, 0]}
        visible={false}
      />
    </Canvas>
  );
};

export default GreenhouseModel;
