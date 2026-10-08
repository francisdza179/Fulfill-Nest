import { products } from "@/lib/data";
import { ProductShowcaseClient } from "@/components/catalog/ProductShowcaseClient";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Product showcase — premium catalog with category/budget filters. */
export function ProductShowcase() {
  return (
    <section className="relative overflow-hidden border-t border-section-divider bg-surface py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="The curated catalog"
            title={
              <span className="text-[clamp(1.7rem,8vw,2.125rem)] md:text-[inherit]">
                Reward moments,{" "}
                thoughtfully{" "}
                <em className="accent-em">curated</em>
              </span>
            }
            description="A living collection of curated onboarding kits, festive hampers, and milestone rewards—filtered by occasion, recipient team, and per-head budget."
          />
        </div>
        <div className="mt-12">
          <ProductShowcaseClient items={products} />
        </div>
      </div>
    </section>
  );
}