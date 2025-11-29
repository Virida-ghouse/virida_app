import React from 'react';
import { Text } from '@react-three/drei';
import { ElectronicComponentProps, SensorProps } from '../types/greenhouse.types';
import { VIRIDA_COLORS } from '../configs/greenhouse.config';

// Capteur générique (petit cube avec couleur)
export const Sensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1], color, label }: SensorProps) => {
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
export const TemperatureSensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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
export const SoilMoistureSensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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
export const LightSensor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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
export const WaterPump = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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
export const MistingNozzle = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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
export const Fan = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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
export const UVLight = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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

// Servomoteur (petit cube avec axe)
export const ServoMotor = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: ElectronicComponentProps) => {
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
