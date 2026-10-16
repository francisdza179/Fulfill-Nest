"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/* ----------------------------- Data ----------------------------- */

interface Capability {
  title: string;
  body: string;
  image: string;
  href: string;
}

const capabilities: Capability[] = [
  {
    title: "Curated Corporate Gifting Programs",
    body: "Thoughtfully designed gifting experiences built from premium, design-led brands — tailored for onboarding, milestones, festive seasons, and leadership events.",
    image: "/images/services-we-offer/curated-corporate-gifting-programs.jpg",
    href: "/gifts",
  },
  {
    title: "Employee Rewards & Culture Building",
    body: "Spot awards, peer-to-peer recognition, monthly/quarterly reward cycles, and curated appreciation kits that strengthen belonging and boost retention.",
    image: "/images/services-we-offer/employee-rewards-culture-building.png",
    href: "/gifts",
  },
  {
    title: "Channel & Partner Engagement Solutions",
    body: "Performance-based incentives, loyalty tiers, achievement kits, and personalized rewards that deepen distributor and partner relationships.",
    image: "/images/services-we-offer/channel-partner-engagement-solutions.png",
    href: "/gifts",
  },
  {
    title: "End-to-End Rewards Fulfillment",
    body: "In-house assembly, inventory management, custom packaging, and pan-India dispatch — ensuring every reward arrives beautifully and on time.",
    image: "/images/services-we-offer/end-to-end-rewards-fulfillment.png",
    href: "/gifts",
  },
  {
    title: "Digital Gift Cards & Voucher Management",
    body: "Multi-brand gift cards, curated voucher bundles, and enterprise-ready redemption workflows with automated tracking and reporting.",
    image: "/images/services-we-offer/digital-gift-cards-voucher-management.png",
    href: "/gifts",
  },
  {
    title: "Custom Branded Merchandise & Event Kits",
    body: "Premium corporate merchandise, conference kits, leadership retreat boxes, and fully branded experiences crafted to elevate your company's identity.",
    image: "/images/services-we-offer/custom-branded-merchandise-event-kits.png",
    href: "/gifts",
  },
];

/* ----------------------------- Animation ----------------------------- */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ----------------------------- Card ----------------------------- */

interface CapabilityCardProps {
  title: string;
  body: string;
  image: string;
  href: string;
  index: number;
}

function CapabilityCard({ title, body, image, href, index }: CapabilityCardProps) {
  void index;
  return (
    <motion.div
      variants={itemVariants}
      className="group flex h-full flex-col rounded-card border border-taupe/30 bg-white shadow-elev-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-primary/60 hover:shadow-elev-2 motion-reduce:translate-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-card bg-section-divider">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold tracking-tight text-charcoal">{title}</h3>
          <p className="text-base leading-relaxed text-taupe">{body}</p>
        </div>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal transition-colors duration-300 group-hover:text-brand-primary">
          <span className="border-b border-charcoal/0 pb-0.5 transition-all duration-300 group-hover:border-brand-primary/60">
            Explore
          </span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </motion.div>
  );
}

/* ----------------------------- Section ----------------------------- */

export function ServicesWeOffer() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="services-we-offer"
      className="relative overflow-hidden border-y border-section-divider bg-white py-section text-charcoal"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-brand-primary/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Services we <em className="accent-em">offer</em>
              </>
            }
            description="Turnkey corporate gifting and recognition — from the first curated shortlist to the last delivery update. One partner, end to end, with the operational accountability to match."
            align="left"
          />
        </div>

        <motion.div
          data-reveal-stagger
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reducedMotion ? undefined : containerVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((capability, index) => {
            const serviceAnchors = [
              "/services#corporate-gifting",
              "/services#employee-rewards",
              "/services#partner-engagement",
              "/services#rewards-fulfillment",
              "/services#digital-vouchers",
              "/services#branded-merchandise",
            ];
            return (
              <Link
                key={capability.title}
                href={serviceAnchors[index] ?? "/services"}
                className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
              <CapabilityCard index={index} {...capability} />
            </Link>
            );
          })}
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-section-divider pt-8">
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed text-taupe">
              Not sure which fits? Talk to us &mdash; 48 hours later you&rsquo;ll
              have a curated shortlist built around your budget, timelines and
              people.
            </p>
          </div>
          <Link
            href="/gifts"
            className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgb(168_59_36/0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8F301C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            Explore capabilities
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
