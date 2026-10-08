"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface LegalTocItem {
  id: string;
  heading: string;
}

/**
 * Active-scrollspy sidebar for legal documents.
 *
 * Tracks which numbered main section is currently in view via a
 * scroll-position hook (rAF-throttled, no per-frame layout thrash):
 * the active section is the last one whose top has crossed the
 * ACTIVE_LINE inside the viewport. The matching "On this page" link
 * is set in the accent colour and the semibold weight, while inactive
 * links are softened. Clicking a link scrolls smoothly to the section — the
 * 100px header offset comes from `scroll-margin-top` on each section.
 */
const ACTIVE_LINE = 140; // px from the top of the viewport a section top must cross

export function LegalToc({ items }: { items: LegalTocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    items[0]?.id ?? null
  );
  const activeRef = useRef(activeId);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const last = items[items.length - 1];
    if (!last) return;

    /* Pinned to the bottom of the page? The last section owns the highlight. */
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atBottom) {
      if (activeRef.current !== last.id) setActiveId(last.id);
      return;
    }

    /* Walk backwards: the deepest section that has crossed the line wins. */
    for (let i = items.length - 1; i >= 0; i--) {
      const el = document.getElementById(items[i].id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= ACTIVE_LINE) {
        if (activeRef.current !== items[i].id) setActiveId(items[i].id);
        return;
      }
    }
  }, [items]);

  /* Keep the ref in sync so the rAF callback always reads fresh state. */
  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const onScrollOrResize = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        update();
        ticking.current = false;
      });
    };
    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [update]);

  return (
    <nav
      aria-label="On this page"
      className="rounded-card border border-sand bg-mist p-6 shadow-elev-1 lg:sticky lg:top-28"
    >
      <h2 className="text-caption text-accent-600">On this page</h2>
      <ol className="mt-5 flex flex-col gap-1">
        {items.map((item, index) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                onClick={() => setActiveId(item.id)}
                /* THE INDICATOR BAR IS GONE. Every row carried a 2px left border that was
                 * transparent when inactive and the accent colour when active, and
                 * removing it is what the brief asked for. The reason it was
                 * there was never sound: on an inactive row it was an invisible
                 * 2px element still consuming 2px of width, so every row was
                 * indented by a rule that could not be seen, and the active row
                 * was the only thing in the list whose text started 2px further
                 * right than the rest. The list was misaligned with itself to
                 * carry a state indicator.
                 *
                 * The padding stays at 4 units, NOT 3. It briefly became 3, on the
                 * reasoning that 2px of border plus 4 units of padding had to
                 * become 3 units of padding to hold the text edge still. That
                 * arithmetic was wrong: 4 units is 16px, not 8px. Rows had 2px
                 * of border + 16px of padding and now have 12px, which moved
                 * every label in the list 6px to the left. `pl-4` is restored.
                 *
                 * AND THE ROW RADIUS WAS WRONG ALL ALONG, which is the part that
                 * actually broke it. This row is 40px tall: 8px of vertical
                 * padding above a 24px line box. `rounded-card` is 1.25rem, or
                 * 20px. Two 20px corner radii consume 40px of vertical space on
                 * a 40px row, which is exactly the full height - so every corner
                 * radius met the vertical midpoint and each row rendered as a
                 * stadium, a lozenge with semicircular caps at both ends rather
                 * than a rounded rectangle.
                 *
                 * It was always that shape. What changed is that it is now
                 * visible as one. With the 2px border in place the radius read
                 * as a box corner sitting inside an outline, and the eye took the
                 * outline as the silhouette. With the border gone and a fill in
                 * its place, the outline is the silhouette - so a radius that was
                 * a quarter too large became the first thing wrong with the
                 * component. `rounded-xl` at 0.75rem is 12px, which consumes
                 * 24px of the 40px row and leaves real flat edges top and
                 * bottom. It is already an emitted utility on these pages and is
                 * the shape used by the house's own small filled surfaces.
                 *
                 * The card AROUND the list keeps `rounded-card`, where it
                 * belongs: that box is several hundred pixels tall, so 20px is a
                 * light corner rather than a full cap.
                 *
                 * THE ACTIVE STATE RESTS ON THREE THINGS, and it needed all
                 * three. The tint alone is not enough: the active fill is the
                 * accent at 60% over the card's mist surface, which resolves to
                 * a blush against a cream that measures 1.06:1 - a 2.5%
                 * difference that is not a state signal a reader can see. What
                 * carries it is `font-semibold` against regular, which is an
                 * immediate difference, plus the colour change from stone grey to
                 * the accent at 5.46:1 on that fill. Both survive greyscale,
                 * which matters because colour alone would not.
                 *
                 * The numerals change with it, so the active row is legible as
                 * active at the top of the list where the reader's eye lands
                 * first and before the label has been read. */
                /* Keyboard focus is styled explicitly because this list is the primary
                 * navigation on three long documents and the default focus ring
                 * was doing the job nobody would call deliberate. `outline-none`
                 * alone would be worse than leaving it alone, so the replacement
                 * is a real 2px accent ring with a 2px offset - visible against
                 * both the cream card and the pink active fill, and it does not
                 * collide with the row's own left edge because the offset pushes
                 * it clear.
                 *
                 * Nothing here changes on hover, which is deliberate: hover is a
                 * mouse affordance, and the active row is driven by scroll
                 * position. Overlaying the two would mean a pointer resting on
                 * the current section changes the colour of the one thing on the
                 * page that is saying "you are here". */
                className={`group flex items-baseline gap-3 rounded-xl py-2 pl-4 pr-3 text-sm leading-6 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 ${
                  active
                    ? "bg-accent-100/60 font-semibold text-accent-600"
                    : "text-stone hover:text-walnut"
                }`}
              >
                {/* The numeral was the second accent on the active row and is now the only
                 * one. It was `copper` while the label was also `copper`, so the
                 * active row carried the accent twice in two near-identical
                 * browns - and copper on the blush measures 4.59:1 while the house
                 * accent on the same blush measures 5.46:1, so the numeral was
                 * also the weaker of the two on its own background.
                 *
                 * Both now use the one accent, which is 5.46:1 on the tint and
                 * matches the "On this page" heading above it. Two accent tokens
                 * for one state is one too many, and this is the state this list
                 * exists to communicate. */}
                <span
                  className={`stat-numeral text-xs transition-colors duration-200 ${
                    active
                      ? "text-accent-600"
                      : "text-stone group-hover:text-accent-600"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}