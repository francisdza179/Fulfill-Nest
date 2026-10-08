import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * "Pillars of Promise" — the three commitments that sit under every reward
 * programme we run.
 *
 * MOUNTED ON /pricing ONLY. This used to sit on the home page between
 * EmotionalPayoff and Testimonials; that placement was removed, so the home
 * page now runs straight from the emotional payoff into the testimonials. It
 * is shared-component infrastructure, not home-page-only markup, so it was
 * kept rather than deleted with the home page's usage.
 *
 * LAYOUT MIRRORS "WHAT WE BELIEVE". Per the component-alignment brief, the
 * section now mirrors `/about`'s beliefs band — that is `ValueProps` running
 * its `layout="grid"` branch, which renders `components/ui/ValueGrid.tsx`.
 * Lifted from there, not invented:
 *
 *   band        `relative overflow-hidden border-t border-section-divider
 *                bg-warm-grey py-section texture-linen` + the soft sage blur
 *                ball at `-left-24 top-1/3` (the `surface="warm-grey"` default
 *                `ValueProps` build, replacing the `bg-canvas` one).
 *   header      inside a `border-y border-section-divider` wrapper at
 *                `py-12 md:py-14`, LEFT-aligned (`SectionHeading` without
 *                `align="center"` — /about's beliefs header is left-aligned).
 *   grid        `mt-16 grid gap-x-10 gap-y-14 border-t border-section-divider
 *                pt-4 md:grid-cols-3` — the hairline now segments per column.
 *   card        an open editorial column: oversized `stat-numeral` 01/02/03
 *                in `text-brand-green-700` (hover → copper), `mt-6` display
 *                title at `text-2xl` charcoal (hover → brand green) and an
 *                `mt-4` `text-body text-taupe` body. The old bordered/filled
 *                `rounded-card` boxes are gone — the target band is editorial
 *                and open, and its own doc says an earlier bordered-card pass
 *                was rejected for exactly this reason.
 *
 * NOT CARRIED OVER: `ValueGrid`'s "Read more" toggle and detail panel. The
 * pillars carry no `detail` copy to reveal, so the toggle has nothing to
 * open; it drops rather than being made to lie. If this band ever grows
 * longer commitments, port the reveal from `ValueGrid` verbatim.
 */
const pillars = [
  {
    title: "Brand Precision",
    body: "Every item, box, and insert card is crafted strictly to your brand guidelines—no generic off-the-shelf compromises.",
  },
  {
    title: "Transparent Pricing",
    body: "Clear, upfront costs with zero hidden kitting fees, surprise handling charges, or unexpected markup.",
  },
  {
    title: "Guaranteed Delivery",
    body: "Reliable global shipping with end-to-end tracking to ensure gifts arrive on time for every milestone.",
  },
];

export function TrustBand() {
  return (
    <section className="relative overflow-hidden border-t border-section-divider bg-warm-grey py-section texture-linen">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="border-y border-section-divider">
          <div className="py-12 md:py-14">
            <SectionHeading
              eyebrow="Our guarantee"
              title={
                <>
                  The Fulfill Nest <em className="accent-em">promise</em>
                </>
              }
              description="Every reward we ship is held to the standard we would set for our own best client. Craft quality and reliable execution are the only two things that make a programme worth renewing."
            />
          </div>

          {/* `data-reveal-stagger` walks this container's direct children, so the
              columns animate in sequence without each one needing its own
              marker. Same grid class as `ValueGrid`, word for word. */}
          <div
            data-reveal-stagger
            className="mt-16 grid gap-x-10 gap-y-14 border-t border-section-divider pt-4 md:grid-cols-3"
          >
            {pillars.map((pillar, index) => {
              const number = String(index + 1).padStart(2, "0");
              return (
                <article key={pillar.title} className="group flex flex-col">
                  <span
                    className="stat-numeral text-5xl leading-none text-brand-green-700 transition-colors duration-300 ease-in-out group-hover:text-copper md:text-6xl"
                    aria-hidden="true"
                  >
                    {number}
                  </span>
                  {/* Weight, tracking, leading and colour all come from the
                      h1-h6 base rule; `text-2xl` sets the size, matching the
                      belief grid's title scale. */}
                  <h3 className="mt-6 font-display text-2xl text-charcoal transition-colors duration-300 ease-in-out group-hover:text-brand-green-700">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-body text-taupe">{pillar.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
