import { useMemo } from "react";
import { createMarbleMaterial, PALETTE } from "./materials";
import { STAIR_BOTTOM_Z, STAIR_TOP_Z, PLATFORM_Y, PLATFORM_Z } from "./journey";

const STEP_COUNT = 6;
const STEP_WIDTH = 9;
const RISE = PLATFORM_Y / STEP_COUNT;
const TREAD = (STAIR_BOTTOM_Z - STAIR_TOP_Z) / STEP_COUNT;

export function Stairs() {
  const steps = useMemo(
    () =>
      Array.from({ length: STEP_COUNT }, (_, i) => ({
        y: RISE * (i + 1) - RISE / 2,
        z: STAIR_BOTTOM_Z - TREAD * i - TREAD / 2,
      })),
    [],
  );

  return (
    <group>
      {steps.map((s, i) => (
        <mesh key={i} position={[0, s.y, s.z]} castShadow receiveShadow>
          <boxGeometry args={[STEP_WIDTH, RISE, TREAD]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? PALETTE.marbleBase : PALETTE.marbleShadow}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Platform() {
  const depth = PLATFORM_Z[1] - PLATFORM_Z[0];
  const centerZ = (PLATFORM_Z[0] + PLATFORM_Z[1]) / 2;
  const material = useMemo(() => createMarbleMaterial(3), []);

  return (
    <group>
      <mesh position={[0, PLATFORM_Y / 2, centerZ]} castShadow receiveShadow>
        <boxGeometry args={[18, PLATFORM_Y, depth]} />
        <primitive object={material} attach="material" />
      </mesh>
      {/* Front riser edge trim */}
      <mesh position={[0, PLATFORM_Y - 0.03, PLATFORM_Z[1] + 0.001]}>
        <boxGeometry args={[18.1, 0.04, 0.08]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}
