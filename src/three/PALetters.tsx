import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ConstructedMesh } from "./ConstructedMesh";
import { rangeEmphasis } from "./cameraPath";
import { scrollState } from "./store";

const DEPTH = 0.22;

function box(x: number, y: number, w: number, h: number): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(w, h, DEPTH);
  geo.translate(x + w / 2, y + h / 2, 0);
  return geo;
}

/** Blocky inscriptional "P": stem + top bar + bowl side + mid bar, built as stone strokes (no font dependency). */
function buildLetterP(): THREE.BufferGeometry {
  const strokes = [
    box(0, 0, 0.16, 1), // stem
    box(0, 0.84, 0.62, 0.16), // top bar
    box(0.46, 0.5, 0.16, 0.5), // bowl right
    box(0, 0.5, 0.62, 0.16), // mid bar
  ];
  return mergeGeometries(strokes);
}

/** Blocky inscriptional "A": two angled legs + crossbar, built from rotated stone strokes. */
function buildLetterA(): THREE.BufferGeometry {
  const legLength = Math.hypot(0.425, 1.08) + 0.05;
  const angle = Math.atan2(0.425, 1.08);

  const leftLeg = new THREE.BoxGeometry(0.16, legLength, DEPTH);
  leftLeg.rotateZ(-angle);
  leftLeg.translate(0.2125, 0.5, 0);

  const rightLeg = new THREE.BoxGeometry(0.16, legLength, DEPTH);
  rightLeg.rotateZ(angle);
  rightLeg.translate(0.6375, 0.5, 0);

  const crossbar = box(0.155, 0.31, 0.54, 0.14);

  return mergeGeometries([leftLeg, rightLeg, crossbar]);
}

interface PALettersProps {
  position: [number, number, number];
  constructionRange: [number, number];
  visibleRange: [number, number];
}

export function PALetters({ position, constructionRange, visibleRange }: PALettersProps) {
  const pGeometry = useMemo(() => buildLetterP(), []);
  const aGeometry = useMemo(() => buildLetterA(), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const emphasis = rangeEmphasis(scrollState.progress, visibleRange[0], visibleRange[1], 0.06);
    groupRef.current.visible = emphasis > 0.01;
  });

  const scale = 1.9;

  return (
    <group ref={groupRef} position={position}>
      <group position={[-1.05 * scale, 0, 0]} scale={scale}>
        <ConstructedMesh geometry={pGeometry} color="#c8a25a" constructionRange={constructionRange} gold />
      </group>
      <group position={[-0.1 * scale, 0, 0]} scale={scale}>
        <ConstructedMesh geometry={aGeometry} color="#c8a25a" constructionRange={constructionRange} gold />
      </group>
    </group>
  );
}

interface BareTextProps {
  anchor: [number, number, number];
  range: [number, number];
  scale?: number;
  children: React.ReactNode;
  className?: string;
}

/** Typography with no card/background -- just text, physically placed in the architectural space. */
export function BareText({ anchor, range, scale = 0.24, children, className }: BareTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const emphasis = rangeEmphasis(scrollState.progress, range[0], range[1]);
    el.style.opacity = String(emphasis);
    el.style.transform = `translateY(${(1 - emphasis) * 14}px)`;
    el.style.visibility = emphasis <= 0.01 ? "hidden" : "visible";
  });

  return (
    <Html transform occlude={false} position={anchor} scale={scale} style={{ pointerEvents: "none" }}>
      <div ref={ref} className={className} style={{ opacity: 0 }}>
        {children}
      </div>
    </Html>
  );
}
