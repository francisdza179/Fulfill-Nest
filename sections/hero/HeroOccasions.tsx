import { HeroShell } from "./HeroShell";

interface OccasionCard {
  tag: string;
  title: string;
  note: string;
  amount: string;
}

const occasions: OccasionCard[] = [
  {
    tag: "Diwali · Festival Hamper",
    title: "Gifts that land across India",
    note: "Delivered to 140 homes, on time",
    amount: "₹2,500",
  },
  {
    tag: "5-Year Milestone",
    title: "A moment worth remembering",
    note: "Personal note from the CHRO",
    amount: "₹3,800",
  },
  {
    tag: "Team Win · Launch",
    title: "Great launch, celebrated",
    note: "Everyone got a share of the win",
    amount: "₹1,800",
  },
  {
    tag: "Wellness Month",
    title: "Because they carry the load",
    note: "Curated self-care, quarterly",
    amount: "₹2,200",
  },
];

/**
 * Hero variant 1 — Occasion card collage. A stack of four real programme
 * moments (Diwali, milestone, team win, wellness) showing the breadth of
 * what Fulfill Nest delivers, in INR, with an overlap-and-tilt editorial
 * feel. No motifs — the occasions carry the visual weight.
 */
export function HeroOccasions() {
  return <HeroShell visual={<OccasionCollage />} />;
}

function OccasionCollage() {
  const spread = [
    "ml-3 -rotate-[2.5deg]",
    "mr-2 rotate-[1.8deg]",
    "ml-2 -translate-y-1 -rotate-[1.5deg]",
    "-rotate-[0.5deg]",
  ];

  return (
    <div className="relative mx-auto w-full max-w-md py-2">
      <div className="flex flex-col items-center">
        {occasions.map((occasion, i) => (
          <div
            key={occasion.tag}
            className={`relative w-[86%] rounded-card border border-sand bg-white p-4 pr-5 shadow-elev-2 sm:p-5 ${
              spread[i]
            } ${i < occasions.length - 1 ? "-mb-10 sm:-mb-12" : ""}`}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-eyebrow uppercase text-eyebrow-gray">
                  {occasion.tag}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-charcoal sm:text-base">
                  {occasion.title}
                </p>
                <p className="mt-0.5 text-xs text-taupe">{occasion.note}</p>
              </div>
              <p className="shrink-0 font-grotesk text-lg font-bold tracking-tight text-charcoal">
                {occasion.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
