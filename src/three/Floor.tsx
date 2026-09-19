import { useMemo } from "react";
import * as THREE from "three";
import { MeanderRing } from "./Meander";
import { PALETTE } from "./materials";

function buildSlabTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = PALETTE.stoneFloor;
  ctx.fillRect(0, 0, size, size);

  // Faint per-slab tonal variation
  const slabPx = size / 4;
  for (let gy = 0; gy < 4; gy++) {
    for (let gx = 0; gx < 4; gx++) {
      const shade = 8 + Math.floor(Math.random() * 10);
      ctx.fillStyle = `rgba(255,255,255,${shade / 255})`;
      ctx.fillRect(gx * slabPx, gy * slabPx, slabPx, slabPx);
    }
  }

  // Joint lines
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    const p = i * slabPx;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface FloorProps {
  width: number;
  depth: number;
  centerZ: number;
  inlayZ?: number;
}

export function Floor({ width, depth, centerZ, inlayZ }: FloorProps) {
  const texture = useMemo(() => {
    const tex = buildSlabTexture();
    const slabsAcross = width / 2;
    const slabsDeep = depth / 2;
    tex.repeat.set(slabsAcross / 4, slabsDeep / 4);
    return tex;
  }, [width, depth]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, centerZ]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={texture} color={PALETTE.stoneFloor} roughness={0.28} metalness={0.05} />
      </mesh>
      {inlayZ !== undefined && (
        <group position={[0, 0, inlayZ]}>
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[2.3, 48]} />
            <meshStandardMaterial color={PALETTE.marbleHighlight} roughness={0.35} metalness={0.05} />
          </mesh>
          <MeanderRing radius={2.5} />
        </group>
      )}
    </group>
  );
}
