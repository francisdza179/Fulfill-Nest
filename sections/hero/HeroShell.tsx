import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StarIcon } from "@/components/ui/Icons";

/**
 * Shared home-hero frame: warm glow, asymmetric split (or single column
 * with a band), statement copy on the left, and a pluggable `visual` —
 * the right-hand visual of the day. Keeps every hero variant consistent
 * in voice and rhythm.
 */
export function HeroShell({
  visual,
  band,
}: {
  visual?: ReactNode;
  band?: ReactNode;
}) {
  const copy = (
    <>
      <p className="text-eyebrow uppercase text-eyebrow-gray">
        Corporate rewards, gifting &amp; recognition
      </p>
      <h1 className="mt-6 text-display-xl text-charcoal">
        Reward programmes that spark lasting connection and prove their{" "}
        <em className="accent-em">worth</em>
      </h1>
      <p className="mt-6 text-body-lg text-taupe">
        Cut reward costs, lift retention and fuel recognition with Fulfill
        Nest — premium corporate gifting perfected for measurable results, not
        just well-wrapped boxes.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <ButtonLink href="/gifts" variant="secondary">
          Explore corporate gifting
        </ButtonLink>
        <ButtonLink href="/contact" variant="solidAccent">
          Book a consultation
        </ButtonLink>
      </div>
      <div className="mt-8 flex items-center gap-4">
        <div
          className="flex items-center gap-1 text-gold-500"
          aria-label="Rated 4.9 out of 5"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="h-4 w-4" />
          ))}
        </div>
        <p className="text-sm text-walnut">
          Trusted by{" "}
          <strong className="font-semibold text-charcoal">
            200+ HR &amp; CXO teams
          </strong>
        </p>
      </div>
    </>
  );

  return (
    <section data-reveal-exempt className="relative overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ backgroundImage: "var(--background-image-hero-glow)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-green-900/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24">
        {visual ? (
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-xl">{copy}</div>
            {visual}
          </div>
        ) : (
          <>
            <div className="max-w-3xl">{copy}</div>
            {band}
          </>
        )}
      </div>
    </section>
  );
}
