"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Testimonial } from "@/lib/data";

/** Auto-advance interval. The brief asked for 4–5s; 5s is the top of that
 *  range, which is the end that gives a reader the most room on a quote card. */
const AUTO_ADVANCE_MS = 5000;

/**
 * One-quote-at-a-time slider for the About page's split testimonial section:
 * autoplay, hover pause, arrow controls, dots.
 *
 * AUTOPLAY is on, and it is the same contract `ComplianceAssurance` documents
 * for its 7s pillar rotation, because that is the house precedent and matching
 * it is what makes the behaviour predictable:
 *
 *  - Hovering the slider pauses. Leaving resumes, and the interval re-arms
 *    from the resume rather than firing immediately.
 *  - `prefers-reduced-motion: reduce` disables rotation entirely, so the
 *    slider is fully manual in that case — same content, no motion. The media
 *    query is re-evaluated on change, so flipping the OS setting takes effect
 *    without a reload.
 *  - Clicking a dot or an arrow selects AND resets the cycle, exactly as
 *    clicking a pillar resets that carousel. It never starts a permanent
 *    pause; a reader who chose a card gets the full interval on it.
 *  - A hidden tab does not advance, checked inside the tick rather than by
 *    another listener, so a backgrounded tab cannot bank up index changes.
 *
 * Hover is the pause the brief specified, and it is not sufficient on its own
 * for WCAG 2.2.2 — auto-updating content needs a mechanism to stop it, and a
 * pointer is not one. So keyboard focus within the slider also pauses, and the
 * arrows are real buttons a keyboard can reach. That is why the region is
 * focusable and the arrows are focusable controls rather than decoration.
 * There is deliberately no play/pause button: the arrows plus hover/focus
 * pause are the mechanism, and this section has one card rather than a deck.
 *
 * NOT FRAMER MOTION, per the standing rule: bespoke motion belongs to nodes
 * marked `data-reveal-exempt` (currently only the five heroes via
 * `RotatingCubeText`). A `motion.div` here would double-drive `opacity` and
 * `transform` on nodes the reveal system owns, and pull in a dependency for a
 * 12px translation that CSS already provides.
 *
 * THE SLIDE is the house `animate-line-item` keyframe — `translateX(-12px)` to
 * `0` over 0.55s on `var(--ease-premium)`, declared in `globals.css` beside
 * every other utility animation. The quote is keyed to the index so React
 * remounts it and the keyframe replays. Two honest limits: it always enters
 * FROM THE LEFT, because `line-item` is a single unidirectional keyframe with
 * no reverse variant; and it needs its own `motion-reduce:animate-none`, since
 * the global reduced-motion block in `globals.css` neutralises four named
 * classes and a generic `animation` utility is not among them.
 *
 * CONTROLS sit BELOW the card rather than absolutely inside its bottom-right
 * corner, which is where they were. The brief allows either ("alongside or
 * below"), and below is the only one that fits: twelve dots at a 24px touch
 * target plus two arrow buttons need roughly 400px of row, and the card's inner
 * width at a 375px viewport is 247px. Inside the corner they collided with the
 * role line and with each other. The row wraps on narrow screens, putting the
 * arrows on one line and the dots on the next.
 */
export function TestimonialV3Slider({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  /* Starts `true` so rotation cannot begin before the preference has been
   * measured — the pessimistic default, and the same one the pricing tier
   * price-swap uses. */
  const [reduceMotion, setReduceMotion] = useState(true);

  const select = useCallback((next: number) => {
    setActive(((next % items.length) + items.length) % items.length);
  }, [items.length]);

  const step = useCallback(
    (delta: number) => {
      select(active + delta);
    },
    [active, select],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const paused = hovering || reduceMotion;

  /* `active` is a dependency so the interval re-arms on every arrival: the
   * pause is "5s from the last change" rather than a fixed cadence. */
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      select(active + 1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, active, select]);

  const item = items[active];

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        {/* The card is `bg-linen`, not `bg-white`. The band above it is now
            `bg-surface` (#ffffff) to match `TeamSpotlight`, so a white card on
            a white band would be invisible except for its hairline. `bg-linen`
            (#f1eee7) is the house warm neutral, and `shadow-elev-1` lifts it
            off the surface. This inverts the pairing the section used when the
            band was linen and the card was white. */}
        <article className="relative flex h-[360px] flex-col justify-between rounded-card border border-charcoal/10 bg-linen p-8 shadow-elev-1">
          <blockquote
            /* Remounts on every change, which is what replays the keyframe. */
            key={active}
            className="animate-line-item font-display text-2xl leading-snug text-charcoal motion-reduce:animate-none lg:text-3xl"
          >
            <p aria-hidden="true" className="mb-2 leading-none text-accent-600/35">
              &ldquo;
            </p>
            <p className="line-clamp-4">{item.quote}</p>
          </blockquote>

          {/*
            THE SECOND LINE IS THE ROLE, NOT A SERVICE. The brief asked for
            "Company Name / Service Used", illustrated as `Oak Hill / Recipient
            Choice`. `Testimonial` is
            `{ quote, name, role, company, metric }` — there is no service
            field, and no mapping from any testimonial to a `serviceTiers`
            entry exists or could be invented without fabricating which product
            a named person bought. `role` is real, attributed data, so it is
            what fills the slot. Reaching the brief's literal version means
            adding an optional `service` to the interface in `lib/data.ts` plus
            twelve values, which is editorial sign-off, not a code change.
          */}
          <footer className="mt-8">
            <p className="font-semibold text-charcoal">{item.company}</p>
            <p className="mt-0.5 text-sm text-taupe">{item.role}</p>
          </footer>
        </article>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* `ArrowRightIcon` rotated rather than adding a `ChevronLeftIcon`:
              `Icons.tsx` holds 34 hand-drawn glyphs under an invariant that
              every export is referenced, so a second arrow is not worth the
              geometry. The ring pair is the house focus convention, the same one
              `FaqHub` and `ProductShowcaseClient` use. */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous testimonial"
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-eyebrow-gray transition-colors duration-200 hover:bg-canvas hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next testimonial"
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-eyebrow-gray transition-colors duration-200 hover:bg-canvas hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Dots: `p-2` gives each a 24px touch target against an 8px visible
            pill, which is the brief's larger-clickable ask. Contrast is up from
            `bg-charcoal/20` to `/30` resting and `/50` on hover; the earlier
            value measured too faint against white to read as a control. */}
        <div className="flex flex-wrap items-center">
          {items.map((entry, index) => (
            <button
              key={entry.name}
              type="button"
              onClick={() => select(index)}
              aria-label={`Show testimonial ${index + 1} of ${items.length}`}
              aria-current={index === active ? "true" : undefined}
              className="group rounded-pill p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className={`block h-2.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-7 bg-accent-600"
                    : "w-2.5 bg-charcoal/30 group-hover:bg-charcoal/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/*
        No `aria-live` region. The slide now changes on a timer, so a polite
        live region would interrupt a screen-reader user every 5s whether they
        asked for it or not — WCAG 2.2.2 territory, not an enhancement. The dots
        carry the position in their accessible names and the active one is
        marked `aria-current`, so the control's state is still exposed.
      */}
    </div>
  );
}
