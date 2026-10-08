"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { serviceTiers } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CheckIcon } from "@/components/ui/Icons";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/**
 * Service tier & package matrix — three engagement models on a clean
 * comparison grid. The Managed tier is flagged "Most Popular". Cards lift
 * gently on hover and the highlighted tier carries a subtle accent wash.
 *
 * ENTRANCE is handled by Framer Motion: the card grid is a single viewport-
 * triggered parent (`whileInView`, `amount: 0.2`, `once: true`) and each card
 * fades up with a 0.1s stagger. The SectionHeading above keeps the site-wide
 * CSS reveal marker so its entrance stays consistent with the rest of the
 * page; only the tier cards switch to the Framer Motion path requested here.
 */
export function ServiceTiers({
  enterOnLoad = false,
}: {
  /** SectionHeading opt-in for the static-header guardrail. Currently
   *  UNPASSED everywhere — the /gifts directives have alternated between
   *  static and scroll-revealed headers; the default scroll reveal is live.
   *  Kept as the page-scoped lever. */
  enterOnLoad?: boolean;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-section-divider bg-surface-muted py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          enterOnLoad={enterOnLoad}
          eyebrow="Service tiers"
          title={
            <>
              Flexible engagement models for every{" "}
              <em className="accent-em">headcount</em>
            </>
          }
          description="From self-serve to fully owned operations — pick the level of care that fits how your programme runs today, and scale it up as you grow."
        />

        <motion.div
          className="mt-16 grid gap-6 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {serviceTiers.map((tier) => (
            <motion.article
              key={tier.name}
              variants={reducedMotion ? undefined : cardVariants}
              className={`relative flex flex-col gap-6 rounded-card border p-8 shadow-elev-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-card-hover ${
                tier.popular
                  ? "border-brand-green-600/50 bg-white hover:border-brand-green-700/70"
                  : "border-section-divider bg-surface-muted hover:border-brand-green-600/40"
              }`}
            >
              {tier.popular ? (
                <p className="absolute -top-3.5 left-8 rounded-pill bg-gold-500 px-4 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-charcoal shadow-elev-1">
                  Most Popular
                </p>
              ) : null}

              <div>
                <h3
                  className={`font-display text-xl ${
                    tier.popular ? "text-brand-green-700" : "text-charcoal"
                  }`}
                >
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-taupe">
                  {tier.tagline}
                </p>
              </div>

              <ul
                className={`flex flex-col gap-3 border-t pt-6 text-sm leading-6 ${
                  tier.popular ? "border-brand-green-600/25" : "border-section-divider"
                }`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />
                    <span className="text-walnut">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                <ButtonLink
                  href="/contact"
                  variant={tier.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {tier.cta}
                </ButtonLink>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
