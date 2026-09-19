import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial, createMarbleMaterial, PALETTE } from "./materials";
import { ConstructedMesh } from "./ConstructedMesh";
import { rangeEmphasis } from "./cameraPath";
import { scrollState } from "./store";

/** A cylinder whose radius is perturbed per-angle to cut real concave flute grooves into the surface. */
function buildFlutedShaftGeometry(
  bottomRadius: number,
  topRadius: number,
  height: number,
  flutes: number,
  radialSegments: number,
  heightSegments: number,
) {
  const geometry = new THREE.CylinderGeometry(
    topRadius,
    bottomRadius,
    height,
    radialSegments,
    heightSegments,
    true,
  );
  const position = geometry.attributes.position;
  const fluteDepth = bottomRadius * 0.09;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const angle = Math.atan2(z, x);
    const radius = Math.hypot(x, z);
    if (radius < 1e-6) continue;
    const groove = fluteDepth * (0.5 + 0.5 * Math.cos(flutes * angle));
    const scale = (radius - groove) / radius;
    position.setX(i, x * scale);
    position.setZ(i, z * scale);
  }

  geometry.computeVertexNormals();
  return geometry;
}

export interface GreekColumnProps {
  position: [number, number, number];
  height?: number;
  constructionRange: [number, number];
}

/** A full Doric-inspired column: plinth, torus base, fluted tapered shaft, necking, echinus and abacus. */
export function GreekColumn({ position, height = 9, constructionRange }: GreekColumnProps) {
  const shaftHeight = height * 0.8;
  const bottomR = 0.475;
  const topR = 0.39;

  const shaftGeometry = useMemo(
    () => buildFlutedShaftGeometry(bottomR, topR, shaftHeight, 24, 96, 1),
    [shaftHeight],
  );

  // Shared physical-marble material for the trim (base/capital): real normal-map relief and a
  // touch of clearcoat so these edges pick up rim light instead of reading flat/computer-generated.
  const trimMaterial = useMemo(() => createMarbleMaterial(1.4, { roughness: 0.56 }), []);
  const goldTrim = useMemo(() => createGoldMaterial({ emissiveIntensity: 0.18 }), []);
  const baseRef = useRef<THREE.Group>(null);
  const capitalRef = useRef<THREE.Group>(null);
  const [start, end] = constructionRange;
  const trimRevealAt = start + (end - start) * 0.3;

  useFrame(() => {
    const emphasis = rangeEmphasis(scrollState.progress, trimRevealAt, 1, 0.02);
    const visible = emphasis > 0.02;
    if (baseRef.current) baseRef.current.visible = visible;
    if (capitalRef.current) capitalRef.current.visible = visible;
  });

  return (
    <group position={position}>
      {/* Base: square plinth + torus + transition (hidden until the shaft is well under construction,
          so nothing casts a shadow before there is a visible column to cast it) */}
      <group ref={baseRef}>
        <mesh position={[0, 0.09, 0]} castShadow receiveShadow material={trimMaterial}>
          <boxGeometry args={[1.3, 0.18, 1.3]} />
        </mesh>
        <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow material={trimMaterial}>
          <torusGeometry args={[0.5, 0.09, 12, 28]} />
        </mesh>
        <mesh position={[0, 0.43, 0]} castShadow material={trimMaterial}>
          <cylinderGeometry args={[0.51, 0.44, 0.14, 28]} />
        </mesh>
      </group>

      {/* Fluted shaft (constructed: points -> wireframe -> marble) */}
      <group position={[0, 0.5 + shaftHeight / 2, 0]}>
        <ConstructedMesh geometry={shaftGeometry} color={PALETTE.marbleBase} constructionRange={constructionRange} />
      </group>

      {/* Capital: necking, echinus, abacus */}
      <group ref={capitalRef} position={[0, 0.5 + shaftHeight, 0]}>
        <mesh position={[0, 0.09, 0]} castShadow material={trimMaterial}>
          <cylinderGeometry args={[0.42, topR, 0.18, 28]} />
        </mesh>
        <mesh position={[0, 0.33, 0]} castShadow material={trimMaterial}>
          <cylinderGeometry args={[0.62, 0.42, 0.3, 28]} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow material={trimMaterial}>
          <boxGeometry args={[1.42, 0.1, 1.42]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow material={trimMaterial}>
          <boxGeometry args={[1.32, 0.12, 1.32]} />
        </mesh>
        <mesh position={[0, 0.665, 0]}>
          <boxGeometry args={[1.34, 0.02, 1.34]} />
          <primitive object={goldTrim} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
