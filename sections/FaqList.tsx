import type { ReactNode } from "react";
import Link from "next/link";
import { faqs, type FaqItem } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface FaqListProps {
  id?: string;
  /**
   * Question set to render. Defaults to the /faq page list; the home page
   * passes its own eight-item operational set, and /services, /industries and
   * /pricing pass theirs.
   */
  items?: FaqItem[];
  /**
   * Draw the `border-t` hairline above the band. Defaults to true because the
   * call sites that sit on a warm canvas need it to mark a real colour edge.
   * The home page opts out, and so
   * do the three interior pages: their testimonial band above is now also
   * #ffffff, so the two sections form one continuous white field and the
   * hairline would cut an arbitrary line across it — the only separator left is
   * the one that belongs.
   */
  divider?: boolean;
  /**
   * Heading overrides. Unset by the home page, which uses the copy below. The
   * three interior pages supply their own eyebrow/title/description so each
   * band still speaks to its own questions — only the *typography* is shared,
   * and that comes from `SectionHeading` itself, not from the strings.
   */
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  /**
   * Optional "ask us instead" link under the heading. /services and
   * /industries pass one; the home page and /pricing do not. Styled inline here
   * rather than per call site so the link cannot drift from the band it sits
   * in.
   */
  link?: { href: string; label: string };
  /**
   * Threads `SectionHeading`'s `enterOnLoad` — the page-scoped header lever.
   * The /gifts directives have alternated between static and scroll-revealed
   * headers; currently UNPASSED by every call site, so the default scroll
   * reveal runs on all live bands (home, /gifts, /industries, /pricing).
   * Kept rather than re-plumbed next time.
   */
  enterOnLoad?: boolean;
}

/**
 * FAQs — two-column editorial band: heading left, accordion right.
 *
 * Server component. The interactive disclosure is delegated to the client-side
 * `FaqAccordion` so the section shell and heading stay server-rendered.
 *
 * Single shell for every FAQ band on the site — home, /services, /industries
 * and /pricing all render this and vary only `items` and the heading strings.
 *
 * /faq does NOT render this any more. It has its own section
 * (`FaqKnowledgeBase`, wrapping the client-side `FaqHub`) because that page is
 * 25 questions over six categories rather than a route-specific 8, and a
 * two-column heading-left shell is the wrong shape for a list a reader has to
 * filter. The `items` default below is therefore no longer reached by any live
 * call site — all four pass their own set — but the `faqs` import is kept
 * rather than made required, because "renders the canonical list if you forget
 * to pass one" is a better failure mode than a type error on a prop.
 *
 * The three interior pages previously carried hand-rolled
 * copies of this markup, which had drifted: /services sat on `bg-surface-muted`
 * (#faf8f3), /pricing on `bg-warm-grey` (#f7f4eb) with a centred single column
 * and a decorative sage wash, and each had its own accordion (two native
 * `<details>`, one bespoke framer-motion implementation). Same questions, three
 * different bands. Collapsing them onto this one component is what makes
 * "identical to the home page" a structural guarantee instead of a promise
 * three files have to keep re-making.
 *
 * One knock-on that is a fix rather than a regression: `FaqAccordion` sets
 * `focus-visible:ring-offset-surface` on its triggers. That offset token is
 * white, and every band is white now, so the focus ring reads correctly. On the
 * old warm /pricing canvas the white offset was already wrong.
 */
export function FaqList({
  id,
  items = faqs,
  divider = true,
  eyebrow = "FAQs",
  title = (
    <>
      Questions we{" "}
      hear every{" "}
      <em className="accent-em">week</em>
    </>
  ),
  description = "Everything procurement and people teams usually ask before their first programme. Anything else — just ask.",
  link,
  enterOnLoad = false,
}: FaqListProps) {
  return (
    <section
      id={id}
      className={`bg-surface py-section ${
        divider ? "border-t border-section-divider" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              enterOnLoad={enterOnLoad}
              eyebrow={eyebrow}
              title={title}
              description={description}
            />
            {link ? (
              <Link
                href={link.href}
                data-reveal-item
                className="link-ribbon mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-600"
              >
                {link.label}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <div className="lg:col-span-8">
            <FaqAccordion items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
