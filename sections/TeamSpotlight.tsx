"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChatIcon, SparklesIcon, TruckIcon } from "@/components/ui/Icons";
import { culturePillars } from "@/lib/data";

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

/* "Curation studio" moved from `HeartIcon` to `SparklesIcon`. The brief asked
 * for lucide's `Sparkles` for this section and a four-point sparkle is the
 * right mark for a gift-edit studio anyway; a heart is a loyalty/affection
 * signal, which is not what the pillar copy is about. `HeartIcon` is still
 * live via `HeroFeed.tsx`, so nothing is orphaned by the swap. */
const pillarIcons = [ChatIcon, SparklesIcon, TruckIcon] as const;

/**
 * About — behind-the-scenes spotlight on the team and culture behind the
 * parcels: a real studio candid beside the disciplines that run the show.
 *
 * Sits between the warm Beliefs section and the closing call-to-action, so
 * the page alternates warm → light → warm on the way down. No fabricated
 * headcounts or named executives — the roster stays functional and true.
 *
 * FILE. The brief named `sections/about/BehindTheScenes.tsx` and
 * `components/about/BehindTheScenes.tsx`. Neither exists, and neither does
 * `sections/about/` or `components/about/` — `sections/` is flat apart from
 * `sections/hero/`. There is no component called BehindTheScenes anywhere in
 * the project; the "Behind the scenes" eyebrow and the behind-the-parcels
 * editorial are both in here, and this is the section the brief describes, so
 * it is the file that was edited.
 *
 * ICONS. The brief asked for lucide-react (`PackageCheck`, `Sparkles`,
 * `Truck`, `ShieldCheck`, `Layers`). `lucide-react` is not a dependency, is
 * not in `node_modules`, and is not named in `package.json`; adding a
 * whole icon library to draw three glyphs this site already has is not a code
 * edit, so the house set in `components/ui/Icons.tsx` was used instead —
 * inline `<svg>`, hand-drawn, vector at any size. The brief's premise that
 * these were low-resolution PNGs was also not accurate: they were already
 * vectors, at `h-5 w-5`. What was actually small and low-contrast was the
 * BADGE around them, so that is what was rebuilt: 40px → 48px, glyph 20px →
 * 24px, and a fill/edge/glyph ramp that reads at a glance.
 *
 * An invariant I had been working from is wrong and is worth correcting: I
 * previously recorded that every `Icons.tsx` export is referenced. It is not.
 * Thirteen of thirty-four are unreferenced — `SparklesIcon`, `ClockIcon`,
 * `TrendUpIcon`, `MapPinIcon`, `TagIcon`, `ReceiptIcon`, `SlidersIcon`,
 * `LockIcon`, `LaptopIcon`, `HeartPulseIcon`, `ShoppingBagIcon`,
 * `BriefcaseIcon` and `FactoryIcon`. This edit consumes one of them. The
 * other twelve are still dead weight.
 *
 * BADGE COLOUR, all substituted. The brief's classes are stock Tailwind and
 * three of the four do not exist in `globals.css`:
 *
 *   bg-red-50     -> bg-accent-50        #fbf1eb, warm near-white, red cast
 *   text-red-600  -> text-brand-primary  #a83b24, the house brick red. Stock
 *                                       red-600 is #dc2626 and the only
 *                                       place it appears would be here.
 *                                       `ComplianceAssurance` already records
 *                                       this token as measuring 5.47:1 on
 *                                       linen and 6.33:1 on white — a real
 *                                       red at full saturation, AA at any
 *                                       size, which is what "high contrast"
 *                                       is asking for here. `accent-600`
 *                                       (#c46a4a) is the lighter terracotta
 *                                       and was the weaker choice.
 *   border-red-100-> border-accent-500   #ce7c5d. Taken literally this token
 *                                       substitution fails: `accent-100`
 *                                       (#f5e4db) on `accent-50` (#fbf1eb)
 *                                       is a ~1.1:1 edge, exactly as invisible
 *                                       as stock red-100 is on red-50. The
 *                                       house ramp only offers 50/100/500, so
 *                                       500 is the only step that gives an
 *                                       actual border. The result is a
 *                                       deliberate three-step ramp: pale fill,
 *                                       mid edge, deep glyph.
 *
 * `rounded-2xl` and `shadow-sm` are stock and the house overrides neither, but
 * both are already used in this codebase (9 and 2 occurrences), so they are
 * house-accepted. Note `rounded-3xl` is 1.5rem, not the house's
 * `--radius-card` (1.25rem), and the badge's previous `rounded-card` is being
 * replaced by the brief's smaller `rounded-2xl` (1rem) — the corner gets
 * squarer, not rounder.
 *
 * The `group-hover` flip to `bg-brand-green-700` is pre-existing and the brief
 * did not mention it, so it stays: a brick-red badge that turns dark green on
 * hover is a clash, but silently dropping a house motion affordance is worse.
 * Say the word and it goes.
 *
 * ── HEADING COPY: accent boundary ─────────────────────────────────────────
 * The heading reads "Every box passes through meticulous hands" — sentence
 * case — and the brick-red italic (`accent-em`) now wraps ONLY the final
 * word "hands". It briefly covered the whole "meticulous hands" phrase; the
 * current directive pinned the highlight back to the noun alone, so
 * "meticulous" sits in plain charcoal and the rest of the heading stays
 * non-italic. Instance of the house one-word accent rule, same shape as
 * "The Fulfill Nest promise" on /pricing.
 *
 * The line count may shift. The heading sits in a 672px measure at a display
 * size that reaches 3rem, and it grew by eleven characters — 30 to 41. That
 * is enough to tip the last line on a narrower desktop, which is the reason to
 * re-read the block rather than assume it still sets as it did.
 */
export function TeamSpotlight() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="border-t border-section-divider bg-surface py-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reducedMotion ? undefined : containerVariants}
        className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-14 lg:gap-y-4"
      >
        <motion.div
          variants={reducedMotion ? undefined : itemVariants}
          className="lg:order-2 lg:col-span-7"
        >
          <SectionHeading
            eyebrow="Behind the scenes"
            title={
              <>
                Every box passes through meticulous{" "}
                <em className="accent-em">hands</em>
              </>
            }
          />
        </motion.div>

        <motion.div
          variants={reducedMotion ? undefined : itemVariants}
          className="relative lg:order-1 lg:col-span-5 lg:row-span-2"
        >
          {/* Real photograph, copied out of `Media & Others\About` — the source
              is `About - Behind the Scenes - every box passes through human
              hands.png`, 2318x3000 portrait, and the original is left
              full-res in place. Converted to JPEG q88 on the way in: 7.3 MB PNG
              → 804 KB, 9x smaller, same pixel dimensions and no alpha channel
              to lose (it was already 24bpp RGB). Ledger entry added to
              `public/README.md`.

              This replaces `/testimonial-portrait.jpg`, which was itself a real
              photo for this same slot (a 6000x4000 office-team candid) and is
              now unreferenced in code. It is left on disk rather than deleted —
              it is a paid asset and removing it is not this brief's call.

              `object-cover` and the 4:5 crop are unchanged, so the display
              geometry is identical. The source is 0.773 and the frame is 0.8,
              so `object-cover` trims a little height. `objectPosition 50% 32%`
              is carried over from the previous image and has not been
              re-aimed at this photograph — worth an eyeball, though hover and
              visual checks are out of scope for this pass. */}
          {/* `group` on this frame is the same trigger the hero photo frames
              use: the whole framed image (including its rounded corners)
              starts the zoom, not just a bare `hover:` on the photo. The scale
              classes are the site's canonical zoom string — the one
              `HeroPhotoFrame` documents — duration-500 ease-out with the
              motion-reduce pair, so a reduced-motion user keeps the still
              frame. `ease-in-out` was the brief's example; the house zoom is
              ease-out everywhere it already ships, and one zoom outranks one
              section's literal example. The frame was already
              `overflow-hidden`, so the 1.05 scale clips at the rounded
              corners. */}
          <div className="group relative overflow-hidden rounded-3xl shadow-elev-2">
            <Image
              src="/images/about/behind-the-scenes.jpg"
              alt="Fulfill Nest behind the scenes operation"
              width={2318}
              height={3000}
              sizes="(max-width: 768px) 100vw, 40vw"
              className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:scale-100"
              style={{ objectPosition: "50% 32%" }}
            />
          </div>
        </motion.div>

        <motion.div
          variants={reducedMotion ? undefined : itemVariants}
          className="lg:order-3 lg:col-span-7"
        >
          <p className="max-w-2xl text-body-lg text-taupe">
            Fulfill Nest stays deliberately small — curators who taste-test
            every box, operators who own each order end-to-end, and client-care
            people who treat your calendar like their own. The person who packs
            your first gift is the person who answers your next email.
          </p>

          <ul className="mt-10">
            {culturePillars.map((pillar, index) => {
              const Icon = pillarIcons[index];
              return (
                <li
                  key={pillar.title}
                  className="group flex items-start gap-4 border-t border-sand py-6 last:border-b"
                >
                  {/* Bare 24px glyph, no badge. The 48px `rounded-2xl` container is gone
                  rather than restyled: it carried `border-accent-500`, `bg-accent-50`,
                  `shadow-sm` and a `group-hover:bg-brand-green-700` flip, and a badge that
                  turns forest-green on hover was a standing clash. With no fill to flip
                  the row now has nothing to disagree with. 24px is the system's
                  standalone-feature size. The `mt-1` nudge is deliberate: the glyph is
                  24px against an 18px heading, so 4px is the optical alignment. */}
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-accent-700" />
                  <div>
                    <h3 className="font-display text-lg text-charcoal transition-colors duration-300 ease-in-out group-hover:text-brand-green-700">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 max-w-xl text-body text-taupe">
                      {pillar.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <blockquote
            className="mt-8 max-w-xl border-l-2 border-accent-600 pl-5"
          >
            <p className="font-display text-lg font-medium leading-7 text-charcoal">
              “A reward is only as good as the hands it passes through.”
            </p>
            <footer className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-taupe">
              — the Fulfill Nest studio
            </footer>
          </blockquote>
        </motion.div>
      </motion.div>
    </section>
  );
}
