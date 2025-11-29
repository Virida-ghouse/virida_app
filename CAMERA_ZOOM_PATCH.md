# Patch pour ajouter le zoom automatique sur les composants

## Instructions
1. Arrête le serveur de dev (`Ctrl+C`)
2. Ouvre `src/components/3d/GreenhouseModel.tsx`
3. Trouve la ligne `// Composant 3D interne qui a accès au contexte` (ligne ~1058)
4. **AVANT** cette ligne, ajoute le composant `CameraController` ci-dessous
5. Dans `SceneContent`, remplace `<OrbitControls ... />` par `<CameraController />`
6. Relance le serveur

---

## Code à ajouter AVANT `const SceneContent = () => {`

```typescript
// Composant pour contrôler la caméra et zoomer sur le composant sélectionné
const CameraController = () => {
  const { camera } = useThree();
  const { selectedComponent, editMode, componentTransforms } = useEditMode();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (editMode && selectedComponent && controlsRef.current) {
      // Récupérer la position du composant
      const transform = componentTransforms[selectedComponent];
      const baseConfig = ELECTRONICS_CONFIG[selectedComponent as keyof typeof ELECTRONICS_CONFIG];

      if (baseConfig) {
        const targetPosition = transform?.position
          ? new THREE.Vector3(...transform.position)
          : new THREE.Vector3(baseConfig.position.x, baseConfig.position.y, baseConfig.position.z);

        // Animation du zoom
        const controls = controlsRef.current;
        const startTarget = controls.target.clone();
        const startPosition = camera.position.clone();

        // Position de la caméra pour le zoom (un peu en arrière et au-dessus du composant)
        const offset = new THREE.Vector3(0.3, 0.3, 0.5);
        const endPosition = targetPosition.clone().add(offset);

        let progress = 0;
        const duration = 600; // ms
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          progress = Math.min(elapsed / duration, 1);

          // Easing function (ease-out)
          const eased = 1 - Math.pow(1 - progress, 3);

          // Interpoler la cible des contrôles
          controls.target.lerpVectors(startTarget, targetPosition, eased);

          // Interpoler la position de la caméra
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

  return <OrbitControls
    ref={controlsRef}
    enablePan={true}
    enableZoom={true}
    enableRotate={true}
    minDistance={0.5}
    maxDistance={10}
  />;
};
```

---

## Modification dans `SceneContent`

**SUPPRIMER ces lignes :**
```typescript
  const potTargetPosition: [number, number, number] = [
    POT_CONFIG.position.x,
    POT_CONFIG.position.y,
    POT_CONFIG.position.z
  ];
```

**SUPPRIMER aussi :**
```typescript
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        target={potTargetPosition}
        minDistance={2}
        maxDistance={10}
      />
```

**REMPLACER par :**
```typescript
      <CameraController />
```

---

## Résultat final de SceneContent

```typescript
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
```

---

## Comment ça marche

- Quand tu sélectionnes un composant IoT (en cliquant dessus ou via le menu)
- La caméra zoome automatiquement sur le composant avec une animation fluide (600ms)
- Le zoom positionne la caméra à 0.5 unités du composant pour une vue rapprochée
- Tu peux toujours contrôler manuellement la caméra avec la souris
