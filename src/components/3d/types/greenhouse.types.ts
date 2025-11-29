// Types et interfaces pour le modèle 3D de la serre

// 🎮 MODE ÉDITION - Contexte pour gérer l'édition des composants
export interface EditModeContextType {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedComponent: string | null;
  setSelectedComponent: (id: string | null) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  hoveredComponent: string | null;
  setHoveredComponent: (id: string | null) => void;
  componentTransforms: Record<string, { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }>;
  updateComponentTransform: (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
  exportConfig: () => void;
}

// Props pour les composants éditables
export interface EditableComponentProps {
  id: string;
  children: React.ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  showPivot?: boolean;
  onTransform?: (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
}

// Props pour les composants électroniques
export interface ElectronicComponentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

// Props pour les capteurs avec couleur et label
export interface SensorProps extends ElectronicComponentProps {
  color: string;
  label: string;
}

// Props pour les composants 3D avancés (Raspberry Pi, ESP32, Camera)
export interface AdvancedComponentProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}
