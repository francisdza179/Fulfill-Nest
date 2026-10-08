import type { ReactNode } from "react";

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  descriptionClassName?: string;
  /** Overrides for the eyebrow and title colours. Kept as escape hatches for
   *  sections that sit on a dark canvas the two built-in `dark` colours were
   *  not measured against; the class is applied *instead of* the default, and
   *  `dark` is still passed, so dropping an override falls back to a colour
   *  that is legible on dark rather than to an invisible one. */
  eyebrowClassName?: string;
  titleClassName?: string;
  align?: "left" | "center";
  dark?: boolean;
  /** Opt out of the scroll-triggered reveal and animate on page load instead.
   *
   *  By default the wrapper carries `data-reveal-header`, which
   *  `components/ui/RevealOnScroll.tsx` collects: it puts `reveal-on-scroll` on
   *  each direct child, so the eyebrow, title and description all sit at
   *  `opacity: 0` until the SECTION has cleared 80px into the viewport.
   *
   *  Set this on a heading that must be legible the moment the page loads. It
   *  drops the marker, so the reveal system never sees the children and cannot
   *  hide them, and applies `heading-enter` instead - a plain CSS animation in
   *  `app/globals.css` that runs on paint with the same 0.6s / bezier entrance
   *  spec and the same 100ms eyebrow -> title -> description stagger. No JS, no
   *  observer, and nothing to go wrong if hydration is slow.
   *
   *  The tradeoff is the point of the flag: the entrance plays at load, not on
   *  scroll, so a heading BELOW the fold has already finished animating by the
   *  time a reader scrolls to it and will simply appear. */
  enterOnLoad?: boolean;
}

/** Editorial block heading: plain inline eyebrow + display title + optional lead.
 *
 *  The eyebrow is deliberately unboxed site-wide — no pill fill, border, radius
 *  or padding. `text-eyebrow` is the single source for size, tracking and weight;
 *  this component only picks the colour. Light surfaces use the neutral
 *  `text-eyebrow-gray`, while `dark` sections keep a light sage for contrast on
 *  forest — the grey measures 2.47:1 on `--color-forest` and fails WCAG AA, so
 *  it must never be used on a deep surface. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  descriptionClassName,
  eyebrowClassName,
  titleClassName,
  align = "left",
  dark = false,
  enterOnLoad = false,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto text-center items-center" : "text-left";

  return (
    <div
      /* `undefined` rather than `false` so React omits the attribute entirely
         instead of rendering data-reveal-header="false", which the selector in
         RevealOnScroll would still match. */
      data-reveal-header={enterOnLoad ? undefined : true}
      className={`flex max-w-2xl flex-col gap-4 ${alignment}${
        enterOnLoad ? " heading-enter" : ""
      }`}
    >
      <p
        className={`text-eyebrow uppercase ${
          eyebrowClassName ?? (dark ? "text-brand-green-300" : "text-eyebrow-gray")
        }`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`text-display ${
          titleClassName ?? (dark ? "text-darktext" : "text-charcoal")
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`text-body-lg ${
            descriptionClassName ??
            (dark ? "text-darktext/70" : "text-taupe")
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
