import type { Metadata } from "next";
import {
  Inter,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/**
 * Font system — "Editorial on the surface, functional underneath."
 *
 *   Display  Plus Jakarta Sans 400–800       → every heading, ExtraBold
 *   Sans     Inter             400–700       → body, navigation, UI
 *   Numbers  Space Grotesk     400 / 500 / 700 → stats, prices, counts
 *
 * Each font exposes a CSS variable mapped into Tailwind v4's @theme
 * (--font-display / --font-sans / --font-grotesk) via `@theme inline` in
 * app/globals.css, then consumed as `font-display`, `font-sans`,
 * `font-grotesk` utilities.
 *
 * Plus Jakarta Sans replaces Albert Sans as the display face because the type
 * system calls for an 800 ExtraBold on all headings, and Albert Sans stops at
 * 700 — it could only have faked the extra weight. Space Grotesk is used only
 * for stat numerals, which is not the heading or body role.
 *
 * Playfair Display has been removed. It existed for exactly one thing: the
 * inline italic accent word inside headlines, via `font-serif` on the `<em>`.
 * Those accents are now the shared `accent-em` utility, which sets
 * `font-family: inherit` so an accent can never introduce a second typeface.
 * With 0 call sites left, keeping the family meant 4 woff2 files preloaded and
 * a live @font-face block for glyphs nothing rendered.
 *
 * Inter keeps its 700 as well as the specified 400/500/600: several UI
 * elements render bold at `font-sans`, and dropping 700 would make the browser
 * synthesise a smeared faux bold instead of using the real face.
 */
const inter = Inter({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Display face for h1–h6. No italic set exists for this family. */
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fulfillnest.com"),
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
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fulfill Nest — Thoughtful rewards. Delivered with care.",
      },
    ],
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