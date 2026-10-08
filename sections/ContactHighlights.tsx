"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChatIcon, SparklesIcon, TruckIcon } from "@/components/ui/Icons";

const nextSteps = [
  {
    title: "We listen",
    body: "A short discovery call about your people, your audience and the moment.",
    Icon: ChatIcon,
  },
  {
    title: "We curate",
    body: "Bespoke concepts, budgets and timelines — back within 48 hours.",
    Icon: SparklesIcon,
  },
  {
    title: "We deliver",
    body: "Packing, personalised notes and tracked fulfilment, guaranteed on time.",
    Icon: TruckIcon,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/** Contact highlights — three unboxed steps with staggered scroll entrance
 *  and a subtle hover lift. Kept as a client component so the page itself can
 *  remain a Server Component and continue exporting `metadata`. */
export function ContactHighlights() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-section-divider bg-surface py-section">
      <div className="mx-auto max-w-7xl px-6">
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reducedMotion ? undefined : containerVariants}
          className="grid gap-5 md:grid-cols-3"
        >
          {nextSteps.map((step, index) => {
            const Icon = step.Icon;
            return (
              <motion.li
                key={step.title}
                variants={reducedMotion ? undefined : itemVariants}
                className="group flex gap-5"
              >
                <Icon className="mt-1 h-6 w-6 shrink-0 text-accent-700 transition-colors duration-300 group-hover:text-brand-green-700" />
                <div>
                  <p className="font-display text-lg font-semibold text-charcoal transition-colors duration-300 group-hover:text-brand-green-700">
                    <span className="stat-numeral mr-2 text-sm text-brand-green-700">
                      {index + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-taupe">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        <p className="mt-8 text-center text-xs uppercase tracking-[0.08em] text-walnut">
          Response within 24 hours · No obligation · No clutter
        </p>
      </div>
    </section>
  );
}
