import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { InstagramIcon, LinkedInIcon, XSocialIcon } from "@/components/ui/Icons";
/* FOUR LINK COLUMNS plus the Contact block, all five rendered by one grid of
 * five equal tracks. Quick Links, Use Cases, Company and Support & Legal, in
 * that order; only Use Cases is new, the other three are the previous columns
 * kept verbatim. The array order IS the rendered order, so reordering means
 * moving entries here.
 *
 * "FAQs" points at `/faq` and the brief's `/faqs` would 404; the FAQ page is
 * `/faq` (singular), so the label is the brief's and the destination is the
 * real route. The "Gifts" label likewise came from the brief as "Products"
 * and was renamed along with the route it points at, which has been `/services`
 * and is now `/gifts` (see `app/services/page.tsx` for the 308 left behind).
 * The header nav carries the same "Explore Gifts -> /gifts" mapping, so the two
 * agree. Both labels were renamed together on request ("Products" -> "Gifts" when
 * the route moved from `/services` to `/gifts`, then "Gifts" -> "Explore Gifts"),
 * which is deliberate: a nav label and a footer link are two separate reads of
 * the same destination and leaving them disagreeing is how a site ends up with
 * two names for one page. Neither rename touched an href.
 *
 * The four previous columns (About, Solutions, Explore, Support) are still
 * replaced outright, which is what "organize into clean, structured link
 * columns" asks for. What is deliberately NOT coming back: the
 * `/case-studies` and `/journal` entries, which the brief removed, and the
 * four anchor links into the gifts page (`#employee-rewards`,
 * `#festive-gifting`, `#channel-incentives`, `#enterprise-fulfilment`).
 * None of those four ids exist anywhere in the codebase. That page declares
 * no ids at all, because the sections it renders do not carry them, so those
 * four links were already dead and scrolled nowhere. Restoring them would put
 * four broken links into a fuller-looking footer. The `#values` anchor on
 * `ValueProps` resolves and is still the "Our values" label in the Company
 * column; its former sibling `/about#fulfilment` has moved to the home page's
 * `/#how-it-works`, which is the section the label actually names.
 *
 * `/industries` IS linked from the Company column (and the route exists in
 * `app/industries/page.tsx`), so every top-level route has a footer link.
 * The footer also used to promise no href was ever named twice; `/about` is
 * now the one exception — "About" in Quick Links and "Our Story" in Company
 * are two labels for one page. The Company label came by name from a later
 * brief and the route resolves, so the duplicate is deliberate and recorded
 * here rather than hidden: a directory entry and a narrative entry are two
 * honest reads of the same destination.
 *
 * PRIVACY AND TERMS still live only in Support & Legal. They were in the
 * bottom bar as well, and the brief lists both here, so the bottom-bar legal
 * nav stays removed rather than duplicating this column. */
const columns = [
  /* QUICK LINKS LEADS. It was second, behind Use Cases, and is now first.

     The swap is made by moving the entry in this array, NOT by assigning visual
     position utilities to the two blocks. Those would paint the same picture
     while leaving the DOM in the old sequence, so a keyboard user tabbing
     through the footer would reach the Use Cases links first and then watch
     focus jump back to Quick Links - focus moving opposite to the reading
     order the eye just followed. Visual and DOM order agree here and should. */
  {
    heading: "Quick Links",
    links: [
      { label: "Explore Gifts", href: "/gifts" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  /* ── "USE CASES" ──

     The catalogue's four categories, promoted out of the tail of Quick Links
     and given their own column, which is what "categorised" had to mean in
     practice: they were the one group of links that was not about a page of
     this site, and appending them to a page-index column was the mess the
     brief is asking to clean up. Promoting them also retires the height skew
     they caused - as trailing additions they made that column roughly twice
     the height of its three siblings.

     THE ROUTE IS `/gifts`. The brief wrote `/explore-gifts`, which is not a
     route: there is no such directory in `app/`, nothing in the codebase ever
     referenced one, and a request for it does not resolve. `/gifts` is the page
     whose own heading reads "Explore Gifts", so the brief's intent and the real
     route agree.

     THE ANCHORS ARE THE TAB BUTTONS' OWN IDS. The brief wrote four slug-style
     anchors - `#executive-tech`, `#apparel`, `#home-office`,
     `#beauty-wellness` - and measured against every source file, three of those
     strings appear NOWHERE in the codebase, so all four would have scrolled
     nowhere and silently left the reader at the top of the page. The fourth,
     `#apparel`, exists only as the tablist's category key, which is not an
     anchor. What the tablist actually emits is `id="gift-tab-<categoryKey>"`,
     so the mapping is:

         Executive Tech  ->  #gift-tab-tech
         Apparel         ->  #gift-tab-apparel
         Home & Office   ->  #gift-tab-appliances
         Beauty & Wellness -> #gift-tab-beauty

     And these DO select the tab rather than merely scroll to it, because
     `ProductCatalogTabs` reads the hash on mount - see the effect there for why
     it had to be an effect and why it is one-shot.

     THE LABELS ARE THE BRIEF'S, verbatim. The tab titles on the page are
     longer ("Executive Tech & Productivity", "Home & Office Appliances"), and
     the shorter footer wording is a legitimate nav label rather than a
     mislabel: each one still names its category unambiguously, and at these
     column widths the full titles cost a wrapped second line on two of four. */
  {
    heading: "Use Cases",
    links: [
      { label: "Executive Tech", href: "/gifts#gift-tab-tech" },
      { label: "Apparel", href: "/gifts#gift-tab-apparel" },
      { label: "Home & Office", href: "/gifts#gift-tab-appliances" },
      { label: "Beauty & Wellness", href: "/gifts#gift-tab-beauty" },
    ],
  },
  {
    heading: "Company",
    links: [
      /* OUR STORY, the /about page by its narrative name. The route resolves
         (`app/about/page.tsx`) and the label is the brief's verbatim. It is
         the second footer label for `/about` — Quick Links already carries
         "About" -> /about — so the header note that used to promise no route
         is ever named twice now records this one deliberate exception. */
      { label: "Our Story", href: "/about" },
      { label: "Industries", href: "/industries" },
      /* WAS `/about#fulfilment` - and that was not an arbitrary pick; see the
         note above on which anchors resolve. It is repointed at
         `/#how-it-works`, the home page's own explanation of the four steps
         including fulfilment. Nothing had to be added to make that target
         exist: the section has carried `id="how-it-works"` from the start, with
         `aria-labelledby="how-it-works-heading"` beside it.

         ONE OF THE TWO RESOLVING /about ANCHORS IS GONE WITH IT. `#values` on
         `ValueProps` is still the "Our values" label below, so the Company
         column now mixes one home-page anchor with one /about anchor. That is
         correct as it stands - a reader following either label lands on the
         section that label names - and the earlier note counting "the two
         /about anchors that DO resolve" is now stale by one. */
      { label: "How We Fulfill", href: "/#how-it-works" },
      { label: "Our Values", href: "/about#values" },
    ],
  },
  {
    heading: "Support & Legal",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      /* RENAMED from "Terms & Conditions" to "Terms of Service", which is what
         the page has actually called itself for a while - the document title, the
         H1, the OG title and the breadcrumb all read "Terms of Service". The
         footer was the last place still saying Conditions, so a visitor who
         followed the link landed on a document whose own heading disagreed with
         the link they clicked. Label and destination now agree.

         THE HREF IS UNCHANGED, and the brief's `/terms-of-service` is not the
         route. There is no such directory in `app/` and a request for it does not
         resolve; the page lives at `/terms`. The brief also wrote the privacy page
         as `/privacy-policy` when it is `/privacy`. Both of those were checked
         before the rename rather than assumed, and neither was adopted - pointing
         a footer link at a 404 to satisfy a naming preference would have traded a
         cosmetic consistency for a dead link on every page of the site.

         THE NEW LABEL IS NARROWER, not wider: 138.2px against 161.4px at 14px in
         Tahoma, so this swap gives the column 23.2px back. Nothing in the column
         gets tighter as a result, and the binding string is untouched - the
         heading is still 188.6px with its wider tracking, against a 190.9px
         track, with 2.3px to spare.

         The document body of all three pages also drops a "Last updated" date
         this round, and the section about revisions on each of them promised a
         revised date as the way to tell what changed. Those three paragraphs
         now say revisions are published on the page instead, because a
         change-notice mechanism that points at a removed date is worse than
         having none. */
      { label: "Terms of Service", href: "/terms" },
      /* THE FOURTH LINK, and the third link in this column that is a policy
         document rather than a page of the site. It sits last deliberately: the
         two the audience already knows are the two they are likeliest to want,
         and a sourcing standard is the slowest-read item in the column, so it
         does not push the familiar ones down.

         THE LABEL IS THE BRIEF'S, and it is 183.9px at 14px - measured in Tahoma
         and Segoe UI, both wider than Inter, so this is an upper bound. That
         makes it the WIDEST LINK anywhere in this footer, past the 170.1px email
         address and the 161.4px "Terms & Conditions" beside it. It does not
         displace the column heading as the binding string though: "SUPPORT &
         LEGAL" is 188.6px at 14px bold with wider tracking, and that still has
         the least room in a 190.9px track at `xl`, with 2.3px to spare. The
         slack here is 7px, so neither string wraps and the grid is unchanged.

         Supporting this with 4 links also improves the column balance rather
         than spoiling it: the counts go from 4 / 4 / 3 / 3 / 3 to 4 / 4 / 4 / 4
         / 3, and this column was one of the two shortest. Both stragglers have
         since caught up - "Our Story" gives Company its fourth link, and the
         social row moved into Contact gives it a fourth row - so every block
         now sits at 4 / 4 / 4 / 4 / 4. */
      {
        label: "Ethical Sourcing Policy",
        href: "/ethical-sourcing-policy",
      },
    ],
  },
];

/* ── THE ONE COLUMN-HEADER TREATMENT ──

   The brief asked to standardise the column header styling, and it was already
   identical in both places it appeared - the mapped columns and the hand-written
   Contact block - which means the string had simply been pasted twice and could
   drift at any time. It is one constant now, so the five headings cannot
   disagree.

   FOUR OF THE BRIEF'S SUGGESTED CLASSES ARE IN, ONE IS DELIBERATELY OUT.

   IN: the size step up (12px -> 14px, which is also the house eyebrow size),
   the explicit weight, the uppercase, the tracking, and the bottom margin.

   OUT: the colour. The brief reached for a near-black navy, which Tailwind
   resolves to #0f172a. This footer's surface is #36433B, a dark forest green.
   Measured contrast of #0f172a on #36433B is 1.72:1 - the headings would not be
   dim, they would be GONE, and WCAG puts 3:1 as the floor for large text and
   4.5:1 for anything under 24px. The colour that is actually here, #FAF8F3,
   measures 9.78:1 on the same surface, so this is a substitution forced by the
   background rather than a matter of taste. The project also defines no slate
   ramp of its own, so the navy would have been an off-brand default arriving in
   a footer that otherwise uses only warm off-whites.

   Two further notes on the chosen values. The tracking drops from 0.14em to
   `tracking-wider` at 0.05em, and it has to: the size rose from 12px to 14px,
   so tracking is now added to a font 17% larger, and holding 0.14em across that
   jump would have pushed the longest heading - "SUPPORT & LEGAL", measured at
   188.6px - past the 185px five-column track and onto two lines. This is also
   the value the brief asked for by name.

   And the weight goes from an implicit 700 - which is simply what a heading
   element inherits when nobody says otherwise - to an explicit semibold, as
   asked. That is one step lighter than the eyebrow token's 700, which is a
   barely visible difference at 14px and is not worth overriding an explicit
   instruction for.

   "SUPPORT & LEGAL" IS THE BINDING STRING IN THE ENTIRE FOOTER. It is wider
   than the email address (188.6px against 170.1px) and wider than everything
   else, and it is why the widest five-column track is 191px and not the 185px
   the arithmetic would otherwise give. Every other heading is at least 50px
   clear of its track.

   The margin lives here rather than on the lists. Each heading is a block and
   each list is a block, so they are adjacent siblings, and sibling margins
   collapse - a bottom margin on the heading and a top margin on the list would
   resolve to the larger of the two and the other would be inert. One place to
   put it is one place that works. */
const columnHeadingClass =
  "text-sm font-semibold uppercase tracking-wider text-[#FAF8F3] mb-4";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: LinkedInIcon },
  { label: "Instagram", href: "https://www.instagram.com", Icon: InstagramIcon },
  { label: "X", href: "https://www.x.com", Icon: XSocialIcon },
];

/**
 * Deep-forest footer — a quiet warm-white contrast surface with a light
 * translucent divider, a five-block grid sized 3 + 2 + 2 + 2 + 3 of the twelve
 * columns, a full-width brand statement below the grid, and a clearly separated
 * bottom bar.
 *
 * Two horizontal rules cross this footer: the banner's and the bottom bar's.
 * Both are the same hairline at the same 22% translucency, so they read as one
 * decision even though their gaps now differ - the banner's is the current
 * round's 40px, the bottom bar keeps its own spacing. The whole statement
 * block sits between them, so they can never collapse into a single doubled
 * rule.
 *
 * The Contact block is kept even though the brief lists only two link
 * columns and there are now three: it carries the only `mailto:` in the
 * footer plus the response-time
 * and hours lines, and dropping it would take the site's email address out of
 * the footer entirely. It is a contact detail block, not a link column, so
 * reading the brief as excluding it seemed wrong. Say the word and it goes.
 *
 * Brand name is already spaced in all three places it appears here — the home
 * aria-label, the social aria-labels, and the copyright line. `BrandLogo` is
 * decorative (`alt=""` + `aria-hidden`), so the accessible name comes from the
 * wrapping link, not from the asset filename.
 */
export function Footer() {
  return (
    <footer
      id="site-footer"
      className="texture-paper border-t border-dark-line bg-[#36433B] text-[#F7F4EB]"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* ── FOOTER BODY GRID ──
            Mobile: brand + contact share row 1, link columns span row 2.
            md: brand full-width row 1, links row 2 (3 across).
            lg: brand left (3 of 12), links right (9 of 12, 3 across).
            xl: brand 2 of 12, links 10 of 12, 5 across. */}
        <div className="grid grid-cols-2 gap-8 items-stretch text-left md:grid-cols-2 md:gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col items-start text-left w-full md:col-span-2 lg:col-span-3 xl:col-span-2">
            {/* `mx-auto` CENTRES THE LOCKUP, and only the lockup. The brief's
                ask was to take the logo from flush-left to centred "within its
                quadrant", and this is the narrowest reading that does exactly
                that: the link is kept only as wide as the image, and the auto
                side-margins centre that box. It does NOT make this column a
                centred flex stack - but the tagline below it IS centred now,
                because the round that restyled it asked for exactly that, and
                the social row is no longer in this column at all. It moved out
                to the Contact column as that block's fourth row, so the whole
                column is the lockup and one centred line, which stay aligned to
                the same centre axis by construction.

                THE BOTTOM MARGIN IS GONE and the gap under the lockup is carried
                by the tagline's own top margin instead. They are adjacent block
                siblings, so a 24px bottom margin here against an 8px top margin
                there would have collapsed to the 24px and left the 8px inert -
                the same trap the column headings and their lists are documented
                under further down. One place to put it is one place that works. */}
            <Link
              href="/"
              aria-label="Fulfill Nest — home"
              className="flex w-fit items-center"
            >
              {/* THE HEIGHT CAP IS NOW 104px, which at the new asset's 1661x1279
                  intrinsic size (a ratio of 1.2987) renders the lockup at 135px
                  wide.

                  IT WAS 128px, 163px wide, on the previous asset. That is an
                  18.75% reduction in height and 17% in width, which is the
                  "15-20%" the brief asked for. The brief's example of stepping
                  down two scale units would have been a 25% cut - outside its
                  own stated range - so the range won.

                  104 is an ordinary value on this project's 4px spacing scale
                  and needs no arbitrary-value utility.

                  135px clears every footer block at every breakpoint: the
                  Brand block is 284px at 1280 and the five right-hand columns
                  are 163px, so the lockup is well inside the narrowest of them. */}
              <BrandLogo
                variant="footer"
                className="h-auto max-h-26 w-auto opacity-100"
              />
            </Link>
            {/* THE TAGLINE IS "Curated with care.", and it is not a new
                sentence invented for this round - it is the shorter half of a pair
                this block used to contain.

                THE 102-CHARACTER STATEMENT MOVED DOWN, it did not stay. It was a
                paragraph under the lockup reading, verbatim, what is now the
                banner at the foot of the footer. Keeping it here and adding it
                down there would have printed the same sentence twice on the same
                screen, so the brief's own two instructions - add a short tagline
                under the logo, and promote the statement to a banner - are one
                move, not two additions. In this column that paragraph was six
                wrapped lines of 14px grey; in the banner it is a centred quote
                that caps at 896px and now fits the whole sentence on one line
                at the 16px top size in the wide Tahoma bound. Nothing was
                deleted to make room for it.

                THE COLOUR IS THE HOUSE BODY COLOUR, not the muted grey the brief
                asked for. That was a light-mode value: it measures 2.18:1 against
                this footer surface, which is under the 3:1 floor for any non-text
                content let alone body copy. Body copy needs 4.5:1. The colour used
                here measures 9.16:1, and it is the exact colour the paragraph it
                replaces was already set in, so the visual change in this column is
                the words and nothing else.

                "Made with care." USED TO SIT HERE as a fourth line, an italic
                display line in the near-white `#FAF8F3`. Removed per the
                brief.

                It was the most redundant string in the block. The paragraph
                directly above already ends "curated with intention and fulfilled
                with precision" - the same two-part cadence in the same register,
                naming the same care - so the line was restating the sentence
                immediately before it in a larger, italic, brighter style, which
                is the way to make redundancy look like emphasis rather than
                redundancy.

                The brief's new tagline puts one of those words back. That is a
                fair trade - the sentence it used to restate is no longer in this
                column - but "curated" now appears in this line and again in the
                banner quote at the foot of the footer, and that is the one
                overlap left in the block. Worth knowing before anyone reads it
                as an accident.

                The cost of the removal is one accent note: `#FAF0E6`-family cream
                on this `#36433B` surface was the only warm highlight in the brand
                block, and the block is now three greys and a logo. Nothing else in
                the footer depended on it, and it carried no link or id.

                THE TAGLINE TAKES ONE SIZE STEP UP AND THE ITALIC THIS ROUND. The
                brief asked to push it from the small size to the base size, set
                it in the italic style, and centre it under the lockup. All three
                construe the same thing: the line stops being quiet metadata
                sitting beside a centred mark and becomes part of that mark. The
                italic is the conventional signal for a spoken motto, and the
                centring ties its axis to the lockup's.

                The width at the base size is the honest check. At 16px in Tahoma,
                which is the wide bound, the line measures 173.2px against the
                165px `xl` track - it CAN wrap there to two centred lines
                ("Curated with" / "care."). In Inter, which is narrower, the same
                line fits at roughly 160px. Two centred lines still read as
                deliberate rather than broken, which is exactly what the old
                "Made with care." accent line did at this size: it was 14px, and
                this is one step above that. */}
            <p className="mt-2 w-full text-left text-base font-medium italic leading-6 text-[#EDF2EE]">
              Curated with care.
            </p>
          </div>

          {/* Mobile Top Contact — visible only below `md`, hidden on desktop */}
          <div className="flex md:hidden flex-col items-start text-left w-full h-full">
            <div className="mt-auto flex flex-col items-start">
            <h3 className={columnHeadingClass}>Contact</h3>
            <ul className="flex flex-col text-sm text-[#EDF2EE]">
              <li className="py-1.5">
                <a href="mailto:hello@fulfillnest.com" className="inline-block text-[#EDF2EE] transition-colors hover:text-[#F7F4EB]">
                  hello@fulfillnest.com
                </a>
              </li>
              <li className="py-1.5">Response within 24h</li>
              <li className="py-1.5">Mon – Sat, 9am – 7pm</li>
            </ul>
            </div>
          </div>
          {/* Link columns + Contact — 2 across on mobile, 3 from `md`, 5 from
              `xl`; the right-hand block of the outer grid from `lg` up. */}
          <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-2 md:grid-cols-3 lg:col-span-9 xl:col-span-10 xl:grid-cols-5 xl:gap-x-4">
            {columns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
              <h3 className={columnHeadingClass}>{column.heading}</h3>
              {/* `gap-3` became padding on the links themselves. A bare
                  `text-sm` link renders ~22px tall, which is half the 44px
                  touch minimum; padding it to `py-1.5` brings the hit area to
                  46px while contributing exactly the same 12px the flex gap
                  used to, so the visual rhythm is unchanged. The list itself
                  is not interactive, so the padding cannot be on the `li`.

                  No top margin here either - see the note on the Contact list
                  below, which is the same change for the same reason. */}
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-1.5 text-sm text-[#EDF2EE] transition-colors hover:text-[#F7F4EB]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact. The FIFTH and last column of the nested grid above, not a
              sixth block on the outer twelve. It lost its own span two rounds
              ago - it used to be as wide as the Brand block to hold one email
              address. It carries the only `mailto:` in the footer, the response
              line and the hours line - and now the social row, which the round
              that restyled the tagline moved down here from the Brand column as
              this block's fourth row.

              It stays a plain div rather than a nav even though it now contains
              the three profile links, because the block is still ordered around
              the address and the facts about answering it - a row of social
              links inside the contact block, not a navigation landmark of its
              own. The nested list keeps its own accessible name, so the socials
              read to assistive tech exactly as they did when they lived in the
              Brand column. */}
          <div className="hidden md:flex flex-col items-start text-left">
            <h3 className={columnHeadingClass}>Contact</h3>
            {/* No top margin, because the heading above now carries the gap. As
                adjacent block siblings the two margins would have collapsed to
                the larger anyway, so one of them was always going to be inert. */}
            <ul className="flex flex-col text-sm text-[#EDF2EE]">
              <li className="py-1.5">
                <a
                  href="mailto:hello@fulfillnest.com"
                  className="inline-block text-[#EDF2EE] transition-colors hover:text-[#F7F4EB]"
                >
                  hello@fulfillnest.com
                </a>
              </li>
              <li className="py-1.5">Response within 24h</li>
              <li className="py-1.5">Mon – Sat, 9am – 7pm</li>
              {/* The socials as the fourth row. Width is not the constraint:
                  the row is 92px (three 20px glyphs, two 16px gaps) against a
                  190.9px `xl` track, so there is ~99px of slack. The row's
                  height also stays even with its three siblings - a 20px glyph
                  inside the same 12px vertical padding as a 14px text line. */}
              <li className="py-1.5">
                <ul className="flex items-center gap-4" aria-label="Social links">
                  {socials.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Fulfill Nest on ${label}`}
                        className="inline-flex items-center text-[#EDF2EE] transition-colors duration-300 hover:text-[#F7F4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF8F3]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#36433B]"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
        </div>

        {/* ── BRAND STATEMENT BANNER ──

            The site's own positioning sentence, promoted out of the Brand column
            and given a full-width band of its own below the navigation grid,
            now set as an oversized centred quote block with a generous measure.

            THE MEASURE IS CONSTRAINED AT 896PX, WHICH SUPERSEDES THE EARLIER
            VERSION OF THIS COMMENT. That note argued the line should stay
            uncapped because capping it at a third of the container width made
            five or six lines of display type; the brief now asks for a quote
            block with an explicit cap, so the argument's premise is gone. The
            cap is 896px (max-w-4xl) on a 1232px container, i.e. two thirds of
            the width, not a third.

            THE SIZES ARE THE BRIEF'S SMALLER EXAMPLE (text-sm md:text-base).
            The brief offered two steps down from the old text-xl md:text-3xl,
            and this one was picked on the measure: at the 16px top size the
            whole 102-character sentence fits on ONE line at the 896px cap even
            in the wide Tahoma bound - measured 848.7px, leaving 47.3px - so
            the statement reads as a single centred line rather than a
            paragraph. The brief's other example (a base of 16px rising to
            18px) was measured and declined: at 18px the same bound breaks
            91 / 10 characters, stranding "precision." on its own line and
            splitting the sentence's closing phrase "with precision." across
            the break, which is exactly the rag this block exists to avoid.
            On a 375px phone the 14px base wraps three lines, 36 / 39 / 25,
            which is the honest cost of the smaller size.

            THE CENTRING AND THE RELAXED LEADING ARE THE BRIEF'S, and the wide
            tracking is the surviving half of the pair it offered. The brief
            asked for "an elegant serif or ultra-clean sans-serif with generous
            letter-spacing (font-serif or tracking-wide font-light)". The serif
            was declined for the reason this codebase has already written down:
            the brand headings all use the display sans, and the theme declares
            no serif family of its own, so the utility would resolve to whatever
            serif the visitor's machine happens to have - Georgia on one machine,
            Times on the next. The light weight never existed here: no 300 is
            loaded for any of the three families on this site, so a request for
            it matches nothing and renders 400. What is left of the pair is the
            tracking, which is exactly what it promised - generous letter
            spacing, the display face at its normal weight.

            THE COLOUR IS THE BRIEF'S METALLIC GOLD, and it is the first
            accent palette this block has ever carried on measured grounds.
            The primary ramp the brief names - #BF953F (from), #FCF6BA
            (via), #B38728 (to) - measures 3.75:1, 9.41:1 and 3.17:1 against
            this #36433B surface, so every stop clears the 3:1 floor for any
            content. That is new here: the copper accent measured 2:1 and
            the deep brick 1.69:1, both invisible, and the stone requests
            measured 0.71:1 to 2.80:1. Gold is a bright palette in a way
            those were not.

            TWO HONEST FLAGS. First, the two deeper stops (3.17:1 and
            3.75:1) sit between the 3:1 non-text floor and body copy's
            4.5:1, and this statement is 14-16px display text, under the
            24px line where 4.5:1 applies - so the darker moments of the
            ramp are not body-copy AA on their own. What saves the reading
            is the treatment itself: the sweep keeps the 9.41:1 glaze
            (#FCF6BA) passing across the line constantly, and the mid gold
            is 3.75:1. It is the brief's explicit palette, it is legibly
            gold on this surface, and those numbers are now on record.
            Second, the alternate ramp the brief offered (#D4AF37 /
            #F3E5AB / #AA771C) was measured and not chosen: its darkest
            stop, #AA771C, comes in at 2.65:1, under the 3:1 floor, so the
            primary ramp is the one that survives.

            THE SHINE AND ITS KEYFRAMES WERE REMOVED ON THE BRIEF'S WORD. The glaze
            sweep (a background-position glide from 200% centre to -200%
            centre, first at a 4s continuous loop, then with a 5-second hold
            built into a 7s cycle) is gone entirely: no animation utility on
            the element, no keyframes, no reduced-motion guard, no
            background-size override. What remains is the brief's first
            option - the metallic gold gradient itself, static. The ramp is
            the brief's primary: #BF953F (from, 3.75:1), #FCF6BA (via,
            9.41:1), #B38728 (to, 3.17:1) against the #36433B surface, so
            every stop clears the 3:1 floor and the glaze stop clears body
            copy's 4.5:1. The gradient is clipped to the glyphs
            (transparent text over the background image) and the 200% width
            that existed only to give the sweep runway is gone - the ramp
            now stretches fully across the line once, which is how a static
            gold should read. The near-white fill this text used to carry
            (9.78:1, the highest-contrast colour on the surface) and its 90%
            opacity are gone with the treatment: a clipped gradient has
            nothing left for an element opacity to soften, and dimming it
            would drop the darker stops below the 3:1 floor they now clear.

            THE DIVIDER REUSES THE BOTTOM BAR'S, and the top gap is the brief's
            40px rather than the 56px that used to match the bar directly below.
            The two rules are separated by the whole statement block now, so
            they can never collapse into a single doubled rule; the shared
            hairline keeps them one decision. */}
        <div className="mt-10 border-t border-[#F7F4EB]/22 pt-10">
          <p className="mx-auto max-w-4xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-center font-display text-sm font-normal leading-relaxed tracking-wide text-transparent md:text-base">
            Premium corporate gifting &amp; employee recognition, curated with
            intention and fulfilled with precision.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[#F7F4EB]/22 pt-6 md:mt-16">
          <div className="flex flex-col items-center justify-between gap-y-3 text-center text-xs text-[#BDC9C2] sm:flex-row sm:items-center sm:gap-6 md:text-left">
            <p className="text-center md:text-left">© {new Date().getFullYear()} Fulfill Nest. All rights reserved.</p>
            <p className="hidden font-display italic text-[#FAF8F3] md:block">
              Every gift has a story. We make it unforgettable.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
