import { faqs, faqCategories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqHub } from "@/components/faq/FaqHub";

/**
 * /faq knowledge hub — the full, filterable question set.
 *
 * NOT `FaqList`. The other four FAQ bands on the site are two-column editorial
 * (heading left, accordion right) over a fixed 8–9 question list, which is the
 * right shape for "the questions this route's reader has". This page is the
 * opposite: 25 questions over six topics, where the reader's first move is to
 * narrow rather than scroll. Forcing the hub through that shell would have
 * meant either a 25-row single column with no way to filter, or a filter whose
 * controls sat in a 4-column sidebar far from the list they change.
 *
 * So this is a full-width band: heading, then the search field and category
 * pills on one row, then the grouped accordion. The controls are close to the
 * results and to each other, which is the whole point of a filter.
 *
 * No question count appears in the copy. The live count is rendered by
 * `FaqHub` from the array length, which is the only place that number exists.
 *
 * `divider` is drawn because the hero above is `bg-bg-canvas` (#fbf9f5) and
 * this band is `bg-surface` (#ffffff) — a real colour edge, not an arbitrary
 * line.
 */
export function FaqKnowledgeBase() {
  return (
    <section
      id="knowledge-base"
      className="border-t border-section-divider bg-surface py-section"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The knowledge base"
          title={
            <>
              Everything a procurement team{" "}
              asks us{" "}
              <em className="accent-em">first</em>
            </>
          }
          description="Every question a procurement team asks us, across operations, network, campaigns, pricing, integrations and compliance. Search it, or filter by topic — and if your question is not here, it is a fair one to ask."
        />

        <div data-reveal-item className="mt-12 md:mt-16">
          <FaqHub items={faqs} categories={faqCategories} />
        </div>
      </div>
    </section>
  );
}
