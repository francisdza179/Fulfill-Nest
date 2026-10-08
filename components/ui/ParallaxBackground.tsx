"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface ParallaxBackgroundProps {
  src: string;
  alt?: string;
  sizes?: string;
  /** Speed coefficient for parallax travel (0.1 - 0.6). Default 0.35. */
  speed?: number;
  className?: string;
  objectPosition?: string;
}

/**
 * High-performance, GPU-accelerated scroll-driven parallax background.
 * Uses an oversized inner wrapper (-20% to +20% bleed) translated via
 * requestAnimationFrame-throttled scroll listener for buttery-smooth depth.
 */
export function ParallaxBackground({
  src,
  alt = "",
  sizes = "100vw",
  speed = 0.35,
  className = "",
  objectPosition = "50% 50%",
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect user reduced-motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer) return;

    let rafId: number | null = null;

    const updateParallax = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Only calculate if the container is near or in the viewport
      if (rect.bottom >= -100 && rect.top <= viewportHeight + 100) {
        // Distance from center of viewport
        const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
        // Shift opposite to scroll direction for natural optical depth
        const translateY = -centerOffset * speed;
        layer.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateParallax();
      });
    };

    // Calculate initial position immediately
    updateParallax();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        ref={layerRef}
        className="absolute -top-[20%] -bottom-[20%] inset-x-0 h-[140%] w-full will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={false}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
    </div>
  );
}