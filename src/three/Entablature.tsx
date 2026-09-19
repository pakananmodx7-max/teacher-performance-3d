import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial, PALETTE } from "./materials";
import { rangeEmphasis } from "./cameraPath";
import { scrollState } from "./store";
import { COLUMN_CONSTRUCTION_BASE } from "./journey";

function trianglePediment(width: number, height: number, depth: number, inset: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(0, height);
  shape.closePath();
  const outer = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  outer.translate(0, 0, -depth / 2);

  const innerShape = new THREE.Shape();
  const iw = width - inset * 2.4;
  const ih = height - inset * 1.6;
  innerShape.moveTo(-iw / 2, inset * 0.3);
  innerShape.lineTo(iw / 2, inset * 0.3);
  innerShape.lineTo(0, ih);
  innerShape.closePath();
  const inner = new THREE.ExtrudeGeometry(innerShape, { depth: depth * 0.4, bevelEnabled: false });
  inner.translate(0, 0, depth / 2 - depth * 0.4);

  return { outer, inner };
}

/** Small abstract emblem: a laurel-like pair of arcs flanking a vertical mark, centered on the pediment. */
function Emblem() {
  const material = useMemo(() => createGoldMaterial({ emissiveIntensity: 0.5 }), []);
  const leafGeo = useMemo(() => new THREE.TorusGeometry(0.32, 0.02, 6, 20, Math.PI * 0.85), []);
  return (
    <group position={[0, 0.55, 0.15]}>
      <mesh geometry={leafGeo} material={material} rotation={[0, 0, Math.PI * 0.08]} position={[-0.15, 0, 0]} />
      <mesh geometry={leafGeo} material={material} rotation={[0, Math.PI, -Math.PI * 0.08]} position={[0.15, 0, 0]} />
      <mesh material={material} position={[0, -0.02, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
      </mesh>
    </group>
  );
}

interface EntablatureProps {
  width: number;
  z: number;
  columnTopY: number;
}

export function Entablature({ width, z, columnTopY }: EntablatureProps) {
  const { outer, inner } = useMemo(() => trianglePediment(width * 0.86, width * 0.18, 1.4, 0.5), [width]);
  const goldEdge = useMemo(() => createGoldMaterial(), []);
  const groupRef = useRef<THREE.Group>(null);

  // Appears only once the columns supporting it have finished constructing --
  // otherwise it would cast a shadow with no visible caster beneath it.
  const revealAt = COLUMN_CONSTRUCTION_BASE[1] + 0.06;

  useFrame(() => {
    if (!groupRef.current) return;
    const emphasis = rangeEmphasis(scrollState.progress, revealAt, 1, 0.04);
    groupRef.current.visible = emphasis > 0.02;
  });

  return (
    <group ref={groupRef} position={[0, columnTopY, z]}>
      {/* Architrave */}
      <mesh position={[0, 0.33, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.65, 1.1]} />
        <meshStandardMaterial color={PALETTE.marbleBase} roughness={0.6} />
      </mesh>
      {/* Layered moldings */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <boxGeometry args={[width + 0.3, 0.12, 1.2]} />
        <meshStandardMaterial color={PALETTE.marbleShadow} roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[width + 0.1, 0.03, 1.22]} />
        <primitive object={goldEdge} attach="material" />
      </mesh>

      {/* Pediment */}
      <group position={[0, 0.82, 0]}>
        <mesh geometry={outer} castShadow receiveShadow>
          <meshStandardMaterial color={PALETTE.marbleBase} roughness={0.6} />
        </mesh>
        <mesh geometry={inner}>
          <meshStandardMaterial color={PALETTE.marbleShadow} roughness={0.7} />
        </mesh>
        <Emblem />
      </group>
    </group>
  );
}
