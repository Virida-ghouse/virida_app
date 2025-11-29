import React, { useEffect, Suspense, useState, useRef, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

// Imports des configurations
import {
  VIRIDA_COLORS,
  MODEL_CONFIG,
  POT_CONFIG,
  ELECTRONICS_CONFIG,
  serreModelPath,
  toRadians
} from './configs/greenhouse.config';

// Imports des types
import { EditModeContextType, EditableComponentProps } from './types/greenhouse.types';

// Imports des composants électroniques
import {
  Sensor,
  TemperatureSensor,
  SoilMoistureSensor,
  LightSensor,
  WaterPump,
  MistingNozzle,
  Fan,
  UVLight,
  ServoMotor
} from './electronics/BasicSensors';

import { RaspberryPi, ESP32, Camera, SoilMoistureSensor3D, CO2Sensor3D, Fan3D } from './electronics/AdvancedComponents';

// Import du CameraController
import { CameraController } from './CameraController';

// 🎮 MODE ÉDITION - Contexte pour gérer l'édition des composants
const EditModeContext = createContext<EditModeContextType | null>(null);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
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

// 🎯 COMPOSANT ÉDITABLE - Wrapper qui ajoute les contrôles d'édition
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
        <TemperatureSensor position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="lightSensor"
        position={toArray(ELECTRONICS_CONFIG.lightSensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <LightSensor position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="co2Sensor"
        position={toArray(ELECTRONICS_CONFIG.co2Sensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <CO2Sensor3D position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      {/* Capteurs du sol - près du pot */}
      <EditableComponent
        id="soilMoistureSensor"
        position={toArray(ELECTRONICS_CONFIG.soilMoistureSensor.position)}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <SoilMoistureSensor3D position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
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
        scale={toArray(ELECTRONICS_CONFIG.fan1.scale)}
      >
        <Fan3D position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
      </EditableComponent>

      <EditableComponent
        id="fan2"
        position={toArray(ELECTRONICS_CONFIG.fan2.position)}
        rotation={[0, 0, 0]}
        scale={toArray(ELECTRONICS_CONFIG.fan2.scale)}
      >
        <Fan3D position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
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
        scale={[2, 2, 2]}
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

// Composant 3D interne qui a accès au contexte
const SceneContent = () => {
  return (
    <>
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
      <CameraController />
      {/* Grille aux couleurs Virida */}
      <gridHelper
        args={[10, 10, VIRIDA_COLORS.PRIMARY_GREEN, VIRIDA_COLORS.LIGHT_GREEN]}
        position={[0, -0.01, 0]}
        visible={false}
      />
    </>
  );
};

const GreenhouseModel: React.FC = () => {
  // État du mode édition
  const [editMode, setEditMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  // État pour stocker les transformations des composants (mis à jour en temps réel)
  const [componentTransforms, setComponentTransforms] = useState<Record<string, {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }>>({});

  // Fonction pour mettre à jour la transformation d'un composant
  const updateComponentTransform = (
    id: string,
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number]
  ) => {
    setComponentTransforms(prev => ({
      ...prev,
      [id]: { position, rotation, scale }
    }));
  };

  // Fonction pour exporter la configuration actuelle
  const exportConfig = () => {
    console.log('📋 CONFIGURATION ACTUELLE DES COMPOSANTS:');
    console.log('========================================');

    const config: any = {};

    // Parcourir tous les composants de ELECTRONICS_CONFIG
    Object.keys(ELECTRONICS_CONFIG).forEach(id => {
      const baseConfig = ELECTRONICS_CONFIG[id as keyof typeof ELECTRONICS_CONFIG];

      // Si le composant a été modifié, utiliser les nouvelles valeurs
      if (componentTransforms[id]) {
        const transform = componentTransforms[id];
        config[id] = {
          position: {
            x: parseFloat(transform.position[0].toFixed(3)),
            y: parseFloat(transform.position[1].toFixed(3)),
            z: parseFloat(transform.position[2].toFixed(3))
          },
          rotation: {
            x: parseFloat((transform.rotation[0] * 180 / Math.PI).toFixed(1)),
            y: parseFloat((transform.rotation[1] * 180 / Math.PI).toFixed(1)),
            z: parseFloat((transform.rotation[2] * 180 / Math.PI).toFixed(1))
          },
          scale: {
            x: parseFloat(transform.scale[0].toFixed(3)),
            y: parseFloat(transform.scale[1].toFixed(3)),
            z: parseFloat(transform.scale[2].toFixed(3))
          }
        };
      } else {
        // Sinon, utiliser les valeurs de ELECTRONICS_CONFIG
        config[id] = {
          position: { ...baseConfig.position },
          rotation: { ...baseConfig.rotation },
          scale: { ...baseConfig.scale }
        };
      }
    });

    console.log(JSON.stringify(config, null, 2));
    console.log('========================================');

    if (Object.keys(componentTransforms).length > 0) {
      console.log(`✅ Configuration exportée (${Object.keys(componentTransforms).length} composant(s) modifié(s))`);
    } else {
      console.log('ℹ️  Configuration actuelle (aucune modification détectée)');
    }

    console.log('💡 Copiez cette configuration et remplacez ELECTRONICS_CONFIG dans le code');
  };

  // Utiliser la distance de caméra depuis MODEL_CONFIG pour le zoom
  const d = MODEL_CONFIG.camera.distance;
  const camPos = MODEL_CONFIG.camera.position;

  // 🎮 Gestionnaire de touches clavier pour le mode édition
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // E - Toggle edit mode
      if (event.key === 'e' || event.key === 'E') {
        setEditMode(prev => !prev);
        console.log('Edit mode:', !editMode);
      }

      // T - Translate mode
      if ((event.key === 't' || event.key === 'T') && editMode) {
        setTransformMode('translate');
        console.log('Transform mode: translate');
      }

      // R - Rotate mode
      if ((event.key === 'r' || event.key === 'R') && editMode) {
        setTransformMode('rotate');
        console.log('Transform mode: rotate');
      }

      // S - Scale mode
      if ((event.key === 's' || event.key === 'S') && editMode) {
        setTransformMode('scale');
        console.log('Transform mode: scale');
      }

      // P - Export positions (pour debug)
      if ((event.key === 'p' || event.key === 'P') && editMode) {
        exportConfig();
      }

      // Escape - Deselect
      if (event.key === 'Escape' && editMode) {
        setSelectedComponent(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode]);

  return (
    <EditModeContext.Provider
      value={{
        editMode,
        setEditMode,
        selectedComponent,
        setSelectedComponent,
        transformMode,
        setTransformMode,
        hoveredComponent,
        setHoveredComponent,
        componentTransforms,
        updateComponentTransform,
        exportConfig,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [d * camPos.x, d * camPos.y, d * camPos.z], fov: MODEL_CONFIG.camera.fov }}
          shadows
        >
          <SceneContent />
        </Canvas>

        {/* UI d'aide pour le mode édition */}
        {editMode && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '12px',
            pointerEvents: 'none',
          }}>
            <div style={{ color: VIRIDA_COLORS.PRIMARY_GREEN, fontWeight: 'bold', marginBottom: '5px' }}>
              MODE ÉDITION ACTIF
            </div>
            <div>E - Toggle Edit Mode</div>
            <div>T - Translate | R - Rotate | S - Scale</div>
            <div>P - Export Config | ESC - Deselect</div>
            <div style={{ marginTop: '5px', color: VIRIDA_COLORS.LIGHT_GREEN }}>
              Mode: {transformMode.toUpperCase()}
            </div>
            {selectedComponent && (
              <div style={{ marginTop: '5px', color: VIRIDA_COLORS.PRIMARY_GREEN }}>
                Selected: {selectedComponent}
              </div>
            )}
          </div>
        )}

        {/* Menu de sélection des composants */}
        {editMode && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            minWidth: '200px',
          }}>
            <div style={{
              color: VIRIDA_COLORS.PRIMARY_GREEN,
              fontWeight: 'bold',
              marginBottom: '10px',
            }}>
              Composants IoT
            </div>
            <select
              value={selectedComponent || ''}
              onChange={(e) => setSelectedComponent(e.target.value || null)}
              style={{
                width: '100%',
                padding: '5px',
                background: '#333',
                color: 'white',
                border: `1px solid ${VIRIDA_COLORS.PRIMARY_GREEN}`,
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              <option value="">-- Sélectionner --</option>

              <optgroup label="Capteurs Environnement">
                <option value="temperatureSensor">Température</option>
                <option value="lightSensor">Lumière</option>
                <option value="co2Sensor">CO2</option>
              </optgroup>

              <optgroup label="Capteurs Sol">
                <option value="soilMoistureSensor">Humidité Sol</option>
                <option value="phSensor">pH</option>
                <option value="tdsSensor">TDS</option>
              </optgroup>

              <optgroup label="Irrigation">
                <option value="waterPump">Pompe à Eau</option>
                <option value="mistingNozzle1">Buse Brumisation 1</option>
                <option value="mistingNozzle2">Buse Brumisation 2</option>
                <option value="mistingNozzle3">Buse Brumisation 3</option>
              </optgroup>

              <optgroup label="Ventilation">
                <option value="fan1">Ventilateur 1</option>
                <option value="fan2">Ventilateur 2</option>
              </optgroup>

              <optgroup label="Éclairage">
                <option value="uvLight1">Lampe UV 1</option>
                <option value="uvLight2">Lampe UV 2</option>
              </optgroup>

              <optgroup label="Contrôleurs">
                <option value="raspberryPi">Raspberry Pi 4</option>
                <option value="esp32">ESP32</option>
              </optgroup>

              <optgroup label="Autres">
                <option value="servoMotor">Servomoteur</option>
                <option value="camera">Caméra</option>
              </optgroup>
            </select>
          </div>
        )}

        {/* Panneau des coordonnées en temps réel */}
        {editMode && selectedComponent && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '11px',
            minWidth: '280px',
            maxWidth: '350px',
            border: `2px solid ${VIRIDA_COLORS.PRIMARY_GREEN}`,
          }}>
            <div style={{
              color: VIRIDA_COLORS.PRIMARY_GREEN,
              fontWeight: 'bold',
              marginBottom: '10px',
              fontSize: '13px',
            }}>
              📍 COORDONNÉES EN TEMPS RÉEL
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: VIRIDA_COLORS.LIGHT_GREEN, fontWeight: 'bold' }}>
                Composant: {selectedComponent}
              </div>
            </div>

            {/* Afficher les coordonnées actuelles */}
            {(() => {
              const transform = componentTransforms[selectedComponent];
              const baseConfig = ELECTRONICS_CONFIG[selectedComponent as keyof typeof ELECTRONICS_CONFIG];

              // Utiliser les valeurs modifiées si disponibles, sinon les valeurs de base
              const pos = transform?.position || [baseConfig.position.x, baseConfig.position.y, baseConfig.position.z];
              const rot = transform?.rotation || [baseConfig.rotation.x * Math.PI / 180, baseConfig.rotation.y * Math.PI / 180, baseConfig.rotation.z * Math.PI / 180];
              const scl = transform?.scale || [baseConfig.scale.x, baseConfig.scale.y, baseConfig.scale.z];

              return (
                <>
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #444' }}>
                    <div style={{ color: '#4FC3F7', fontWeight: 'bold', marginBottom: '5px' }}>Position (x, y, z):</div>
                    <div style={{ paddingLeft: '10px', lineHeight: '1.5' }}>
                      <div>x: <span style={{ color: '#FFF' }}>{pos[0].toFixed(3)}</span></div>
                      <div>y: <span style={{ color: '#FFF' }}>{pos[1].toFixed(3)}</span></div>
                      <div>z: <span style={{ color: '#FFF' }}>{pos[2].toFixed(3)}</span></div>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #444' }}>
                    <div style={{ color: '#FFB74D', fontWeight: 'bold', marginBottom: '5px' }}>Rotation (degrés):</div>
                    <div style={{ paddingLeft: '10px', lineHeight: '1.5' }}>
                      <div>x: <span style={{ color: '#FFF' }}>{(rot[0] * 180 / Math.PI).toFixed(1)}°</span></div>
                      <div>y: <span style={{ color: '#FFF' }}>{(rot[1] * 180 / Math.PI).toFixed(1)}°</span></div>
                      <div>z: <span style={{ color: '#FFF' }}>{(rot[2] * 180 / Math.PI).toFixed(1)}°</span></div>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #444' }}>
                    <div style={{ color: '#81C784', fontWeight: 'bold', marginBottom: '5px' }}>Scale (x, y, z):</div>
                    <div style={{ paddingLeft: '10px', lineHeight: '1.5' }}>
                      <div>x: <span style={{ color: '#FFF' }}>{scl[0].toFixed(3)}</span></div>
                      <div>y: <span style={{ color: '#FFF' }}>{scl[1].toFixed(3)}</span></div>
                      <div>z: <span style={{ color: '#FFF' }}>{scl[2].toFixed(3)}</span></div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #444',
                    color: VIRIDA_COLORS.LIGHT_GREEN,
                    fontSize: '10px',
                  }}>
                    💡 Appuyez sur P pour exporter toutes les positions
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </EditModeContext.Provider>
  );
};

export default GreenhouseModel;
