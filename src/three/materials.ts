import * as THREE from "three";

export const PALETTE = {
  marbleBase: "#ddd7ca",
  marbleShadow: "#918c83",
  marbleHighlight: "#f1ece2",
  gold: "#c8a25a",
  stoneFloor: "#22262d",
  stoneFloorDark: "#171a1f",
  stoneFloorLight: "#2b3038",
  skyTop: "#0a1220",
  skyUpper: "#16233a",
  skyHorizon: "#4d5c70",
  skyDawn: "#a9795c",
};

// ---------- procedural height-field -> normal map ----------
// Cheap, seed-free bump generation: a handful of soft radial blobs plus fine
// grain, converted to a tangent-space normal map via a central-difference
// filter. This is what keeps marble/stone from reading as flat and plastic
// under directional light without needing an external texture asset.

function buildHeightBlobs(size: number, blobCount: number, grain: number): Float32Array {
  const h = new Float32Array(size * size);
  for (let i = 0; i < h.length; i++) h[i] = (Math.random() - 0.5) * grain;
  for (let b = 0; b < blobCount; b++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const r = 8 + Math.random() * 36;
    const amp = (Math.random() - 0.5) * 0.5;
    const minX = Math.max(0, Math.floor(cx - r));
    const maxX = Math.min(size, Math.ceil(cx + r));
    const minY = Math.max(0, Math.floor(cy - r));
    const maxY = Math.min(size, Math.ceil(cy + r));
    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        const d = Math.hypot(x - cx, y - cy) / r;
        if (d < 1) h[y * size + x] += amp * (1 - d * d);
      }
    }
  }
  return h;
}

function heightArrayToNormalTexture(size: number, h: Float32Array, strength: number): THREE.CanvasTexture {
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)];
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = at(x - 1, y);
      const r = at(x + 1, y);
      const u = at(x, y - 1);
      const d = at(x, y + 1);
      const nx = (l - r) * strength;
      const ny = (u - d) * strength;
      const nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const i = (y * size + x) * 4;
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      img.data[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

let marbleTexture: THREE.CanvasTexture | null = null;
let marbleNormalTexture: THREE.CanvasTexture | null = null;
let floorNormalTexture: THREE.CanvasTexture | null = null;

/** Warm ivory marble: soft mottling + wandering grey veins over a lighter base than before. */
function buildMarbleCanvas(): HTMLCanvasElement {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = PALETTE.marbleBase;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 160; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 20 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    const warm = Math.random() > 0.5;
    grad.addColorStop(0, warm ? "rgba(241,236,226,0.14)" : "rgba(145,140,131,0.09)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  ctx.strokeStyle = "rgba(145,140,131,0.2)";
  ctx.lineWidth = 1.2;
  for (let v = 0; v < 8; v++) {
    let x = Math.random() * size;
    let y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 18; s++) {
      x += (Math.random() - 0.5) * 70;
      y += (Math.random() - 0.5) * 70;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  return canvas;
}

export function getMarbleTexture(): THREE.CanvasTexture {
  if (!marbleTexture) {
    marbleTexture = new THREE.CanvasTexture(buildMarbleCanvas());
    marbleTexture.wrapS = marbleTexture.wrapT = THREE.RepeatWrapping;
    marbleTexture.colorSpace = THREE.SRGBColorSpace;
  }
  return marbleTexture;
}

function getMarbleNormalTexture(): THREE.CanvasTexture {
  if (!marbleNormalTexture) {
    marbleNormalTexture = heightArrayToNormalTexture(256, buildHeightBlobs(256, 46, 0.05), 2.4);
  }
  return marbleNormalTexture;
}

export function getFloorNormalTexture(): THREE.CanvasTexture {
  if (!floorNormalTexture) {
    floorNormalTexture = heightArrayToNormalTexture(256, buildHeightBlobs(256, 26, 0.035), 1.6);
  }
  return floorNormalTexture;
}

export interface MarbleMaterialOptions {
  roughness?: number;
  envMapIntensity?: number;
  color?: string;
}

/** Warm ivory marble with real (if lightweight) surface relief -- normal map + a touch of
 * clearcoat, so it catches rim light and edge highlights instead of reading flat/plastic. */
export function createMarbleMaterial(repeat = 1, options?: MarbleMaterialOptions) {
  const tex = getMarbleTexture().clone();
  tex.needsUpdate = true;
  tex.repeat.set(repeat, repeat);

  const normalTex = getMarbleNormalTexture().clone();
  normalTex.needsUpdate = true;
  normalTex.repeat.set(repeat, repeat);

  return new THREE.MeshPhysicalMaterial({
    map: tex,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.4, 0.4),
    color: new THREE.Color(options?.color ?? PALETTE.marbleBase),
    roughness: options?.roughness ?? 0.55,
    metalness: 0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    envMapIntensity: options?.envMapIntensity ?? 0.45,
  });
}

export function createGoldMaterial(extra?: Partial<THREE.MeshStandardMaterialParameters>) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(PALETTE.gold),
    metalness: 0.82,
    roughness: 0.28,
    envMapIntensity: 1.15,
    emissive: new THREE.Color(PALETTE.gold),
    emissiveIntensity: 0.12,
    ...extra,
  });
}
