"use client";

import { motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
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

interface TestimonialsProps {
  /**
   * Draw the `border-t` hairline above the band. Defaults to true because every
   * call site that wants it sits under a band of a different colour which does
   * not already own the edge. /pricing follows `TrustBand` (#f7f4eb) and the
   * home page follows `EmotionalPayoff` (#FAF8F3), so on both the line marks a
   * real colour edge.
   *
   * ONE call site opts out, and it does NOT opt out for this prop's reason.
   * /industries follows `ComplianceAssurance` (#f1eee7), a genuinely different
   * colour, so the grounds already separate: that section is `border-y` and
   * its `border-b` already lands on exactly this line, so honouring the prop
   * would render a 2px seam. Nothing is being suppressed there. Copy that case
   * only if your seam has a double rule, not because the colours differ.
   *
   * /gifts used to be the second opt-out, and that one was this prop's real
   * use: it followed `CaseStudyTeaser`, also #ffffff, so the hairline would
   * have been the only edge between two identical bands, which is the
   * arbitrary separator this prop exists to suppress. That band was removed,
   * so /gifts now follows `ServiceTiers` (#faf8f3), a different colour, and
   * correctly takes the default again. If you restore a white band above this
   * component, `divider={false}` is the right call; if the band above is any
   * other colour, leave the prop off.
   */
  divider?: boolean;
  /**
   * Threads `SectionHeading`'s `enterOnLoad` — the page-scoped static-header
   * lever. The /gifts directives have alternated on the header question;
   * currently UNPASSED on every route, so the default scroll reveal runs
   * everywhere this band renders. Kept rather than re-plumbed next time.
   */
  enterOnLoad?: boolean;
}

/** Testimonials — Antavo-style multi-card carousel of client results.
 *
 *  Superseded by a three-column infinite vertical marquee in
 *  `TestimonialsCarousel`. The deck is now CSS-only, so this section ships no
 *  client JavaScript: the horizontal carousel that used to live here needed
 *  cloned leading/trailing slides, a measured px-per-slide step, a wrap-snap
 *  transform, an interval timer and eleven pieces of state, all of which
 *  existed only to fake a loop along the horizontal axis. Two stacked copies
 *  of each column plus a `translateY(-50%)` keyframe replace all of it.
 *
 *  `data-reveal-item` stays on the wrapper. The reveal system reads it as a
 *  standalone group and fades the whole deck in once, which is what we want —
 *  per-column reveal would let one column animate in while its neighbours are
 *  still hidden, and the staggered columns would be plainly visible. */
export function Testimonials({
  divider = true,
  enterOnLoad = false,
}: TestimonialsProps) {
  const reducedMotion = useReducedMotion();

  return (
    /* Pure white band, replacing the off-white `bg-warm-grey` (#f7f4eb). The
     *  separation it buys is one-sided: the section above (EmotionalPayoff) is
     *  #FAF8F3 and the section below (FaqList) is `bg-surface` = #ffffff, so
     *  this band now runs into the one below it and only the `border-t`
     *  hairline marks that edge.
     *
     *  Consequence for the deck: half the quote cards are `bg-white`, so on a
     *  white field they lose their fill and can no longer be told apart by
     *  colour alone. `QuoteCard` gives that tone a resting `shadow-elev-2` and a
     *  darker border to keep it reading as a raised panel. Type contrast is
     *  unaffected — `text-charcoal` (#111827) and `text-taupe` (#4b5563) are
     *  byte-identical to gray-900/gray-600 and measure 17.4:1 and 7.6:1 here. */
    <section
      className={`relative overflow-hidden bg-white py-section ${
        divider ? "border-t border-section-divider" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          enterOnLoad={enterOnLoad}
          eyebrow="What teams say"
          title={
            <span className="text-[clamp(1.7rem,8vw,2.125rem)] md:text-[inherit]">
              Real teams,{" "}
              real{" "}
              <em className="accent-em">impact</em>
            </span>
          }
          description="Hear how enterprise teams use Fulfill Nest to run rewards that drive retention, engagement, and delight."
          align="center"
        />

        <motion.div
          initial={reducedMotion ? "visible" : "hidden"}
          whileInView={reducedMotion ? undefined : "visible"}
          viewport={reducedMotion ? undefined : { once: true, amount: 0.2 }}
          variants={reducedMotion ? undefined : containerVariants}
          className="mt-16 md:mt-24"
        >
          <TestimonialsCarousel items={testimonials} parentVariants={itemVariants} />
        </motion.div>
      </div>
    </section>
  );
}