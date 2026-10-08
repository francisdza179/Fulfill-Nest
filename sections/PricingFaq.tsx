import { pricingFaqs } from "@/lib/data";
import { FaqList } from "@/sections/FaqList";

/**
 * Pricing FAQs — fees, billing, tier flexibility, delivery changes and volume
 * pricing.
 *
 * Thin wrapper over the shared `FaqList` band. This one diverged furthest: a
 * centred single column on a `bg-warm-grey` (#f7f4eb) canvas with a decorative
 * sage wash behind the header, a `max-w-3xl` accordion, and its own
 * framer-motion accordion (single-open, animated plus/minus) instead of the
 * site-wide `FaqAccordion`. It now renders the same two-column editorial band
 * as the home page — same #ffffff surface, same container, same heading
 * typography, same accordion — and is a server component again, so the band
 * no longer ships a client bundle of its own.
 *
 * The eyebrow was reworded from "Got questions?" to match the siblings
 * ("Service & ordering FAQs", "Industry FAQs") and the home page's "FAQs". The
 * questions, title and lead are unchanged.
 *
 * `divider={false}` because the testimonial band above is `bg-white`.
 */
export function PricingFaq() {
  return (
    <FaqList
      items={pricingFaqs}
      divider={false}
      eyebrow="Pricing & billing FAQs"
      title={
        <>
          Frequently asked questions about{" "}
          <em className="accent-em">billing</em>
        </>
      }
      description="Straight answers on fees, invoices, flexibility and delivery — everything procurement and people teams ask before signing off."
    />
  );
}
