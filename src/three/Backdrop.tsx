import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "./materials";
import { scrollState } from "./store";

function buildSkyTexture(): THREE.CanvasTexture {
  const w = 8;
  const h = 384;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, PALETTE.skyTop);
  grad.addColorStop(0.42, PALETTE.skyUpper);
  grad.addColorStop(0.78, PALETTE.skyHorizon);
  grad.addColorStop(1, PALETTE.skyDawn);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface SilhouetteProps {
  z: number;
  spread: number;
  height: number;
  opacity: number;
  color: string;
  seedOffset?: number;
}

/** A soft, irregular ridge line -- used for both mountains and the general horizon massing. */
function RidgeSilhouette({ z, spread, height, opacity, color, seedOffset = 0 }: SilhouetteProps) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-spread, 0);
    const segments = 14;
    for (let i = 0; i <= segments; i++) {
      const x = -spread + (i / segments) * spread * 2;
      const n = Math.sin(i * 1.7 + seedOffset) * Math.sin(i * 0.55 + seedOffset * 1.3 + 1);
      const y = Math.max(0.25, height * (0.35 + 0.65 * (n * 0.5 + 0.5)));
      shape.lineTo(x, y);
    }
    shape.lineTo(spread, 0);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [spread, height, seedOffset]);

  return (
    <mesh geometry={geometry} position={[0, 0, z]}>
      <meshBasicMaterial color={color} transparent opacity={opacity} fog />
    </mesh>
  );
}

/** A cluster of broken/uneven column stumps -- reads as ruins once softened by fog. */
function RuinCluster({ x, z, count = 4, baseHeight = 3 }: { x: number; z: number; count?: number; baseHeight?: number }) {
  const stumps = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        dx: (i - (count - 1) / 2) * 1.1 + (Math.random() - 0.5) * 0.4,
        h: baseHeight * (0.35 + Math.random() * 0.9),
        w: 0.32 + Math.random() * 0.16,
      })),
    [count, baseHeight],
  );

  return (
    <group position={[x, 0, z]}>
      {stumps.map((s, i) => (
        <mesh key={i} position={[s.dx, s.h / 2, 0]}>
          <cylinderGeometry args={[s.w * 0.85, s.w, s.h, 10]} />
          <meshBasicMaterial color={PALETTE.skyHorizon} transparent opacity={0.5} fog />
        </mesh>
      ))}
    </group>
  );
}

/** A partial temple fragment: a few columns still carrying a broken piece of architrave. */
function DistantTempleFragment({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const columnXs = [-3, -1.6, -0.2, 1.2];
  return (
    <group position={[x, 0, z]} scale={scale}>
      {columnXs.map((cx, i) => (
        <mesh key={i} position={[cx, 3, 0]}>
          <cylinderGeometry args={[0.24, 0.3, 6, 8]} />
          <meshBasicMaterial color={PALETTE.skyHorizon} transparent opacity={0.42} fog />
        </mesh>
      ))}
      <mesh position={[-1, 6.1, 0]}>
        <boxGeometry args={[3.6, 0.4, 0.6]} />
        <meshBasicMaterial color={PALETTE.skyHorizon} transparent opacity={0.4} fog />
      </mesh>
    </group>
  );
}

/** A thin, tall spindle silhouette standing in for a Mediterranean cypress. */
function Cypress({ x, z, height = 5 }: { x: number; z: number; height?: number }) {
  return (
    <mesh position={[x, height / 2, z]}>
      <coneGeometry args={[height * 0.09, height, 7]} />
      <meshBasicMaterial color={PALETTE.skyHorizon} transparent opacity={0.48} fog />
    </mesh>
  );
}

export function Backdrop() {
  const skyTex = useMemo(() => buildSkyTexture(), []);
  const skyMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    // Sky warms very slightly as the sequence approaches the entrance (dawn cue) --
    // it is always fully visible/colourful, never reads as empty black.
    const p = scrollState.progress;
    const dawn = THREE.MathUtils.clamp((p - 0.4) / 0.5, 0, 1);
    if (skyMatRef.current) {
      skyMatRef.current.color.setScalar(1 + dawn * 0.22);
    }
  });

  const ruins = useMemo(
    () => [
      { x: -22, z: -58, count: 3, baseHeight: 4.5 },
      { x: 26, z: -64, count: 5, baseHeight: 3.2 },
      { x: -33, z: -70, count: 4, baseHeight: 5 },
    ],
    [],
  );

  const cypresses = useMemo(
    () =>
      Array.from({ length: 9 }, () => ({
        x: (Math.random() - 0.5) * 90,
        z: -50 - Math.random() * 20,
        height: 4 + Math.random() * 3,
      })),
    [],
  );

  return (
    <group>
      <mesh scale={[1, 1, 1]}>
        <sphereGeometry args={[140, 24, 16]} />
        <meshBasicMaterial ref={skyMatRef} map={skyTex} side={THREE.BackSide} fog={false} />
      </mesh>

      {/* Mountains -- far background, heavily softened */}
      <RidgeSilhouette z={-118} spread={75} height={16} opacity={0.5} color={PALETTE.skyUpper} seedOffset={0} />
      <RidgeSilhouette z={-100} spread={60} height={10} opacity={0.4} color={PALETTE.skyHorizon} seedOffset={2.4} />

      {/* Distant architecture and vegetation -- the 40-70m mid-background band */}
      <DistantTempleFragment x={-14} z={-62} scale={1.1} />
      <DistantTempleFragment x={30} z={-72} scale={0.85} />
      {ruins.map((r, i) => (
        <RuinCluster key={i} {...r} />
      ))}
      {cypresses.map((c, i) => (
        <Cypress key={i} {...c} />
      ))}
    </group>
  );
}
