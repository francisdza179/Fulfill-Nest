import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { ServicesHero } from "@/sections/ServicesHero";
import { ProductCatalog } from "@/sections/ProductCatalog";
import { SolutionsTabs } from "@/sections/SolutionsTabs";
import { ServiceTiers } from "@/sections/ServiceTiers";
import { Testimonials } from "@/sections/Testimonials";
import { ServicesFaq } from "@/sections/ServicesFaq";
import { CtaBand } from "@/sections/CtaBand";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Gifts",
  description:
    "Employee rewards, festive gifting, channel incentives and enterprise fulfilment — four solutions, one standard: thoughtful.",
  alternates: {
    canonical: "/gifts",
  },
  openGraph: {
    title: "Fulfill Nest Gifts — Reward, celebrate, incentivise",
    description:
      "Employee rewards & recognition, festive gifting, channel incentives and enterprise fulfilment.",
    url: "/gifts",
    images: [
      {
        /* Kept in step with `ServicesHero`'s `HeroPhotoFrame`: the hero renders
           `/images/heroes/services-hero.jpg`, so the social card points at the
           same file rather than the orphaned 6000x4000 flatlay it replaced.
           width/height are the real intrinsic dimensions of that asset, not the
           previous source's 1600x900, which described no file on disk. */
        url: "/images/heroes/services-hero.jpg",
        width: 1920,
        height: 1080,
        alt: "Neatly arranged corporate gift items photographed flatlay in studio light",
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "Gifts", path: "/gifts" }])}
      />
      <Navigation />
      <main>
        <ServicesHero />
        <ProductCatalog />
        <SolutionsTabs />
        <ServiceTiers />
        {/* `CaseStudyTeaser` — the "Proven impact" band — was removed here, so
            `ServiceTiers` and `Testimonials` are now adjacent.

            The seam needs nothing added to it. Both carry `py-section`
            (clamp(5rem, 8vw, 6rem) — 80-96px), so the gap is the site's usual
            doubled section padding rather than a single band's worth, and
            `py-24` is what it resolves to at desktop. No extra `py-*` belongs
            here: adding one would make this seam wider than every other on the
            site.

            The hairline is `Testimonials`' own `border-t`, which is that
            component's default — hence no prop is passed. This is the same seam
            shape as `SolutionsTabs` -> `ServiceTiers` directly above: grounds
            differ (#faf8f3 -> #ffffff here), the upper section has no
            `border-b`, and the edge belongs to the section below. That is the
            site-wide pattern, and it puts exactly one `border-section-divider`
            on this line — two a hairline apart read as a double rule.

            This call site previously passed `divider={false}`, and that opt-out
            existed only because the removed band was also #ffffff, where the
            hairline would have been an arbitrary separator between two
            identical grounds. The grounds are no longer identical, so the
            default is correct and the prop should not come back. `divider`'s
            doc in `sections/Testimonials.tsx` was updated when the band went.

            /case-studies keeps an inbound link from this page regardless: the
            removed band carried one, and `TestimonialsCarousel`'s own
            `ButtonLink` supplies the other. */}
        <Testimonials />
        <ServicesFaq />
        <CtaBand
          headline={
            <>
              Not sure which fulfilment model fits your{" "}
              <em className="accent-em">team</em>?
            </>
          }
          subtext="Share your headcount, occasion, and budget. We'll map out a custom service breakdown in 24 hours."
          buttonText="Explore Custom Fulfilment"
          buttonLink="/contact"
        />
      </main>
      <Footer />
    </>
  );
}