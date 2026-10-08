import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { ChildHero } from "@/sections/hero/ChildHero";
import { HeroPhotoFrame } from "@/sections/hero/HeroPhotoFrame";

/**
 * The rotating accent word in "Predictable plans with no ___".
 *
 * Kept at module scope, matching `ServicesHero` and `IndustriesHero`.
 *
 * `surprises` and `drawbacks` are 9 characters, `gimmicks` and `friction` are
 * 8, and `markups` is 7 — so the widest is reserved at 9; the order below is
 * the brief's, and all five words are strictly lowercase.
 *
 * This headline is the longest of the three that use the flipper: 26
 * characters of static prefix ("Predictable plans with no ") against
 * `/services`' 23 and `/industries`' 24. The two-line pin at the call site
 * has since made the break explicit — line 1 is fixed at "Predictable
 * plans" and the widest full line 2 ("with no drawbacks", 17 characters)
 * sits well inside the even-column measure, so the reservation keeps the
 * h1's box steady and the pin holds the height.
 */
const SURPRISE_WORDS = [
  "surprises",
  "drawbacks",
  "markups",
  "gimmicks",
  "friction",
] as const;

/**
 * Pricing hero — "Predictable plans with zero surprises".
 *
 * The third route on the `/services` hero architecture, and deliberately so:
 * same three per-page opt-ins on the shared `ChildHero` (`canvas="flat"`,
 * `surface="light"`, `columns="even"`), same `HeroPhotoFrame` visual, same
 * eyebrow / H1 / lead / CTA pattern, and now the same shared flipper on the
 * same terms as `/services` and `/industries`. The other seven interior heroes
 * keep the decorated `1.05/0.95` default.
 *
 * The headline used to be `Predictable plans with` +
 * `<HeroEm>zero surprises</HeroEm>`, so the accent ran across *two* words. The
 * flipper carries `accent-em` on its own wrapper, so the accent is now exactly
 * one word — the rotating one — and "zero" has reverted to the h1's own colour
 * and weight. That is why `HeroEm` is no longer imported here; it is still the
 * accent mechanism everywhere else on the site.
 *
 * `layout="center"` was dropped, and that single deletion is the whole layout
 * change — no shared component was touched. `ChildHero` reads its container
 * class from a ternary chain whose first branch is `centered`, so a centred
 * hero short-circuits before `columns` is ever consulted; `even` was already
 * dead code on this route. Removing the prop lets the chain fall through to the
 * same `grid ... lg:grid-cols-2` branch `/services` and `/industries` take, and
 * the 520px lead comes along with it automatically for the same reason. The
 * copy column and CTA row also lose `items-center text-center` and
 * `justify-center` in favour of `items-start`, which is what a left column
 * wants.
 *
 * What came out of the previous version of this hero:
 *
 *   `PricingPreview` was not a photograph but a fabricated two-card dashboard —
 *   a "No surprise freight lines" panel, a "Itemised and approval-ready"
 *   panel, a fake full-width green progress bar, the overlay text "100%
 *   tax-compliant", and a floating pill reading "Estimate ready within 24
 *   hours". Replaced by a real studio photograph in the shared frame. Every
 *   claim it made is already made in the copy beside it, and the page's real
 *   calculator sits one section below.
 *
 *   `heroStats` (0 hidden per-unit fees / 24h / 100% tax-compliant / 40,000+
 *   orders) is no longer passed. Two of its four figures were percentages
 *   floating under the copy, and the other two are `PricingPreview`'s pill and
 *   overlay restated as a bar. `HeroStatsBar` is still live on About, Contact
 *   and every `PageHero` route, so this is a local omission rather than a dead
 *   export.
 *
 * That removed the only consumers of `CheckIcon`, `ShieldIcon` and the
 * `HeroStat` type in this file. `BudgetCalculator` renders its own much larger
 * interface below, so the pricing page has lost no interactive surface — only
 * the decorative fake one.
 *
 * The primary CTA no longer points at the estimator. It was `href="#estimate"`
 * with the label "Calculate your plan", and is now `href="#memberships-and-
 * plans"` with "View Pricing Plans" — the four-tier `PricingTiers` band
 * instead of `PricingCalculator`'s `id="estimate"`. See the note on the action
 * itself for the consequence: that leaves the estimator with no inbound anchor.
 */
export function PricingHero() {
  return (
    <ChildHero
      canvas="flat"
      surface="light"
      columns="even"
      eyebrow="Transparent pricing"
      title={
        <>
          {/* Forced two-line headline, matching the /gifts and /industries two-
             line heads: a `block` span pins line 1 to exactly "Predictable
             plans", so the h1 is always two lines with "with no [word]" on
             line 2. Without the break, the sentence occasionally resolved to a
             third line at some widths — the reason this hero's bottom edge
             could sit off the shared grid when switching pages. The reserved
             box (stableLayout + align="start") still holds line 2 steady while
             the word cycles. */}
          <span className="block">Predictable plans</span>
          with no{" "}
          <RotatingCubeText
            phrases={SURPRISE_WORDS}
            /* Reserved box, left-aligned face — the exact pairing
               `/services` and `/industries` use, and for the same two reasons.

               The reservation pins the wrapper to the widest word so the h1's
               line breaks cannot move as the word changes length, which is what
               would otherwise shift the lead, the CTAs and the photo column
               vertically on a loop. `align="start"` then keeps the slack that
               reservation creates entirely to the right of the word, so it
               attaches flush after "zero " with no hole at its left.

               No timing props: these are the component's defaults, which are
               the homepage hero's cadence, so this hero, `/services` and
               `/industries` all animate on the same 4s hold / 0.7s flip /
               cubic-bezier(0.16, 1, 0.3, 1). `whitespace-nowrap` matches the
               homepage's own call site. */
            stableLayout
            align="start"
            className="whitespace-nowrap"
          />
        </>
      }
      description="Simple, flexible pricing tiers tailored for companies of all sizes. Pay for what you gift with no hidden kitting fees or unexpected markups."
      actions={[
        {
          /* Order swap, per the hero CTA hierarchy brief: "Book a
             consultation" is the first (left-most) button on the other
             standardised heroes' action rows, so it now leads here too — with
             the primary styling, which it already carries on /gifts,
             /industries and /about. The tiers link steps over to secondary and
             second position. Routing, labels and response are untouched. */
          href: "/contact",
          label: "Book a consultation",
          variant: "primary",
        },
        {
          /* Was `href="#estimate"` under "Calculate your plan". Now
           `#memberships-and-plans` under "View Pricing Plans", which points at
           the four-tier `PricingTiers` band rather than the estimator. Second
           position and secondary variant after the hierarchy reorder.

           The id is on the `PricingTiers` section and is the only inbound
           anchor to it — nothing else on the page linked there. Same-page
           hash, so the browser handles it natively and picks up
           `scroll-behavior: smooth` from globals.css; `scroll-mt-28 md:scroll-
           mt-36` on the target keeps the fixed nav pill from covering the
           heading.

           COST OF THE MOVE, worth knowing: `#estimate` was linked from
           exactly one place on the site and this was it, so the "Live
           estimator" band now has NO inbound anchor anywhere. It is still on
           the page and still reachable by scrolling, but nothing jumps to it.
           If the estimator should keep a jump-in, it needs its own entry
           point — the natural one is the estimator band's own heading, or
           restoring a secondary CTA here. */
          href: "#memberships-and-plans",
          label: "View Pricing Plans",
          variant: "secondary",
        },
      ]}
      visual={
        <HeroPhotoFrame
          /* Real pricing photography, supplied for this page: the source
             folder now carries a JPEG (`Pricing hero image.jpg`, 2048x1152,
             90 KB), copied in as `public/images/pricing/pricing-hero.jpg`. It
             supersedes the 2.35 MB PNG (`corporate-gift-hampers.png`) that had
             itself replaced the borrowed `/catalog/everyday-appreciation-box.jpg`
             product shot. The PNG is left on disk rather than deleted — removing
             public assets is a separate call from pointing a hero at a new file.

             On the geometry: 2048x1152 is 1.778, the same family as the PNG it
             replaces and `/images/heroes/services-hero.jpg`, so `object-cover`
             into the shared 3:2 frame scales to width and loses ~16% of the
             height, centred. A spread flat-lay again, so a band off the top
             and bottom costs air rather than a subject, and `imagePosition`
             stays unset for the default centre crop. */
          src="/images/pricing/pricing-hero.jpg"
          alt="Fulfill Nest corporate gift hampers staged with a price tag, the per-recipient pricing this page sets out"
          preload
          /* Same hover zoom as the /gifts hero (1.05, 500ms ease-out, clipped
             by the frame's overflow-hidden). Safe on this photograph for the
             /gifts reason: it is a flat-lay like the services hero, so the
             scale shows more of the spread rather than reframing a subject.
             The motion-reduce pair ships inside `HeroPhotoFrame`, so
             reduced-motion users keep the still frame. */
          hoverZoom
        />
      }
    />
  );
}
