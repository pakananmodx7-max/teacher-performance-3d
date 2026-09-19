import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "./materials";
import { scrollState } from "./store";

function buildSkyTexture(): THREE.CanvasTexture {
  const w = 8;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, PALETTE.skyTop);
  grad.addColorStop(0.55, PALETTE.skyMid);
  grad.addColorStop(1, PALETTE.skyHorizon);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function DistantSilhouette({ z, spread, height, opacity }: { z: number; spread: number; height: number; opacity: number }) {
  const points = useMemo(() => {
    const pts: [number, number][] = [[-spread, 0]];
    const segments = 10;
    for (let i = 0; i <= segments; i++) {
      const x = -spread + (i / segments) * spread * 2;
      const y = Math.max(0.3, height * (0.4 + 0.6 * Math.sin(i * 1.7) * Math.sin(i * 0.6 + 1) * 0.5 + 0.5));
      pts.push([x, y]);
    }
    pts.push([spread, 0]);
    return pts;
  }, [spread, height]);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    for (const [x, y] of points.slice(1)) shape.lineTo(x, y);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [points]);

  return (
    <mesh geometry={geometry} position={[0, 0, z]}>
      <meshBasicMaterial color={PALETTE.skyHorizon} transparent opacity={opacity} fog />
    </mesh>
  );
}

export function Backdrop() {
  const skyTex = useMemo(() => buildSkyTexture(), []);
  const skyMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    // Sky brightens very slightly as the sequence approaches the entrance (dawn cue).
    const p = scrollState.progress;
    const dawn = THREE.MathUtils.clamp((p - 0.4) / 0.5, 0, 1);
    if (skyMatRef.current) {
      skyMatRef.current.color.setScalar(1 + dawn * 0.18);
    }
  });

  return (
    <group>
      <mesh scale={[1, 1, 1]}>
        <sphereGeometry args={[140, 24, 16]} />
        <meshBasicMaterial ref={skyMatRef} map={skyTex} side={THREE.BackSide} fog={false} />
      </mesh>
      <DistantSilhouette z={-110} spread={70} height={14} opacity={0.55} />
      <DistantSilhouette z={-95} spread={55} height={9} opacity={0.4} />
    </group>
  );
}
