import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { AboutHero } from "@/sections/AboutHero";
import { AboutStory } from "@/sections/AboutStory";
import { EditorialStatement } from "@/sections/EditorialStatement";
import { TeamSpotlight } from "@/sections/TeamSpotlight";
import { TestimonialV3Section } from "@/sections/TestimonialV3Section";
import { ValueProps } from "@/sections/ValueProps";
import { CtaBand } from "@/sections/CtaBand";
import { FaqList } from "@/sections/FaqList";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import { beliefs } from "@/lib/data";
import { aboutFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Fulfill Nest blends human curation with enterprise-grade fulfilment. Learn who we are, what we believe, and how we protect every gifting moment.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Fulfill Nest — Human curation, enterprise precision",
    description:
      "The story behind the gifting partner trusted by 200+ HR, CXO and procurement teams.",
    url: "/about",
    images: [
      {
        url: "/about-hero.jpg",
        width: 3496,
        height: 2795,
        alt: "The Fulfill Nest curation process",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "About", path: "/about" }])}
      />
      <Navigation />
      <main>
        <AboutHero />
        <AboutStory />
        <EditorialStatement className="bg-surface">
          We craft thoughtful gifting experiences that strengthen{" "}
          <em className="font-medium italic" style={{ color: "var(--color-brick-red, #a83b24)" }}>
            culture.
          </em>
        </EditorialStatement>
        {/* NO DIFFERENTIATION BAND HERE. `WhyFulfillNest` was removed from this
            page on request — it had been rebuilt four times (bento card grid,
            accordion with a sticky spotlight, comparative table, horizontal
            story track, borderless split) and none of them landed.

            The component and its copy are still on disk: `sections/WhyFulfillNest.tsx`
            plus `differenceThesis`, `differenceRows` and the `DifferenceRow` type
            in `lib/data.ts`. Nothing was deleted, so putting it back is one
            import and one line here. All of it is currently unrendered — see the
            note on those exports in `lib/data.ts` before adding a row to them.

            The page's argument now runs: who we are, why we exist, what we
            believe, who the people are, proof, the ask. Nothing links to the
            old `#the-difference` anchor anywhere on the site, so removing the
            section broke no deep link. */}
        <ValueProps
          id="values"
          eyebrow="What we believe"
          title={
            <>
              Three beliefs, held to one{" "}
              <em className="accent-em">standard</em>
            </>
          }
          description="We started Fulfill Nest because recognition deserved better than a bulk order. These are the beliefs that decide how we curate, pack and deliver — every single time."
          items={beliefs}
          layout="grid"
        />
        <TeamSpotlight />
        {/* Story, then values, then the people, then the proof they are worth
            listening to, then the ask. The split testimonial band also wants a
            colour edge on both sides, which `bg-linen` gives it against
            TeamSpotlight's white above and CtaBand's cream below. It replaces
            the `AboutTestimonials` carousel, which read the same twelve
            testimonials; that component is still on disk, unreferenced. */}
        <TestimonialV3Section />
        <FaqList
          items={aboutFaqs}
          divider={false}
          eyebrow="About FAQs"
          title={
            <>
              Common questions about our mission, curation, and team{" "}
              <em className="accent-em">standards</em>
            </>
          }
          description="Our philosophy, operations, and approach to humanizing corporate gifting so every reward feels intentional and on brand."
          link={{ href: "/contact", label: "Ask a specific question" }}
        />
        <CtaBand
          headline={
            <>
              Let&apos;s make workplace appreciation thoughtful{" "}
              <em className="accent-em">again</em>
            </>
          }
          subtext="Partner with a team that treats every gift box like a brand statement."
          buttonText="Connect With Our Team"
          buttonLink="/contact"
        />
      </main>
      <Footer />
    </>
  );
}