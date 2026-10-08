import { testimonials } from "@/lib/data";
import { TestimonialV3Slider } from "@/components/testimonials/TestimonialV3Slider";

/**
 * About-page testimonial: a two-column split, fixed editorial block on the
 * left, one-quote slider on the right.
 *
 * REPLACES the twelve-card `AboutTestimonials` carousel this sat alongside.
 * Both read the same `testimonials` array, and rendering both put two
 * testimonial bands back to back between `TeamSpotlight` and `CtaBand`, so
 * this took the carousel's slot in the narrative and the carousel's
 * `TestimonialCarouselClient.tsx` is left on disk unreferenced should the
 * multi-card version be wanted back. The homepage band is a separate section
 * and is untouched.
 *
 * LOCATION: the brief asked for `sections/about/TestimonialV3Section.tsx`.
 * There is no `sections/about/`, and no `sections/pricing/` or
 * `sections/industries/` either — `sections/` is flat apart from
 * `sections/hero/`, which is where the shared hero photo frame lives. So this
 * is `sections/TestimonialV3Section.tsx`, beside `AboutStory`, `AboutHero` and
 * `TeamSpotlight`.
 *
 * THE `testimonial-v3-section` CLASS. The brief asked to match
 * `div.testimonial-v3-section`; nothing in the repo defines it, so it is
 * carried here as a literal class on the band. It is a plain hook, not a
 * styled class: no `testimonial-v3-section` rule exists in `globals.css`, so
 * it styles nothing and costs one string. If it is meant to match an external
 * stylesheet or a Caroo reference, that stylesheet is not in this project and
 * the class will need its rule brought over too.
 *
 * SURFACE: `bg-surface`, matching `TeamSpotlight` directly above it, which the
 * brief asked for. It was `bg-linen` when the slider card was the white object;
 * with the band on white the card is now `bg-linen` instead, so the pairing
 * inverted rather than collapsing into a white card on a white band.
 *
 * Worth knowing, since it is the reason this band has no visual top edge: white
 * here means the `border-t border-section-divider` hairline is now the only
 * thing separating it from `TeamSpotlight` above, which is the same
 * identical-whites adjacency the `divider` prop on the homepage `Testimonials`
 * section documents as a reason to opt its hairline out. Matching the section
 * above is a deliberate instruction and this is its cost. `CtaBand` below is
 * `bg-bg-canvas` (#fbf9f5) and draws its own `border-y`, so that edge is
 * unaffected.
 *
 * The left column deliberately does NOT use `SectionHeading`. That component
 * requires an `eyebrow` and caps itself at `max-w-2xl`; the brief specifies a
 * fixed editorial block with a headline and a paragraph and no eyebrow, and a
 * two-column split at `lg` leaves the left half far narrower than `max-w-2xl`
 * anyway. The house heading type is applied by hand — `text-display`,
 * `text-body-lg`, `text-eyebrow` — and the accent idiom is the same
 * `accent-em` the rest of the site uses, one per heading.
 */
export function TestimonialV3Section() {
  return (
    <section className="testimonial-v3-section relative overflow-hidden border-t border-section-divider bg-surface py-section">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div data-reveal-header className="flex max-w-xl flex-col gap-6 text-left">
          <p className="text-eyebrow uppercase text-eyebrow-gray">
            Testimonials
          </p>

          <h2 className="text-display text-charcoal">
            What companies say about{" "}
            <em className="accent-em">us</em>
          </h2>

          {/* Verbatim from the brief, including the two-sentence run-on, which
              reads as voice rather than as an error against the site's usual
              two-sentence leads. */}
          <p className="text-body-lg leading-relaxed text-taupe">
            We know what we&rsquo;re good at delivering perfectly and we
            &rsquo;ll never make promises we can&rsquo;t keep. That also means
            giving you clear, transparent pricing with no surprises or hidden
            fees.
          </p>
        </div>

        <div data-reveal-item>
          <TestimonialV3Slider items={testimonials} />
        </div>
      </div>
    </section>
  );
}
