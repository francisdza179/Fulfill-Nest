"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";

const CYCLE_INTERVAL_MS = 3000;
const DEFAULT_FLIP_DURATION = 0.55;
const DEFAULT_FLIP_EASE = [0.25, 1, 0.5, 1] as const;
const CUBE_RADIUS = 22;

interface RotatingCubeTextProps {
  phrases: readonly string[];
  trailingText?: string;
  className?: string;
  /** Kept for API compatibility; width is always content-derived. */
  stableLayout?: boolean;
  align?: "start" | "center";
  intervalMs?: number;
  flipDuration?: number;
  ease?: Transition["ease"];
}

/**
 * Continuous 3D cube-roll / slot-machine text flipper.
 *
 * The wrapper is an inline-flex perspective layer sized by the active phrase
 * (`w-auto min-w-max`) so wide italic words never clip on the right. Entering
 * and exiting faces animate in tandem — no `mode="wait"` blank gaps.
 */
export function RotatingCubeText({
  phrases,
  trailingText = "",
  className = "",
  align = "start",
  intervalMs = CYCLE_INTERVAL_MS,
  flipDuration = DEFAULT_FLIP_DURATION,
  ease = DEFAULT_FLIP_EASE,
}: RotatingCubeTextProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (phrases.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % phrases.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [phrases.length, intervalMs]);

  const activePhrase = phrases[activeIndex] ?? "";
  const accessibleLabel = phrases.join(", ");

  return (
    <span
      aria-label={accessibleLabel}
      className={`accent-em relative inline-flex items-center overflow-visible px-0.5 mx-1 min-w-[max-content] align-baseline ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <span className="sr-only">{activePhrase}</span>

      {/* Invisible in-flow copy sizes the perspective wrapper to the active
          phrase so the motion face can be absolutely positioned without the
          box collapsing. */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {activePhrase}
        {trailingText}
      </span>

      <AnimatePresence initial={false} mode="popLayout">
        <motion.em
          key={`${activePhrase}-${activeIndex}`}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap italic text-center origin-center transform-gpu subpixel-antialiased will-change-transform px-2"
          initial={{ rotateX: -90, translateZ: CUBE_RADIUS, opacity: 0 }}
          animate={{ rotateX: 0, translateZ: CUBE_RADIUS, opacity: 1 }}
          exit={{ rotateX: 90, translateZ: CUBE_RADIUS, opacity: 0 }}
          style={{
            transformOrigin: `50% 50% -${CUBE_RADIUS}px`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: flipDuration, ease }
          }
        >
          {activePhrase}
          {trailingText}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}
