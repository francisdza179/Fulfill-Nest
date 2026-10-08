"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide, scroll-triggered reveal choreography.
 *
 * Sections opt in through semantic markers rather than broad descendant
 * selectors, so bespoke motion (heroes, marquees, carousels, parallax layers
 * and calculator internals) is never touched. A small observer pool lives in
 * the root layout, reveals each target once, and rescans on route changes or
 * streamed DOM updates.
 *
 * THE TRIGGER, IN ONE LINE: a target reveals once any part of it is 80px into
 * the viewport - so content that is partly on screen at load animates on
 * arrival, and content that is entirely below the fold waits for the scroll
 * that brings it in. Both halves matter and the pairing is deliberate. The 80px
 * inset alone would fire entrances on content the reader cannot see; a
 * meaningful `intersectionRatio` alone would leave a section's own heading at
 * `opacity: 0` while it sat in plain view. See the threshold note in `scan`.
 */

const STEP_MS = 100;
const CONTENT_OFFSET_MS = 300;
/* Must equal the `transition` duration in the `.reveal-on-scroll` rules in
   app/globals.css (0.6s). It is the entrance's real length plus the last
   `--reveal-delay`, so it schedules the `is-settled` handoff; drift it
   downward and transform control is returned mid-flight, upward and each
   animated node holds a `will-change` hint for a frame longer than it needs. */
const REVEAL_DURATION_MS = 600;
const SETTLE_BUFFER_MS = 80;
const REVEAL_CLASS = "reveal-on-scroll";
const REVEALED_CLASS = "is-revealed";
const SETTLED_CLASS = "is-settled";
const COMPLETE_ATTRIBUTE = "data-reveal-complete";
const BOUNDARY_SELECTOR = "[data-reveal-trigger], [data-reveal-unit]";

function addRevealNode(node: Element, delayMs: number): HTMLElement | null {
  if (!(node instanceof HTMLElement)) return null;

  node.classList.add(REVEAL_CLASS);
  node.style.setProperty("--reveal-delay", `${delayMs}ms`);
  return node;
}

function collectRevealNodes(target: HTMLElement): HTMLElement[] {
  const nodes = new Set<HTMLElement>();
  const isOwnedByTarget = (node: Element) => {
    const boundary = node.closest<HTMLElement>(BOUNDARY_SELECTOR);
    return !boundary || boundary === target;
  };
  const ownedMarkers = (selector: string) => {
    const markers = Array.from(
      target.querySelectorAll<HTMLElement>(selector),
    );
    if (target.matches(selector)) markers.unshift(target);
    return markers.filter(isOwnedByTarget);
  };
  const revealableChildren = (container: Element) =>
    Array.from(container.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
  const configuredDelay = (name: string, fallback: number) => {
    const value = Number(target.getAttribute(name));
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  };
  const headerStep = configuredDelay("data-reveal-header-step", STEP_MS);
  const contentOffset = configuredDelay(
    "data-reveal-content-offset",
    CONTENT_OFFSET_MS,
  );
  const staggerStep = configuredDelay(
    "data-reveal-stagger-step",
    STEP_MS,
  );

  /* Header rhythm: eyebrow -> heading -> description. */
  ownedMarkers("[data-reveal-header]").forEach((header) => {
    let step = 0;
    revealableChildren(header).forEach((child) => {
      if (child.hasAttribute("data-reveal-stagger")) return;
      nodes.add(addRevealNode(child, step * headerStep)!);
      step += 1;
    });
  });

  /* Grid/card/image rhythm, offset from the completed header sequence. */
  ownedMarkers("[data-reveal-stagger]").forEach((container) => {
    revealableChildren(container).forEach((child, index) => {
      nodes.add(addRevealNode(child, contentOffset + index * staggerStep)!);
    });
  });

  /* Standalone groups such as a feature card, logo rail or CTA wrapper. */
  ownedMarkers("[data-reveal-item]").forEach((item, index) => {
    nodes.add(addRevealNode(item, contentOffset + index * staggerStep)!);
  });

  /* Legal units and any future simple section can expose their direct
     children without extra markers. */
  if (nodes.size === 0 && target.hasAttribute("data-reveal-unit")) {
    revealableChildren(target).forEach((child, index) => {
      nodes.add(addRevealNode(child, index * STEP_MS)!);
    });
  }

  return Array.from(nodes);
}

export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const root = document.querySelector("main") ?? document.body;

    /* Per-effect registries keep Strict Mode's setup/cleanup/setup cycle
       idempotent without preventing repeat scans inside the same effect. */
    const preparedTargets = new WeakSet<Element>();
    const nodesByTarget = new Map<Element, HTMLElement[]>();
    const completedTargets = new Set<HTMLElement>();
    const settleTimers = new Set<number>();

    let scanFrame = 0;

    const scheduleSettle = (node: HTMLElement) => {
      const configuredDelay =
        Number.parseFloat(node.style.getPropertyValue("--reveal-delay")) || 0;
      const timer = window.setTimeout(() => {
        node.classList.add(SETTLED_CLASS);
        settleTimers.delete(timer);
      }, configuredDelay + REVEAL_DURATION_MS + SETTLE_BUFFER_MS);

      settleTimers.add(timer);
    };

    const revealNodes = (nodes: HTMLElement[]) => {
      nodes.forEach((node) => {
        if (node.classList.contains(REVEALED_CLASS)) return;

        if (reducedMotion.matches) {
          node.classList.add(REVEALED_CLASS, SETTLED_CLASS);
          return;
        }

        node.classList.add(REVEALED_CLASS);
        scheduleSettle(node);
      });
    };

    const observerByThreshold = new Map<number, IntersectionObserver>();
    const getRevealObserver = (threshold: number) => {
      const existing = observerByThreshold.get(threshold);
      if (existing) return existing;

      let observer!: IntersectionObserver;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.intersectionRatio < threshold) {
              return;
            }

            const target = entry.target as HTMLElement;
            observer.unobserve(target);

            /* RE-COLLECT HERE, NOT FROM THE `scan`-TIME CACHE - do not read
             * `nodesByTarget` on this path.
             *
             * `scan()` walks each target once and caches what it found, and the
             * trigger used to replay that cached list verbatim. The cache is
             * only correct if nothing inside the target changes between the
             * scan and the trigger - which for a target that starts below the
             * fold is most of the reader's scroll. A node that mounts in that
             * window was in neither list: not in the cache, so it never got
             * `.is-revealed`, and not in `refreshCompletedTargets` either,
             * because that only walks targets that have ALREADY completed. So
             * it kept the unlayered `opacity: 0` forever while staying focusable
             * and clickable - content that has silently vanished from a page
             * that is otherwise working, which is the hardest kind of reveal bug
             * to see and report.
             *
             * Walking again costs one `querySelectorAll` per target, once, at
             * the moment it is already doing layout work for its entrance. The
             * re-collected list also replaces the cache, so `refreshCompletedTargets`
             * compares against what is really on screen from here on.
             *
             * For nodes that were already collected this is a no-op: the same
             * elements come back, `addRevealNode` re-adds classes they already
             * have, and `revealNodes` skips anything already `.is-revealed`. */
            const nodes = collectRevealNodes(target);
            nodesByTarget.set(target, nodes);

            /* ONE FRAME BEFORE THE REVEAL - do not "simplify" this away.
             *
             * `.reveal-on-scroll` is `opacity: 0` and `.is-revealed` is
             * `opacity: 1`, so the entrance is a TRANSITION and it needs a
             * painted `opacity: 0` to transition away from. If both classes
             * land in the same rendering batch the browser never sees an
             * intermediate state and the element simply appears - no animation
             * at all, which reads as "the entrance is broken".
             *
             * This never used to matter here, because at `threshold: 0.15` a
             * section that triggered had almost always been sitting at
             * `opacity: 0` for seconds of scrolling first. At `threshold: 0` a
             * section already on screen at load triggers in the very first
             * observer delivery, close enough to `scan()` that the start state
             * may never be painted - and the entrances silently stopped playing
             * on exactly those sections.
             *
             * Deferring one frame is what `ProductCatalogTabs` and
             * `ProductShowcaseClient` already do for this reason, and
             * `refreshCompletedTargets` below already does it too. For a
             * below-the-fold target the extra frame is a no-op; for one already
             * on screen it is the entire animation. */
            requestAnimationFrame(() => {
              revealNodes(nodes);
              completedTargets.add(target);
              target.setAttribute(COMPLETE_ATTRIBUTE, "");
            });
          });
        },
        {
          threshold,
          /* The 80px bottom inset is the only thing standing between "reveal on
             contact" and "reveal while off-screen". Without it a target one
             pixel into the top of the viewport is technically intersecting and
             the whole entrance plays out where nobody can see it, which is the
             failure the reveal system exists to prevent.

             Paired with `threshold: 0` it draws one line: a target reveals once
             it is 80px into the viewport, and not one pixel before. A section
             already well inside the viewport at load therefore animates on
             arrival; one entirely below the fold does not move until it is
             80px from being read. The same 80px is used by the two catalog
             grids, which carry their own observers so cards can cascade by row. */
          rootMargin: "0px 0px -80px 0px",
        },
      );

      observerByThreshold.set(threshold, observer);
      return observer;
    };

    const scan = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        "section, [data-reveal-trigger], [data-reveal-unit]",
      );

      targets.forEach((target) => {
        if (!root.contains(target) || preparedTargets.has(target)) return;
        if (target.tagName === "SECTION" && target.hasAttribute("data-reveal-exempt")) {
          return;
        }
        if (
          !target.hasAttribute("data-reveal-unit") &&
          target.closest("[data-reveal-exempt]")
        ) {
          return;
        }

        preparedTargets.add(target);
        const nodes = collectRevealNodes(target);
        nodesByTarget.set(target, nodes);

        if (reducedMotion.matches) {
          revealNodes(nodes);
          completedTargets.add(target);
          target.setAttribute(COMPLETE_ATTRIBUTE, "");
          return;
        }

        /* WHEN A TARGET REVEALS. `threshold: 0.25` means a quarter of the
         * target must be visible before the entrance plays. This guarantees
         * animations fire only after the section has scrolled clearly into the
         * active viewport, rather than animating in the background the moment a
         * single pixel crosses the observer edge. A section that is less than
         * 25% visible on load now waits for the reader to bring it further into
         * view; a section already well inside the viewport still animates
         * promptly.
         *
         * A higher per-target `data-reveal-threshold` is still honoured for
         * content that should wait until even more of it is visible. The `>= 0`
         * guard means an explicit `data-reveal-threshold="0"` is respected
         * rather than falling back to the default. */
        const configuredThreshold = Number(
          target.getAttribute("data-reveal-threshold"),
        );
        const threshold =
          Number.isFinite(configuredThreshold) &&
          configuredThreshold >= 0 &&
          configuredThreshold <= 1
            ? configuredThreshold
            : 0.25;

        getRevealObserver(threshold).observe(target);
      });
    };

    /* When a revealed client-rendered list replaces its children (catalog
       filters, for example), give only the new nodes a pending state, commit
       that state for one frame, then play their entrance. Existing nodes keep
       their settled state and original position in the stagger. */
    const refreshCompletedTargets = () => {
      completedTargets.forEach((target) => {
        const previousNodes = new Set(nodesByTarget.get(target) ?? []);
        const nextNodes = collectRevealNodes(target);
        nodesByTarget.set(target, nextNodes);

        const freshNodes = nextNodes.filter(
          (node) => !previousNodes.has(node),
        );
        if (freshNodes.length === 0) return;

        window.requestAnimationFrame(() => revealNodes(freshNodes));
      });
    };

    /* Child-list watching catches late RSC swaps and client-rendered content
       without reacting to the class/attribute mutations made by this module. */
    const mutationObserver = new MutationObserver(() => {
      if (scanFrame) return;
      scanFrame = window.requestAnimationFrame(() => {
        scanFrame = 0;
        scan();
        refreshCompletedTargets();
      });
    });

    mutationObserver.observe(root, { childList: true, subtree: true });
    scan();

    return () => {
      observerByThreshold.forEach((observer) => observer.disconnect());
      observerByThreshold.clear();
      mutationObserver.disconnect();
      if (scanFrame) window.cancelAnimationFrame(scanFrame);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      settleTimers.clear();
    };
  }, [pathname]);

  return null;
}
