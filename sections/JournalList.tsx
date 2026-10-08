"use client";

import { useMemo, useState } from "react";
import { journalPosts } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/Icons";
import Link from "next/link";

/**
 * Journal — editorial reading list with a category filter.
 *
 * Why a filter on six posts: the categories are already there. `journalPosts`
 * carries a `category` on every row, the list already printed it as the leading
 * meta line, and they are not decorative — "Employee experience" and
 * "Operations" are genuinely different reading intents. Printing the category
 * and then not letting anyone act on it was the gap. At six posts this is
 * borderline, and it becomes obviously right at twenty; the cost of shipping it
 * now is one `useState`.
 *
 * Not a search field. A search box needs a corpus worth searching — six
 * excerpts is not one, and a search that returns everything on most queries is
 * a control that appears broken. The FAQ hub earns a search box because it has
 * 25 questions; this does not, so it gets category pills and nothing else.
 *
 * Client component because the filter is state. That is the entire client
 * boundary — the heading, the meta line and the card markup are all here rather
 * than split, because splitting them would mean a server section wrapping a
 * client list and a heading that sits outside the thing it describes.
 *
 * `RevealOnScroll` already handles this case: `refreshCompletedTargets` gives
 * only the newly-rendered cards a pending state and plays their entrance, so
 * filtering does not re-animate the whole grid.
 */
export function JournalList() {
  const categories = useMemo(
    () => Array.from(new Set(journalPosts.map((post) => post.category))),
    [],
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      activeCategory === null
        ? journalPosts
        : journalPosts.filter((post) => post.category === activeCategory),
    [activeCategory],
  );

  return (
    <section className="border-t border-section-divider bg-surface py-section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Journal"
          title={
            <>
              Field notes on gifting that{" "}
              <em className="accent-em">lands</em>
            </>
          }
          description="Practical thinking on recognition, culture and fulfilment — written by the people who pack, track and deliver the programmes."
        />

        {/* Category pills. `aria-pressed` on independent toggles rather than a
            radiogroup: they combine with nothing here, but a pressed-state
            button is what a screen reader announces correctly without any
            arrow-key management, and there is no panel-to-panel navigation for a
            tablist to promise. */}
        <div
          data-reveal-item
          className="mt-10 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter articles by category"
        >
          <CategoryPill
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          >
            All articles
          </CategoryPill>
          {categories.map((category) => (
            <CategoryPill
              key={category}
              active={activeCategory === category}
              onClick={() =>
                setActiveCategory((current) =>
                  current === category ? null : category,
                )
              }
            >
              {category}
            </CategoryPill>
          ))}
        </div>

        <p aria-live="polite" className="mt-6 text-sm text-taupe">
          {visible.length === journalPosts.length
            ? `${journalPosts.length} articles`
            : `${visible.length} of ${journalPosts.length} articles`}
        </p>

        <div
          data-reveal-stagger
          className="mt-8 grid gap-x-12 gap-y-14 border-t border-sand pt-4 md:grid-cols-2"
        >
          {visible.map((post) => (
            <article key={post.id} className="group flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em]">
                <span className="font-semibold text-accent-600">
                  {post.category}
                </span>
                <span className="h-px w-6 bg-sand" aria-hidden="true" />
                <span className="text-taupe">{post.date}</span>
                <span className="text-taupe">·</span>
                <span className="text-taupe">{post.readTime}</span>
              </div>
              <h3 className="font-display text-2xl text-charcoal transition-colors duration-300 group-hover:text-brand-green-700">
                {post.title}
              </h3>
              <p className="max-w-lg text-body text-taupe">{post.excerpt}</p>
              <Link
                href="/contact"
                className="link-ribbon mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent-600"
              >
                Read the essay
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-pill border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 ${
        active
          ? "border-charcoal bg-charcoal text-white"
          : "border-sand bg-white text-walnut hover:border-copper/50 hover:text-copper"
      }`}
    >
      {children}
    </button>
  );
}
