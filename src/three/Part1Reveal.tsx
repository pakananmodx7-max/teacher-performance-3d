import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { BareText } from "./PALetters";
import { PART1_RANGE } from "./journey";
import { rangeEmphasis } from "./cameraPath";
import { scrollState } from "./store";

const REVEAL_Z = -22;

export function Part1Reveal() {
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const emphasis = rangeEmphasis(scrollState.progress, PART1_RANGE[0], PART1_RANGE[1], 0.03);
    if (spotRef.current) {
      spotRef.current.intensity = emphasis * 18;
    }
  });

  return (
    <group>
      <spotLight
        ref={spotRef}
        position={[0, 12, REVEAL_Z]}
        target-position={[0, 1.2, REVEAL_Z]}
        angle={0.35}
        penumbra={0.7}
        color="#ffd9a0"
        intensity={0}
        distance={20}
        castShadow={false}
      />
      <Sparkles
        count={120}
        scale={[3, 4, 3]}
        position={[0, 3, REVEAL_Z]}
        size={2}
        speed={0.2}
        color="#c8a25a"
        opacity={0.7}
      />

      <BareText anchor={[0, 4.6, REVEAL_Z]} range={PART1_RANGE} scale={0.3} className="part1-index">
        ส่วนที่ 1
      </BareText>
      <BareText anchor={[0, 3.5, REVEAL_Z]} range={[PART1_RANGE[0] + 0.01, PART1_RANGE[1]]} scale={0.24} className="part1-title">
        ข้อตกลงในการพัฒนางาน
      </BareText>
      <BareText anchor={[0, 2.85, REVEAL_Z]} range={[PART1_RANGE[0] + 0.015, PART1_RANGE[1]]} scale={0.18} className="part1-subtitle">
        ตามมาตรฐานตำแหน่ง
      </BareText>
    </group>
  );
}
