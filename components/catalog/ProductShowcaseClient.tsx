"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product, ProductBudget, ProductCategory } from "@/lib/data";
import {
  BUDGET_LABELS,
  CATEGORY_LABELS,
  formatPrice,
} from "@/lib/data";

type CategoryFilter = ProductCategory | "all";
type BudgetFilter = ProductBudget | "all";

/* Cascade constants for the local per-row grid entrance. Copied verbatim from
 * the sixteen-card catalog in ProductCatalogTabs.tsx so both grids arrive
 * identically, and deliberately shorter than the site-wide
 * `CONTENT_OFFSET_MS` / `STEP_MS` in components/ui/RevealOnScroll.tsx
 * (300ms / 100ms), because that pair is sized for a header plus one grid and a
 * 300ms head start before the FIRST row reads as lag here.
 * `ROW_STAGGER_MS` is the within-row step: cards in one row arrive
 * left-to-right, and the next row is separated by scroll position rather than
 * by a delay. */
const ROW_STAGGER_MS = 55;

/* `lg:grid-cols-4` with `sm:grid-cols-2` beneath it. The observer reads the live
 * column count off the element rather than trusting this, so this is only the
 * first guess used to avoid a flash of wrong grouping before measure. */
const DEFAULT_COLUMNS = 4;

interface ProductShowcaseClientProps {
  items: Product[];
}

/** Interactive catalog controls — filtered client-side, server-rendered data. */
export function ProductShowcaseClient({ items }: ProductShowcaseClientProps) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [budget, setBudget] = useState<BudgetFilter>("all");
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  const categories = Object.keys(CATEGORY_LABELS) as ProductCategory[];
  const budgets = Object.keys(BUDGET_LABELS) as ProductBudget[];

  const categoryCount = (c: ProductCategory) =>
    items.filter((p) => p.category === c).length;

  const filtered = items.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (budget === "all" || p.budget === budget),
  );

  /* The grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, so "which row is
   * this card in" depends on the viewport. Measured rather than read from a
   * media query: `getComputedStyle().gridTemplateColumns` resolves to the used
   * track list (`"212px 212px 212px 212px"`), so counting its entries gives the
   * real column count at every breakpoint this grid has.
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

  /* Per-row scroll-triggered cascade for the eight cards — the same mechanism
   * the sixteen cards on /gifts use, brought across so both catalog grids
   * arrive identically. It is local to the component rather than delegated to
   * RevealOnScroll's `data-reveal-stagger` for the reason recorded in
   * ProductCatalogTabs.tsx: the shared observer staggers by CHILD INDEX off ONE
   * boundary, which put 24px of travel on all eight cards at once, with the
   * last waiting 300ms + 7x100ms = 1s, for a grid that sits below the fold on
   * the home page. Each ROW is observed separately instead, so a row animates
   * when that row is reached. The visual half is `.catalog-card-enter` in
   * globals.css.
   *
   * Dependencies are `[category, budget, columns]` rather than `filtered`:
   * `filtered` is rebuilt by `.filter()` on every render and so is a new
   * identity each time, which would tear down and rebuild both observers on
   * every keystroke-sized state change. These three are exactly the inputs that
   * can change which cards are on screen.
   *
   * Re-running on a filter change is safe and is not the same situation as the
   * catalog's tab change. Cards are keyed by `product.id`, so React keeps the
   * DOM node of anything that survives the filter — with `is-revealed` and its
   * finished animation intact. Re-observing it is a no-op: `classList.add` of a
   * class already present changes nothing, and writing `--card-enter-delay` on
   * an animation that has already played does not restart it, so survivors do
   * not re-animate. Only cards that were filtered OUT and are now coming back
   * are freshly mounted, and those arrive hidden and are revealed by this
   * observer like any other. */
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
     * reads left-to-right rather than as eight separate arrivals. */
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
           * so the transition has something to transition FROM. Adding both
           * classes in the same task would collapse it and the row would snap
           * in with no animation — the same trap as setting a transition and a
           * changed value together. */
          requestAnimationFrame(() => {
            card.classList.add("is-revealed");
          });
        });
      },
      {
        /* Identical gate to the catalog's, and to `RevealOnScroll`'s: reveal on
         * contact, once the row is 80px into the viewport. A row on screen at
         * page load animates on arrival; a row below the fold waits for the
         * scroll. The shared fixed inset replaced `"0px 0px -12%"`, which scaled
         * with viewport height and so asked for 156px of lead-in on a 1300px
         * window - long enough to leave a visible row sitting still until the
         * reader scrolled. */
        rootMargin: "0px 0px -80px 0px",
        threshold: 0,
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [category, budget, columns]);

  const pillBase =
    "rounded-pill px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2";
  const pillIdle = "border border-sand text-walnut hover:bg-linen";
  const pillActive = "bg-brand-green-700 text-mist";

  return (
    <div>
      {/* Category filter */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by category"
      >
        <button
          type="button"
          className={`${pillBase} ${category === "all" ? pillActive : pillIdle}`}
          onClick={() => setCategory("all")}
          aria-pressed={category === "all"}
        >
          All <span className="font-grotesk font-medium">({items.length})</span>
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`${pillBase} ${category === c ? pillActive : pillIdle}`}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
          >
            {CATEGORY_LABELS[c]}{" "}
            <span className="font-grotesk font-medium">({categoryCount(c)})</span>
          </button>
        ))}
      </div>

      {/* Budget filter */}
      <div
        className="mt-3 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by budget"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-taupe">
          Budget
        </span>
        <button
          type="button"
          className={`${pillBase} ${budget === "all" ? pillActive : pillIdle}`}
          onClick={() => setBudget("all")}
          aria-pressed={budget === "all"}
        >
          All
        </button>
        {budgets.map((b) => (
          <button
            key={b}
            type="button"
            className={`${pillBase} ${budget === b ? pillActive : pillIdle}`}
            onClick={() => setBudget(b)}
            aria-pressed={budget === b}
          >
            {BUDGET_LABELS[b]}
          </button>
        ))}
      </div>

      {/* Result grid */}
      <p
        className="mt-8 text-xs uppercase tracking-[0.08em] text-taupe"
        aria-live="polite"
      >
        Showing <span className="font-grotesk font-medium">{filtered.length}</span>{" "}
        <span className="font-grotesk font-medium">
          {category === "all" ? "curated sets" : CATEGORY_LABELS[category as ProductCategory]}
        </span>
      </p>

      {/* THE EIGHT CARDS CASCADE ONE ROW PER SCROLL, NOT ALL AT ONCE — the same
          entrance the sixteen cards on /gifts use, copied across rather than
          re-specified. `data-reveal-stagger` was REMOVED from this grid to make
          room for it: that marker is the shared observer's, and leaving it would
          have put BOTH systems on the same eight cards at once — this local one
          adding `.is-revealed` per row while the shared one independently
          applied its unlayered `opacity: 0` off a single boundary. They would
          fight, and the shared one would win the fight at 24px over 0.6s, which
          is the thing being replaced. Do not put `data-reveal-stagger` back.

          Rows are not DOM elements — `grid-cols-4` is an auto-flow layout — so
          the row is derived from the card's index and the live column count. */}
      <div
        ref={gridRef}
        className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {filtered.map((product) => {
          const categoryLabel = CATEGORY_LABELS[product.category];
          return (
            <article
              key={product.id}
              /* `data-catalog-card` is the local observer's hook and
               * `data-row` is stamped on below by the same effect that groups
               * the cards, so the two cannot drift apart. The entrance itself
               * is `.catalog-card-enter` in globals.css — the identical class
               * the /gifts catalog cards carry, so both grids share one
               * keyframe, one duration (0.5s), one bezier and one travel
               * distance (14px). Deliberately NOT `.reveal-on-scroll`: that
               * rule is unlayered `opacity: 0` and is the shared observer's to
               * apply. Stacking it here would leave these cards invisible
               * whenever the two systems disagreed about who owns them.
               *
               * `is-revealed` is added by the observer, not written here. */
              data-catalog-card
              data-row="0"
              className="catalog-card-enter group flex flex-col overflow-hidden rounded-card border border-section-divider bg-warm-grey shadow-elev-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-brand-green-600/40 hover:shadow-elev-2"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-card bg-warm-grey">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  /* The shared image-card zoom, and the site reference for it:
                     500ms ease-out to scale 1.05, clipped by the `overflow-hidden`
                     stage above. It lives on the `img` and not on the article, so
                     the card's own `rounded-t-card` keeps cutting the artwork
                     instead of the whole card scaling — and so the existing
                     `hover:-translate-y-1` lift composes with it rather than
                     being overwritten by it.

                     `group-hover:` rather than `hover:`, because the trigger is
                     the whole card: hovering the name, tagline or price should
                     zoom the photo, not only the photo itself.

                     The `motion-reduce:` pair is load-bearing, not decoration.
                     This site's reduced-motion block is scoped per component and
                     has no blanket rule, so without them a 500ms scale animates
                     for exactly the users who asked it not to. Tailwind emits
                     `motion-reduce` after `hover`/`group-hover`, so at equal
                     specificity these win on source order. */
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:scale-100"
                  style={{ objectPosition: product.imagePosition }}
                />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-charcoal/25 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                {/* Badge container — fixed height so pill row and title baseline
                    stay identical across cards with 1 vs 2 pills */}
                <div className="flex min-h-[28px] items-center justify-between gap-2">
                  <span className="rounded-pill border border-sand bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent-600 whitespace-nowrap">
                    {categoryLabel}
                  </span>
                  {product.tag ? (
                    <span className="rounded-pill border border-brand-green-900/40 bg-brand-green-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-mist whitespace-nowrap">
                      {product.tag}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 font-display text-xl text-charcoal">
                  {product.name}
                </h3>
                <p className="flex-1 text-sm leading-6 text-taupe">
                  {product.tagline}
                </p>
                <p className="mt-3 font-grotesk text-lg font-bold tracking-tight text-charcoal">
                  {formatPrice(product.price)}
                  <span className="ml-1 text-xs font-medium normal-case tracking-normal text-stone">
                    / recipient
                  </span>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div
          data-reveal-item
          className="mt-8 rounded-card border border-sand bg-warm-grey p-10 text-center"
        >
          <p className="font-display text-2xl text-charcoal">
            Nothing matches those filters yet.
          </p>
          <p className="mt-2 text-sm text-taupe">
            Try a different category or budget — or talk to us about a bespoke set.
          </p>
        </div>
      ) : null}
    </div>
  );
}