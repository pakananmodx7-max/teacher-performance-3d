import { motion, type Variants } from "framer-motion";
import type { Slide } from "../content";

const slideVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    rotateX: direction > 0 ? 28 : -28,
    y: direction > 0 ? 90 : -90,
    scale: 0.85,
  }),
  center: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    rotateX: direction > 0 ? -28 : 28,
    y: direction > 0 ? -90 : 90,
    scale: 0.85,
    transition: { duration: 0.5, ease: [0.6, 0, 0.8, 0.2] },
  }),
};

const listStagger: Variants = {
  center: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};

const listItem: Variants = {
  enter: { opacity: 0, x: -24 },
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface SlideViewProps {
  slide: Slide;
  direction: number;
}

export function SlideView({ slide, direction }: SlideViewProps) {
  return (
    <motion.div
      className={`slide slide--${slide.theme}`}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      {slide.kind === "cover" && (
        <div className="slide-cover">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {slide.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.7 }}
          >
            {slide.title}
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.6 }}
          >
            {slide.subtitle}
          </motion.p>
          <motion.dl
            className="meta-grid"
            variants={listStagger}
            initial="enter"
            animate="center"
          >
            {slide.meta.map((item) => (
              <motion.div className="meta-item" key={item.label} variants={listItem}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      )}

      {slide.kind === "agenda" && (
        <div className="slide-agenda">
          <h2>{slide.title}</h2>
          <motion.div className="agenda-list" variants={listStagger} initial="enter" animate="center">
            {slide.items.map((item) => (
              <motion.div className="agenda-item" key={item.code} variants={listItem}>
                <span className="agenda-code">{item.code}</span>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {slide.kind === "section" && (
        <div className="slide-section">
          <motion.span
            className="section-index"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            {slide.index}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {slide.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            {slide.subtitle}
          </motion.p>
        </div>
      )}

      {slide.kind === "content" && (
        <div className="slide-content">
          <motion.span
            className="kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {slide.kicker}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            {slide.title}
          </motion.h2>
          <motion.p
            className="description"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
          >
            {slide.description}
          </motion.p>
          <motion.div className="bullet-grid" variants={listStagger} initial="enter" animate="center">
            {slide.bullets.map((bullet) => (
              <motion.div className="bullet-card" key={bullet.title} variants={listItem}>
                <h3>{bullet.title}</h3>
                <p>{bullet.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {slide.kind === "outcome" && (
        <div className="slide-content">
          <motion.span
            className="kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {slide.kicker}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            {slide.title}
          </motion.h2>
          <motion.p
            className="description"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
          >
            {slide.description}
          </motion.p>
          <motion.div className="outcome-columns" variants={listStagger} initial="enter" animate="center">
            <motion.div className="outcome-col outcome-col--quant" variants={listItem}>
              {slide.quantitative.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </motion.div>
            <motion.div className="outcome-col outcome-col--qual" variants={listItem}>
              {slide.qualitative.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}

      {slide.kind === "closing" && (
        <div className="slide-closing">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {slide.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {slide.subtitle}
          </motion.p>
          <motion.span
            className="closing-note"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {slide.note}
          </motion.span>
        </div>
      )}
    </motion.div>
  );
}
