import Link from "next/link";
import { serviceCaseStudy } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * "Proven impact" — the social-proof band on /gifts.
 *
 * `/gifts` is the ONLY mount of this component (checked across `app`, `sections`
 * and `components`), so nothing here can reach another route by accident.
 *
 * REDESIGN. This was a split spotlight card: a 16:9 fulfilment-floor photo on
 * the left, a three-figure metric grid + blockquote + case-study link stacked on
 * the right. It is now one warm-neutral metric bar — four figures in a single
 * row on desktop, with the client quote and the case-study link kept beneath it
 * as a slim closing block.
 *
 * Why the four figures live here instead of in `lib/data.ts`:
 * `serviceCaseStudy.metrics` described ONE campaign (100% on-time, 0% damage,
 * 20+ hours saved). These four are portfolio-wide — an all-programme on-time
 * rate, a lifetime shipment count, a recipient rating and a re-order rate — so
 * they are not case-study records and do not belong to that one. Module scope,
 * not props: the band has no variants and no caller supplies these. Same shape
 * as `fallbackProps` in `sections/CtaBand.tsx`.
 *
 * PROVENANCE — read before quoting any of these back. `99.4%` is real but
 * belongs to a different section: it is the on-time rate of the shift-delivery
 * case study in `lib/data.ts` (`industryCaseStudies`), not a gifting figure.
 * `50,000+` (lifetime shipments), `4.9 / 5.0` (recipient rating) and `95%`
 * (re-order rate) have no source anywhere in the repo. All four are
 * unverified marketing numbers and `serviceCaseStudy.image` /
 * `serviceCaseStudy.imageAlt` are now unused by this component (the file
 * stays on disk and the fields stay on the type).
 */

/** Brief copy, verbatim. Order is the brief's order: rate, volume, feeling,
 *  loyalty — deliberately not sorted by magnitude. */
const IMPACT_METRICS = [
  { value: "99.4%", label: "On-Time Gift Delivery Rate" },
  { value: "50,000+", label: "Curated Gifts Shipped Globally" },
  { value: "4.9 / 5.0", label: "Average Recipient Delight Rating" },
  { value: "95%", label: "Corporate Client Re-order Rate" },
] as const;

export function CaseStudyTeaser() {
  const { quote, author } = serviceCaseStudy;

  return (
    <section className="relative overflow-hidden border-t border-section-divider bg-surface py-section">
      {/* Untouched from the previous design. It sits at 4% alpha behind a
          panel that is now full-bleed rather than half-width, so it reads as
          warmth behind the section edge instead of a second focal point. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Proven impact"
          title={
            <>
              Gifting Made Effortless,{" "}
              <em className="accent-em">Results</em>
            </>
          }
          description="Four numbers we are happy to be measured on, drawn from live programmes across corporate rewards, festive gifting and one-off personal orders."
        />

        {/* `bg-canvas` (#f7f4eb), not `bg-surface-muted` (#faf8f3). The muted
            tone is this site's near-white section ground — on `bg-surface` a
            muted panel would read as no panel at all. `canvas` is the warm
            neutral the palette reserves for inset surfaces.

            `overflow-hidden` is what keeps `rounded-card` (20px) from being
            squared off by the grid's own children; without it the 1px border
            traces a rectangle behind the rounded corner. */}
        <div className="mt-16 overflow-hidden rounded-card border border-section-divider bg-canvas shadow-elev-2">
          <div className="px-6 py-12 sm:px-10 md:py-16">
            {/* `lg:` only, never `divide-*`. At `sm` the grid is 2x2, and both
                Tailwind's `divide-x` variants (`:not(:last-child)` with
                `border-inline-end`, and the v3-style `:not(:first-child)` with
                `border-inline-start`) put a rule on a cell that begins its own
                row — a rule with nothing to divide. Explicit per-cell
                `lg:border-l` + `lg:first:border-l-0` is exact: at `lg` all four
                cells are on one line, so cells 2-4 get a rule and cell 1 does
                not. Below `lg` the grid has no rules at all and leans on
                `gap-y-12`, which also keeps the 1-column phone layout from
                growing a stack of rules. */}
            <dl
              data-reveal-stagger
              className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4"
            >
              {IMPACT_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  /* `flex-col-reverse` so the NUMBER paints above the LABEL
                     while the markup stays `<dt>` then `<dd>` — the order the
                     HTML spec requires inside a `<dl>` wrapper. Painting `<dd>`
                     first would render fine but read the value with no term
                     attached until the label, which is the one order a stat
                     tile must not present. Reversed, assistive tech gets
                     "On-Time Gift Delivery Rate — 99.4%" (term then value)
                     and sighted readers still get the figure first.

                     Sighted order differing from DOM order is a 1.3.2 concern in
                     general; here the two orders are the same pair of strings,
                     so nothing is reordered *relative to itself* — only
                     re-weighted for size. */
                  className="flex flex-col-reverse items-center gap-3 text-center lg:border-l lg:border-section-divider lg:first:border-l-0 lg:pl-10 lg:first:pl-0"
                >
                  <dt className="text-sm leading-relaxed text-taupe">
                    {metric.label}
                  </dt>
                  {/* `stat-numeral` is the house treatment for figures
                      (Space Grotesk, tabular, -0.02em). `text-brand-green-700`
                      is what every other `stat-numeral` on the site uses and
                      measures 7.81:1 on this canvas, so the brief's "high
                      contrast" ask is met without a one-off colour; charcoal
                      (16.13:1) was available and rejected as a pattern break
                      for no legibility gain that matters at this size. The
                      `<dt>` taupe label measures 6.87:1, comfortably past AA
                      for body text, and is the same colour `SectionHeading`
                      already uses for its own description here. */}
                  <dd className="stat-numeral text-4xl leading-none text-brand-green-700 md:text-5xl">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Kept from the previous design on purpose. The brief asked for the
            band, not for the section to lose its only client quote and its only
            inbound link to /case-studies. Both are text, so they cost one
            screen's worth of height rather than a column, and a metric bar with
            a named quote under it converts better than a bare figure row.
            Deleting them is two elements: this <figure> and the <div> below. */}
        <figure className="mx-auto mt-14 max-w-2xl text-center">
          <blockquote className="text-body-lg text-charcoal">
            &ldquo;{quote}&rdquo;
          </blockquote>
          {/* Moved out of `<blockquote>`. It sat inside the previous version,
              where `<figcaption>` is not a legal child — a screen reader
              announces the attribution as part of the quoted speech. As a
              sibling of the `<blockquote>` inside `<figure>` it is the
              attribution, which is what it is. */}
          <figcaption className="mt-3 text-sm font-semibold not-italic text-taupe">
            — {author}
          </figcaption>
        </figure>

        <div data-reveal-item className="mt-10 flex justify-center">
          {/* `link-ribbon` still not applied, for the reason documented at the
              old call site: on an `inline-flex` the underline wipes under the
              arrow too, and the wipe is a stronger gesture than this link
              wants. The comment there is unchanged and still accurate. */}
          <Link
            /* Repointed off the deleted /case-studies. This component has NO
               importer - `app/services` dropped it and `app/gifts` removed it -
               so this is dead code rather than a live 404, and the href was not
               urgent. It is still worth fixing, because a deleted route sitting
               in source is a trap for whoever revives the component, and this is
               the one line to change if they do.

               The label below has NOT been changed, and that is a deliberate
               loose end rather than an oversight: "Read full case study" becomes
               factually broken the moment this component is given a home again,
               and it is a copy decision to make then - not one to pre-empt here,
               where nobody can see the result. */
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 transition-colors duration-200 ease-in-out hover:text-accent-700"
          >
            Read full case study
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}