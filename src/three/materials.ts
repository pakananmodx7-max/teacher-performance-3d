import * as THREE from "three";

export const PALETTE = {
  marbleBase: "#e7e0d3",
  marbleShadow: "#aaa49b",
  marbleHighlight: "#f4f0e8",
  gold: "#c8a25a",
  stoneFloor: "#090d12",
  skyTop: "#03060b",
  skyMid: "#07101b",
  skyHorizon: "#152131",
};

let marbleTexture: THREE.CanvasTexture | null = null;

/** Lightweight procedural marble: large-scale faint veins over a warm ivory base, generated once and reused. */
function buildMarbleCanvas(): HTMLCanvasElement {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = PALETTE.marbleBase;
  ctx.fillRect(0, 0, size, size);

  // Faint warm mottling
  for (let i = 0; i < 140; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 20 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    const warm = Math.random() > 0.5;
    grad.addColorStop(0, warm ? "rgba(244,240,232,0.10)" : "rgba(170,164,155,0.07)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  // Sparse grey veins as broken, wandering lines
  ctx.strokeStyle = "rgba(150,144,134,0.16)";
  ctx.lineWidth = 1.2;
  for (let v = 0; v < 7; v++) {
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

export function createMarbleMaterial(repeat = 1) {
  const tex = getMarbleTexture().clone();
  tex.needsUpdate = true;
  tex.repeat.set(repeat, repeat);
  return new THREE.MeshStandardMaterial({
    map: tex,
    color: new THREE.Color(PALETTE.marbleBase),
    roughness: 0.62,
    metalness: 0,
  });
}

export function createGoldMaterial(extra?: Partial<THREE.MeshStandardMaterialParameters>) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(PALETTE.gold),
    metalness: 0.82,
    roughness: 0.28,
    emissive: new THREE.Color(PALETTE.gold),
    emissiveIntensity: 0.12,
    ...extra,
  });
}
