"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion, useReducedMotion } from "framer-motion";
import { compliancePillars } from "@/lib/data";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function ComplianceAssurance() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-section-divider bg-linen py-section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <SectionHeading
            eyebrow="Compliance & security assurance"
            title={
              <>
                Compliance{" "}
                <em className="accent-em">assured</em>
              </>
            }
            description="Operational integrity, physical security, and audit-ready fulfilment for every organisation we serve."
            align="left"
          />
        </div>

        <motion.div
          data-reveal-stagger
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reducedMotion ? undefined : containerVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {compliancePillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              variants={reducedMotion ? undefined : itemVariants}
              className="group flex h-full flex-col rounded-card border border-taupe/30 bg-white shadow-elev-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-primary/60 hover:shadow-elev-2 motion-reduce:translate-none"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-card bg-section-divider">
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold tracking-tight text-charcoal">{pillar.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-taupe">{pillar.summary}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}