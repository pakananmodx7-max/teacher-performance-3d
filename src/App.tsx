import { AnimatePresence } from "framer-motion";
import { Scene } from "./components/Scene";
import { SlideView } from "./components/SlideView";
import { SlideNav } from "./components/SlideNav";
import { useSlideNavigation } from "./hooks/useSlideNavigation";
import { slides } from "./content";

function App() {
  const { slideIndex, direction, goTo, next, prev } = useSlideNavigation(slides.length);

  const currentSlide = slides[slideIndex];

  return (
    <div className="presentation-root">
      <div className="scene-layer">
        <Scene theme={currentSlide.theme} slideIndex={slideIndex} totalSlides={slides.length} />
      </div>

      <div className="stage">
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <SlideView key={slideIndex} slide={currentSlide} direction={direction} />
        </AnimatePresence>
      </div>

      <SlideNav
        total={slides.length}
        current={slideIndex}
        onGoTo={goTo}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}

export default App;
