import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cameraPath } from "./journey";
import { sampleCameraPath } from "./cameraPath";
import { scrollState, mouseState } from "./store";

const smoothedPosition = new THREE.Vector3(0, 1.7, 18);
const smoothedLookAt = new THREE.Vector3(0, 2.5, -15);
const smoothedMouse = new THREE.Vector2(0, 0);
const up = new THREE.Vector3(0, 1, 0);
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const rotatedForward = new THREE.Vector3();
const finalLookAt = new THREE.Vector3();
const yawQuat = new THREE.Quaternion();
const pitchQuat = new THREE.Quaternion();

/** Human-scale dolly camera: a fixed control path, plus a barely-there (<=1deg) mouse-driven rotation
 * so the view breathes without ever shifting the composed framing. */
const MAX_PARALLAX_RAD = THREE.MathUtils.degToRad(1);

export function CameraRig() {
  const { camera } = useThree();
  const perspective = camera as THREE.PerspectiveCamera;
  const initialised = useRef(false);

  useFrame((_, delta) => {
    const sample = sampleCameraPath(cameraPath, scrollState.progress);

    const posLerp = 1 - Math.pow(0.001, delta);
    const lookLerp = 1 - Math.pow(0.0006, delta);

    if (!initialised.current) {
      smoothedPosition.copy(sample.position);
      smoothedLookAt.copy(sample.lookAt);
      initialised.current = true;
    } else {
      smoothedPosition.lerp(sample.position, posLerp);
      smoothedLookAt.lerp(sample.lookAt, lookLerp);
    }

    smoothedMouse.x = THREE.MathUtils.lerp(smoothedMouse.x, mouseState.x, 0.03);
    smoothedMouse.y = THREE.MathUtils.lerp(smoothedMouse.y, mouseState.y, 0.03);

    const dist = smoothedPosition.distanceTo(smoothedLookAt);
    forward.subVectors(smoothedLookAt, smoothedPosition).normalize();
    right.crossVectors(forward, up).normalize();

    yawQuat.setFromAxisAngle(up, -smoothedMouse.x * MAX_PARALLAX_RAD);
    pitchQuat.setFromAxisAngle(right, -smoothedMouse.y * MAX_PARALLAX_RAD);
    rotatedForward.copy(forward).applyQuaternion(yawQuat).applyQuaternion(pitchQuat);
    finalLookAt.copy(smoothedPosition).addScaledVector(rotatedForward, dist);

    perspective.position.copy(smoothedPosition);
    perspective.lookAt(finalLookAt);

    if (Math.abs(perspective.fov - sample.fov) > 0.01) {
      perspective.fov = THREE.MathUtils.lerp(perspective.fov, sample.fov, 0.05);
      perspective.updateProjectionMatrix();
    }
  });

  return null;
}
