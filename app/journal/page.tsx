import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { PageHero } from "@/sections/PageHero";
import { JournalList } from "@/sections/JournalList";
import { CtaBand } from "@/sections/CtaBand";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Journal",
  description:
    "Field notes on corporate gifting, employee recognition and fulfilment — practical thinking from the Fulfill Nest team.",
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: "The Fulfill Nest Journal — Field notes on gifting",
    description:
      "Practical essays on recognition, culture and enterprise fulfilment.",
    url: "/journal",
    images: [
      {
        url: "/hero-about.jpg",
        width: 1600,
        height: 900,
        alt: "The Fulfill Nest journal and field notes",
      },
    ],
  },
};

export default function JournalPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Journal", path: "/journal" }])} />
      <Navigation />
      <main>
        {/* Centred, flat, no visual — the prose-page treatment shared with
            /terms, /privacy, /faq and /case-studies.

            The `HeroPhotoFrame` and the `RotatingCubeText` accent word are both
            gone. The photo was `/hero-about.jpg` — a stock hero reused from the
            About page, so the journal's own opening image was a picture of
            something else entirely. And a permanently rotating H1 is a poor
            trade on a reading page.

            `columns` is left at its default because `layout="center"`
            short-circuits ahead of it in `ChildHero`'s container ternary. */}
        <PageHero
          layout="center"
          canvas="flat"
          surface="light"
          eyebrow="Insights &amp; articles"
          title={
            <>
              Journal &amp; operational{" "}
              <em className="accent-em">insights</em>
            </>
          }
          description="Field notes on recognition, culture and fulfilment — written by the people who pack, track and deliver the programmes, not by a content agency."
          ctaHref="/contact"
          ctaLabel="Suggest a topic"
        />
        <JournalList />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}