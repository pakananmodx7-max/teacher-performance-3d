import { useCallback, useEffect, useState } from "react";

export function useSlideNavigation(totalSlides: number) {
  const [state, setState] = useState({ slideIndex: 0, direction: 1 });

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalSlides - 1, index));
      setState((current) => {
        if (clamped === current.slideIndex) return current;
        return { slideIndex: clamped, direction: clamped > current.slideIndex ? 1 : -1 };
      });
    },
    [totalSlides],
  );

  const next = useCallback(() => goTo(state.slideIndex + 1), [goTo, state.slideIndex]);
  const prev = useCallback(() => goTo(state.slideIndex - 1), [goTo, state.slideIndex]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        prev();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(totalSlides - 1);
      }
    };

    let wheelCooldown = false;
    const handleWheel = (event: WheelEvent) => {
      if (wheelCooldown) return;
      if (Math.abs(event.deltaY) < 12) return;
      wheelCooldown = true;
      if (event.deltaY > 0) next();
      else prev();
      window.setTimeout(() => {
        wheelCooldown = false;
      }, 700);
    };

    let touchStartY = 0;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };
    const handleTouchEnd = (event: TouchEvent) => {
      const delta = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(delta) < 60) return;
      if (delta > 0) next();
      else prev();
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [next, prev, goTo, totalSlides]);

  return { slideIndex: state.slideIndex, direction: state.direction, goTo, next, prev };
}
