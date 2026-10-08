"use client";

import { useMemo, useState } from "react";
import type { FaqCategory, FaqItem } from "@/lib/data";
import { FaqAccordion, nextOpenAnchor } from "@/components/ui/FaqAccordion";
import { SearchIcon, CloseIcon } from "@/components/ui/Icons";

/**
 * /faq knowledge hub — search, category filter, and a grouped accordion.
 *
 * This is the ONE interactive FAQ surface on the site. The other four routes
 * (home, services, industries, pricing) render the narrower single-purpose sets
 * through the static `FaqAccordion`; this component exists because 25 questions
 * across six categories is past the point where scrolling-and-reading is a
 * reasonable way to find your answer.
 *
 * WHY THE SEARCH LIVES HERE AND NOT IN THE HERO.
 *
 * The hero used to carry a `HelpTopicsCard` jump list, and its own comment
 * explained why a search box was rejected there: the accordion state lives in
 * a separate client component further down the page, so a hero-side `<input>`
 * could not reach it without lifting state into a shared provider or a URL
 * query param — and "a search box that silently filtered nothing" is worse
 * than no search box. That constraint is gone, because the filter and the
 * list are now the same component. Moving the input up into the hero would
 * require the state lift that was correctly avoided; keeping it here means the
 * control and the thing it controls are in one component, with no provider,
 * no context and no URL round-trip. The hero carries the categories as
 * navigation instead — see `FaqCategoryNav` in the section shell, which is
 * plain anchor links to the group headings and needs no state at all.
 *
 * GROUPING.
 *
 * With "All topics" selected the questions render under their category
 * headings; with a single category or a search term they render as one flat
 * list, because a reader who has already narrowed to one topic does not want
 * to scroll past six headings to find the three rows that matched. Every
 * accordion is given a category-namespaced `idPrefix` so a question's anchor
 * stays unique when the same question could plausibly appear under two
 * different filter states. The idPrefix namespaces the DOM ids only — all six
 * groups are handed ONE shared open anchor, so the page is a single accordion
 * across topics rather than six independent multi-expand lists.
 *
 * SEARCH MATCHES ANSWER TEXT, NOT JUST QUESTIONS.
 *
 * A procurement lead searching "volumetric" or "pin code" would find nothing
 * if we only indexed the question, because the term lives in the answer. The
 * comparison is case-insensitive substring matching over both fields — crude,
 * but it is exact-substring behaviour with no false positives from stemming,
 * which for a 25-row set is the right trade.
 *
 * URL STATE: none, deliberately. No query param means no hydration cost, no
 * scroll-jump-on-load fight with the hash anchor, and no back-button trap. A
 * filtered view is a mode you are in for ten seconds, not a page to be
 * linkable to or bookmarked.
 */
export function FaqHub({
  items,
  categories,
  idPrefix = "hub",
}: {
  items: FaqItem[];
  categories: FaqCategory[];
  idPrefix?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  /**
   * The single open row, held HERE rather than inside each `FaqAccordion`.
   *
   * The hub renders one accordion per category group, so under the accordion's
   * own default each of those six components would keep its own open state and
   * the page would behave as a multi-expand list again — the single-expand rule
   * would hold within a topic but not across topics. Owning the anchor here
   * makes one row open across the whole page, and it is also the only place
   * that can clear it when the filter changes underneath it.
   */
  const [openAnchor, setOpenAnchor] = useState<string | null>(null);

  const toggleAnchor = (stateKey: string) => {
    setOpenAnchor((current) => nextOpenAnchor(current, stateKey));
  };

  /**
   * Click-outside dismiss, for the accordions below to call through
   * `state.onRequestClose`.
   *
   * `nextOpenAnchor(current, clicked)` already encodes "the same thing means
   * closed", so there is no fourth spelling of that rule here: with no clicked
   * row, clearing to null IS closing whatever is open.
   */
  const dismissAnchor = () => {
    setOpenAnchor(null);
  };

  const normalisedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (!normalisedQuery) return true;
      return (
        item.question.toLowerCase().includes(normalisedQuery) ||
        item.answer.toLowerCase().includes(normalisedQuery)
      );
    });
  }, [items, activeCategory, normalisedQuery]);

  const grouped = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: matches.filter((item) => item.category === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, matches]);

  const filtersActive = Boolean(normalisedQuery) || activeCategory !== null;

  const clearAll = () => {
    setQuery("");
    setActiveCategory(null);
    setOpenAnchor(null);
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-8">
        <div className="lg:max-w-md lg:flex-1">
          <label
            htmlFor="faq-search"
            className="block text-xs font-semibold uppercase tracking-[0.12em] text-eyebrow-gray"
          >
            Search the knowledge base
          </label>
          <div className="relative mt-3">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-eyebrow-gray"
            />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                // Narrowing the list can remove the row that is open, which
                // would leave the page with an invisible open state. Collapse
                // it alongside the filter so the two never disagree.
                setOpenAnchor(null);
              }}
              placeholder="Try “volumetric”, “cut-off” or “ISO 27001”"
              className="w-full appearance-none rounded-pill border border-sand bg-white py-3 pl-11 pr-11 text-sm text-charcoal transition-colors duration-200 placeholder:text-eyebrow-gray/70 focus:border-copper/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setOpenAnchor(null);
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-pill text-eyebrow-gray transition-colors duration-200 hover:bg-canvas hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterPill active={activeCategory === null} onClick={clearAll}>
            All topics
          </FilterPill>
          {categories.map((category) => (
            <FilterPill
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => {
                setActiveCategory((current) =>
                  current === category.id ? null : category.id,
                );
                setOpenAnchor(null);
              }}
            >
              {category.label}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Result count. `aria-live` so a screen-reader user hears the list
          change after typing rather than having to go and count it. */}
      <p
        aria-live="polite"
        className="mt-6 text-sm text-taupe"
      >
        {matches.length === items.length
          ? `${items.length} questions across ${categories.length} topics`
          : `${matches.length} of ${items.length} questions`}
      </p>

      {/* Results */}
      {matches.length === 0 ? (
        <div className="mt-6 rounded-card border border-sand bg-canvas px-8 py-14 text-center">
          <p className="font-display text-xl text-charcoal">
            No questions match{normalisedQuery ? ` “${query.trim()}”` : ""}.
          </p>
          <p className="mx-auto mt-3 max-w-md text-body text-taupe">
            Try a shorter term, or clear the filters and ask us directly — if it
            is not answered here, it is a fair question.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-pill bg-charcoal px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-14">
          {grouped.map(({ category, items: groupItems }) => (
            <section
              key={category.id}
              aria-labelledby={`${idPrefix}-heading-${category.id}`}
              className="scroll-mt-32"
            >
              {/* The heading is only worth showing when it is carrying
                  orientation. Under a single-category filter or an active
                  search there is one group and its title is noise, so the
                  single-group case renders bare accordions. */}
              {grouped.length > 1 ? (
                <div className="mb-2">
                  <h3
                    id={`${idPrefix}-heading-${category.id}`}
                    className="font-display text-2xl text-charcoal"
                  >
                    {category.label}
                  </h3>
                  <p className="mt-2 max-w-2xl text-body text-taupe">
                    {category.blurb}
                  </p>
                </div>
              ) : null}
              <FaqAccordion
                items={groupItems}
                idPrefix={`${idPrefix}-${category.id}`}
                state={{
                  open: openAnchor,
                  onToggle: toggleAnchor,
                  /* Click-outside cannot be handled inside the accordion here,
                     because this component owns the open key for all six
                     groups. The accordion holds a document listener per
                     instance, so on this page all six are listening while a row
                     is open and every one of them dismisses through here — which
                     is exactly the single-expand rule the hub needs, since
                     `openAnchor` is one string. */

                     /* Inline rather than `useCallback` on purpose: the accordion
                     reads it through a ref, so a new identity every render
                     costs nothing. Wrapping it would imply the listener
                     re-subscribes per render, which it does not. */
                  onRequestClose: dismissAnchor,
                }}
              />
            </section>
          ))}
        </div>
      )}

      {/* Only rendered when something is filtered, so a screen reader does not
          announce a stray "Clear filters" on an unfiltered page load. */}
      {filtersActive && matches.length > 0 ? (
        <button
          type="button"
          onClick={clearAll}
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-accent-600 transition-colors duration-200 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
        >
          Reset filters
          <CloseIcon className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  );
}

/** Category chip. `aria-pressed` rather than a radio group: these are
 *  independently meaningful toggles that can be combined with the search box,
 *  not a single-choice set, and a tablist would promise arrow-key navigation
 *  between panels that do not exist. */
function FilterPill({
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
