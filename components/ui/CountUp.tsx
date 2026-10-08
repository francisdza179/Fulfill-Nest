"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The zero state has to be committed BEFORE the browser's first paint of the
 * counter, or the target number is visible for one frame and then visibly
 * snaps backwards to 0. `useLayoutEffect` is what buys that guarantee.
 *
 * It cannot be used directly: React warns when it runs during SSR, where there
 * is no layout to measure. Swapping to `useEffect` on the server is the
 * standard way to keep the guarantee on the client without the warning, and it
 * costs nothing here because the zero swap only ever matters in a browser.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Intersection is judged at 10% rather than at a majority threshold. A counter
 * is a one-line number inside a `<dt>`, so a threshold that demands most of
 * the element be on screen is asking for a geometrically awkward condition and
 * is the kind of threshold that quietly never trips. 10% is enough to mean
 * "this is on screen" and cheap enough to be satisfied the moment it is.
 */
const OBSERVER_THRESHOLD = 0.1;

/**
 * No root margin. A negative bottom margin would let a counter begin while it
 * is still below the fold, which is the exact failure this file is hardening
 * against in the other direction.
 */
const OBSERVER_ROOT_MARGIN = "0px";

/**
 * Grace period added to `duration` before the fallback gives up on the frame
 * loop and writes the target straight in.
 *
 * This exists because `requestAnimationFrame` and `setTimeout` fail in
 * OPPOSITE situations, which is what makes the pair a real guarantee:
 *
 *   - rAF does not fire at all in a backgrounded tab, or in a browser under
 *     heavy main-thread load, or if a `content-visibility` / paint-suppression
 *     path skips the frame. The counter then sits at zero forever.
 *   - `setTimeout` DOES keep firing in a backgrounded tab (throttled to about
 *     once per second, but firing), and it keeps firing while the main thread
 *     is busy rather than being starved by it.
 *
 * So the timer is armed only once the count is genuinely under way, and if the
 * rAF loop has not reached `progress === 1` by `duration + FALLBACK_GRACE_MS`,
 * the final value is written directly and the number can no longer be stuck.
 */
const FALLBACK_GRACE_MS = 400;

interface CountUpProps {
  /** The stat to count to, e.g. "99%", "4.9/5", "200+", "18k", "3×". */
  value: string;
  /** Duration of the count in ms. Default 1600, inside the 1.5-2.5s house range. */
  duration?: number;
  /**
   * Milliseconds to sit at zero AFTER the trigger fires but before the first
   * animation frame. Defaults to 0 - start on the next frame.
   *
   * This exists for one situation: a counter nested inside an element that is
   * still running its own entrance animation. The observer fires the moment
   * the element is in the viewport, but the observer has no idea that the
   * element is currently at `opacity: 0` on its way to `opacity: 1` - so the
   * count plays out in full behind a fade and the visitor sees a number that
   * is already at 99% by the time the band is legible. Delay the start by
   * however long the entrance has left to run and the whole count is seen.
   *
   * `delay` offsets the START, whichever tier triggered it. It is not a
   * substitute for the mount path: with `delay` left at 0, a counter already
   * on screen at page load begins on the first frame regardless.
   *
   * The cost is symmetric: if the element scrolls into view LONG after its
   * entrance finished, the delay is dead time spent showing zero. So pass
   * only as much as the entrance actually needs.
   */
  delay?: number;
  className?: string;
}

interface ParsedValue {
  prefix: string; // leading non-numeric characters, e.g. "+", "₹"
  target: number; // numeric target
  decimals: number; // decimal places to show
  suffix: string; // trailing characters, e.g. "+", "%", "/5", "k", "×", " Cr+"
}

/**
 * Split a display string into prefix / number / suffix. Only the number is ever
 * interpolated, which is what keeps symbols attached the whole way.
 *
 *   "200+"   -> prefix ""     target 200   decimals 0  suffix "+"
 *   "99%"    -> prefix ""     target 99    decimals 0  suffix "%"
 *   "10k"    -> prefix ""     target 10    decimals 0  suffix "k"
 *   "4.9/5"  -> prefix ""     target 4.9   decimals 1  suffix "/5"
 *   "₹1.2 Cr+" -> prefix "₹"  target 1.2   decimals 1  suffix " Cr+"
 *
 * `[\d,]+` with the commas stripped by `Number()` is what turns "5,000" into
 * the clean integer 5000 rather than a truncated 5, and the fractional branch
 * is what holds "1.2" to one decimal place for the whole run instead of letting
 * it flicker between 1 and 1.0. A string with no digits at all falls through to
 * `target: 0` with the whole string as the suffix, so `format(0)` and
 * `format(target)` both return it unchanged and the component degrades to
 * static text rather than rendering "0" or "NaN".
 */
function parseValue(value: string): ParsedValue {
  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: "", target: 0, decimals: 0, suffix: value };
  }
  const rawNumber = match[2].replace(/,/g, "");
  const decimals = rawNumber.includes(".")
    ? rawNumber.split(".")[1].length
    : 0;
  return {
    prefix: match[1],
    target: Number(rawNumber),
    decimals,
    suffix: match[3],
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Count-up entrance effect for stats/numbers boxes.
 *
 * Counts from 0 to the parsed value, triggered by whichever of three tiers
 * fires first, and never left showing a number other than the target.
 *
 * ── Trigger: three tiers, because one is not enough ─────────────────────
 * A stats band in a hero is above the fold, so the common case is "this is
 * already on screen at page load" — and relying on an IntersectionObserver to
 * notice that means relying on an async callback that has to be delivered after
 * first paint. The tiers, in the order they are attempted:
 *
 *   1. MOUNT + already on screen. If the page is at the top AND the element's
 *      rect is actually within the viewport, the count begins in the same
 *      layout-effect pass that wrote the zero state. No observer round-trip,
 *      no async gap, and the visitor sees the number rise as the page arrives.
 *      The rect test is what keeps this honest: a hero band that happens to sit
 *      below the fold on a short viewport is not counted, because counting it
 *      would spend the run off-screen.
 *   2. INTERSECTION. A low-threshold observer is registered regardless, as the
 *      net for anything tier 1 declines: a page loaded mid-scroll, or restored
 *      from bfcache at a non-zero offset, or a target that is below the fold.
 *      `threshold: 0.1`, `rootMargin: "0px"`.
 *   3. FALLBACK TIMER. Armed once the count starts, not before — so a band
 *      that has not been scrolled to yet is never force-resolved early. If the
 *      frame loop has not finished by `duration + FALLBACK_GRACE_MS`, the
 *      target is written directly. See `FALLBACK_GRACE_MS` for why a timer is
 *      the right thing to reach for when rAF is the thing that failed.
 *
 * ── Rendering ───────────────────────────────────────────────────────────
 * Every intermediate value is written through `setDisplay` from inside a
 * `requestAnimationFrame` callback, one `setState` per frame, so React
 * re-renders continuously across the run and the digits are driven by the same
 * clock as the paint. No spring library is involved: there is no velocity to
 * preserve, nothing to interrupt, and the run is a fixed 0 → target, so a
 * physics layer would add a dependency and a settle time for no benefit.
 *
 * ── Non-numeric characters ──────────────────────────────────────────────
 * `parseValue` splits the string into prefix / number / suffix, and only the
 * number is ever interpolated. So "99%" renders "0%" on the first frame and
 * "99%" on the last, with the "%" attached the whole way; "5,000+" runs
 * 0 → 5,000 and re-inserts the thousands separator on every frame because the
 * formatter is `toLocaleString("en-US")`, not bare `String(n)`; "₹1.2 Cr+"
 * keeps "₹" in front and " Cr+" behind, and holds one decimal place the whole
 * way so the number never jitters between 1 and 1.0 mid-count.
 *
 * ── Reduced motion ──────────────────────────────────────────────────────
 * `prefers-reduced-motion: reduce` writes the final value synchronously and
 * returns before any timer or observer is created. The counter is not merely
 * fast in that mode, it is finished: there is no zero state, no frame loop and
 * nothing left to fall back from.
 *
 * ── Screen reader handling ──────────────────────────────────────────────
 * The ticking text is `aria-hidden` and a visually-hidden sibling carries the
 * real value. This is the standard arrangement and it is a change from the
 * previous `role="text"` + `aria-label` on the same element: `role="text"` is
 * not a role in ARIA 1.2 or 1.3, and an `aria-label` on a generic `<span>` is
 * not reliably exposed at all, so that markup could announce nothing or, on
 * browsers that do honour it, a label competing with its own text content.
 * Hiding the animation and publishing the value once is unambiguous.
 */
export function CountUp({
  value,
  duration = 1600,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  /*
   * Initial state is the TARGET, not zero, and that is deliberate: it is what
   * gets server-rendered into the HTML, so a visitor with JavaScript disabled
   * and any crawler reading the markup both see the real number rather than
   * "0%". The swap to zero happens in the layout effect below.
   */
  const [display, setDisplay] = useState<string>(value);
  /*
   * Stops a re-entry from restarting the count. The observer can deliver more
   * than one intersecting entry over a scroll, and on a one-line number an
   * intersection is easy to satisfy twice.
   */
  const hasRun = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = parseValue(value);
    const format = (n: number) =>
      `${parsed.prefix}${n.toLocaleString("en-US", {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
      })}${parsed.suffix}`;

    /* Pre-paint: from here on the number is zero, so nothing ever renders the
       target and then reverse out of it. */
    setDisplay(format(0));

    /* Reduced motion: the final value, immediately, and nothing scheduled at
       all - the counter should not be waiting on a scroll event it will never
       be given the benefit of, nor on a frame loop it is not allowed to run. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(format(parsed.target));
      return;
    }

    let raf = 0;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let reachedTarget = false;
    /* Declared here and assigned below so `runFrames` can stop observing the
       moment the count starts. It is optional precisely because `runFrames`
       may be reached from the mount path, and reading a `const` before its
       initialiser would throw a TDZ error rather than degrade. */
    let observer: IntersectionObserver | undefined;

    /* The escape hatch. Idempotent, so whichever path gets there first wins
       and the other becomes a no-op. */
    const settle = () => {
      if (reachedTarget) return;
      reachedTarget = true;
      setDisplay(format(parsed.target));
    };

    const runFrames = () => {
      if (hasRun.current) return;
      hasRun.current = true;
      if (delayTimer !== undefined) {
        clearTimeout(delayTimer);
        delayTimer = undefined;
      }
      /* The count is under way, so tier 2 has done its job. Unobserving here
         keeps the counter from being re-evaluated by the browser for the rest
         of the page's life; `hasRun` would reject any repeat anyway. */
      observer?.disconnect();

      const t0 = performance.now();
      const tick = (now: number) => {
        /* The fallback may have landed while this frame was in flight. */
        if (reachedTarget) return;
        const progress = Math.min((now - t0) / duration, 1);
        setDisplay(format(parsed.target * easeOutCubic(progress)));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          settle();
        }
      };
      raf = requestAnimationFrame(tick);

      /* Armed here, not at mount: a target that has not been triggered yet
         must not be force-resolved just because its duration has elapsed. */
      fallbackTimer = setTimeout(settle, duration + FALLBACK_GRACE_MS);
    };

    const begin = () => {
      if (hasRun.current) return;
      if (delay > 0) {
        delayTimer = setTimeout(runFrames, delay);
      } else {
        runFrames();
      }
    };

    /* ── Tier 2: registered unconditionally, as the net under tiers 1 and 3. */
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) begin();
        }
      },
      { threshold: OBSERVER_THRESHOLD, rootMargin: OBSERVER_ROOT_MARGIN },
    );
    observer.observe(el);

    /* ── Tier 1: the above-the-fold case, started without waiting for the
       observer's async delivery. The rect test is the point of the tier - it
       is what distinguishes "already on screen" from "in the document but
       below the fold", which the observer would have had to answer for us. */
    if (window.scrollY === 0) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) begin();
    }

    return () => {
      observer?.disconnect();
      if (delayTimer !== undefined) clearTimeout(delayTimer);
      if (fallbackTimer !== undefined) clearTimeout(fallbackTimer);
      cancelAnimationFrame(raf);
      /* Reset rather than persist, so a remount can count again. Holding it
         true would strand the number wherever the cancelled frame left it,
         which is a worse failure than a dev-only restart. */
      hasRun.current = false;
    };
  }, [value, duration, delay]);

  /*
   * `ref` MUST land on this outer span or the effect above bails at
   * `if (!el) return` and nothing at all runs.
   *
   * That is not hypothetical: it was the state of this component for a while.
   * The ref was created, the effect read it, but the JSX never bound it, so
   * `ref.current` was always null and the count-up never started in any
   * browser. It was invisible because `useState(value)` initialises to the
   * TARGET, so the server-rendered markup already showed the finished number
   * and a static HTML fetch of the page looked perfectly correct. The only
   * symptom was the thing being asked about here: the number never moved.
   *
   * Binding it to the outer span is also the right node to observe. It is the
   * box that `ProofStats` and `HeroStats` size and style via `className`, so
   * intersecting it measures the number the visitor actually sees rather than
   * the inner ticking glyphs.
   */
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
