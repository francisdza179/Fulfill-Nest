"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Testimonial } from "@/lib/data";

/** Auto-advance interval. Long enough to finish reading a quote card. */
const AUTO_ADVANCE_MS = 6500;

/** Must equal the track's `gap-6`. `slideStep()` needs the real gap to convert
 *  a scroll offset back into a slide index, and the padding/gap can only be
 *  declared in CSS, so the number is mirrored here rather than measured off the
 *  element — measuring per scroll event is exactly the layout-thrash the
 *  horizontal carousel this replaces used to do. */
const TRACK_GAP_PX = 24;

/** Breakpoints, in CSS, and their slide counts, in JS. */
function slidesPerViewFor(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

/** Two letters from the name, for the avatar stand-in.
 *
 *  `Testimonial` has no image field — `quote`, `name`, `role`, `company`,
 *  `metric` — and the site has no portrait set for these twelve people, so
 *  there is no honest avatar to render. A monogram derived from the name gives
 *  the row the visual weight an avatar would, without inventing faces for
 *  named individuals. Adding real portraits means adding an optional `image`
 *  to the interface in `lib/data.ts` plus the assets, and rendering both. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * Horizontal multi-card testimonial carousel: 1 card on mobile, 2 from
 * `md`, 3 from `lg`, with arrow and dot navigation and a gentle auto-advance.
 *
 * THE MECHANISM IS CSS SCROLL-SNAP, NOT FRAMER MOTION, and that is the one
 * deliberate departure from the brief. The brief offered `motion.div` drag/animate
 * "or Swiper/Embla" — Swiper and Embla are not dependencies, and the track
 * here is driven by `snap-x snap-mandatory` plus a `scrollTo({ behavior:
 * "smooth" })` for the arrows, which delivers the same visible slide with three
 * properties the alternatives cannot give:
 *
 *  1. All twelve quotes stay in the server-rendered HTML. A transform-driven
 *     track puts three of them in view and clips the other nine, so a reader
 *     without JavaScript — and a crawler that does not run it — loses nine
 *     testimonials. Here the track is a real scroll container, so the
 *     no-JS case is a 1-up carousel that still scrolls and still reads.
 *  2. Touch, trackpad, and keyboard scrolling come from the platform. The
 *     track is `tabIndex={0}` precisely so it is reachable and announced;
 *     the arrow buttons are an addition to that, not a replacement for it.
 *  3. There is no interval-driven loop, no cloned leading/trailing slides and
 *     no wrap-snap transform. `components/testimonials/TestimonialsCarousel.tsx`
 *     documents that exact implementation as the thing this site deliberately
 *     removed, along with its "measured px-per-slide step" and "eleven pieces
 *     of state" — the scroll position IS the state here, and the browser keeps
 *     it consistent across resize, font loading and zoom.
 *
 * The brief's `drag` is still delivered on touch, because native horizontal
 * scrolling is a drag. Framer Motion stays out of the file entirely rather
 * than being imported and left unused.
 *
 * AUTOPLAY is on, and it is pausable five ways, which is more than the brief
 * asked for and is deliberate: `prefers-reduced-motion` disables it outright
 * (and switches `scrollTo` to `behavior: "auto"`), hovering or focusing
 * within the deck suspends it, a hidden tab does not advance it, and there is
 * an explicit `Play/Pause auto-play` control for WCAG 2.2.2 — auto-updating
 * content needs a mechanism to stop it, and hover alone is not one. The
 * auto-advance is deliberately NOT mirrored into an `aria-live` region;
 * announcing each timed page change would talk over a screen-reader user who
 * did nothing but keep listening.
 */
export function TestimonialCarouselClient({
  items,
}: {
  items: Testimonial[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [perView, setPerView] = useState(1);
  const [page, setPage] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  /* Both start pessimistic and are corrected on mount: `perView` at 1 avoids a
   * wrong page count in the server HTML, and reduced motion at `true` means
   * autoplay cannot start before it has been measured. The reveal wrapper's
   * `opacity: 0` holds the deck hidden until after hydration, so neither
   * provisional value is ever painted. */
  const [reduceMotion, setReduceMotion] = useState(true);

  const pageCount = Math.max(1, Math.ceil(items.length / perView));

  /** Distance between the origins of two adjacent slides, gap included. */
  const slideStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 1;
    return (track.clientWidth + TRACK_GAP_PX) / perView;
  }, [perView]);

  const goToPage = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(next, pageCount - 1));
      track.scrollTo({
        left: clamped * slideStep(),
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setPage(clamped);
    },
    [pageCount, reduceMotion, slideStep],
  );

  /* Slide count follows the same two breakpoints the widths use. `change` on
   * the media query rather than a `resize` listener, so it fires on the
   * threshold crossing instead of on every pixel. */
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const mid = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      const next = slidesPerViewFor(window.innerWidth);
      setPerView((prev) => (prev === next ? prev : next));
    };
    sync();
    wide.addEventListener("change", sync);
    mid.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      mid.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* The scroll container is the source of truth for which page is showing, so
   * a swipe, a trackpad flick, a dot click and an arrow click all agree. rAF
   * coalescing keeps this off the scroll critical path. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const step = (track.clientWidth + TRACK_GAP_PX) / perView;
        const slide = Math.round(track.scrollLeft / step);
        setPage(
          Math.max(0, Math.min(Math.floor(slide / perView), pageCount - 1)),
        );
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [perView, pageCount]);

  const autoPaused = userPaused || hovered || reduceMotion || pageCount <= 1;

  /* Re-arms on every page change, so the pause is "AUTO_ADVANCE_MS from the
   * last arrival" rather than a fixed cadence. A hidden tab is skipped inside
   * the tick instead of via another listener, so a backgrounded tab cannot
   * bank up page changes. */
  useEffect(() => {
    if (autoPaused) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      goToPage(page + 1 >= pageCount ? 0 : page + 1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [autoPaused, goToPage, page, pageCount]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        {/* `tabIndex` makes the scroller reachable: with `snap-x` the track is
            a real scrollport, so a keyboard user scrolls it with the arrow keys
            without needing the buttons below. The scrollbar is hidden so the
            track does not gain a second, redundant progress affordance next to
            the dots. `scrollbar-width` is the standard property;
            `::-webkit-scrollbar` covers WebKit and Blink, which ignore it. */}
        <ul
          ref={trackRef}
          tabIndex={0}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <li
              key={item.name}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
              className="w-full shrink-0 snap-start sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
            >
              <QuoteCard item={item} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          {/* `ArrowRightIcon` rotated rather than a new `ChevronLeftIcon`:
              `Icons.tsx` holds 34 hand-drawn glyphs and an invariant that
              every one of them is referenced, so a second arrow is not worth
              the geometry. Focus rings follow the same pair used across
              `FaqHub` and `ProductShowcaseClient`. */}
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="Previous testimonials"
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-eyebrow-gray transition-colors duration-200 hover:bg-canvas hover:text-charcoal disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label="Next testimonials"
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill text-eyebrow-gray transition-colors duration-200 hover:bg-canvas hover:text-charcoal disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setUserPaused((paused) => !paused)}
            className="rounded-pill px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-eyebrow-gray transition-colors duration-200 hover:bg-canvas hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
          >
            {userPaused ? "Play" : "Pause"} auto-play
          </button>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToPage(index)}
              aria-label={`Go to testimonials ${index + 1} of ${pageCount}`}
              aria-current={index === page ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === page
                  ? "w-6 bg-accent-600"
                  : "w-2 bg-charcoal/20 hover:bg-charcoal/40"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** One testimonial. Same information layout as the homepage's `QuoteCard` —
 *  company wordmark and metric on top, quote in the middle, author underneath
 *  — so the two testimonial surfaces on the site read as one design, and
 *  changed only where this brief's card differs from it: `rounded-3xl` for
 *  `rounded-2xl`, a leading pull-quote mark, and the monogram beside the
 *  author. There is no hover lift, only the elevation shadow, because a card
 *  that translates while the track is snapping horizontally fights the snap.
 */
function QuoteCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-charcoal/15 bg-white p-7 transition-shadow duration-300 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-charcoal">
          <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-accent-600" />
          {item.company}
        </span>
        <span className="whitespace-nowrap rounded-pill border border-brand-green-600/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-green-700">
          {item.metric}
        </span>
      </div>

      <p
        aria-hidden="true"
        className="mt-6 font-display text-4xl leading-[0.75] text-accent-600/35"
      >
        &ldquo;
      </p>

      <blockquote className="mt-2 flex-1 font-display text-lg leading-relaxed text-charcoal">
        {item.quote}
      </blockquote>

      <footer className="mt-6 flex items-center gap-3 border-t border-charcoal/10 pt-5">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linen text-sm font-semibold text-charcoal"
        >
          {initialsOf(item.name)}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-charcoal">{item.name}</span>
          <span className="mt-0.5 block text-sm text-taupe">
            {item.role} · {item.company}
          </span>
        </span>
      </footer>
    </article>
  );
}
