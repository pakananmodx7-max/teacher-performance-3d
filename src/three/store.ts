// Mutable, non-reactive stores shared between the GSAP ScrollTrigger callback
// and the R3F render loop. Deliberately not React state: the scroll journey
// must update every animation frame, and running that through React re-renders
// would be wasteful and would fight the scrub-driven timeline.
export const scrollState = { progress: 0 };

export const mouseState = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (event) => {
      mouseState.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = (event.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true },
  );
}
