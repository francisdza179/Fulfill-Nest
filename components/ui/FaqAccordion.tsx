"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { FaqItem } from "@/lib/data";

/** Stable, DOM-safe id for a question. See the note on `FaqAccordion`. */
function anchorFor(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * State identity for a question — deliberately NOT `anchorFor`'s slug.
 *
 * The slug is truncated to 60 characters for id hygiene, and two long questions
 * can easily share their first 60. Under multi-expand that was a duplicate-id
 * nit nobody would notice. Under single-expand it becomes a visible bug: `isOpen`
 * is a comparison against one string, so two slug-identical questions would both
 * light up from a single click. State is therefore keyed on the whole question,
 * whitespace-collapsed and case-folded, which collides only for a question that
 * is genuinely identical — and row ids are unchanged, so deep links still land
 * where they did.
 */
function stateKeyFor(question: string): string {
  return question.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * The single-expand rule, in one place.
 *
 * Clicking the row that is already open yields `null`, so a reader can always
 * collapse what they opened. Clicking any other row moves the open state there —
 * that is what closes the previous one. Exported so `FaqHub`, which owns the
 * state for its per-category accordions, applies the identical rule instead of
 * re-implementing "the same thing means closed" locally.
 */
export function nextOpenAnchor(
  current: string | null,
  clicked: string,
): string | null {
  return current === clicked ? null : clicked;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/**
 * FAQs accordion — single-expand disclosure list.
 *
 * Kept in its own client module so the surrounding `section/` stays a server
 * component and the client boundary stays as small as possible. Height animates
 * with the `grid-rows-[0fr] -> [1fr]` technique (the same approach the About
 * page belief grid uses) because a native `<details>` element cannot transition
 * its own height. Every panel is a real `<button>` with `aria-expanded` /
 * `aria-controls`, and the trigger glyph rotates 45° as the row opens, so both
 * states animate rather than snap.
 *
 * ONE ROW OPEN AT A TIME. This was multi-expand — state was a `Set` of anchors,
 * so rows opened independently and a reader could end up with the whole band
 * expanded, losing track of which answer was actually on screen. Opening any
 * row now closes whichever was open, and clicking the open row closes it.
 * `nextOpenAnchor` owns that rule and `FaqHub` reuses it.
 *
 * UNCONTROLLED UNLESS `state` IS PASSED. A lone `FaqAccordion` owns its own
 * state, which is sufficient for the four `FaqList` routes because each of those
 * pages renders exactly one accordion — per-instance and per-page are the same
 * thing there. `FaqHub` renders one accordion PER CATEGORY, so it passes `state`
 * and all of them share a single open row; without it, opening a question under
 * "Operations" and one under "Pricing" would leave both open, because they are
 * separate components with separate state.
 *
 * CLICK OUTSIDE COLLAPSES IT, on every one of those routes, because the
 * behaviour lives here rather than at the six call sites. Before this, the only
 * way to close a row was to click that same row again — so a reader who opened
 * an answer, scrolled down to read it and then clicked a product tile 600px away
 * left it open behind them, with no affordance left to shut it.
 *
 * WHY `click` AND NOT `pointerdown`. `pointerdown` would fire on the press, which
 * on touch means a reader who starts a scroll with a finger outside the band
 * closes the answer mid-scroll. `click` fires only when the pointer went down
 * and up without travelling far enough to be a drag, so scrolling leaves the
 * answer open and an actual click closes it. The cost is that the close lands
 * one release later than the press; imperceptible at this size.
 *
 * WHY THE LISTENER ONLY EXISTS WHILE A ROW IS OPEN. The effect's dependency is
 * the open key, so a closed accordion holds NO document listener at all. On a
 * page with six accordions — the /faq knowledge hub — that is the difference
 * between zero and six click handlers on every click anywhere on the page, and
 * it is why the page needs no `useCallback` discipline at the call sites.
 *
 * THE CONTAINER REF IS THE ROW LIST, NOT THE SECTION. `FaqList` renders the
 * eyebrow, the heading and the description in the server component around this,
 * so all of that sits OUTSIDE the ref. Clicking the heading, the eyebrow or the
 * whitespace beside the band therefore closes the row, which is what a reader
 * expects — the section is the object they clicked away from. The ref is on
 * exactly the element that wraps the question rows, so anything inside an open
 * answer keeps it open (selecting the text to copy it does not dismiss it).
 *
 * ANCHOR SCHEME — changed from index-derived to question-derived.
 *
 * These ids used to be `faq-${index}-button`, which only worked while the
 * rendered array was static and identical to whatever the hrefs were built
 * from. The /faq knowledge hub now FILTERS the list client-side (search box +
 * category pills), so index 3 is a different question depending on what is
 * typed. A deep link to `#faq-3-button` would land on the wrong row, and every
 * link would break the moment a category was selected.
 *
 * Slugging the question instead makes the anchor a property of the question
 * rather than of its position, so it survives filtering, re-sorting and future
 * insertions into the middle of the array. `idPrefix` keeps the FAQ hub's rows
 * namespaced separately from the four other routes' accordions, which are all
 * on one page nowhere but the home page — where only one ever renders anyway,
 * and the prefix makes that a non-question.
 *
 * The old `HelpTopicsCard` that consumed the index scheme is deleted: it was a
 * hero-side jump list built for a single unfiltered list, which is exactly what
 * the hub replaced with a real filter.
 *
 * ENTRANCE is handled by Framer Motion. The row list is a viewport-triggered
 * parent (`whileInView`, `amount: 0.2`, `once: true`) and each row fades up with
 * an 0.08s stagger. The site-wide CSS reveal marker that used to sit on this
 * container has been removed so the two systems do not fight over the same
 * rows. Accordion open/close state is unchanged and lives in the same hooks as
 * before.
 */
export function FaqAccordion({
  items,
  idPrefix = "faq",
  state,
}: {
  items: FaqItem[];
  idPrefix?: string;
  /**
   * Controlled mode. Supplying this makes ONE row open across SEVERAL
   * `FaqAccordion` instances on the same page — see the single-expand note
   * above for why the knowledge hub needs it. Omit it and the accordion owns
   * its own state, which is the correct default everywhere else.
   */
  state?: {
    open: string | null;
    onToggle: (stateKey: string) => void;
    /**
     * How to collapse when the reader clicks outside the rows. Only consulted
     * in controlled mode, because in uncontrolled mode the accordion can just
     * set its own state to null — it is the knowledge hub that cannot, because
     * it owns the open key for six accordions at once.
     *
     * OPTIONAL, and optional on purpose: a controlled caller that omits it gets
     * no outside-click dismiss rather than a crash, which is the right failure
     * for a purely cosmetic affordance.
     */
    onRequestClose?: () => void;
  };
}) {
  const [ownOpen, setOwnOpen] = useState<string | null>(null);
  const open = state ? state.open : ownOpen;
  const reducedMotion = useReducedMotion();

  /** The row list. Deliberately NOT the section — see the click-outside note. */
  const rowsRef = useRef<HTMLDivElement>(null);

  /**
   * The latest dismiss handler, held in a ref so the listener below can be
   * subscribed ONCE per open/close transition instead of once per render.
   *
   * `FaqHub` passes its `state` object as an inline literal, so that object is
   * a new reference on every render and any effect depending on `state` would
   * tear down and re-add a document listener on every single render of the hub.
   * Keeping the handler behind a ref makes the listener's dependency the open
   * key alone, which is a primitive and changes only when a row does.
   */
  const dismissRef = useRef<() => void>(() => {});
  useEffect(() => {
    dismissRef.current = () => {
      if (state) state.onRequestClose?.();
      else setOwnOpen(null);
    };
  });

  // Takes a STATE KEY, never an id anchor. The two strings differ by design —
  // `stateKeyFor` does not truncate — so mixing them up means the stored value
  // can never equal the one `isOpen` compares against, and the row silently
  // refuses to open.
  const toggle = (stateKey: string) => {
    if (state) {
      state.onToggle(stateKey);
      return;
    }
    setOwnOpen((current) => nextOpenAnchor(current, stateKey));
  };

  /**
   * CLICK OUTSIDE. Subscribed only while a row is open, so a closed accordion
   * costs nothing — see the note on `dismissRef` for why the dependency is the
   * open key alone.
   */
  useEffect(() => {
    if (open === null) return;

    const rows = rowsRef.current;
    if (!rows) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      /* A click that lands inside the rows — on the open question, or anywhere
         in its answer — is not a dismissal. Checking this FIRST is what lets the
         question's own onClick toggle without the document handler racing it
         into a close-then-reopen. */
      if (target instanceof Node && rows.contains(target)) return;

      /* A target that is not a Node cannot be located in the tree, so it is
         treated as outside. Synthetic events dispatched with a string target are
         the case that reaches this. */
      dismissRef.current();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <motion.div
      ref={rowsRef}
      className="flex flex-col border-t border-sand"
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {items.map((faq) => {
        const anchor = anchorFor(faq.question);
        const stateKey = stateKeyFor(faq.question);
        const isOpen = open === stateKey;
        const buttonId = `${idPrefix}-${anchor}`;
        const panelId = `${idPrefix}-${anchor}-panel`;

        return (
          <motion.div
            key={faq.question}
            variants={itemVariants}
            className="group border-b border-sand"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(stateKey)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span className="font-display text-xl font-semibold leading-snug text-charcoal transition-colors duration-200 ease-in-out group-hover:text-brick-red">
                  {faq.question}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border text-accent-600 transition-all duration-300 ease-in-out group-hover:border-brick-red/40 group-hover:bg-brand-green-50 group-hover:text-brick-red ${
                    isOpen ? "rotate-45 border-brick-red/40" : "border-sand"
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    className="h-4 w-4"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 pr-12 text-body text-taupe">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
