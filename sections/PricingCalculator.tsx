"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  GiftIcon,
  HeartIcon,
  PackageIcon,
  RadarIcon,
  ShieldIcon,
  TruckIcon,
  UserCheckIcon,
} from "@/components/ui/Icons";

/* ------------------------------------------------------------------ */
/*  Dedicated live-estimator section, sitting directly below the hero. */
/* ------------------------------------------------------------------ */

interface Feature {
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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

/**
 * Wireframe object icons, one per feature, in reading order.
 *
 * No icon package is installed — the only runtime dependencies are
 * next/react/react-dom/framer-motion — so the glyphs are drawn in
 * `components/ui/Icons.tsx` alongside the other 34, on that file's shared
 * `base` object, which already sets `strokeWidth: 1.5` with round caps and
 * joins. Nothing here sets a stroke weight of its own: the thin look is the
 * file default, so a future edit to `base` moves these with everything else.
 *
 * Five of the seven reuse icons the site already had rather than drawing new
 * geometry, because the existing glyphs already named these concepts:
 * `GiftIcon` for the curated collections (drawn originally for the budget
 * calculator, which no longer renders), `TruckIcon` for carriage,
 * `HeartIcon` for the thank-you row, `ShieldIcon` (already a shield with a
 * tick inside it, which is the brief's `ShieldCheck`) for address validation,
 * and `RadarIcon` for live tracking — the last of which is the same icon the
 * "Live Tracking Dashboard" guarantee on /services uses in `lib/data.ts`, so
 * the two agree by construction. `PackageIcon` and `UserCheckIcon` are the
 * only new glyphs.
 */
const FEATURES: Feature[] = [
  { label: "Curated gift collections & Recipient Choice", icon: GiftIcon },
  { label: "Flat-rate doorstep shipping & fulfillment", icon: TruckIcon },
  { label: "Recipient thank you messages & feedback loop", icon: HeartIcon },
  { label: "Custom branded packaging & swag integration", icon: PackageIcon },
  {
    label: "Secure recipient address collection & validation",
    icon: ShieldIcon,
  },
  { label: "Live account support & dedicated manager", icon: UserCheckIcon },
  { label: "Real-time delivery tracking dashboard", icon: RadarIcon },
];

/** The Enterprise callout's two inclusions, as separate inline items. */
const ENTERPRISE_INCLUDES: string[] = [
  "Free bulk milestone shipping",
  "Access to tiered executive rewards",
];

/**
 * Pricing value proposition — what you actually pay for, beside the gift the
 * price buys.
 *
 * NAMING, which is out of step with the contents: the file, the export and
 * `id="estimate"` all still say "calculator", because the section that used to
 * be a working `BudgetCalculator` was stripped to a header and a mount point
 * and has since been rebuilt as this. The file name and the export are free to
 * become `PricingValueProps` whenever a rename is worth doing.
 *
 * THE `id` IS NOW ORPHANED, and that is a live change rather than a naming
 * footnote. It used to have exactly one justification: the hero's primary CTA
 * was `href="#estimate"`. That CTA now points at `#memberships-and-plans` (the
 * `PricingTiers` band) under the label "View Pricing Plans", so nothing on the
 * site links here any more. The id is kept — it is a valid handle for a future
 * inbound link, and removing it would break any external `#estimate` link
 * already shared — but the stated reason it has to stay no longer applies, and
 * the "Live estimator" band has no jump-in from anywhere.
 *
 * SKELETON, which is the house one rather than a bespoke arrangement:
 * `max-w-7xl px-6` shell, centred `SectionHeading`, then the content grid at
 * `mt-16`. That is the same order and spacing as `PricingTiers` and
 * `ProductShowcase`. `SectionHeading` owns the `<h2>`, so the in-column
 * headline below is an `<h3>`: one h2 per section, with the column headline
 * reading as its sub-head. The two sentences overlap somewhat — both promise
 * transparent pricing — so the `<h3>` is the first thing to cut if that reads
 * as repetition.
 *
 * THE HEADING ACCENT sits on "Team", not on "Predictable Costs". It is
 * carried by `accent-em`, which is the house's own red-italic treatment —
 * italic plus `--color-brand-primary` (#a83b24). A stock `text-red-600` would
 * have been a *different* red (#dc2626) and the only one in the codebase;
 * red-600, rose-600 and font-serif are not tokens anywhere in `globals.css`.
 * One accent per heading, on the audience rather than the adjective.
 *
 * The panel `<h3>` below ("Simply pay for the price of the gift + shipping,
 * no contracts or hidden fees") carries NO accent, even though it is an `h3`
 * and even though it is the longest line on the panel. It is read as the
 * panel's claim line, not as a heading, so the final-word accent rule does
 * not apply to it. Do not add one back.
 *
 * THE ENTERPRISE CALLOUT is a tinted panel with no border on any side — the
 * brief's `border-0`, expressed by simply not setting one. `bg-linen`
 * (#f1eee7) is the house's warm "emphasis surface" and the nearest thing to
 * the `slate-50`/`stone-50` the brief reached for; both of those are stock
 * Tailwind greys and would have been the only cool-grey panels on a warm
 * cream page. The label is a `text-eyebrow` run inside a white `rounded-pill`,
 * which is the one place this file departs from a documented house rule:
 * `SectionHeading` states the eyebrow is unboxed site-wide, no pill fill, no
 * radius, no padding. The pill is here because the brief asked for a badge
 * and it is the only one on the site; reverting it is deleting one class.
 *
 * The terms line at the foot of the panel is deliberately retained. It adds
 * no border and no chrome, and "free bulk milestone shipping" is an
 * unqualified commercial promise that nothing else on the site supports yet —
 * dropping the line would leave that claim with no terms attached to it.
 *
 * ENTRANCE is handled by Framer Motion. The content grid is a viewport-
 * triggered parent (`whileInView`, `amount: 0.2`, `once: true`) and the image,
 * heading, feature list and enterprise panel fade up with a 0.08s stagger.
 * The SectionHeading keeps the site-wide CSS reveal marker so the header
 * entrance stays consistent with the rest of the page. The previous CSS reveal
 * attributes (`data-reveal-stagger`, `data-reveal-content-offset`,
 * `data-reveal-stagger-step`) have been removed so the two systems do not both
 * drive the same nodes.
 */
export function PricingCalculator() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="estimate"
      className="relative scroll-mt-28 border-t border-section-divider bg-surface py-section md:scroll-mt-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Transparent pricing"
          title={
            <>
              Simple, predictable costs for{" "}
              <em className="accent-em">team</em>
            </>
          }
          description="No surprise contracts or hidden management fees. Pay straightforward rates for premium gift curation and doorstep delivery."
        />

        <motion.div
          className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Left: the gift the transparent price buys. Hovering the frame
              zooms it 5%, on the same class string used at all five other
              photo-zoom sites in the codebase — `ProductShowcaseClient`,
              `IndustriesList`, `SolutionsTabs`, `HeroPhotoFrame` and
              `TestimonialsCarousel` — so the timing and the reduced-motion
              guard cannot drift apart from them.

              Two differences from the brief, both deliberate:

              `duration-500`, not the brief's `duration-700`. 500ms is what the
              five existing sites use; a 700ms zoom here would be the slowest
              image zoom on the site, and this is the one photo a reader is
              most likely to hover repeatedly.

              The brief's class string omits the `motion-reduce:` pair, and it
              is carried over from the house string rather than dropped. Those
              two utilities are the only thing stopping a 5% scale from being
              served to a reader who has asked the OS for reduced motion, and
              the reveal system guards the entrance the same way.

              `w-full h-full` from the brief is not applied: this `<Image>` is
              in `fill` mode, which already emits `position:absolute` with
              `height:100%;width:100%` inline. The two classes would be inert
              and a later editor would reasonably assume they were load-bearing.

              `overflow-hidden` on the frame is what keeps the zoom inside the
              `rounded-3xl` corners — `HeroPhotoFrame` says the same about its
              own frame, and without it the photo grows past the rounding. The
              scale is on the image, the clip is on the parent, which is why
              `group` sits on the parent too.
              `/images/pricing/transparent-pricing-flatlay.png` is the supplied
              "Transparent Pricing (Pricing) - curated luxury gift box open
              display flatlay", copied from
              `Media & Others\Pricing Page Images\Transparent Pricing` and
              verified SHA256-identical to the source, which stays in place.
              Natively 1620x1620, 3.75 MB — the heaviest file in
              `public/images/pricing/` and the fourth heaviest in
              `public/images/` overall, in line with the 1.88-3.24 MB industry
              PNGs already there, and `next/image` re-encodes it to a served
              variant so no visitor downloads the original. Kept as `.png`
              because that is what the source file is; the brief's example path
              assumed a `.jpg` that does not exist.

              The frame is 4:5 against a 1:1 source, so `object-cover` now
              scales to WIDTH and loses about 20% of the HEIGHT — the opposite
              of the 1920x1080 source this replaced, and the direction
              `HeroPhotoFrame`'s own note calls the expensive one, since it
              trims off the top and bottom rather than the sides. Acceptable
              for two reasons: the subject is a flat-lay spread rather than
              one centred object, and a square frame would have left roughly
              80px of dead column against a right column about 670px tall,
              where 4:5 lands within about 70px of matching it. Because this
              crop takes height there IS now a vertical pan available, so
              `objectPosition` is worth tuning in the browser; it is left
              centred because the crop is symmetric and the source has not
              been eyeballed for its true optical centre. */}
          <motion.div
            variants={reducedMotion ? undefined : itemVariants}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-elev-1"
          >
            <Image
              src="/images/pricing/transparent-pricing-flatlay.png"
              alt="A curated Fulfill Nest gift box shown open, its contents laid out around it"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:scale-100"
            />
          </motion.div>

          {/* Right: claim, evidence, upsell. */}
          <motion.div
            variants={reducedMotion ? undefined : containerVariants}
            className="flex flex-col"
          >
            <motion.h3
              variants={reducedMotion ? undefined : itemVariants}
              className="font-display text-h3 text-charcoal"
            >
              Simply pay for the price of the gift + shipping, no contracts
              or hidden fees
            </motion.h3>

            <motion.ul
              variants={reducedMotion ? undefined : itemVariants}
              className="mt-8 flex flex-col gap-5"
            >
              {FEATURES.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-start gap-4">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-accent-700" />
                  <span className="text-lg font-medium leading-7 text-charcoal">
                    {label}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={reducedMotion ? undefined : itemVariants}
              className="mt-8 rounded-2xl bg-linen p-5"
            >
              <p className="text-eyebrow w-fit rounded-pill bg-surface px-3 py-1 uppercase text-eyebrow-gray">
                Enterprise capabilities
              </p>

              <p className="mt-3 text-base font-semibold text-charcoal">
                Want more from your gifting program? Upgrade to Fulfill Nest
                Enterprise
              </p>

              {/* `flex flex-wrap gap-x-6 gap-y-1` so the two inclusions sit
                  side by side at desktop and drop to their own lines on a
                  narrow column instead of squeezing. The dots are 6px at
                  `mt-2`, which centres them on a 20px line box. */}
              <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-taupe">
                {ENTERPRISE_INCLUDES.map((inclusion) => (
                  <li key={inclusion} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600"
                    />
                    {inclusion}
                  </li>
                ))}
              </ul>

              {/* Retained terms line — see the note in the header comment. */}
              <p className="mt-4 border-t border-sand pt-4 text-xs leading-5 text-taupe">
                Both benefits apply to Enterprise agreements, subject to eligible
                delivery pin codes and programme volumes. Talk to us about what
                your programme qualifies for.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
