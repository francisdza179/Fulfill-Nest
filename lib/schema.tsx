/* JSON-LD structured data builders (Rule 3) */

const site = {
  name: "Fulfill Nest",
  url: "https://fulfillnest.com",
  logo: "https://fulfillnest.com/logo.png",
  description:
    "Premium corporate gifting, employee recognition and fulfilment services for teams that matter.",
};

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Organization schema — used on home (mirrored on sub-pages via site-wide context). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: site.logo,
    description: site.description,
    sameAs: [
      "https://www.linkedin.com/company/fulfillnest",
      "https://www.instagram.com/fulfillnest",
    ],
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
    itemListElement: [
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
    url: `${site.url}/contact`,
    description:
      "Book a gifting consultation. Response within 24 hours.",
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