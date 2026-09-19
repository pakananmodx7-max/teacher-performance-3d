import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial } from "./materials";
import { rangeEmphasis } from "./cameraPath";
import { scrollState } from "./store";

/** One classical Greek-key "hook" unit, repeated and offset to build the full motif. */
const UNIT: [number, number][] = [
  [0, 0],
  [0, 3],
  [3, 3],
  [3, 1],
  [1, 1],
  [1, 2],
  [2, 2],
  [2, 0],
  [4, 0],
];

function buildMeanderPoints(repeats: number, step: number, plane: "xy" | "xz" = "xy"): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let r = 0; r < repeats; r++) {
    const offsetX = r * 4 * step;
    for (const [ux, uy] of UNIT) {
      const x = offsetX + ux * step;
      const h = uy * step;
      points.push(plane === "xy" ? new THREE.Vector3(x, h, 0) : new THREE.Vector3(x, 0, h));
    }
  }
  return points;
}

interface GenerativeMeanderProps {
  position: [number, number, number];
  repeats?: number;
  step?: number;
  range: [number, number];
}

/** The opening's signature: a gold line that draws itself across space, point by point, as the user scrolls. */
export function GenerativeMeander({ position, repeats = 5, step = 0.32, range }: GenerativeMeanderProps) {
  const points = useMemo(() => buildMeanderPoints(repeats, step, "xy"), [repeats, step]);
  const totalWidth = repeats * 4 * step;

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const lastCount = useRef(-1);
  const material = useMemo(() => createGoldMaterial({ emissiveIntensity: 0.55 }), []);
  const tipMaterial = useMemo(() => createGoldMaterial({ emissiveIntensity: 1.1 }), []);

  useFrame(() => {
    const p = scrollState.progress;
    const [start, end] = range;
    const local = THREE.MathUtils.clamp((p - start) / (end - start), 0, 1);
    const emphasis = rangeEmphasis(p, start, end, 0.05);

    if (groupRef.current) {
      groupRef.current.visible = emphasis > 0.005 && local > 0;
    }
    if (!groupRef.current?.visible) return;

    const count = Math.max(2, Math.round(local * points.length));
    if (count !== lastCount.current && meshRef.current) {
      lastCount.current = count;
      const visible = points.slice(0, count);
      meshRef.current.geometry.dispose();
      meshRef.current.geometry = new THREE.BufferGeometry();
      // Fewer than ~4 points make computeFrenetFrames() ill-conditioned on a near-straight
      // curve (it can emit NaN normals), which can corrupt the whole WebGL frame -- so the
      // tube only appears once there is enough curve for a stable frame; the tip sphere alone
      // represents the very start of the line being drawn.
      if (visible.length >= 4) {
        const curve = new THREE.CatmullRomCurve3(visible, false, "catmullrom", 0.05);
        const tube = new THREE.TubeGeometry(curve, Math.max(8, visible.length * 2), 0.02, 6, false);
        const pos = tube.attributes.position;
        let valid = true;
        for (let i = 0; i < pos.count; i++) {
          if (!Number.isFinite(pos.getX(i)) || !Number.isFinite(pos.getY(i)) || !Number.isFinite(pos.getZ(i))) {
            valid = false;
            break;
          }
        }
        if (valid) {
          meshRef.current.geometry = tube;
        } else {
          tube.dispose();
        }
      }
      if (tipRef.current) {
        tipRef.current.position.copy(visible[visible.length - 1] ?? points[0]);
      }
    }

    material.opacity = emphasis;
    material.transparent = true;
    tipMaterial.opacity = emphasis * (1 - local * 0.4);
    tipMaterial.transparent = true;
  });

  return (
    <group ref={groupRef} position={[position[0] - totalWidth / 2, position[1], position[2]]}>
      <mesh ref={meshRef} material={material}>
        <bufferGeometry />
      </mesh>
      <mesh ref={tipRef} material={tipMaterial}>
        <sphereGeometry args={[0.05, 10, 10]} />
      </mesh>
    </group>
  );
}

interface MeanderRingProps {
  radius: number;
  y?: number;
}

/** A static Greek-key ring used as the floor inlay border near the ceremonial entrance. */
export function MeanderRing({ radius, y = 0.011 }: MeanderRingProps) {
  const geometry = useMemo(() => {
    const segments = 96;
    const toothDepth = radius * 0.055;
    const shape = new THREE.Shape();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const key = Math.floor((i / segments) * 24) % 2 === 0 ? 1 : 0;
      const r = radius + key * toothDepth;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    }
    const hole = new THREE.Path();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = radius - toothDepth * 1.4;
      hole.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    shape.holes.push(hole);
    const geo = new THREE.ShapeGeometry(shape, 1);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [radius]);

  const material = useMemo(() => createGoldMaterial({ emissiveIntensity: 0.1 }), []);

  return <mesh geometry={geometry} material={material} position={[0, y, 0]} receiveShadow />;
}
