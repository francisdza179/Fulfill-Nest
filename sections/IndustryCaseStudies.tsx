import { industryCaseStudies } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlobeIcon, HeartIcon, ShieldIcon } from "@/components/ui/Icons";

const iconMap = {
  globe: GlobeIcon,
  heart: HeartIcon,
  shield: ShieldIcon,
} as const;

/**
 * Mini sector case studies — a three-card grid of success metrics.
 * Each card carries a sector eyebrow, a serif headline, supporting
 * copy, context chips and a count-up headline metric.
 */
export function IndustryCaseStudies() {
  return (
    <section className="texture-linen relative overflow-hidden border-t border-section-divider bg-warm-grey py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Sector success stories"
          title={
            <>
              Proof, sector by{" "}
              <em className="accent-em">sector</em>
            </>
          }
          description="A snapshot of how the rhythm adapts — the setup, the care and the numbers that moved for three very different industries."
        />

        <div data-reveal-stagger className="mt-16 grid gap-6 md:grid-cols-3">
          {industryCaseStudies.map((study) => {
            const Icon = iconMap[study.icon];
            return (
              <article
                key={study.sector}
                className="group flex flex-col gap-5 rounded-card border border-section-divider bg-surface-muted p-8 shadow-elev-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-brand-green-600/40 hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-accent-700" />
                  <p className="text-eyebrow uppercase text-eyebrow-gray">
                    {study.sector}
                  </p>
                </div>

                <h3 className="font-display text-2xl text-charcoal">
                  {study.headline}
                </h3>
                <p className="text-body text-taupe">{study.body}</p>

                <ul className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-pill border border-sand bg-warm-grey px-3 py-1 text-xs font-semibold text-walnut"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-section-divider pt-6">
                  <span className="stat-numeral text-4xl text-brand-green-700">
                    {study.metric}
                  </span>
                  <p className="mt-1 text-xs font-medium leading-5 text-walnut">
                    {study.metricLabel}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
