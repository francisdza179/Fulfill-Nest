"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

const defaultHeading = (
  <>
    Fulfill Nest turns employee gifting into a culture-building{" "}
    <em className="font-medium italic" style={{ color: "var(--color-brick-red, #a83b24)" }}>
      advantage.
    </em>
  </>
);

export function EditorialStatement({
  children = defaultHeading,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section className={`relative py-32 md:py-48 ${className}`.trim()}>
      <motion.div
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={reducedMotion ? undefined : containerVariants}
        className="mx-auto max-w-4xl px-6 text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-display-xl text-charcoal leading-tight">
          {children}
        </h2>
      </motion.div>
    </section>
  );
}