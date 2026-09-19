import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "./store";
import { LIGHTING_RISE_RANGE } from "./journey";
import { rangeEmphasis } from "./cameraPath";
import { PALETTE } from "./materials";

const FOG_COOL = new THREE.Color(PALETTE.skyHorizon);
const FOG_WARM = new THREE.Color(PALETTE.skyDawn);
const fogMix = new THREE.Color();

export function LightingRig() {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  useFrame(() => {
    const p = scrollState.progress;
    // Opening begins nearly dark; light rises gently as the architecture finishes constructing.
    // The floor is never far above the baseline lift though -- shadows keep visible detail
    // throughout instead of collapsing to featureless black.
    const rise = rangeEmphasis(p, LIGHTING_RISE_RANGE[0], 1, (LIGHTING_RISE_RANGE[1] - LIGHTING_RISE_RANGE[0]) / 2);
    const baseline = 0.16;
    const level = baseline + rise * (1 - baseline);
    const dawn = THREE.MathUtils.clamp((p - 0.4) / 0.5, 0, 1);

    if (sunRef.current) sunRef.current.intensity = 0.4 + level * 1.3;
    if (fillRef.current) fillRef.current.intensity = 0.25 + level * 0.45;
    if (ambientRef.current) ambientRef.current.intensity = 0.55 + level * 0.35;
    if (hemiRef.current) hemiRef.current.intensity = 0.85 + level * 0.45;
    if (fogRef.current) {
      fogRef.current.near = THREE.MathUtils.lerp(12, 20, level);
      fogRef.current.far = THREE.MathUtils.lerp(40, 68, level);
      fogMix.copy(FOG_COOL).lerp(FOG_WARM, dawn * 0.4);
      fogRef.current.color.copy(fogMix);
    }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={[PALETTE.skyHorizon, 12, 40]} />
      <ambientLight ref={ambientRef} intensity={0.55} />
      {/* Sky colour here lights up-facing surfaces (the floor, the stairs' treads) -- kept
          light so those never crush to black; ground colour is the warm bounce for undersides. */}
      <hemisphereLight ref={hemiRef} args={["#6b7a8c", "#4a3f34", 0.85]} color="#6b7a8c" groundColor="#4a3f34" />

      {/* Key sun: warm, soft, from over the camera's right shoulder. The shadow camera's
          default target sits at the world origin, but the architecture (and the floor
          especially) extends from z~3 out to z~46 -- well outside a target-at-origin
          frustum. An explicit target centred on the scene (with a matching wider frustum)
          keeps the whole floor inside shadow-map coverage. */}
      <directionalLight
        ref={sunRef}
        position={[20, 24, 22]}
        intensity={0.4}
        color="#ffe9c9"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0015}
        shadow-normalBias={0.03}
        shadow-radius={4}
      >
        <object3D attach="target" position={[0, 2, 24]} />
      </directionalLight>

      {/* Large cool fill from front-left, keeps shadow faces readable */}
      <directionalLight ref={fillRef} position={[-18, 12, 20]} intensity={0.25} color="#b9c9e6" />
    </>
  );
}
