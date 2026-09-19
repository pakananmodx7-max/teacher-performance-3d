import { useCallback, useEffect, useState } from "react";

interface SlideNavProps {
  total: number;
  current: number;
  onGoTo: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function SlideNav({ total, current, onGoTo, onPrev, onNext }: SlideNavProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${(current / Math.max(total - 1, 1)) * 100}%` }}
        />
      </div>

      <div className="slide-counter">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      <button
        type="button"
        className="fullscreen-toggle"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "ออกจากโหมดเต็มจอ" : "เข้าสู่โหมดเต็มจอ"}
      >
        {isFullscreen ? "⤡" : "⤢"}
      </button>

      <button
        type="button"
        className="nav-arrow nav-arrow--prev"
        onClick={onPrev}
        disabled={current === 0}
        aria-label="สไลด์ก่อนหน้า"
      >
        ‹
      </button>
      <button
        type="button"
        className="nav-arrow nav-arrow--next"
        onClick={onNext}
        disabled={current === total - 1}
        aria-label="สไลด์ถัดไป"
      >
        ›
      </button>

      <div className="dot-nav">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot ${i === current ? "dot--active" : ""}`}
            onClick={() => onGoTo(i)}
            aria-label={`ไปยังสไลด์ที่ ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
