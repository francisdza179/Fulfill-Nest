import Link from "next/link";
import { whoWeArePillars, whoWeAreReach } from "@/lib/data";
import { ArrowRightIcon } from "@/components/ui/Icons";

/**
 * Who We Are — the home page's "who" story.
 *
 * Sits between the hero and the "Why Fulfill Nest" benefits so the page answers
 * *who we are* before it argues *why we're better*.
 *
 * Deliberately box-free: no card fills, no rounded borders, no box-shadows.
 * The band is a flat white surface, and the content is carried by typography,
 * whitespace and 1px `--color-sand` hairlines only. The left column holds the
 * narrative and the onward link; the right column holds the four
 * capabilities as a hairline-ruled 2x2 grid; a closing metadata strip carries
 * the operational reach.
 *
 * Server-rendered — the entrance reveal is driven entirely by the site-wide
 * markers. The header steps stay on the standard 100ms rhythm and the grid
 * offset stays at the house 300ms, but the stagger step is raised to 250ms
 * (via `data-reveal-stagger-step` on the section) so the four capability
 * points enter one after another for longer — the sequence is still
 * resolving as the section climbs toward mid-screen instead of finishing in
 * the first ~600ms of scroll. The reach strip is a single `data-reveal-item`
 * and is unaffected (it keeps the 300ms offset).
 */
export function WhoWeAre() {
  return (
    <section
      id="who-we-are"
      data-reveal-stagger-step="250"
      /* Top clearance is explicit (`pt-16 md:pt-24`) rather than the old
         `py-section` + clipping mask: the eyebrow sits a full, unclipped
         step below the hero band, so "About Fulfill Nest" always renders
         clear of the seam. `overflow-hidden` is gone with it — nothing in
         this band overflows, and it was the thing trimming the eyebrow. */
      className="relative z-10 border-t border-section-divider bg-white pt-16 pb-16 md:pt-24 md:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* Story column */}
          <div data-reveal-header className="flex max-w-2xl flex-col gap-5">
            <p className="text-eyebrow w-fit uppercase text-eyebrow-gray">
              About Fulfill Nest
            </p>
            <h2 className="text-display text-charcoal">
              Human curation meets personal{" "}
              <em className="accent-em">precision</em>
              .
            </h2>
            <p className="text-body-lg text-taupe">
              Corporate gifting shouldn&rsquo;t feel like a lazy bulk
              purchase. We founded Fulfill Nest to bridge the gap between
              genuine appreciation and smooth execution—helping growing
              companies build lasting relationships through thoughtful,
              high-touch reward experiences.
            </p>
            <p className="text-body-lg text-taupe">
              Whether welcoming 50 new hires, rewarding sales achievers, or
              planning nationwide Diwali hampers, we handle custom branding,
              packaging, assembly, and doorstep delivery with zero admin
              headache for your team.
            </p>

            {/* accent-700, not accent-600: `text-body` is 16px and semibold,
                which is NOT large text under WCAG (needs 18.66px bold), so
                this link is held to 4.5:1. accent-600 (#c46a4a) measures 3.81:1
                on this band's white background — a fail that predates the
                background change (3.63:1 on the old #fbf9f5) and that the
                change makes marginally better rather than worse.
                accent-700 (#a95538) measures 5.19:1 on white and passes.
                Scoped to this one element on purpose — moving the
                `--color-accent-600` token itself would restyle every accent
                link and CTA site-wide. */}
            <Link
              href="/about"
              className="group link-ribbon mt-1 inline-flex w-fit items-center gap-2 text-body font-semibold text-accent-700 transition-colors duration-300 ease-in-out hover:text-brick-red"
            >
              Discover our story &amp; mission
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* Capability column — unboxed 2x2 grid, hairline ruled. Each point
              enters 250ms after the previous one (the section-level
              `data-reveal-stagger-step`), so the four points are still
              cascading in as the section reaches mid-screen. */}
          <div
            data-reveal-stagger
            className="grid gap-x-10 gap-y-8 sm:grid-cols-2"
          >
            {whoWeArePillars.map((pillar, index) => {
              const number = String(index + 1).padStart(2, "0");
              const isSecondColumn = index % 2 === 1;
              return (
                <article
                  key={pillar.title}
                  className={`group border-t border-sand pt-6 ${
                    isSecondColumn
                      ? "sm:border-l sm:border-sand sm:pl-10"
                      : ""
                  }`}
                >
                  <span
                    className="stat-numeral text-sm text-brand-green-700"
                    aria-hidden="true"
                  >
                    {number}.
                  </span>
                  <h3 className="mt-3 font-display text-xl text-charcoal transition-colors duration-300 ease-in-out group-hover:text-brick-red">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-body-sm text-taupe">
                    {pillar.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Reach strip — operational scale, hairline separated from the grid */}
        <div
          data-reveal-item
          className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-sand pt-8"
        >
          {whoWeAreReach.map((stat, index) => (
            <p
              key={stat.label}
              className="flex items-baseline gap-2 text-body-sm"
            >
              <span aria-hidden="true" className="text-accent-600/60">
                &bull;
              </span>
              <span className="stat-numeral font-semibold text-charcoal">
                {stat.value}
              </span>
              <span className="text-taupe">{stat.label}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
