import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { ContactHero } from "@/sections/ContactHero";
import { ContactHighlights } from "@/sections/ContactHighlights";
import { Footer } from "@/sections/Footer";
import { breadcrumbSchema, contactPageSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a gifting consultation with Fulfill Nest. Response within 24 hours — no obligation, no clutter.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Fulfill Nest — Let's build a reward programme",
    description:
      "Tell us what you're celebrating. In 48 hours you'll have a curated shortlist.",
    url: "/contact",
    images: [
      {
        url: "/hero-contact-gift-box.jpg",
        width: 1600,
        height: 1067,
        alt: "A styled corporate gift box from Fulfill Nest",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <JsonLd
        data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])}
      />
      <Navigation />
      <main>
        <ContactHero />

        {/* What happens next — slim 3-step band beneath the hero form */}
        <ContactHighlights />
      </main>
      <Footer />
    </>
  );
}