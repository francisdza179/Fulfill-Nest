import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { PricingHero } from "@/sections/PricingHero";
import { PricingCalculator } from "@/sections/PricingCalculator";
import { PricingTiers } from "@/sections/PricingTiers";
import { PricingFaq } from "@/sections/PricingFaq";
import { TrustBand } from "@/sections/TrustBand";
import { Testimonials } from "@/sections/Testimonials";
import { CtaBand } from "@/sections/CtaBand";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/schema";
import { pricingFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Corporate gifting pricing that scales with your programme — from a single curated box to enterprise fulfilment. Transparent tiers, tailored quotes.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Fulfill Nest Pricing — Programmes that scale with you",
    description:
      "Starter, Growth and Enterprise gifting plans. Every estimate starts with a conversation.",
    url: "/pricing",
    images: [
      {
        url: "/hero-contact.jpg",
        width: 1600,
        height: 900,
        alt: "Corporate gifting pricing and packages",
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Pricing", path: "/pricing" }])} />
      {/* `PricingFaq` below renders this array. */}
      <JsonLd data={faqPageSchema(pricingFaqs)} />
      <Navigation />
      <main>
        <PricingHero />
        <PricingCalculator />
        <PricingTiers />
        <TrustBand />
        <Testimonials />
        <PricingFaq />
        <CtaBand
          headline={
            <>
              Need a transparent estimate for an upcoming{" "}
              <em className="accent-em">campaign</em>?
            </>
          }
          subtext="Get a clear, line-item proposal with zero hidden fees or freight surprises."
          buttonText="Request a Custom Quote"
          buttonLink="/contact"
        />
      </main>
      <Footer />
    </>
  );
}