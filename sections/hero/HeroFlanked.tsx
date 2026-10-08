import { ClientLogoMarquee } from "@/sections/ClientLogoStrip";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { HeadingFountain } from "@/sections/hero/HeadingFountain";
import { CountUp } from "@/components/ui/CountUp";

const bandStats = [
  {
    value: "99%",
    label: "On-time doorstep delivery",
  },
  {
    value: "₹1.2 Cr+",
    label: "Value of rewards & hampers dispatched",
  },
  {
    value: "5,000+",
    label: "Curated boxes delivered with zero damage",
  },
  {
    value: "48h",
    label: "Turnaround from brief to shortlisted gift deck",
  },
];

const HERO_CYCLE_PHRASES = [
  "spark delight",
  "fuel retention",
  "build bonds",
  "inspire teams",
] as const;

/**
 * Centred editorial hero — premium publication, not a tech landing page.
 *
 * A warm cream/champagne canvas with a fine paper-grain texture replaces the
 * generative glow backdrop entirely. The copy leads with an italic brick-red
 * accent on the impact words (the shared `accent-em` utility) over crisp
 * high-contrast sans body text, the
 * dual CTAs stay centred and grounded, and social proof — the 4.9/5 star row
 * and the anchored metrics bar — carries the credibility beneath the
 * statement.
 *
 * Below the copy, the anchored proof bar is re-centred: symmetric 4-up grid
 * on `max-w-5xl` with every stat text-centered and balanced stone dividers
 * between the metrics on desktop.
 *
 * ── Entrance: two elements, not seven ──────────────────────────────────
 * Only the headline and the subheadline animate, and they do it through ONE
 * `.heading-enter` wrapper. That is the same mechanism the "Curated Gifting
 * Catalog" heading on /gifts gets from `SectionHeading enterOnLoad`, so this
 * hero now opens with the house 0.6s / cubic-bezier(0.21, 0.47, 0.32, 0.98)
 * rise and the 100ms child stagger instead of an entrance of its own.
 *
 * The eyebrow, the CTAs, the rating row, the client marquee and the metrics
 * band are deliberately STATIC. Each previously carried `hero-entrance` on a
 * cascading 0.2s -> 1.05s delay, so seven separate rises stacked down the
 * page and the section assembled itself piece by piece — busy and mechanical.
 * With the cascade gone, everything below the subheadline is simply present
 * at first paint.
 *
 * `.heading-enter` animates its DIRECT children, which is why the wrapper is
 * wrapped around exactly the two elements meant to move: the desktop
 * composition (child 1, 0ms) and the mobile composition (child 2, 100ms).
 * Only one of the two is displayed at any viewport, so the house 100ms
 * stagger now separates two breakpoint halves rather than headline from lead —
 * see the note at the call site for what that costs the lead's own timing.
 * Both halves render an `<h1>`, and `HeadingFountain` renders the desktop
 * one, so the headline rides its block's rise rather than needing a marker of
 * its own.
 *
 * ── One hero, two compositions, split at `md` ───────────────────────────
 * Below 768px the hero does not shrink the desktop layout — it swaps it.
 * `hidden md:block` keeps the fountain composition (hover burst, three
 * `nowrap` lines, the flipper's reserved box) exactly as it is on the widths
 * where all three can hold. `block md:hidden` gives phones their own: a gift
 * marquee scrolling left-to-right, the enlarged heading and lead in a padded
 * block (`my-6 py-8`), then a second marquee of five DIFFERENT gifts scrolling
 * right-to-left. Both strips run on one linear `repeat: Infinity` transform
 * loop with a gradient mask on their edges, and the mobile wrapper carries
 * `overflow-hidden` so the `w-max` track can never push the document
 * sideways — the section stays `overflow-visible` because the desktop
 * fountain needs it.
 *
 * The mobile h1 is deliberately NOT the desktop h1 re-classed. Its three
 * lines are `white-space: nowrap` and its flipper reserves its longest
 * phrase, so at a scaled-up 30-36px both would run past a 375px viewport;
 * the phone heading is instead one balancing line of copy with the same
 * sentence and a static `accent-em` where the flipper sits.
 *
 * The metrics band is also why `CountUp` is passed no `delay`. It used to be
 * invisible until t = 1.7s (0.8s delay + 0.9s rise), and the count had to be
 * held back so it did not play out behind the fade. The band is now opaque on
 * the first frame, so the count starts on the first frame too — a `delay` here
 * would be dead time spent showing zero.
 *
 * `heading-enter` is a plain CSS animation: no JS, no observer, nothing to go
 * wrong if hydration is slow. `data-reveal-exempt` on the section keeps the
 * scroll observer off the whole subtree either way, and under
 * `prefers-reduced-motion` the wrapper's children snap to
 * `opacity: 1; transform: none`.
 *
 * ── Static unified scroll plane ────────────────────────────────────────
 * Copy, CTAs, rating, client marquee and the metrics grid all live in one
 * normal-flow container. No child receives a scroll-linked translate, so
 * vertical rhythm stays fixed from first paint through the entire scroll.
 */
export function HeroFlanked() {
  return (
    <section
      aria-labelledby="hero-heading"
      data-reveal-exempt
      className="hero-canvas relative z-10 flex min-h-[90vh] flex-col items-center justify-start overflow-visible bg-canvas texture-paper pt-24 pb-16 text-center md:pt-32 md:pb-20 lg:pt-36"
    >
      {/* `min-h-[90vh]` expands the section's vertical footprint (~+15%).
          `pt-24 md:pt-32 lg:pt-36` is the whole hero's downward offset — the
          full stack (eyebrow, H1, CTAs, rating, marquee, stats) shifts down
          ~25% as one block for breathing room under the floating `z-50`
          header, and `pb-16 md:pb-20` closes the band with a balanced
          bottom. The flex/text utilities only centre the single content
          container — its own `w-full` keeps it at `max-w-[90rem]` rather
          than shrink-to-fit under `items-center`. */}

      {/* Ambient backdrop — a static bleed with no scroll-linked transform. */}
      <div
        aria-hidden="true"
        /* The ambient field overhangs the section on every side (7rem
           vertically, 2rem horizontally). The section used to clip this
           layer at its own top edge — which sat exactly on the floating
           header's mid-line — and the sage crown, arriving at full
           strength right at that boundary, drew a hard 1px colour step
           across the top viewport. Bleeding the field means the overflow
           clip now lands above the document top and below the fold, where
           it can never be seen, and the wash is free to hold the page
           cream through the entire header band. */
        className="pointer-events-none absolute -inset-x-8 -inset-y-28 overflow-hidden"
      >
        {/* Continuous canvas — one soft multi-stop ramp, flat page cream
            through the top viewport, easing into the warm/sage plate and
            back to cream before the section ends. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "var(--background-image-hero-canvas-wash)",
          }}
        />
        {/* Sage daylight, top-right — reads as soft daylight. The gradient
            hits zero alpha at 88% of its radius, so this div has no
            geometric edge for the bleed container to cut through. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "var(--background-image-hero-canvas-sage)",
          }}
        />
        {/* Warm ambient glow, bottom-left — grounds the plate */}
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-accent-500/[0.04] blur-3xl" />
        {/* Fine-line ribbon flourish — quiet line art echoing the plate's
            ribbon, so the backdrop has a motif of its own. Given its own
            wrapper inset by the bleed amount on top and bottom, so it is
            cropped to the section box exactly as before rather than to the
            wider ambient field. */}
        <div className="absolute inset-x-8 top-28 bottom-28 overflow-hidden">
          <svg
            viewBox="0 0 200 120"
            fill="none"
            className="absolute left-[3%] top-14 hidden h-32 w-48 text-accent-600/20 lg:block"
          >
            <path
              d="M8 96 C 44 88, 60 18, 104 22 S 172 84, 194 54"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Clearance lives on the section itself (`pt-24 md:pt-32 lg:pt-36`
          + `min-h-[90vh]`), so the hero's content stack is pushed down as
          one block. `pb-16 md:pb-20` lives there too. Only the horizontal
          gutters remain on this container. */}
      <div className="relative z-10 mx-auto w-full max-w-[90rem] overflow-visible px-5 sm:px-8">
        {/* All hero content shares one static, normal-flow scroll plane. Top
            clearance lives on the section (`pt-24 md:pt-32 lg:pt-36`), so
            this wrapper carries no padding of its own. */}
        <div className="hero-content flex flex-col items-center overflow-visible text-center">
          <div className="mx-auto w-full max-w-5xl text-center">
            {/* The entrance. `.heading-enter` animates its direct children —
                one composition per breakpoint. The other half is `display: none`,
                so only one ever rises. */}
            <div className="heading-enter">
              {/* ── Desktop, `md` and up: the hover fountain. ────────────────
                  The red italic rotating phrase now sits on its own line so
                  the three-line composition stays stable while the cube flips. */}
              <div className="hidden md:block">
                <div className="flex flex-col items-center gap-y-0 text-center">
                  {/* Grouped eyebrow + headline block, tight to the description. */}
                  <div className="flex flex-col items-center gap-y-1 mb-2 mt-2 md:mb-3 md:mt-3">
                    <p className="relative z-10 m-0 p-0 leading-normal text-eyebrow uppercase text-eyebrow-gray">
                      Corporate rewards &amp; recognition, crafted for people
                    </p>

                    <HeadingFountain>
                      <h1
                        id="hero-heading"
                        /* Standard shared site heading typography — the exact
                           `text-display-xl text-charcoal` token used by the
                           About/Pricing/Explore heroes (HeroShell, Hero,
                           ChildHero). The local `hero-heading-title` clamps
                           are gone so every page h1 renders identically. */
                        className="relative z-10 m-0 mx-auto p-0 text-display-xl text-charcoal"
                      >
                        <span className="block">Reward programmes that</span>
                        <span className="block accent-em">
                          <RotatingCubeText
                            phrases={HERO_CYCLE_PHRASES}
                            stableLayout
                          />
                        </span>
                        <span className="block m-0 p-0">and deliver real impact</span>
                      </h1>
                    </HeadingFountain>
                  </div>

                  <p className="relative z-10 mt-0 mb-0 mx-auto max-w-xl p-0 pt-0 leading-relaxed text-body-lg text-taupe md:text-xl">
                    Delight your team, elevate employee retention, and celebrate
                    company milestones with Fulfill Nest—thoughtfully curated
                    corporate gifting with end-to-end execution across India.
                  </p>
                </div>
              </div>

              {/* ── Mobile, below `md`: clean stacked copy only. The rotating
                  red italic phrase sits on its own line; no floating gift
                  marquees or decorative PNG wrappers render on small screens. */}
              <div className="block md:hidden">
                <div className="flex flex-col items-center gap-y-0 text-center">
                  {/* Grouped eyebrow + headline block, tight to the description. */}
                  <div className="flex flex-col items-center gap-y-1 mb-2 mt-2 md:mb-3 md:mt-3">
                    <p className="relative z-10 m-0 p-0 leading-normal text-eyebrow uppercase text-eyebrow-gray">
                      Corporate rewards &amp; recognition, crafted for people
                    </p>

                    <h1
                      /* Same standardized `text-display-xl` typography as the
                         desktop composition and the other page heroes. */
                      className="m-0 mx-auto p-0 text-display-xl text-charcoal"
                    >
                      <span className="block">Reward programmes that</span>
                      <span className="block accent-em whitespace-nowrap">
                        <RotatingCubeText
                          phrases={HERO_CYCLE_PHRASES}
                          stableLayout
                        />
                      </span>
                      <span className="block m-0 p-0">and deliver real impact</span>
                    </h1>
                  </div>

                  <p className="m-0 mt-0 mb-0 mx-auto max-w-xl p-0 pt-0 leading-relaxed text-body-lg text-taupe">
                    Delight your team, elevate employee retention, and celebrate
                    company milestones with Fulfill Nest—thoughtfully curated
                    corporate gifting with end-to-end execution across India.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA, rating and client marquee share one fixed flex column;
                their spacing stays identical throughout the scroll. Static —
                these are present at first paint, they do not enter. */}
            <div className="hero-cta-social-proof-group relative z-10 mt-6 w-full">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ButtonLink href="/contact" variant="solidAccent">
                  Book a consultation
                </ButtonLink>
                <ButtonLink href="/gifts" variant="secondary">
                  Explore corporate gifting
                  <ArrowRightIcon className="h-4 w-4" />
                </ButtonLink>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div
                  className="flex items-center gap-1 text-amber-400"
                  aria-label="Rated 4.9 out of 5"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.2l5.9-.8L12 3z" />
                    </svg>
                  ))}
                </div>
                <p className="text-center text-sm text-walnut">
                  <strong className="font-semibold text-charcoal">4.9/5</strong>{" "}
                  — trusted by{" "}
                  <strong className="font-semibold text-charcoal">
                    200+ HR &amp; CXO teams
                  </strong>
                </p>
              </div>

              <div className="w-full">
                <ClientLogoMarquee />
              </div>
            </div>
          </div>
        </div>

        {/* Anchored proof bar — symmetric, centred metrics with balanced
            dividers between the four columns on desktop. Static surface: the
            band no longer carries `hero-entrance`, so it is opaque from the
            first frame. */}
        <dl className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-x-8 gap-y-10 text-center md:mt-8 md:grid-cols-4 md:gap-0">
          {bandStats.map((stat) => (
            <div
              key={stat.label}
              className={`text-center md:border-r md:border-stone-200/80 md:px-4 lg:px-6 last:border-r-0`}
            >
              <dt className="font-grotesk text-3xl font-bold tracking-tight tabular-nums text-brand-green-700 sm:text-4xl">
                {/* No `delay`. The band is opaque on the first frame now, so
                    the count starts on the first frame; the prop existed only
                    to keep the count from playing out behind the 1.7s fade
                    that used to run here. */}
                <CountUp value={stat.value} />
              </dt>
              <dd>
                <p className="mt-2 text-sm font-medium text-walnut">
                  {stat.label}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
