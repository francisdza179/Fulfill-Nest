import type { ReactNode } from "react";
import { Navigation } from "@/sections/Navigation";
import { Footer } from "@/sections/Footer";
import { PageHero } from "@/sections/PageHero";
import { LegalToc } from "@/components/legal/LegalToc";

/* ------------------------------------------------------------------ */
/*  LegalDoc — shared page shell for long-form legal documents         */
/*  (Privacy Policy & Terms of Service).                               */
/*                                                                    */
/*  Text-led hero (no imagery — restraint reads premium), a sticky     */
/*  scrollspy "On this page" index on desktop (LegalToc), and          */
/*  editorial prose rendered from structured blocks so both pages      */
/*  stay pixel-consistent.                                             */
/* ------------------------------------------------------------------ */

export type LegalBlock =
  | { type: "p"; text: ReactNode }
  | { type: "list"; items: ReactNode[] }
  | { type: "note"; text: ReactNode };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

interface LegalDocProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  sections: LegalSection[];
  email?: string;
}

const CONTACT_EMAIL = "hello@fulfillnest.com";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function LegalBlockRenderer({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return <p className="mt-5 text-body text-walnut">{block.text}</p>;
    case "list":
      return (
        <ul className="mt-5 flex flex-col gap-3">
          {block.items.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 text-body text-walnut"
            >
              <span
                aria-hidden="true"
                className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    /* THE CALLOUT HAS NO LEFT BORDER ANY MORE. It was a 2px accent rule hanging
     * off the left edge of a rounded panel, and the brief's objection to it is
     * correct: the panel's left edge and the rule are two parallel vertical
     * edges 2px apart, and where the rounding curves away at the corners the
     * rule has no corner to follow. It reads as an accidental artefact rather
     * than as a designed rule, and it was the only element on the page where a
     * decorative element could not align with its own container.
     *
     * The panel keeps the house rounded card radius and the warm tint, so it is
     * still visually distinct from the page. What replaced the border as the
     * state signal is the tint itself: the accent at 60% over the mist surface
     * resolves to a warm blush that the surrounding linen does not carry. Text
     * on it is walnut at 7.81:1, comfortably above the 4.5:1 body floor, so
     * removing the rule cost no legibility.
     *
     * The brief's suggested substitutes were a pale amber wash or a stone
     * greywash. Both would work visually; neither is a house token, and this
     * codebase's standing position is that a design-system surface is not
     * invented per component. The existing tint is the same visual gesture as
     * the brief's suggestion in the tokens this project actually has.
     *
     * No `border` of any kind here now - not a hairline, not a full ring. The
     * panel is distinguished by fill alone, so it needs its own contrast against
     * the linen page behind it: warm blush on warm linen, which is a closer
     * match than it looks in class names and was checked rather than assumed. */
    case "note":
      return (
        <div className="mt-6 rounded-card bg-accent-100/60 px-6 py-5">
          <p className="text-body-sm text-walnut">{block.text}</p>
        </div>
      );
  }
}

export function LegalDoc({
  eyebrow,
  title,
  description,
  sections,
  email = CONTACT_EMAIL,
}: LegalDocProps) {
  const toc = sections.map((section) => ({
    id: slugify(section.heading),
    heading: section.heading,
  }));

  return (
    <>
      <Navigation />
      <main>
        <PageHero
          eyebrow={eyebrow}
          title={title}
          description={description}
          /* The only two routes that use LegalDoc. A brick-red "Book a
             consultation" on a privacy policy or terms of service is the wrong
             register, so the hero keeps a clear action but in the quiet
             secondary surface rather than the conversion primary every
             commercial subpage now wears. The one action is kept: a legal page
             is otherwise a dead end, and "back to home" is navigation rather
             than a competing conversion path. */
          ctaHref="/"
          ctaLabel="Back to home"
          ctaVariant="secondary"
          /* Centred, flat, and with no visual at all — the prose-page
             treatment. The previous hero put a "Current document" card in the
             visual slot with the revision date inside it, plus a "Written in
             plain language" pill overlapping its bottom-left corner. Both are
             gone: a split hero needs something to put in the second column, and
             a legal document has no photograph, so the honest options were an
             empty column or a text card pretending to be one. The revision date
             moved into the copy column as `meta`, which is where a date belongs.

             `columns` is deliberately left at its default even though these are
             flat like the five standardised heroes: `layout="center"`
             short-circuits ahead of it in `ChildHero`'s container ternary, so
             passing `"even"` would claim a branch that never renders.

             THE REVISION DATE IS GONE, along with the `lastUpdated` prop that fed
             it. Three reasons, in order of weight.

             It was the only thing in the meta slot, so removing it emptied the
             slot rather than replacing it - which is why no replacement content
             was invented here. The hero keeps its eyebrow, title and description.

             A date on a policy page is a claim about review cadence. Publishing
             "January 2026" on three pages commits the site to having reviewed
             these documents on a schedule, and none of them is on one. If a
             review cadence is wanted, that is a real editorial process to set up,
             not a string to render.

             The three pages each carry a "Changes to this policy" section whose
             text pointed at the date as the way a reader would learn about a
             revision. That pointer now refers to nothing, so it was rewritten to
             say revisions are published on this page instead. Removing the date
             silently would have left three documents promising a change-notice
             mechanism that does not exist.

             The prop is removed from the interface rather than left optional.
             `PageHero`'s `meta` slot still exists and is still used elsewhere;
             this shell simply has nothing to put in it. */
          layout="center"
          canvas="flat"
          surface="light"
        />

        {/* Document body — sticky index + prose */}
        <section
          data-reveal-exempt
          className="texture-linen relative border-t border-section-divider bg-warm-grey py-section"
        >
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-16">
            {/* Sticky scrollspy "On this page" index */}
            <aside className="lg:col-span-4 lg:row-start-1">
              <LegalToc items={toc} />
            </aside>

            {/* Prose */}
            <div className="lg:col-span-8">
              {sections.map((section, index) => (
                <section
                  key={toc[index].id}
                  id={toc[index].id}
                  data-reveal-unit
                  className="scroll-mt-[100px] border-b border-sand pb-12 pt-12 first:pt-0 last:border-b-0"
                >
                  <h2 className="flex items-baseline gap-4 text-h2 text-charcoal">
                    <span className="stat-numeral text-body-sm font-bold text-accent-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </h2>
                  <div className="mt-2">
                    {section.blocks.map((block, blockIndex) => (
                      <LegalBlockRenderer
                        key={blockIndex}
                        block={block}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {/* Quiet closing contact card */}
              <div className="mt-14 rounded-card border border-sand bg-mist p-8 shadow-elev-1 md:p-10">
                <h2 className="font-display text-2xl text-charcoal">
                  Questions or requests?
                </h2>
                <p className="mt-3 max-w-lg text-body text-taupe">
                  Write to us at{" "}
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-accent-600 underline decoration-accent-600/40 underline-offset-4 transition-colors hover:decoration-accent-600"
                  >
                    {email}
                  </a>
                  . We answer within 24 hours, Monday to Saturday, 9am to 7pm.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
