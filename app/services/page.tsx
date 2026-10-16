import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/sections/Navigation";
import { ChildHero } from "@/sections/hero/ChildHero";
import { HeroPhotoFrame } from "@/sections/hero/HeroPhotoFrame";
import { CtaBand } from "@/sections/CtaBand";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import { RotatingCubeText } from "@/components/ui/RotatingCubeText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditorialStatement } from "@/sections/EditorialStatement";
import { FaqList } from "@/sections/FaqList";
import type { FaqItem } from "@/lib/data";
import { serviceFaqs } from "@/lib/data";
import { ArrowRightIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Services",
  description:
    "End-to-end corporate gifting and employee recognition — curated gifting programmes, reward and culture initiatives, partner engagement, fulfilment, digital gift cards, and branded merchandise.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Fulfill Nest Services — End-to-end corporate gifting and recognition",
    description:
      "Curated corporate gifting, employee rewards, channel partner engagement, end-to-end fulfilment, digital gift cards, and branded merchandise.",
    url: "/services",
    images: [
      {
        url: "/images/services-we-offer/curated-corporate-gifting-programs.jpg",
        width: 1400,
        height: 1050,
        alt: "Curated corporate gifting programme by Fulfill Nest",
      },
    ],
  },
};

const capabilities = [
  {
    id: "corporate-gifting",
    title: "Curated corporate gifting programs",
    lead: "Thoughtfully designed gifting experiences for every milestone.",
    intro:
      "At Fulfill Nest, we curate premium gifting programs that elevate every moment of your employee journey — from onboarding and festive celebrations to leadership events and long-service milestones. Our team handpicks design-led products from trusted brands, builds themed collections, and tailors each kit to your culture, values, and budget.",
    insideTitle: "What’s included:",
    inside: [
      "Curated gift collections built around occasions, seasons, and employee milestones",
      "Premium products sourced from design-forward, high-quality brands",
      "Custom packaging, inserts, and brand-aligned presentation",
      "Options for personalization, monogramming, and custom merchandise",
      "Scalable solutions for small teams or enterprise-wide gifting cycles",
    ],
    why: "Thoughtful gifting strengthens belonging, reinforces culture, and creates memorable moments that employees genuinely value.",
    who: "HR Teams, People Operations, Executive Leadership, Admin Leads.",
    useCases: "Onboarding kits, work anniversaries, festive celebrations (Diwali, New Year), leadership retreats.",
    advantage: "Curated care, design-led gifting, pan-India fulfilment, SLA-driven operations, custom packaging, multi-industry relevance.",
    image: "/images/services-we-offer/curated-corporate-gifting-programs.jpg",
  },
  {
    id: "employee-rewards",
    title: "Employee rewards & culture building",
    lead: "Recognition frameworks that inspire performance, belonging, and loyalty.",
    intro:
      "Fulfill Nest helps you build modern employee recognition systems that celebrate everyday wins and major milestones alike. From spot awards to quarterly recognition cycles, we design reward frameworks that motivate teams, reinforce company values, and boost long-term retention.",
    insideTitle: "What’s included:",
    inside: [
      "Spot awards for instant appreciation",
      "Peer-to-peer recognition programs",
      "Monthly and quarterly reward cycles",
      "Value-based recognition aligned with your culture",
      "Milestone celebrations (work anniversaries, promotions, achievements)",
      "Curated reward kits and digital redemption options",
    ],
    why: "Recognition drives engagement. When employees feel seen, valued, and celebrated, they perform better and stay longer.",
    who: "HR Business Partners, Culture Managers, People Ops Leads, Department Heads.",
    useCases: "Spot bonuses, quarterly town-hall awards, peer appreciation programs, long-service celebrations.",
    advantage: "Curated care, design-led gifting, pan-India fulfilment, SLA-driven operations, custom packaging, multi-industry relevance.",
    image: "/images/services-we-offer/employee-rewards-culture-building.png",
  },
  {
    id: "partner-engagement",
    title: "Channel & partner engagement solutions",
    lead: "Incentive programs that deepen loyalty and drive performance.",
    intro:
      "Your distributors, dealers, and channel partners are an extension of your brand — and rewarding their performance builds stronger relationships. Fulfill Nest designs structured incentive programs that motivate partners, strengthen loyalty, and drive measurable business outcomes.",
    insideTitle: "What’s included:",
    inside: [
      "Tier-based incentive frameworks",
      "Achievement kits for sales milestones",
      "Loyalty programs with curated rewards",
      "Digital redemption platforms for seamless reward claiming",
      "Performance-based gifting cycles",
      "Custom merchandise for partner events and conferences",
    ],
    why: "Engaged partners sell more, stay loyal longer, and become ambassadors for your brand.",
    who: "Channel Heads, VP of Sales, Partner Marketing Teams, Regional Directors.",
    useCases: "Distributor sales incentives, dealer meet giveaways, annual channel partner awards, milestone achievement boxes.",
    advantage: "Curated care, design-led gifting, pan-India fulfilment, SLA-driven operations, custom packaging, multi-industry relevance.",
    image: "/images/services-we-offer/channel-partner-engagement-solutions.png",
  },
  {
    id: "rewards-fulfillment",
    title: "End-to-end rewards fulfillment",
    lead: "Reliable, scalable fulfilment engineered for consistency.",
    intro:
      "From sourcing and assembly to packaging and pan-India delivery, Fulfill Nest manages the entire fulfilment chain with precision. Every box is packed with care, checked for quality, and delivered on time — whether you’re sending 50 gifts or 50,000.",
    insideTitle: "What’s included:",
    inside: [
      "In-house assembly and kitting",
      "Inventory management and storage",
      "Custom packaging and brand-aligned presentation",
      "Address collection and verification for remote teams",
      "Pan-India delivery with real-time tracking",
      "SLA-driven operations for enterprise clients",
    ],
    why: "Operational excellence ensures every recipient gets a perfect, on-time experience — every single time.",
    who: "Procurement Leads, Operations Directors, Logistics Managers, Finance Controllers.",
    useCases: "Bulk festive dispatch, nationwide remote-employee drops, multi-location office distributions.",
    advantage: "Curated care, design-led gifting, pan-India fulfilment, SLA-driven operations, custom packaging, multi-industry relevance.",
    image: "/images/services-we-offer/end-to-end-rewards-fulfillment.png",
  },
  {
    id: "digital-vouchers",
    title: "Digital gift cards & voucher management",
    lead: "Instant, flexible digital rewards for modern teams.",
    intro:
      "For distributed teams or last-minute gifting needs, Fulfill Nest offers a wide range of digital gift cards and curated voucher bundles. Our digital rewards are easy to distribute, simple to redeem, and available across hundreds of premium brands.",
    insideTitle: "What’s included:",
    inside: [
      "Multi-brand gift cards",
      "Curated voucher bundles",
      "Instant digital delivery",
      "Redemption platforms with tracking",
      "Custom branded digital cards",
      "Options for bulk corporate purchases",
    ],
    why: "Digital rewards offer flexibility, speed, and choice — perfect for remote teams and fast-moving organizations.",
    who: "Remote People Teams, HR Managers, Startup Founders, Global Project Leads.",
    useCases: "Last-minute birthday gifting, virtual event giveaways, remote employee spot rewards, festival digital vouchers.",
    advantage: "Curated care, design-led gifting, pan-India fulfilment, SLA-driven operations, custom packaging, multi-industry relevance.",
    image: "/images/services-we-offer/digital-gift-cards-voucher-management.png",
  },
  {
    id: "branded-merchandise",
    title: "Custom branded merchandise & event kits",
    lead: "Fully personalized merchandise and kits for events, conferences, and leadership retreats.",
    intro:
      "Fulfill Nest creates premium branded merchandise and event kits that elevate your brand presence. From conference giveaways to leadership retreat boxes, every item is designed to reflect your identity and leave a lasting impression.",
    insideTitle: "What’s included:",
    inside: [
      "Custom corporate merchandise (apparel, accessories, stationery)",
      "Event kits for conferences, offsites, and leadership summits",
      "Personalized packaging and inserts",
      "Theme-based kits for onboarding, culture events, and celebrations",
      "Bulk production with quality assurance",
      "Pan-India delivery for multi-location events",
    ],
    why: "Branded merchandise builds identity, strengthens culture, and enhances every event experience.",
    who: "Event Teams, Marketing Directors, Brand Managers, Executive Assistants.",
    useCases: "Annual conferences, company offsites, executive leadership retreats, product launch swag bags.",
    advantage: "Curated care, design-led gifting, pan-India fulfilment, SLA-driven operations, custom packaging, multi-industry relevance.",
    image: "/images/services-we-offer/custom-branded-merchandise-event-kits.png",
  },
];

const servicesFaqs: FaqItem[] = [
  {
    question: "How does Fulfill Nest handle multi-city or pan-India reward dispatches?",
    answer:
      "We manage end-to-end pan-India logistics from our central assembly hubs with real-time tracking, live proof of delivery, and individual recipient notifications.",
  },
  {
    question: "Can HR teams get custom-branded portal access for recurring employee milestones?",
    answer:
      "Yes, we provide dedicated enterprise dashboard access with automated calendar triggers for birthdays, work anniversaries, and spot recognition.",
  },
  {
    question: "What is your turnaround time for curated gift shortlists?",
    answer:
      "Once we understand your budget, recipient demographics, and brand guidelines, our curation leads deliver a tailored shortlist within 48 hours.",
  },
  {
    question: "How do you handle GST compliance and corporate billing?",
    answer:
      "We provide complete enterprise-ready documentation, automated GST-compliant invoicing, and transparent consolidated billing to simplify procurement reconciliation.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <Navigation />
      <main>
        <ChildHero
          eyebrow="Our services"
          title={
            <>
              Curated gifting, crafted for modern{" "}
              <RotatingCubeText
                phrases={["workplaces", "leaders", "teams", "moments", "ecosystems"]}
                align="start"
                className="!text-[#a83b24]"
              />
            </>
          }
          description="From the first curated shortlist to the last delivery update, we pair human curation with enterprise-grade fulfilment so every reward moment lands beautifully."
          visual={
            <HeroPhotoFrame
              src="/images/heroes/services-hero.png"
              alt="Curated corporate gifting designed by Fulfill Nest"
              preload
            />
          }
          canvas="flat"
          surface="light"
          columns="even"
          actions={[
            { href: "/contact", label: "Book a consultation", variant: "primary" },
            { href: "/contact", label: "Talk to our strategists", variant: "secondary" },
          ]}
        />

        <section className="bg-canvas py-section">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-20 md:gap-28">
              {capabilities.map((capability, index) => {
                const reversed = index % 2 === 1;
                return (
                  <div
                    key={capability.title}
                    id={capability.id}
                    className={`grid scroll-mt-24 items-center gap-10 md:grid-cols-2 md:gap-16 ${reversed ? "md:[&>:first-child]:order-2" : ""}`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-section-divider bg-white shadow-elev-1">
                      <Image
                        src={capability.image}
                        alt={capability.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h2 className="text-display text-charcoal">
                        {capability.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <em
                          className="italic"
                          style={{ color: "var(--color-brick-red, #a83b24)" }}
                        >
                          {capability.title.split(" ").slice(-1)[0]}
                        </em>
                      </h2>
                      <p className="mt-4 text-body-lg font-semibold text-charcoal max-w-xl">
                        {capability.lead}
                      </p>
                      <p className="mt-3 text-body-lg text-taupe max-w-xl">
                        {capability.intro}
                      </p>

                      <p className="mt-6 text-body font-semibold text-charcoal">
                        {capability.insideTitle}
                      </p>
                      <ul className="mt-3 space-y-3">
                        {capability.inside.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-body text-charcoal/80"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-5 text-body-lg text-taupe max-w-xl">
                        <span className="font-semibold text-charcoal">Why it matters:</span>{" "}
                        {capability.why}
                      </p>
                      <p className="mt-4 text-body text-charcoal/80 max-w-xl">
                        <span className="font-semibold text-charcoal">Who it’s for:</span>{" "}
                        {capability.who}
                      </p>
                      <p className="mt-2 text-body text-charcoal/80 max-w-xl">
                        <span className="font-semibold text-charcoal">Use cases:</span>{" "}
                        {capability.useCases}
                      </p>
                      <p className="mt-2 text-body text-charcoal/80 max-w-xl">
                        <span className="font-semibold text-charcoal">Fulfill Nest advantage:</span>{" "}
                        {capability.advantage}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                          href={`/services#${capability.id}`}
                          className="inline-flex items-center gap-1.5 rounded-pill border border-charcoal/15 bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors duration-300 hover:border-brand-primary hover:text-brand-primary"
                        >
                          Explore
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 rounded-pill bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8F301C]"
                        >
                          Book a consultation
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <EditorialStatement>
          Structured gifting services built for modern{" "}
          <em className="font-medium italic" style={{ color: "var(--color-brick-red, #a83b24)" }}>
            teams.
          </em>
        </EditorialStatement>

        <FaqList
          items={serviceFaqs}
          divider={false}
          eyebrow="Services FAQs"
          title={
            <>
              Operational insights to help you{" "}
              <em className="accent-em">scale</em>
            </>
          }
          description="MOQs, SLAs, custom swag integration, address verification, and corporate billing — everything teams need before they brief us."
          link={{ href: "/contact", label: "Ask a specific question" }}
        />

        <CtaBand
          headline="Ready to scale your corporate gifting with absolute precision?"
          subtext="Speak with our enterprise strategists to design a custom reward programme tailored to your company culture."
          buttonText="Schedule a strategy call →"
          buttonLink="/contact"
        />
      </main>
      <Footer />
    </>
  );
}

