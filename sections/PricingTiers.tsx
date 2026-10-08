"use client";

import { motion, useReducedMotion } from "framer-motion";
import { membershipTiers } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CheckIcon } from "@/components/ui/Icons";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/** Membership & plans — four tiers across, the third highlighted on dark.
 *
 *  The previous version of this section was split across `sections/PricingTiers`
 *  and `components/pricing/PricingTiersClient` because it had a monthly /
 *  annual billing toggle to drive. The brief specifies four fixed-price tiers
 *  with a static `billingNote` on each and no toggle, so the section's only
 *  piece of state is gone. `PricingTiersClient.tsx` is now unreferenced and has
 *  been deleted; the section now adds a small Framer Motion wrapper for the
 *  viewport-triggered card entrance while keeping the cards themselves
 *  server-rendered in shape.
 *
 *  THE WATERMARK PILL is the brief's "FN" in the card's top right. It is
 *  `aria-hidden`: it is a brand mark repeating what the section already says,
 *  so a screen reader announcing "FN" four times in a row is noise.
 *
 *  LAYOUT. `lg:grid-cols-4` with `gap-6` and `items-stretch`, per the brief.
 *  `items-stretch` is the default for grid and is stated explicitly because
 *  the cards carry unequal feature lists and the brief wants them equal height
 *  with the CTAs aligned along the bottom — which needs `mt-auto` on the CTA
 *  wrapper, the idiom the previous three-card grid used.
 *
 *  ENTRANCE is handled by Framer Motion: the card grid is a single viewport-
 *  triggered parent (`whileInView`, `amount: 0.2`, `once: true`) and each card
 *  fades up with a 0.1s stagger. The SectionHeading keeps the site-wide CSS
 *  reveal marker so the header entrance stays consistent with the rest of the
 *  page. The previous `data-reveal-stagger` marker on the grid is removed so
 *  the two systems do not both drive the same cards.
 */
export function PricingTiers() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="memberships-and-plans"
      className="relative scroll-mt-28 overflow-hidden border-t border-section-divider bg-surface py-section md:scroll-mt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Membership & plans"
          title={
            <>
              Simple, predictable plans built for{" "}
              <em className="accent-em">team</em>
            </>
          }
          description="Choose the tier that fits your gifting frequency and scale seamlessly as you grow."
        />

        <motion.div
          className="mt-16 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {membershipTiers.map((tier) => (
            <motion.article
              key={tier.name}
              variants={reducedMotion ? undefined : cardVariants}
              className={`relative flex flex-col rounded-card border p-6 transition-all duration-300 ease-in-out ${
                tier.highlighted
                  ? "texture-paper z-10 -translate-y-2 border-forest bg-forest text-darktext shadow-elev-2 hover:shadow-card-hover"
                  : "border-section-divider bg-warm-grey shadow-elev-1 hover:-translate-y-1 hover:border-brand-green-600/40 hover:shadow-card-hover"
              }`}
            >
              {tier.badge ? (
                <p className="absolute -top-3.5 left-6 rounded-pill bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-charcoal">
                  {tier.badge}
                </p>
              ) : null}

              <div className="flex items-start justify-between gap-3">
                <h3
                  className={`font-display text-lg ${
                    tier.highlighted ? "text-gold-500" : "text-charcoal"
                  }`}
                >
                  {tier.name}
                </h3>

                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-pill text-[10px] font-bold tracking-[0.08em] ${
                    tier.highlighted
                      ? "bg-gold-500/15 text-gold-500"
                      : "bg-brand-green-100 text-brand-green-700"
                  }`}
                >
                  {tier.watermark}
                </span>
              </div>

              <div className="mt-5">
                <p
                  className={`stat-numeral text-4xl ${
                    tier.highlighted ? "text-gold-500" : "text-charcoal"
                  }`}
                >
                  {tier.price}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    tier.highlighted ? "text-darktext/60" : "text-taupe"
                  }`}
                >
                  {tier.billingNote}
                </p>
                <p
                  className={`mt-3 text-sm leading-6 ${
                    tier.highlighted ? "text-darktext/65" : "text-taupe"
                  }`}
                >
                  {tier.bestFor}
                </p>
              </div>

              <ul
                className={`mt-6 flex flex-col gap-2.5 border-t pt-5 text-sm leading-5 ${
                  tier.highlighted ? "border-dark-line" : "border-section-divider"
                }`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckIcon
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        tier.highlighted ? "text-gold-500" : "text-accent-700"
                      }`}
                    />
                    <span
                      className={
                        tier.highlighted ? "text-darktext" : "text-walnut"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <ButtonLink
                  href="/contact"
                  variant={tier.ctaVariant}
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
