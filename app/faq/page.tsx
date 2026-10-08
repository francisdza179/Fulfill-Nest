import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { PageHero } from "@/sections/PageHero";
import { FaqKnowledgeBase } from "@/sections/FaqKnowledgeBase";
import { CtaBand } from "@/sections/CtaBand";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers on corporate gifting — timelines, customisation, proof of receipt, multi-region delivery, minimums and data protection.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Fulfill Nest FAQs — Answers before you ask",
    description:
      "Delivery timelines, branding, proof of receipt, minimums and more.",
    url: "/faq",
    images: [
      {
        url: "/hero-contact.jpg",
        width: 1600,
        height: 900,
        alt: "Fulfill Nest frequently asked questions",
      },
    ],
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "FAQs", path: "/faq" }])} />
      <Navigation />
      <main>
        {/* Centred, flat, no visual — the same prose-page treatment as /terms
            and /privacy.

            This hero previously ran the full split architecture: `columns="even"`
            with a `HelpTopicsCard` in the second column, a `RotatingCubeText`
            accent word in the H1, and a decorative `texture-paper` canvas. All of
            that is gone, for the same reason it was removed from the legal
            pages — a question set is a text artefact, and a split hero needs
            something to put in the second column. The card that was there
            answered that badly: it listed all six questions it could jump to,
            which meant the hero and the list immediately below it said the same
            thing twice, with the copy one scroll away.

            The rotating word is gone for a second reason. It animated forever
            through "questions / queries / concerns / details / process", and on
            a page whose entire job is to be scannable, a permanently moving H1 is
            a readability cost paid for personality. The three remaining flipped
            heroes (services, industries, pricing) keep theirs — those are
            marketing pages, and this is a reference page.

            `columns` is left at its default because `layout="center"`
            short-circuits ahead of it in `ChildHero`'s container ternary;
            passing "even" there would claim a branch that never renders. */}
        <PageHero
          layout="center"
          canvas="flat"
          surface="light"
          eyebrow="Knowledge base"
          title={
            <>
              Frequently asked{" "}
              <em className="accent-em">questions</em>
            </>
          }
          description="Answers on how we fulfil, ship, price and protect your data — organised by the stage of the programme you are actually in."
          ctaHref="/contact"
          ctaLabel="Ask us anything"
        />
        <FaqKnowledgeBase />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
