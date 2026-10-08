import Image from "next/image";
import { serviceGuarantees } from "@/lib/data";

/**
 * Operational guarantees & SLA grid — four risk-mitigation cards, each a white
 * panel on a pale sage canvas.
 *
 * Canvas note: the section is `bg-[#CFE2D4]` and the header on it is
 * `text-charcoal`. The canvas has been through seven values — charcoal, a
 * custom `--color-indigo-canvas` (#1E1B4B), `bg-slate-900`, `bg-slate-100`,
 * `bg-slate-800`, `bg-slate-200`, `bg-[#064E3B]` — and is now a pale sage.
 *
 * #CFE2D4 is a literal, and unlike the two dark greens before it there is no
 * house token anywhere near it. The ramp runs --color-brand-green-700 #25553d
 * to -950 #0d2418, plus --color-linen #f1eee7 and --color-canvas #f7f4eb, and
 * none of those is a light green. Do not fold this into an existing green.
 *
 * WHY IT IS THIS PALE, which is the whole design problem on this canvas and is
 * not obvious from the markup. Two hard bounds, and this value sits in the only
 * gap between them.
 *
 *   - The eyebrow needs 4.5:1 at 12px, so the canvas must be LIGHT. The warm
 *     tint #d8a79c clears 4.5:1 only below canvas luminance 0.060, and
 *     `bg-[#064E3B]` sat at 0.058 — on the exact edge, with nothing to spare.
 *     Any real lightening kills it: on #065F46 it measures 3.63:1, on #047857
 *     2.59:1. That is why the accent below is brand red again rather than the
 *     tint, and it is why this went light at all.
 *   - The cards must stay opaque white, so the canvas must not be TOO light.
 *     White on this canvas is 1.356:1 — the worst card separation in this
 *     file's history. Brand red at 4.5:1 needs canvas luminance >= 0.696, which
 *     caps card separation at about 1.36:1 no matter how the value is chosen.
 *
 * Those two bounds do not both yield. A passing brand-red eyebrow and a
 * visible white card edge are mutually exclusive on this palette, and this
 * value resolves it in favour of the eyebrow: the cards get a load-bearing
 * border instead (see the border note below), which is a smaller cost than an
 * unreadable 12px label. The alternative — a mid green around #065F46 with
 * 7.68:1 cards — restores easy card separation and costs the accent entirely,
 * since no warm tint survives there and no brand red is legible on a mid-dark
 * field. It is a defensible choice; this is the one that was made.
 *
 * Measured on this canvas; every number taken on the previous seven is void:
        #111827    13.10:1  `text-charcoal` heading
        #4b5563     5.57:1  `text-taupe` subtitle
        #a83b24     4.67:1  `text-brand-primary` / `accent-em` — eyebrow + accent
        #c84b31     3.44:1  `accent-em--on-canvas` — clears 3:1 large text only
        #d8a79c     1.56:1  the tint, which is why it is not used here
        #ffffff     1.36:1  the cards — hence the border, see below
 *
 * The consequence worth stating plainly: at 4.67:1 the eyebrow PASSES AA at
 * 12px with the brand red, which no placement of it did on any of the six
 * previous canvases. The dark-canvas pass had recorded this as impossible and
 * recommended a new token; the resolution turned out to be the canvas, not the
 * token. `accent-em--on-dark` is still live on `bg-forest` and now has no user
 * here — it is documented in globals.css as the forest-section variant and that
 * remains true.
 *
 * `border-section-divider` (8% black, the light-surface hairline) is back
 * rather than `border-dark-line`. It has now swapped five times across the
 * seven canvases above; it tracks the canvas being dark or light, nothing else,
 * and should not be read as a style choice.
 *
 * The `text-[#C84B31]` literal this file carried for most of its life stays
 * deleted. It sat beside `accent-em` on the same element, competing for `color`
 * and leaving the winner to Tailwind's internal sort order — the same-property
 * collision the heading note below warns about. `italic` does not need
 * restoring alongside it: the utility sets `font-style: italic` itself.
 *
 * The ambient red wash is gone and has not come back. There was never a per-card
 * colour patch in this section — the tinted shape behind the cutouts was
 * removed several passes ago — but a 7% red bloom was left floating at
 * `-right-28 top-1/4`, which on a four-column grid sits behind the last card.
 * That was the patch; it was removed when the canvas went to slate-800 and has
 * not returned.
 *
 * Heading note: harmonised against the Service Tiers heading, which is not a
 * hand-written h2 at all — ServiceTiers renders `<SectionHeading>`, and that
 * component emits `className="text-display text-charcoal"` and nothing else.
 * So the target is one utility, not the class list it resolves to.
 *
 * The COLOUR matches again, and the two h2s are byte-for-byte equivalent: both
 * emit `text-display text-charcoal` and nothing else. That is only true while
 * this canvas is light. It held on the slate-200 pass, broke on both dark
 * canvases since — `text-darktext` was a necessity there, not a departure — and
 * holds again now. Do not read the re-closure as the dark values having been
 * wrong; they were correct for what they were placed on. The one enduring
 * difference from ServiceTiers is the accent phrase, which the sentence shape
 * requires and the heading style does not.
 *
 * `text-display` is `clamp(1.75rem, 4.2vw, 3rem)` — 28-48px — carrying its own
 * 1.15 line-height and -0.035em tracking. Family, weight 800 and `text-wrap:
 * balance` come from the h1-h6 base rule, so ServiceTiers names none of them
 * and neither does this. Naming them at the call site is not merely redundant
 * here, it is wrong: `font-extrabold` happens to equal the base rule's 800 and
 * is harmless, but `tracking-tight` is -0.025em against the system's -0.035em
 * and `leading-tight` is 1.25 against its 1.15. Pairing either with
 * `text-3xl`/`text-5xl` — which bring Tailwind's default 1.0 line-height —
 * puts three same-property utilities on one element and leaves the winner to
 * Tailwind's internal sort order.
 *
 * The accent phrase is what makes the two headings structurally identical:
 * Service Tiers sets a base clause in the heading colour and drops
 * `<em className="accent-em">` on the second clause, and this does the same —
 * narrowed to the single word "guarantees" so the run leading into it carries
 * the sentence. On a light canvas it is the SAME class as Service Tiers uses,
 * not just the same idea.
 *
 * There are three accent utilities, and which one is legible tracks the canvas,
 * not preference. `accent-em` -> #a83b24 for light surfaces; `accent-em--on-canvas`
 * -> #C84B31 (--color-brand-primary-canvas) for mid-dark; `accent-em--on-dark`
 * -> #d8a79c (--color-brand-primary-tint) for deep forest. This is a light
 * canvas, so it takes the first, and the split is the system's rather than this
 * section's. The dark variant has been used here and is now unused again; it
 * remains correct on `bg-forest`, which is what globals.css documents it for.
 *
 * The `text-[#C84B31]` literal that used to sit beside the utility is deleted.
 * It was a genuine same-property collision, not a duplicate, and the one place
 * in the file where two colours competed for `color` — the sort-order trap
 * described above. The canvas note covers the rest of why it went. Nothing needs
 * restoring: `accent-em` sets `font-style: italic` itself, so the `italic` that
 * once sat beside the literal was always redundant.
 *
 * The accent is safe at this size, and so is the eyebrow. `text-display` never
 * drops below 28px, which clears the 24px large-text threshold outright. The
 * eyebrow gets no such exemption and does not need one: at 4.67:1 the brand red
 * clears the 4.5:1 that 12px body text actually requires. That is not a
 * coincidence of this value — it is the constraint that chose the value, and it
 * is why the eyebrow is `text-brand-primary` and not the tint at 1.56:1.
 *
 * There is no gradient heading treatment on this site; the accent treatment is
 * the italic `<em>` phrase, and nothing else.
 *
 * Accent note: the only red inside a card is now the hover border, and that is
 * a hover state, not resting content. The ordinals went two passes ago, the
 * shape behind the cutouts went next, and the ambient wash is gone as of this
 * pass, so at rest the section carries red in exactly two places — the eyebrow
 * and the heading accent, both in the header. On white the canvas red measures
 * 4.66:1, which clears 18.7px-bold large text but not 16px regular, so red text
 * inside a card stays out unless the size changes.
 *
 * The cards are opaque white because a translucent panel cannot hold a
 * high-contrast promise: a 4%-white fill over #1E1B4B lands at roughly #242250
 * and the card vanishes into its own canvas. Opaque white is what makes the
 * contrast real.
 *
 * Shadow note: `shadow-gray-200/50` is GONE, and this is the second time it has
 * been removed. It recolours the shadow, and it makes the card's shadow fainter
 * than the uncoloured `shadow-xl` it would otherwise use, not stronger.
 * Tailwind's default shadow colour is `rgb(0 0 0 / 0.1)`; `gray-200` at 50% is
 * rgb(229 231 235 / 0.5), which is a LIGHTER thing to composite with. The
 * perceived "premium" lift was always coming from `shadow-xl`/`shadow-2xl` and
 * `rounded-3xl`, never from the tint.
 *
 * Which of the two reads is worth the difference, though, is canvas-dependent,
 * and on this one the tint costs everything. Over a dark canvas the light tint
 * is a soft halo — rgb(229 231 235 / 0.5) resolved to roughly #18242F on
 * slate-800 and #769B93 on `bg-[#064E3B]`, both genuine elevation cues. Over
 * this pale sage it composites to about #DAE4DF against a #CFE2D4 field:
 * 1.047:1, which is nothing. The uncoloured `rgb(0 0 0 / 0.1)` resolves to
 * about #BACBBF and measures 1.304:1 — still subtle, as shadows on a light
 * canvas are, but a real edge rather than a rounding artefact. That is why the
 * tint is dropped here and was already dropped on the light passes: it inverts
 * exactly when it is most needed.
 *
 * Do not put it back thinking it is a neutral style default. It is not
 * canvas-neutral; it is a dark-canvas choice, and like `border-dark-line` it
 * tracks lightness.
 *
 * `border-taupe/30` is LOAD-BEARING on this canvas, which is a change of status
 * rather than of value. `border-gray-100` (#F5F5F5) was near-invisible on a
 * white panel and was kept only because the panel drew itself with its fill
 * contrast. Here white is 1.356:1 against the canvas, so it cannot: the cards
 * need their edge. `taupe` at 30% composites to about #C9CCD0, which is darker
 * than both the card and the field and therefore reads as a line rather than as
 * a tonal step — the one border treatment that works between two light
 * surfaces. It is not a hairline to be softened; taking it below roughly 20%
 * puts the cards back to invisible. The hover state steps it to
 * `brand-primary/60` (about #CA897C), which is a genuine change in hue as well
 * as strength, where the old `hover:border-red-200` was only a paler version of
 * what was already there.
 *
 * Radius is `rounded-3xl` (30px). Every other card on the site is 20px
 * (`rounded-card`), so this is a deliberate departure. The ORIGINAL reason for it
 * — that these read as light panels floating over a dark field — no longer
 * applies and should not be quoted; this is a pale canvas now. The reason that
 * survives is that the field is tinted while the cards are untinted paper, so
 * the card has to read as a separate sheet laid on a coloured ground, and the
 * larger radius is most of what separates "sheet" from "swatch". If that stops
 * being convincing, the 20px parity argument is live again and is a better
 * default than a rationale borrowed from a deleted canvas.
 *
 * Sub-heading note: `font-bold` (700) and `tracking-tight` (-0.025em) are both
 * one step off the base h1-h6 rule, which sets 800 and -0.035em — the same two
 * deviations removed from the h2 in the previous pass, reintroduced here
 * deliberately. They are kept as specified; if the goal is to match the
 * system's heading weight rather than to read heavier-but-soft, `font-extrabold`
 * is the value that lines up with the rest of the site.
 *
 * Artwork note: the four files are transparent-background PNGs (32bpp ARGB)
 * whose alpha boxes fill ~90% of each canvas, so they are genuine cutouts
 * rather than framed plates and need no rounded clipping. Their aspect ratios
 * are NOT uniform (1.52:1 down to 0.93:1), which is why the stage sizes by
 * height and centres — fitting by width would make the wide file read as the
 * largest card. The intrinsic pixel sizes are recorded in lib/data.ts for
 * exactly this reason: the stage is 144px of content height, so a 1.52:1 file
 * renders ~219px wide and a 0.93:1 file ~134px.
 *
 * The four bodies are deliberately near-identical in length (143-152
 * characters) so the row stays visually even at four columns; re-check that
 * spread if any copy is rewritten, because it is what keeps the ragged card
 * bottoms — and therefore what `justify-between` has to redistribute — small.
 *
 * Alt text describes the artwork rather than repeating the heading, so a
 * screen-reader user hears the packaging type, the route map, the medium the
 * prompt appears on — none of which the adjacent title conveys. See
 * ServiceGuarantee.imageAlt.
 */
export function GuaranteesGrid() {
  return (
    <section className="texture-paper relative overflow-hidden border-y border-section-divider bg-[#CFE2D4] py-section text-charcoal">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header rendered inline rather than through `SectionHeading`.
            That component is a deliberate contract: `text-eyebrow` is the single
            source for eyebrow size, tracking and weight, and a call site may
            only pick the colour. The eyebrow below wants 12px / 0.05em / 600
            against `text-eyebrow`'s 14px / 0.08em / 700, so routing it through
            the component would mean either fighting those three values or
            changing them for every other section. The remaining disagreement
            with the component is therefore only the eyebrow metrics, and the
            title sizing.

            `data-reveal-header` is kept, and with the eyebrow back the header
            walks its three children — eyebrow -> heading -> description, which
            is the rhythm the attribute exists for. The wrapper carries no
            `gap-*` because the spec sets its own `mb-*` per line.

            The eyebrow source string is `SLAs`; `uppercase` renders it `SLAS`.
            Whichever is written, the output is all-caps, so the capitalisation
            in the string only matters to a screen reader reading the DOM.

            `mb-12` is the whole gap to the cards: the grid's `mt-16` is gone,
            since keeping both would stack to 112px. */}
        <div
          data-reveal-header
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-brand-primary">
            ENTERPRISE SLAs &amp; GUARANTEES
          </span>
          <h2 className="mb-4 text-display text-charcoal">
            Built for scale. Backed by{" "}
            <em className="accent-em">guarantees</em>
          </h2>
          <p className="mb-12 text-base text-taupe">
            We take full operational accountability for every dispatch so your
            HR and procurement teams never have to worry.
          </p>
        </div>

        {/* Cards carry their own frame, so the grid takes a plain gap. The
            shared `divide-*` hairlines are gone with them — kept, they would
            sit one hairline away from two card borders and read as a double
            rule. Same for the `md` gutter the dividers used to stand in for:
            the gap is back, because cards are separate objects again. The
            header owns the space above the grid now (`mb-12` on the subtitle),
            so there is deliberately no `mt-*` here.

            `items-stretch` is the CSS default for grid, so it changes nothing
            on its own. It is written out because the equal-height guarantee
            below depends on it, and the default is the one thing about a grid
            that silently stops being true the moment a child sets `self-*`. */}
        <div
          data-reveal-stagger
          className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {serviceGuarantees.map((guarantee) => (
            <article
              key={guarantee.title}
              className="flex h-full min-h-[440px] flex-col justify-between rounded-3xl border border-taupe/30 bg-white p-8 shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:border-brand-primary/60 hover:shadow-2xl"
            >
              {/* Hover: a lift, a border and a shadow on one `transition-all`.
                  `ease-out` decelerates into the hovered state, which is what
                  makes a lift read as arriving rather than as sliding; the
                  earlier `ease-in-out` was symmetric and felt mechanical for a
                  one-way move.

                  The 8px lift clears the grid's `gap-6` comfortably, so a
                  hovered card never overlaps its neighbour.

                  Two things to know about this state. First, it is hover-only
                  with no focus equivalent — which is currently correct, because
                  these articles hold no links or controls and are not focusable.
                  If a card ever becomes a link, every `hover:` here needs a
                  matching `focus-visible:`, or the affordance will be
                  keyboard-invisible. Second, nothing suppresses it under
                  `prefers-reduced-motion`: the global block in globals.css is
                  scoped per-component (`.reveal-on-scroll`, `.hero-entrance`,
                  `.floating-nav-motion`) and has no blanket rule, so a 300ms
                  lift animates for exactly the users who asked it not to.
                  The fix is `motion-reduce:translate-none` — and it must be
                  `translate`, not `transform`. v4 emits the lift on the
                  standalone `translate` property (`.hover\:-translate-y-2:hover`
                  sets `--tw-translate-y` and `translate:`), which is what the
                  neighbouring `translate-y-[3px]` rules on the site also use.
                  `motion-reduce:transform-none` would compile fine and do
                  nothing at all. */}
              {/* Artwork header: the cutout alone, centred on a fixed-height
                  stage. `h-48` with `py-6` leaves a 144px content box, so
                  `h-full` on the image resolves to 144px and the four files
                  render at 219/158/144/134px wide — one visual weight across
                  the strip, which is the whole reason it is sized by height
                  rather than width.

                  Nothing sits behind the image any more, so the `isolate` that
                  the negative-z-index shape needed is gone with it. Nothing in
                  this box is positioned, so there is no stacking context to
                  trap.

                  `max-w-full` is load-bearing at this size: the 1.52:1 file
                  wants 219px, and the card content box is 226px at a 1280px
                  viewport but only ~162px at the 1024px `lg` breakpoint, where
                  the cap takes over and `object-contain` letterboxes the image
                  instead of letting it overflow. The images therefore do not
                  render at identical size at every breakpoint — the alternative
                  was cropping, or a shorter stage. */}
              <div className="flex h-48 w-full items-center justify-center py-6">
                <Image
                  src={guarantee.image}
                  alt={guarantee.imageAlt}
                  width={guarantee.imageWidth}
                  height={guarantee.imageHeight}
                  className="h-full w-auto max-w-full object-contain"
                  quality={90}
                />
              </div>

              {/* Light-surface pairing, and the flip that came with `bg-white`:
                  `text-charcoal` headings over `text-taupe` body is the same
                  pair every light card on the site uses. Measured on pure
                  white, taupe is 7.56:1 and charcoal ~17.8:1.

                  `mb-3` is the title's own margin, so the card carries no
                  `gap-*`. Leaving both in place would have stacked them —
                  flex `gap` and margin both apply between two children — and
                  given the image 20px above the title and 32px below it. The
                  image stage's own `py-6` supplies the space above instead.

                  `justify-between` is on the card, and it is worth being precise
                  about what it does here. The four cards come out 451-479px
                  tall naturally, so `min-h-[440px]` is already exceeded and
                  there is no free space to distribute on the tallest card. On
                  the cards that run short, `justify-between` splits the
                  remainder above the title and above the body — which moves
                  those titles off the shared baseline by up to ~14px, the
                  thing the fixed h-48 stage above exists to guarantee. Cards
                  whose body copy wraps to the same number of lines as the
                  tallest card's are unaffected. Drop `justify-between` if the
                  baseline matters more than bottom-anchoring the copy. */}
              <h3 className="mb-3 font-display font-bold text-xl tracking-tight text-charcoal md:text-2xl">
                {guarantee.title}
              </h3>
              <p className="text-base leading-relaxed text-taupe">
                {guarantee.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}