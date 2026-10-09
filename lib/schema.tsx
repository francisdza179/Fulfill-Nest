/* JSON-LD structured data builders (Rule 3) */

import type { FaqItem } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/* The origin comes from `lib/site.ts` rather than a literal here. This module
   previously hardcoded `https://fulfillnest.com` while the Metadata API used
   `https://fulfillnest.netlify.app`, so the JSON-LD and the canonical tags
   named different hosts. See `lib/site.ts` for the migration note — when the
   `.com` transfer lands, set `NEXT_PUBLIC_SITE_URL` and both move together. */
const site = {
  name: "Fulfill Nest",
  url: SITE_URL,
  /* `/logo.png` is the real brand mark in `public/` — verified present. The
     previous value was `${site.url}/logo.png` built from a literal origin, which
     is the same path but only ever resolved if that literal host were correct. */
  logo: absoluteUrl("/logo.png"),
  description:
    "Premium corporate gifting, employee recognition and fulfilment services for teams that matter.",
};

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * `sameAs` for the Organization node.
 *
 * EMPTY ON PURPOSE. The previous values —
 * `linkedin.com/company/fulfillnest` and `instagram.com/fulfillnest` — were
 * guesses at handles, not verified profiles. `sameAs` is an entity-resolution
 * signal: it tells a knowledge graph "this organization IS that profile". Pointing
 * it at a page that belongs to somebody else, or that does not exist, is worse
 * than omitting it — it risks merging this brand's entity with an unrelated one.
 *
 * Fill these in with the verified profile URLs and the Organization node becomes
 * materially more useful (it is how the logo and social profiles attach to the
 * knowledge panel). Until then an empty array is valid schema and asserts
 * nothing false.
 */
const SOCIAL_PROFILES: readonly string[] = [];

/** Organization schema — used on home (mirrored on sub-pages via site-wide context). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: site.logo,
    description: site.description,
    sameAs: [...SOCIAL_PROFILES],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@fulfillnest.com",
      contactType: "customer service",
      availableLanguage: "English",
    },
    knowsAbout: [
      "Corporate gifting",
      "Employee recognition",
      "Employee rewards",
      "Channel incentives",
      "Gift fulfilment",
    ],
  };
}

/** WebSite schema — home page. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}

/** BreadcrumbList — used on all sub-pages. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${site.url}${item.path}`,
      })),
    ],
  };
}

/** ContactPage schema — contact page. */
export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Fulfill Nest",
    url: absoluteUrl("/contact"),
    description:
      "Book a gifting consultation. Response within 24 hours.",
  };
}

/**
 * FAQPage schema, generated from the same `FaqItem[]` arrays the visible
 * accordions render.
 *
 * The important property here is that it is built FROM THE RENDERED DATA rather
 * than hand-written. Google penalises FAQ schema whose `mainEntity` does not
 * match the questions visibly on the page, so a hand-maintained copy of these
 * answers would rot the first time somebody edited a line in `lib/data.ts`.
 * Deriving both means they cannot disagree.
 *
 * CAVEAT WORTH KNOWING BEFORE EXPECTING A WIN. Since Google's 2023 change,
 * FAQ rich results are surfaced only for authoritative GOVERNMENT and HEALTH
 * sites; a B2B corporate-gifting site will not get the expanded FAQ dropdown in
 * Google SERPs from this. It is still worth emitting — it is valid structured
 * data, other engines (Bing among them) use it, and it makes the Q&A content
 * machine-readable regardless of whether any particular SERP renders it. Treat
 * it as entity clarity, not as a rich-result guarantee.
 */
export function faqPageSchema(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Render helper for hydration-safe JSON-LD script tags. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}