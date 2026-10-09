import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Shared interior-hero foundation                                   */
/*                                                                     */
/*  Homepage and every child hero now resolve to the same `bg-canvas`     */
/*  token, the same Plus Jakarta Sans hierarchy and the same               */
/*  quiet proof rhythm. Decorative motion is intentionally removed         */
/*  from the shared layer: each page supplies one composed visual      */
/*  sibling rather than several independently floating objects.        */
/* ------------------------------------------------------------------ */

export interface HeroStat {
  value: string;
  label: string;
  note?: string;
}

const TERRA = "#c2410c";
const SAGE = "var(--color-brand-green-700)";

/** A single, static ribbon gesture shared by all interior canvases. */
export function HeroRibbons() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="child-ribbon-terra" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={TERRA} stopOpacity="0" />
            <stop offset="52%" stopColor={TERRA} stopOpacity="0.2" />
            <stop offset="100%" stopColor={TERRA} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="child-ribbon-green" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={SAGE} stopOpacity="0" />
            <stop offset="58%" stopColor={SAGE} stopOpacity="0.16" />
            <stop offset="100%" stopColor={SAGE} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M-140 660 C 200 560, 430 390, 590 160"
          fill="none"
          stroke="url(#child-ribbon-terra)"
          strokeWidth="120"
          strokeLinecap="round"
        />
        <path
          d="M-140 660 C 200 560, 430 390, 590 160"
          fill="none"
          stroke={TERRA}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.12"
        />
        <path
          d="M1580 590 C 1290 520, 1080 400, 945 205"
          fill="none"
          stroke="url(#child-ribbon-green)"
          strokeWidth="98"
          strokeLinecap="round"
        />
        <path
          d="M1580 590 C 1290 520, 1080 400, 945 205"
          fill="none"
          stroke={SAGE}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.12"
        />
        <path
          d="M-100 820 C 430 700, 1000 740, 1540 540"
          fill="none"
          stroke="url(#child-ribbon-green)"
          strokeWidth="54"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}

/**
 * Exact warm child-hero canvas — now driven by the `bg-canvas` token rather
 * than the literal `#F7F4EB` this and the home hero each repeated by hand.
 * Same rendered colour (#f7f4eb), one definition. The ambient field bleeds
 * beyond the section box so the fixed navigation never lands on a clipped
 * gradient edge.
 *
 * All of that field is optional. `decorative={false}` renders the section as a
 * flat, untextured canvas panel with nothing behind the copy — see the prop for
 * why it is per-page rather than a new default. The base colour is chosen
 * separately by `surface`; the two are independent.
 */
export function HeroCanvas({
  children,
  className = "",
  decorative = true,
  surface = "canvas",
  ribbons = true,
}: {
  children: ReactNode;
  className?: string;
  /**
   * When false the section is a flat, untextured canvas panel: no paper
   * grain, no wash, no sage bloom, no blurred copper pool, no ribbons.
   *
   * Defaults to true because that decoration IS the shared interior-hero look
   * and nine other routes are built around it. This is a per-page opt-out for
   * a hero that has been asked to be deliberately bare, not a new site-wide
   * default — flipping the default would restyle every interior route at once.
   */
  decorative?: boolean;
  /**
   * Which warm canvas token paints the section.
   *
   * `"canvas"` is `bg-canvas` (#f7f4eb) and is what home and all ten interior
   * heroes resolve to. `"light"` is `bg-bg-canvas` (#fbf9f5) — a separate,
   * paler token that exists in the system but was, until `/services` adopted
   * it, used only in a few non-hero surfaces.
   *
   * Deliberately orthogonal to `decorative`: how loud the field behind the copy
   * is and how pale the base colour is are independent decisions, and folding
   * them into one prop would have meant either a lie or a four-value union.
   *
   * Consequence to be aware of: `"light"` makes this hero the only one in the
   * set not on #f7f4eb, and it drops the floating nav pill's edge contrast from
   * ~1.10:1 to ~1.04:1 against the canvas. The nav's 6%-black hairline rim and
   * two-layer shadow still carry the separation, so this reads as intended
   * rather than as a seam.
   */
  surface?: "canvas" | "light";
  /**
   * Toggles the angled ribbon SVG layer (`HeroRibbons`) independently of the
   * rest of the decorative field. Defaults to true.
   *
   * The ribbons are the loudest single element in the decorated canvas —
   * three 54–120px-wide curved strokes sweeping the full hero — and on a
   * centred text-only hero (the 404) they sit directly behind the headline
   * and read as visual noise rather than as depth. Opting out keeps the
   * wash / sage bloom / copper pool gradient and drops only the strokes.
   */
  ribbons?: boolean;
}) {
  const surfaceClass = surface === "light" ? "bg-bg-canvas" : "bg-canvas";

  return (
    <section
      data-reveal-exempt
      className={`relative ${surfaceClass} ${decorative ? "texture-paper" : ""} ${className}`.trim()}
    >
      {decorative ? (
        <>
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-28 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "var(--background-image-hero-canvas-wash)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "var(--background-image-hero-canvas-sage)",
              }}
            />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-copper/[0.055] blur-3xl" />
          </div>

          <div className="pointer-events-none absolute inset-x-8 top-24 bottom-20 overflow-hidden">
            {ribbons ? <HeroRibbons /> : null}
          </div>
        </>
      ) : null}

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/** Homepage-sized eyebrow, carried consistently into every child hero.
 *
 *  Unboxed like every other section eyebrow — no pill fill, border, radius or
 *  padding; `text-eyebrow` supplies size, tracking and weight.
 *
 *  The leading brick-red dot that used to sit here has been removed so this is
 *  byte-for-byte the home hero's eyebrow treatment, which is a bare
 *  `<p className="text-eyebrow uppercase text-eyebrow-gray">`. Nine subpage
 *  routes render this component, so the dot was the single most visible thing
 *  separating them from Home. */
export function HeroBadge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-eyebrow uppercase text-eyebrow-gray${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </span>
  );
}

/** Accent word inside a hero headline — "precision", and the equivalents in the
 *  About, Contact, Industries and Pricing heroes.
 *
 *  This used to hard-code `font-serif font-medium italic text-copper`, i.e.
 *  Playfair Display in copper, described in its own comment as a deliberate
 *  "editorial pairing" with the Plus Jakarta Sans headline. It was the reason
 *  those five heroes looked different from every other headline on the site.
 *  It is now just `accent-em`, the same utility as the other 40-odd accents,
 *  so the wrapper survives only as a readable name at the call sites. */
export function HeroEm({ children }: { children: ReactNode }) {
  return <em className="accent-em">{children}</em>;
}

/** Compact metric pills: proof without another floating hero layer. */
export function HeroStatsBar({
  stats,
  className = "",
}: {
  stats: HeroStat[];
  className?: string;
}) {
  return (
    <div className={className}>
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-charcoal/10 bg-white/65 px-4 py-5 text-center shadow-[0_8px_28px_rgb(54_67_59/0.05)] backdrop-blur-sm"
          >
            <dt className="stat-numeral text-3xl font-bold tracking-tight text-brand-green-700 sm:text-4xl">
              {stat.value}
            </dt>
            <dd>
              <p className="mt-2 text-sm font-semibold text-walnut">
                {stat.label}
              </p>
              {stat.note ? (
                <p className="mt-1 text-xs leading-5 text-taupe">
                  {stat.note}
                </p>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
