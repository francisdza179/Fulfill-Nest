import Image from "next/image";

/**
 * The shared hero visual: one 3:2 photograph in a 20px-radius frame, with a soft
 * warm disc glowing behind its top-left corner.
 *
 * Its own file rather than another export inside `HeroFramework` because it is a
 * leaf, not a container — it takes an image and nothing else. Both split heroes
 * that use it (`/services`, `/industries`) are required to render identically,
 * and one definition is what actually guarantees that. A copy per page would
 * drift the first time either was nudged.
 *
 * The geometry, and why each part exists:
 *
 *   3:2       the frame's ratio, chosen because most gift photography is
 *             natively 3:2 and then `object-cover` crops nothing at all. It is
 *             NOT a guarantee for every source, and the direction of the crop
 *             matters more than its size:
 *
 *               source ratio > 1.5  (wider)  ->  fills height, loses WIDTH
 *               source ratio < 1.5  (narrower)->  fills width, loses HEIGHT
 *               source ratio = 1.5           ->  no crop
 *
 *             Losing width trims the sides, which is usually recoverable
 *             composition — a 16:9 source loses ~8% per side when centred,
 *             the cheap direction. Losing height is the expensive direction:
 *             it cuts the top and bottom off a subject, which is what
 *             narrower-than-3:2 sources do. Prefer sources at or just over 1.5.
 *
 *             Current callers: `/images/heroes/services-hero.jpg` is 1.778, so
 *             it fills the frame's height and overflows ~16% of its width,
 *             trimmed ~8% per side when centred — a top-down flatlay grid,
 *             where trimming the sides costs a partial row, not a subject;
 *             `/images/pricing/pricing-hero.jpg` is 1.778 too and crops the
 *             same way, for the same reason;
 *             `/images/industries/industries-hero.jpg` is 1.778 too, but its
 *             subject sits toward the right edge of the source, so it pans the
 *             crop window right (`imagePosition="55% 50%"`) rather than
 *             centring — pushing the contents left inside the frame keeps the
 *             subject clear of the clipped edge;
 *             `/about-hero.jpg` is 1.251, so it fills the width and loses ~17%
 *             of its height, centred.
 *   20px      `rounded-card` is exactly 1.25rem.
 *   hairline  a pale product shot on a near-white canvas has very little edge
 *             contrast of its own; the rim is what stops the frame dissolving
 *             into the background.
 *   disc      a 3:2 photo fills its column, so a backdrop centred behind it
 *             would be entirely invisible. Offset up and left at 72% of the
 *             frame's height, roughly a third of its arc falls outside the
 *             photo on two sides, and it reads as a glow behind the product
 *             rather than a stray shape. `rgba(200,75,49,0.08)` is #c84b31, the
 *             lighter end of the brick-red gradient `ButtonLink` paints its
 *             primary with — a literal for the same reason that one is, since
 *             `--color-copper` is #c2410c, a more orange hue that would pull the
 *             glow off-brand.
 *   shadow    a `filter: drop-shadow`, not a box-shadow, so it is cast from the
 *             photo's own alpha through the radius and follows the 20px corners
 *             instead of drawing a hard rectangle behind them.
 */
export function HeroPhotoFrame({
  src,
  alt,
  sizes = "(max-width: 1024px) 92vw, 48vw",
  preload = false,
  imagePosition,
  hoverZoom = false,
}: {
  src: string;
  alt: string;
  /**
   * The `48vw` half of the default assumes the even 50/50 split, which is what
   * both callers use. A hero on the 1.05/0.95 ratio would want roughly `44vw`.
   */
  sizes?: string;
  /**
   * `preload`, never `priority`. `priority` is deprecated in Next 16 and emits
   * no `loading` attribute at all here, which quietly demotes the hero out of
   * the LCP candidate set — the browser then promotes some lazy image further
   * down the page instead.
   */
  preload?: boolean;
  imagePosition?: string;
  /**
   * Opt-in hover zoom: 500ms ease-out to `scale(1.05)`, clipped by the frame's
   * existing `overflow-hidden`. Passed by the four marketing heroes —
   * `/services`, `/industries`, `/pricing`, `/about`. The `/services` +
   * `/industries` split pair is required to render identically (the reason
   * this file exists, see the note at the top), so `/industries` gained the
   * zoom the same day `/services` did and the invariant is intact.
   *
   * It is a defaulted opt-in rather than a change to the shared markup below
   * because six routes render this component and only these four asked for
   * the zoom: hard-coding it in would have handed the `PageHero` routes
   * (`/journal`, `/faq`) and `not-found` a moving frame none of them want.
   * The `surface`/`columns` opt-ins on `HeroCanvas`/`ChildHero` exist for
   * exactly this reason.
   *
   * The classes themselves are the site-wide reference for this effect and are
   * deliberately character-identical to the other five copies
   * (`ProductShowcaseClient`, `ProductCatalogTabs`, `TestimonialsCarousel`,
   * `IndustriesList`, `PricingCalculator`) so there is one zoom on this site
   * rather than six.
   *
   * (`SolutionsTabs` used to be a copy too; its brief banned all scale, so
   * its gallery frames lost the classes and are not part of the set.)
   *
   * `group-hover:` rather than a bare `hover:` because the trigger is the whole
   * frame, including its 1px ring, not only the photo's own box. The
   * `motion-reduce:` pair is load-bearing: this project's reduced-motion rules
   * are scoped per component with no blanket rule, so without them the 500ms
   * scale animates for exactly the users who asked it not to. Tailwind emits
   * `motion-reduce` after `hover`/`group-hover`, so at equal specificity these
   * win on source order.
   */
  hoverZoom?: boolean;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[12%] -top-[14%] h-[72%] w-[72%] rounded-full bg-[radial-gradient(circle,rgba(200,75,49,0.08)_0%,transparent_70%)]"
      />

      {/* `group` is added only alongside `hoverZoom`, so the five callers that
          do not opt in render exactly the markup they rendered before — the
          class is inert here, but keeping it conditional keeps that promise
          checkable by reading the class list. `overflow-hidden` was already
          present and is what clips the 1.05 scale; without it the photo would
          grow past the rounded corners. */}
      <div
        className={`relative aspect-[3/2] overflow-hidden rounded-card border border-section-divider drop-shadow-[0_20px_30px_rgb(0_0_0/0.08)]${
          hoverZoom ? " group" : ""
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          preload={preload}
          sizes={sizes}
          className={
            hoverZoom
              ? "object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:scale-100"
              : "object-cover"
          }
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      </div>
    </div>
  );
}
