import { clientLogos } from "@/lib/data";

/**
 * Client logo marquee — compact trust strip embedded directly beneath the
 * home hero's rating text.
 *
 * Loop mechanics (why this cannot gap, jump, or starve):
 * 1. Track = TWO identical sibling copies; spacing lives INSIDE each copy
 *    (item right-padding), and the outer track has NO gap/trailing padding
 *    — so the track is geometrically exactly 2 × one copy in every browser.
 *    `translateX(-50%)` therefore always lands on the copy boundary.
 * 2. Track starvation: with only 6 logos (~800px), two copies (~1,600px)
 *    are SHORTER than a wide desktop viewport. As the track slides left,
 *    the visible window runs past the end of copy 2 before the keyframe
 *    resets — exposing a blank gap after the last logo, then an abrupt
 *    pop-in. So each half renders `clientLogos` FOUR times (~3,800px),
 *    wider than any common screen resolution. The window is therefore
 *    fully populated at every animation position, and the seam is
 *    invisible: no empty gap, no pop-in.
 */
export function ClientLogoMarquee() {
  // One half: 4× the 6 logos (~3,800px) — wider than any desktop viewport.
  const marqueeList = [
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
  ];

  const renderNames = (
    prefix: string,
    ariaHidden: boolean,
    duplicate = false,
  ) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className={`client-logo-track-copy flex shrink-0 items-center ${
        duplicate ? "client-logo-track-copy--duplicate" : ""
      }`}
    >
      {marqueeList.map((logo, i) => (
        <span
          key={`${prefix}-${logo}-${i}`}
          className="pr-16 font-display text-lg font-semibold tracking-wide text-charcoal/40 transition-colors duration-300 hover:text-charcoal"
        >
          {logo}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="client-logo-marquee mx-auto w-full max-w-[720px] text-center"
      role="group"
      aria-label="Trusted clients"
    >
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="client-logo-track flex w-max animate-marquee items-center will-change-transform motion-reduce:animate-none motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {renderNames("a", false)}
          {renderNames("b", true, true)}
        </div>
      </div>
    </div>
  );
}
