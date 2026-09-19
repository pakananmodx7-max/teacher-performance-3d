import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "./store";
import { LIGHTING_RISE_RANGE } from "./journey";
import { rangeEmphasis } from "./cameraPath";

export function LightingRig() {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  useFrame(() => {
    const p = scrollState.progress;
    // Opening begins nearly black; light rises as the architecture finishes constructing.
    const rise = rangeEmphasis(p, LIGHTING_RISE_RANGE[0], 1, (LIGHTING_RISE_RANGE[1] - LIGHTING_RISE_RANGE[0]) / 2);
    const baseline = 0.06;
    const level = baseline + rise * (1 - baseline);

    if (sunRef.current) sunRef.current.intensity = 0.15 + level * 2.6;
    if (ambientRef.current) ambientRef.current.intensity = 0.03 + level * 0.22;
    if (fogRef.current) {
      fogRef.current.near = THREE.MathUtils.lerp(10, 18, level);
      fogRef.current.far = THREE.MathUtils.lerp(38, 65, level);
    }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#07101b", 10, 38]} />
      <ambientLight ref={ambientRef} intensity={0.03} />
      <directionalLight
        ref={sunRef}
        position={[14, 22, 10]}
        intensity={0.15}
        color="#fff3de"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-bias={-0.0015}
      />
      <directionalLight position={[-16, 10, -6]} intensity={0.22} color="#bcd0f0" />
    </>
  );
}
