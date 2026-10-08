import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { ChildHero } from "@/sections/hero/ChildHero";
import { HeroPhotoFrame } from "@/sections/hero/HeroPhotoFrame";

/**
 * The rotating accent word in "Building links with ___".
 *
 * Kept at module scope, matching the other six flipped heroes.
 *
 * This set is the outlier, and the reason is worth writing down before someone
 * "balances" it. `heart` is 5 characters and `authenticity` is 12 — a spread of
 * 7, where every other flipped hero sits between 1 and 3 (`/industries` and
 * `/journal` are 1, `/services` and `/case-studies` are 3). The reserved box is
 * therefore pinned at 12 and `align="start"` has up to 7 characters of slack to
 * absorb when `heart` is showing.
 *
 * That slack is invisible here for the same structural reason it is harmless on
 * the others: the animated word is *terminal*, so the unused width always falls
 * to the right of the last word on the line, into the column. Nothing is ever
 * rendered between "with " and the word, which is the property `align="start"`
 * exists to guarantee. Trailing space at the end of a line box has no ink and
 * the lead paragraph below is a block element, so it starts on its own line
 * regardless of how wide the reserved box is.
 *
 * The reservation still pins the line-2 box, and this set keeps the widest
 * swing on the site: 5 (`heart`) to 12 (`authenticity`) visible characters.
 * With the two-line pin below, line 1 is fixed and short and line 2 reads a
 * brief "with " before the reserved box, so the reservation is what holds the
 * h1's right edge stable while the word cycles. `authenticity` is also the
 * single longest word on the site, at 12.
 */
const STORY_WORDS = [
  "purpose",
  "meaning",
  "intention",
  "authenticity",
  "heart",
] as const;

/**
 * About hero — "Building links with purpose".
 *
 * The fourth route on the `/services` hero architecture, and deliberately so:
 * same three per-page opt-ins on the shared `ChildHero` (`canvas="flat"`,
 * `surface="light"`, `columns="even"`), same `HeroPhotoFrame` visual, same
 * eyebrow / H1 / lead / CTA pattern, and the same shared flipper as the other
 * six.
 *
 * `/about` is now the last interior hero on the `columns="even"` split, so the
 * note that used to sit here — that "the other seven interior heroes keep the
 * decorated `1.05/0.95` default" — is no longer true of anything. Every one of
 * the ten interior heroes is on the flat `#fbf9f5` canvas; only the homepage
 * still carries `texture-paper`, and it does so through `HeroFlanked` rather
 * than through `ChildHero` at all.
 *
 * The headline used to be `Gifting reimagined with` + `<HeroEm>purpose</HeroEm>`,
 * so the accent already covered exactly one word. What changed is that "purpose"
 * stopped being *fixed* and became one of five options — which is also what
 * stops this hero reading as `/services`, whose headline has the same
 * "Gifting … with ___" shape. `HeroEm` is no longer imported here for that
 * reason; it is still the accent mechanism on `/contact`.
 *
 * What came out of the previous version of this hero:
 *
 *   `EditorialCollage` was two stacked images in a translucent panel — a 5:4
 *   frame over a square inset, offset by `pb-10 pl-8` so the pair overlapped —
 *   plus a "Human curation / Enterprise discipline, down to the last parcel"
 *   caption and an "Est. 2019" pill. The pill is exactly the floating overlay
 *   the brief asked to clear, and the caption restated the lead. Replaced by a
 *   single photograph in the shared frame.
 *
 *   The stat bar (2019 / 200+ / 99% / 4.9-5) is gone. One of its four figures
 *   was a percentage floating under the copy, and "Est. 2019" had already been
 *   floating in the collage's pill, so the founding year was stated twice in
 *   the old hero. `HeroStatsBar` itself is now dead across the whole site: no
 *   caller passes `stats` to `ChildHero` or `PageHero` any more, so the
 *   component, the prop on both, and `HeroStat` are all unreachable. It is left
 *   in place here because stripping it is a separate pass across `ChildHero`,
 *   `PageHero` and `HeroFramework`.
 *
 *   That left `Image` and the `HeroStat` type unused here; both are removed by
 *   hand because `noUnusedLocals` is off and `tsc` would not flag them.
 *
 * Why `/about-hero.jpg` and not a native-3:2 photograph:
 *
 *   It is already this page's hero photograph, so nothing new is duplicated
 *   anywhere. That ruled out the two 3:2 candidates on the same page —
 *   `about-craft.jpg` belongs to `AboutStory` and `testimonial-portrait.jpg` to
 *   `TeamSpotlight`, both of which sit further down `/about` — and it ruled
 *   out borrowing a fourth photo from another route's grid, which is what the
 *   `/pricing` hero had to do.
 *
 *   It is 3496x2795, a ratio of 1.251. `HeroPhotoFrame` is 3:2, and because
 *   this source is *narrower* than 1.5 rather than wider, `object-cover`
 *   scales to the frame's height and trims width: the full 2795px of height is
 *   retained and about 17% of the width is cut, centred. A wider-than-3:2
 *   source would have lost height instead, which is the expensive direction.
 *
 * `/hero-about.jpg` (900x1125) was the collage's square inset and is now the
 * `/journal` hero photograph — it is referenced, not orphaned. At 0.8 it remains
 * the worst-shaped asset in `public/`, and a 3:2 frame of it keeps barely half
 * its width, which is worth knowing before it is chosen for anything else.
 *
 * `eyebrow="Our story & mission"` is written in sentence case on purpose:
 * `HeroBadge` applies `uppercase`, so it renders as "OUR STORY & MISSION"
 * without the source having to shout.
 */
export function AboutHero() {
  return (
    <ChildHero
      canvas="flat"
      surface="light"
      columns="even"
      eyebrow="Our story & mission"
      title={
        <>
          {/* Forced two-line headline, the same pattern /pricing now uses: the
             `block` span pins line 1 to "Building links" so the h1 is exactly
             two lines with "with [word]" on line 2. That matches the two-line
             /gifts and /industries heads and keeps this hero's bottom edge on
             the shared grid during page switching. Sentence case is the
             site-wide heading rule: only the heading's first word is
             capitalised, and the rotating word set is lowercase. Line 1 is the
             pre-agreed short complement — at 14 characters it sits well inside
             the measure, versus the 20 of "Building connections" — so the
             pinned line cannot wrap. The reserved box (stableLayout +
             align="start") still holds line 2 steady. */}
          <span className="block">Building links</span>
          with{" "}
          <RotatingCubeText
            phrases={STORY_WORDS}
            /* Reserved box, left-aligned face — the exact pairing the other six
               flipped heroes use, and for the same two reasons.

               The reservation pins the wrapper to the widest word so the h1's
               line breaks cannot move as the word changes length, which is what
               would otherwise shift the lead, both CTAs and the photo column
               vertically on a loop. `align="start"` then keeps the slack that
               reservation creates entirely to the right of the word, so it
               attaches flush after "with " with no hole at its left.

               That second job carries more weight here than on any other hero:
               this word set spans 5 to 12 characters, so without `align="start"`
               "heart" would sit in the middle of a 12-character box with ink on
               both sides of it. See the note on `STORY_WORDS`.

               No timing props: these are the component's defaults, which are the
               homepage hero's cadence, so all seven flipped heroes animate on
               the same 4s hold / 0.7s flip / cubic-bezier(0.16, 1, 0.3, 1).
               `whitespace-nowrap` matches the homepage's own call site. */
            stableLayout
            align="start"
            className="whitespace-nowrap"
          />
        </>
      }
      description="We are on a mission to humanize corporate gifting—combining global logistics with curated care to make every moment memorable."
      actions={[
        {
          href: "/contact",
          label: "Get in touch",
          variant: "primary",
        },
        {
          /* Kept on `/services`, which is where "our solutions" actually live —
             the four-solution tab explorer sits on that page. Only the label
             changed, from "Explore our services" to the requested "View our
             solutions"; the destination was already correct. */
          href: "/gifts",
          label: "View our solutions",
          variant: "secondary",
        },
      ]}
      visual={
        <HeroPhotoFrame
          src="/about-hero.jpg"
          alt="A Fulfill Nest curator carefully finishing a corporate gift box"
          preload
          /* Same hover zoom as the /gifts hero (1.05, 500ms ease-out, clipped
             by the frame's overflow-hidden). This source is narrower than 3:2
             (1.251), so the existing crop already trims width, centred; the
             uniform scale reveals a little of every edge without pushing the
             subject out of frame. */
          hoverZoom
        />
      }
    />
  );
}
