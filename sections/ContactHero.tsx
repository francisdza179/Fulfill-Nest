import { ContactForm } from "@/components/forms/ContactForm";
import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { ChildHero } from "@/sections/hero/ChildHero";

/**
 * The rotating accent word in "Let's deliver something ___".
 *
 * Module scope, as on `/services`, `/about` and `/pricing`: a fresh array on
 * every render would churn `RotatingCubeText`'s measurement pass, which is
 * keyed off a string signature of the phrases.
 *
 * Strictly lowercase — the site-wide heading rule is sentence case (only the
 * heading's first word is capitalised), and every other flipped hero keeps its
 * rotating set lowercase for the same reason.
 *
 * The set is NOT equal-length: `creative` is 8 characters against 12 for
 * `appreciative`. That spread is why the call site reserves the widest word
 * rather than letting the box track the active one.
 */
const BUILD_WORDS = [
  "creative",
  "meaningful",
  "purposeful",
  "appreciative",
  "thoughtful",
] as const;

function ContactVisual() {
  return (
    <div className="mx-auto min-w-0 w-full max-w-xl">
      {/* `@container` is what the form's own two-up field grid queries. It has
          to be the CARD, not the form: the query resolves against this
          element's content box, which is the card width less the 2.5rem
          padding — i.e. the space the fields actually have to work with. Putting
          it any higher would measure the whole hero column and over-report. */}
      <div className="@container rounded-card border border-black/8 bg-white p-10 shadow-[0_24px_70px_rgb(54_67_59/0.12)]">
        <p className="text-eyebrow uppercase text-eyebrow-gray">
          Start a conversation
        </p>
        <h2 className="mt-3 font-display text-2xl text-charcoal sm:text-3xl">
          Tell us a little about your company
        </h2>
        <p className="mt-2 text-sm leading-6 text-taupe">
          A gifting specialist follows up within 24 hours.
        </p>
        <ContactForm className="mt-7" />
      </div>
    </div>
  );
}

/**
 * Contact hero — "Let's deliver something thoughtful".
 *
 * The H1's accent word is animated by `RotatingCubeText` — the same flipper
 * the homepage, `/services`, `/about`, `/pricing` and `/industries` heroes
 * use — rather than a static `HeroEm`. See `BUILD_WORDS` above for the set and
 * for why the call site reserves the widest word.
 *
 * Fifth route on the standardised split-column architecture, and the one that
 * had to diverge from it. It now takes the same three per-page opt-ins as
 * `/services`, `/industries`, `/pricing` and `/about` (`canvas="flat"`,
 * `surface="light"`, `columns="even"`), which is what the token-alignment brief
 * asked for: a solid `#fbf9f5` canvas, the flat 5rem/4rem rhythm, the exact
 * `1fr 1fr` split, and the 520px lead measure that split forces.
 *
 * What did NOT change, and why:
 *
 *   The `visual` slot still holds `ContactVisual` — the live `ContactForm`.
 *   This is the reason Contact cannot be made to look like the other four.
 *   `ContactForm` is mounted nowhere else in the codebase: `app/contact/page.tsx`
 *   renders `ContactHero`, one three-step "what happens next" list and the
 *   footer, and the form exists only in this slot. Swapping it for a
 *   `HeroPhotoFrame` — which is what "identical to Services" would mean
 *   literally — would delete the site's only enquiry-submission path.
 *
 *   For the same reason there is still no brick-red primary CTA. The
 *   `variant="accent"` submit inside the form panel is this page's conversion
 *   action; a second brick button beside it would be two competing primaries.
 *   The single `secondary` that remains is deliberate rather than a leftover:
 *   with the supporting cards gone, the hero needs one action, not a pair, and
 *   the form's submit is already the primary.
 *
 * The right column is the form panel, and it now wears the *form* half of the
 * standardised visual contract rather than a bespoke one: opaque `bg-white`
 * (was `bg-white/90` with a `backdrop-blur-sm` that had nothing behind it to
 * blur, on a flat canvas), `rounded-card` (20px — `--radius-card` is 1.25rem;
 * the old `rounded-panel` was 24px), a flat `p-10` (2.5rem, replacing the
 * responsive `p-6 sm:p-8` that made the panel's own padding change across the
 * breakpoint), and `border-black/8` for the specified `1px solid rgba(0,0,0,.08)`
 * (`border-charcoal/10` was 10% of #111827, not 8% black). The
 * `shadow-[0_24px_70px_…]` is kept: the brief specifies a shadow for the
 * photograph variant, and silently dropping the form's lift would leave it
 * floating on the canvas with no edge at all.
 *
 * The floating "Audit-ready from day one" chip is gone, along with the `pb-16`
 * and `pl-5 sm:pl-8` on the visual wrapper that existed only to reserve room for
 * it. That is a strict improvement beyond the brief: it was the last floating
 * overlay on any of the five standardised heroes, and dropping it also lets the
 * card sit flush in its column, where `HeroPhotoFrame` sits on the other four.
 * The claim it carried ("GST itemised · NDA on request") is a billing assurance
 * that belongs in the form's own supporting copy, not in a chip overlapping the
 * fields.
 *
 * The card is a `@container`, and the form's two-up field grid queries it — see
 * `ContactForm`. That is what keeps the name/email pair from being crushed to
 * ~124px each in the 352px column the 768px split produces between 768 and
 * 1023px.
 *
 * Everything below the headline and beside the form is gone. The hero is now
 * exactly six elements: eyebrow, H1, lead, one CTA, the form card, and the
 * section's own padding. Removed:
 *
 *   - the two `metrics` icon cards ("< 24h response", "Dedicated manager"),
 *     passed as `children`;
 *   - the "What to expect" three-column `trustPoints` block, also `children`;
 *   - the four-card `stats` bar ("24h", "48h", "200+", "100%").
 *
 * The `children` prop is now unused here, which is what makes the left column
 * strictly eyebrow → H1 → lead → CTA. The `stats` removal is the more
 * interesting one, because it reverses a decision recorded above: those figures
 * were kept on the argument that a percentage next to a form is a live claim the
 * form has to honour. That argument has now been overruled, and the reversal is
 * worth recording rather than quietly editing away — the claims were not wrong,
 * they were just clutter competing with a single conversion action. Note the
 * honest residue: "Audit-ready / GST itemised billing" was the only place on
 * this page that assurance appeared, and it is not restated anywhere in the
 * hero. `app/contact/page.tsx` still renders its own three-step "what happens
 * next" list below the hero, which is where process copy belongs.
 *
 * Removing `stats` also makes the 5rem/4rem rhythm exact rather than
 * approximate: with no stats row beneath the grid, the container's `pb-16` is
 * the section's whole bottom padding.
 *
 * `&rsquo;` rather than `&apos;` for the possessive apostrophe: it renders the
 * typographically correct U+2019, and as an HTML entity it cannot be corrupted
 * by the CP1252 round-trip that mangled 121 curly quotes across the codebase.
 *
 * "thoughtful" is an accent word on three routes — it closes the `/about` CTA
 * band and it is the last entry in `BUILD_WORDS` above. Same word, different
 * pages, but worth knowing if the accent word set is meant to be distinctive.
 */
export function ContactHero() {
  return (
    <ChildHero
      canvas="flat"
      surface="light"
      columns="even"
      eyebrow="Get in touch"
      title={
        <>
          Let&rsquo;s deliver something{" "}
          <RotatingCubeText
            phrases={BUILD_WORDS}
            /* The word is the last token of the sentence, so the reserved box
               extends into empty space rather than displacing anything after
               it. The reservation itself is load-bearing: the wrapper is an
               inline-block inside the h1, so its own width decides where the
               h1 breaks, and an 8→12 character swing is enough to cross a line
               boundary at some viewport widths — which would add or remove a
               whole line and shift the lead, the CTA and the form panel
               vertically, on a loop.

               `align="start"` keeps the slack that reservation creates to the
               right of the word, so it stays flush after "something " instead
               of centring an 8-character word inside a 12-character box.

               No timing props: the component's defaults (4s hold / 0.7s flip /
               cubic-bezier(0.16, 1, 0.3, 1)) are the homepage hero's cadence,
               so this hero animates on the same timeline as the other six.
               `whitespace-nowrap` matches every other call site. */
            stableLayout
            align="start"
            className="whitespace-nowrap"
          />
        </>
      }
      description="Have a question about our gifting plans, custom packaging, or global fulfilment? Our team is ready to help you get started."
      visual={<ContactVisual />}
      /* Contact is the one hero whose primary action is not a hero button: the
         brick-red `variant="accent"` submit inside the form panel in the visual
         slot is the conversion action, and putting a second brick button beside
         it would be two competing primaries. It gets a secondary instead, so
         the pair still reads as primary + supporting. */
      actions={[
        {
          href: "/gifts",
          label: "Browse services first",
          variant: "secondary",
        },
      ]}
    />
  );
}
