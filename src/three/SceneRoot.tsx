import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, SSAO, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { ShaderWarmup } from "./ShaderWarmup";
import { LightingRig } from "./LightingRig";
import { Backdrop } from "./Backdrop";
import { Floor } from "./Floor";
import { Stairs, Platform } from "./Architecture";
import { Colonnade } from "./Colonnade";
import { Entablature } from "./Entablature";
import { GenerativeMeander } from "./Meander";
import { LightShafts } from "./LightShafts";
import { PALetters, BareText } from "./PALetters";
import { Part1Reveal } from "./Part1Reveal";
import {
  MEANDER_RANGE,
  PA_CONSTRUCTION_RANGE,
  PA_VISIBLE_RANGE,
  EYEBROW_RANGE,
  THAI_SUBTITLE_RANGE,
  ENTRY_Z,
  LOWER_FLOOR_Z,
  PLATFORM_Y,
} from "./journey";

export function SceneRoot() {
  const floorCenterZ = (LOWER_FLOOR_Z[0] + LOWER_FLOOR_Z[1]) / 2;
  const floorDepth = LOWER_FLOOR_Z[1] - LOWER_FLOOR_Z[0];

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      camera={{ position: [0, 1.7, 18], fov: 45, near: 0.1, far: 200 }}
    >
      <CameraRig />
      <LightingRig />
      <Backdrop />

      <Floor width={26} depth={floorDepth} centerZ={floorCenterZ} inlayZ={11} />
      <Stairs />
      <Platform />

      <Colonnade />
      <Entablature width={12} z={ENTRY_Z} columnTopY={PLATFORM_Y + 8.4} />
      <LightShafts />

      <GenerativeMeander position={[0, 2.6, 10]} range={MEANDER_RANGE} />

      <PALetters position={[0, 3.4, 10]} constructionRange={PA_CONSTRUCTION_RANGE} visibleRange={PA_VISIBLE_RANGE} />
      <BareText anchor={[0, 4.35, 10]} range={EYEBROW_RANGE} scale={0.09} className="eyebrow-bare">
        PERFORMANCE AGREEMENT
      </BareText>
      <BareText anchor={[0, 2.55, 10]} range={THAI_SUBTITLE_RANGE} scale={0.16} className="thai-bare">
        ข้อตกลงในการพัฒนางาน
      </BareText>

      <Part1Reveal />

      <ShaderWarmup />

      <EffectComposer multisampling={0} enableNormalPass>
        <SSAO
          intensity={2.2}
          radius={0.28}
          samples={12}
          luminanceInfluence={0.4}
          bias={0.03}
          blendFunction={BlendFunction.MULTIPLY}
        />
        <Bloom luminanceThreshold={0.65} luminanceSmoothing={0.25} intensity={0.55} mipmapBlur radius={0.5} />
        <Vignette eskil={false} offset={0.15} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
