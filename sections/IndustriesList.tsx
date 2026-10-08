"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { industries } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

/* Cascade constants for the local per-row grid entrance. Copied verbatim from
 * the sixteen-card catalog in components/catalog/ProductCatalogTabs.tsx and the
 * eight-card home grid in ProductShowcaseClient.tsx, so all three grids arrive
 * identically, and deliberately shorter than the site-wide `CONTENT_OFFSET_MS` /
 * `STEP_MS` in components/ui/RevealOnScroll.tsx (300ms / 100ms). `ROW_STAGGER_MS`
 * is the WITHIN-row step: cards in one row arrive left-to-right, and the next
 * row is separated by scroll position rather than by a delay. */
const ROW_STAGGER_MS = 55;

/* `lg:grid-cols-3` with `md:grid-cols-2` beneath it and one column below that.
 * The observer reads the live column count off the element rather than trusting
 * this, so this is only the first guess used to avoid a flash of wrong grouping
 * before measure. */
const DEFAULT_COLUMNS = 3;

/**
 * Industries We Serve — a six-card grid built on the "Tailored Solutions"
 * vocabulary.
 *
 * WHAT THIS MIRRORS, precisely: `sections/SolutionsTabs.tsx` on /services,
 * which is the section with the eyebrow "Tailored solutions" (there is no
 * `sections/TailoredSolutions.tsx` — that filename does not exist). Every
 * structural value below is lifted from that component rather than invented:
 *
 *   section      `border-t border-section-divider bg-surface py-section`
 *   container    `mx-auto max-w-7xl px-6`
 *   heading      `SectionHeading align="center"` with an `accent-em` phrase
 *   rhythm       `mt-14 md:mt-16` on the grid, `mt-5` to the body,
 *                `mt-7 gap-3.5` on the bullet list, `mt-9` to the CTA
 *   bullet       `CheckIcon` at `h-4 w-4` in `text-brand-green-700`, gap-2.5,
 *                `text-body text-charcoal`. Same tick as `SolutionsTabs` but
 *                WITHOUT its tinted circle — see the comment on the list.
 *   CTA          `ButtonLink variant="primary"` + `ArrowRightIcon h-4 w-4`
 *   frame        `rounded-card` + `shadow-elev-2`, `object-cover`
 *
 * WHAT IT DOES NOT MIRROR, because there is nothing to mirror: `SolutionsTabs`
 * is a four-TAB split view — a pill rail driving one dynamic panel — not a
 * card grid. It has no repeated cards, so "the multi-card grid layout" of that
 * section does not exist to copy. What is mirrored is its panel anatomy
 * (heading, body, three plain points, CTA, photo), repeated six times and
 * set in the house card frame that `CaseStudyGrid` and `ServiceTiers` already
 * use. `IndustryCaseStudies` used to be the third reference here; it has been
 * removed from /industries and its metrics folded into the `proof` field of
 * the cards below, so it is no longer a live precedent for anything.
 *
 * NOT A SERVER COMPONENT ANY MORE. It used to be one, and the paragraph above
 * records that as the point of the earlier rewrite: six static cards need no
 * `useState`, so the section shipped no client JavaScript at all. The per-row
 * entrance below needs one `useEffect`, one `useRef` and one `useState` for the
 * measured column count, so it is a client component now. That is a real cost -
 * this section's copy, six card bodies, eighteen bullets and six proof footers
 * all cross into the client bundle - and it is bought for animation parity with
 * the /gifts catalog, not for interactivity. Nothing here is stateful: no
 * filter, no selection, no tab, so this is the smallest honest client component
 * in the section set.
 *
 * ENTRANCE: THE /GIFTS CATALOG MECHANISM, PORTED. The six cards now arrive on
 * exactly the entrance the sixteen gift cards on /gifts use - `.catalog-card-enter`
 * in app/globals.css, driven by a local per-row `IntersectionObserver` - rather
 * than on the shared `RevealOnScroll` grid they used before. One keyframe, one
 * duration (0.5s), one bezier, one travel distance (14px), one within-row step
 * (55ms) across all three catalog grids on the site.
 *
 * It is a LOCAL observer, not `data-reveal-stagger`, and `data-reveal-stagger`
 * has been REMOVED from the grid below to make room for it. That marker is the
 * shared observer's: it staggers by CHILD INDEX off ONE boundary, which put all
 * six cards on 24px of travel simultaneously and made the last one wait
 * 300ms + 5x100ms = 800ms. Worse, because this section sits directly under
 * `IndustriesHero`, the shared observer fires the entire grid the moment the
 * SECTION crosses its line - so on a short hero the six cards could begin a
 * 24px lift while the reader was still looking at the hero above them. Rows are
 * not DOM elements in an auto-flow grid, so the row is derived from the card's
 * index and the live column count, and each ROW is observed separately. Do not
 * put `data-reveal-stagger` back: both systems apply an UNLAYERED `opacity: 0`,
 * and if they ever disagreed about who owned these six cards the cards would be
 * invisible until the loser of that argument gave up.
 *
 * The heading keeps the shared observer and the cards take the local one. That
 * split is deliberate and is the same one the /gifts catalog makes: the
 * `data-reveal-header` on `SectionHeading` gives the eyebrow, title and
 * description the shared 24px / 0.6s header cadence off the section boundary,
 * while the cards below cascade per row. The two systems own disjoint nodes -
 * the heading's three children versus the six `<article>`s - so nothing is
 * observed twice.
 *
 * This is also the third and final move in this section's entrance history,
 * and it retires the two states that came before. Load-time, via
 * `data-reveal-exempt` + `enterOnLoad` + `animate-fade-up` on the cards: the
 * whole band was mid-entrance while the reader was on the hero. Then
 * scroll-triggered off the section, via `data-reveal-stagger`: correct in
 * principle, but all six cards moved as one block at the section's line rather
 * than as rows.
 *
 * Reduced motion is honoured by not creating the observer at all, and the
 * unlayered `opacity: 1 !important` in the `.catalog-card-enter` reduced-motion
 * block is what actually makes the cards visible in that case - the same
 * arrangement both catalog grids rely on. The cards' own `hover:-translate-y-1`
 * lift is unaffected by the keyframe's filled `transform: translateY(0)` end
 * state for the reason recorded in globals.css: Tailwind v4 emits that hover as
 * the standalone `translate` property, which composes with `transform` rather
 * than being overridden by it. The 14px rise starts 14px BELOW the card's final
 * position, which is well inside the 32px (`gap-8`) / 40px (`md:gap-10`) row gap,
 * so no card ever overlaps its neighbour mid-entrance and `transform` cannot
 * shift layout.
 */

export function IndustriesList() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  /* The grid is `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, so "which row is
   * this card in" depends on the viewport. Measured rather than read from a
   * media query: `getComputedStyle().gridTemplateColumns` resolves to the used
   * track list (`"380px 380px 380px"`), so counting its entries gives the real
   * column count at every breakpoint this grid has.
   *
   * Observed rather than read once, and deliberately so: the observer below
   * exists only to group cards into rows, and a resize that changes the column
   * count changes that grouping. It fires once immediately on observe, which
   * covers the initial value. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const tracks = window
        .getComputedStyle(grid)
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length;
      if (tracks > 0) setColumns(tracks);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  /* Per-row scroll-triggered cascade for the six cards - the same mechanism the
   * sixteen cards on /gifts use, brought across so all three catalog grids
   * arrive identically. The visual half is `.catalog-card-enter` in
   * globals.css.
   *
   * Dependency is `[columns]` and nothing else, because unlike the /gifts
   * catalog and the home grid there is no filter state here: the six cards are
   * fixed, so the column count is the only thing that can change which row a
   * card belongs in. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-catalog-card]"),
    );
    if (cards.length === 0) return;

    /* Reduced motion is honoured by simply not animating: the cards render in
     * their final state and no observer is created at all. The unlayered
     * `opacity: 1` in the reduced-motion block of `.catalog-card-enter` is what
     * actually makes them visible here. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    /* Grouped by row so one observer callback reveals a whole row together. A
     * card's delay is its position WITHIN its row, which is why the cascade
     * reads left-to-right rather than as six separate arrivals. */
    const rows = new Map<number, HTMLElement[]>();
    cards.forEach((card, index) => {
      const row = Math.floor(index / columns);
      card.dataset.row = String(row);
      const list = rows.get(row);
      if (list) list.push(card);
      else rows.set(row, [card]);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target as HTMLElement;
          observer.unobserve(card);

          const siblings = rows.get(Number(card.dataset.row)) ?? [];
          const position = siblings.indexOf(card);
          const delay = position * ROW_STAGGER_MS;

          card.style.setProperty("--card-enter-delay", `${delay}ms`);
          /* One frame between the un-hidden start state and the revealed one,
           * so the animation has something to animate FROM. Adding both classes
           * in the same task would collapse it and the row would snap in with no
           * animation - the same trap as setting a transition and a changed
           * value together. */
          requestAnimationFrame(() => {
            card.classList.add("is-revealed");
          });
        });
      },
      {
        /* Identical gate to the catalog's, the home grid's and
         * `RevealOnScroll`'s: reveal on contact, once the row is 80px into the
         * viewport. A row on screen at page load animates on arrival; a row
         * below the fold waits for the scroll. */
        rootMargin: "0px 0px -80px 0px",
        threshold: 0,
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [columns]);

  return (
    <section
      id="industries"
      className="scroll-mt-28 border-t border-section-divider bg-surface py-section md:scroll-mt-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Industries we serve"
          title={
            <>
              Different sectors. Seamless{" "}
              <em className="accent-em">operations.</em>
            </>
          }
          description="The moments, schedules and compliance needs of your industry shape how we curate, pack and deliver. Here is how we show up for six of them."
        />

        {/* `gap-8 md:gap-10` rather than SolutionsTabs' `gap-10 md:gap-12`:
            that panel is two columns of roughly 600px, these are three of
            roughly 380px, and the larger gap leaves each card visibly more
            detached from its neighbours than the panel is from its photo.

            THE SIX CARDS CASCADE ONE ROW PER SCROLL - the same entrance the
            sixteen cards on /gifts use, copied across rather than re-specified.
            `data-reveal-stagger` was REMOVED from this grid to make room for
            it: that marker is the shared observer's, and leaving it would have
            put BOTH systems on the same six cards at once - this local one
            adding `.is-revealed` per row while the shared one independently
            applied its unlayered `opacity: 0` off a single boundary. They would
            fight, and the shared one would win the fight at 24px over 0.6s,
            which is the thing being replaced. Do not put `data-reveal-stagger`
            back.

            Rows are not DOM elements - `lg:grid-cols-3` is an auto-flow layout -
            so the row is derived from the card's index and the live column
            count. `ref` is the local observer's hook and the grid keeps every
            class it had; nothing about the layout moved. */}
        <div
          ref={gridRef}
          className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3"
        >
          {industries.map((industry) => (
            <article
              key={industry.id}
              /* `data-catalog-card` is the local observer's hook and `data-row`
               * is stamped on below by the same effect that groups the cards, so
               * the two cannot drift apart. The entrance itself is
               * `.catalog-card-enter` in globals.css - the identical class the
               * /gifts catalog cards carry, so all three grids share one
               * keyframe, one duration (0.5s), one bezier and one travel
               * distance (14px). Deliberately NOT `.reveal-on-scroll`: that rule
               * is unlayered `opacity: 0` and belongs to the shared observer.
               * Stacking it here would leave these cards invisible whenever the
               * two systems disagreed about who owns them.
               *
               * `is-revealed` is added by the observer, not written here. The
               * card's own classes - `rounded-card`, `shadow-elev-1`, the
               * `hover:` lift and border wash - are untouched, and the lift
               * survives the keyframe's filled end state because Tailwind v4
               * emits `hover:-translate-y-1` as the standalone `translate`
               * property, which composes with `transform` rather than being
               * overridden by it. */
              data-catalog-card
              data-row="0"
              className="catalog-card-enter group flex flex-row md:flex-col overflow-hidden rounded-card border border-section-divider bg-surface shadow-elev-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-brand-green-600/40 hover:shadow-card-hover md:hover:shadow-card-hover"
            >
              {/* Photo frame, same construction as the Tailored Solutions one:
                  transform on the `<Image>` rather than the wrapper, so the
                  card's border and shadow stay put while the picture scales.
                  `overflow-hidden` on the ARTICLE (not just the image wrapper)
                  so the photo takes the card's top radius, and the CTA's bottom
                  padding survives the same clip. */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-warm-grey rounded-lg m-3 md:m-0 md:h-auto md:w-full md:rounded-none md:aspect-[3/2]">
                <Image
                  src={industry.image}
                  alt={industry.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 80px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:scale-100"
                  style={{ objectPosition: industry.imagePosition }}
                />
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1 p-3 md:p-8 md:gap-0">
                <h3 className="text-base md:text-h3 text-charcoal font-semibold md:font-normal leading-snug">{industry.name}</h3>

                <p className="mt-1 md:mt-5 text-xs md:text-body-lg text-taupe line-clamp-2 md:line-clamp-none">{industry.body}</p>

                {/* A bare tick, no circle around it.

                    The tick is `SolutionsTabs`' and it stays. The tinted chip
                    is what came off, and it was the chip rather than the tick
                    that made this grid read as machine-made: a 20px
                    `rounded-pill` in `bg-brand-green-50` behind every tick,
                    three per card across six cards, is eighteen identical
                    green pills stacked three-deep in a 3x3 block. That mass is
                    the stock-AI tell — a small stroke glyph is not. So the
                    glyph carries the marker job alone and the fill does not
                    double it.

                    `h-4 w-4` rather than the old inner `h-3.5 w-3.5`, because a
                    tick that used to sit inside a 20px circle and was sized to
                    fit it has to grow a little to read as a marker once the
                    circle is gone. `mt-1` optically centres it against 16px
                    `text-body` (line-height 1.6, so ~4.8px of half-leading
                    above the glyph); at `mt-0` it rides visibly high.

                    `gap-2.5` rather than the old `gap-3`. The 12px gap existed
                    to clear the visual mass of a filled 20px circle; a 16px
                    stroke glyph needs less air, and the tighter gap keeps the
                    three points reading as one list instead of three rows.

                    `text-brand-green-700` (#25553d) measures 8.59:1 on white.
                    A tick is a non-text graphic, so WCAG 1.4.11 asks 3:1 and
                    this clears it nearly three times over. No `aria-hidden` is
                    set here because `CheckIcon` already sets it in its own
                    `base` spread — repeating it on this element would be a
                    no-op, and the decorative-but-hidden decision belongs in
                    the one place it is made.

                    The gap inversion still does the grouping and is worth
                    keeping: `gap-3.5` (14px) BETWEEN the three points is
                    TIGHTER than the `mt-7` (28px) separating the list from
                    the body paragraph above, so the three read as a block
                    against the paragraph rather than as three more
                    paragraphs. Retune that and the list stops grouping.

                    `list-none` stays: the tick is an icon inside the `<li>`,
                    not a `list-style` marker, so there is still no list marker
                    to inherit. Tailwind preflight would reset it either way,
                    but a list with its markers removed on purpose should say
                    so on the element.

                    This is now a deliberate divergence from `SolutionsTabs`,
                    which keeps its full chip. That is not drift to correct:
                    three points in one panel are not eighteen, so the
                    repetition argument that applies here does not apply
                    there. `CaseStudyGrid` and `ServiceTiers` likewise keep
                    their own treatments. */}
                <ul className="mt-7 hidden md:flex list-none flex-col gap-3.5">
                  {industry.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />
                      <span className="text-body text-charcoal">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Proof slot: the metric line and its one supporting line,
                    and the only metric on the card. There is no conditional
                    here any more. `proof` is a required field on `Industry`,
                    so the numeral branch that used to catch a card without one
                    is unreachable and has been deleted along with the `stat` /
                    `statLabel` pair it read. TypeScript now rejects a seventh
                    card that omits a proof, which is a better failure than
                    rendering an empty footer. The strings are public copy and
                    several are claims; see the NOTE for review directly above
                    `industries` in lib/data.ts.

                    The hairline and its top padding sit on this wrapper. It is
                    a card footer divider, not a badge border, and it predates
                    the proof field entirely.

                    This was a tinted pill — `bg-brand-green-50`, a
                    `border-brand-green-200` outline, `rounded-pill`, `px-3 py-1`
                    — and the pill has been stripped back to plain typography.
                    The green-50 fill was the same green the tick marks above
                    already used, so removing it took the card from two greens
                    to one and lets the metric carry itself on weight alone.
                    Legibility improved rather than suffered: the pill was
                    drawn in `text-brand-green-900` at 9.52:1 against that fill,
                    and `text-charcoal` on white measures 17.8:1. A 16px bold
                    face still needs 4.5:1 rather than the 3:1 a display size
                    would, and 17.8:1 clears it with room.

                    `stat-numeral` rather than a bare `font-bold`: it is the
                    house's designated metric treatment (Space Grotesk, 700,
                    tabular-nums, -0.02em) and already carries the weight, so
                    naming `font-bold` would declare the same property twice.

                    The class is named for numerals and NOT ONE of the six
                    current tags contains a digit — they are all phrases, on
                    purpose, to read as craft rather than as throughput. It is
                    still the right utility: that -0.02em is what lets a
                    38-character phrase set as cleanly as "99.4%" did. The name
                    records where the class came from, not what it is for.

                    `font-mono` is gone. It read as deliberate on a small mono
                    pill, which is what `ComplianceAssurance` uses it for, but
                    at 16px bold it stops being a texture and starts being a
                    different typeface — and this site has no `--font-mono`
                    token in globals.css, so it was never a house face here.

                    The detail line is `text-body-sm text-taupe`. With the
                    pill's background gone there is no container separating
                    the metric from its supporting copy, so size and contrast
                    have to do that work: 16px bold against 14px regular, and
                    17.8:1 against 7.56:1. `text-taupe` is also the body-copy
                    token this card's own `body` paragraph uses, so the detail
                    matches the copy above it.

                    These descriptions are markedly longer than the metrics they
                    sit under — 100 to 130 characters against roughly 30 — so
                    this footer is now the tallest text block in the card. That
                    is a content decision, not a layout bug: the cards use
                    `mt-auto` on the CTA, so a taller footer lengthens the card
                    without stepping the buttons. If the rows get unwieldy, the
                    detail is the thing to shorten, not the spacing. */}
                <div className="mt-7 border-t border-section-divider pt-5 hidden md:block">
                  <p className="stat-numeral text-base text-charcoal">
                    {industry.proof.tag}
                  </p>
                  <p className="mt-2 text-body-sm text-taupe">
                    {industry.proof.detail}
                  </p>
                </div>

                {/* `mt-auto` rather than a fixed `mt-9`, so the CTAs align on a
                    baseline across a row instead of hanging at whatever depth
                    each card's copy ended. Without it, a two-line body in one
                    card and a four-line body in its neighbour leave the buttons
                    visibly stepped — the ragged-card-bottom problem
                    `GuaranteesGrid` documents. The `pt-9` preserves
                    SolutionsTabs' `mt-9` rhythm above the button. */}
                <div className="mt-auto pt-9 hidden md:block">
                  <ButtonLink
                    href="/contact"
                    variant="primary"
                    /* The card's own `cta` copy rather than a derived
                       "Explore {name}" — the industries CTA brief asked for
                       inquiry-driven buttons tailored to each sector. Routing,
                       variant, arrow and styling are untouched. The aria-label
                       pairs the button text with the card it acts on. */
                    ariaLabel={`${industry.cta} — ${industry.name}`}
                  >
                    {industry.cta}
                    <ArrowRightIcon className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
