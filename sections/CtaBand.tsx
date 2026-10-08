"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/ButtonLink";

interface CtaBandProps {
  /**
   * Editorial headline — plain text, or JSX in which the FINAL WORD is wrapped
   * in `<em className="accent-em">`.
   *
   * HOUSE RULE: the closing accent word is always the last word of the
   * headline. Four routes used to emphasise a mid-sentence word instead
   * ("thoughtful", "results", "fits", "transparent") and now accent the final
   * word ("again", "organization", "team", "campaign"); the other four already
   * did. Trailing punctuation stays OUTSIDE the <em> so the italic does not
   * lean on the question mark.
   *
   * The class styles itself, so callers pass no colour or italic utilities.
   * Note `accent-em` resolves to #a83b24, which is the SAME literal as
   * `--color-brick-red` — globals.css declares both separately only because
   * Tailwind's opacity modifiers need a literal colour, not a `var()` alias.
   * So this word is already brick red; no `accent-em--brick` exists because it
   * would be a third name for one value.
   */
  headline: ReactNode;
  subtext: string;
  buttonText: string;
  buttonLink: string;
  /**
   * Static-header opt-in for THIS band's own header block. When a caller
   * passes `true`, the Framer Motion entrance plays immediately on mount
   * (`animate="visible"`) instead of waiting for the viewport. Currently
   * UNPASSED by every route — the default scroll reveal runs everywhere; kept
   * as the lever the /gifts directives alternate on.
   */
  enterOnLoad?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/**
 * Fallback copy (Home-page voice) so pages that don't customise ("Journal",
 * "FAQs", …) keep a sensible generic CTA. Each page can override any slice.
 */
const fallbackProps: CtaBandProps = {
  headline: (
    <>
      Let&apos;s build a reward programme your people will{" "}
      <em className="accent-em">remember</em>
    </>
  ),
  subtext:
    "Tell us what you're celebrating. In 48 hours you'll have a curated shortlist — budgets, timelines, and logistics included.",
  buttonText: "Book a consultation",
  buttonLink: "/contact",
};

/**
 * Shared conversion band used at the close of every route.
 *
 * Deliberately undecorated: the paper grain, terracotta radial glow and the
 * bottom ribbon wave that used to sit behind this band are gone. The surface is
 * a flat canvas with hairline dividers only, so the closing CTA reads as clean
 * typography. Because this component is shared, the band is identical on every
 * route.
 *
 * ENTRANCE is handled by Framer Motion. The inner content container is a
 * viewport-triggered parent (`whileInView`, `amount: 0.25`, `once: true`) and
 * the headline, subtext and CTA button fade up with a 0.1s stagger. When a
 * caller opts into `enterOnLoad`, the same variants play immediately on mount
 * instead of waiting for the viewport. The previous CSS reveal marker
 * (`data-reveal-header`) and the `heading-enter` paint class have been removed
 * so the two systems do not both drive the same nodes.
 */
export function CtaBand(props: Partial<CtaBandProps> = {}) {
  const { headline, subtext, buttonText, buttonLink, enterOnLoad = false } = {
    ...fallbackProps,
    ...props,
  };
  const reducedMotion = useReducedMotion();

  const motionProps = reducedMotion
    ? { initial: "visible" as const }
    : enterOnLoad
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.25 },
        };

  return (
    <section className="overflow-hidden border-y border-section-divider bg-bg-canvas py-section">
      <motion.div
        {...motionProps}
        variants={reducedMotion ? undefined : containerVariants}
        className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center"
      >
        {/* The accent word in `headline` styles itself via the shared
            `accent-em` utility. This heading previously carried
            `[&_em]:font-serif [&_em]:font-medium [&_em]:italic
            [&_em]:text-accent-700`, which overrode whatever class the
            caller's <em> carried — a descendant selector compiles to a
            class+element pair, so it outranked the <em>'s own utilities.
            That is why "remember" rendered in Playfair and an off-tone
            terracotta no matter what the caller passed. One source of truth
            now, so the overrides are gone. */}
        <motion.h2
          variants={reducedMotion ? undefined : itemVariants}
          className="text-display text-charcoal"
        >
          {headline}
        </motion.h2>
        <motion.p
          variants={reducedMotion ? undefined : itemVariants}
          className="max-w-xl text-body-lg text-taupe"
        >
          {subtext}
        </motion.p>
        <motion.div variants={reducedMotion ? undefined : itemVariants}>
          <ButtonLink href={buttonLink} variant="primary" className="mt-2">
            {buttonText}
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
