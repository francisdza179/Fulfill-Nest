import { stats } from "@/lib/data";
import { CountUp } from "@/components/ui/CountUp";

/**
 * Proof-stat band — Antavo-inspired objective numbers.
 * Three translucent cards with giant grotesk numerals resting in brand
 * sage, each with a warm hover: lift, deeper shadow, green border, and the
 * numeral + divider warming to copper/terracotta accents.
 */
export function ProofStats() {
  return (
    <section className="relative bg-mist pb-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.slice(0, 3).map((stat, index) => (
            <div
              key={stat.label}
              className="group rounded-card border border-brand-green-950/10 bg-warm-grey/80 px-8 py-10 text-left shadow-elev-1 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-green-600/40 hover:bg-mist hover:shadow-card-hover"
            >
              <CountUp
                value={stat.value}
                className="stat-numeral text-6xl text-brand-green-700 transition-colors duration-300 group-hover:text-copper md:text-7xl"
              />
              <p className="mt-3 text-sm font-medium text-taupe transition-colors duration-300 group-hover:text-walnut">
                {stat.label}
              </p>
              <div
                className={`mt-6 h-px w-12 bg-sand transition-all duration-300 group-hover:w-20 group-hover:bg-brand-green-700 ${
                  index === 1 ? "bg-brand-green-500/60 group-hover:bg-brand-green-700" : ""
                }`}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}