import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { ChildHero } from "@/sections/hero/ChildHero";
import { HeroPhotoFrame } from "@/sections/hero/HeroPhotoFrame";

/**
 * The rotating accent word in "Gifting tailored for your ___".
 *
 * Kept at module scope for the reason `ServicesHero`'s equivalent array is: the
 * literal is compared by value here, not by identity, so a fresh array on every
 * render would not change behaviour — but hoisting it keeps the prop list on
 * the call site to a bare name, and matches how the sibling hero reads.
 *
 * Five, replacing both earlier sets — the original six-word set ("industry /
 * workforce / business / progress / partners / community") and then the
 * five-word "milestones / workforce / industries / community / culture". The
 * original set was deliberately width-matched at 8–9 characters so that no
 * single word could shove the `<h1>` across a line boundary. That constraint is
 * real and still matters, but the current set spans 8–12 — `partnerships` (12)
 * against `industry` and `outcomes` (8) — four characters of slack. At 12,
 * `partnerships` ties `/about`'s `authenticity` for the longest rotating word
 * anywhere on the site.
 *
 * `stableLayout` is what absorbs that, and it absorbs it without the caller
 * doing anything: the component measures every phrase and pins the wrapper to
 * `Math.max(...phraseWidths)`, so the box is sized to `partnerships` and stays
 * constant for the whole loop. Re-measured on resize, on `document.fonts.ready`
 * and off a string signature of the phrase list, so the box is correct on the
 * first paint rather than snapping once measurement lands. The reservation
 * holds the `<h1>`'s line breaks, the lead, the CTAs and the photo column
 * perfectly still while the word flips inside it. `align="start"` then puts all
 * that slack to the right of the word, so it attaches flush after "your " with
 * no hole at its left.
 *
 * Lowercase, because this word is not sentence-initial: the heading reads
 * "Gifting tailored for your ___", so a capital renders "Gifting tailored for
 * your Milestones". Every rotating word on the site is lowercase for the same
 * reason — entries across this hero, `/services`, `/pricing` and `/about`, all
 * of them mid-sentence. The first brief for this list supplied it title-cased
 * and was lowercased for that reason; the current one arrived lowercase and
 * needed no change. The rule stands regardless of how a brief writes it.
 *
 * LOCATION TRAP, because it has now been mis-targeted twice by brief: this
 * array is the HERO's, and the only rotating word on /industries. The
 * "Industries We Serve" section — `sections/IndustriesList.tsx`, the six-card
 * grid — has a static heading with a plain `accent-em` on "operations." and no
 * flipper at all, so there is no array to update there. Both components carry
 * the same `eyebrow="Industries we serve"`, which is almost certainly how the
 * two got confused.
 */
const AUDIENCE_WORDS = [
  "milestones",
  "industry",
  "workforce",
  "partnerships",
  "outcomes",
] as const;

/**
 * Industries hero — "Gifting tailored for your industry".
 *
 * Structurally the same hero as `/services`, and deliberately so: same three
 * per-page opt-ins on the shared `ChildHero` (`canvas="flat"`,
 * `surface="light"`, `columns="even"`), same `HeroPhotoFrame` visual, same
 * eyebrow/H1/lead/CTA pattern, and now the same shared flipper.
 *
 * The headline used to be `Gifting tailored for` + `<HeroEm>your industry</HeroEm>`,
 * so the accent ran across *two* words, "your industry". The flipper carries
 * `accent-em` on its own wrapper, which means the accent is now exactly one
 * word — the rotating one — and "your" has reverted to the h1's own colour and
 * weight. That is why `HeroEm` is no longer imported here; it is still the
 * accent mechanism everywhere else on the site.
 *
 * What came out of the previous version of this hero:
 *
 *   `IndustryPreview` was not a photograph at all — it was a mock dashboard
 *   card listing all six sector names behind a gift icon, wrapped in a
 *   translucent panel with a floating "Policy-safe by design" pill reading
 *   "GST · NDA · audit logs". Replaced by a real studio photograph in the
 *   shared frame, so the right column matches `/services` instead of being the
 *   only hero on the site built from a fake UI.
 *
 *   `heroStats` (06 sectors / 24h dispatch / 100% audit-ready / 99% on-time) is
 *   no longer passed. Two of its four figures were percentages floating under
 *   the copy, which is exactly what the brief asked to clear, and `/services`
 *   had already dropped its equivalent bar so the two heroes read as a pair.
 *   `HeroStatsBar` is still live on About, Contact and Pricing, so this is a
 *   local omission rather than a dead export.
 *
 * That removed the only consumers of the `industries` dataset, `iconMap` and
 * eight icon imports in this file. `IndustriesList` still renders the sector
 * data, so nothing above it lost coverage — the names were never only here.
 */
export function IndustriesHero() {
  return (
    <ChildHero
      canvas="flat"
      surface="light"
      columns="even"
      eyebrow="Industries we serve"
      title={
        <>
          Gifting tailored for your{" "}
          <RotatingCubeText
            phrases={AUDIENCE_WORDS}
            /* Reserved box, left-aligned face — the exact pairing
               `/services` uses, and for the same two reasons.

               The reservation pins the wrapper to the widest word so the h1's
               line breaks cannot move as the word changes length, which is what
               would otherwise shift the lead, the CTAs and the photo column
               vertically on a loop. `align="start"` then keeps the slack that
               reservation creates entirely to the right of the word, so it
               attaches flush after "your " with no hole at its left.

               No timing props: these are the component's defaults, which are
               the homepage hero's cadence, so this hero and `/services` now
               animate on the same 4s hold / 0.7s flip /
               cubic-bezier(0.16, 1, 0.3, 1). `whitespace-nowrap` matches the
               homepage's own call site. */
            stableLayout
            align="start"
            className="whitespace-nowrap"
          />
        </>
      }
      description="Purpose-built fulfilment programmes designed to meet the unique compliance, branding and operational needs of your sector."
      actions={[
        {
          href: "/contact",
          label: "Book a consultation",
          variant: "primary",
        },
        {
          /* Was `/services` under the copy "Explore solutions", which described
             the destination correctly. The new copy says "View industry
             cases", so it now points at `/case-studies` — a real route linked
             from the nav, footer, testimonials and two CTA bands, though it has
             no per-sector filter, so this lands on the full grid rather than a
             pre-filtered one. */
          /* Was `/services` under the copy "Explore solutions", then `/case-studies`
             under "View industry cases". Now `/gifts#curated-catalog` under
             "Browse Gifts", so the CTA lands the reader on the catalogue grid
             itself rather than on a page of case studies about it.

             Cross-page hash, so this needs the target to exist: `id="curated-
             catalog"` is on the `ProductCatalog` section in this same file's
             sibling, and it is the ONLY anchor into that section from outside
             /gifts. `next/link` handles the route change plus the scroll, and
             the smooth behaviour comes free from `scroll-behavior: smooth` in
             globals.css - no JS.

             THE ORPHANING NOTE THAT USED TO SIT HERE IS NOW WRONG, and is
             replaced rather than left to rot. It read: "That leaves
             /case-studies with four other inbound links (CaseStudyTeaser,
             EmotionalPayoff, TestimonialsCarousel, and the footer-adjacent body
             copy), so the route is not orphaned."

             `app/case-studies` has since been DELETED. All four of those links
             have been repointed or removed: steps 03 and 04 of `lib/data.ts`,
             the `TestimonialsCarousel` button (which now says "Book a
             consultation"), and `CaseStudyTeaser` - which turned out to have no
             importer at all and was already dead code. So the route went from
             four inbound links to zero inbound links and then ceased to exist,
             and this hero's third CTA has been `/gifts#curated-catalog` ever
             since, which is why nothing here 404s. */
          href: "/gifts#curated-catalog",
          label: "Browse Gifts",
          variant: "secondary",
        },
      ]}
      visual={
        <HeroPhotoFrame
          /* Real industries photography, supplied for this page: the source
             folder carries `Industries we serve.jpg` (2048x1152, ~198 KB),
             copied in as `public/images/industries/industries-hero.jpg`. It
             replaces the borrowed `/capabilities/custom-packaging.jpg`
             capability shot, which stays on disk — `lib/data.ts` still
             references it for the industry sectors dataset; only the hero
             stops using it.

             On the geometry: 2048x1152 is 1.778, the same family as the
             /services and /pricing heroes, so `object-cover` into the shared
             3:2 frame fills the height and overflows ~16% of the WIDTH,
             trimmed ~8% per side when centred. The subject sits toward the
             right edge of the source, so rather than the centred default the
             crop window pans right (`imagePosition="55% 50%"`): the contents
             shift left inside the frame and keep clear of the clipped side.

             Same hover zoom as the /gifts hero (1.05, 500ms ease-out, clipped
             by the frame's overflow-hidden). `/services` and `/industries`
             must render identically (the reason `HeroPhotoFrame` exists); both
             pass `hoverZoom`, so the pair is identical WITH the affordance. */
          src="/images/industries/industries-hero.jpg"
          alt="Curated corporate gift packaging arranged and ready for dispatch"
          preload
          imagePosition="55% 50%"
          hoverZoom
        />
      }
    />
  );
}
