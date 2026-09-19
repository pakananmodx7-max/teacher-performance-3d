import * as THREE from "three";
import type { Waypoint } from "./journey";

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _lookA = new THREE.Vector3();
const _lookB = new THREE.Vector3();

export interface CameraSample {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

const sample: CameraSample = {
  position: new THREE.Vector3(),
  lookAt: new THREE.Vector3(),
  fov: 45,
};

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Piecewise-interpolates the camera path at scroll progress `t` (0..1). */
export function sampleCameraPath(path: Waypoint[], t: number): CameraSample {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);

  let i = 0;
  while (i < path.length - 2 && clamped > path[i + 1].t) i++;

  const from = path[i];
  const to = path[i + 1];
  const span = to.t - from.t || 1;
  const local = smoothstep(THREE.MathUtils.clamp((clamped - from.t) / span, 0, 1));

  _a.set(...from.position);
  _b.set(...to.position);
  sample.position.copy(_a).lerp(_b, local);

  _lookA.set(...from.lookAt);
  _lookB.set(...to.lookAt);
  sample.lookAt.copy(_lookA).lerp(_lookB, local);

  sample.fov = THREE.MathUtils.lerp(from.fov, to.fov, local);

  return sample;
}

/** Returns 0..1..0 opacity/emphasis for content whose active window is [start, end]. */
export function rangeEmphasis(progress: number, start: number, end: number, fade = 0.02) {
  if (progress < start - fade || progress > end + fade) return 0;
  if (progress < start) return smoothstep((progress - (start - fade)) / fade);
  if (progress > end) return 1 - smoothstep((progress - end) / fade);
  return 1;
}
