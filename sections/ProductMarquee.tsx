import { showcaseTiles } from "@/lib/data";

/**
 * Product showcase slider — a headerless, textless, buttonless strip of the nine
 * studio-rendered products, sitting between "About Fulfill Nest" and "Why
 * Fulfill Nest".
 *
 * There is deliberately no eyebrow, headline, sub-copy, CTA, arrow or bullet
 * dot. The section is a flat white band whose only content is the
 * moving tiles, so it reads as a texture band between two text sections rather
 * than as a fifth section competing for attention.
 *
 * Image integrity: a plain <img> pointing at byte-for-byte copies of the
 * originals (SHA256-verified in public/showcase). Not next/image, and no
 * srcset or <picture>. Nothing sits between the file on disk and the decoder,
 * so there is no intermediate resize, re-encode or upscale to introduce
 * artifacts — the browser's own single downscale is the only scaling that
 * happens. See the note on `showcaseTiles` in lib/data.ts.
 *
 * Framing: the card is a 1:1 square window with no padding and no fill, and
 * the image is stretched to 100% of it with `object-fit: cover`. That is a
 * deliberate reversal of the earlier letterboxed treatment, and the reason is
 * the artwork: each render is a seamless studio backdrop with a ground shadow
 * under the product, so the image's own pixels become the card canvas and the
 * 20px radius is cut from the render itself. Nothing sits between the product
 * and the tile edge, and no inner frame can appear.
 *
 * The trade is cropping, and it is almost free. Every source is PORTRAIT
 * (aspect 0.693-0.962) going into a square, so `cover` scales to fill the width
 * and trims the top and bottom — up to 31% of frame height on the carry-on
 * suitcase. But that trim is mostly studio headroom: measured against the
 * pixels, eight of the nine products sit entirely inside the 380px window and
 * lose nothing at all. Only the carry-on is genuinely taller than the window
 * (481px of product in a 548px frame), so it is the one image carrying a
 * `data-focal-point`; the others inherit the centred default.
 *
 * `contain` avoided all cropping but letterboxed each render inside a tile,
 * which left the mismatched backdrop seam this replaces. Whichever way it goes
 * there is no zero-crop option for portrait sources in a square card; the
 * question is only whether the unused space is backdrop (crop it) or tile (pad
 * it).
 *
 * The card is a fixed 380px, so the image filling it causes no layout shift in
 * the strip.
 *
 * Hover: this is the site's one standalone image-only card — a frame with
 * nothing in it but the render — so it carries the shared image-card zoom
 * (500ms ease-out to scale 1.05, clipped by the card's own `overflow: hidden`).
 * Both halves live in `globals.css` next to the card geometry above it rather
 * than as utilities here, because the same rules already have to outrank the
 * `!important` sizing on this `img`; a `hover:scale-105` class here would sit
 * in a different cascade layer and lose. The `img` is the element that moves,
 * not the card, so the 20px radius keeps cutting the artwork instead of the
 * frame growing out from under it. Hovering a tile also pauses the strip, so
 * the two arrive together.
 *
 * The cost of the raw approach is honest and worth stating: the originals total
 * 30.6MB (0.9-5.7MB each), and a raw <img> means the browser downloads every
 * byte of the file it displays. `loading="lazy"` keeps them off the critical
 * path — the strip is a horizontal track, so off-screen cards do not load until
 * they scroll into view, and the nine unique files are fetched once and shared
 * across all 36 <img> tags by the HTTP cache. A user who watches the full loop
 * will still pull all 30.6MB. Serving right-sized WebP instead would cost 277KB
 * total, but that requires an optimizing component, which is the thing being
 * avoided here.
 *
 * Loop mechanics (the same reasoning as sections/ClientLogoStrip.tsx, and for
 * the same reasons — the naive version visibly breaks):
 *
 * 1. Seamlessness. The track holds TWO identical copies of the tile run and
 *    slides `translateX(0) -> -50%`. Because the copies are identical, the
 *    pixel run at the end of the loop is indistinguishable from the start, so
 *    there is no jump. The copy's trailing padding is what makes the spacing
 *    uniform: the gap between the last card of copy A and the first card of
 *    copy B is produced by copy A's own `pr-7`, exactly like every interior
 *    gap. The track itself carries no gap, so `w-max` is exactly twice one
 *    copy and the -50% offset always lands on the boundary.
 * 2. Track starvation. One copy of nine 380px cards is ~3.7k px, NARROWER than
 *    a 4K display. As the track slid, the viewport would run off the end of the
 *    content and reveal empty canvas, then pop the next copy back in. So each
 *    copy renders the run twice (18 cards, 7,344px), comfortably wider than any
 *    screen. The window is populated at every animation position and the loop
 *    point is invisible.
 * 3. Pause on hover lives in globals.css (`.showcase-marquee:hover
 *    .showcase-marquee-track`) so it covers the whole band — cards, gaps and
 *    padding — and releases the moment the pointer leaves.
 * 4. Reduced motion drops the animation and both duplicates, leaving one static
 *    row of nine.
 */
export function ProductMarquee() {
  // One half = the 9-frame run twice, so a half is wider than any viewport.
  const run = [...showcaseTiles, ...showcaseTiles];

  const renderRun = (copy: "a" | "b") => (
    <div
      /* Gap and trailing padding step down with the card (280px below 640px,
         380px above) so the rhythm between cards stays proportional instead of
         opening up into 28px gutters around a 280px tile. The trailing `pr-*`
         is what produces the seam between copy A and copy B, so it must always
         equal the interior gap — hence both classes move together. */
      className={`showcase-marquee-copy flex shrink-0 items-center gap-5 pr-5 sm:gap-7 sm:pr-7 ${
        copy === "b" ? "showcase-marquee-copy--duplicate" : ""
      }`}
      // The second copy is present only to make the loop seamless; announcing
      // it twice would read as duplicated content to a screen reader.
      aria-hidden={copy === "b" || undefined}
    >
      {run.map((tile, index) => (
        <div key={`${copy}-${tile.src}-${index}`} className="showcase-marquee-card">
          {/* eslint-disable-next-line @next/next/no-img-element -- a raw <img>
              is deliberate here: the original file must reach the decoder
              unmodified, which next/image would resize and re-encode. */}
          <img
            src={tile.src}
            alt={copy === "b" ? "" : tile.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            // Only set when a frame needs it; the rule lives in globals.css so
            // the override is auditable next to the other card geometry.
            data-focal-point={tile.focalPoint}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="overflow-hidden bg-white py-12"
      role="group"
      aria-label="Product showcase"
    >
      <div className="showcase-marquee">
        <div className="showcase-marquee-track flex w-max animate-showcase-marquee items-center will-change-transform motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {renderRun("a")}
          {renderRun("b")}
        </div>
      </div>
    </section>
  );
}
