import { StarIcon } from "@/components/ui/Icons";
import { HeroShell } from "./HeroShell";

/**
 * Hero variant 3 — Client voice. A large editorial quote card (dark
 * charcoal for contrast against the light hero) from an HR leader,
 * with attribution and the 4.9/5 stars. Human, premium, magazine-like.
 */
export function HeroQuote() {
  return <HeroShell visual={<ClientQuote />} />;
}

function ClientQuote() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden="true"
        className="absolute inset-0 -translate-y-3 translate-x-3 rounded-card bg-accent-100"
      />
      <figure className="relative flex flex-col rounded-card border border-ink/10 bg-charcoal p-7 text-darktext shadow-elev-3 sm:p-8">
        <span
          aria-hidden="true"
          className="font-display text-6xl leading-none text-accent-600"
        >
          &ldquo;
        </span>
        <blockquote className="mt-2 text-lg font-medium leading-8 tracking-tight sm:text-xl sm:leading-9">
          Our eNPS moved 22 points in six months. The rewards finally matched
          the culture we wanted to build.
        </blockquote>
        <figcaption className="mt-6 border-t border-dark-line pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-darktext">
                Head of People
              </p>
              <p className="mt-0.5 text-xs text-darktext/70">
                Finlight · 400-person team
              </p>
            </div>
            <div
              className="flex items-center gap-1 text-gold-500"
              aria-label="Rated 4.9 out of 5"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}