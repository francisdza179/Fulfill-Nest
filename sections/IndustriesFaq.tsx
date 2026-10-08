import { industryFaqs } from "@/lib/data";
import { FaqList } from "@/sections/FaqList";

/**
 * Industries FAQs — the questions procurement and people teams ask sector by
 * sector: MOQs, international shipping, policy limits and last-minute bulk
 * orders.
 *
 * Thin wrapper over the shared `FaqList` band, so the white surface, container
 * rhythm, `SectionHeading` typography and `FaqAccordion` markup are the home
 * page's rather than a second copy that can drift from it. Only the questions
 * and this page's heading copy are its own.
 *
 * `divider={false}` because the testimonial band above is `bg-white`.
 */
export function IndustriesFaq() {
  return (
    <FaqList
      items={industryFaqs}
      divider={false}
      eyebrow="Industry FAQs"
      title={
        <>
          Questions by sector,{" "}
          <em className="accent-em">answered</em>
        </>
      }
      description="MOQs, international reach, policy limits and rush orders — what teams usually ask us about their sector's fit before brief."
      link={{ href: "/contact", label: "Ask about your sector" }}
    />
  );
}
