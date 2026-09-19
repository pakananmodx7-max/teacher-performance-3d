import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { AccentTheme } from "../content";

const THEME_COLORS: Record<AccentTheme, { primary: string; secondary: string; fog: string }> = {
  neutral: { primary: "#7c8cff", secondary: "#b98bff", fog: "#05060f" },
  part1: { primary: "#3fd0ff", secondary: "#4f7dff", fog: "#03080f" },
  part2: { primary: "#ffb648", secondary: "#ff7a5c", fog: "#0f0803" },
  closing: { primary: "#8bffb0", secondary: "#3fd0ff", fog: "#02100c" },
};

interface DriftingShapeProps {
  position: [number, number, number];
  color: string;
  geometry: "icosahedron" | "octahedron" | "torus" | "box";
  scale?: number;
}

function DriftingShape({ position, color, geometry, scale = 1 }: DriftingShapeProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.08;
    mesh.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={mesh} position={position} scale={scale}>
        {geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {geometry === "torus" && <torusGeometry args={[0.7, 0.24, 16, 48]} />}
        {geometry === "box" && <boxGeometry args={[1, 1, 1]} />}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.6}
          wireframe
        />
      </mesh>
    </Float>
  );
}

interface CameraRigProps {
  slideIndex: number;
  totalSlides: number;
}

function CameraRig({ slideIndex, totalSlides }: CameraRigProps) {
  const progress = slideIndex / Math.max(totalSlides - 1, 1);

  useFrame((state) => {
    const targetX = Math.sin(progress * Math.PI * 2) * 2.2;
    const targetY = 0.4 + Math.cos(progress * Math.PI) * 0.6;
    const targetZ = 8 - progress * 1.5;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

interface SceneProps {
  theme: AccentTheme;
  slideIndex: number;
  totalSlides: number;
}

export function Scene({ theme, slideIndex, totalSlides }: SceneProps) {
  const colors = THEME_COLORS[theme];

  const shapes = useMemo(
    () =>
      [
        { position: [-3.2, 1.2, -2] as [number, number, number], geometry: "icosahedron" as const, scale: 1.1 },
        { position: [3.4, -0.8, -3] as [number, number, number], geometry: "octahedron" as const, scale: 0.9 },
        { position: [-2, -1.6, -4] as [number, number, number], geometry: "torus" as const, scale: 1.3 },
        { position: [2.6, 1.8, -3.5] as [number, number, number], geometry: "box" as const, scale: 0.6 },
        { position: [0, 2.4, -5] as [number, number, number], geometry: "icosahedron" as const, scale: 0.7 },
      ],
    [],
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0.4, 8], fov: 55 }}
    >
      <color attach="background" args={[colors.fog]} />
      <fog attach="fog" args={[colors.fog, 6, 16]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={colors.primary} />
      <pointLight position={[-5, -3, -2]} intensity={0.8} color={colors.secondary} />

      <CameraRig slideIndex={slideIndex} totalSlides={totalSlides} />

      {shapes.map((shape, i) => (
        <DriftingShape
          key={i}
          position={shape.position}
          geometry={shape.geometry}
          scale={shape.scale}
          color={i % 2 === 0 ? colors.primary : colors.secondary}
        />
      ))}

      <Sparkles count={80} scale={12} size={2} speed={0.3} color={colors.primary} opacity={0.6} />
      <Stars radius={40} depth={30} count={1200} factor={2} saturation={0} fade speed={0.4} />
    </Canvas>
  );
}
