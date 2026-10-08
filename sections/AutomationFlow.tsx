import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  CheckIcon,
  SparklesIcon,
  TruckIcon,
  UserCheckIcon,
} from "@/components/ui/Icons";

/** The three HRIS sources the brief names, in reading order. */
const SOURCES = ["Workday", "BambooHR", "Rippling"];

/** The two fulfilment outcomes, phrased as completed events. */
const OUTCOMES = ["Welcome Kit Sent", "Anniversary Box Shipped"];

/**
 * A single connector between two nodes, in both orientations.
 *
 * ONE markup instance serves the whole diagram, which is why this component
 * carries both an `h` and a `v` path rather than being rendered twice per
 * breakpoint. A rendered-twice connector would be harmless (they are `aria-hidden`
 * and purely decorative) but a rendered-twice *node* would duplicate the brand
 * names in the accessibility tree and in the served HTML, so the single-instance
 * layout below is the constraint that shaped this: DOM order is
 * source -> connector -> engine -> connector -> outcomes, and CSS alone changes
 * whether that reads as a row or a column.
 *
 * The two paths are the same cubic S-curve rotated 90 degrees, so a phone and a
 * desktop draw the same gesture rather than a different-looking diagram.
 *
 * `stroke-dasharray` is set per layer in `app/globals.css`, not here, because
 * the dash period has to stay locked to the `stroke-dashoffset` keyframe travel
 * for the loop to be seamless. Keeping one number in one file is what stops the
 * particles from visibly jumping at the end of a cycle.
 */
function Connector({ orientation }: { orientation: "h" | "v" }) {
  return (
    <div className="flex items-center justify-center md:self-center">
      {/* Horizontal: 120px column by 40px tall, so the path's endpoints land
          exactly on the left and right edges of the grid cell — which are also
          the edges of the two node cards. No overlap maths needed. */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 120 40"
        className="hidden h-10 w-[120px] md:block"
      >
        <path className="flow-connector-base" d="M2 20 C 34 4 86 36 118 20" />
        <path
          className="flow-particle flow-particle--lead"
          d="M2 20 C 34 4 86 36 118 20"
        />
        <path
          className="flow-particle flow-particle--echo"
          d="M2 20 C 34 4 86 36 118 20"
        />
      </svg>

      {/* Vertical: 40px by 96px, the same curve on its side. 96 rather than 120
          so a phone does not spend 120px of vertical scroll on an empty gap. */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 40 96"
        className="h-24 w-10 md:hidden"
      >
        <path className="flow-connector-base" d="M20 2 C 4 34 36 62 20 94" />
        <path
          className="flow-particle flow-particle--lead"
          d="M20 2 C 4 34 36 62 20 94"
        />
        <path
          className="flow-particle flow-particle--echo"
          d="M20 2 C 4 34 36 62 20 94"
        />
      </svg>
    </div>
  );
}

/**
 * Zero-touch automation flow — a code-native vector diagram of an HRIS event
 * becoming a shipped gift, sitting after the integration marquee and before
 * "The human side of rewards".
 *
 * PURE CSS AND SVG, no library. There is no framer-motion here (none is
 * permitted in-section) and `lucide-react` is still not a dependency, so the
 * glyphs are the house set in `components/ui/Icons.tsx` and everything moving is
 * a `@keyframes` rule in `app/globals.css`.
 *
 * WHY THREE NODES AND TWO CONNECTORS RATHER THAN A SINGLE ARROW. "We integrate
 * with your HR stack" is the marquee's claim; this section's claim is that
 * nobody on the client's side has to do anything. That is only legible if the
 * reader can see the *hand-off*, so the diagram is a left-to-right chain —
 * event source, engine, shipped outcome — and the particles run along it. A
 * single arrow between two boxes would only say "connected", which the marquee
 * above already says.
 *
 * LAYOUT. `md:items-stretch` rather than `items-center` is deliberate: all
 * three node cards must end up the SAME height, or the 40px connector — which
 * is centred inside its own cell — would point at the vertical centre of a grid
 * row rather than at the centre of the node beside it, and the diagram would
 * read as misaligned. `md:self-center` on the connector is what puts the curve
 * back on the cards' centre line.
 *
 * RESPONSIVE. Below `md` the grid is a single column and the DOM order already
 * reads top-to-bottom, so no `order-*` is needed and no markup is duplicated.
 * The connectors swap orientation by swapping which of their two paths is
 * `display: none` — SVG elements honour `display`, so Tailwind's `hidden` /
 * `md:hidden` work on a `<path>` exactly as they do on a `<div>`.
 *
 * THE PULSE ARITHMETIC, since the ring is sized to avoid the card edge rather
 * than by eye. The disc container is 144px (`h-36`). The rings are `inset-0`
 * with `border-2`, so each ring is 144px including its border — a radius of
 * 72px. The keyframe peaks at `scale(1.12)`, giving 161px and a radius of
 * 80.6px. The engine card is ~380px wide and ~250px tall inside its grid
 * column, so half-heights of ~190px and ~125px both clear 80.6px with room
 * spare, and the ring never touches the card border or the connectors. At
 * `scale(1)` the ring sits 24px outside the 96px engine disc, which is the gap
 * that makes it read as a halo rather than as a second border.
 *
 * TWO RINGS, NOT ONE, at half a cycle apart, so there is always a ring at some
 * point in its expansion. One ring would blink dark for half of every cycle.
 *
 * ENTRANCES. `SectionHeading` is used unmodified, so the heading carries
 * `data-reveal-header` and reveals on scroll like every other section. The
 * diagram itself carries NO reveal marker, and that is a hard constraint rather
 * than a stylistic choice: `.reveal-on-scroll` is unlayered `opacity: 0`, it
 * would land on the very `<svg>` elements whose children animate `opacity` and
 * `transform`, and the two would fight. The particles and the pulse are
 * continuous ambient loops, not entrances, exactly as on the marquee above.
 *
 * NO CTA. The brief asks only for the diagram, and the marquee immediately above
 * already carries "Explore Integrations" to `/contact`. A second button under an
 * adjacent section with the same audience and the same destination would be
 * noise.
 */
export function AutomationFlow() {
  return (
    <section
      id="zero-touch-automation"
      aria-labelledby="zero-touch-automation-heading"
      className="texture-linen relative w-full overflow-hidden border-y border-section-divider bg-bg-canvas py-section"
    >
      {/* One soft sage wash, bottom-left, matching the orbs on the marquee above
          so the two adjacent sections share a light direction. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-brand-green-900/[0.05] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          id="zero-touch-automation-heading"
          align="center"
          eyebrow="How it flows"
          title={
            <>
              Zero-Touch Automated{" "}
              <em className="accent-em">Gifting</em>
            </>
          }
          description="Your HRIS triggers the milestone. We handle the rest automatically."
        />

        <div
          role="group"
          aria-label="How an HR event becomes a delivered gift: the HR system detects the milestone, the Fulfill Nest Core Engine curates and ships it."
          className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1.05fr)_120px_minmax(0,1fr)] md:items-stretch md:gap-0"
        >
          {/* ── Node 1 · HRIS source ───────────────────────────────────── */}
          <div className="flex flex-col rounded-card border border-charcoal/10 bg-white p-6 shadow-[0_10px_30px_rgb(28_25_23/0.05)]">
            <p className="flex items-center gap-2 text-eyebrow uppercase text-eyebrow-gray">
              <UserCheckIcon className="h-4 w-4 text-accent-700" />
              HRIS source
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {SOURCES.map((name) => (
                <li
                  key={name}
                  /* Same pill the marquee uses, minus the hover lift: these are
                     not links, and a lift on a non-interactive element is a lie
                     about what clicking it will do. */
                  className="flex items-center gap-2.5 rounded-pill border border-charcoal/10 bg-surface-muted py-1.5 pl-1.5 pr-4"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest-soft text-[10px] font-bold leading-none text-brand-green-700 ring-1 ring-inset ring-charcoal/[0.06]"
                  >
                    {name.charAt(0)}
                  </span>
                  <span className="whitespace-nowrap font-display text-sm font-semibold text-charcoal">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-5 text-sm text-taupe">
              A new hire, a work anniversary, a birthday — logged by your system,
              not by you.
            </p>
          </div>

          <Connector orientation="h" />

          {/* ── Node 2 · Core engine ───────────────────────────────────── */}
          <div className="flex flex-col items-center justify-center rounded-card border border-charcoal/10 bg-white p-6 text-center shadow-[0_10px_30px_rgb(28_25_23/0.05)]">
            <div className="relative grid h-36 w-36 place-items-center">
              {/* Half a cycle apart, so a ring is always mid-expansion. */}
              <span
                aria-hidden="true"
                className="flow-pulse-ring absolute inset-0 rounded-full border-2 border-accent-700/45"
              />
              <span
                aria-hidden="true"
                className="flow-pulse-ring flow-pulse-ring--echo absolute inset-0 rounded-full border-2 border-accent-700/45"
              />
              <span className="relative grid h-24 w-24 place-items-center rounded-full border border-charcoal/10 bg-surface shadow-[0_10px_30px_rgb(28_25_23/0.07)]">
                <SparklesIcon className="h-9 w-9 text-accent-700" />
              </span>
            </div>
            <p className="mt-5 font-display text-base font-semibold text-charcoal">
              Fulfill&nbsp;Nest Core Engine
            </p>
            <p className="mt-2 text-sm text-taupe">
              Detects the event, matches the recipient, curates the gift and
              hands it to fulfilment.
            </p>
          </div>

          <Connector orientation="h" />

          {/* ── Node 3 · Outcomes ──────────────────────────────────────── */}
          <div className="flex flex-col rounded-card border border-charcoal/10 bg-white p-6 shadow-[0_10px_30px_rgb(28_25_23/0.05)]">
            <p className="flex items-center gap-2 text-eyebrow uppercase text-eyebrow-gray">
              <TruckIcon className="h-4 w-4 text-accent-700" />
              Outcomes
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {OUTCOMES.map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-pill border border-charcoal/10 bg-surface-muted py-1.5 pl-4 pr-4"
                >
                  <CheckIcon className="h-4 w-4 shrink-0 text-brand-green-700" />
                  <span className="font-display text-sm font-semibold text-charcoal">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-5 text-sm text-taupe">
              Both dispatched without an email, a form, or a single person on
              your team lifting a finger.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
