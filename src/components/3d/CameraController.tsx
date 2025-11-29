import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useEditMode } from './GreenhouseModel';
import { ELECTRONICS_CONFIG } from './configs/greenhouse.config';

// Composant pour contrôler la caméra et zoomer sur le composant sélectionné
export const CameraController = () => {
  const { camera } = useThree();
  const { selectedComponent, editMode, componentTransforms } = useEditMode();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (editMode && selectedComponent && controlsRef.current) {
      const transform = componentTransforms[selectedComponent];
      const baseConfig = ELECTRONICS_CONFIG[selectedComponent as keyof typeof ELECTRONICS_CONFIG];

      if (baseConfig) {
        const targetPosition = transform?.position
          ? new THREE.Vector3(...transform.position)
          : new THREE.Vector3(baseConfig.position.x, baseConfig.position.y, baseConfig.position.z);

        const controls = controlsRef.current;
        const startTarget = controls.target.clone();
        const startPosition = camera.position.clone();
        const offset = new THREE.Vector3(0.3, 0.3, 0.5);
        const endPosition = targetPosition.clone().add(offset);

        let progress = 0;
        const duration = 600;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          controls.target.lerpVectors(startTarget, targetPosition, eased);
          camera.position.lerpVectors(startPosition, endPosition, eased);
          controls.update();
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }
    }
  }, [selectedComponent, editMode, camera, componentTransforms]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={0.5}
      maxDistance={10}
    />
  );
};
