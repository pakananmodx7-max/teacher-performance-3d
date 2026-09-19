import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { scrollState } from "./store";
import { LIGHTING_RISE_RANGE } from "./journey";
import { rangeEmphasis } from "./cameraPath";

function buildShaftTexture(): THREE.CanvasTexture {
  const w = 64;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(w / 2, h * 0.12, 0, w / 2, h * 0.12, h * 0.92);
  grad.addColorStop(0, "rgba(255,241,214,0.16)");
  grad.addColorStop(0.35, "rgba(255,235,205,0.05)");
  grad.addColorStop(1, "rgba(255,235,205,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  return new THREE.CanvasTexture(canvas);
}

interface ShaftProps {
  position: [number, number, number];
  height?: number;
  width?: number;
  tiltX?: number;
  tiltZ?: number;
}

const BASE_OPACITY = 0.4;

/** A pair of crossed, additive-blended soft planes standing in for a raking shaft of dawn
 * light -- cheap, non-shadow-casting, reads reasonably from most viewing angles. Fades in with
 * the same light-rise curve as the rest of the scene, so it never appears in the dark opening. */
function Shaft({ position, height = 12, width = 2.4, tiltX = -0.32, tiltZ = 0.08 }: ShaftProps) {
  const tex = useMemo(() => buildShaftTexture(), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: true,
        side: THREE.DoubleSide,
      }),
    [tex],
  );

  useFrame(() => {
    const rise = rangeEmphasis(
      scrollState.progress,
      LIGHTING_RISE_RANGE[0],
      1,
      (LIGHTING_RISE_RANGE[1] - LIGHTING_RISE_RANGE[0]) / 2,
    );
    material.opacity = rise * BASE_OPACITY;
  });

  return (
    <group position={position} rotation={[tiltX, 0, tiltZ]}>
      <mesh material={material} position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
      </mesh>
      <mesh material={material} position={[0, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[width, height]} />
      </mesh>
    </group>
  );
}

const SHAFT_POSITIONS: ShaftProps[] = [
  { position: [4.8, 0, 14.3] },
  { position: [4.8, 0, 10.9], width: 2.0, height: 11 },
  { position: [-4.8, 0, 7.6], width: 1.8, height: 10, tiltX: -0.3, tiltZ: -0.1 },
];

/** Raking shafts of dawn light between the entrance columns, with fine dust catching the glow. */
export function LightShafts() {
  return (
    <group>
      {SHAFT_POSITIONS.map((s, i) => (
        <Shaft key={i} {...s} />
      ))}
      {SHAFT_POSITIONS.map((s, i) => (
        <Sparkles
          key={i}
          count={40}
          scale={[1.6, s.height ?? 12, 1.6]}
          position={[s.position[0], (s.height ?? 12) / 2, s.position[2]]}
          size={0.6}
          speed={0.08}
          color="#ffe6bd"
          opacity={0.35}
        />
      ))}
    </group>
  );
}
