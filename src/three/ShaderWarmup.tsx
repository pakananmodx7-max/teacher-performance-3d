import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Every architectural piece exists in the scene graph from mount (just invisible/transparent
 * until its construction range begins), so the burst of objects turning visible together as
 * scroll crosses ~0.17-0.5 was the first time their shaders/shadow depth materials compiled --
 * a heavy synchronous hitch on this renderer that could corrupt a frame. Precompiling everything
 * once, up front, avoids that burst entirely.
 */
export function ShaderWarmup() {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      gl.compile(scene, camera);
    });
    return () => cancelAnimationFrame(id);
  }, [gl, scene, camera]);

  return null;
}
