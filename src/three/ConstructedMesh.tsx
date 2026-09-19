import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMarbleMaterial } from "./materials";
import { rangeEmphasis } from "./cameraPath";
import { scrollState } from "./store";

export interface ConstructedMeshProps {
  geometry: THREE.BufferGeometry;
  color: string;
  constructionRange: [number, number];
  /** When true the solid phase uses gold instead of marble (for typography / trim). */
  gold?: boolean;
}

/** Cross-fades a mesh through gold points -> gold wireframe -> solid material as scroll progress enters its range. */
export function ConstructedMesh({ geometry, color, constructionRange, gold = false }: ConstructedMeshProps) {
  const [start, end] = constructionRange;
  const span = Math.max(end - start, 0.001);

  const pointsMat = useMemo(
    () => new THREE.PointsMaterial({ color: "#c8a25a", size: 0.035, transparent: true, opacity: 0 }),
    [],
  );
  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#c8a25a",
        wireframe: true,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const solidMat = useMemo(() => {
    if (gold) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.82,
        roughness: 0.28,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0,
      });
    }
    const mat = createMarbleMaterial(0.6);
    mat.color = new THREE.Color(color);
    mat.transparent = true;
    mat.opacity = 0;
    return mat;
  }, [color, gold]);

  const pointsRef = useRef<THREE.Points>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const solidRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = scrollState.progress;
    const pointsOpacity =
      rangeEmphasis(p, start, start + span * 0.22, span * 0.1) *
      (1 - rangeEmphasis(p, start + span * 0.3, end, span * 0.05));
    const wireOpacity = rangeEmphasis(p, start + span * 0.15, start + span * 0.55, span * 0.12);
    const solidOpacity = rangeEmphasis(p, start + span * 0.5, 1, span * 0.18);

    pointsMat.opacity = Math.max(0, pointsOpacity) * 0.9;
    wireMat.opacity = Math.max(0, wireOpacity) * 0.7;
    solidMat.opacity = solidOpacity;

    if (pointsRef.current) pointsRef.current.visible = pointsMat.opacity > 0.01;
    if (wireRef.current) wireRef.current.visible = wireMat.opacity > 0.01;
    if (solidRef.current) solidRef.current.visible = solidOpacity > 0.01;
  });

  return (
    <group>
      <points ref={pointsRef} geometry={geometry} material={pointsMat} />
      <mesh ref={wireRef} geometry={geometry} material={wireMat} />
      <mesh ref={solidRef} geometry={geometry} material={solidMat} castShadow receiveShadow />
    </group>
  );
}
