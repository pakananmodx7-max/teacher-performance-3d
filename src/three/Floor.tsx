import { useMemo } from "react";
import * as THREE from "three";
import { MeanderRing } from "./Meander";
import { PALETTE, getFloorNormalTexture, bakedRgb } from "./materials";

function buildSlabTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = bakedRgb(PALETTE.stoneFloor);
  ctx.fillRect(0, 0, size, size);

  // Per-slab tonal variation between the dark/light charcoal bounds
  const slabPx = size / 4;
  for (let gy = 0; gy < 4; gy++) {
    for (let gx = 0; gx < 4; gx++) {
      const lighter = Math.random() > 0.5;
      ctx.fillStyle = lighter ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.05)";
      ctx.fillRect(gx * slabPx, gy * slabPx, slabPx, slabPx);
      // subtle per-slab mottling so slabs don't read as flat fills
      for (let i = 0; i < 10; i++) {
        const x = gx * slabPx + Math.random() * slabPx;
        const y = gy * slabPx + Math.random() * slabPx;
        const r = 12 + Math.random() * 30;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, "rgba(255,255,255,0.03)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(gx * slabPx, gy * slabPx, slabPx, slabPx);
      }
    }
  }

  // Joint lines
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
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
  // colorSpace intentionally left at the default (linear) -- see bakedRgb in materials.ts.
  return tex;
}

interface FloorProps {
  width: number;
  depth: number;
  centerZ: number;
  inlayZ?: number;
}

export function Floor({ width, depth, centerZ, inlayZ }: FloorProps) {
  const material = useMemo(() => {
    const tex = buildSlabTexture();
    const slabsAcross = width / 2;
    const slabsDeep = depth / 2;
    const repeatX = slabsAcross / 4;
    const repeatY = slabsDeep / 4;
    tex.repeat.set(repeatX, repeatY);

    const normalTex = getFloorNormalTexture().clone();
    normalTex.needsUpdate = true;
    normalTex.repeat.set(repeatX, repeatY);

    return new THREE.MeshPhysicalMaterial({
      map: tex,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(0.5, 0.5),
      // The map already carries the full charcoal tone (baked in bakedRgb); tinting with the
      // same dark PALETTE.stoneFloor here would multiply it, needlessly crushing it further.
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0,
      clearcoat: 0.12,
      clearcoatRoughness: 0.45,
      envMapIntensity: 0.3,
    });
  }, [width, depth]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, centerZ]} receiveShadow material={material}>
        <planeGeometry args={[width, depth]} />
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
