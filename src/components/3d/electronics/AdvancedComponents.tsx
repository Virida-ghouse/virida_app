import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { AdvancedComponentProps } from '../types/greenhouse.types';

// 🖥️ Raspberry Pi 4 Modèle B - avec point pivot centré automatiquement
export const RaspberryPi: React.FC<AdvancedComponentProps> = ({
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

// 📡 ESP32 - Microcontrôleur avec modèle 3D et point pivot centré automatiquement
export const ESP32: React.FC<AdvancedComponentProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.001, 0.001, 0.001]
}) => {
  const { scene } = useGLTF('/esp32.glb');

  // Créer un groupe avec pivot centré (même technique que le Raspberry Pi)
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

// 📷 ESP32-CAM - Caméra avec modèle 3D et point pivot centré automatiquement
export const Camera: React.FC<AdvancedComponentProps> = ({
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

// 💧 Capteur d'humidité du sol - avec modèle 3D et point pivot centré automatiquement
export const SoilMoistureSensor3D: React.FC<AdvancedComponentProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.001, 0.001, 0.001]
}) => {
  const { scene } = useGLTF('/soil-moisture-sensor.glb');

  // Créer un groupe avec pivot centré (même technique que le Raspberry Pi)
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

// 🌫️ Capteur CO2 - avec modèle 3D et point pivot centré automatiquement
export const CO2Sensor3D: React.FC<AdvancedComponentProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.001, 0.001, 0.001]
}) => {
  const { scene } = useGLTF('/co2_sensor.gltf');

  // Créer un groupe avec pivot centré (même technique que le Raspberry Pi)
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

// 🌀 Ventilateur PC 140mm - avec modèle 3D et point pivot centré automatiquement
export const Fan3D: React.FC<AdvancedComponentProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.001, 0.001, 0.001]
}) => {
  const { scene } = useGLTF('/pc_fan_ventilador_140mm.glb');

  // Créer un groupe avec pivot centré (même technique que le Raspberry Pi)
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
