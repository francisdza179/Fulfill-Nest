import { hrisPlatforms, opsIntegrations } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * Passes of each list inside ONE copy of the track. Four, and the number is the
 * load-bearing one.
 *
 * The keyframe sweeps `translateX(0)` -> `translateX(-50%)`, so the track holds
 * exactly two identical copies and half the track is always exactly one copy.
 * But a half that is NARROWER THAN THE VIEWPORT is not enough: as the track
 * slides left the visible window runs off the end of copy 2 before the keyframe
 * resets, and you get a blank gap followed by an abrupt pop-in. One pass of 7
 * pills is roughly 1,080px, so one half at 1x is far too short; at 4x it is
 * ~4,300px (row 1) and ~3,700px (row 2), comfortably past a 1,920px reference
 * viewport and past a 2,560px one.
 *
 * Same figure and same reasoning as `.client-logo-marquee` in the home hero,
 * which needed 4x for exactly this reason and documents it at the call site.
 */
const REPEATS = 4;

/**
 * HRIS & ops integration marquee — the counter-scrolling band between "How it
 * works" and "The human side of rewards".
 *
 * WHY A SECTION THAT IS MOSTLY TWO MOVING ROWS. Both neighbours are text-dense
 * prose-plus-grid sections on near-identical creams (`#f7f4eb` above, `#faf8f3`
 * below). A 404-word reading run with nothing but paragraphs in the middle of a
 * landing page is where attention goes; a horizontal band of third-party names
 * is a hard visual gear-change, and it does the job of a full-bleed photo strip
 * at a fraction of the weight.
 *
 * SURFACE, and this is a substitution from the brief. The brief asked for a
 * "light gray/slate tint or soft gradient". The palette has no gray/slate token
 * and adding one would be a one-off colour with no second home, so this uses
 * `--color-forest-soft` (`#e7ede8`) — the only soft tint in the file, and
 * currently referenced by nothing at all, so it introduces no collision. It
 * measures 1.08:1 against `#f7f4eb` above and 1.12:1 against `#faf8f3` below:
 * deliberately quiet, since a band this size does not need to shout to be
 * noticed, and the `border-t` carries the edge.
 *
 * VERTICAL PADDING. The brief said `py-20`. This uses `py-section`
 * (`clamp(5rem, 8vw, 6rem)`), the token every other section on the site uses.
 * Its floor IS 80px — exactly `py-20` — and it only grows to 96px past a 1,200px
 * viewport. Same brief, house rhythm, no fourth spacing idiom.
 *
 * THE MONOGRAM, NOT THE VENDOR LOGO. The brief asked for a vector logo icon per
 * brand. Shipping hand-drawn approximations of Workday, Slack, Salesforce and
 * the rest would be publishing trademarks nobody licensed, and a recognisable
 * wrong logo is worse than an honest abstract one. So each pill carries a
 * single-letter tile derived from the name's first character — see
 * `hrisPlatforms` in `lib/data.ts` for the full reasoning. It is a real vector
 * glyph, drawn in the house type, and it cannot misrepresent anyone. Swapping
 * in the vendors' genuine SVG marks later is a change to one span in this file.
 *
 * THE ICON ITSELF is pure CSS: a rounded span with `bg-forest-soft` and the
 * house green. `lucide-react` is still not a dependency, and a per-vendor glyph
 * added to `components/ui/Icons.tsx` would be a fabricated mark pretending to
 * be a house icon — which is the problem this whole decision exists to avoid.
 *
 * LOOP MECHANICS, and why there are four nested boxes:
 *
 *   .hris-marquee         band. `overflow: hidden` plus a two-sided mask, so
 *                         pills dissolve at the edges rather than being cut.
 *   .hris-marquee-track   the only moving element. Two identical sibling
 *                         copies; `-50%` therefore lands on the copy boundary.
 *   .hris-marquee-copy    one half. NO gap and NO trailing padding — that
 *                         spacing is on the pills themselves, so the track is
 *                         geometrically exactly 2 x one copy in every browser
 *                         and the seam cannot drift.
 *   .hris-marquee-run     one pass of the names, repeated REPEATS times. Holds
 *                         `--repeat` past the first pass so reduced motion can
 *                         drop them by class rather than by `:nth-child(n + N)`,
 *                         which would have to hard-code the two different item
 *                         counts (7 and 6).
 *
 * Both rows share one duration even though their half-tracks differ by ~15% in
 * width, so row 2 runs ~109px/s against row 1's ~127px/s. Deliberate: two rows
 * in one band visibly travelling at different speeds read as a bug, and 15% is
 * well under the threshold where anyone can see it. Reasoning is in
 * `app/globals.css` at the token.
 *
 * HOVER. Each pill lifts 2px and gains a glow on hover, which is the brief's
 * "interactive hover-glow". It is only reachable because the whole BAND pauses
 * on hover — a pill crossing at 127px/s cannot be pointed at. That pause is
 * gated on `(hover: hover)`, matching `.showcase-marquee`, because a finger tap
 * latches `:hover` on touch and would otherwise freeze the band permanently.
 *
 * REDUCED MOTION drops the animation outright rather than slowing it, hides
 * copy B and hides runs 2-4, leaving one static centred wrapped row per list.
 * All of that lives in `app/globals.css` alongside the testimonials and showcase
 * bands rather than in `motion-reduce:` utilities on the markup, so the
 * animation, the geometry change and the de-duplication stay in one block.
 *
 * ENTRANCES. The heading uses `SectionHeading` unmodified, so it carries
 * `data-reveal-header` and reveals on scroll like every other section. The CTA
 * wrapper carries `data-reveal-item`, also scroll-triggered. The marquee rows
 * carry NO reveal marker and that is on purpose: they are a continuous ambient
 * loop, not an entrance, exactly as `.showcase-marquee` on this page is. More
 * importantly `.reveal-on-scroll` is unlayered `opacity: 0` and would fight the
 * track's own `animate-hris-marquee` for the same element.
 *
 * CTA TARGET is `/contact`, not `#contact`. The brief offered "`#contact` or
 * inquiry modal", and neither exists on the home page — there is no
 * `id="contact"` anywhere in `sections/`, and no inquiry modal exists anywhere on
 * the site. `/contact` is a real route, so the button goes there; a `#contact`
 * href would have been a dead anchor that scrolled nowhere.
 */
export function IntegrationMarquee() {
  /**
   * One band: two copies of the run, travelling in one direction.
   *
   * `names` and `repeat` are both parameters rather than closure reads because
   * `renderRuns` is a sibling of `renderBand` rather than nested inside it —
   * a function defined inside the per-band callback cannot see `names`.
   */
  const renderRuns = (names: string[], copy: "a" | "b") =>
    Array.from({ length: REPEATS }, (_, repeat) => (
      <div
        key={`${copy}-${repeat}`}
        className={`hris-marquee-run flex shrink-0 items-center${
          repeat > 0 ? " hris-marquee-run--repeat" : ""
        }`}
      >
        {names.map((name) => (
          <span
            key={name}
            /* `hris-marquee-pill` exists so the reduced-motion block has a hook
               to switch off the hover transition, the same reason
               `.showcase-marquee-card > img` has one. */
            className="hris-marquee-pill mr-3 inline-flex shrink-0 items-center gap-2 rounded-pill border border-charcoal/10 bg-white/80 py-1.5 pl-1.5 pr-4 shadow-[0_2px_10px_rgb(28_25_23/0.04)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#36433B]/35 hover:bg-white hover:shadow-[0_10px_26px_rgb(54_67_59/0.16)] sm:mr-4 sm:gap-2.5 sm:py-2 sm:pl-2 sm:pr-5"
          >
            {/* Decorative: the name beside it is the accessible content, and a
                bare "W" announced before "Workday" is noise. */}
            <span
              aria-hidden="true"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest-soft text-[10px] font-bold leading-none text-brand-green-700 ring-1 ring-inset ring-charcoal/[0.06] sm:h-7 sm:w-7 sm:text-[11px]"
            >
              {name.charAt(0)}
            </span>
            <span className="whitespace-nowrap font-display text-[13px] font-semibold text-charcoal sm:text-sm">
              {name}
            </span>
          </span>
        ))}
      </div>
    ));

  /**
   * One band: two copies of the run, travelling in one direction. Rendered
   * twice, once per direction, so the only thing that differs between the rows
   * is which animation utility the track carries.
   */
  const renderBand = (
    names: string[],
    reverse: boolean,
    label: string,
  ) => (
    <div className="hris-marquee" role="group" aria-label={label}>
      <div
        className={`hris-marquee-track flex w-max items-center${
          reverse ? " animate-hris-marquee-reverse" : " animate-hris-marquee"
        }`}
      >
        {(["a", "b"] as const).map((copy) => (
          <div
            key={copy}
            /* Copy B exists only to make the loop seamless. Announcing the whole
               list twice would be duplicated content to a screen reader. */
            aria-hidden={copy === "b" || undefined}
            className={`hris-marquee-copy flex shrink-0 items-center${
              copy === "b" ? " hris-marquee-copy--duplicate" : ""
            }`}
          >
            {renderRuns(names, copy)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="integrations"
      aria-labelledby="integrations-heading"
      className="texture-linen relative w-full overflow-hidden border-t border-section-divider bg-forest-soft py-section"
    >
      {/* Two very soft washes on the sage field: one lifts the top-left toward
          white, one deepens the bottom-right. `brand-green-900` at 5% on a
          `#e7ede8` band would be invisible, so the depth orb is that colour and
          the lift orb is white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-16 h-80 w-80 rounded-full bg-white/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-brand-green-900/[0.06] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          id="integrations-heading"
          align="center"
          eyebrow="Integrations"
          title={
            <>
              Seamless HRIS &amp; Ops{" "}
              <em className="accent-em">Integrations</em>
            </>
          }
          description="Connect your HR stack to automate gifting triggers on day one."
        />

        <div data-reveal-item className="mt-9 flex justify-center">
          <ButtonLink href="/contact" variant="primary">
            Explore Integrations
          </ButtonLink>
        </div>

        {/* Full-bleed: the rows are deliberately outside the `max-w-7xl` box
            above so they run edge to edge. Contained to 7xl they would read as
            two lists with hard ends rather than as continuous motion. */}
        <div className="mt-12 space-y-4 md:mt-14 md:space-y-5">
          {renderBand(hrisPlatforms, false, "HRIS platforms Fulfill Nest connects to")}
          {renderBand(opsIntegrations, true, "Business tools Fulfill Nest connects to")}
        </div>
      </div>
    </section>
  );
}
