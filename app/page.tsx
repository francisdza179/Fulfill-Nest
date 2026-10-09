import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { HeroFlanked as Hero } from "@/sections/hero/HeroFlanked";
import { WhoWeAre } from "@/sections/WhoWeAre";
import { ProductMarquee } from "@/sections/ProductMarquee";
import { ValueProps } from "@/sections/ValueProps";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { HowItWorks } from "@/sections/HowItWorks";
import { EmotionalPayoff } from "@/sections/EmotionalPayoff";
import { FaqList } from "@/sections/FaqList";
import { CtaBand } from "@/sections/CtaBand";
import { Footer } from "@/sections/Footer";
import {
  JsonLd,
  organizationSchema,
  webSiteSchema,
} from "@/lib/schema";
import { values, homeFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    absolute: "Fulfill Nest — Premium Corporate Gifting & Employee Recognition",
  },
  description:
    "Thoughtful rewards, delivered with care. Premium corporate gifting, employee recognition, and fulfilment services for teams that matter.",
  alternates: {
    canonical: "/",
  },
  /* Homepage-level openGraph / twitter, spelled out in full rather than
     inherited from the root layout.

     Next.js does NOT deep-merge `openGraph` — a page-level `openGraph` replaces
     the layout's wholesale, so a partial override here would silently drop
     `siteName` and any field not restated. Every field is therefore written out.

     The image URL is ABSOLUTE. WhatsApp and LinkedIn both resolve `og:image`
     against the page URL when it is relative, which works in a browser but is
     unreliable on WhatsApp — it frequently refuses to fetch the preview at all
     rather than resolving the relative path. `metadataBase` in the root layout
     already covers absolute enrichment, but the literal URL removes any runtime
     dependency on it.

     `type` is `website` (not the default `article`) so the share renders as a
     site preview rather than a story card, and `og:image:type` is stated
     explicitly because WhatsApp keys its rendering decision off the MIME hint
     more than off the file extension.

     twitter.card is `summary_large_image`, which is what makes these three
     platforms render the large preview card rather than a small square
     thumbnail. */
  openGraph: {
    type: "website",
    siteName: "Fulfill Nest",
    title: "Fulfill Nest — Premium Corporate Gifting & Employee Recognition",
    description:
      "Thoughtfully curated corporate gifting with end-to-end execution.",
    url: "https://fulfillnest.netlify.app/",
    images: [
      {
        url: "https://fulfillnest.netlify.app/og-preview.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Fulfill Nest — Premium Corporate Gifting & Employee Recognition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulfill Nest — Premium Corporate Gifting & Employee Recognition",
    description:
      "Thoughtfully curated corporate gifting with end-to-end execution.",
    images: ["https://fulfillnest.netlify.app/og-preview.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <Navigation />
      <main>
        <Hero />
        <WhoWeAre />
        <ProductMarquee />
        {/* `layout="editorial"` and `headerAlign="center"`.

            `editorial` is the band's own numbered row set in columns: one
            column on mobile, two at `md`, three at `lg`, which turns six items
            into two balanced rows of three. It is deliberately NOT a card grid -
            an earlier pass rendered six bordered, tinted, shadowed boxes here
            and that was the wrong register for an editorial band. No
            `rounded-card`, no `border`, no resting shadow: just the hairline
            above each item, the oversized numeral, and the hover wash, exactly
            as the band has always looked at one item per line.

            `headerAlign="center"` is what a 3-column grid under a
            left-aligned 672px heading reads as mis-joined — the eyebrow, title
            and lead now share one centre axis with the columns below.

            `revealSequence="featured"` is untouched, and it is worth knowing
            what six items do to it: content offset 450ms plus a 150ms step per
            item puts the last one at 1200ms, where three items ended at
            750ms. Say the word and I will halve the step or drop the offset —
            it is a deliberate prop, so I left it as set rather than retuning a
            choice you made. */}
        <ValueProps
          id="why-fulfill-nest"
          layout="editorial"
          headerAlign="center"
          revealSequence="featured"
          eyebrow="Why Fulfill Nest"
          title={
            <span className="text-[clamp(1.7rem,8vw,2.125rem)] leading-[1.05] md:text-[inherit]">
              Rewards that inspire people, logistics that feel{" "}
              <em className="accent-em">invisible</em>
            </span>
          }
          description="Most reward programmes are bought in bulk and delivered generically. We design the reverse: deeply human curation, wrapped in enterprise-grade fulfilment you can set your clock by."
          items={values}
          surface="soft-cream"
        />
        <ProductShowcase />
        <HowItWorks />
        {/* The integrations marquee and the zero-touch flow diagram used to sit
            here and have both been removed at the client's request. Nothing
            links to their ids (`#integrations`, `#zero-touch-automation`) — both
            anchors had zero inbound references even while they were mounted.
            HowItWorks above declares its own `border-b border-section-divider`
            on the `bg-linen` band, and the merged EmotionalPayoff below runs on
            `bg-white`, so dropping two `py-section` blocks leaves the hairline
            intact and adds no doubled padding at the new seam. */}
        {/* One merged white band: the human statement and the testimonial deck
            share a single `<section>`. The separate `Testimonials` call that
            used to sit here has been absorbed into `EmotionalPayoff`, which
            also dropped that deck's eyebrow and heading. `Testimonials` itself
            is unchanged and still renders on /gifts, /industries and /pricing. */}
        <EmotionalPayoff />
        {/* No hairline: the merged band above is #ffffff, so the divider
            would be the only edge between two identical bands. */}
        <FaqList id="faq" items={homeFaqs} divider={false} />
        <CtaBand
          headline={
            <>
              Let&apos;s build a reward programme your people will{" "}
              <em className="accent-em">remember</em>
            </>
          }
          subtext="Tell us what you're celebrating. In 48 hours you'll have a curated shortlist — budgets, timelines, and logistics included."
          buttonText="Book a consultation"
          buttonLink="/contact"
        />
      </main>
      <Footer />
    </>
  );
}