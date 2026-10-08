import { CountUp } from "@/components/ui/CountUp";
import { HeroShell } from "./HeroShell";

const stats = [
  {
    value: "99%",
    label: "On-time fulfilment",
    note: "measured across 40,000+ orders",
  },
  {
    value: "200+",
    label: "HR & CXO teams",
    note: "trust Fulfill Nest every quarter",
  },
  {
    value: "4.9/5",
    label: "Average rating",
    note: "from programme owners",
  },
  {
    value: "₹1.2 Cr+",
    label: "Rewards delivered",
    note: "in gifts dispatched last year",
  },
];

/**
 * Hero variant 4 — Stat count-up band. Copy sits in a single column and
 * a full-width data band animates up beneath it. Note: ProofStats below
 * covers similar ground — if this variant wins, we slim ProofStats to
 * avoid repeating the same numbers.
 */
export function HeroStats() {
  return <HeroShell band={<StatBand />} />;
}

function StatBand() {
  return (
    <div className="mt-14 border-t border-sand pt-10 md:mt-16">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="font-grotesk text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              <CountUp value={stat.value} />
            </dt>
            <dd>
              <p className="mt-2 text-sm font-medium text-walnut">
                {stat.label}
              </p>
              <p className="mt-0.5 text-xs text-taupe">{stat.note}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}