import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { ChildHero } from "@/sections/hero/ChildHero";
import { HeroPhotoFrame } from "@/sections/hero/HeroPhotoFrame";

/**
 * The rotating accent word in "Gifting engineered with ___".
 *
 * Kept at module scope so the array identity is stable across renders —
 * `RotatingCubeText` re-derives its measurement pass from a string signature of
 * the phrases, and a fresh array on every render would churn that work.
 *
 * These are NOT all the same length, contrary to how the set was specified:
 * `perfection` is 10 characters and `finesse` is 7, against 9 for the other
 * three. Two consequences, which the flipper props below handle separately.
 *
 * The variation is why the box is reserved to the widest word: an inline-block
 * that resizes with the phrase moves the host h1's line-break point on every
 * flip, and a 9→10 character change is enough to cross a line at some viewport
 * widths, which shifts everything below the h1 by a whole line.
 *
 * The variation is also why the face is left-aligned rather than centred. With
 * a reservation the box is always 10 characters wide, so a centred 7-character
 * word floats in it with a visible hole on each side — the gap after "with "
 * that used to change five times per cycle. Left-aligning moves all of that
 * slack to the right of the word, where nothing is laid out to be pushed by it.
 *
 * Re-equalising the set is a copy decision, not a code one, and after this it
 * is no longer a visual one either.
 */
const ACCENT_WORDS = [
  "precision",
  "perfection",
  "exactness",
  "intention",
  "finesse",
] as const;

/**
 * Services hero — "Gifting engineered with precision".
 *
 * Three per-page departures from the shared `ChildHero` contract, each opted
 * into explicitly and none of which changes a default:
 *
 *   `canvas="flat"`   no paper grain, wash, sage bloom, copper pool or ribbons.
 *   `surface="light"` painted `bg-bg-canvas` (#fbf9f5) rather than `bg-canvas`.
 *   `columns="even"`  a true 1fr 1fr split, with the 520px lead that a 50/50
 *                     column can actually accommodate.
 *
 * `HeroCanvas` is mounted by ten routes across the site, so none of the three
 * could be applied by editing it directly — that would have silently restyled
 * nine other heroes. They are the reason `HeroCanvas` grew a `surface` prop
 * and `ChildHero` grew a `columns` prop, both defaulted.
 *
 * The H1's accent word is animated by `RotatingCubeText`, the flipper the
 * homepage hero has always used, rather than by a second implementation. It
 * holds each word 2.5s and flips in 0.4s on ease-in-out, against the homepage's
 * 4s / 0.7s — the two are separate props for exactly this reason. Accent
 * treatment is unchanged: the component's wrapper carries the same `accent-em`
 * class a static `HeroEm` would have, so the rotating word is still italic,
 * weight 500, brand primary. (A literal `font-weight: inherit` was asked for
 * and deliberately not used: inside an 800-weight h1 it resolves straight back
 * to 800, which is why the component dropped it — and it would leave this word
 * as the only non-conforming accent in the five standardised heroes.)
 *
 * `stats` is deliberately not passed. The four proof cards (99%, 200+, 4.9/5,
 * 18k) are gone from this hero. About, Contact, Industries, Pricing and every
 * `PageHero` route still pass their own, so `HeroStatsBar` stays live and the
 * omission here is a local decision, not a dead export.
 */
export function ServicesHero() {
  return (
    <ChildHero
      canvas="flat"
      surface="light"
      columns="even"
      eyebrow="Our services"
      title={
        <>
          Gifting engineered with{" "}
          <RotatingCubeText
            phrases={ACCENT_WORDS}
            /* Timings are deliberately NOT overridden: 4s hold, 0.7s flip,
               cubic-bezier(0.16, 1, 0.3, 1) are the component's defaults, which
               are the homepage hero's cadence. Passing 2500/0.4/easeInOut here
               gave this hero its own faster timeline; the two are now on one.
               Since the values are props rather than module constants, the
               reverse leak into `HeroFlanked` was never possible either way. */

            /* The reservation is load-bearing here, for a reason that is not
               about the text after the flipper. The wrapper is an inline-block
               inside a sentence, so its own width decides where the h1 breaks.
               A box that tracked the active word would move that break point
               every flip, and a 9→10 character change is enough to cross a line
               boundary at some viewport widths — which adds or removes a whole
               line and shifts the lead, the CTAs and everything below them,
               vertically, on a loop. Pinning the box to the widest word makes
               the h1's height constant.

               `align="start"` is what stops that from reintroducing the gap
               `stableLayout` used to cause. Reserved slack now all falls to the
               right of the word, where nothing follows it, instead of being
               split across both sides and putting a visible hole after "with ".
               This pairing — reserve, but left-align — is exactly the case the
               single `stableLayout` prop could not express. */
            stableLayout
            align="start"
            className="whitespace-nowrap"
          />
        </>
      }
      description="From a single heartfelt thank-you to ten-thousand festive hampers—one standard of care, one chain of custody, every single time."
      actions={[
        {
          href: "/contact",
          label: "Book a consultation",
          variant: "primary",
        },
        {
          /* Repointed from `#employee-rewards` to the section itself. Both
             resolved even back when the section was a stack of cards, because
             each card carried `id={offering.id}`. But this link's copy is
             "Explore solutions", and `#solutions` is the section that holds all
             four, so the section is the honest target for that sentence.

             Still correct after that section became `SolutionsTabs`: the
             section id survived the rewrite, and the four per-offering ids now
             select a tab rather than scroll to a card. See the hash handling in
             `SolutionsTabs` for why that indirection is necessary. */
          href: "#solutions",
          label: "Explore solutions",
          variant: "secondary",
        },
      ]}
      visual={
        <HeroPhotoFrame
          /* Repointed from `/services/hero-flatlay.jpg`, which is the previous
             6000x4000 (exactly 1.5) source. The new flatlay is natively 1920x1080
             (1.778), so it is now on the wider side of the frame's 3:2 and
             `object-cover` takes ~16% off its height, centred.

             That crop is the cheap direction for this photograph, and
             deliberately so: it is a top-down grid, not a subject with a top and
             a bottom, so trimming one band off each edge costs a row of items
             rather than a head. Pre-cropping the asset to 3:2 instead would have
             permanently discarded the same band from the master for no render
             benefit — the frame already does this work at request time, at full
             width, with no extra bytes. See the 3:2 note in `HeroPhotoFrame`.

             1920 native rather than 3840+ because the source is 1920. Going wider
             would mean upscaling, and the frame's `sizes` tops out well below it
             on every breakpoint. */
          src="/images/heroes/services-hero.jpg"
          alt="A curated Fulfill Nest gift programme arranged for delivery"
          preload
          /* This hero's photo zooms 1.05 on hover, 500ms ease-out, clipped by
             the frame's `overflow-hidden`.

             Scoped to `/services` via the opt-in rather than applied to
             `HeroPhotoFrame` itself, because five more routes render that
             component — and the file's own reason for existing is that this
             hero and `/industries` must stay identical. The other five keep the
             no-zoom default. This is the same defaulted-opt-in shape as
             `canvas`/`surface`/`columns` above, for the same reason.

             Safe on this particular photograph: the 1.05 scale is applied to
             the `img` under an `object-cover` crop, so it reveals *more* of the
             flatlay's edges rather than reframing the grid — there is no
             centre-weighted subject to push out of frame. */
          hoverZoom
        />
      }
    />
  );
}
