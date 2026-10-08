"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  compliancePillars,
} from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRightIcon } from "@/components/ui/Icons";

/* One number for the rotation clock, kept out of the JSX so the interval and
   any future progress indicator stay the same value by construction. */
const PILLAR_ADVANCE_MS = 7000;

/* The pillar crossfade is 500ms, and 500ms is written ONCE — as the literal
   `duration-500` on the pillar itself, further down. There is deliberately no
   `FADE_MS` constant feeding it any more.

   There used to be one: the pillar read an ARBITRARY duration value built by
   interpolating it, which is not a class Tailwind can read. Tailwind scans
   SOURCE TEXT for class names, so an interpolated arbitrary value emits nothing
   at all. Verified, not assumed — the built stylesheet had no rule for that
   class, so `transition-opacity` fell through to
   `--default-transition-duration`, i.e. `.15s`. This crossfade was running at
   150ms against an intended 500ms. `duration-250` in `TrustBand` compiles, which
   is the proof that a literal arbitrary value works fine and that the
   interpolation was the whole difference.

   Do not spell the old arbitrary class out in full anywhere near here: the
   scanner reads raw source text and does not know what a comment is, so
   transcribing it emits a dead rule for a class nothing uses.

   One number, written where Tailwind reads it, and nothing that can drift.
   Full measurement in `sections/HowItWorks.tsx`. */

/**
 * Compliance & security assurance — an interactive security matrix.
 *
 * One selection drives the right-hand panel: the left column is a vertical
 * `tablist` of the four pillars, the panel beside it breaks down whichever is
 * selected. Same ARIA contract as `IndustriesList` — `role="tablist"` with
 * `aria-orientation="vertical"`, `role="tab"` + `aria-selected` +
 * `aria-controls`, `role="tabpanel"` + `aria-labelledby`, a roving tabindex,
 * and Arrow/Home/End. Two components sharing one keyboard contract is the
 * point; if these ever diverge it is a bug.
 *
 * A CLIENT component. Inherent to the interaction — a selection-driven panel
 * cannot be a server component.
 *
 * AUTO-ADVANCE, 7s, FULLY SUBORDINATE TO THE READER. The panel rotates itself
 * every seven seconds so the four pillars pitch themselves without a click,
 * looping back to pillar 01 after 04. The override contract is the point:
 *
 *   - The ONLY pause is the pointer: hovering the tab/panel grid pauses,
 *     leaving resumes instantly. Nothing else stops rotation.
 *   - Clicking a pillar (or activating it with the keyboard) selects it AND
 *     resets the cycle — it never begins a permanent pause. The clicked
 *     pillar holds the panel for a full 7s, then the cycle carries on from
 *     there.
 *   - `prefers-reduced-motion: reduce` disables rotation entirely; the
 *     tablist is fully manual in that case — same content, no motion.
 *   - Cards crossfade on OPACITY ALONE, simultaneously and in place: the
 *     incoming card fades up over the outgoing one while that one fades down
 *     underneath it, both over 500ms. No translation, no scale, no movement
 *     of any kind, and no sequential gap — the two cards overlap for the
 *     entire transition, so the panel is never empty, never flashes the
 *     linen band behind it, and never jumps. The cost is honest and small:
 *     at the midpoint both cards are half-faded, so the panel reads very
 *     slightly translucent for a frame or two.
 *   - The four cards are absolutely positioned on top of each other inside a
 *     `relative overflow-hidden` container of a measured, fixed height, so
 *     switching pillars moves nothing on the page — no reflow below, no
 *     jumping section, and no card edge spilling out of the stack.
 *
 * The manual path always wins — the earlier "selection is the reader's, and
 * only the reader's" stance holds for every moment of interaction.
 *
 * PANEL LAYOUT: 7/5, COPY LEFT, ILLUSTRATION RIGHT. The panel used to be one
 * full-width column of text — heading, paragraph, three specs, CTA — and now
 * splits into a two-column grid, copy in 7 of 12 and a square illustration in
 * 5 of 12, one per pillar. The illustrations are 1600x1600 JPEGs sourced from
 * `Media & Others/Industries/Compliance & security assurance/`, whose filenames
 * are the pillar titles verbatim, so the wiring is title-derived and cannot
 * drift. (They replaced an earlier set of 1200x1200 PNGs from
 * `Media & Others/Compliance & Security Assurance/` at roughly a fourteenth of
 * the weight — 310 KB for all four against 4.3 MB. The old `-v1` PNGs are still
 * on disk, unreferenced, pending approval to delete.)
 *
 * The reason the panel splits at all is that the band carries four panels of
 * identical structure, so the copy is identical in shape every time and reads
 * as a wall; the illustration is what gives the panel a focal point and makes
 * the four pillars distinguishable at a glance rather than only by their words.
 *
 * Two consequences of the split that are load-bearing, not decoration:
 *
 *   1. THE IMAGE IS INSIDE THE MEASURED BOX, AND ITS HEIGHT IS INDEPENDENT OF
 *      THE BYTES. `cardContentRefs` measures the padded content box and the
 *      illustration is a descendant, so the stack's height accounts for the
 *      image column. The stack height is computed once before paint and
 *      re-measured by a ResizeObserver, so a frame that only found its height
 *      after decoding would either overflow the fixed height or shove the
 *      section below it.
 *
 *      At `md` and up that independence comes from the grid: both columns
 *      stretch to the same row height and the row is sized by the COPY, so the
 *      image's box is settled before its bytes arrive. Below `md` the columns
 *      stack and `aspect-square` on the frame reserves the box instead. Neither
 *      case waits on the network.
 *   2. THE CROSSFADE STILL SWAPS ONE WHOLE PANEL AT A TIME. Copy and image
 *      live in the same card, so there is no state where step 02's text is
 *      shown against step 01's picture. That was the failure mode to avoid
 *      when splitting the panel, and keeping both columns inside the existing
 *      card is what prevents it.
 *
 * Alt text describes the PICTURE, not the pillar's claim, and each one is
 * written to be read instead of the image without losing the point. A pillar
 * image marked up as a restatement of its own heading would be announced as a
 * second, differently-worded copy of the heading immediately below it.
 *
 * THE IMAGE IS FULL-BLEED FROM `md` UP, and the card is what clips it. Padding
 * moved from the measured content box onto the copy column, the grid gutter
 * came out, and the picture runs to the panel's top, bottom and right edges
 * with no radius and no border of its own. The card's `overflow-hidden` +
 * `rounded-3xl` trim the picture's square corners, so the rounded panel
 * silhouette is unchanged.
 *
 * CTAs ARE PER-PILLAR. Every panel used to carry the same "Request an audit
 * report", which made the button read as boilerplate instead of as the next
 * step for whatever had just been selected. Each pillar now renders its own
 * inquiry-driven `ctaLabel` — "Discuss Facility Security", "Request Security
 * Overview", "Consult on Compliance", "Inquire About Traceability" — one
 * specific ask per pillar. All four still point at `/contact` — none of these
 * is a real route or file yet, so they are requests, not downloads. See the
 * note at the button for why.
 *
 * LIGHT BAND, NOT DARK. This section was a deep-forest band and is now
 * `--color-linen` (#f1eee7). Two reasons, and the second is the one that
 * matters:
 *
 *   1. The band sequence on /industries is `IndustriesList` bg-surface
 *      (#ffffff) -> this band -> `Testimonials` bg-white (#ffffff). It used to
 *      run on to `IndustryCaseStudies` bg-warm-grey (#f7f4eb); that section was
 *      removed and its metrics folded into the `IndustriesList` cards as `proof`
 *      micro-pills, so the sequence is now white -> linen -> white. Linen still
 *      does its job — it is what keeps this band from reading as part of the
 *      white page above it — but reason 1 is no longer about sitting BETWEEN
 *      two creams. It is about breaking one run of white in two. Do not
 *      "restore" a cream successor on the grounds that this band needed a
 *      neighbour of its own; it needs contrast, not a neighbour.
 *   2. It is what makes the brand red work. On forest, every saturated brick
 *      measured between 1.78:1 and 2.52:1 — below even the 3:1 large-text bar.
 *      The only in-palette red that cleared forest was `--color-brand-primary-
 *      tint` (#d8a79c), which is 55% mixed toward white and reads as pink. On
 *      linen the site's own `--color-brand-primary` (#a83b24) measures 5.47:1,
 *      and on the white panel 6.33:1 — a real brick red at full saturation,
 *      passing AA for text of any size.
 *
 * Every foreground below was measured against its actual surface rather than
 * assumed. Two notes:
 *
 *   - Unselected ordinals are `text-taupe`, not `text-taupe/70`. The alpha
 *     version composites to 3.3:1 on linen and fails; full taupe is 6.52:1.
 *     The active/inactive distinction is carried by hue (taupe vs brick) and
 *     weight instead of by opacity.
 *   - The eyebrow drops its override. The dark variant forced
 *     `--color-brand-green-200` to keep AA on a lifted band; on linen the
 *     default `--color-eyebrow-gray` measures 4.54:1 unaided.
 */
export function ComplianceAssurance() {
  const [activeIndex, setActiveIndex] = useState(0);
  /* The one and only pause is the pointer: `hovering` is set by the grid's
     onMouseEnter/onMouseLeave and rotation runs while the cursor is away.
     Clicking never sets a pause — it only bumps `cycleReset`, which tears the
     interval down and rebuilds it, so the clicked pillar holds the panel for
     a full 7 seconds and the cycle carries on from there. */
  const [hovering, setHovering] = useState(false);
  const [cycleReset, setCycleReset] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /* The cards are absolutely positioned, so the container has no intrinsic
     height of its own — it would collapse to nothing and the page below would
     jump on every switch. This is the measured height it is pinned to, and
     `cardContentRefs` are the boxes it is measured from. See the stack note
     in the JSX for why the measurement reads the card CONTENT rather than
     the card itself. */
  const cardContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stackHeight, setStackHeight] = useState<number | null>(null);
  /* One state, one source of truth. The sequential version needed a second
     one — a `visibleIndex` lagging `activeIndex` by a fade, plus a timeout —
     to hold the outgoing card on screen until it had gone. A simultaneous
     crossfade needs neither: every card is always mounted and always in the
     same place, and only its opacity changes, so `activeIndex` is the whole
     story. That is the "no mode=wait" contract — nothing is ever removed
     from the stack, so there is nothing to wait for and no empty frame. */

  /* Respect the visitor's motion preference: no auto-advance under
     `prefers-reduced-motion`. Re-evaluated on change, so flipping the OS
     setting live stops or starts rotation accordingly. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* The 7-second rotation, looping back to index 0 after the last pillar.
     Hovered or reduced-motion and the interval is torn down and rebuilt (or
     not built at all). A manual selection rebuilds it through `cycleReset`,
     which is the "resume from the clicked pillar" behaviour, never a stop. */
  useEffect(() => {
    if (hovering || reducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % compliancePillars.length);
    }, PILLAR_ADVANCE_MS);
    return () => window.clearInterval(interval);
  }, [hovering, cycleReset, reducedMotion]);

  /* Measure the tallest card and pin the container to it, before paint, so the
     section is never a frame short. The measurement reads each card's CONTENT
     box, not the card: the card is `h-full` (every card is the height of the
     tallest, so the stack reads as one panel), which means the card's own box
     can only ever report back the height we just handed it — measure that and
     you get the previous value forever. The content box is in normal flow, so
     its height is the card's own — copy plus the padding that box carries —
     and a ResizeObserver over the four of them
     keeps the container right when the text rewraps at a narrower width — in
     both directions, which a one-shot measurement on mount would get wrong
     the moment someone resized back up. `min-h` on the container covers the
     server-rendered frame, before this has run. */
  useLayoutEffect(() => {
    const measure = () => {
      const tallest = cardContentRefs.current.reduce((max, node) => {
        if (!node) return max;
        return Math.max(max, node.getBoundingClientRect().height);
      }, 0);

      if (tallest > 0) {
        setStackHeight((current) =>
          current !== null && Math.abs(current - tallest) < 0.5
            ? current
            : tallest,
        );
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    cardContentRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  function handleTabKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = compliancePillars.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;

    event.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  }

  /* Manual selection: choose the pillar AND restart the 7-second clock, so
     the clicked pillar holds the panel for a full cycle before rotation
     resumes. Keyboard activation of a tab also arrives here as a click. */
  function handlePillarSelect(index: number) {
    setActiveIndex(index);
    setCycleReset((value) => value + 1);
  }

  return (
    <section className="relative overflow-hidden border-y border-section-divider bg-linen py-section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Compliance & security assurance"
          title={
            <>
              Enterprise-grade compliance &{" "}
              <em className="accent-em">security</em>
            </>
          }
          description="Regulatory adherence is not a feature we bolt on at the end. It is the spine every programme runs on — clean invoicing, enforced budgets, private-by-design data handling and a documented chain of custody from pick to doorstep."
        />

        {/* NO TRUST BAR HERE. The five uppercase assurance claims that used
            to sit between this heading and the pillar grid - ISO 27001
            alignment, encryption at rest and in transit, role-based access,
            GST-ready invoicing and zero compliance flags - have been removed
            at the client's request, along with `complianceTrustSignals` in
            `lib/data.ts`. The array is gone rather than emptied: an exported
            `string[]` with nothing in it is a shape waiting to be refilled,
            and a `<ul>` that renders zero children is the empty container
            this removal was meant to avoid.

            SPACING. The removed `<ul>` carried `mt-10` and the grid below
            carries `mt-16`, so the heading used to sit 40px above the claims
            and then 64px above the tabs - roughly 120px of vertical travel
            through empty space. With the bar gone the heading sits `mt-16`
            (64px) straight above the grid, which is the same rhythm value the
            grid already declared for itself and is the house section step. No
            padding is orphaned and no compensating margin was added.

            The `data-reveal-stagger` marker went with the `<ul>`; the grid
            below still carries its own `data-reveal-item`, so the remaining
            content still reveals on scroll. Nothing in this section is now
            revealed by a marker that no longer exists. */}
        {/* Reveal marker on the wrapper, which mounts once. Putting one on the
            panel would re-animate it on every pillar change, for the same
            reason `IndustriesList` keeps its marker off the tab content. */}
        {/* Mobile accordion: each pillar header sits directly above its own
            panel, and ONLY the open panel is in the DOM. Nothing is
            absolutely positioned and nothing reserves height for a closed
            tab — the open card is in normal flow, so it pushes the headers
            below it down and can never bleed over or overlap them. */}
        <div className="mt-8 flex flex-col lg:hidden">
          {compliancePillars.map((pillar, index) => {
            const selected = index === activeIndex;
            const hasPillarAccent = pillar.title.endsWith(pillar.titleAccent);
            const pillarAccent = hasPillarAccent ? pillar.titleAccent : "";
            const pillarLead = hasPillarAccent
              ? pillar.title.slice(0, -pillarAccent.length)
              : pillar.title;
            const tabId = `pillar-mobile-tab-${pillar.number}`;
            const panelId = `pillar-mobile-panel-${pillar.number}`;

            return (
              <div key={pillar.number}>
                <button
                  type="button"
                  role="tab"
                  id={tabId}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => handlePillarSelect(index)}
                  onKeyDown={(event) => handleTabKeys(event, index)}
                  className={`group w-full cursor-pointer rounded-card border py-3 px-4 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-linen ${
                    selected
                      ? "border-brand-green-600/30 bg-surface shadow-elev-1"
                      : "border-transparent hover:bg-surface/60"
                  }`}
                >
                  <span className="flex items-baseline gap-2">
                    <span
                      aria-hidden="true"
                      className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
                        selected ? "text-brand-primary" : "text-taupe"
                      }`}
                    >
                      {pillar.number}
                    </span>
                    <span
                      className={`text-base leading-snug tracking-tight transition-colors duration-200 ${
                        selected
                          ? "font-semibold text-charcoal"
                          : "font-medium text-charcoal/70 group-hover:text-charcoal"
                      }`}
                    >
                      {pillar.title}
                    </span>
                  </span>
                  <span className="mt-1.5 block pl-7 text-sm leading-5 text-taupe">
                    {pillar.summary}
                  </span>
                </button>

                {selected && (
                  <div
                    role="tabpanel"
                    id={panelId}
                    aria-labelledby={tabId}
                    tabIndex={0}
                    className="mt-2 overflow-hidden rounded-2xl border border-section-divider bg-surface shadow-elev-1"
                  >
                    <div className="px-4 py-3">
                      <h3 className="text-base font-medium text-charcoal">
                        {pillarLead}
                        {pillarAccent ? (
                          <span className="accent-em">{pillarAccent}</span>
                        ) : null}
                      </h3>
                      <p className="mt-2 text-[13px] leading-[1.3] text-taupe">
                        {pillar.detail}
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {pillar.specs.map((spec) => (
                          <li
                            key={spec}
                            className="flex items-start gap-2"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                            />
                            <span className="text-[11px] leading-[1.3] text-charcoal/80">
                              {spec}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <ButtonLink
                          href="/contact"
                          variant="primary"
                          className="text-[13px] px-4 py-2"
                          ariaLabel={`${pillar.ctaLabel} — ${pillar.title}`}
                        >
                          {pillar.ctaLabel}
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </ButtonLink>
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-warm-grey">
                          <Image
                            src={pillar.image}
                            alt={pillar.imageAlt}
                            fill
                            sizes="64px"
                            className="object-cover object-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop split grid — hidden on mobile */}
        <div
          data-reveal-item
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="hidden lg:grid mt-16 items-start gap-8 lg:grid-cols-12 lg:gap-10"
        >
          {/* Pillar menu — 3 of 12 columns. The brief's 35% is 4.2, and 4
              would leave the panel too narrow to hold three spec lines without
              wrapping, so the split is 3/9. The hover pause lives on the
              section grid above — resting the pointer on the tabs OR the panel
              holds the rotation, and nothing else does. */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Security and compliance pillars"
            className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1 lg:col-span-3"
          >
            {compliancePillars.map((pillar, index) => {
              const selected = index === activeIndex;
              const tabId = `pillar-tab-${pillar.number}`;
              const panelId = `pillar-panel-${pillar.number}`;

              return (
                <button
                  key={pillar.number}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={tabId}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => handlePillarSelect(index)}
                  onKeyDown={(event) => handleTabKeys(event, index)}
                  className={`group cursor-pointer rounded-card border py-3 px-3 lg:py-4 lg:pl-4 lg:pr-3 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-linen ${
                    selected
                      ? "border-brand-green-600/30 bg-surface shadow-elev-1"
                      : "border-transparent hover:bg-surface/60"
                  }`}
                >
                  <span className="flex items-baseline gap-2 lg:gap-3">
                    <span
                      aria-hidden="true"
                      className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
                        selected ? "text-brand-primary" : "text-taupe"
                      }`}
                    >
                      {pillar.number}
                    </span>
                    <span
                      className={`text-base leading-snug tracking-tight transition-colors duration-200 ${
                        selected
                          ? "font-semibold text-charcoal"
                          : "font-medium text-charcoal/70 group-hover:text-charcoal"
                      }`}
                    >
                      {pillar.title}
                    </span>
                  </span>
                  <span className="mt-1.5 block pl-7 text-sm leading-5 text-taupe hidden lg:block">
                    {pillar.summary}
                  </span>
                </button>
              );
            })}
          </div>

          {/* The card stack. `relative` plus a measured height is what makes
              the overlap work: the cards are `absolute` and each fills this
              box, so the container never changes size when the selection
              changes and the rest of the page below it never moves.
              `overflow-hidden` clips to that box so no card edge can ever
              paint outside the panel — with the padding measured (see the
              card below) the content is always shorter than the frame, so the
              clip is a guarantee, not a crop. `min-h` is the server-rendered
              floor, for the frame before measurement runs. */}
          <div
            className="relative min-h-[14rem] lg:min-h-[30rem] overflow-hidden lg:col-span-9"
            style={stackHeight ? { height: `${stackHeight}px` } : undefined}
          >
            {compliancePillars.map((pillar, index) => {
              const selected = index === activeIndex;
              const hasPillarAccent = pillar.title.endsWith(pillar.titleAccent);
              const pillarAccent = hasPillarAccent ? pillar.titleAccent : "";
              const pillarLead = hasPillarAccent
                ? pillar.title.slice(0, -pillarAccent.length)
                : pillar.title;

              return (
                <div
                  key={pillar.number}
                  role="tabpanel"
                  id={`pillar-panel-${pillar.number}`}
                  aria-labelledby={`pillar-tab-${pillar.number}`}
                  tabIndex={selected ? 0 : -1}
                  aria-hidden={!selected}
                  inert={!selected}
                  className={`absolute inset-0 h-full w-full overflow-hidden rounded-3xl border border-section-divider bg-surface shadow-elev-2 transition-opacity duration-500 ease-in-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-linen ${
                    selected ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {/* `overflow-hidden` on the CARD is what makes the edge-to-edge
                      image possible: the illustration runs to the panel's right,
                      top and bottom edges with square corners of its own, and
                      this clip is what trims those corners to the card's
                      `rounded-3xl`. It was added in the same pass that removed
                      the image's own radius — without the clip the picture
                      would square off the rounded panel.

                      The measurement target (see the effect above). It NO LONGER
                      carries the padding — that moved down onto the copy column
                      so the image could reach the card edge — but the padding is
                      still inside what is measured, because the copy column is a
                      descendant of this box. That is the invariant the effect
                      depends on: measured as a content-only box with the padding
                      outside it, the tallest card would overstate its content by
                      exactly that padding and spill past its own border. */}
                  <div
                    ref={(node) => {
                      cardContentRefs.current[index] = node;
                    }}
                  >
                    {/* TWO COLUMNS: copy left, edge-to-edge illustration right.
                        The panel went from one full-width text run to a
                        7/5 split so a 1600x1600 illustration has somewhere to
                        live that is not on top of the copy. `grid-cols-1` +
                        `md:grid-cols-12` stacks on mobile and splits from the
                        `md` breakpoint up.

                        THE IMAGE IS FULL-BLEED FROM `md` UP. Three things make
                        it reach the card's top, bottom and right edges:

                          1. THE PADDING MOVED OFF THE MEASUREMENT BOX ONTO
                             THE COPY COLUMN. It used to be `p-8 lg:p-10` on the
                             box wrapping BOTH columns, which is what left a
                             2.5rem linen gutter around the picture. Now the
                             box has no padding at all and the copy column owns
                             `p-8 lg:pr-12`. All the padding is still inside the
                             measured box (the copy column is a descendant),
                             which is the invariant the height measurement needs
                             — see the note on the ref above.
                          2. THE IMAGE COLUMN HAS NO PADDING OR GAP AROUND IT.
                             `gap-x-12` is gone, so there is no grid gutter
                             between copy and picture either. At `md` the copy's
                             `lg:pr-12` becomes the separation; below `md` the
                             columns are separate grid rows, so the padding is
                             all round the text and nothing is lost.
                          3. `overflow-hidden` IS ON THE CARD, NOT THE IMAGE.
                             That is what trims the picture's square corners to
                             the card's `rounded-3xl`. The image itself carries
                             no radius now — a radius on a full-bleed element
                             would leave the card's own corners showing through
                             as slivers.

                        NO EMPTY SPACE UNDER THE PICTURE, either. `items-start`
                        is gone from the grid, so both columns stretch to the
                        row height, and the frame takes that height with
                        `md:h-full md:aspect-auto` — the `aspect-auto` being
                        what stops `aspect-square` from imposing a shorter box.
                        Below `md` the columns stack and the image has no row
                        height to inherit, so the bare `aspect-square` is kept:
                        it reserves the box before the bytes arrive, which is
                        what stops the crossfade stack's measured height from
                        jumping as an image decodes. The height classes are
                        `md:`-prefixed for that reason — a bare `h-full` would
                        resolve against an indefinite parent and collapse.

                        Because the frame is now taller than wide, the square
                        source images are cropped by `object-cover` on their
                        left and right edges. The anchor is `right`, so the crop
                        is taken off the LEFT edge only - see the note at the
                        `<Image>`.

                        Column order is copy-then-image at every width, so the
                        mobile stack reads as text followed by the picture
                        rather than a picture the reader has to scroll past to
                        reach the heading. */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <div className="p-8 md:col-span-7 lg:pr-12">
                        {/* `text-brand-primary` (#a83b24) is the site's trademark
                            brick — the same token `accent-em` uses, 6.33:1 on this
                            white panel and 5.47:1 on the linen band, so it clears
                            AA at any size. `primary` on the CTA is the house
                            conversion action and rhymes with the heading accent. */}
                        <h3 className="text-h2 text-charcoal">
                          {pillarLead}
                          {pillarAccent ? (
                            <span className="accent-em">{pillarAccent}</span>
                          ) : null}
                        </h3>

                        {/* `max-w-3xl` is dropped here: at 7 of 12 columns the
                            measure is already ~54 characters, so a second cap
                            would only fight the grid for no gain. */}
                        <p className="mt-5 text-body-lg leading-7 text-taupe">
                          {pillar.detail}
                        </p>

                        {/* No boxes, no rules. The specs went beige rounded
                            rectangles, then numbered columns under top rules —
                            both read as more chrome than the content needs. Now
                            each point is a plain line with a small brick dot:
                            `space-y-4` spacing gives each phrase room to stand
                            alone. */}
                        <ul className="mt-8 space-y-4">
                          {pillar.specs.map((spec) => (
                            <li key={spec} className="flex items-start gap-3">
                              <span
                                aria-hidden="true"
                                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                              />
                              <span className="text-sm leading-6 text-charcoal/80">
                                {spec}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA LABEL IS PER-PILLAR. This used to read "Request an audit
                            report" under all four panels, which made the
                            button boilerplate rather than the next step for
                            whatever the reader had just selected. It now
                            renders `pillar.ctaLabel`, so the privacy panel
                            offers a security report and the controls panel
                            offers the invoicing guide.

                            The destination stays `/contact` for all four: none
                            of these artefacts is a file or a route of its own
                            yet, so they are all requests rather than downloads,
                            and inventing four routes to label them would be a
                            larger change than this brief asks for. The
                            `aria-label` is built from the visible label plus
                            the pillar title so a screen reader announces which
                            panel's action this is — four buttons with different
                            text already read unambiguously, but the visible
                            label alone loses the pillar context when read out
                            of context in a list of links. */}
                        <ButtonLink
                          href="/contact"
                          variant="primary"
                          className="mt-9"
                          ariaLabel={`${pillar.ctaLabel} — ${pillar.title}`}
                        >
                          {pillar.ctaLabel}
                          <ArrowRightIcon className="h-4 w-4" />
                        </ButtonLink>
                      </div>

                      {/* Illustration column. FULL-BLEED: no padding, no
                          margin, no gap on any side, so the picture meets the
                          card's top, bottom and right borders.

                          NO BORDER AND NO RADIUS ON THE FRAME, both
                          deliberately. It is flush against the card's border
                          and clipped by the card's own `overflow-hidden`, so a
                          second 1px border here would draw a hairline inside
                          the card's hairline, and a `rounded-2xl` on a
                          full-bleed element would let slivers of the card
                          show at all four corners.

                          `shadow-elev-1` also goes. It made sense when the
                          picture floated inside the card on all sides; flush to
                          three edges there is nothing for a shadow to fall on,
                          and it would darken the card's own edge instead.

                          `bg-warm-grey` stays — it is the neutral the rest of
                          the site paints behind a photo that has not decoded
                          yet, so there is no white flash. Against the card's
                          `bg-surface` it is a half-step darker, which reads as
                          a deliberate placeholder rather than a hole.

                          `md:h-full md:aspect-auto` is what removes the empty
                          space beneath the picture: the grid stretches both
                          columns to the row height, `h-full` takes all of it,
                          and `md:aspect-auto` cancels the `aspect-square` that
                          would otherwise impose a shorter box.

                          `h-full` needs a definite height to resolve against,
                          which the stretched grid row provides from `md` up.
                          Below `md` the columns stack, the row has no height to
                          inherit and `h-full` would collapse the frame to
                          nothing — so the height classes are `md:`-prefixed and
                          the bare `aspect-square` still governs the mobile
                          case. There the image spans the card's full width
                          between the copy's padding and the card's own border,
                          and the card's `overflow-hidden` trims its bottom
                          corners so it cannot break the card boundary.

                          The frame carries `aspect-square`, not the `<Image>`,
                          so the box is reserved before the bytes arrive — which
                          is what stops the crossfade stack's measured height
                          from jumping as an image decodes.

                          `sizes` describes a 5-of-12 column at the split
                          breakpoints and the full card width when stacked, so
                          the browser can pick a source width near the rendered
                          size rather than the largest.

                          `object-cover OBJECT-RIGHT`. The anchor is `right`,
                          not `center`, per the client's direction that these
                          illustrations sit right-aligned in the card - the
                          same treatment the home page's How It Works band now
                          uses on its illustrations.

                          `object-right` does real work here rather than being
                          a garnish. This column is 5 of 12 and the row is sized
                          by the ~300-character copy beside it, so the frame is
                          a PORTRAIT box holding a SQUARE source: `object-cover`
                          scales the picture to the frame's height and discards
                          the difference off the two sides, with `center`
                          splitting that loss evenly between them. Anchoring
                          right keeps the whole loss on one edge, which is the
                          point when the subject sits right of centre in the
                          artwork.

                          NOT a per-pillar `imageFocus` field the way How It
                          Works does it. There, two of its four steps differ, so
                          the token carries information; here all four are the
                          same value, and a data field would be four copies of
                          one constant. If a pillar ever needs a different
                          anchor, that is when the field starts earning its
                          place. */}
                      <div className="md:col-span-5">
                        <div className="relative aspect-square overflow-hidden bg-warm-grey md:h-full md:aspect-auto">
                          <Image
                            src={pillar.image}
                            alt={pillar.imageAlt}
                            fill
                            sizes="(min-width: 1280px) 38vw, (min-width: 768px) 42vw, 100vw"
                            className="object-cover object-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
