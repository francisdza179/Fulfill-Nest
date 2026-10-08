import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CheckIcon, StarIcon } from "@/components/ui/Icons";
import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { formatPrice } from "@/lib/data";

/**
 * Home hero — editorial split: statement copy on the left, and a
 * "reward claim" card mockup on the right that makes the value
 * tangible (gift photo, INR value, proof chips). Deliberately
 * free of decorative shape motifs — the product proof itself
 * carries the visual weight.
 */
export function Hero() {
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
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <p className="text-eyebrow uppercase text-eyebrow-gray">
            Corporate rewards, gifting &amp; recognition
          </p>
          <h1 className="mt-6 text-display-xl text-charcoal">
            Reward programmes that spark lasting connection and prove their
            <RotatingCubeText
              phrases={["worth", "value", "impact", "results"]}
              stableLayout
              align="center"
              className="block"
            />
          </h1>
          <p className="mt-6 text-body-lg text-taupe">
            Cut reward costs, lift retention and fuel recognition with Fulfill
            Nest — premium corporate gifting perfected for measurable results,
            not just well-wrapped boxes.
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
                <StarIcon key={i} className="h-4 w-4" fill="currentColor" />
              ))}
            </div>
            <p className="text-sm text-walnut">
              Trusted by{" "}
              <strong className="font-semibold text-charcoal">
                200+ HR &amp; CXO teams
              </strong>
            </p>
          </div>
        </div>

        <div className="hidden md:block">
          <RewardClaimCard />
        </div>
      </div>
    </section>
  );
}

/**
 * Mock "reward claim" card — a tangible slice of the platform: the gift
 * delivery, the INR value, and the proof chips. All controls are inert
 * (mockup), so they are hidden from assistive tech.
 */
function RewardClaimCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Offset back card for editorial depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-card border border-sand bg-linen"
      />
      <div className="relative overflow-hidden rounded-card border border-sand bg-white shadow-elev-2">
        <div className="relative aspect-[3/2]">
          <Image
            src="/hero-contact-gift-box.jpg"
            alt="A styled corporate gift box wrapped with ribbon"
            fill
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-charcoal">
            A gift from the people team
          </p>
          <p className="mt-0.5 text-xs text-taupe">
            For Priya Sharma · 5-year milestone
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-y border-sand/70 py-3.5">
            <p className="font-grotesk text-2xl font-bold tracking-tight text-charcoal">
              {formatPrice(2500)}
            </p>
            <span className="rounded-pill bg-brand-green-100 px-3 py-1 text-xs font-medium text-brand-green-800">
              Ready to claim
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2.5" aria-hidden="true">
            <span className="inline-flex items-center justify-center rounded-pill bg-accent-600 px-4 py-2 text-xs font-medium text-white">
              Claim reward
            </span>
            <span className="inline-flex items-center justify-center rounded-pill border border-sand px-4 py-2 text-xs font-medium text-charcoal">
              Send thanks
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs text-taupe">
              <CheckIcon className="h-4 w-4 text-accent-700" />
              99% on-time fulfilment
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-taupe">
              <CheckIcon className="h-4 w-4 text-accent-700" />
              GST &amp; billing compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
