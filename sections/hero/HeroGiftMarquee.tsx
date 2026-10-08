"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export interface HeroGiftItem {
  name: string;
  src: string;
}

interface HeroGiftMarqueeProps {
  /**
   * The gift run. Rendered exactly as given; the strip draws the run TWICE so
   * the loop can close (see below), so five items in means five distinct
   * gifts, not five positions in a longer list.
   */
  items: readonly HeroGiftItem[];
  /**
   * Which way the row travels.
   *
   * `"ltr"` — left to right (keyframes run -50% -> 0%, so the row appears to
   * enter from the left edge). `"rtl"` — right to left (0% -> -50%, the usual
   * marquee direction). The two hero strips use opposite values on purpose:
   * one reading direction each keeps them from looking like one strip that
   * changed its mind.
   */
  direction?: "ltr" | "rtl";
  /** Accessible name for the strip — it is a labelled group, not raw noise. */
  label: string;
}

/**
 * Seconds for one half-loop, i.e. for the track to travel exactly one copy of
 * the run (50% of its own width). ~1.2k px of run at 26s is a calm ~45px/s:
 * fast enough to read as motion, slow enough to read a label as it passes.
 */
const HALF_LOOP_SECONDS = 26;

/**
 * Left/right edge fade, applied as a mask on the clipping box rather than as
 * two gradient overlays. Items therefore dissolve instead of being guillotined
 * at the viewport edge, and because the mask lives on the overflow container
 * the track itself needs no per-item treatment.
 *
 * Same shape as the client-logo and showcase strips use, at a slightly wider
 * feather (8% rather than 15%) because these items are opaque photographs with
 * hard edges rather than grey text.
 */
const EDGE_MASK =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

/**
 * Auto-scrolling gift strip for the home hero's mobile composition. Mount it
 * only below `md` — it is one half of the hero's breakpoint split, where the
 * desktop half keeps the hover fountain instead (see `HeroFlanked`).
 *
 * Loop mechanics, for the same reason `ClientLogoMarquee` and `ProductMarquee`
 * both carry them: the track is TWO identical copies of the run, spacing lives
 * inside each copy (the per-item `pr-7`), and the track itself has no gap — so
 * `w-max` is exactly twice one copy and a `translateX` of 50% always lands on
 * the copy boundary. The jump back at the end of the cycle is therefore the
 * same pixels as the frame before it, and the seam never shows. Two copies are
 * enough here because this strip only ever renders under 768px, where one copy
 * (~1.2k px) already overfills the window at every animation position.
 *
 * Motion is framer-motion on purpose: a `transform`-only keyframe loop with
 * `ease: "linear"` and `repeat: Infinity` runs on the compositor, never
 * touches layout, and cannot stall the main thread the way a width/left
 * animation would. `prefers-reduced-motion` parks the loop (the track simply
 * sits at its origin — both copies stay in the DOM so the SSR markup and the
 * hydrated markup are byte-identical, which a conditional copy count would
 * NOT be for a reduced-motion user), leaving a static row of the same five
 * gifts behind the same edge mask.
 */
export function HeroGiftMarquee({
  items,
  direction = "ltr",
  label,
}: HeroGiftMarqueeProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={label}
      className="relative overflow-hidden py-3"
      style={{
        /* Both edges fade out. Declared as `maskImage` plus the Webkit
           spelling because Safari still takes the prefixed form only. */
        maskImage: EDGE_MASK,
        WebkitMaskImage: EDGE_MASK,
      }}
    >
      <motion.div
        className="flex w-max items-center will-change-transform"
        /* `undefined` rather than `{ x: 0 }` when motion is reduced: the SSR
           pass emits no style for a keyframe target (verified in the served
           markup), so a reduced-motion client that swapped in a plain `x`
           would hand React a transform the server never wrote and force a
           hydration repair. Both branches therefore render the same bare
           track — the reduced one simply never starts moving. */
        animate={
          reduceMotion
            ? undefined
            : {
                /* Direction is which keyframe comes first, not a sign flip on
                   the duration: the track always travels exactly one copy
                   width per cycle, so both strips keep the same cadence. */
                x: direction === "ltr" ? ["-50%", "0%"] : ["0%", "-50%"],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: HALF_LOOP_SECONDS,
                ease: "linear",
                repeat: Infinity,
              }
        }
      >
        {Array.from({ length: 2 }).map((_, copyIndex) => (
          <div
            key={copyIndex}
            /* The second copy exists purely so the loop can close; announcing
               it would read the same ten names twice. */
            aria-hidden={copyIndex > 0 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((gift, index) => (
              <motion.div
                key={gift.src}
                className="flex shrink-0 items-center pr-7"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [-5, 5, -5],
                        rotate: [-3, 3, -3],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 2.8 + (index % 3) * 0.5,
                        ease: "easeInOut" as const,
                        repeat: Infinity,
                        repeatType: "reverse" as const,
                        delay: index * 0.2,
                      }
                }
              >
                {/* Raw product render only — no white plate, border, shadow or
                    label, so the cutouts float directly on the hero canvas. */}
                <span className="relative block h-16 w-16 shrink-0">
                  <Image
                    src={gift.src}
                    /* Decorative: the gift's name is the visible label beside
                       it, so an alt would read the name twice. */
                    alt=""
                    fill
                    sizes="64px"
                    draggable={false}
                    className="object-contain"
                  />
                </span>
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
