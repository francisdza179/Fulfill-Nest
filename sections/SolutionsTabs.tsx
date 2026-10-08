"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  ArrowRightIcon,
  BoxIcon,
  CalendarIcon,
  CrownIcon,
  HeartIcon,
  PackageIcon,
  PartyPopperIcon,
  ShieldIcon,
  ShoppingBagIcon,
  SmileIcon,
  SparklesIcon,
  TruckIcon,
  UsersIcon,
} from "@/components/ui/Icons";

/** A local icon component: an outline SVG accepting the shared class props. */
type IconGlyph = ComponentType<SVGProps<SVGSVGElement>>;

interface Solution {
  /**
   * Stable slug, and the only part of a tab that outlives a relabelling.
   *
   * These are the pre-2024 offering slugs rather than slugs of the tab
   * labels. Where a tab label and its id diverge (`Client Appreciation` ->
   * `channel-incentives`, `Events & Swag` -> `enterprise-fulfilment`) the
   * divergence is deliberate and should be preserved if the labels are ever
   * reworked: the slugs are already out in the world.
   *
   * What they are NOT is a set of working deep links. An earlier version of
   * this note claimed they were "the deep-link target for the footer's
   * 'Solutions' column", and that was wrong twice over - the footer no longer
   * has a Solutions column, and the id never reaches the DOM on its own. It
   * only ever feeds `solution-tab-${id}` and `solution-panel-${id}` for the
   * ARIA wiring below, so `/gifts#employee-rewards` and its three siblings
   * match nothing and land at the top of the page. Do not re-add footer
   * entries pointing at them on the strength of this comment.
   */
  id: string;
  /** Pill label in the tab bar, and the panel H3 (they are the same string). */
  tab: string;
  body: string;
  /** One feature line per bullet, each carrying its own contextual glyph —
      the four lists draw from the local icon set instead of a shared tick. */
  points: Array<{ text: string; icon: IconGlyph }>;
  /** CTA label on the panel button — intent-aligned copy, not "Explore …". */
  cta: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

/* Tab-rail entrance orchestration (module scope, house style). The rail
   reveals once at 25% of its own visibility; each pill then staggers in
   0.08s apart with a short rise and fade. */
const RAIL_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const TAB_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const solutions: Solution[] = [
  {
    id: "employee-rewards",
    tab: "Employee Onboarding",
    body: "A new joiner's first impression of your brand arrives in a box, so we build it to be worth opening. Fulfill Nest sources, brands and ships welcome kits to any address in India — individually addressed, batched into one run, and tracked to the doorstep.",
    cta: "Inquire About Employee Onboarding",
    points: [
      { text: "Custom branded welcome boxes", icon: PackageIcon },
      { text: "Automated address collection from your HRIS", icon: SparklesIcon },
      { text: "Door-step delivery tracking, batch by batch", icon: TruckIcon },
    ],
    image: "/services/employee-onboarding.jpg",
    imageAlt:
      "Employee receiving a gift box at their desk with a smile — Employee Rewards & Recognition",
    imagePosition: "50% 55%",
  },
  {
    id: "channel-incentives",
    tab: "Client Appreciation",
    body: "The clients who renew with you rarely hear it in a proposal — they feel it in something that turns up unannounced. We translate account milestones into thoughtful, brand-consistent gestures that keep the relationship warm well beyond the review.",
    cta: "Plan Your Client Appreciation",
    points: [
      { text: "Milestone-triggered gifting, timed to your account plan", icon: CrownIcon },
      { text: "Premium catalogues carrying your own branding", icon: HeartIcon },
      { text: "Tiered reward boxes for your top performers", icon: UsersIcon },
    ],
    image: "/services/client-appreciation.jpg",
    imageAlt:
      "Executive gift set with leather notebook in matte black — Channel & Partner Incentives",
    imagePosition: "50% 60%",
  },
  {
    id: "festive-gifting",
    tab: "Milestones & Celebrations",
    body: "Festivals, work anniversaries and team wins each want a different kind of attention, and none of them can be improvised at volume. Fulfill Nest plans culturally aware festive programmes and milestone drops that hold their schedule through the busiest quarter of the year.",
    cta: "Discuss Milestones & Celebrations",
    points: [
      { text: "Culturally aware festive hampers", icon: PartyPopperIcon },
      { text: "Work-anniversary and birthday calendars", icon: CalendarIcon },
      { text: "Scheduled bulk dispatch on one consolidated invoice", icon: SmileIcon },
    ],
    image: "/services/milestones-celebrations.jpg",
    imageAlt:
      "Luxurious festive hamper arrangement with gold ribbon — Festive & Milestone Gifting",
    imagePosition: "50% 45%",
  },
  {
    id: "enterprise-fulfilment",
    tab: "Events & Swag",
    body: "Branded merchandise is only ever as good as the logistics behind it, and that layer is what a procurement team is really buying. We run secure storage, kitted packing and nationwide delivery so event collateral lands assembled, on time, and with proof of receipt.",
    cta: "Curate Events & Swag",
    points: [
      { text: "Secure, audited storage for your swag inventory", icon: ShoppingBagIcon },
      { text: "Kitted packing for multi-item event drops", icon: BoxIcon },
      { text: "Proof of delivery and reconciliation on every batch", icon: ShieldIcon },
    ],
    image: "/services/events-swag.jpg",
    imageAlt:
      "Hands tying a ribbon on a gift box in the packaging studio — Enterprise Fulfilment",
    imagePosition: "50% 30%",
  },
];

/**
 * Services — "Fulfilment built for your specific goals": a four-tab use-case
 * explorer that replaces the former stacked `SolutionsList` banners.
 *
 * What it carries over deliberately, because the old section was linked into
 * from outside the page: the section id `solutions` (the Services hero's
 * "Explore the four solutions" CTA points at it) and the four per-offering
 * anchor ids (the footer's Solutions column points at all four). Both survive
 * — see the hash handling below, which is the only way they can survive a tab
 * widget. All four panels are always in the DOM (see the stack note in the
 * panel comment), so a hash picks which panel is active rather than deciding
 * what exists.
 *
 * Layout: a centred `SectionHeading`, a centred tab rail, then a
 * two-column panel — copy left, framed studio photograph right. Below the 768px
 * `md` breakpoint the rail becomes a horizontally scrollable snap row and the
 * panel stacks.
 *
 * The panel deliberately carries no scroll-reveal of its own. The reveal system
 * walks `data-reveal-item` on entry and re-runs it whenever the node mounts, so
 * a per-tab wrapper would re-animate on every tab click. The reveal is put on
 * the wrapper around both the rail and the panel instead, which mounts once.
 */
export function SolutionsTabs({
  enterOnLoad = false,
}: {
  /** SectionHeading opt-in: play the header's load entrance instead of
   *  scroll-revealing it. The /gifts directives have alternated between
   *  static and scroll-revealed headers more than once; currently UNPASSED on
   *  every render path — the default scroll reveal is live. The prop is kept
   *  as the page-scoped lever rather than re-plumbed next time. */
  enterOnLoad?: boolean;
}) {
  const [activeId, setActiveId] = useState(solutions[0].id);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;

  /**
   * Auto-cycling through the four solutions, every 6 seconds. The cycle is
   * paused while the pointer is over the section or any tab has keyboard
   * focus, so it never re-selects a tab under a reader who is using it, and
   * it is cancelled outright for readers who asked for reduced motion —
   * this project's `prefers-reduced-motion` handling is scoped per
   * component and carries no blanket rule, so the check is made here.
   *
   * The advance writes `setActiveId` directly rather than calling `select`:
   * `select` additionally rewrites the URL hash, and a rotating tab must not
   * rewrite the shareable URL every 6 seconds. The hash therefore keeps the
   * reader's last MANUAL choice (or none), while the panel follows the
   * cycle. The hash effect below still wins on a reload that carries one.
   */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActiveId((current) => {
        const index = solutions.findIndex((solution) => solution.id === current);
        return solutions[(index + 1) % solutions.length].id;
      });
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  /**
   * Deep-link support. Only one panel is visible at a time, so a hash pointing
   * at an inactive solution would leave the reader looking at a different
   * panel — all four are mounted, but only the active one is shown. Read the
   * hash in an effect rather than during render — `window` does not exist
   * during SSR, and reading it inline would desynchronise the server HTML
   * from the first client paint.
   */
  useEffect(() => {
    const fromHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (solutions.some((solution) => solution.id === fromHash)) {
      setActiveId(fromHash);
    }
  }, []);

  /**
   * Selecting a tab rewrites the hash so the URL stays shareable and so
   * reload keeps the tab. `replaceState` rather than `location.hash` because
   * the latter would also scroll the page on every click, yanking the reader
   * away from the panel they just opened. The existing history state object is
   * passed through so the Next.js router's own state is left intact.
   */
  function select(id: string) {
    setActiveId(id);
    window.history.replaceState(window.history.state, "", `#${id}`);
  }

  const active = solutions.find((s) => s.id === activeId) ?? solutions[0];
  /* Reduced-motion users get the rail in its final state: no entrance
     orchestration is created at all (matching the catalog cascade's stance). */
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="solutions"
      className="scroll-mt-28 border-t border-section-divider bg-surface py-section md:scroll-mt-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="center"
          enterOnLoad={enterOnLoad}
          eyebrow="Tailored solutions"
          title={
            <>
              Fulfilment built for <em className="accent-em">goals</em>
            </>
          }
          description="Explore how Fulfill Nest powers corporate gifting across every stage of the employee and client journey."
        />

        {/* The pause surface. Hovering anywhere over the section (not just
            the rail) freezes the auto-cycle; leaving resumes it on the next
            interval tick. Focus is treated like hover so the cycle never
            re-selects a tab underneath a keyboard user mid-interaction. */}
        <div
          data-reveal-item
          className="mt-14 md:mt-16"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlur={(event) => {
            /* Only resume when focus leaves the section entirely; moving
               between the tab buttons keeps the cycle paused. */
            if (
              !(event.relatedTarget instanceof Node) ||
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              setFocused(false);
            }
          }}
        >
          {/* Tab rail. Persistent pill shapes in BOTH states so the rail never
              collapses into bare labels: the active tab is a solid brick pill
              (`bg-brick-red`, token #a83b24 — the site's trademark brick red)
              with white text, and the unselected tabs keep a subtle stone
              border + tinted fill at all times. Every pill shares the same
              padding (`px-5 py-2.5`), font weight, and 1px border box, so the
              whole row sits on one top baseline and switching tabs never
              changes a pill's outline box or the rail's width — the only
              thing that moves between states is the colour. The active pill's
              border is transparent (present for the box model, invisible
              against its fill). No underline anywhere. The focus ring uses
              the same brick token — white on brick measures 6.02:1, AA.
              Scrolls horizontally below 768px rather than wrapping, because
              four labels wrap into a ragged two-row block that reads as a
              layout accident. `-mx-5 px-5` lets the rail bleed to the screen
              edge on mobile so the first and last tab are both reachable. */}
          {/* Tab-rail scroll entrance, per the tab-bar entrance brief: the rail
              observes its own viewport entry (once, 25% visible) and the four
              pills stagger in left-to-right (0.08s apart) with a short 15px
              rise and fade. framer-motion rather than the shared `data-reveal-*`
              markers, so the orchestration is self-contained and cannot
              re-run on tab switches. Reduced motion renders the rail complete
              with no observer created. The pills keep every interaction
              class — only the entrance is new.

              The active content panel below is deliberately NOT converted to
              an AnimatePresence remount (key={tabId}): the panel stack's
              recorded design cross-fades all four panels inside one
              fixed-height cell — the cell sizes to the tallest panel by
              construction, so a switch cannot shift layout, the incoming
              photo never re-requests (all four stay mounted), and
              translate/scale offsets were considered and rejected there for
              the high-end directionless fade. AnimatePresence would hand the
              cell's height back to whichever panel is active and re-trade
              everything that was paid for. */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={reduceMotion ? undefined : { once: true, amount: 0.25 }}
            variants={reduceMotion ? undefined : RAIL_VARIANTS}
            role="tablist"
            aria-label="Fulfillment solutions"
            className="solution-tablist -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 md:mx-0 md:justify-center md:overflow-visible md:px-0"
          >
            {solutions.map((solution) => {
              const selected = solution.id === active.id;

              return (
                <motion.button
                  variants={reduceMotion ? undefined : TAB_VARIANTS}
                  key={solution.id}
                  type="button"
                  role="tab"
                  id={`solution-tab-${solution.id}`}
                  aria-selected={selected}
                  aria-controls={`solution-panel-${solution.id}`}
                  onClick={() => select(solution.id)}
                  className={`min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                    selected
                      ? "border-transparent bg-brick-red text-white"
                      : "border-stone-200 bg-stone-50/60 text-stone-600 hover:border-stone-300 hover:bg-stone-100"
                  }`}
                >
                  {solution.tab}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Panel stack. All four panels live in one grid cell
              (`col-start-1 row-start-1`), so the cell — and therefore the
              section — sizes to the TALLEST of the four. That is "Milestones
              & Celebrations", whose body is the longest, and it is dominant at
              every breakpoint, including narrow ones where its text wraps the
              most. The height is defined by construction rather than by a
              measured number: with all four panels in the cell there is
              nothing to maintain, and the section can never collapse when a
              shorter tab is selected.

              The panels are top-aligned (`items-start`) on purpose. Because
              every panel shares the same top edge, the H3 — and the photo —
              start on the same line in every tab; selecting another tab never
              makes the heading jump vertically. A vertically-centred stack
              (`items-center`) would float each tab's text column (whose
              height varies with body length and bullet count) up or down
              against the photo, fracturing exactly the top baseline this
              layout is there to hold.

              The inactive panels stay IN the cell, fully transparent — which
              is what permits the cross-fade in the first place. The
              `absolute inset-0` overlay pattern was considered and rejected:
              pulling inactive panels out of flow hands the cell's height back
              to whichever panel is active, reintroducing exactly the collapse
              this stack exists to remove.

              Motion is a pure opacity cross-fade, nothing else. There are no
              translate offsets, no scale, no rotation, no zoom: every panel
              is always at translate 0 / scale 100%, and a tab switch only
              moves opacity 0 → 100 (incoming) and 100 → 0 (outgoing) over
              500ms `ease-in-out`, layered by z-index so the incoming panel
              softens in above the outgoing one. Content and photos simply
              fade in place — directionless and silent, the high-end fade the
              design calls for. The image frame carries no shadow, glow, or
              group-hover zoom either, so nothing else can ghost behind the
              swap (see below).

              Trade-off against the former single-panel remount: all four
              photos are now mounted (Next Image handles their loading and
              decoding), paid for the ability to fade between tabs instead of
              swapping them. The old `key` remount re-requested one photo at
              the correct size per tab and could not cross-fade.

              Inactive panels are `inert`, not merely transparent: inert
              blocks focus and removes a subtree from the accessibility tree,
              so a keyboard reader cannot tab into a hidden "Explore" button.
              `aria-hidden` mirrors it for readers that do not implement
              inert.

              The panels carry NO scroll-reveal of their own, and that is the
              deliberate consequence of the note at the top of this file: the
              reveal sits on the `data-reveal-item` wrapper above (rail +
              panels together), which mounts once. A marker inside a panel
              would re-run its entrance on every slide. */}
          <div className="mt-12 grid md:mt-16">
            {solutions.map((solution) => {
              const selected = solution.id === active.id;

              return (
                <div
                  key={solution.id}
                  role="tabpanel"
                  id={`solution-panel-${solution.id}`}
                  aria-labelledby={`solution-tab-${solution.id}`}
                  aria-hidden={!selected}
                  inert={!selected}
                  className={`col-start-1 row-start-1 grid items-start gap-10 md:gap-12 transition-opacity duration-500 ease-in-out lg:grid-cols-2 ${
                    selected
                      ? "z-10 opacity-100 pointer-events-auto"
                      : "z-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="order-2 lg:order-1">
                    <h3 className="text-h3 text-charcoal">{solution.tab}</h3>

                    <p className="mt-5 max-w-xl text-body-lg text-taupe">
                      {solution.body}
                    </p>

                    {/* Feature list. Each bullet carries its own contextual glyph from the
                        LOCAL icon set — no icon package is installed (the
                        Icons file says so), and the file's default colour
                        for feature glyphs is accent-700; the brief overrides
                        it to `text-brick-red` so the list sits with the
                        brick pill rail, which is why that tint is a
                        documented call-site exception. `mr-3` spaces the
                        glyph from the text (the old `gap-3` is gone) and
                        `mt-0.5` keeps the 20px glyph level with the first
                        line of wrapped copy. */}
                    <ul className="mt-7 flex flex-col gap-3.5">
                      {solution.points.map((point) => (
                        <li key={point.text} className="flex items-start">
                          <point.icon className="mt-0.5 h-5 w-5 shrink-0 text-brick-red mr-3" />
                          <span className="text-body text-charcoal">{point.text}</span>
                        </li>
                      ))}
                    </ul>

                    <ButtonLink href="/contact" variant="primary" className="mt-9">
                      {solution.cta}
                      <ArrowRightIcon className="h-4 w-4" />
                    </ButtonLink>
                  </div>

                  {/* The tab's photo frame. Deliberately flat and static: the brief
                      asked for no scale or zoom on the image, no elevation or
                      glow behind it, and no ghost layer mid-transition — a
                      shadowed box cross-fading read as exactly that. So the
                      frame is `rounded-card` (20px, the section's established
                      frame radius) + `overflow-hidden` for the crop and
                      nothing else: no `group`, no `shadow-elev-2`, and the
                      image never scales on hover. The text column and this
                      photo both fade in place because the whole panel is the
                      single opacity target above. */}
                  <div className="order-1 lg:order-2 relative aspect-[3/2] overflow-hidden rounded-card">
                    <Image
                      src={solution.image}
                      alt={solution.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: solution.imagePosition }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}