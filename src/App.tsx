import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneRoot } from "./three/SceneRoot";
import { scrollState } from "./three/store";
import { TOTAL_SCROLL_VH } from "./three/journey";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        if (progressFillRef.current) {
          progressFillRef.current.style.height = `${self.progress * 100}%`;
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <>
      <div className="canvas-layer">
        <SceneRoot />
      </div>
      <div className="progress-rail">
        <div ref={progressFillRef} className="progress-rail-fill" />
      </div>
      <div ref={trackRef} className="scroll-track" style={{ height: `${TOTAL_SCROLL_VH}vh` }} />
    </>
  );
}

export default App;
