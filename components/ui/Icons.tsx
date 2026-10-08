import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* ==========================================================================
 * ICON SYSTEM. The single source of truth for every glyph on the site.
 *
 *  1. OUTLINE ONLY. Every export spreads the `base` below: `fill: "none"`,
 *     `stroke: "currentColor"`, `strokeWidth: 1.5`, round caps and joins.
 *     There are no filled or duotone variants in this file, and no call site
 *     may pass `fill="currentColor"` to one. Filled glyphs were removed
 *     from the four hero rating rows. Those rows are all hardcoded
 *     `Array.from({ length: 5 })`, so every star shown is an earned star and
 *     the outline pass loses no information; there are no partial ratings
 *     anywhere in `lib/data.ts` to need a filled/unfilled pair.
 *
 *  2. COLOUR. Standard is `text-accent-700` (#a95538) -- a house token,
 *     same hue family as the coral the brief asked for, darkened until the
 *     1.5px stroke is actually legible. Measured against the surfaces these
 *     icons sit on (linen/canvas/mist/white):
 *
 *       #D97757 (the brief's first choice)  2.69 - 3.12 : 1   FAILS
 *       text-orange-600  (#ea580c)          3.07 - 3.56 : 1   FAILS on cream
 *       text-amber-700   (#b45309)          4.33 - 5.02 : 1   marginal
 *       accent-500      (#ce7c5d)          2.72 - 3.15 : 1   FAILS
 *       accent-600      (#c46a4a)          3.29 - 3.81 : 1   non-text bar only
 *       accent-700      (#a95538)          4.48 - 5.19 : 1   PASSES AA  <-- used
 *
 *     A 1.5px stroke is the worst case for legibility, so the standard is set
 *     at the AA text bar rather than the 3:1 non-text bar that `accent-600`
 *     would have cleared. Two documented exceptions:
 *       - ON DARK. `accent-700` on forest #36433b is 2.00:1 and
 *         `accent-600` is 2.72:1, so terracotta is not available at all.
 *         `text-gold-500` measures 4.62:1 there and is used instead. This is
 *         why the four hero rating rows and the highlighted pricing card keep
 *         their existing gold wrapper colour.
 *       - INSIDE A CONTROL. A glyph that is part of a control inherits that
 *         control's colour: the arrow in a `ButtonLink`, the magnifier in the
 *         FAQ search field, the x in the clear button, the chevron in a
 *         disclosure. Recolouring these would break the control they belong
 *         to, and they are already outline at the correct weight.
 *
 *  3. NO FILLED CONTAINER. Icons are not wrapped in a background badge, a
 *     filled circle or a solid box. Where a glyph used to sit in one the
 *     wrapper is gone, not restyled -- this is what removed the 48px
 *     `TeamSpotlight` badge, the `rounded-pill` tick on the pricing cards,
 *     the `bg-accent-100` chips in `AboutStory` / `contact` /
 *     `IndustryCaseStudies`, and the success pill in `ContactForm`. Icon
 *     BUTTONS (the carousel arrows, the clear-search x) keep their shape --
 *     a control is not a badge, and none of them carries a resting fill.
 *
 *  4. SIZE. Standalone feature icons are 24px (`h-6 w-6`); feature-list
 *     ticks are 20px (`h-5 w-5`); the single success mark is 28px
 *     (`h-7 w-7`). Glyphs set inside a 12-14px text run stay at 16px
 *     (`h-4 w-4`), because a 20px tick beside `text-xs` copy reads as a
 *     mistake. Disclosure and control glyphs are 14-16px for the same
 *     reason.
 *
 *  TO ADD A GLYPH: extend `base`, not a call site. A per-call-site
 *  `fill`, `stroke-width` or `stroke` attribute is a deviation.
 * ========================================================================== */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.2l5.9-.8L12 3z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3l7 3v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Magnifier for the FAQ knowledge-base search field. */
export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.8-3.8" />
    </svg>
  );
}

/** Small diagonal cross — clears a search field, resets a filter. Deliberately
 *  an `X` drawn on the diagonal rather than a `+` rotated 45°, because the
 *  chevron-plus glyph elsewhere in this file is a disclosure control and reusing
 *  its geometry here would make "clear" and "expand" look like the same thing. */
export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 4l1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7L12 4z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 20.5s-7.5-4.6-9.2-9.2C1.6 8 3.4 5 6.6 5c2 0 3.4 1.1 4.1 2.4h2.6C13.9 6.1 15.3 5 17.4 5c3.2 0 5 3 3.8 6.3-1.7 4.6-9.2 9.2-9.2 9.2z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3.2A8 8 0 1 1 21 12z" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function RibbonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 19c5-3 9-5 8-9M6 15c2-4 5-6 9-7M10 8c-1-3 1-5 4-5-2 4 0 7 4 8" />
    </svg>
  );
}

export function RadarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 7a5 5 0 0 1 5 5" />
      <path d="M12 10.5a1.5 1.5 0 0 1 1.5 1.5" />
      <path d="M12 18l-3 2" />
      <path d="M12 18l3 2" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* Warm, tactile gift icons. Originally drawn for the live budget
   calculator, which no longer renders; the gift box is now also the
   curated-collections row in the pricing value proposition. */

export function GiftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3.5" y="8" width="17" height="11.5" rx="1.5" />
      <path d="M3.5 12.5h17" />
      <path d="M12 8v11.5" />
      <path d="M12 8h3.6c1.8 0 3-1 3-2.3C18.6 4.2 17 3.6 16 4.2c-.9.5-2.5 2-4 3.8z" />
      <path d="M12 8H8.4c-1.8 0-3-1-3-2.3C5.4 4.2 7 3.6 8 4.2c.9.5 2.5 2 4 3.8z" />
    </svg>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 9.5l8 5 8-5" />
      <path d="M8.6 15.4c0-1.2.9-2.1 2.4-2.1s2.4.9 2.4 2.1" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 5.5V10l9 9 7-7-9-9H5.5A2.5 2.5 0 0 0 3 10.5z" transform="translate(1 -1)" />
      <circle cx="9" cy="9" r="1.4" />
    </svg>
  );
}

export function RibbonBowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 9.5V21" />
      <path d="M12 9.5c-4.5 0-7.5-1.2-8.5-3.5 2-1.7 5.6-1.1 8.5 3.5z" />
      <path d="M12 9.5c4.5 0 7.5-1.2 8.5-3.5-2-1.7-5.6-1.1-8.5 3.5z" />
      <path d="M12 15c-1.5 1.8-4.2 2.6-6 2.2.8-2.4 3.1-4.2 6-4.2z" />
      <path d="M12 15c1.5 1.8 4.2 2.6 6 2.2-.8-2.4-3.1-4.2-6-4.2z" />
    </svg>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 7h9M17 7h3M4 17h5M13 17h7" />
      <circle cx="15.5" cy="7" r="2.3" />
      <circle cx="11" cy="17" r="2.3" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <circle cx="12" cy="15.5" r="1.4" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.5 3.9 5.6 3.9 9S14.6 18.5 12 21c-2.6-2.5-3.9-5.6-3.9-9S9.4 5.5 12 3z" />
    </svg>
  );
}

/* Thin-line social icons for the footer */

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 9h3v11H5zM6.5 7.5A1.8 1.8 0 1 0 6.5 4a1.8 1.8 0 0 0 0 3.5zM11 9h3v2c.5-1 1.6-2 3.3-2C20 9 21 10.5 21 13.5V20h-3v-6c0-1.5-.6-2.4-1.8-2.4-1.3 0-2.2 1-2.2 2.6V20h-3V9z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M16.8 7.2h.01" />
    </svg>
  );
}

export function XSocialIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

/* Thin-line sector icons for the industries hero orbit nodes */

export function LaptopIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M2.5 19.5h19" />
      <path d="M7 19.5l1.1-3.5h7.8L17 19.5" />
    </svg>
  );
}

export function HeartPulseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M19.5 13.5c1.46-1.46 3.03-3.23 3.03-5.5A5.5 5.5 0 0 0 17.03 2.5c-1.81 0-3.42.72-5.03 2.28C10.39 3.22 8.78 2.5 6.97 2.5A5.5 5.5 0 0 0 1.47 8c0 2.27 1.57 4.04 3.03 5.5L12 20.5l7.5-7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}

export function ShoppingBagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect x="2" y="6" width="20" height="14" rx="2" />
    </svg>
  );
}

export function FactoryIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M7 18h1M12 18h1M17 18h1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Wireframe object icons, added for the pricing value-proposition    */
/*  feature list.                                                       */
/*                                                                     */
/*  These two are geometry-only line drawings with no filled area and  */
/*  no enclosing badge, which is what makes them read as a different   */
/*  family from the tick-in-a-pill treatment they replaced. They rely  */
/*  on the shared `base` above for the thin look — `strokeWidth: 1.5`  */
/*  is already the file default, so nothing here sets a weight.        */
/*                                                                     */
/*  No icon package is installed (the only runtime dependencies are    */
/*  next/react/react-dom/framer-motion), so these are drawn in place   */
/*  rather than pulled in — which is also what every other icon in    */
/*  this file is. The other five icons that list uses already existed  */
/*  and were reused rather than redrawn: `GiftIcon`, `TruckIcon`,      */
/*  `HeartIcon`, `ShieldIcon` (already a shield with a tick inside)    */
/*  and `RadarIcon` — the last being the icon the site's own "Live     */
/*  Tracking Dashboard" guarantee uses, so the two agree by            */
/*  construction.                                                       */
/*                                                                     */
/*  NOT every export here is referenced. Twelve are currently dead:
 *  `ClockIcon`, `TrendUpIcon`, `MapPinIcon`, `TagIcon`, `ReceiptIcon`,
 *  `SlidersIcon`, `LockIcon`, `LaptopIcon`, `HeartPulseIcon`,
 *  `ShoppingBagIcon`, `BriefcaseIcon` and `FactoryIcon`. The old version of
 *  this note claimed the opposite and was wrong. A glyph that loses its
 *  last caller should be deleted rather than left parked, but clearing the
 *  twelve is a separate cleanup, not part of this icon-style pass.*/
/* ------------------------------------------------------------------ */

/** A taped parcel, square-on rather than in perspective. */
export function PackageIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3 10h18M10 10v9" />
    </svg>
  );
}

/** A person with a tick at the shoulder. Layers the way `ShieldIcon` layers
 *  its tick inside the shield, so the pair of them stays a matched set. */
export function UserCheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="9" cy="7.5" r="3.25" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="m14.5 17 2.5 2.5 5-5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Added for the gifting catalog's four category headers, which needed */
/*  a phone and a shirt and had no existing glyph to reuse. Drawn to   */
/*  the same 24x24 box, 1.5 stroke and round joins as everything above. */
/*  Named for their lucide equivalents (`SmartphoneCharging`, `Shirt`) */
/*  so the mapping stays obvious if the house set is ever replaced.   */
/* ------------------------------------------------------------------ */

/** A phone with a charge bolt on the screen, plus speaker and home bar. */
export function SmartphoneChargingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.6 5.3h2.8" />
      <path d="m12.8 8.6-3.1 4.6h2.3l-1 4.2 3.4-4.8h-2.3l.7-4z" />
      <path d="M10.6 18.9h2.8" />
    </svg>
  );
}

/** A short-sleeved tee. The collar arc sweeps counter-clockwise so it dips
 *  into the body of the shirt rather than bulging above the shoulders. */
export function ShirtIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M8.6 3.5 4 6l1.7 4.3 2.4-.9v11.1h8V9.4l2.4.9L20 6l-4.6-2.5" />
      <path d="M8.6 3.5a3.4 3.4 0 0 0 6.8 0" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Added (Crown, Users, PartyPopper, Calendar, Smile, Box) for the    */
/*  Tailored Solutions feature lists on /gifts: the four tab panels'   */
/*  bullet rows each carry their own glyph instead of a shared tick.   */
/*  Drawn to the same 24x24 / 1.5-stroke family as everything above    */
/*  and named for their lucide equivalents (like `SmartphoneCharging`  */
/*  and `Shirt`) so the mapping stays obvious if the house set is ever */
/*  replaced. The call site colours them `text-brick-red` per the tab  */
/*  brief — a documented exception to the accent-700 standard above.   */
/*  This round also hands live callers to glyphs the dead-note below   */
/*  lists (e.g. `ShoppingBagIcon`; `PackageIcon` was already live on   */
/*  the pricing value prop) — a glyph leaving the dead list needs no   */
/*  further change here.                                               */
/* ------------------------------------------------------------------ */

/** A crown — account milestones and the premium tier of a gifting plan. */
export function CrownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  );
}

/** Two people — teams of recipients, or the top performers a tier rewards. */
export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/** A party popper — festive hampers and cultural celebrations. */
export function PartyPopperIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5.8 11.3 2 22l10.7-3.8" />
      <path d="m11 5.9 5.5-3.9.9 4.3-3.4 3.9-4-4.3z" />
      <path d="m10.2 9.4 7.8-4.4 1.5 5.9-6.7 3.4-3.4-5.9z" />
      <path d="M9.2 12.2c.6-2.9 1.8-5 3.1-6.5" />
      <circle cx="13.2" cy="13.4" r=".9" />
      <circle cx="15.6" cy="15.8" r=".9" />
      <circle cx="16.8" cy="18.6" r=".9" />
    </svg>
  );
}

/** A calendar — work anniversaries, birthdays, scheduled drops. */
export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

/** A smiling face — service that lands on time and without friction. */
export function SmileIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}

/** A cube — kitted packing and multi-item event drops. */
export function BoxIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}