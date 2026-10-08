import { testimonials } from "@/lib/data";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";

/**
 * MERGED BAND — the human statement and the testimonial deck are now ONE
 * `<section>`, on white.
 *
 * This was two contiguous sections: this one (the belief statement, on an
 * inline `#FAF8F3`) and `Testimonials` (the deck, on `bg-white`). They were
 * merged at the client's direction into a single parent wrapper on white, so
 * the statement reads as the lead-in to the quotes beneath it rather than as a
 * separate band that happens to sit above them.
 *
 * `Testimonials` itself is untouched and still mounted on /gifts, /industries
 * and /pricing, eyebrow and heading intact. Only the home page stopped using
 * it, which is why the deck could be absorbed here without touching three other
 * pages. The export keeps the name `EmotionalPayoff`: the statement is still
 * what this component opens with, and the alternative was editing the
 * cross-file comments in `IndustriesHero`, `IndustriesList`, `Testimonials` and
 * `TrustBand` that all refer to this band by that name.
 *
 * READING ORDER. Two blocks, top to bottom:
 *
 *   1. The human statement — eyebrow + `<h2>`, centred, `max-w-4xl`.
 *   2. A single lede line, then the deck.
 *
 * WHAT CAME OUT OF THE DECK'S HEADING, and why what is left is not a
 * `SectionHeading` call. The deck brought three lines with it — the "What teams
 * say" eyebrow, the "Real teams, real impact" heading, and the "Hear how
 * enterprise teams..." description. The first two are gone; the description
 * stays, as the one line that introduces the quotes.
 *
 * `SectionHeading` cannot hold that combination. `eyebrow` and `title` are both
 * required props with no optional form, so there is no way to ask it for a
 * description alone — passing empty strings would render an empty `<p>` and an
 * empty `<h2>`, which is worse than not using the component. The lede is
 * therefore hand-rolled, and it borrows that component's classes verbatim so it
 * cannot drift from the eleven other bands using it: the wrapper keeps
 * `max-w-2xl` and the centred alignment, and the paragraph is
 * `text-body-lg text-taupe` — exactly what `SectionHeading` emits for a
 * non-dark section. `data-reveal-header` is kept on the wrapper, which is the
 * one piece of behaviour that is not a class and so could not be copied by
 * eye; it is what makes the line scroll-triggered rather than load-time.
 *
 * Dropping the heading also drops the section's second `<h2>`, so the band is
 * back to a single top-level heading. That was the argument for demoting it
 * rather than deleting it when it was restored a pass ago, and the client chose
 * deletion.
 *
 * STILL REMOVED from the humanized portion, and the reason each removal is safe
 * rather than merely absent: the body sentence ("Fulfill Nest helps you
 * deliver them..."), the `/case-studies` button under it, and the "Every
 * occasion · every person · every detail" pill. The deck now carries the band,
 * and a CTA plus a closing claim line directly above a wall of client quotes
 * was three separate asks for attention in one screen.
 *
 * BACKGROUND. `bg-white`, replacing the inline `backgroundColor: "#FAF8F3"`.
 * The inline style and its `backgroundImage`/`backgroundRepeat` resets are gone
 * with it — they existed only to force the flat off-white, and `bg-white` is
 * the same value by a mechanism that cannot drift from the class system.
 *
 * NO `border-t`, and that is deliberate rather than forgotten. `HowItWorks`
 * directly above is `border-y ... bg-linen` and its `border-b` already lands on
 * exactly this line, so a hairline here would render a 2px seam. This is the
 * same reason the old statement band had none. Below, `FaqList` is
 * `divider={false}` on `bg-surface` (#ffffff), so white runs into white and
 * that boundary correctly has no rule either.
 *
 * `data-reveal-exempt` IS GONE, and this one IS load-bearing. The old band
 * carried it because the statement animates itself with `animate-fade-up`. But
 * `RevealOnScroll` scans `section, [data-reveal-trigger], [data-reveal-unit]`
 * and returns early on a `<section>` that is exempt, and `data-reveal-item` is
 * collected BY that scan target rather than observed in its own right. Leaving
 * the exemption on would have meant the deck below was never collected, never
 * given its reveal node, and therefore stuck at `opacity: 0` permanently.
 * Dropping it restores the deck's scroll-triggered fade. The statement is
 * unaffected either way: its eyebrow and `<h2>` carry no reveal markers, so
 * `collectRevealNodes` ignores them and `animate-fade-up` still owns them.
 *
 * The two blocks animate on different systems, which is not an accident: the
 * statement keeps its original load-time `animate-fade-up` cascade, and the lede
 * goes through the reveal system, so it and the deck wait for the section to
 * clear 80px into the viewport.
 */
export function EmotionalPayoff() {
  return (
    /* `data-reveal-content-offset="200"` is what puts this band's lede on the
     * site-standard header cadence instead of the shared 300ms default.
     *
     * The eyebrow and the `<h2>` are the two children of one
     * `data-reveal-header` wrapper, so they already read 0ms and 100ms - the
     * first two steps of the 0 / 100 / 200 sequence every `SectionHeading`
     * produces. The lede cannot join that wrapper, because it is a differently
     * measured block (`max-w-2xl` centred, against the statement's `max-w-4xl`)
     * and merging them would change the layout. So it is scheduled separately
     * through `data-reveal-stagger`, which starts at
     * `CONTENT_OFFSET_MS` - 300ms unless this attribute overrides it. 300 is a
     * sensible default for a header followed by a grid, and wrong here: it put
     * the lede 100ms past the step it is supposed to occupy.
     *
     * The carousel below is on `data-reveal-item` and so picks up the same 200ms
     * offset. That is fine - it is a separate block far below the lede, and the
     * two never overlap on screen - but it is the reason this is an override on
     * the SECTION rather than something set on the lede alone. */
    <section
      data-reveal-content-offset="200"
      className="relative w-full overflow-hidden bg-white py-section"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* 1. Statement. `max-w-4xl` measured against the outer `max-w-7xl`
            rather than being its own `px-6` container, so the blocks below line
            up on the same gutters while this measure stays readable.

            THE STATEMENT IS SCROLL-TRIGGERED AGAIN. The eyebrow and the `<h2>`
            were carrying `animate-fade-up` with inline `animation-delay`s, which
            is a pure-CSS entrance with no observer: it ran on paint, at page
            load, while everything below it here waited for a scroll trigger. A
            band whose top half animates in the background and whose bottom half
            animates in front of the reader is not one entrance, it is two that
            happen to share a section. `data-reveal-header` puts both nodes back
            on the shared observer, where the `<section>` reveals the whole band
            together and the eyebrow/title/description stagger falls out of the
            same `headerStep` the rest of the site uses. */}
        <div data-reveal-header className="mx-auto max-w-4xl text-center">
          <p className="text-eyebrow uppercase text-eyebrow-gray">
            The human side of rewards
          </p>

          {/* The old 0ms / 140ms inline pair is gone with the keyframes. On
              `data-reveal-header` the two children take 0ms and
              `STEP_MS` = 100ms, so the title now arrives 40ms after the eyebrow
              rather than 140ms. That is the shared cadence every other heading
              on the site runs, and it is worth the 40ms to have one number
              governing the whole band instead of a local copy of it. */}
          <h2 className="mt-4 text-[clamp(1.5rem,8vw,2rem)] text-charcoal md:text-display-xl">
            You already know thoughtful rewards build stronger{" "}
            <em className="accent-em">teams</em>
          </h2>
        </div>

        {/* 2. The deck's lede — the only one of its three lines kept.

            `data-reveal-stagger` rather than `data-reveal-header`, changed from
            the latter. Both give a single-child wrapper one node, but they
            schedule it differently: `data-reveal-header` starts at 0ms, while
            `data-reveal-stagger` starts at `CONTENT_OFFSET_MS` = 300ms. As a
            header it was therefore landing at the same instant as the eyebrow
            above it and before the `<h2>` had finished arriving, which is not
            the order anyone reads the band in. On a stagger it waits its turn
            behind the statement and the band reads top to bottom.

            `mt-4`, not a bespoke gap. The site-wide heading-to-description
            spacing IS 16px, and it is not a per-section decision: `SectionHeading`
            puts `gap-4` on its own flex column, so every band that uses the
            component gets that distance between its title and its lead by
            construction. This line cannot use the component (see the header), so
            it has to state the number itself, and `mt-4` is the number that
            makes the merged band read like its neighbours. It previously sat at
            `mt-14 md:mt-20`, which was a section gap left over from when the
            deck had a full eyebrow + heading + description stack under it. */}
        <div
          data-reveal-stagger
          className="mx-auto mt-4 max-w-2xl text-center"
        >
          <p className="text-body-lg text-taupe">
            Hear how enterprise teams use Fulfill Nest to run rewards that drive
            retention, engagement, and delight.
          </p>
        </div>

        {/* 3. The deck. Gap retuned from the heading block's `mt-16 md:mt-24`
            to `mt-12 md:mt-16`: that value was set below an eyebrow + `<h2>` +
            description, and 96px under a single line of body text reads as a
            break in the band rather than as space before the cards. */}
        <div data-reveal-item className="mt-12 md:mt-16">
          <TestimonialsCarousel items={testimonials} />
        </div>
      </div>
    </section>
  );
}