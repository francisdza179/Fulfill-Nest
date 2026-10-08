import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SearchIcon } from "@/components/ui/Icons";
import { ProductCatalogTabs } from "@/components/catalog/ProductCatalogTabs";

/** Curated catalogue of physical corporate gifts, rendered on /gifts
 *  between `ServicesHero` ("Our services") and `SolutionsTabs` ("Tailored
 *  solutions"). This page was `/services` and has been renamed, so the nav
 *  label, the URL and this page's own title now agree.
 *
 *  A SERVER component. It holds the heading and the sourcing callout, both of
 *  which are static, and hands the interactive catalogue to
 *  `components/catalog/ProductCatalogTabs.tsx`, which is a client component
 *  because a selection-driven panel cannot be a server one. Same split as
 *  `ProductShowcase` and `ProductShowcaseClient`.
 *
 *  HEADING. The brief asked for `<span className="text-red-600 italic">` on the
 *  final word. `text-red-600` is not a token here, and globals.css is explicit
 *  that the accent word is one class and "never a hand-rolled `italic
 *  font-medium text-[.]` at a call site" - `accent-em` already *is* that
 *  treatment: `font-style: italic` over `color: var(--color-brand-primary)`
 *  (#a83b24, the brick red). So the word is wrapped in `<em className="accent-em">`
 *  and gets exactly the red italics the brief asked for, by the mechanism
 *  every other heading on the site uses.
 *
 *  HEADING ANIMATION: ON THE DEFAULT SCROLL PATH. The headline has now lived
 *  on every setting across directives — `enterOnLoad`, the default
 *  `data-reveal-header` scroll path, `enterOnLoad` again, and now the scroll
 *  path again: the viewport-trigger repair directive requires entrance
 *  animations to fire when the section enters the active viewport and never
 *  on page mount, and `heading-enter` is precisely a paint-triggered
 *  (mount-tied) animation. The deadlock with the static-header guardrail
 *  resolves in the house reveal's favour because threshold 0 with the 80px
 *  inset starts the header's entrance exactly as the section arrives — never
 *  blank on screen (the /industries report that set threshold 0), never
 *  pre-finished on mount (this directive's complaint). Content below keeps
 *  its own entrances.
 *
 *  The callout below the grid is static - it sits inside this section rather
 *  than inside the tabs client because it says the same thing for all four
 *  categories, so re-rendering it per selection would be work for nothing.
 *
 *  IT NO LONGER CARRIES ANY SAMPLE NOTE. It previously read "This 16-item
 *  preview", then "This preview is just a sample of our full collection", and
 *  that sentence has now been removed outright on instruction. The count had
 *  already been dropped in an earlier round because the four categories are not
 *  uniform (`apparel` holds eleven, the others sixteen), which made any single
 *  figure wrong for one of the four tabs; the whole clause has now gone, so
 *  that reasoning is history rather than a live constraint here.
 *
 *  The replacement for the non-exhaustive-sample framing is the per-tab image
 *  disclaimer inside `ProductCatalogTabs.tsx` - different claim, so it is not a
 *  substitution for what was deleted, and nothing on the page says the
 *  selection is partial any more. Worth flagging to whoever asked: the callout
 *  now opens "Looking for something specific?" and immediately follows it with
 *  "If you have a specific gift, brand, or custom kit in mind", which is close
 *  to the same thought twice. Left as-is because only the one string was asked
 *  to be removed.
 */
export function ProductCatalog() {
  return (
    <section
        id="curated-catalog"
        className="scroll-mt-28 border-t border-section-divider bg-white py-section md:scroll-mt-36"
      >
      <div className="mx-auto max-w-7xl px-6">
        {/* Scroll-revealed header — the default `data-reveal-header` path.
            The viewport-trigger repair directive requires entrance animations
            to fire on viewport entry rather than on page mount, which is what
            the load-paint `heading-enter` was doing; see the file comment. */}
        <SectionHeading
          eyebrow="Curated Collection"
          title={
            <>
              Curated gifting <em className="accent-em">catalog</em>
            </>
          }
          description="Modern, daily-use gifts curated to make home and office hours more comfortable."
        />

        <div className="mt-14">
          <ProductCatalogTabs />
        </div>

        <div data-reveal-item className="mt-14 flex flex-col gap-6 rounded-2xl border border-section-divider bg-surface p-8 shadow-elev-1 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex items-start gap-4">
            <SearchIcon className="mt-0.5 h-6 w-6 shrink-0 text-accent-700" />
            <p className="max-w-2xl text-base leading-7 text-charcoal/80">
              Looking for something specific? If you have a specific gift,
              brand, or custom kit in mind, we can source and personalize it for
              you.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center text-center md:w-auto md:flex-row md:shrink-0">
            <ButtonLink href="/contact" className="w-full max-w-xs sm:w-auto">Request Custom Sourcing</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
