"use client";

import Image from "next/image";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Testimonial } from "@/lib/data";

const COLUMN_COUNT = 3;

/* Per-column pace, paired with the `--animate-testimonials-*` theme tokens in
   globals.css. Alternating direction AND three different durations is what
   stops the deck reading as one rigid conveyor belt. Held as literal class
   strings so Tailwind's scanner can see them — a name built at runtime would
   never be emitted. */
const COLUMN_MOTION = [
  "animate-testimonials-down", /* 45s, downward */
  "animate-testimonials-up", /* 40s, upward   */
  "animate-testimonials-down-slow", /* 50s, downward */
] as const;

/* THE MOBILE DECK'S ROWS: three rows, alternating direction, three paces — the
   same argument as `COLUMN_MOTION` one axis over, and it bites harder here.
   Three rows running at one speed read as a single striped texture; three rows
   running at different speeds in different directions read as three separate
   lines of cards, which is what a reader scanning a phone actually wants. Same
   naming discipline: literal strings, because an interpolated class name emits
   no rule at all. */
const ROW_COUNT = 3;
const ROW_MOTION = [
  "animate-testimonials-right", /* 38s, leftward */
  "animate-testimonials-left", /* 46s, rightward */
  "animate-testimonials-right-slow", /* 54s, leftward */
] as const;

interface StatCardData {
  value: string;
  label: string;
  note: string;
  image: string;
  position: string;
  alt: string;
}

/* Photo + gradient callout cards woven into the quote deck. */
const statCards: StatCardData[] = [
  {
    value: "+99%",
    label: "On-time fulfilment",
    note: "measured across 40,000+ orders",
    image: "/hero-gift.jpg",
    position: "50% 45%",
    alt: "A premium curated gift box wrapped with ribbon",
  },
  {
    value: "500+",
    label: "Employee kits delivered",
    note: "in a single launch week",
    image: "/about-hero.jpg",
    position: "50% 40%",
    alt: "Flat lay of curated corporate gift hampers",
  },
  {
    value: "₹1.2 Cr+",
    label: "Rewards delivered",
    note: "gift value dispatched last year",
    image: "/about-craft.jpg",
    position: "50% 45%",
    alt: "Carefully arranged gift boxes on a warm surface",
  },
];

type Tone = "white" | "linen" | "dark";
type DeckCard =
  | { kind: "quote"; item: Testimonial; tone: Tone }
  | { kind: "stat"; card: StatCardData };

/* Interleave: three brand quote cards, then one stat card, repeating. */
function buildDeck(items: Testimonial[]): DeckCard[] {
  const tones: Tone[] = ["white", "linen", "white", "dark"];
  const deck: DeckCard[] = [];
  let quotes = 0;
  let stats = 0;

  items.forEach((item) => {
    deck.push({ kind: "quote", item, tone: tones[quotes % tones.length] });
    quotes += 1;
    if (quotes % 3 === 0 && stats < statCards.length) {
      deck.push({ kind: "stat", card: statCards[stats] });
      stats += 1;
    }
  });

  return deck;
}

/** Contiguous chunks, deliberately not round-robin.
 *
 *  Round-robin also fills three columns, but it scrambles the reading order:
 *  each row of the mobile deck would present the fifteen cards out of sequence,
 *  and the desktop columns are read down rather than across. Contiguous chunks
 *  keep the order identical to the authored deck in both layouts.
 *
 *  The deck lands on fifteen (twelve quotes plus three stat cards), which
 *  divides exactly, so the columns come out equal and each one carries the
 *  same four-quote-one-stat mix — just with the stat card sitting at a
 *  different height in each, which is what keeps the columns from looking
 *  mechanically identical. */
function buildColumns(deck: DeckCard[]): DeckCard[][] {
  const size = Math.ceil(deck.length / COLUMN_COUNT);
  return Array.from({ length: COLUMN_COUNT }, (_, i) =>
    deck.slice(i * size, (i + 1) * size),
  );
}

/** Contiguous chunks again, for the same reading-order reason.
 *
 *  The same fifteen cards in the same authored order, cut three ways instead of
 *  three-ways-vertically, so a reader who starts at row 1 reads 01–05, row 2
 *  reads 06–10 and row 3 reads 11–15 — with one stat card in each row, in a
 *  different position in each, which is what keeps the three rows from looking
 *  like three identical strips.
 *
 *  FIVE PER ROW IS A CARD-COUNT DECISION AND NOT A WIDTH ONE. Each row is
 *  5 × 260px of card plus gutters, so it is about 1,380px of track against a
 *  375px viewport: enough copies that no row shows a seam for several seconds,
 *  few enough that fifteen cards is still the whole deck rather than the same
 *  three repeated. */
function buildRows(deck: DeckCard[]): DeckCard[][] {
  const size = Math.ceil(deck.length / ROW_COUNT);
  return Array.from({ length: ROW_COUNT }, (_, i) =>
    deck.slice(i * size, (i + 1) * size),
  );
}

/**
 * "Proof in Action" — a three-column infinite vertical marquee of client
 * results, each column scrolling independently (down / up / down) at its own
 * pace inside a masked 580px window.
 *
 * This replaces a horizontal auto-advancing carousel. That version needed
 * cloned leading/trailing slides, a measured px-per-slide step, a wrap
 * transform snap, an interval timer and eleven pieces of state; all of that
 * existed only to fake a loop in a horizontal axis, and it is replaced here by
 * two identical stacked copies and a `translateY(-50%)` keyframe. The component
 * is no longer a client component — the whole effect is CSS.
 *
 * Structure, in order of nesting: a hover target wrapping a 3-column grid;
 * each column is a clip window with a top/bottom fade mask; inside each window
 * a track holds two identical copies of that column's cards.
 *
 * MOBILE IS A DIFFERENT DECK, not a smaller one. Below 768px this section is
 * three horizontal rows of five cards scrolling in alternating directions, and
 * the vertical deck above is `hidden`. The reason is the one that made the old
 * mobile fallback unusable: a vertical marquee on a narrow viewport is a
 * conveyor belt moving the text you are trying to read, and collapsing three
 * columns into one stack did not fix it — it removed the animation and left
 * 6,600px of cards to scroll past. Turning the axis does: the reader picks which
 * card to stop at, the band is about 950px tall instead of 6,600, and all
 * fifteen cards are still there.
 *
 * What that costs, stated plainly: the two decks are both in the document at
 * every width, because the breakpoint is CSS in both directions (`hidden
 * md:grid` and `md:hidden`) and a JS branch would mean a hydration mismatch on
 * every phone. The price is one extra mounted copy of fifteen quote cards -
 * text only, no layout and no paint while hidden, and the three stat images are
 * already in the cache because the other tree wants the same three files.
 *
 * The desktop contract is untouched, and the rule for keeping it that way is
 * that every desktop-specific value is written as an `md:` class rather than as
 * a new class on a wrapper: at 768px and up `w-auto` in a `flex-col` copy is
 * stretch, `shrink` is the initial 1, and the `min-h-[420px]` / `p-7` figures
 * are the literal numbers the column deck has always been built around. The
 * vertical keyframes, the top/bottom column mask, the hover pause and the
 * reduced-motion fallback are all as they were.
 *
 * Reduced motion removes both decks' animations. The columns fall back to a
 * static three-up grid as before; the rows become ordinary swipeable strips,
 * which is the only reason the mobile fallback can drop the animation: a row
 * copy is about 1,380px of card, so a stopped-but-still-clipped row would show
 * a reader one card and no way to reach the rest. All of it is in globals.css.
 */
export function TestimonialsCarousel({
  items,
  parentVariants,
}: {
  items: Testimonial[];
  parentVariants?: Variants;
}) {
  const deck = buildDeck(items);
  const columns = buildColumns(deck);
  const rows = buildRows(deck);

  return (
    <div className="testimonials-marquee">
      {/* THE DESKTOP DECK, UNCHANGED. `hidden` + `md:grid` is the entire edit:
          `grid-cols-1` was the class that made this a one-column stack below the
          breakpoint, and it is the class the mobile deck replaces, so it goes
          with it. At 768px and above the computed styles are the same three
          columns in the same grid at the same gap that this component has
          always rendered — the keyframes, the mask, the hover pause and the
          reduced-motion fallback all still describe a vertical marquee and none
          of them were touched.

          `grid-cols-1` had a second job below 768px that is now the mobile
          deck's: presenting all fifteen cards in deck order. It does that here
          too, in three contiguous columns. */}
      <div className="hidden gap-6 md:grid md:grid-cols-3">
        {columns.map((column, index) => (
          <motion.div
            key={index}
            variants={parentVariants}
            className="testimonials-marquee-column"
          >
            <div
              className={`testimonials-marquee-track ${COLUMN_MOTION[index]}`}
            >
              <div className="testimonials-marquee-copy">
                {column.map((card, i) => (
                  <DeckCardView key={`c${index}-${i}`} card={card} />
                ))}
              </div>

              {/* The duplicate copy is what `translateY(-50%)` crosses, so the
                  wrap never shows a seam. `aria-hidden` because otherwise every
                  quote is announced twice. Collapsed by the mobile and
                  reduced-motion fallbacks, which show the first copy only. */}
              <div
                aria-hidden="true"
                className="testimonials-marquee-copy testimonials-marquee-copy--duplicate"
              >
                {column.map((card, i) => (
                  <DeckCardView key={`c${index}-${i}-dup`} card={card} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* THE MOBILE DECK — three horizontal rows, alternate directions.
          Below 768px this is the whole testimonial wall and the vertical one
          above is `hidden`.

          `parentVariants` IS NOT PASSED TO THE ROWS, and the reason is not the
          one it looks like. On the home page there is no variant tree at all —
          `EmotionalPayoff` reveals this band through `data-reveal-item` and
          passes nothing — so passing them would be inert there and appear to
          work. On `/gifts`, `/industries` and `/pricing`, `Testimonials` does
          pass them, inside a `motion.div` whose variants carry
          `staggerChildren`, and the three rows would then register in that same
          stagger group as the three columns and push them from index 0-2 to
          3-5. A three-column desktop entrance, silently re-timed, is a worse
          outcome than a mobile band that simply appears rather than staggering
          in. The rows stay plain elements in the variant tree's blind spot.

          The hover pause is inherited rather than restated: it is written
          against `.testimonials-marquee:hover .testimonials-marquee-track`, and
          the row tracks are not that class. They get their own equivalent in
          globals.css against `.testimonials-marquee-row-track`, inside the same
          `(hover: hover)` gate, so a tap on a phone cannot latch the deck.

          BOTH DECKS ARE IN THE DOCUMENT AT EVERY WIDTH, which is what
          `hidden`/`md:hidden` buys: no media query in JS, no client branch, and
          therefore no hydration mismatch and nothing to re-render when a window
          crosses the breakpoint. The cost is that the hidden tree's fifteen
          cards are still mounted — one extra copy of fifteen quotes of text, no
          layout, no paint, and the three stat images are already in the cache
          because the other tree needs the same three files.

          `flex flex-col gap-4` rather than a bare `block`: the vertical gap is
          the 1rem gutter between rows, and a wrapper that stacks them with no
          gap would run the three masked windows into one another and read as a
          single 950px block with three moving parts. Both are `display` values
          on the same block-level box, so the `md:hidden` half is identical. */}
      <div className="flex flex-col gap-4 md:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="testimonials-marquee-row"
            role="group"
            aria-label={`Testimonial row ${rowIndex + 1} of ${ROW_COUNT}`}
          >
            <div
              className={`testimonials-marquee-row-track ${ROW_MOTION[rowIndex]}`}
            >
              <div className="testimonials-marquee-row-copy">
                {row.map((card, i) => (
                  <DeckCardView key={`r${rowIndex}-${i}`} card={card} />
                ))}
              </div>

              {/* The same two-copies seam the columns use, crossed by
                  `translateX(-50%)` this time. `aria-hidden` for the same
                  reason — otherwise every quote in the row is announced twice —
                  and collapsed under `prefers-reduced-motion`, where the row
                  becomes a swipeable strip with one copy in it. */}
              <div
                aria-hidden="true"
                className="testimonials-marquee-row-copy testimonials-marquee-row-copy--duplicate"
              >
                {row.map((card, i) => (
                  <DeckCardView key={`r${rowIndex}-${i}-dup`} card={card} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        {/* WAS "Read all case studies" -> /case-studies. That page has been
            deleted, and this component renders on four routes - the home page,
            /gifts, /industries and /pricing - so leaving it would have put the
            same 404 in four places at once.

            The label had to change with the href rather than only the target:
            "read all case studies" names a page that no longer exists, so a
            /contact href under that wording is a button that lies about its own
            destination. "Book a consultation" is the label steps 01, 03 and 04
            of the home page already use for this route, which keeps one
            vocabulary for one action across the site.

            It is worth being honest about the shape this leaves behind: a wall
            of testimonials whose only exit is a sales conversation. That was
            true before this change too - the old destination was client stories,
            which are the testimonials above it. */}
        <ButtonLink href="/contact" variant="secondary">
          Book a consultation
          <ArrowRightIcon className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}

function DeckCardView({ card }: { card: DeckCard }) {
  return card.kind === "quote" ? (
    <QuoteCard data={card} />
  ) : (
    <StatCard data={card.card} />
  );
}

/** Type A — solid brand quote card: wordmark top, quote middle, author bottom.
 *
 *  The white tone is the one that needs help on a white section. `buildDeck`
 *  hands it to half the deck, and on a `#ffffff` field a `bg-white` card has no
 *  fill left to separate it — the only thing marking a card was the 8%-black
 *  `border-section-divider` hairline, which reads as a faint outline rather than
 *  a panel. So that tone gets a darker border plus a resting `shadow-elev-2`
 *  and is lifted to `shadow-card-hover` on hover. The linen and forest tones
 *  keep their own fills and need neither, so they take the border alone and
 *  stay flat until hover.
 *
 *  THE MOBILE GEOMETRY, and why every one of these is a `md:` revert rather
 *  than a desktop change. Below 768px this card lives in a horizontal row
 *  instead of a vertical column, and three of its desktop properties stop being
 *  right there: it needs a fixed width (in a column it was width:auto and
 *  stretched to the column), it must not shrink (in a row it is the thing being
 *  scrolled past, and `flex-shrink: 1` on the first card would quietly narrow it
 *  and break the -50% seam arithmetic), and 420px of minimum height at 260px of
 *  width is a 1:1.6 portrait, not a card. `p-5` against `p-7` is the same
 *  reasoning at the smallest scale: a 7px-larger gutter on every side of a
 *  260px card costs 14px of the reading measure, which on mobile is 220px of
 *  text against a column of three paragraphs.
 *
 *  THERE IS NO `min-h` HERE BELOW `md`, AND NONE IS NEEDED. Card height inside
 *  a row is settled by `align-items: stretch` on `.testimonials-marquee-row-copy`,
 *  which makes every card in a row exactly as tall as the tallest one — and all
 *  three rows contain a stat card, whose photograph sets a 280px floor. A
 *  min-height here would be a fourth number to keep in agreement with that
 *  floor for no visual gain.
 *
 *  At 768px and up each of these resolves to exactly the value it had before —
 *  `w-auto` in a `flex-col` copy is stretch, `shrink` is the initial 1, and
 *  `min-h-[420px]` / `p-7` are the literal numbers the column deck was built
 *  around. That is the whole reason they are written as `md:` overrides rather
 *  than as new classes on a wrapper.
 *
 *  WHAT WAS ACTUALLY OVERFLOWING, because it is worth recording rather than
 *  just fixing — the header row, and it was not marginal. The wordmark is
 *  `text-xs` at 0.2em tracking, so "Kestrel Telecom" sets about 154px plus the
 *  8px square and its 8px gap; the metric pill was `whitespace-nowrap` at
 *  10px/0.12em, so "Retention up · surveys agree" sets about 230px including its
 *  own padding. That is roughly 400px of content into the 240px card this
 *  report was written against, in a flex row with `justify-between`, no wrap,
 *  and two children whose default `min-width: auto` refuses to shrink — so
 *  neither could give way and about 200px of it painted straight out past the
 *  card's right edge onto the page. The article has no `overflow-hidden`, so
 *  nothing caught it.
 *
 *  Four things fix it, and each is load-bearing:
 *
 *    - `flex-wrap` on the header row. The pill gets a second line to itself
 *      instead of sitting on top of the wordmark. This is why the pill stays IN
 *      FLOW rather than being pulled out and absolutely positioned in the
 *      card's top-right corner: an absolute badge has no width budget at all,
 *      and the wordmark is the longer of the two on most of these cards, so
 *      `top-3 right-3` would have traded a spill on the right for an overlap on
 *      the left, with a `pr-8` on the wordmark to pay for it.
 *    - `min-w-0` on both children, so the wordmark may shrink and wrap instead
 *      of insisting on its full one-line width.
 *    - `whitespace-nowrap` GONE from the pill. It was the single property making
 *      that pill unshrinkable, and with no wrap available on the row it was also
 *      the reason the row could not give way.
 *    - tracking halved to 0.12em below `md`. 0.2em is a wordmark's tracking for
 *      a 12-character name on a wide column; at 220px it is 2.4px of air after
 *      every letter, which is most of what made the wordmark wide.
 */
function QuoteCard({ data }: { data: Extract<DeckCard, { kind: "quote" }> }) {
  const { item, tone } = data;
  const dark = tone === "dark";

  return (
    <article
      className={`flex w-[260px] shrink-0 flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover md:w-auto md:shrink md:min-h-[420px] md:p-7 ${
        dark
          ? "border-forest bg-forest"
          : tone === "linen"
            ? "border-charcoal/15 bg-linen"
            : "border-charcoal/15 bg-white shadow-elev-2"
      }`}
    >
      {/* Company wordmark (top-left) + metric pill. `gap-x-3 gap-y-2` rather
          than `gap-3` so the wrapped pill keeps the 12px column gutter but
          picks up only 8px of row gutter under the wordmark. */}
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <span
          className={`flex min-w-0 flex-wrap items-center gap-2 break-words whitespace-normal text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.2em] ${
            dark ? "text-mist" : "text-charcoal"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-2 w-2 shrink-0 rounded-[2px] ${dark ? "bg-accent-500" : "bg-accent-600"}`}
          />
          {item.company}
        </span>
        {/* `text-right` because the pill now wraps to two lines on the longer
            metrics, and a left-aligned second line under a right-aligned first
            one reads as a mistake. `max-w-full break-words` is the belt to the
            row's braces: even a single unbreakable token longer than the card
            wraps instead of painting past the edge. */}
        <span
          className={`max-w-full break-words whitespace-normal rounded-pill border px-2.5 py-1 text-right text-[10px] font-semibold uppercase leading-snug tracking-[0.12em] ${
            dark
              ? "border-white/25 text-white/75"
              : "border-brand-green-600/30 text-brand-green-700"
          }`}
        >
          {item.metric}
        </span>
      </div>

      {/* Quote — middle. `text-base` below the breakpoint, for the same measure
          reason as the padding: `text-lg` at 220px of reading width inside a
          260px card sets about four words to the line.

          THE CLAMP IS A GUARD RAIL AND DOES NOT CURRENTLY TRUNCATE ANYTHING,
          which is the only reason it is here at all. The longest quote in
          `lib/data.ts` is 125 characters, and at 220px of measure in Plus
          Jakarta Sans at 16px that is about 25 characters a line — five lines,
          with a line to spare at six. `line-clamp-6` therefore bounds the row
          height without ever producing an ellipsis today, and protects the deck
          if a longer quote is added later: an unbounded quote is what sets the
          row's height, and three rows are as tall as their worst card.

          The directive's example named three lines. That number was measured and
          rejected rather than skipped: three lines of a 125-character quote cuts
          most of this deck off mid-sentence, in a section whose entire content
          IS the quote. Six is the smallest cap that hides nothing.

          `whitespace-normal` and `break-words` are stated rather than inherited
          because they are the two properties that stop a long word — a product
          name, a URL, a handle — from painting out of the card, which is a
          different failure from the header row's and needs its own guarantee. */}
      <blockquote
        className={`mt-6 flex-1 whitespace-normal break-words font-display text-base leading-relaxed line-clamp-6 md:line-clamp-none md:text-lg ${
          dark ? "text-mist/90" : "text-charcoal"
        }`}
      >
        {item.quote}
      </blockquote>

      {/* Author metadata — bottom. The role line drops its company on mobile: it
          is already set in the wordmark at the top of this same card, and it is
          the only line in the card that can be allowed to wrap at 220px —
          "Office Operations Lead" is about 150px at `text-sm`, which fits, but
          a longer role would not. */}
      <footer
        className={`mt-6 border-t pt-5 ${dark ? "border-white/15" : "border-charcoal/10"}`}
      >
        <p
          className={`break-words font-semibold ${dark ? "text-mist" : "text-charcoal"}`}
        >
          {item.name}
        </p>
        <p
          className={`mt-0.5 break-words text-sm ${dark ? "text-mist/60" : "text-taupe"}`}
        >
          {item.role}
          <span className="hidden md:inline"> · {item.company}</span>
        </p>
      </footer>
    </article>
  );
}

/** Type B — full-height photo card with gradient + bold stat callout.
 *
 *  This is the second of the site's standalone image cards, and it carries the
 *  same hover zoom as the catalog and showcase tiles: 500ms ease-out to scale
 *  1.05, clipped by the card's own `overflow-hidden` and `rounded-2xl`.
 *
 *  Two placement decisions are what make it safe here. The transform goes on the
 *  `img` and not on the article, so the gradient wash and the stat type below
 *  stay perfectly still while only the photograph breathes — and so the card's
 *  existing `hover:-translate-y-1.5` lift is untouched rather than clobbered by
 *  a scale on the same element. And the trigger is the `group` on the article
 *  rather than the `img` itself, so hovering the number or the label zooms the
 *  photo the same as hovering the photo does.
 *
 *  The deck also pauses on hover (see `.testimonials-marquee:hover` in
 *  globals.css), so the zoom lands on a still card instead of racing the
 *  vertical scroll. `motion-reduce:` drops both the transition and the scale —
 *  required, not optional, because the global reduced-motion block is scoped
 *  per component and this element is not one of them.
 *
 *  THE MOBILE GEOMETRY mirrors the quote card's, for the same reason plus one of
 *  its own: this card's desktop height is carried by the inner content wrapper,
 *  so `min-h` has to move on BOTH elements or the photo and the type under it
 *  would disagree about the card's height by 120px. At 768px and up every value
 *  here resolves to the number it had before.
 *
 *  `text-4xl` and 0.1em of label tracking below `md` are the two numbers this
 *  card needed and the quote card did not, both measured at 220px of measure.
 *  "+99%" is fine at `text-5xl`, but "₹1.2 Cr+" is nine glyphs of Space Grotesk
 *  at 48px, about 238px, so it wrapped mid-figure; and "Employee kits
 *  delivered" is 22 characters at `text-sm`/0.16em, about 233px, so the label
 *  wrapped mid-phrase. Neither would have read as a spill here, because this
 *  article DOES carry `overflow-hidden` — so both were being *clipped* at the
 *  right edge instead, which is the quieter version of the same bug.
 *
 *  280px rather than 140px for the floor, and a `min-h` rather than the fixed
 *  height it could have been: a 140px crop of these three compositions cuts the
 *  number and its label in half, and a photograph is the one thing in this deck
 *  whose content has a shape of its own.
 *
 *  `sizes` is the one non-class edit in this component, and it is a mobile-only
 *  one: the card is 260px wide there, not `calc(100vw - 3rem)`, which at a 375px
 *  viewport claims 327px and makes the browser fetch the next srcset candidate
 *  up. The `md` branch is the desktop deck's own figure and is unchanged. */
function StatCard({ data }: { data: StatCardData }) {
  return (
    <article className="group relative w-[260px] shrink-0 overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elev-2 md:w-auto md:shrink md:min-h-[420px]">
      <Image
        src={data.image}
        alt={data.alt}
        fill
        sizes="(min-width: 768px) calc((100vw - 9rem) / 3), 260px"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:scale-100"
        style={{ objectPosition: data.position }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/50 to-forest/10"
      />
      <div className="relative flex min-h-[280px] flex-col justify-end p-5 md:min-h-[420px] md:p-7">
        <p className="break-words font-grotesk text-4xl font-bold tracking-tight text-white md:text-6xl">
          {data.value}
        </p>
        <p className="mt-2 break-words text-sm font-semibold uppercase leading-snug tracking-[0.1em] text-white/85 md:tracking-[0.16em]">
          {data.label}
        </p>
        <p className="mt-1 break-words text-xs leading-snug text-white/70">
          {data.note}
        </p>
      </div>
    </article>
  );
}
