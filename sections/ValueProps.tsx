"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ValueProp } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ValueGrid } from "@/components/ui/ValueGrid";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

interface ValuePropsProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  items: ValueProp[];
  /**
   * "list" — editorial numbered rows, full width, one per line.
   * "grid" — /about's clean full-width 3-column horizontal grid with generous
   *   typography spacing and a subtle inline detail toggle.
   * "editorial" — the SAME numbered row as "list", set in columns
   *   (1 / 2 / 3). This is the home page's layout.
   *
   * "list" and "editorial" deliberately share one row renderer rather than
   * carrying two copies of it. The whole point of the editorial layout is that
   * it looks like the list, so a second hand-maintained copy of the row would be
   * a copy that drifts the first time either one is tweaked.
   *
   * Defaults to "list", so anything that renders this without a `layout`
   * behaves exactly as it did before the columns were added.
   */
  layout?: "list" | "grid" | "editorial";
  /**
   * Horizontal alignment of the eyebrow / heading / description block.
   * Defaults to "left".
   *
   * A prop rather than a hardcoded `align="center"` because this component is
   * shared: centring it unconditionally would also centre /about's "What we
   * believe" heading, which is left-aligned on purpose and was not part of the
   * request. `align="center"` on `SectionHeading` resolves to
   * `mx-auto text-center items-center` in one place, which is what keeps the
   * eyebrow, heading and lead on a common centre axis and centres the flex
   * children too - hand-rolling `text-center` on a wrapper would centre the text
   * but leave the children as `items-stretch`.
   */
  headerAlign?: "left" | "center";
  /** Background treatment for the section band. */
  surface?: "warm-grey" | "soft-cream";
  /** Opt into the longer 450ms featured-row content sequence.
   *
   *  This is CONTENT timing only, and it no longer touches the header at all.
   *
   *  `data-reveal-header-step` used to be `"150"` on the featured variant,
   *  which made this band's eyebrow / heading / description run 0 / 150 / 300ms
   *  - a different cadence from every other section on the site. It is gone, so
   *  the header now takes the shared `STEP_MS` and reads 0 / 100 / 200ms, the
   *  same three steps `SectionHeading` produces everywhere else by putting its
   *  eyebrow, `<h2>` and description in that DOM order inside one
   *  `data-reveal-header` wrapper.
   *
   *  What is left below is when the six editorial ROWS start, not when the
   *  heading does. There is deliberately still no `data-reveal-threshold` here.
   *  It used to be `"0.2"` on the featured variant, which meant 20% of this
   *  section's full height had to be on screen before its eyebrow and heading
   *  appeared. This band is a tall six-row editorial grid, so 20% of it is
   *  300-400px of scrolling that happens AFTER the heading is already visible at
   *  the top of the viewport - precisely the "the heading is on screen but blank
   *  until I scroll" case `RevealOnScroll` prevents by defaulting to
   *  `threshold: 0`. Raising it per-target is still possible and still honoured;
   *  it is just not something a slower rhythm should decide. */
  revealSequence?: "standard" | "featured";
}

/**
 * Value props — three layouts over one hairline band.
 *
 * Content is passed in so each page frames its own story without duplicating
 * markup: benefits on the home page (the editorial numbered row, in three
 * columns), first-person beliefs on /about (a wide 3-column grid).
 *
 * The home layout is NOT a card grid. An earlier pass rendered six bordered,
 * tinted, shadowed boxes and was rejected: this band is editorial and open, so
 * it stays open. What you get is the original row - hairline rule above,
 * oversized numeral, display title, body copy, and a hover that lifts the row a
 * couple of pixels and washes it - repeated six times in a 3-column grid. No
 * `rounded-card`, no `border`, no background fill, no resting shadow.
 *
 * Three notes on the classes involved, all verified against `globals.css`:
 *   - `editorial-hover-block` has NO rule in the stylesheet. It is inert and has
 *     been for some time; the row's appearance comes entirely from the
 *     utilities. It is kept because it documents intent, but do not go looking
 *     for the rule.
 *   - `stat-numeral` likewise has no rule. The numeral's size, weight and
 *     leading are all set by `text-5xl md:text-6xl leading-none`.
 *   - `stat-color-transition` IS live: `.group:hover .stat-color-transition`
 *     turns the numeral brick red. That colour change is the one genuinely
 *     interactive part of this design, and it only survives if the numeral stays
 *     inside the `group` element.
 */
export function ValueProps({
  id,
  eyebrow,
  title,
  description,
  items,
  layout = "list",
  headerAlign = "left",
  surface = "warm-grey",
}: ValuePropsProps) {
  const isSoftCream = surface === "soft-cream";
  const bodyTextColor = isSoftCream ? "text-walnut" : "text-taupe";
  const inColumns = layout === "editorial";
  const reducedMotion = useReducedMotion();

  /* One row, two container classes. Written as complete literal strings rather
     than assembled from fragments, because Tailwind scans source text: an
     interpolated token like `items-${align}` would be invisible to the compiler
     and silently produce no rule. */
  const rowClass = inColumns
    ? "editorial-hover-block group grid grid-cols-[auto_1fr] items-start gap-6 rounded-xl border-t border-section-divider py-8 transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:[transform:translateY(-2px)] hover:bg-bg-hover hover:shadow-elev-1"
    : "editorial-hover-block group -mx-5 grid grid-cols-[auto_1fr] items-center gap-6 rounded-xl border-t border-section-divider px-5 py-8 transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:[transform:translateY(-2px)] hover:bg-bg-hover hover:shadow-elev-1 last:border-b-0 md:gap-10";

  /* Column gap only. `gap-y` stays unset so the rows are separated by each
     cell's own hairline and its `py-8`, exactly as the full-width list
     separates its rows - adding a row gap on top of that would open a second,
     rule-free channel between the rule and the text above it.

     The hairline therefore segments into one dash per column rather than
     running edge to edge. That is the unavoidable trade for having a column
     gap: the rule has to stop short of the gap or the two rows would touch. */
  const columnsClass = inColumns
    ? "grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3"
    : undefined;

  return (
    <section
      id={id}
      className={`relative overflow-hidden py-section ${
        isSoftCream
          ? "border-t border-section-divider bg-mist"
          : "texture-linen border-t border-section-divider bg-warm-grey"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="border-y border-section-divider">
          <div className="py-12 md:py-14">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              description={description}
              align={headerAlign}
              descriptionClassName={
                isSoftCream ? bodyTextColor : undefined
              }
            />
          </div>

          {layout === "grid" ? (
            <ValueGrid items={items} />
          ) : (
            /* No bottom padding, matching the original list. The band's closing
               hairline is the wrapper's own `border-y`, and the last row's
               `py-8` already supplies the 32px of air above it. Adding padding
               here would have made the gap below the last row 80px against the
               heading's 48px above.

               Entrance is handled by Framer Motion: the ordered list is a
               viewport-triggered parent and each belief row fades up with a
               0.1s stagger. The previous `data-reveal-stagger` marker is
               removed so the two systems do not both drive the same nodes. */
            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reducedMotion ? undefined : containerVariants}
              className={columnsClass}
            >
              {items.map((value, index) => {
                const number = String(index + 1).padStart(2, "0");
                return (
                  <motion.li
                    key={value.title}
                    variants={reducedMotion ? undefined : itemVariants}
                    className={rowClass}
                  >
                    <span
                      className="stat-numeral stat-color-transition text-5xl leading-none text-brand-green-700 md:text-6xl"
                      aria-hidden="true"
                    >
                      {number}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-charcoal transition-colors duration-300 ease-in-out group-hover:text-brand-green-700">
                        {value.title}
                      </h3>
                      <p className={`mt-3 max-w-xl text-body ${bodyTextColor}`}>
                        {value.body}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ol>
          )}
        </div>
      </div>
    </section>
  );
}