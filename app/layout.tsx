export const dynamic = "force-static";
import type { Metadata } from "next";
import {
  Inter,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { absoluteUrl } from "@/lib/site";

/**
 * Font system — "Editorial on the surface, functional underneath."
 *
 *   Display  Plus Jakarta Sans 400–800       → every heading, ExtraBold
 *   Sans     Inter             400–700       → body, navigation, UI
 *   Numbers  Space Grotesk     400 / 500 / 700 → stats, prices, counts
 */

const inter = Inter({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  fallback: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/* Absolute URLs are required for `og:image` / `twitter:image`: WhatsApp and
   LinkedIn resolve relative values unreliably, and WhatsApp often refuses the
   preview entirely rather than resolving it. `absoluteUrl()` also keeps this
   file in step with the JSON-LD in `lib/schema.tsx`, which read the same
   `SITE_URL`. Do not reintroduce a literal origin here — see `lib/site.ts`. */
const SITE = absoluteUrl();
const OG_IMAGE = absoluteUrl("/og-preview.jpg");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Fulfill Nest — Premium Corporate Gifting & Employee Recognition",
    template: "%s | Fulfill Nest",
  },
  description:
    "Thoughtful rewards, delivered with care. Premium corporate gifting, employee recognition, and fulfilment services for teams that matter.",
  keywords: [
    "corporate gifting",
    "employee recognition",
    "employee rewards",
    "channel incentives",
    "festive gifting",
    "gift fulfilment",
  ],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Fulfill Nest",
    title: "Fulfill Nest — Premium Corporate Gifting & Employee Recognition",
    description:
      "Thoughtful rewards, delivered with care. Premium corporate gifting & employee recognition solutions.",
    url: SITE,
    images: [
      {
        url: OG_IMAGE,
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Fulfill Nest — Thoughtful rewards. Delivered with care.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulfill Nest — Premium Corporate Gifting & Employee Recognition",
    description:
      "Thoughtful rewards, delivered with care. Premium corporate gifting & employee recognition solutions.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable}`}
    >
      <body suppressHydrationWarning>
        {children}
        <RevealOnScroll />
      </body>
    </html>
  );
}
