import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { IndustriesHero } from "@/sections/IndustriesHero";
import { IndustriesList } from "@/sections/IndustriesList";
import { ComplianceAssurance } from "@/sections/ComplianceAssurance";
import { Testimonials } from "@/sections/Testimonials";
import { IndustriesFaq } from "@/sections/IndustriesFaq";
import { CtaBand } from "@/sections/CtaBand";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Corporate gifting for technology, healthcare, finance, retail, professional services and manufacturing — sector-aware rewards, policy-compliant and audit-ready fulfilment.",
  alternates: {
    canonical: "/industries",
  },
  openGraph: {
    title: "Fulfill Nest Industries — Gifting built for your sector",
    description:
      "Sector-aware rewards programmes for technology, healthcare, finance, retail, services and manufacturing.",
    url: "/industries",
    images: [
      {
        url: "/hero-services.jpg",
        width: 1600,
        height: 900,
        alt: "Curated corporate gifting across industries",
      },
    ],
  },
};

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Industries", path: "/industries" }])} />
      <Navigation />
      <main>
        <IndustriesHero />
        <IndustriesList />
        <ComplianceAssurance />
        {/* `IndustryCaseStudies` ("Sector success stories") was removed here;
            its three case-study metrics now live as the `proof` micro-pills in
            the `IndustriesList` cards above, so the page keeps the proof and
            loses the duplicate section.

            `divider={false}` because `ComplianceAssurance` is `border-y` and its
            bottom rule already lands on exactly the line `Testimonials` would
            put a `border-t` on — leaving both renders a 2px seam. This is NOT
            the same reason /services passes `divider={false}`: there the two
            bands were both #ffffff and the divider was the only possible edge,
            whereas here `ComplianceAssurance` is #f1eee7 against Testimonials'
            #ffffff, so the grounds separate on their own and the surviving
            `border-b` is the seam.

            Padding needs nothing: both carry `py-section`
            (clamp(5rem, 8vw, 6rem), i.e. py-24 at desktop), which is this
            site's standard doubled seam. `IndustryCaseStudies` also had
            `py-section`, so the gap is unchanged from before the removal. */}
        <Testimonials divider={false} />
        <IndustriesFaq />
        <CtaBand
          headline={
            <>
              Ready to align rewards with your sector&apos;s{" "}
              <em className="accent-em">rhythm</em>?
            </>
          }
          subtext="Whether healthcare shifts, tech remote teams, or finance compliance — let's craft a programme that respects your rules."
          buttonText="Talk to an Industry Specialist"
          buttonLink="/contact"
        />
      </main>
      <Footer />
    </>
  );
}