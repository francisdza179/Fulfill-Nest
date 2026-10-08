import { serviceFaqs } from "@/lib/data";
import { FaqList } from "@/sections/FaqList";

/**
 * Services FAQs — ordering, logistics and customisation (no company-background
 * filler, which stays on the /faq page and the home page).
 *
 * Thin wrapper over the shared `FaqList` band. This used to be a hand-rolled
 * copy of that band on a `bg-surface-muted` (#faf8f3) canvas with its own
 * native `<details>` accordion and a top hairline; it now inherits the home
 * page's #ffffff band, container rhythm, `SectionHeading` typography and
 * `FaqAccordion` markup verbatim, keeping only the questions and the heading
 * copy that is specific to this page.
 *
 * `divider={false}` because the testimonial band above is `bg-white` — the
 * same white-on-white edge the home page drops its hairline for.
 */
export function ServicesFaq({
  enterOnLoad = false,
}: {
  /** Page-scoped header lever, forwarded to `FaqList` / `SectionHeading`.
   *  Currently UNPASSED — the default scroll reveal is live. Kept for the
   *  next directive flip rather than re-plumbed. */
  enterOnLoad?: boolean;
}) {
  return (
    <FaqList
      items={serviceFaqs}
      divider={false}
      eyebrow="Service & ordering FAQs"
      title={
        <>
          FAQs about our <em className="accent-em">services</em>
        </>
      }
      description="Ordering, MOQs, customisation and delivery logistics — everything you need before you brief us."
      link={{ href: "/contact", label: "Ask a specific question" }}
      enterOnLoad={enterOnLoad}
    />
  );
}
