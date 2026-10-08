"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ValueProp } from "@/lib/data";
import { ChevronDownIcon } from "@/components/ui/Icons";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/**
 * Editorial belief grid — the About-page variant of the ValueProps band.
 *
 * A clean full-width three-column grid with generous typography spacing:
 * a large accent numeral, the belief title and body copy in each column, and
 * a subtle inline toggle that reveals the belief's `detail` text beneath it.
 * No icon circles, no right-hand blocks — just number, title and words. The
 * numeral warms to charcoal on hover, matching the site-wide list interaction.
 */
export function ValueGrid({ items }: { items: ValueProp[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reducedMotion ? undefined : containerVariants}
      className="mt-16 grid gap-x-10 gap-y-14 border-t border-section-divider pt-4 md:grid-cols-3"
    >
      {items.map((value, index) => {
        const number = String(index + 1).padStart(2, "0");
        const isOpen = openIndex === index;
        const buttonId = `belief-${index}-button`;
        const panelId = `belief-${index}-panel`;

        return (
          <motion.article
            key={value.title}
            variants={reducedMotion ? undefined : itemVariants}
            className="group flex flex-col"
          >
            <span
              className="stat-numeral text-5xl leading-none text-brand-green-700 transition-colors duration-300 ease-in-out group-hover:text-copper md:text-6xl"
              aria-hidden="true"
            >
              {number}
            </span>
            <h3 className="mt-6 font-display text-2xl text-charcoal transition-colors duration-300 ease-in-out group-hover:text-brand-green-700">
              {value.title}
            </h3>
            <p className="mt-4 flex-1 text-body text-taupe">
              {value.body}
            </p>

            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-accent-600 transition-colors duration-300 ease-in-out hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-grey"
            >
              {isOpen ? "Read less" : "Read more"}
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-500 [transition-timing-function:var(--ease-premium)] motion-reduce:transition-none ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-md pt-4 text-body text-taupe">
                  {value.detail}
                </p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
