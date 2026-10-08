import { caseStudies } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Case studies — client stories with results, quotes and metric chips. */
export function CaseStudyGrid() {
  return (
    <section className="relative overflow-hidden border-t border-section-divider bg-surface py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Case studies"
          title={
            <>
              Real programmes, measurable{" "}
              <em className="accent-em">moments</em>
            </>
          }
          description="A few of the teams we partner with — the shape of the programme, the care behind it, and the numbers it moved."
        />

        <div data-reveal-stagger className="mt-16 grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article
              key={study.client}
              className="group flex flex-col gap-6 rounded-card border border-section-divider bg-warm-grey p-8 shadow-elev-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-brand-green-600/40 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-eyebrow uppercase text-eyebrow-gray">
                  {study.industry}
                </p>
                <p className="text-sm font-semibold text-charcoal">
                  {study.client}
                </p>
              </div>

              <h3 className="font-display text-2xl text-charcoal">
                {study.headline}
              </h3>

              <blockquote className="border-l-2 border-gold-500/60 pl-5 text-body text-taupe">
                &ldquo;{study.quote}&rdquo;
              </blockquote>

              <div className="mt-auto flex items-end justify-between gap-4 border-t border-section-divider pt-6">
                <figcaption className="flex flex-col">
                  <span className="text-sm font-semibold text-charcoal">
                    {study.author}
                  </span>
                  <span className="text-xs text-taupe">{study.authorRole}</span>
                </figcaption>
                <div className="text-right">
                  <span className="stat-numeral text-3xl text-brand-green-700">
                    {study.metric}
                  </span>
                  <p className="text-xs leading-5 text-walnut">
                    {study.metricLabel}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
