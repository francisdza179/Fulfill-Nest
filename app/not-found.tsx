import type { Metadata } from "next";
import { Navigation } from "@/sections/Navigation";
import { Footer } from "@/sections/Footer";
import { ChildHero } from "@/sections/hero/ChildHero";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "That page has moved or no longer exists. Browse the Fulfill Nest catalogue, pricing and industry programmes instead.",
};

/**
 * The 404. Root-level, so it catches **every** unmatched URL on the site.
 *
 * WHICH FALLBACK, since Next 16 has three and only one is right here:
 *
 *   app/not-found.tsx         THIS FILE. Renders inside the root layout, so it
 *                             inherits `<html lang="en">`, the three font
 *                             variables, the global stylesheet and
 *                             `<RevealOnScroll />` — which is what lets it
 *                             mount `Navigation` and `Footer` and look like
 *                             the other thirteen routes. Also catches
 *                             `notFound()` thrown from any route segment.
 *   app/global-not-found.tsx  Routing-level, and it BYPASSES the layout
 *                             entirely: this file would have to return its own
 *                             `<html>` and `<body>` and re-import the fonts and
 *                             styles by hand. Wrong tool — the brand shell is
 *                             the entire point of this page.
 *   pages/404.js              The Pages Router convention. Inert in an App
 *                             Router app; nothing would ever render it.
 *
 * Next.js appends the metadata above and injects
 * `<meta name="robots" content="noindex" />` automatically on any 404 status,
 * so this page cannot be indexed and does not need to ask not to be.
 *
 * BUILT ON `ChildHero`, NOT ON `PageHero`, and that is forced rather than
 * chosen. `PageHero` derives its `actions` from the single `ctaHref` /
 * `ctaLabel` pair, so it structurally cannot render two buttons, and this
 * design has two — a brick-red primary and a secondary beside it. `ChildHero`
 * takes `actions` as an array and is the shared foundation `PageHero` is only
 * a thin wrapper over, so going straight to it loses no house styling: the
 * `HeroBadge` eyebrow, the `text-display-xl` H1, the 18px `#4b5563` lead, the
 * pill CTAs with their trailing arrow, and the `HeroCanvas` field (paper
 * grain, wash, sage bloom, blurred copper pool, ribbons) all still run. The
 * only thing given up is `PageHero`'s 4:3 framed photo, below.
 *
 * `layout="center"` rather than the default split, because a split hero is two
 * columns and this page has one thing to say. It is the same treatment
 * `/terms` and `/privacy` use for their opening statement: the copy centres in
 * an 800px measure, and the CTA row centres with it rather than starting at
 * the left edge under a ragged headline.
 *
 * NO PHOTOGRAPH, which is a change from the previous version of this file and
 * the one judgement call here. That version mounted `PageHero` with
 * `/hero-gift.jpg`, `tag="Next stop"` / `tagValue="Home"`, and a single
 * "Return home" button. Two things went with it:
 *
 *   1. `/hero-gift.jpg` is 1.8MB and was preloaded as the LCP candidate on the
 *      error path — the one page nobody needs to look at quickly is the one
 *      paying to download a photograph first. Nothing is lost: the canvas
 *      decoration is what carries the brand here, and it costs no bytes.
 *   2. The "Next stop: Home" tag was a caption for a photo, and with the photo
 *      gone it would have been a floating label describing a button that is
 *      right below it.
 *
 * Restoring a visual is easy if one is wanted — pass `HeroPhotoFrame` as
 * `visual`, which is the shared leaf the `/services` and `/industries` heroes
 * use. It would render BELOW the centred copy at `max-w-5xl`.
 *
 * COPY. The heading is the brief's "Looks Like You've Strayed Off Course",
 * sentence-cased to match every other headline on the site — the eyebrows and
 * H1s here are sentence case throughout ("Gifting tailored for your industry",
 * "Predictable plans with no surprises"), and Title Case in the brief was
 * list formatting, the same thing it was in the rotating-word briefs.
 *
 * The accent falls on "course" alone. The house rule is brick red plus italic
 * on the FINAL word of a heading, widened to the preceding word as well only
 * when the heading ends in a PRONOUN (it, them, you, us, him, her, this, that)
 * — and "course" is not one. So this is a one-word accent even though the
 * phrase wants two, which is the rule's cost and is worth knowing rather than
 * quietly widening it here.
 *
 * The eyebrow carries the code ("Error 404") so the H1 can stay warm without
 * the two of them saying the same thing twice, which is what the previous
 * version did: eyebrow "Page not found" under a heading that also said the
 * page was not found.
 *
 * CTA LABELS. "Explore Gifts" is the same string the header and footer nav now
 * use for `/gifts` (renamed from "Gifts" on request), so the recovery path and
 * the site's own name for that destination agree.
 */
export default function NotFound() {
  return (
    <>
      <Navigation />
      <main>
        <ChildHero
          layout="center"
          ribbons={false}
          eyebrow="Error 404"
          title={
            <>
              Looks like you’ve strayed off{" "}
              <em className="accent-em">course</em>
            </>
          }
          description="The page you’re looking for may have been moved, renamed, or retired. Everything else is still where you left it."
          actions={[
            { href: "/", label: "Return to Home", variant: "primary" },
            { href: "/gifts", label: "Explore Gifts", variant: "secondary" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}