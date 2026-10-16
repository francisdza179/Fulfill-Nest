/* ------------------------------------------------------------------ */
/*  Site content data (all copy for the PAGES phase)                   */
/* ------------------------------------------------------------------ */

/* RECOVERY NOTICE — read this before trusting anything in this file.

   This file was accidentally truncated to 132 lines during a scripted edit on
   2026-09-28 and rebuilt from the Turbopack SSR chunk
   `.next/dev/server/chunks/ssr/_0dr39s9._.js` (compiled 2026-09-27 20:39).

   Consequences, in order of importance:

   1. ALL DATA IS INTACT. All 29 runtime exports were recovered with full
      string fidelity (verified against the chunk's own export list: zero
      missing, zero extra), including `₹`, en/em dashes, curly quotes and the
      `·` middot.
   2. ALL COMMENTS ARE GONE. The compiler strips them. This file previously
      carried several hundred lines of architectural notes — the reason the
      figures in `industries` are what they are, why `ChildHero` takes the props
      it takes, which datasets feed which route, and a dozen "this looks
      duplicated but is deliberate" warnings. That knowledge is not recoverable
      and is not reproduced below.
   3. ALL INTERFACES WERE REBUILT BY INFERENCE from the recovered object
      shapes plus the `import type { … } from "@/lib/data"` sites in the app.
      They are accurate for the data as it stands, but they are not
      byte-identical to the originals. Verify before extending them.
   4. The source predates this file's most recent edits, which have been
      re-applied on top: the `serviceCaseStudy` image swap and the four
      FAQ additions (Enterprise SLAs, Kitting/Batch Tracking, 3PL volumetric
      weight, omnichannel fulfilment).

   The comments in `app/globals.css`, `sections/` and the hero components are
   the best remaining record of why the copy is what it is. Where a figure here
   looks arbitrary, check `industries` and the FAQ sets below — their inline
   notes are the ones that were re-authored after the loss. */

export type ProductCategory = "employee" | "festive" | "milestone" | "channel";

export type ProductBudget = "under-100" | "100-250" | "250-plus";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  budget: ProductBudget;
  image: string;
  imagePosition?: string;
  alt: string;
  tag?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  metric: string;
}

export interface ValueProp {
  /**
   * Which concept the item stands for.
   *
   * STILL NOT RENDERED. This field has never been drawn by any layout: the
   * editorial row shows a number, /about's `ValueGrid` shows a number and
   * explicitly documents "No icon circles", and a card layout that briefly
   * mapped these tokens to components was reverted. The union is kept accurate
   * anyway - six distinct concepts, six distinct tokens - so that if a glyph is
   * ever wanted, the mapping is already decided rather than invented per item.
   */
  icon: "shield" | "sparkles" | "heart" | "globe" | "package" | "radar";
  title: string;
  body: string;
  /**
   * Optional because `ValueProp` types the `items` of BOTH `ValueProps`
   * layouts: the home page passes `values` (no `detail`, rendered as the
   * numbered editorial row, which never reads it) while /about passes
   * `beliefs` (with `detail`, rendered through `ValueGrid`, which does).
   * Required would fail the home page; forbidden would fail /about.
   */
  detail?: string;
  image?: string;
}

/** One item of the About page's "Why Fulfill Nest" differentiation split — a
 *  legacy vendor's position, and Fulfill Nest's answer to the same question.
 *
 *  "Row" means "one numbered point in the two-column grid", not "one line of a
 *  comparison table" and not "one card in a horizontal track". The name has now
 *  outlived three layouts and is kept deliberately: renaming it would churn two
 *  files to make a label agree with a shape.
 *
 *  A purpose-built type rather than a `ValueProp`, and rather than anything left
 *  over from this section's previous layouts. `ValueProp` cannot carry it: it
 *  has `icon` (a union of six concepts that none of these rows match, and which
 *  its own docs record as never rendered) and no notion of a competing
 *  alternative. An early draft used a `title`/`body` pair, which described a
 *  *point*; what these rows carry is two answers to one implicit question, and
 *  that is what the field names say.
 *
 *  ── `legacy` IS CURRENTLY NOT RENDERED. READ THIS BEFORE EDITING. ───────────
 *  The whole section is unrendered: `WhyFulfillNest` was removed from the About
 *  page on request, so nothing in the codebase reads this type at all. See the
 *  block note on `differenceRows` further down this file for the full history.
 *
 *  It was NOT deleted, and it is still REQUIRED rather than optional, for two
 *  reasons. Six approved strings of comparative copy are worth more than the
 *  line of markup that showed them, and the section argued a weaker case
 *  without them — "not a transaction, but a cultural touchpoint" sets up a
 *  contrast the layouts never quite delivered. Keeping the data is what makes
 *  putting it back a design decision rather than a copy recovery.
 *
 *  So this is a live trap, not an oversight: a required type with no reader.
 *
 *  `detail` is REQUIRED for the same non-optional reason: all six rows have one,
 *  and a row whose detail silently vanished would leave a visibly lopsided point
 *  rather than an error. If a future row genuinely has no supporting sentence,
 *  the fix is a deliberate `""` here and a decision about the layout, not a `?`.
 */
export interface DifferenceRow {
  /** What a traditional vendor does. NOT RENDERED today — see the note above. */
  legacy: string;
  /** What Fulfill Nest does instead. The point's headline. */
  ours: string;
  /** Supporting sentence under the headline. */
  detail: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  /**
   * Knowledge-hub category id, matching an entry in `faqCategories`.
   *
   * OPTIONAL on purpose. Only the /faq knowledge hub is categorised and
   * filterable; the other four FAQ sets (`homeFaqs`, `serviceFaqs`,
   * `industryFaqs`, `pricingFaqs`) render through the same `FaqAccordion` but
   * are deliberately single-purpose per route and have nothing to filter
   * against. Making it required would force a category onto 20-odd questions
   * that do not need one.
   */
  category?: string;
}

export interface FaqCategory {
  /** Matches `FaqItem.category`. Slug, lowercase, hyphenated. */
  id: string;
  label: string;
  /**
   * One line of orientation, shown under the category pill row and as the
   * heading when a reader filters to a single category. Deliberately a
   * description of scope rather than a sales line — a category that has to
   * advertise itself is a category nobody could find.
   */
  blurb: string;
}

export interface MembershipTier {
  name: string;
  /** Two or three letters shown as a watermark pill in the card's top right. */
  watermark: string;
  /** Figures for the card's price row. */
  price: string;
  /** Cadence or terms line sitting under the price. */
  billingNote: string;
  /** One line naming who the tier is for, rendered directly under the price. */
  bestFor: string;
  features: string[];
  cta: string;
  ctaVariant: "secondary" | "primary" | "outline";
  /** Rendered as the pill straddling the card's top edge. Uppercased in CSS. */
  badge?: string;
  highlighted?: boolean;
}

export interface ServiceTier {
  name: string;
  tagline: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface ServiceCaseMetric {
  value: string;
  label: string;
}

export interface ServiceCaseStudy {
  image: string;
  imageAlt: string;
  metrics: ServiceCaseMetric[];
  quote: string;
  author: string;
}

export interface CompliancePillar {
  number: string;
  title: string;
  /**
   * Trailing phrase of `title`, rendered in the brand red on the dark panel.
   *
   * INVARIANT: `titleAccent` must be a suffix of `title`. The component
   * checks this with `endsWith` before splitting and falls back to the whole
   * title in plain text, so breaking it degrades to an unstyled heading rather
   * than to a garbled one.
   *
   * Storing the phrase beats parsing the title for "the last two words": only
   * pillar 01 contains the words "Physical Security", so a word-count rule
   * would highlight nothing on the other three.
   */
  titleAccent: string;
  /** One line, shown in the pillar's own row in the left menu. */
  summary: string;
  /** The panel's opening paragraph on the right. */
  detail: string;
  /**
   * Exactly three control statements, rendered in the panel as a checked
   * list. Three is structural: the panel's spec list is a fixed three-row
   * block, so a fourth would unbalance it against the CTA beneath.
   *
   * Every entry states a control the business actually operates, and each one
   * is traceable to copy elsewhere in this file. Nothing here may be upgraded
   * into a certification the business does not hold - see the note on
   * the note above `compliancePillars`.
   */
  specs: string[];
  icon?: "receipt" | "sliders" | "lock" | "shield" | "radar";
  /**
   * Illustration shown in the right-hand column of this pillar's panel.
   *
   * Square 1200x1200 PNGs, one per pillar, sourced from
   * `Media & Others/Compliance & Security Assurance/` and copied into
   * `public/images/compliance/` with kebab-case `-v1` names. Kept as a
   * `public/` STRING path rather than a static import because every other
   * image in this file is a plain string and these are far too large to
   * benefit from bundling.
   */
  image: string;
  /**
   * Alt text. Describes what the picture shows, never the pillar's claim -
   * the alt is read instead of the image, so repeating "traceability" here
   * would read as a second, differently-worded copy of the heading immediately
   * below it.
   */
  imageAlt: string;
  /**
   * CTA label for THIS pillar, replacing the single shared "Request an audit
   * report" that sat under all four panels; the artefact-naming labels that
   * followed ("View SLA & Uptime Guarantees" and siblings) have since been
   * superseded by the current inquiry-driven set — "Discuss Facility
   * Security", "Request Security Overview", "Consult on Compliance",
   * "Inquire About Traceability".
   *
   * Why per-pillar: the four panels pitched the same action four times, which
   * made the button read as boilerplate rather than as the next step for
   * whatever the reader had just selected. Each label now asks for one
   * pillar-specific next step. Card 02 briefly carried "Request Security &
   * SOC2 Report" — an attestation claim the compliance warning above says
   * not to ship without a certificate in hand; "Request Security Overview"
   * sheds it.
   *
   * Held in data rather than derived in JSX: these are four unrelated
   * sentences, not one template, so there is nothing to interpolate.
   */
  ctaLabel: string;
}

export type IndustryCaseStudyIcon = "globe" | "heart" | "shield";

export interface IndustryCaseStudy {
  icon: IndustryCaseStudyIcon;
  sector: string;
  headline: string;
  body: string;
  metric: string;
  metricLabel: string;
  tags: string[];
}

export interface ServiceGuarantee {
  number: string;
  icon: string;
  title: string;
  body: string;
  /**
   * Intrinsic pixel size of the transparent-background PNG. Recorded rather
   * than left to `next/image` because `GuaranteesGrid`'s stage is a fixed 144px
   * of content height and centres on width — a 1.45:1 file then renders ~209px
   * wide and a 0.98:1 file ~141px. Supplying the real numbers keeps that
   * arithmetic honest; see the artwork note in that component.
   */
  imageWidth: number;
  imageHeight: number;
  image: string;
  /**
   * Describes the ARTWORK, never the adjacent title. The four cutouts are a
   * sealed package, a route map, a phone prompt and a credit loop; a
   * screen-reader user should get that rather than the heading repeated.
   */
  imageAlt: string;
}

export interface Industry {
  /** Stable key for React, and the slug for a future per-sector route. */
  id: string;
  /**
   * Card heading. Doubles as the tab/label string, the same way
   * `SolutionsTabs` uses one string for both its pill label and its panel h3.
   */
  name: string;
  /** Value-proposition summary, `text-body-lg text-taupe` in the card. */
  body: string;
  /**
   * Exactly three, rendered as the card's checked list.
   *
   * Field name and count are copied from `SolutionsTabs.points`, which is also
   * exactly three — the card is meant to be readable as a Tailored Solutions
   * panel, and a fourth bullet is where that stops being true.
   */
  points: string[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
  /**
   * Card button copy, per industry. Replaces the shared `Explore {name}`
   * label the cards used to derive from the heading (the CTA brief asked for
   * inquiry-driven, tailored buttons instead). Still routed to `/contact` by
   * `IndustriesList` — only the words changed.
   */
  cta: string;
  /**
   * The card footer, and the only metric slot on the card. The old `stat` /
   * `statLabel` numeral pair is gone, so there is nothing to fall back to and
   * nothing left for a second figure to contradict.
   *
   * Required rather than optional, on purpose. When five of six cards had one
   * and the sixth fell through to its numeral, the fallback branch in
   * `IndustriesList` was load-bearing. All six carry a `proof` now, that branch
   * is unreachable, and a required field makes TypeScript reject a seventh
   * card that forgets one instead of quietly rendering an empty footer.
   */
  proof: {
    /**
     * The metric line: `stat-numeral` at `text-base`, which is already bold,
     * in `text-charcoal`. No background, border or padding — it was briefly a
     * tinted pill and has since been stripped back to plain typography.
     *
     * NOT wrapped in literal `[ ]`. There is no outer frame left to bracket,
     * and a bracket inside a bracket reads as a second, unstyled frame, so
     * the brackets would be the only decoration on the line.
     *
     * `stat-numeral` is named for numerals and NOT ONE of the six current
     * values contains a digit. It is still the right utility: it is the
     * house bold display treatment (Space Grotesk, 700, tabular figures,
     * -0.02em), and that -0.02em is what lets a 38-character phrase set as
     * cleanly as "99.4%" did. The name describes where the class came from,
     * not what it is for. If these ever carry figures again, nothing changes.
     */
    tag: string;
    /** One line of supporting copy under the metric line. */
    detail: string;
  };
}


export const CURRENCY = "₹";
export const formatPrice = (amount: number): string => `${CURRENCY}${amount.toLocaleString("en-IN")}`;
export const CATEGORY_LABELS = {
    employee: "Employee Kits",
    festive: "Festive Boxes",
    milestone: "Milestone Gifts",
    channel: "Channel Incentives"
};
export const BUDGET_LABELS = {
    "under-100": `Under ${CURRENCY}2,500`,
    "100-250": `${CURRENCY}2,500 – ${CURRENCY}7,500`,
    "250-plus": `${CURRENCY}7,500+`
};
export const products: Product[] = [
    {
        id: "welcome-home-kit",
        name: "The Welcome Home Kit",
        tagline: "New-hire essentials, curated with care — the first gift, done right.",
        category: "employee",
        price: 2200,
        budget: "under-100",
        image: "/images/catalog/welcome-home-kit-v2.jpg",
        imagePosition: "41% 50%",
        alt: "The Welcome Home Kit— corporate welcome kit box with branded sipper and notebook",
        tag: "Best-seller"
    },
    {
        id: "everyday-appreciation-box",
        name: "Everyday Appreciation Box",
        tagline: "A quiet, meaningful thank-you for the people who keep things moving.",
        category: "employee",
        price: 3400,
        budget: "100-250",
        image: "/images/catalog/everyday-appreciation-box-v2.jpg",
        imagePosition: "46% 50%",
        alt: "Everyday Appreciation Box— corporate desk essentials gift set"
    },
    {
        id: "festive-hamper",
        name: "The Festive Hamper",
        tagline: "Celebration in a box — sweets, keepsakes and thoughtful touches.",
        category: "festive",
        price: 2400,
        budget: "under-100",
        image: "/images/catalog/festive-hamper-v2.jpg",
        imagePosition: "49% 50%",
        alt: "The Festive Hamper— stacked Diwali gift hampers ready for dispatch",
        tag: "Festive"
    },
    {
        id: "diwali-celebration-box",
        name: "Diwali Celebration Box",
        tagline: "Warmth for the whole family — a festival hamper with meaning.",
        category: "festive",
        price: 3900,
        budget: "100-250",
        image: "/images/catalog/diwali-celebration-box-v2.jpg",
        imagePosition: "48% 50%",
        alt: "Diwali Celebration Box— corporate Diwali gift hamper box"
    },
    {
        id: "milestone-recognition-chest",
        name: "Milestone Recognition Chest",
        tagline: "For the moments that deserve more than a certificate.",
        category: "milestone",
        price: 5600,
        budget: "100-250",
        image: "/images/catalog/milestone-recognition-chest-v2.jpg",
        imagePosition: "47% 50%",
        alt: "Milestone Recognition Chest— premium milestone gift chest"
    },
    {
        id: "years-of-service-kit",
        name: "Years of Service Kit",
        tagline: "A decade of dedication, remembered beautifully.",
        category: "milestone",
        price: 4800,
        budget: "100-250",
        image: "/images/catalog/years-of-service-kit-v2.jpg",
        imagePosition: "49% 50%",
        alt: "Years of Service Kit— long service award gift box"
    },
    {
        id: "partner-incentive-set",
        name: "Partner Incentive Set",
        tagline: "Motivate your channel with a reward worth the effort.",
        category: "channel",
        price: 7900,
        budget: "250-plus",
        image: "/images/catalog/partner-incentive-set-v2.jpg",
        imagePosition: "41% 50%",
        alt: "Partner Incentive Set— channel partner reward hamper packaging",
        tag: "New"
    },
    {
        id: "top-performer-trophy-box",
        name: "Top Performer Trophy Box",
        tagline: "An unmistakable thank-you for the performance that led the year.",
        category: "channel",
        price: 3200,
        budget: "100-250",
        image: "/images/catalog/top-performer-trophy-box-v2.jpg",
        imagePosition: "50% 50%",
        alt: "Top Performer Trophy Box— award trophy gift box"
    }
];
export const testimonials: Testimonial[] = [
    {
        quote: "They turned our recognition programme from a checklist into something people remember. Delivery tracking sealed it.",
        name: "Ananya Krishnan",
        role: "Head of People",
        company: "Finlight",
        metric: "200+ gifts · zero delays"
    },
    {
        quote: "A reward is only as good as how it feels. Every box felt hand-picked, not bulk-ordered.",
        name: "Daniel Osei",
        role: "CXO",
        company: "Vantage Systems",
        metric: "18,000 employees reached"
    },
    {
        quote: "Our channel partners talk about the incentive boxes. Curation matters more than the gift.",
        name: "Meera Sundaram",
        role: "Channel Partner Manager",
        company: "Kestrel Telecom",
        metric: "3× partner engagement"
    },
    {
        quote: "From a 500-unit festive order to bespoke leadership hampers, every one landed beautifully. Flawless fulfilment.",
        name: "Robert Hale",
        role: "Procurement Lead",
        company: "Aptiva Retail",
        metric: "99% on-time, every batch"
    },
    {
        quote: "Our new-hire kits went from a PDF to unboxed welcomes in under a week. The tracking page saved our People team hours.",
        name: "Priya Nair",
        role: "Head of Talent",
        company: "Bloomworks",
        metric: "493 kits · one launch week"
    },
    {
        quote: "Channel partners used to treat incentives as an afterthought. Now they ask when the next drop lands.",
        name: "Arjun Mehta",
        role: "VP Sales",
        company: "Hexor Cloud",
        metric: "Partner NPS +38"
    },
    {
        quote: "Our night-shift teams feel seen. Deliveries to three sites before dawn — every hamper accounted for.",
        name: "Sofia Almeida",
        role: "Office Operations Lead",
        company: "Northwind Partners",
        metric: "3 sites · before 6 a.m."
    },
    {
        quote: "I sent 60 bespoke hampers to founders' homes, and every one landed with a personal note, on time.",
        name: "Kabir Sharma",
        role: "Founder",
        company: "Tidelock",
        metric: "60 homes · zero slips"
    },
    {
        quote: "The unboxing moment is the first thing new joiners mention. It set the tone before the laptop arrived.",
        name: "Elena Vasquez",
        role: "People Operations",
        company: "Brightpath",
        metric: "Onboarding NPS 4.8/5"
    },
    {
        quote: "Twelve festival drops across four sites, every batch tracked, every invoice reconciled. Procurement rarely says that out loud.",
        name: "Vikram Rao",
        role: "Procurement Director",
        company: "Sable Foods",
        metric: "12 drops · 100% on time"
    },
    {
        quote: "Quarterly recognition used to be an email. Now it's unboxed at town hall — and my calendar got lighter.",
        name: "Nandini Iyer",
        role: "CTO",
        company: "Loopbase",
        metric: "3 quarters · zero admin"
    },
    {
        quote: "Retention reviews pointed at our programme twice. The receipts are Fulfill Nest boxes, not bullet points.",
        name: "Tom Beckett",
        role: "HR Business Partner",
        company: "Cinder & Co",
        metric: "Retention up · surveys agree"
    }
];
export const stats = [
    {
        value: "200+",
        label: "Enterprise teams gifted"
    },
    {
        value: "99%",
        label: "On-time fulfilment rate"
    },
    {
        value: "4.9/5",
        label: "Average recipient rating"
    },
    {
        value: "48h",
        label: "Curated shortlist turnaround"
    }
];
export const values: ValueProp[] = [
    {
        icon: "shield",
        title: "Reliability",
        body: "Dependable doorstep delivery, real-time dispatch tracking, and guaranteed delivery timelines—trusted by people ops teams who can't afford surprises.",
        image: "/images/why-fulfill-nest/Reliability.png",
    },
    {
        icon: "sparkles",
        title: "Curation",
        body: "Every reward is edited by hand for the moment and the person — never a generic catalog dump.",
        image: "/images/why-fulfill-nest/Curation.png"
    },
    {
        icon: "heart",
        title: "Delight",
        body: "The unboxing matters. Warm, tactile, human - designed to make recipients feel genuinely seen.",
        image: "/images/why-fulfill-nest/Delight.png"
    },
    /* Three added at the client's request to take this from three items to six,
       set in columns as two rows of three. `values` is read by the home page
       and nothing else - /about draws `beliefs` - so growing this array cannot
       change any other route. Each new icon token is one of the three added to
       the `ValueProp` union above; they are data tags and are not drawn.

       "Duty Handling" rather than "duty" alone in the title, because the copy
       below is specifically about prepaid duties and taxes clearing customs;
       the shorter form reads as a general shipping promise. */
    {
        icon: "globe",
        title: "Global Delivery & Duty Handling",
        body: "Seamless international shipping with prepaid duties and taxes, ensuring smooth customs clearance for remote global teams.",
        image: "/images/why-fulfill-nest/Global Delivery & Duty Handling.png"
    },
    {
        icon: "package",
        title: "100% Custom Branded Packaging",
        body: "Elevate your employer brand with fully customized boxes, handwritten notes, and bespoke swag packaging.",
        image: "/images/why-fulfill-nest/100% Custom Branded Packaging.png"
    },
    {
        icon: "radar",
        title: "Real-Time Inventory & Support",
        body: "Track stock levels across global warehouses and rely on a dedicated account manager for custom sourcing.",
        image: "/images/why-fulfill-nest/Real‑Time Inventory & Support.png"
    }
];
export const beliefs: ValueProp[] = [
    {
        icon: "sparkles",
        title: "Nothing generic ever ships",
        body: "If a gift could be sent by anyone to anyone, it isn't ours to send. Every box is chosen for the person and the moment behind it.",
        detail: "We start from the moment, not the catalogue — the team that shipped late, the partner who hit the number, the colleague who carried the quarter. That context is why two thank-you boxes for two different people rarely look alike. If we can't say why a specific gift fits a specific person, it doesn't leave the studio."
    },
    {
        icon: "shield",
        title: "The last mile is the first impression",
        body: "A beautiful gift that arrives late, damaged or untracked isn't a gift — it's a risk. We treat fulfilment as part of the curation, never the courier's problem.",
        detail: "Curation that doesn't arrive is just a nice idea. So we obsess over the unglamorous half: protective packing, tracked dispatch, proof of receipt and a named owner on every order. When something slips, we tell you before you have to ask — trust is built in the exceptions, not the easy days."
    },
    {
        icon: "heart",
        title: "We design the unboxing, not the invoice",
        body: "Procurement gets clean paperwork; the recipient gets a moment. We hold both standards at once, because a reward should never feel like a transaction.",
        detail: "A reward has two audiences who want opposite things. Finance wants line items, reconciliation and no surprises; the recipient wants to feel seen, not processed. We design for both — branded, tactile packing on one side, clean and auditable paperwork on the other — so the moment stays human without the admin getting messy."
    }
];

/* ────────────────────────────────────────────────────────────────────────────
   THE "WHY FULFILL NEST" DIFFERENTIATION — WAS on the About page, below the
   story. NOW UNRENDERED. READ THIS BEFORE USING ANY OF IT.

   ── NOTHING IN THIS BLOCK HAS A READER. ─────────────────────────────────────
   The section that consumed these two exports was removed from the About page
   on request after five layouts failed to land. `differenceThesis`,
   `differenceRows` and the `DifferenceRow` type are all still exported, all
   still internally consistent, and all currently imported by nothing.

   `tsc --noEmit` reports this as clean and always will: an exported constant is
   not an error just because nobody imports it. Do not read a green build as
   evidence that this copy is live.

   They were NOT deleted. Two reasons. The copy is good and the section that was
   removed was a layout, not a text — six comparative rows and a lead paragraph
   do not become bad because five arrangements of them were not the right one.
   And there is no version control on this working tree, so a deletion here is
   unrecoverable. Restoring is one import and one line in `app/about/page.tsx`.

   THE LAYOUTS THAT WERE TRIED, in order, so this is not repeated blind: a
   six-card bento grid with a linen band; a five-row accordion with a sticky
   spotlight frame; a real comparison table with a struck legacy column; a
   horizontal drag/swipe story track with arrows and a progress bar; and a
   borderless two-column split with hairline-ruled points. What each round was
   actually correcting: enclosures, then a stale-image bug, then table weight,
   then cards, then boxes. If the sixth attempt keeps correcting "looks too much
   like the band above it", that is the pattern to break out of, not the next
   border or fill to remove.

   TWO EXPORTS, TWO JOBS. `differenceThesis` is the lead statement the section
   argued, and it is a plain string rather than a field on a row because there is
   exactly one of it and it is not an item in anything. It is also the sentence
   that earns the comparison: "not a transaction, but a cultural touchpoint" sets
   up "here is what the other kind of vendor does instead", which is what each
   point was meant to carry.

   `differenceRows` is that comparison. Each row is ONE implicit question
   answered twice, and `legacy` is what a traditional vendor answers while `ours`
   is what Fulfill Nest answers. Order is the argument: curation -> aesthetics ->
   the buyer -> execution -> brand -> scale.

   Six rows, and none of them is a special case. There is no sixth-row banner
   because "Small Enough to Care. Big Enough to Deliver." is row six, the same
   weight as the other five, which is what makes the set read as an even-handed
   comparison rather than a build-up to a punchline.

   THIS IS NOT A RESTATEMENT OF `beliefs`, which sits immediately below it on the
   same page and is also three-to-six items about how the company works. The
   distinction is deliberate and is the only reason both can stand: `beliefs` is
   first-person and internal ("Nothing generic ever ships", "We design the
   unboxing, not the invoice") and describes Fulfill Nest's own standards;
   `differenceRows` is second-person and comparative ("Where legacy providers
   operate like warehouses…", "More agile, responsive, and customizable than
   traditional players") and describes the choice a buyer is making. One is a
   credo, the other is a competitive argument. They are adjacent on purpose —
   belief then proof — but they are not the same list.

   ON THE IMAGES THIS SECTION USED TO RENDER. The accordion layout gave each row
   a spotlight image. All five were files that already shipped elsewhere, so
   dropping them orphaned nothing:

     /images/about/behind-the-scenes.jpg                    -> `TeamSpotlight`
     /images/catalog/festive-hamper-v2.jpg                  -> `products`
     /images/industries/technology-enterprise-swag.jpg       -> `industries`
     /images/compliance/audit-traceability.png           -> `compliancePillars`
     /images/catalog/top-performer-trophy-box-v2.jpg         -> `products`

   Kept here because the alt text written for them is still worth having, and
   because two of the five were DERIVED rather than reused for a reason that
   matters: the `imageAlt` sitting next to `audit-traceability-v2.jpg` in
   `compliancePillars` reads "Per-recipient and per-campaign budget caps applied
   at checkout", which is a budget-control description attached to the audit
   pillar. That is one of four known-stale compliance alts still awaiting a fix.
   Do not copy it anywhere. Two of the other four were verbatim from their own
   sections and would have been safe.
   ──────────────────────────────────────────────────────────────────────────── */

export const differenceThesis =
    "Because experience alone doesn’t guarantee excellence — intention does. Fulfill Nest is built on a modern understanding of corporate gifting: not a transaction, but a cultural touchpoint that shapes how employees feel.";

export const differenceRows: DifferenceRow[] = [
    {
        legacy: "Catalog Warehouse",
        ours: "Curation Studio",
        detail: "We don’t just deliver gifts — we deliver sentiment. Where legacy providers operate like warehouses, Fulfill Nest operates as a curation studio ensuring every gift feels intentional and aligned with your culture."
    },
    {
        legacy: "Outdated Bulk Items",
        ours: "Modern, Design-Forward Aesthetics",
        detail: "Contemporary packaging, editorial-grade presentation, and premium aesthetics that today’s workforce actually resonates with."
    },
    {
        legacy: "Rigid Enterprise Workflows",
        ours: "Built for Fast-Moving HR & Hybrid Teams",
        detail: "Designed for fast-moving startups, hybrid teams, and distributed workforces. More agile, responsive, and customizable than traditional players."
    },
    {
        legacy: "Mass Scale Dependency",
        ours: "Precision & Reliability",
        detail: "We rely on precision, consistency, and execution — ensuring every delivery, box, and detail arrives exactly as promised."
    },
    {
        legacy: "Generic Gifts",
        ours: "Brand Experience Touchpoints",
        detail: "Your gifts are an extension of your company’s identity. We make sure every touchpoint feels cohesive, premium, and memorable."
    },
    {
        legacy: "Corporate Bureaucracy",
        ours: "Boutique Care + Enterprise Delivery",
        detail: "The personal attention of a boutique partner with the execution capability of an enterprise vendor."
    }
];
export const culturePillars = [
    {
        title: "Client care",
        body: "The same person from your first call to the last proof of receipt — no ticket queues, no hand-offs."
    },
    {
        title: "Curation studio",
        body: "Gift editors taste, test and style every item before it earns a place in a box. The box is the brief."
    },
    {
        title: "Fulfilment & operations",
        body: "A named owner follows every order from packing to signed delivery — each dispatch checked by hand."
    }
];
export const whoWeArePillars = [
    {
        title: "Intentional Curation",
        body: "Hand-picked product sets from premium, eco-conscious, and design-led brands—never generic catalog dumps."
    },
    {
        title: "Complete Fulfillment & Storage",
        body: "In-house assembly, inventory tracking, and custom box packing prepped for on-demand dispatch.",
    },
    {
        title: "Seamless Corporate Compliance & Billing",
        body: "End-to-end GST support, automated invoicing, and enterprise-ready documentation that removes friction for finance and procurement teams.",
    },
    {
        title: "Premium Brand-Forward Presentation",
        body: "Custom-designed packaging, thoughtful personalization, and a high-impact unboxing experience crafted to make every reward feel meaningful."
    }
];
export const whoWeAreReach = [
    {
        value: "40,000+",
        label: "Orders Handled"
    },
    {
        value: "65+",
        label: "Countries Supported"
    },
    {
        value: "99.4%",
        label: "On-Time Delivery"
    }
];
export const showcaseTiles = [
    {
        name: "Backpack",
        src: "/images/showcase/item-1.png",
        alt: "Canvas backpack gift"
    },
    {
        name: "Bluetooth Speaker",
        src: "/images/showcase/item-2.png",
        alt: "Portable Bluetooth speaker gift"
    },
    {
        name: "Bottle Collection",
        src: "/images/showcase/item-3.png",
        alt: "Insulated bottle collection"
    },
    {
        name: "Carry-on Suitcase",
        src: "/images/showcase/item-4.png",
        alt: "Carry-on suitcase milestone gift",
        // The only frame whose subject (481px) is taller than the 380px window, so
        // `cover` crops it top and bottom. Sliding the window down keeps the base
        // and its contact shadow intact, which is the part that reads as "standing
        // on a surface" rather than floating.
        focalPoint: "bottom"
    },
    {
        name: "Headphones",
        src: "/images/showcase/item-5.png",
        alt: "Over-ear headphones gift"
    },
    {
        name: "Hoodie",
        src: "/images/showcase/item-6.png",
        alt: "Embroidered hoodie gift"
    },
    {
        name: "Leather Notebook",
        src: "/images/showcase/item-7.png",
        alt: "Leather-bound notebook gift"
    },
    {
        name: "Terrarium Jar",
        src: "/images/showcase/item-8.png",
        alt: "Glass terrarium jar gift"
    },
    {
        name: "Wall Clock",
        src: "/images/showcase/item-9.png",
        alt: "Studio-rendered wall clock gift"
    }
];
/* The four `HowItWorks` steps (`sections/HowItWorks.tsx` renders all four
   fields plus `specs`).

   TWO OF THE FOUR CTAs MOVED OFF THE DELETED CASE-STUDIES PAGE. `app/case-studies`
   no longer exists, so every `ctaHref` that pointed at it would have been a 404 -
   a dead link in the middle of the site's primary explanation of how it works.

     03  "Track a Delivery"        ->  "Plan Your Distribution"  ->  /contact
     04  "See It In Action"        ->  unchanged label           ->  /contact

   Step 03's old label claimed a capability the route never had: /case-studies
   published no tracking tool, so the button promised a tracker and delivered a
   grid of client stories. "Plan Your Distribution" is the label this entry now
   carries, and it is the first of the four that names an action the reader can
   actually take on the destination page - the card's body copy is about packing,
   personalisation, delivery and proof of receipt, which is a distribution plan
   to agree rather than a shipment to watch.

   THE TARGET IS `/contact`, NOT A `#book-consultation` ANCHOR - there is no
   element with that id anywhere in the project, so an anchor href would have
   been a link that landed the reader exactly where they already were with no
   visible result. Worth noting that this leaves steps 01, 03 and 04 all pointing
   at the same route. That is the brief's instruction, and the label on each is
   what distinguishes them to the reader, but it is worth being aware of: three
   of four cards now offer the same next step, and `/services` is the route that
   actually describes fulfilment in depth. */
export const steps = [
    {
        number: "01",
        title: "Book a consultation",
        titleAccent: "consultation",
        summary:
            "Thirty minutes on your people, your moments and your budget.",
        body: "A 30-minute call about your people, your audience and the moments you want to celebrate. We map your audience, milestones and headcount together, then agree the budget bands and timeline before anything is ordered.",
        image: "/images/how-it-works/book-a-consultation-v1.jpg",
        imageAlt: "A Fulfill Nest consultant on a call, planning a gifting programme",
        imageFocus: "right",
        ctaLabel: "Book your consultation",
        ctaHref: "/contact",
        specs: [
            "A 30-minute discovery call, with no obligation attached",
            "Audience, milestones and headcount mapped out together",
            "Budget bands and timelines agreed before anything is ordered"
        ]
    },
    {
        number: "02",
        title: "We curate a shortlist",
        titleAccent: "shortlist",
        summary:
            "Hand-picked concepts, real mockups and clear pricing.",
        body: "Hand-edited gift concepts, custom branding mockups, and transparent pricing tailored around your budget—within 48 hours. Every shortlisted gift arrives with a real mockup and a price measured against the budget you agreed, never a bulk catalogue dump.",
        image: "/images/how-it-works/curate-a-shortlist-v1.jpg",
        imageAlt: "A curated shortlist of branded gift concepts with mockups",
        imageFocus: "center",
        ctaLabel: "Browse Curated Catalogs",
        ctaHref: "/gifts",
        specs: [
            "Hand-edited concepts, never a bulk catalogue dump",
            "Custom branding mockups on every shortlisted gift",
            "Transparent pricing measured against your agreed budget",
            "The full shortlist lands within 48 hours"
        ]
    },
    {
        number: "03",
        title: "We fulfil & track",
        titleAccent: "track",
        summary: "Packing, personalisation, delivery, proof of receipt.",
        body: "Packing, personalisation, delivery and proof-of-receipt handled end-to-end, with live tracking. Your consignment is packed and personalised under one roof, then tracked at every leg until the proof-of-receipt comes back to you.",
        image: "/images/how-it-works/fulfil-and-track-v2.jpg",
        imageAlt: "A packed and personalised gift consignment ready for dispatch",
        imageFocus: "center",
        ctaLabel: "Plan Your Distribution",
        ctaHref: "/contact",
        specs: [
            "Packing and personalisation handled under one roof",
            "End-to-end delivery with live tracking at every leg",
            "Proof-of-receipt captured on delivery"
        ]
    },
    {
        number: "04",
        title: "They feel celebrated",
        titleAccent: "celebrated",
        summary: "A thoughtful gift, and a story your people retell.",
        body: "Recipients receive something thoughtful — and your programme becomes the story people retell. Every milestone is remembered on time, and the details are handled so your people feel looked after rather than processed.",
        image: "/images/how-it-works/they-feel-celebrated-v1.jpg",
        imageAlt: "A recipient opening a thoughtfully presented gift",
        imageFocus: "right",
        ctaLabel: "See It In Action",
        ctaHref: "/contact",
        specs: [
            "Recipients receive something genuinely thoughtful",
            "Milestones remembered on time, every single time",
            "A programme people keep talking about for months"
        ]
    }
];
export const clientLogos: string[] = [
    "NOVARA",
    "Helio",
    "Vantage",
    "Kestrel",
    "Aptiva",
    "MERIDIAN"
];
/* ------------------------------------------------------------------ */
/* Integration marquee (`sections/IntegrationMarquee.tsx`).            */
/*                                                                     */
/* THE MONOGRAM, NOT THE VENDOR LOGO - and this is the one substantive */
/* deviation from the brief, which asked for a "vector logo icon" per  */
/* brand. Workday, BambooHR, Rippling, HiBob, Gusto, Personio, ADP,    */
/* Slack, Microsoft Teams, Zapier, Okta, Salesforce and HubSpot are    */
/* third-party trademarks: each vendor owns its mark, ships its own    */
/* brand asset, and gates use of it behind a brand or partner agreement. */
/* Drawing an approximation here would publish a mark nobody licensed,  */
/* so each pill instead carries a single-letter tile derived from the   */
/* name's first character - a real vector glyph in the house type that   */
/* cannot misrepresent anyone. Dropping in the genuine SVG marks later  */
/* is a local change to one span in that one section.                   */
/*                                                                     */
/* Two lists rather than one interleaved run, because the rows scroll   */
/* in OPPOSITE directions and that counter-motion is the whole point of */
/* the band.                                                           */
/*                                                                     */
/* Order is the brief's order and is deliberately NOT alphabetised. The */
/* rows read roughly by how central each tool is to a gifting trigger - */
/* HRIS decides WHO, ops decides WHAT HAPPENS NEXT - and sorting them    */
/* would flatten that at no benefit.                                     */
/* ------------------------------------------------------------------ */
export const hrisPlatforms: string[] = [
  "Workday",
  "BambooHR",
  "Rippling",
  "HiBob",
  "Gusto",
  "Personio",
  "ADP",
];

export const opsIntegrations: string[] = [
  "Slack",
  "MS Teams",
  "Zapier",
  "Okta",
  "Salesforce",
  "Hubspot",
];
/* ------------------------------------------------------------------ */
/* NOTE for review: the `proof` metric and description on each card.  */
/* All six are public copy. Three are positioning language with no    */
/* claim in them. Three are claims, and one of those contradicts      */
/* copy this file already publishes.                                  */
/*                                                                    */
/*   1. "100% On-Time Festive Delivery" (corporate-festive) is the    */
/*      one to settle first, because it collides rather than merely   */
/*      adds. This file publishes 99% on-time in `stats` (the trust   */
/*      bar), 99% in `caseStudies`, and 99.4% in `whoWeAreReach`. A   */
/*      reader who sees 99% in the trust bar and 100% on a card has   */
/*      been told two different things about the same measure.        */
/*                                                                    */
/*      Worth knowing before calling that new: `testimonials`         */
/*      already carries "12 drops - 100% on time", so the site has    */
/*      been internally inconsistent here since before this edit.     */
/*      What the card changes is WHO makes the promise. A 100%        */
/*      inside a testimonial is a client describing their own         */
/*      experience; a 100% on a marketing card is the company         */
/*      promising it. Same number, very different weight.             */
/*                                                                    */
/*      Fixing it means either dropping the card to a figure the      */
/*      rest of the site can carry, or raising the 99% claims, and    */
/*      that is a commercial call, not a copy call.                   */
/*                                                                    */
/*      Do NOT confuse it with the "100% doorstop guarantee" in       */
/*      `faqs` and `homeFaqs`. That is a REPLACEMENT promise: we      */
/*      re-send when a parcel fails, and it is fully compatible with  */
/*      99% on-time. As written, this card claims perfect             */
/*      punctuality, which is not the same thing at all.              */
/*                                                                    */
/*   2. "Same-Day Dispatch & Zero-Damage Guarantee" (ecommerce-d2c)   */
/*      packs two hard commitments into one phrase. Same-day          */
/*      dispatch is an operational cutoff, and the 2:00 PM IST        */
/*      cutoff is already flagged for review in the FAQ block above   */
/*      this one.                                                     */
/*                                                                    */
/*      "Zero-Damage" is the ambiguous half. Read literally it        */
/*      claims damage never occurs, which is a stronger promise       */
/*      than the doorstop guarantee already published. If the         */
/*      intent is "we replace anything that arrives damaged", that    */
/*      is covered and keepable today, and saying it plainly would    */
/*      be both safer and more credible.                              */
/*                                                                    */
/*   3. "Verified Quality & Batch Accuracy" (healthcare-pharma)       */
/*      asserts a QA and batch-tracking regime. This is a genuine     */
/*      improvement on what it replaced: "Temperature Verified"       */
/*      and "Zero compliance flags" made cold-chain and               */
/*      compliance-outcome claims that no hub audit supports.         */
/*      But "verified" still claims something is being verified,      */
/*      and "batch" still implies regulated handling.                 */
/*                                                                    */
/*   4. "High-Perceived-Value Rewards" (retail-wholesale),            */
/*      "Premium Onboarding & Swag Boxes" (technology-enterprise)     */
/*      and "Practical Plant & Safety Rewards"                        */
/*      (industrial-manufacturing) are positioning language.          */
/*      Nothing to sign off. Only "Safety Rewards" is worth a         */
/*      glance, in case it implies rewards tied to a safety           */
/*      performance programme, which would be a different claim.      */
/*                                                                    */
/*   NET: apart from the "100%" in item 1, this section now contains  */
/*   no figures at all. The previous set carried 24h, 18k, 99.4%, 40+ */
/*   and 0% as card stats, and 99.8%, 12,000+ orders/day, 1,000+ kits */
/*   and 40+ countries as proof strings. All of those are gone. That  */
/*   is a real cut in exposure and the right trade for a high-touch   */
/*   positioning, so it is worth keeping. It also means the grid holds*/
/*   no number anywhere now, so anything returning later is a NEW     */
/*   claim rather than a restored one.                                */
/* ------------------------------------------------------------------ */
export const industries: Industry[] = [
    {
        id: "ecommerce-d2c",
        name: "E-Commerce & D2C Brands",
        body: "Keep buffer stock, flash drops, and unified inventory management tight. We hold launches and peaks in one pool so spikes land as a busy week, not a crisis.",
        points: [
            "Buffer stock held across peak and launch windows",
            "Same-day kitting for flash drops and restocks",
        ],
        image: "/images/industries/ecommerce-d2c.jpg",
        imageAlt: "Dealer incentive gift box prepared for an e-commerce brand campaign",
        cta: "Plan Your Program",
        proof: {
            tag: "Same-Day Dispatch & Zero-Damage Guarantee",
            detail: "Fast, flexible packing for festive rushes and influencer launches—handled with care, not lost in a mega-warehouse.",
        },
    },
    {
        id: "corporate-festive",
        name: "Corporate & Festive Gifting",
        body: "Streamline early capacity reservation and consolidated invoicing. We lock curation to your calendar and dispatch on one invoice.",
        points: [
            "Capacity reserved before the festive window opens",
            "Culturally aware hampers and milestone drops",
        ],
        image: "/images/industries/corporate-festive-gifting.jpg",
        imageAlt: "Diwali corporate gift hamper box with festive presentation",
        cta: "Request a Consultation",
        imagePosition: "50% 50%",
        proof: {
            tag: "100% On-Time Festive Delivery",
            detail: "Turnkey hamper curation, custom ribbon-tying, and multi-city dispatch for Diwali, New Year, and company milestones.",
        },
    },
    {
        id: "healthcare-pharma",
        name: "Healthcare & Pharma",
        body: "Support night-shift delivery windows and audit-ready records. We give shift teams a seamless reward experience across every site.",
        points: [
            "Night-shift and weekend delivery windows",
            "24h replacement dispatch, no questions asked",
        ],
        image: "/images/industries/healthcare-pharma.jpg",
        imageAlt: "Medical staff appreciation gift box ready for dispatch",
        cta: "Get Started",
        imagePosition: "50% 50%",
        proof: {
            tag: "Verified Quality & Batch Accuracy",
            detail: "Neat, tamper-evident gift hampers for doctor appreciation and sales team incentive drives across India.",
        },
    },
    {
        id: "retail-wholesale",
        name: "Retail & Wholesale Distribution",
        body: "Trim high-velocity kits and compressed dispatch. We scale hampers and incentive boxes so peak windows clear without empty shelves.",
        points: [
            "High-velocity kits for store and floor teams",
            "48h compressed dispatch for rush drops",
        ],
        image: "/images/industries/retail-wholesale.jpg",
        imageAlt: "Executive gift hamper box for distributor incentive programmes",
        cta: "Talk to an Expert",
        imagePosition: "50% 50%",
        proof: {
            tag: "High-Perceived-Value Rewards",
            detail: "Customized dealer incentive kits and partner appreciation gifts prepped for nationwide distributor dispatch.",
        },
    },
    {
        id: "technology-enterprise",
        name: "Technology & Enterprise Swag",
        body: "Condense remote welcome kits and HRIS sync details. We track distributed recognition at scale with customs handled in-hub.",
        points: [
            "Remote-first welcome kits for new joiners",
            "Milestone recognition synced from your HRIS",
        ],
        image: "/images/industries/technology-enterprise-swag.jpg",
        imageAlt: "Work anniversary gift box for a technology team",
        cta: "Inquire Now",
        proof: {
            tag: "Premium Onboarding & Swag Boxes",
            detail: "Curated welcome packs, custom apparel, and tech accessories pre-assembled for new joins and remote teams.",
        },
    },
    {
        id: "industrial-manufacturing",
        name: "Industrial & Manufacturing",
        body: "Shorten rugged packaging and per-unit receipts. We schedule milestone and safety rewards around shifts with logged delivery.",
        points: [
            "Safety-programme and long-tenure rewards",
            "Rugged packaging for plant environments",
        ],
        image: "/images/industries/industrial-manufacturing.jpg",
        imageAlt: "Long-service reward box for plant and manufacturing employees",
        cta: "Discuss Your Needs",
        imagePosition: "50% 50%",
        proof: {
            tag: "Practical Plant & Safety Rewards",
            detail: "High-utility, durable reward sets and festive sweet boxes customized for factory floor teams and long-service awards.",
        },
    },
];
/**
 * Compliance claims - READ THIS BEFORE EDITING ANY STRING BELOW.
 *
 * This is where the site makes regulated representations in public copy, and
 * the wording is deliberately careful. "Aligned" is not a synonym for
 * "certified": ISO 27001 alignment means the framework is built to the
 * standard, whereas certification means an accredited body has audited and
 * issued a certificate. The site says "aligned" wherever it mentions the
 * standard - in this file's `homeFaqs`, in the `team` blurb, and in the
 * pillar copy here - and it should keep saying it.
 *
 * Do NOT add "SOC 2 Type II", "ISO 27001 Certified", "FDA Registered" or
 * "GDPR Certified" without a certificate in hand. Those are regulated
 * representations: an FDA registration claim in particular is not a marketing
 * flourish, and a SOC 2 Type II report is a specific audited attestation
 * covering a defined period. If Fulfill Nest does hold them, the correct move
 * is to add the real strings here and have someone confirm the audit period
 * and scope - not to soften or hedge them.
 *
 * HISTORY: this warning used to head `complianceTrustSignals`, the five-item
 * uppercase trust bar that sat between the compliance section's heading and
 * its pillar grid. Both the array and its `<ul>` have been removed at the
 * client's request. The warning is preserved and re-anchored here rather
 * than deleted with the array, because these pillars still carry the same
 * class of public claim - a `detail` and three `specs` each - so removing
 * the note would have left the live copy unguarded.
 */
export const compliancePillars: CompliancePillar[] = [
    {
        number: "01",
                title: "Physical Warehouse Security",
        titleAccent: "Security",
        summary: "Vetted partners, documented custody, proof at every handoff.",
        detail: "Your inventory is held with vetted fulfilment partners under a documented chain of custody. Nothing moves without a recorded handoff, and nothing is signed for without a proof-of-delivery record against the recipient. Peak capacity is reserved before a season opens rather than found during it.",
        image: "/images/compliance/physical-warehouse-security.png",
        imageAlt: "Sealed, racked storage in a Fulfill Nest partner warehouse",
        ctaLabel: "Discuss Facility Security",
        specs: [
            "Documented chain of custody from pick to doorstep",
            "Proof of delivery recorded against every recipient",
            "Vetted logistics partners with multi-region cover",
        ],
    },
    {
        number: "02",
        title: "Data & System Privacy",
        titleAccent: "Privacy",
        summary: "Recipient data encrypted, access-controlled, never resold.",
        detail: "Corporate gifting means holding employee addresses and personal details, so the handling is built for it. Recipient lists are encrypted at rest and in transit behind role-based access, and couriers see only what a single delivery requires. We never retain a team's data beyond the programme that needs it, and we never share your people's data.",
        image: "/images/compliance/data-system-privacy.png",
        imageAlt: "Encrypted recipient records held behind role-based access",
        ctaLabel: "Request Security Overview",
        specs: [
            "Encrypted at rest and in transit",
            "Role-based access, audited on every request",
            "Couriers see only the data one delivery needs",
        ],
    },
    {
        number: "03",
        title: "Regulatory & Budget Controls",
        titleAccent: "Controls",
        summary: "Hard caps enforced before checkout. GST-ready invoicing.",
        detail: "Policy is built into the programme on day one rather than reconciled after it. You set hard per-recipient and per-campaign ceilings and they are enforced before anything reaches checkout, so an over-budget pick is blocked at source. Every order ships with GST-ready, line-item invoicing your finance team can reconcile in minutes.",
        image: "/images/compliance/regulatory-budget-controls.png",
        imageAlt: "Per-recipient and per-campaign budget caps applied at checkout",
        ctaLabel: "Consult on Compliance",
        specs: [
            "Per-recipient and per-campaign caps enforced at source",
            "GST-ready line-item invoicing with custody records",
            "Over-budget selections blocked before checkout",
        ],
    },
    {
        number: "04",
        title: "Audit & Traceability",
        titleAccent: "Traceability",
        summary: "Disclosure-ready reporting your auditors already ask for.",
        detail: "Governed sectors need the same report their auditors request, and they should not have to ask twice. Risk and procurement get a downloadable trail covering invoicing, recipient records, dispatch and proof of receipt — the full chain, not a summary of it. On a recent programme that trail cleared audit with zero compliance flags raised.",
        image: "/images/compliance/audit-traceability.png",
        imageAlt: "A completed order trail from invoice through to proof of receipt",
        ctaLabel: "Inquire About Traceability",
        specs: [
            "Per-recipient records across invoicing to delivery",
            "Downloadable disclosure-ready reporting for risk teams",
            "Policy-config report issued alongside every invoice",
        ],
    },
];
export const industryCaseStudies: IndustryCaseStudy[] = [
    {
        icon: "globe",
        sector: "Technology · Global",
        headline: "A 12,000-kit dispatch across 40+ countries",
        body: "One distributed workforce, one recognition calendar. We consolidated multi-region fulfilment with customs handled in-hub — every kit landed in the same week, in every time zone.",
        metric: "40+",
        metricLabel: "countries delivered, one calendar",
        tags: [
            "Global dispatch",
            "Customs handled"
        ]
    },
    {
        icon: "heart",
        sector: "Healthcare · Shift Work",
        headline: "Night-shift-aware delivery to 80 hospital sites",
        body: "Shift teams are rarely at their desks at 9am. We routed drops around clinical hours with 24/7 support, so night and day staff got the same recognition — on their time.",
        metric: "99.4%",
        metricLabel: "on-time shift deliveries",
        tags: [
            "Night-shift aware",
            "24/7 support"
        ]
    },
    {
        icon: "shield",
        sector: "Finance · Audit",
        headline: "A full custody trail that cleared audit with zero flags",
        body: "Every gift logged end-to-end — invoicing, recipient record, dispatch and proof of receipt. Risk and procurement teams pulled a downloadable trail that satisfied internal audit first time.",
        metric: "0",
        metricLabel: "compliance flags raised",
        tags: [
            "Fully auditable",
            "Docs on demand"
        ]
    }
];
export const industryFaqs: FaqItem[] = [
    {
        "question": "What compliance frameworks can gifting programs adhere to for regulated industries?",
        "answer": "We align gifting executions to sector-specific governance, applicable value limits, ethics policies, internal review protocols, and documentation requirements across healthcare, financial services, technology, and enterprise organisations, while maintaining standard quality and delivery service levels."
    },
    {
        "question": "How are gifting programs coordinated across multiple locations, branches, or warehouses?",
        "answer": "Programs are managed through centralised planning, regional batch allocation, address verification, and coordinated dispatch routing. This model supports branch rollouts, warehouse activation kits, regional recognition drives, and nationwide program deployment without duplicating administration."
    },
    {
        "question": "What security measures protect recipient and employee data during fulfilment?",
        "answer": "Personal data is captured through secure forms and stored in controlled environments with limited access permissions, encrypted transmission practices, and defined retention procedures aligned to enterprise data governance requirements."
    },
    {
        "question": "How are budget controls and spend policies maintained across industry programs?",
        "answer": "Budget controls are embedded at curation, approval, assembly, and billing stages. Department-wise caps, cohort-level benchmarks, and audit-ready reporting ensure that programs remain cost-controlled without sacrificing quality and experience."
    },
    {
        "question": "What audit trails and records are generated throughout fulfilment?",
        "answer": "We provide structured records covering approvals, batch assemblies, dispatch confirmations, courier references, delivery status, and invoicing documentation. These support procurement audits, compliance reviews, and internal governance requirements."
    },
    {
        "question": "Do industry programs require minimum order thresholds?",
        "answer": "Most programs can be initiated from modest unit volumes, with flexible commercial arrangements for enterprise-level campaigns. Final thresholds depend on custom packaging, production lead times, and product sourcing requirements."
    },
    {
        "question": "How are employee gifts delivered to field-based or distributed teams?",
        "answer": "Gifts can be delivered to personal addresses, regional depots, client sites, remote offices, or event venues. We coordinate logistics based on recipient geography and provide visibility at every dispatch stage."
    },
    {
        "question": "Are gift themes available for different industries and workplace cultures?",
        "answer": "Yes. We curate tailored propositions across technology, finance, manufacturing, healthcare, consulting, retail, and other sectors, balancing recipient relevance, cultural fit, and sector-appropriate product quality."
    },
    {
        "question": "Can multi-location partner and channel networks be included in gifting campaigns?",
        "answer": "Yes. Partner-network programs can support branch-level rollouts, reseller recognition, distributor appreciation, and revenue-based reward cycles with separate tracking, reporting, and dedicated account management as required."
    },
    {
        "question": "Are international dispatches supported for global teams or overseas partners?",
        "answer": "Select programs can support international delivery depending on product suitability, destination regulations, customs restrictions, and partner requirements. Feasibility is confirmed during program scoping."
    },
    {
        "question": "How is packaging adapted for regulated sectors and policy-sensitive environments?",
        "answer": "Packaging can be tailored with compliant messaging, value-aligned inserts, neutral branding, and sector-specific documentation. This helps organisations meet internal policies and regulatory expectations without compromising presentation."
    },
    {
        "question": "What is batch tracking and how does it support traceability?",
        "answer": "Batch tracking records assembly groupings, component lot information, packaging stages, and dispatch linkage. This creates a traceable record that improves accountability, quality control, and audit compliance throughout the program."
    }
];
/** Membership & plan tiers, four across on /pricing.
 *
 *  The tier names are the brief's, and they are the one part of this block
 *  that is not Fulfill Nest's own vocabulary: Basic / Silver / Gold / Platinum
 *  are SwagUp's published plan names, and the feature lists are largely
 *  SwagUp's too — "Redeem + Zapier integrations", "Shop access", "Unlimited
 *  mockups", "Free assembly", "N x Rewards" and the shipping/storage discount
 *  percentages have no counterpart anywhere in this codebase. `Zapier`,
 *  `Redeem`, `Shop access`, `gift card` and `insurance` do not appear on the
 *  site at all; the integrations the site does claim are Shopify, WooCommerce,
 *  Amazon, Magento, Unicommerce, REST, HRIS, Slack and Teams. Treat this block
 *  as a layout and copy skeleton to be re-authored against real packaging,
 *  rates and integrations before it ships anywhere public.
 *
 *  CURRENCY. The prices are rupees and they go through `formatPrice`, not a
 *  hardcoded "₹", so `toLocaleString("en-IN")` does the digit grouping: 4999
 *  renders "₹4,999", 19999 "₹19,999", 49999 "₹49,999". That is the same helper
 *  the catalog, the hero stats and the (dead) budget calculator already print
 *  with, so all money on the site now comes from one formatter and one symbol.
 *  Previously these four tiers were the only dollar figures in the codebase.
 *
 *  `watermark` is the brief's two-letter brand pill ("FN"). */
export const membershipTiers: MembershipTier[] = [
    {
        name: "Basic",
        watermark: "FN",
        price: formatPrice(0),
        billingNote: "Free to start",
        bestFor: "Best for first-time orders and one-off team drops",
        features: [
            "Platform access",
            "Dedicated gifting expert",
            "Unlimited mockups",
            "Free assembly",
            "1x Rewards",
            "Redeem + Zapier"
        ],
        cta: "Get Started",
        ctaVariant: "outline"
    },
    {
        name: "Silver",
        watermark: "FN",
        price: `${formatPrice(4999)} / mo`,
        billingNote: "Annual plan, billed monthly",
        bestFor: "Best for growing teams ordering quarterly or more",
        features: [
            "All Basic +",
            "Free samples",
            "Extended catalog",
            "3rd party storage",
            "2x Rewards",
            "25% expedited discount",
            "5% shipping off",
            "20% storage off"
        ],
        cta: "Get Started",
        ctaVariant: "primary"
    },
    {
        name: "Gold",
        watermark: "FN",
        price: `${formatPrice(19999)} / mo`,
        billingNote: "Annual plan, billed monthly",
        bestFor: "Best for ongoing swag, onboarding & gifting programs",
        features: [
            "All Silver +",
            "3% off swag & products",
            "Free expedited production",
            "Shop access",
            "HRIS Integrations",
            "3x Rewards",
            "10% Shipping off",
            "50% storage off"
        ],
        cta: "Get Started",
        ctaVariant: "primary",
        badge: "Most popular",
        highlighted: true
    },
    {
        name: "Platinum",
        watermark: "FN",
        price: `${formatPrice(49999)} / mo`,
        billingNote: "Annual plan, billed monthly",
        bestFor: "Best for large enterprises and global teams in India",
        features: [
            "All Gold +",
            "5% off swag & products",
            "Dedicated design team",
            "Gift card access",
            "Shipping insurance",
            "Global fulfillment",
            "4x Rewards",
            "Free storage"
        ],
        cta: "Upgrade",
        ctaVariant: "primary"
    }
];
export const caseStudies = [
    {
        client: "Finlight",
        industry: "Financial Services",
        headline: "A recognition programme people actually remember",
        quote: "They turned our annual recognition programme from a checklist into the thing people actually talk about. The live tracking sealed it for our HR team.",
        author: "Ananya Krishnan",
        authorRole: "Head of People",
        metric: "+32%",
        metricLabel: "programme participation YoY"
    },
    {
        client: "Vantage Systems",
        industry: "Technology",
        headline: "18,000 employees, every single one reached",
        quote: "Fulfill Nest understands that a reward is only as good as how it feels. Every box felt hand-picked, not bulk-ordered — at 18,000 scale.",
        author: "Daniel Osei",
        authorRole: "CXO",
        metric: "18k",
        metricLabel: "employees rewarded on time"
    },
    {
        client: "Aptiva Retail",
        industry: "Retail",
        headline: "A 500-unit festive season, flawlessly delivered",
        quote: "From a 500-unit festive order to bespoke leadership hampers, every single one landed beautifully. Their ops team is obsessed with the details.",
        author: "Robert Hale",
        authorRole: "Procurement Lead",
        metric: "99%",
        metricLabel: "on-time across the whole season"
    },
    {
        client: "Kestrel Telecom",
        industry: "Telecom",
        headline: "Partner incentives that moved the channel",
        quote: "Our channel partners genuinely talk about the incentive boxes. Curation matters more than the gift — and Fulfill Nest gets that.",
        author: "Meera Sundaram",
        authorRole: "Channel Partner Manager",
        metric: "3×",
        metricLabel: "partner engagement uplift"
    }
];
export const journalPosts = [
    {
        id: "why-rewards-feel-generic",
        category: "Employee experience",
        title: "Why most rewards feel generic — and how to fix it",
        excerpt: "The gap between 'it arrived' and 'it mattered' is curation. A field guide to making every recognition moment feel hand-picked, even at scale.",
        readTime: "6 min read",
        date: "Sep 2026"
    },
    {
        id: "gifting-budget-guide",
        category: "Gifting strategy",
        title: "The 2026 corporate gifting budget guide",
        excerpt: "Where the money actually goes in a modern rewards programme — and the three cost lines your CFO will thank you for getting right.",
        readTime: "8 min read",
        date: "Aug 2026"
    },
    {
        id: "festive-gifting-culture",
        category: "Culture",
        title: "Festive gifting that respects every culture in your company",
        excerpt: "Diwali, Eid, Christmas, Lunar New Year — one programme, many audiences. How to design festive hampers that land with warmth everywhere.",
        readTime: "7 min read",
        date: "Aug 2026"
    },
    {
        id: "unboxing-psychology",
        category: "Employee experience",
        title: "The psychology of the unboxing moment",
        excerpt: "Why the first sixty seconds with a gift shape how it's remembered — and how to engineer that moment for delight, not just delivery.",
        readTime: "5 min read",
        date: "Jul 2026"
    },
    {
        id: "enterprise-logistics-checklist",
        category: "Operations",
        title: "The enterprise gifting logistics checklist",
        excerpt: "Customs, consignee lists, proof-of-receipt, reconciliation. The operational checklist procurement teams ask us for again and again.",
        readTime: "9 min read",
        date: "Jun 2026"
    },
    {
        id: "measuring-reward-engagement",
        category: "Measurement",
        title: "Measuring reward programmes like a revenue team",
        excerpt: "Participation is vanity, impact is sanity. The engagement metrics that prove a rewards programme earns its budget — and the ones that don't.",
        readTime: "6 min read",
        date: "May 2026"
    }
];
/* ------------------------------------------------------------------ */
/*  /faq knowledge hub — the categorised, filterable question set.      */
/*                                                                     */
/*  This is the site's ONE comprehensive client-facing FAQ. The other  */
/*  four sets (`homeFaqs`, `serviceFaqs`, `industryFaqs`, `pricingFaqs`)*/
/*  are deliberately narrow — eight or nine questions each, tuned to    */
/*  one route's buying question. This one is the opposite: every         */
/*  touchpoint a client touches, grouped so a reader can find their     */
/*  topic rather than scroll for it.                                    */
/*                                                                     */
/*  NO COUNT IS WRITTEN INTO ANY COPY. Neither the hero lead nor the
 *  band description states how many questions there are as a literal: that is
 *  a number someone has to hand-edit every time a question is added, and it
 *  was already wrong once. `FaqHub` renders the live count instead, so there
 *  is exactly one number and it is computed.
 *
 *  Every entry carries a `category` matching `faqCategories` below.    */
/*  Two entries are inherited verbatim from the old flat list so the     */
/*  existing answers are not lost: proof of receipt (SLAs) and         */
/*  multi-region delivery (network).                                    */
/*                                                                     */
/*  NOTE for review — figures introduced by this expansion that are NOT */
/*  published elsewhere on the site, and so carry no cross-check:       */
/*    · "2:00 PM IST" dispatch cut-off (exact operational commitment)   */
/*    · "45+ cities" and "19,000+ pin codes" (the site's existing       */
/*      coverage claims are 40+ and 65+ COUNTRIES — a different axis)   */
/*    · "1,000 festive hampers across 45 cities in 5 days" (a specific  */
/*      completed programme)                                            */
/*    · "zero-shrinkage inventory" as an SLA-backed commitment          */
/*    · The named integration list (Shopify, WooCommerce, Amazon,       */
/*      Magento, Unicommerce). The site previously named HRIS platforms */
/*      only, never commerce/ERP systems.                               */
/*    · "multi-point barcode scanning and weight checks" as the accuracy*/
/*      mechanism                                                       */
/*  Each is a commercial claim the business has to stand behind. They   */
/*  are not contradictions of anything already published, but they are  */
/*  new numbers on a page that now makes a lot of them.                 */
/*                                                                     */
/*  The 99.8% order-accuracy figure is not new — it already appears in  */
/*  `serviceFaqs` below, carrying the note there about its relationship */
/*  to the site's separate 99% ON-TIME claim. It is repeated here for   */
/*  discoverability, and that note applies to this occurrence too.      */
/* ------------------------------------------------------------------ */
export const faqCategories: FaqCategory[] = [
  {
    id: "slas",
    label: "Operational SLAs",
    blurb: "Dispatch cut-offs, accuracy guarantees, damage cover and the contractual commitments behind them.",
  },
  {
    id: "network",
    label: "Network & Distribution",
    blurb: "Where we operate, how far we reach, and the address, customs and multi-city mechanics.",
  },
  {
    id: "campaigns",
    label: "Campaigns & Kitting",
    blurb: "Seasonal spikes, bespoke assembly, branded packaging and how quickly a programme can ship.",
  },
  {
    id: "pricing",
    label: "Pricing & Storage",
    blurb: "How a 3PL invoice is built, what moves the shipping number, minimums and hidden fees.",
  },
  {
    id: "integrations",
    label: "Integrations & Tech",
    blurb: "Platforms we connect to, HRIS and CRM triggers, and how inventory stays in sync.",
  },
  {
    /* Not in the original five-category brief. Added because the pre-existing
       "How is recipient data protected?" entry had no honest home in any of
       them, and because security and compliance are a real client touchpoint
       the site already treats as a headline elsewhere (`ComplianceAssurance`,
       `GuaranteesGrid`). Filing it under "Integrations & Tech" would have been
       a taxonomy lie. */
    id: "trust",
    label: "Data & Compliance",
    blurb: "How recipient data is stored, who can reach it, and what our security posture actually is.",
  },
];

export const faqs: FaqItem[] = [
  /* --- Operational SLAs ------------------------------------------------ */
  {
    category: "slas",
    question: "What are Enterprise SLAs (Service Level Agreements)?",
    answer: "An Enterprise SLA is a contractually guaranteed benchmark for operational performance. It guarantees specific metrics such as 99.8%+ order accuracy, guaranteed same-day dispatch cutoffs, and strict delivery timelines — backed by financial credits or remedies if we miss those targets. Where a programme runs on an Enterprise agreement we also commit to zero-shrinkage inventory, with the same remedy structure attached.",
  },
  {
    category: "slas",
    question: "What are your cut-off times for same-day dispatch?",
    answer: "Orders received before 2:00 PM local warehouse time are picked, packed and handed over to our courier partners the same day. Anything received after the cut-off moves to the next working day's dispatch, and you can see the cut-off for your hub in the live tracking panel rather than having to ask us.",
  },
  {
    category: "slas",
    question: "How do you handle order accuracy and wrong-item dispatches?",
    answer: "Every picking list is verified before sealing: multi-point barcode scanning at pick, pack and dispatch, plus a weight check against the expected bill of materials. That three-stage pass is what holds picking accuracy at 99.8% or better. If a wrong item still reaches a recipient, we re-dispatch the correct item the same day and the error is written into the reconciliation report.",
  },
  {
    category: "slas",
    question: "What happens if a package is lost or damaged during transit?",
    answer: "We provide a 100% doorstop guarantee. Every shipment includes real-time tracking, and in the rare event an item arrives damaged or goes missing, our team dispatches a free replacement immediately — zero friction for your recipient. If a recipient is unavailable, the courier holds and retries, and an undeliverable gift balance rolls over as credit toward a future order.",
  },
  {
    category: "slas",
    question: "What does 'proof of receipt' actually mean?",
    answer: "Every delivery is logged end-to-end: dispatched, in-transit, out-for-delivery and received. You get a per-recipient status panel plus a downloadable reconciliation report for finance — no chasing couriers.",
  },

  /* --- Network & Distribution ------------------------------------------ */
  {
    category: "network",
    question: "How many cities do you cover for nationwide distribution?",
    answer: "We operate a network of strategic fulfilment hubs across major metro regions and the Tier-1 and Tier-2 corridors between them, giving us coverage across 45+ cities and 19,000+ pin codes within India. Your programme is assigned to the hub that minimises transit for your recipient list rather than to whichever one is nearest our head office.",
  },
  {
    category: "network",
    question: "Do you support temperature-controlled or cold-chain storage?",
    answer: "Yes — select hubs hold climate-controlled inventory for goods that cannot sit in ambient conditions, which covers most of the confectionery, gourmet and personal-care lines we ship, along with temperature-sensitive items where the handling spec requires it. Availability depends on which hub your stock is allocated to, so tell us what you are shipping and we will confirm the right facility before you commit.",
  },
  {
    category: "network",
    question: "Can you handle multi-region delivery and customs?",
    answer: "Enterprise plans include multi-region fulfilment with vetted logistics partners, duties-and-taxes handling and customs documentation — so a gift leaves one hub and arrives compliantly in thirty countries.",
  },
  {
    category: "network",
    question: "How do you handle address collection and verification for remote employees?",
    answer: "We send your admins a secure intake link to collect recipient details in one pass. Before dispatch, our Address Verification Engine confirms each address by SMS and email, flags mismatches and lets recipients correct details — cutting failed deliveries to near zero, even for fully distributed workforces.",
  },

  /* --- Campaigns & Kitting --------------------------------------------- */
  {
    category: "campaigns",
    question: "Can you handle massive seasonal spikes like Diwali or New Year corporate gifting?",
    answer: "Yes — capacity is planned backwards from the peak rather than added during it. In Diwali peak operations we fulfilled over 1,000 custom festive hampers across 45 cities in a five-day window, kitting and dispatching in parallel rather than in sequence. The lead-time advice is the practical part: tell us your festival date at least six weeks out and we will hold capacity against it.",
  },
  {
    category: "campaigns",
    question: "What custom kitting and bespoke packaging services do you provide?",
    answer: "Custom box assembly to your spec, branded ribbon tying, personalised message card insertion, promotional insert kitting, and eco-friendly protective wrapping. On multi-item kits every component is barcode-verified against the bill of materials before the box is sealed, so a 1,000-unit run is auditable unit by unit.",
  },
  {
    category: "campaigns",
    question: "How do you handle sustainability and eco-conscious sourcing?",
    answer: "We maintain an eco-curated product catalogue — B-Corp certified brands, GOTS-certified organic cotton apparel, plastic-free packaging and carbon-neutral shipping options — so a programme can be specified against an ESG target rather than talked about in one. Protective wrapping is available in recyclable and plastic-free formats across the standard kitting range, and if a brief names a certification requirement we will tell you which lines meet it before you commit.",
  },
  {
    category: "campaigns",
    question: "How quickly can you deliver a programme?",
    answer: "A curated shortlist lands within 48 hours of your consultation. Once approved, standard programmes ship within 5–7 working days; seasonal orders are quoted around your calendar. Rush slots are available for celebration moments that can't wait.",
  },
  {
    category: "campaigns",
    question: "Do boxes get customised with our branding?",
    answer: "Yes. Branded packing, personalised notes and custom inserts are standard on Growth plans and above, and add-ons for retailer-ready festive kits. Every box can carry your logo and your people's names.",
  },

  /* --- Pricing & Storage ------------------------------------------------ */
  {
    category: "pricing",
    question: "How is 3PL fulfilment pricing structured?",
    answer: "Pricing is modular and itemised, so you can see which line moved when a bill changes. It has four parts: inbound receiving (unloading, count-check and put-away), monthly storage (billed per bin or per pallet depending on how your stock is held), pick-and-pack charged per item rather than per order, and transit at discounted courier rates. Custom curation, branded packaging and tracked delivery sit on top as their own lines — there is no platform or handling fee, and nothing is added after you approve.",
  },
  {
    category: "pricing",
    question: "What is volumetric weight and how does it affect shipping costs?",
    answer: "Volumetric weight measures how much space a package occupies in transit rather than how heavy it is: Length × Width × Height (in cm) ÷ 5000 gives you the volumetric weight in kg. Couriers bill on whichever is greater — actual weight or volumetric weight — so a large box of light goods can cost more to ship than a small box of heavy ones. If a line is shipping badly against its price, we will show you the dimensional split and tell you whether the packaging or the product mix is the cause.",
  },
  {
    category: "pricing",
    question: "Is there a minimum order size?",
    answer: "Starter begins with a single thoughtful box. There is no minimum for bespoke curation — some of our favourite programmes started with one heartfelt thank-you and grew to thousands. Volume tiers do kick in automatically on larger runs, and festive orders over 50 kits carry additional seasonal pricing.",
  },
  {
    category: "pricing",
    question: "Are there any setup, onboarding or hidden platform fees?",
    answer: "No hidden fees ever. Custom curation, branded packaging and tracked delivery are itemised up front and locked before you approve, so the quote you sign is the invoice you receive. Onboarding for an Enterprise programme is covered in the agreement rather than billed separately.",
  },

  /* --- Integrations & Tech ---------------------------------------------- */
  {
    category: "integrations",
    question: "Which e-commerce platforms and ERPs do you integrate with?",
    answer: "We offer plug-and-play integrations with Shopify, WooCommerce, Amazon, Magento and Unicommerce, plus custom ERP connections over REST APIs where your stack is bespoke. Most implementations are order-triggered rather than export-based, so a sale on your storefront becomes a pick instruction without anyone re-keying it.",
  },
  {
    category: "integrations",
    question: "How does real-time inventory syncing work?",
    answer: "Our Warehouse Management System updates inventory counts across all your connected marketplaces and stores within seconds of a receipt or a despatch. That means a channel is not selling stock you have already allocated, and your own dashboards reflect the true position without a nightly reconciliation file.",
  },
  {
    category: "integrations",
    question: "What does omnichannel fulfilment mean for my business?",
    answer: "It means one warehouse network serves every channel you sell through — B2C storefronts, B2B wholesale orders and marketplaces — against a single live inventory position, rather than each channel holding its own stock and drifting out of sync. Order volume stops being a reason to split your operation, and a gift, a replenishment and a wholesale pick can share the same pick path.",
  },
  {
    category: "integrations",
    question: "Can Fulfill Nest integrate with our existing HR, Slack or HRIS platforms?",
    answer: "Yes. We integrate with major HRIS platforms (BambooHR, Workday and HiBob), Slack, and automated CRM triggers, so work anniversaries, birthdays and performance milestones fire gifts automatically without manual admin. Combined with the commerce and ERP connectors, that covers the three places recognition data usually lives.",
  },

  /* --- Data & Compliance ------------------------------------------------ */
  {
    category: "trust",
    question: "How is recipient data protected?",
    answer: "Recipient lists are encrypted at rest and in transit, access is role-based and audited, and we're ISO 27001 aligned with data-secure fulfilment partners. We never share your people's data. We are deliberately ISO 27001-ALIGNED rather than certified — if a procurement questionnaire needs formal certification, ask us and we will tell you exactly where we are rather than implying a badge we do not hold.",
  },
  {
    category: "trust",
    question: "What happens if a recipient's delivery address changes?",
    answer: "Every recipient gets a dynamic address-confirmation link before dispatch. If they update the address, the order routes to the new destination before it ships rather than becoming a failed delivery. Anything that cannot be corrected in that window is held at the hub, not returned to sender, so a rescue is always possible.",
  },
  {
    category: "trust",
    question: "What reporting do you give regulated and governed teams?",
    answer: "For governed sectors we layer compliance onto the standard chain of custody: per-recipient documentation, disclosure-ready reporting and policy-capped gift values. Healthcare and finance teams typically download the same reports their auditors already ask for, without us translating operational data into compliance language first.",
  },
];
export const homeFaqs: FaqItem[] = [
    {
        "question": "What specific categories of corporate gifting does Fulfill Nest specialise in?",
        "answer": "We design and execute comprehensive corporate gifting and reward frameworks tailored specifically for modern organizations. This spans internal culture-building programs, milestone celebrations, onboarding kits, and external partner or client appreciation strategies."
    },
    {
        "question": "Which departments and leadership roles typically partner with Fulfill Nest?",
        "answer": "We work closely with People Operations, HR teams, Workplace Administration, Procurement specialists, CXOs, and Channel Heads across fast-growing startups, mid-market companies, and large multinational enterprises."
    },
    {
        "question": "Do you cater to both internal employee programs and external partner engagement?",
        "answer": "Yes, absolutely. Our programs are built to bridge internal culture enhancement—such as employee retention and morale—with strategic external partner rewards, channel incentives, and stakeholder engagement."
    },
    {
        "question": "What does the curation process entail to ensure it aligns with our brand?",
        "answer": "Curation for us goes far beyond simply selecting items. We meticulously evaluate every product, material, packaging finish, and unboxing detail to ensure it authentically reflects your core brand values, corporate identity, and the emotion of the occasion."
    },
    {
        "question": "How do you manage logistics and delivery for remote or hybrid teams distributed across India?",
        "answer": "We provide an end-to-end logistics solution that includes secure address collection portals, verification workflows, careful multi-layer packaging, and reliable doorstep delivery reaching recipients pan-India."
    },
    {
        "question": "Can our team review samples or digital mockups before approving a bulk order?",
        "answer": "Yes. Depending on the scale and scope of your gifting program, we provide high-fidelity digital mockups or physical sample kits so you can review the items and packaging firsthand before production begins."
    },
    {
        "question": "Do you offer eco-friendly and sustainable gifting alternatives?",
        "answer": "We prioritize sustainability by partnering with conscious brands that offer eco-friendly, recycled, ethically sourced, and zero-waste product alternatives without ever compromising on quality or aesthetics."
    },
    {
        "question": "Which workplace occasions and milestones do your gifting programs support?",
        "answer": "Our programs are built for the entire employee lifecycle—including new hire onboarding, work anniversaries, festive celebration cycles, leadership offsite kits, spot recognition, and major corporate milestones."
    },
    {
        "question": "What quality assurance measures do you implement during production?",
        "answer": "Every single gift box undergoes strict multi-step quality control. Our processes involve controlled in-house assembly, careful hand-packing, and secure dispatch tracking to ensure flawless presentation upon arrival."
    },
    {
        "question": "What personalization and branding options are available for our corporate kits?",
        "answer": "We offer extensive personalization features, including custom monogramming, precision laser engraving, branded belly bands, custom sleeves, and personalized message cards inserted directly into the boxes."
    },
    {
        "question": "Can we integrate our own company-branded merchandise or event swag into the boxes?",
        "answer": "Yes, you can. We frequently integrate client-supplied promotional merchandise, branded swag, or bespoke leadership notes seamlessly into our curated gift boxes during assembly."
    },
    {
        "question": "How do you handle high-volume, enterprise-scale gifting programs?",
        "answer": "Large-scale programs are managed through structured batch-based production, proactive inventory planning, and strict SLA-driven fulfilment frameworks to guarantee consistency, accuracy, and on-time delivery across thousands of recipients."
    }
];
export const serviceTiers: ServiceTier[] = [
    {
        name: "Essential / Self-Serve",
        tagline: "Curated options, on your schedule.",
        features: [
            "Curated box options from our ready-made catalogue",
            "Standard packaging with on-brand label options",
            "Automated dispatch tracking & proof of receipt",
            "Minimum order of 20 units"
        ],
        cta: "Start with Essential"
    },
    {
        name: "Managed Corporate",
        tagline: "A dedicated team behind every batch.",
        features: [
            "Custom branded packaging & ribbons",
            "Personalized greeting cards for every recipient",
            "Dedicated account manager, end-to-end",
            "Campaign briefs, refreshes & rollover handled for you",
            "Minimum order of 50 units"
        ],
        cta: "Talk to an account manager",
        popular: true
    },
    {
        name: "Bespoke Enterprise",
        tagline: "Fully owned operations, built around you.",
        features: [
            "Fully custom product sourcing & development",
            "Custom portal / HRIS integration",
            "Global fulfillment with customs handling",
            "SLA guarantees on delivery windows & damage"
        ],
        cta: "Request a proposal"
    }
];
export const serviceGuarantees: ServiceGuarantee[] = [
    {
        number: "01",
        icon: "shield",
        title: "Zero-Damage Guarantee",
        body: "Immediate free replacement dispatch within 24 hours for any item damaged in transit.",
        image: "/images/services/guarantees/zero-damage-guarantee.png",
        imageAlt: "A gift box sealed with branded ribbon",
        imageWidth: 532,
        imageHeight: 541
    },
    {
        number: "02",
        icon: "radar",
        title: "Live Tracking Dashboard",
        body: "Real-time visibility and proof-of-delivery receipts for HR and procurement admins.",
        image: "/images/services/guarantees/live-tracking-dashboard.png",
        imageAlt: "A route map tracing a parcel between three hubs",
        imageWidth: 574,
        imageHeight: 540
    },
    {
        number: "03",
        icon: "chat",
        title: "Address Verification Engine",
        body: "Pre-dispatch SMS and email address confirmation to eliminate failed deliveries.",
        image: "/images/services/guarantees/address-verification-engine.png",
        imageAlt: "A mobile phone showing an address confirmation prompt",
        imageWidth: 740,
        imageHeight: 509
    },
    {
        number: "04",
        icon: "sparkles",
        title: "Rollover Credits",
        body: "Unused or unredeemed gift balances automatically roll over to future orders.",
        image: "/images/services/guarantees/rollover-credits.png",
        imageAlt: "An unused gift credit looping forward to a new order",
        imageWidth: 500,
        imageHeight: 505
    }
];
export const serviceCaseStudy: ServiceCaseStudy = {
    /* Was `/hero-gift.jpg`, the generic hamper flatlay that also sat behind the
       homepage hero. The section argues from a fulfilment-floor photograph —
       people packing boxes — rather than the finished-goods shot, so the picture
       now shows the operation the metrics below it are measuring.

       Kept as `.png` because that is what the source file in
       `Media & Others/Services/Proven Impact` is; the `.jpg` in the original
       request would have been an extension rename over PNG bytes. Native
       1920x1080, which is what `CaseStudyTeaser` declares as the intrinsic
       size. `serviceCaseStudy` is read only by `CaseStudyTeaser`, which renders
       only on /services, so this swap does not reach any other route. */
    image: "/images/services/proven-impact-logistics-team.png",
    imageAlt: "Logistics team packing boxes",
    metrics: [
        {
            value: "100%",
            label: "On-time delivery"
        },
        {
            value: "0%",
            label: "Damage rate"
        },
        {
            value: "20+",
            label: "Hours saved for HR"
        }
    ],
    quote: "Fulfill Nest took complete operational ownership of our Diwali campaign. Flawless execution.",
    author: "VP People Ops"
};
export const serviceFaqs: FaqItem[] = [
    {
        "question": "What exactly is included in an end-to-end corporate gifting service engagement?",
        "answer": "Our service spans strategy, curation, sourcing, sampling, custom packaging, address capture, secure assembly, quality assurance, multi-point dispatch, recipient delivery, and post-delivery support. Every engagement is structured around a clear workflow and milestone sign-off to ensure accountability from planning to delivery."
    },
    {
        "question": "How are recurring gifting cycles managed for onboarding, rewards, and celebrations?",
        "answer": "We design evergreen programs for onboarding kits, anniversary milestones, quarterly recognition, festive moments, and leadership events. Contribution calendars, approved SKU lists, and replenishment checkpoints are maintained to keep each cycle consistent and scalable."
    },
    {
        "question": "Can you develop bespoke employee reward frameworks aligned to organisational objectives?",
        "answer": "Yes. Recognition strategies can be refined for spot awards, peer-to-peer recognition, milestone achievements, value-based rewards, and contribution scoring. We help organisations establish frameworks that are engaging, measurable, and operationally sustainable."
    },
    {
        "question": "How are premium and fragile items protected during production and dispatch?",
        "answer": "They undergo controlled assembly using reinforced inserts, premium outer cartons, cushioning materials, and presentation-safe packaging. Critical items pass additional inspection checkpoints before dispatch so the delivered condition matches our quality standards."
    },
    {
        "question": "Do you offer digital reward options alongside physical gift kits?",
        "answer": "Yes. Multi-brand gift cards, voucher bundles, and redemption-driven reward journeys can complement physical gifting strategies or serve as standalone solutions for distributed and last-minute deployments."
    },
    {
        "question": "Can different reward structures and gift tiers be supported within the same program?",
        "answer": "Yes. Complex programs can include multiple recognition tiers, budget bands, role-based differentiation, and region-specific configurations while preserving a consistent brand experience and service standard."
    },
    {
        "question": "How is consistency maintained across thousands of individual gifts?",
        "answer": "Through standardized workflows, controlled in-house assembly, batch tracking, pre-dispatch quality audits, and documented packaging protocols. This governance ensures consistent presentation regardless of volume or geographical spread."
    },
    {
        "question": "What event-specific gifting solutions can be delivered for conferences or leadership off-sites?",
        "answer": "We design conference welcome kits, participant boxes, retreat hampers, culture-day gifts, leadership summit packs, and experiential additions, all aligned to event objectives and delivered to hotel rooms, venues, or delegate homes."
    },
    {
        "question": "How is company-supplied merchandise and collateral integrated into curated kits?",
        "answer": "We manage receipt, storage, inventory logging, controlled insertion, and inspection of supplied items. Each piece is allocated to the correct assembly stage and checked before sealing to ensure seamless presentation and brand continuity."
    },
    {
        "question": "What sample, mockup, and proofing options are available prior to production approval?",
        "answer": "Depending on scope, procurement teams can review digital mockups, packaging visualisations, pre-production samples, or fully assembled physical sample kits. These checkpoints reduce downstream revisions and confirm expectations before bulk processing begins."
    },
    {
        "question": "How is recipient address collection and verification managed for distributed teams?",
        "answer": "We utilise secure self-service portals, encrypted storage, approval workflows, and verification checks to consolidate and validate recipient details. This reduces operational risk and protects employee data throughout the program."
    },
    {
        "question": "What service-level commitments and escalation frameworks are offered to enterprise clients?",
        "answer": "Our SLAs define milestones for sourcing, assembly, dispatch, and delivery, supported by dedicated account management, issue escalation paths, and transparent reporting. This ensures operational accountability during high-volume or time-sensitive campaigns."
    }
];

export const giftsFaqs: FaqItem[] = [
    {
        "question": "What provenance and quality standards govern the products featured in the Explore Gifts catalogue?",
        "answer": "Every product is selected against stringent quality benchmarks covering durable construction, safe materials, functional reliability, and long-term brand-alignment. We partner only with vetted manufacturers and conscious suppliers who can demonstrate consistent batch quality, transparent sourcing, and dependable post-dispatch support."
    },
    {
        "question": "How flexible is the curation model when mixing items across different gift categories?",
        "answer": "Our curation framework is fully modular. Procurement teams can combine premium tech, wellness, stationery, lifestyle, travel, and bespoke elements to create cohesive gift boxes that reflect campaign objectives, department themes, or employee lifecycle milestones without compromising on presentation."
    },
    {
        "question": "What can we expect from the unboxing experience across custom gift boxes?",
        "answer": "We design each unboxing journey with deliberate layering, branded inserts, tissue standards, colour coordination, and protective presentation. The goal is to ensure recipients experience a premium first impression that reflects the sender's identity and the emotional intent of the occasion."
    },
    {
        "question": "What are the minimum order quantities for fully bespoke gift boxes?",
        "answer": "Bespoke configurations can generally be executed at moderate scale, with volumes driven by product sourcing lead times, custom packaging tooling, and fold-in requirements. We provide clear thresholds during scoping so teams can plan program budgets, inventory, and launch timelines with confidence."
    },
    {
        "question": "How can recipient delivery schedules be managed for dispersed or hybrid teams across India?",
        "answer": "We provide secure address-capture portals, verification workflows, scheduling windows, and coordinated dispatches. Whether gifts must arrive on the same day, staggered by region, or aligned with virtual ceremony dates, every shipment is tracked through final doorstep delivery."
    },
    {
        "question": "How do you ensure that gifts remain aligned with our brand guidelines and gifting policies?",
        "answer": "We assess tone, colour palettes, material quality, packaging preferences, compliance restrictions, and value limits before curation begins. This governance ensures every gift proposition is on-brand, policy-compliant, and commercially appropriate."
    },
    {
        "question": "What personalization and branding options are available for individual gift items?",
        "answer": "Personalization can include laser engraving, monogramming, private labelling, branded sleeves, embossed packaging, custom belly bands, and personalised note cards. Exact options vary by product category and are confirmed during pre-production review."
    },
    {
        "question": "How do you protect fragile or premium items during transit and handling?",
        "answer": "Fragile and high-value products are secured with reinforced inner sleeves, shock-absorbing inserts, tamper-resistant secondary packaging, and multi-stage quality checks. We also verify condition before dispatch to reduce transit-related disruption and replacement cycles."
    },
    {
        "question": "Are gift cards and digital gifting solutions available as part of curated campaigns?",
        "answer": "Yes, multi-brand gift cards and digital reward solutions can be incorporated into wider campaigns, hybrid programs, and urgent deployments where physical dispatch is less suitable, while still maintaining a premium experience for recipients."
    },
    {
        "question": "Can multiple gift tiers be designed for different employee segments?",
        "answer": "Yes. We regularly structure tiered gifting frameworks for cohorts based on seniority, department, location, and budget. Each tier can carry distinct products while retaining a unified design and brand language across the overall program."
    },
    {
        "question": "How is current availability of artisanal or seasonal inventory managed?",
        "answer": "Most products remain in stock throughout the year, while artisanal, limited-run, or seasonal items may fluctuate. We confirm availability, alternatives, and production timelines before approving any final gift composition to avoid fulfillment delays."
    },
    {
        "question": "How do you handle client-supplied merchandise within carefully curated gift boxes?",
        "answer": "We can integrate employer-branded merchandise, letters, printed materials, and event collateral into curated boxes during the final assembly stage, ensuring secure placement, aesthetic consistency, and pristine presentation at delivery."
    }
];
export const pricingFaqs: FaqItem[] = [
    {
        "question": "Are there any onboarding fees, platform charges, or hidden costs in pricing structures?",
        "answer": "No. Pricing is transparent and directly tied to the products, services, packaging, and logistics agreed for each program. There are no standard onboarding, platform, or undisclosed kitting charges added separately."
    },
    {
        "question": "How does billing work for custom and multi-event gifting campaigns?",
        "answer": "Clients receive detailed pre-campaign estimates followed by milestone-based billing aligned to sourcing, production, and dispatch phases. Every invoice is GST-compliant and structured to support procurement reconciliation and approval workflows."
    },
    {
        "question": "Can multiple service tiers and campaign phases be combined within a single commercial arrangement?",
        "answer": "Yes. Organisations can combine gifting tiers across onboarding, milestones, festivals, leadership programs, and category rewards. Commercial terms can be aligned into a single master agreement or structured across distinct budget allocations as required."
    },
    {
        "question": "Do enterprise teams receive custom pricing or negotiated agreements?",
        "answer": "Yes. Enterprise engagements qualify for tailored commercial proposals based on volume, frequency, service scope, and distribution complexity. Multi-cycle partnerships typically receive custom commercial terms reflecting operational efficiency and procurement requirements."
    },
    {
        "question": "How are shipping, freight, and delivery charges calculated and disclosed?",
        "answer": "Shipping costs are determined by volumetric weight, packaging profile, declared value, and destination. Every component is shared transparently in advance so procurement teams can validate total campaign costs."
    },
    {
        "question": "Are purchase orders, advances, and milestone payments supported for enterprise purchasing?",
        "answer": "Yes. Procurement teams can utilise purchase orders, advance payments, staged approvals, and milestone-linked releases, ensuring internal financial controls remain intact throughout commercial execution."
    },
    {
        "question": "Can invoices be consolidated across departments, regions, or simultaneous dispatch programs?",
        "answer": "Yes. Billing can be consolidated into a single enterprise invoice or segmented by department, location, campaign, and event. This flexibility supports complex reporting and cost-centre allocation requirements."
    },
    {
        "question": "How are charges for custom packaging materials and premium finishes handled?",
        "answer": "Custom packaging and premium finishes are scoped as additions and quoted transparently before approval. Standard kitting remains included, and only specialised materials or finishes attract incremental cost."
    },
    {
        "question": "What replacement and credit mechanisms are available for damaged or misaddressed deliveries?",
        "answer": "Replacement and credit remedies are defined by agreed SLA terms and supported by courier evidence, delivery records, and quality documentation. This ensures fair, auditable commercial resolution."
    },
    {
        "question": "Can agreed pricing be locked across annual or multi-event gifting cycles?",
        "answer": "Yes. Long-term contracts can include fixed pricing across approved programs, providing budget predictability, invoice consistency, and reduced renewal complexity across the year."
    },
    {
        "question": "Is budget-based curation available to meet defined per-recipient spend limits?",
        "answer": "Yes. We routinely engineer premium gifting propositions within agreed budget bands. Procurement teams can allocate target per-recipient values and receive structured options optimised for value and presentation."
    },
    {
        "question": "How are GST and tax treatment managed across invoicing and shipping?",
        "answer": "All invoices are raised in accordance with GST requirements and include applicable tax components, HSN/SAC disclosures, and valid tax documentation. Logistics-related surcharges are separated transparently to support audit and reconciliation."
    }
];

export const aboutFaqs: FaqItem[] = [
    {
        "question": "What is the foundational mission and long-term vision behind Fulfill Nest?",
        "answer": "Fulfill Nest exists to humanise corporate gifting by transforming appreciation into a meaningful cultural practice rather than an administrative task. The long-term vision is to build gifting programs that strengthen workplace belonging, recognition, and emotional connectivity at scale."
    },
    {
        "question": "How do company values influence the standards of sourcing and curation?",
        "answer": "Our values mandate precise sourcing criteria, ethical assessment, and presentation standards that prioritise quality, recipient delight, and responsible production. Every supplier relationship and product inclusion is evaluated for alignment with these principles."
    },
    {
        "question": "What quality, ethical, and sourcing commitments guide vendor relationships?",
        "answer": "Vendors are assessed for safety, durability, material integrity, consistency, and ethical conduct. Product selections must meet our quality thresholds and reflect acceptable sourcing standards, ensuring brand consistency and recipient confidence."
    },
    {
        "question": "What sustainability and environmental commitments shape your operational practices?",
        "answer": "Sustainability is addressed through responsible packaging choices, waste reduction, recycling-preferred materials, and long-term reduction of single-use components. We collaborate with partners that support environmentally aware production wherever possible without compromising presentation."
    },
    {
        "question": "What expertise and experience define the Fulfill Nest team?",
        "answer": "The team combines expertise in sourcing, product quality assessment, packaging, logistics, and employee experience design, enabling us to deliver sophisticated gifting programs across multiple industries and enterprise scales."
    },
    {
        "question": "What does a long-term strategic partnership with Fulfill Nest entail?",
        "answer": "Partnerships are governed by collaborative planning, dedicated account support, volume consideration, scheduled program reviews, and proactive recommendations. The objective is to evolve gifting strategy as the organisation grows and recognition goals change."
    },
    {
        "question": "What makes Fulfill Nest materially different from conventional gifting vendors?",
        "answer": "We integrate design-led curation with operational reliability. Rather than treating gifting as a transactional event, we deliver a coordinated experience covering sourcing, packaging, distribution, tracking, reporting, and support through a single accountable relationship."
    },
    {
        "question": "What types of organisations and industries are best suited to this model?",
        "answer": "We serve fast-growing startups, mid-market organisations, and enterprises across sectors including technology, financial services, consulting, retail, and manufacturing. The common requirement is a commitment to intentional employee and partner recognition."
    },
    {
        "question": "How are corporate gifting experiences made personal rather than generic?",
        "answer": "Programs are developed from organisational identity, occasion context, recipient cohorts, and communication style. We combine these inputs with curation expertise, personalisation choices, custom packaging, and controlled execution for a distinctive brand experience."
    },
    {
        "question": "What values guide operational execution and customer engagement?",
        "answer": "Intentionality, craftsmanship, transparency, care, and accountability guide all operational decisions. These principles are embedded into assembly, documentation, communication, packaging, logistics, and post-fulfilment review."
    },
    {
        "question": "How are recurring large-scale programs delivered without reducing quality?",
        "answer": "Scalable programs rely on inventory governance, standardised workflows, in-house assembly, batch tracking, predefined quality checkpoints, and periodic replenishment analysis to preserve quality across high volumes."
    },
    {
        "question": "What is your long-term mission and how is it measured?",
        "answer": "Our mission is to strengthen workplace culture through meaningful appreciation. Effectiveness is measured through program consistency, recipient feedback, relationship continuity, and the ability of gifting to support recognition objectives at enterprise scale."
    }
];
