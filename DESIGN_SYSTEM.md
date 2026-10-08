# Fulfill Nest — Design System
## "Modern Editorial Warmth"

A premium, emotionally intelligent design system for corporate rewards, gifting & employee recognition. Built at the intersection of **Apple Store calm + Muji warmth + enterprise trust**.

## Current implementation contract

The live site uses the homepage as the visual source of truth. The shared child-hero and section cadence are intentionally explicit:

- **Hero canvas:** `#F7F4EB` on `/` and every inner route, including legal and 404 pages.
- **Light surfaces:** `#FFFFFF` and `#FAF8F3`, separated by `1px` `rgba(28, 25, 23, 0.08)` hairlines.
- **Statement surface:** deep forest `#36433B` with warm white `#F7F4EB` text.
- **Shared card radius:** `20px` (`1.25rem`); feature panels may use `24px` (`1.5rem`).
- **Primary conversion actions:** brick-red gradient `#A83B24 → #C84B31`, white text, pill shape, and a warm glow on hover.
- **Child heroes:** uppercase green eyebrow pill, Albert Sans display + Playfair italic accent, `clamp(2.5rem, 5vw, 4rem)` H1, warm body copy, generous top space, and one quiet visual sibling rather than multiple floating objects.
- **Section rhythm:** `clamp(5rem, 8vw, 6rem)` vertical padding, alternating light surfaces with forest statement bands.

The legacy palette and component notes below remain useful background, but the contract above governs implementation.

---

## 1. Brand Personality

| Pillar | Meaning in Design |
|---|---|
| Warm Professionalism | Polished grids, clear hierarchy, but never cold or sterile |
| Modern Premium | Restrained color, confident typography, high-end presentation |
| Human-Centric Delight | Warm neutrals, tactile textures, imagery of real people and real moments, soft motion |

**Emotional targets:** Assured & Trusting · Inspired · Delighted · Confident · Emotionally Connected.

**Creative direction — "Modern Editorial Warmth":**
- Editorial clarity: clean 12-col grids, bold serif headlines, structured sections
- Warm & tactile: paper-grain textures, soft radial glows, lifestyle photography
- Premium minimalism: lots of breathing room, single hero accent color, hairline borders
- Signature move: the abstract **gift-ribbon stroke** — never literal ribbons, only a flowing curved line used as dividers, underline swashes, and CTA flourishes

**Design principles:**
1. **The gift is the hero.** Products and recipients in frame; chrome recedes.
2. **Restraint reads premium.** One accent color per screen moment — warm terracotta for conversion, brand sage for trust.
3. **Soft surfaces, sharp typography.** Warm backgrounds contrast with confident serif type.
4. **Trust is designed, not claimed.** Fulfilment guarantees, certifications, and client logos are given visible, structured space.

---

## 2. Color System

### 2.1 Palette & Ratio (60 / 30 / 10)

| Ratio | Role | Colors |
|---|---|---|
| 60% | Soft neutral base | Mist Cream `#FAF8F5`, Warm Grey `#F5F5F3`, Linen `#EFECE7` |
| 30% | Deep slate anchors | Charcoal `#2E2E32`, Deep Ink `#232326` |
| 10% | Dual accents | Terracotta `#C46A4A` + Copper `#C2410C` (primary, conversion), Brand Sage `#316849`/`#25553D` (secondary, trust), Amber Gold `#D9A441` (celebration only) |

### 2.2 Recommended Signature Accent

**Primary accent: Terracotta Clay `#C46A4A`** (with burnt-copper `#C2410C` for deep vector glows) — the *conversion* workhorse: eyebrows, `em` emphasis words, primary/accent CTAs, links, and the warm "bricky" aura. It delivers emotional richness + warmth, is rare in corporate B2B, and pairs superbly with warm greys and charcoal.

**Secondary accent: Brand Sage `#316849`** (deep sage `#25553D` for AA text on cream) — the *trust* workhorse: success metrics & count-ups, checkmarks, micro-badges ("99% on-time", "Best-seller", compliance tags), hover & active states, active tab/pill indicators, and soft ambient glows. It balances the bricky red and reads as premium, assured, logistical competence.

**Celebration accent: Amber Gold `#D9A441`** — reserved (≤3% of any screen) for celebration moments only: star ratings, festive highlights, gift-ribbon strokes.

### 2.3 Full Token Set

```css
:root {
  /* Neutrals (warm-tinted) */
  --color-mist:        #FAF8F5;   /* warm cream canvas — page background */
  --color-warm-grey:   #F5F5F3;   /* alternate sections, cards */
  --color-linen:       #EFECE7;   /* emphasis surfaces, hover */
  --color-sand:        #E8E3DB;   /* borders, dividers */
  --color-stone:       #B8B2A7;   /* disabled, placeholder */
  --color-taupe:       #857E72;   /* muted body text */
  --color-walnut:      #4E4A43;   /* secondary text */

  /* Charcoal (premium depth) */
  --color-charcoal:    #2E2E32;   /* headings, footer, primary button */
  --color-ink:         #232326;   /* darkest surfaces */
  --color-charcoal-80: #4B4B50;
  --color-charcoal-60: #717177;

  /* Primary accent — Terracotta / Copper */
  --accent-50:         #FBF1EB;
  --accent-100:        #F5E4DB;   /* tint wash, badges, focus rings */
  --accent-500:        #CE7C5D;
  --accent-600:        #C46A4A;   /* primary accent, key CTA */
  --accent-700:        #A95538;   /* hover */
  --copper:            #C2410C;   /* burnt copper — vector glow accents */
  --accent-gradient:   linear-gradient(135deg, #C46A4A 0%, #D9A441 100%);

  /* Secondary accent — Brand Sage (trust/success — full 50→950 scale).
     Recalibrated for a 20% relative saturation lift and 10% lower lightness. */
  --brand-green-50:    #D0E6D7;
  --brand-green-100:   #BCDDC9;
  --brand-green-200:   #9FCCB3;
  --brand-green-300:   #78B495;
  --brand-green-400:   #539272;
  --brand-green-500:   #3A785A;
  --brand-green-600:   #316849;   /* core brand green */
  --brand-green-700:   #25553D;   /* deep sage — AA text on cream */
  --brand-green-800:   #204531;
  --brand-green-900:   #193A29;
  --brand-green-950:   #0D2418;   /* deepest tint — ambient glows */

  /* Celebration — Amber Gold (sparingly) */
  --gold-500:          #D9A441;
  --gold-100:          #F7EBC9;

  /* Functional (muted, on-brand) */
  --success:           #25553D;   /* aligned to brand sage */
  --info:              #5C7285;
  --warning:           #C9962D;
  --error:             #B4553F;

  /* Glow surfaces (background-image tokens) */
  --hero-glow:         radial-gradient(ellipse 70% 55% at 50% 0%, rgb(196 106 74 / 0.07), transparent 65%);
  --green-glow:        radial-gradient(ellipse 70% 55% at 50% 0%, color-mix(in srgb, var(--color-brand-green-700) 7%, transparent), transparent 65%);
  --cta-glow:          radial-gradient(ellipse 120% 90% at 50% 120%, rgb(217 164 65 / 0.16), transparent 60%);

  /* Surfaces (dark sections) */
  --surface-dark-bg:   #2E2E32;
  --surface-dark-line: rgba(255,255,255,0.12);
  --surface-dark-text: #EDEAE4;
}
```

### 2.4 Usage Rules
- **Buttons:** Primary & accent CTAs = terra-cotta→copper gradient (`#D9532F → #C2410C`, hover `#C2410C → #9A3412`), white text. The hero consultation CTA uses solid rust `#C85A32`; header consultation CTAs use a transparent charcoal outline. Secondary = crisp `#1A1A1A` outline with a linen hover. Gold = celebration only.
- **Links & emphasis text:** terracotta. Never use terracotta for long body copy.
- **Green = trust & success:** success metrics/count-ups, checkmarks, micro-badges, hover & active states, active tab/pill indicators, ambient glows. Resting icon chips stay warm terracotta; hover fills flip to brand sage.
- **Section pre-headers (eyebrows):** rendered as a brand-green micro-pill — `bg-brand-green-50 border border-brand-green-200/60 text-brand-green-800` on light, `bg-brand-green-950/40 border-brand-green-700/50 text-brand-green-300` on dark. Hero eyebrows (inside the headline block) stay terracotta.
- **Gold = celebration only:** star ratings, festive highlights, ribbon strokes. Never for trust/success messaging.
- **Dark surfaces:** deep slate for footer and trust bands; text is warm off-white `#EDEAE4`. Trust checks inside dark bands use `brand-green-400` (sage on slate).
- **Accent backgrounds:** terracotta tint `#F5E4DB` behind stats or quote blocks, never full saturation.
- **Hero glow:** radial gradient, terracotta at 4–6% opacity, positioned behind the product collage; a matching **sage glow** (`green-glow`) may be layered for balance.
- **Contrast:** body text AA 4.5:1, large text 3:1. Taupe `#857E72` only for disabled/placeholder. Brand-sage-700 `#25553D` on cream ≈ 8.1:1; brand-green-600 `#316849` on white ≈ 6.5:1.

---

## 3. Typography System

### 3.1 Stack
| Role | Family | Weights | Notes |
|---|---|---|---|
| Primary (headings) | **Playfair Display** | 500, 600, 500+italic | Editorial, high-contrast serif. Use italic for one emotional word per headline ("*delivered* with care"). |
| Secondary (body/UI) | **Inter** | 400, 500, 600, 700 | Clean, readable, corporate-clear. |
| Accent (numbers/stats/UI labels) | **Space Grotesk** | 400, 500, 700 | Geometric; for points, metrics, prices, filter counts. Tabular numerals. |

### 3.2 Type Scale (desktop / mobile)

```
Display XL   64 / 72   clamp(44px, 6vw, 64px)   Playfair 600    hero headlines
Display      48 / 56   clamp(36px, 4.5vw, 48px) Playfair 600    section headlines
H1           40 / 48   Playfair 600
H2           32 / 40   Playfair 600
H3           24 / 32   Playfair 600
H4           20 / 28   Playfair 500
Body Large   18 / 28   Inter 400
Body         16 / 26   Inter 400
Body Small   14 / 22   Inter 400
Caption      12 / 18   Inter 500, uppercase, letter-spacing 0.08em
Eyebrow      12 / 16   Inter 600, uppercase, letter-spacing 0.14em, brand-green pill
Stat/Number  40 / 44   Space Grotesk 700
```

### 3.3 Hierarchy Rules
- **Eyebrow labels** introduce every section as a small brand-green pill (terracotta only inside hero headline blocks).
- One serif display headline per section; no size stacking.
- Body copy max-width **~70ch** (or ~640px) — editorial readability.
- Serif = emotion and story. Sans = function and navigation. Space Grotesk = numbers and neat UI moments.
- No all-caps in body; uppercase reserved for eyebrows, tags, buttons, footer headings.

---

## 4. Spacing, Grid & Rhythm

### 4.1 Base Unit & Scale
**4px base (8px rhythm for layout).**

```
space-1: 4       space-2: 8      space-3: 12
space-4: 16      space-6: 24     space-8: 32
space-12: 48     space-16: 64    space-24: 96
space-32: 128    space-40: 160
```

### 4.2 Grid
- 12-column responsive grid; max container **1280px**; gutters 24px (desktop) / 16px (mobile).
- Section vertical padding: **96–128px desktop**, **56–64px mobile**.
- Asymmetric editorial splits: `7/5`, `5/7`, `2/3 + 1/3`, occasionally a centered `8/12` narrative column.
- Full-bleed imagery snaps to the viewport edge; content never strays past the container.

### 4.3 Editorial Rhythm
- Alternate wide and narrow sections to build scroll rhythm.
- Every 3rd–4th section: a full-bleed image or dark "trust" band to reset the eye.
- Generous whitespace: hero = **60%+ negative space**.
- Slow, smooth reveal animations paced to 400–600ms.

---

## 5. Textures, Borders, Shadows & Details

### 5.1 Textures (subtle is the point)
- **Paper grain:** SVG `feTurbulence` noise at ~2–3% opacity over all neutral backgrounds.
- **Linen weave:** ultra-fine noise on the warm grey section backgrounds.
- **Radial glows:** terracotta or sand at 4–6% opacity behind product cards and quote blocks. A **soft sage glow** (`brand-green-900/10`, blur-3xl, or the `green-glow` token) is used as a secondary ambient to balance warm "bricky" sections — e.g. heroes, CTA bands, and trust sections.

### 5.2 Borders & Radii
- Hairline **1px borders** in `--color-sand` (#E8E3DB) on light; `rgba(255,255,255,0.12)` on dark.
- Radii are *quiet*: cards 6px, buttons pill (999px) or 6px, tags pill, images 4px.
- Accent detail: 1.5–2px terracotta or gold strokes for underline swashes, card top-borders, and quote marks.

### 5.3 Shadow Elevation

```
elev-1 (rest)      0 2px 6px rgba(46, 46, 50, 0.05)
elev-2 (hover)     0 6px 20px rgba(46, 46, 50, 0.09)
elev-3 (modal)     0 16px 48px rgba(35, 35, 38, 0.18)
```

### 5.4 Iconography & Motifs
- Thin-line icons, **1.5px stroke**, rounded caps, charcoal/terracotta only.
- **Gift-ribbon motif:** an abstract flowing S/ribbon curve drawn in SVG — used as hero flourishes, section dividers, CTA underlines, and the favicon/logo mark. Never a literal bow.
- Paper-clip/dot markers: small terracotta dot before list items in "what's included" lists.

---

## 6. Imagery & Product Presentation

- **Photography style:** warm, natural light; neutral/in-studio backdrops; human hands unboxing, packaging, writing gift notes. No stocky, sterile corporate stock.
- **Product crops:** 4:5 (cards), 1:1 (thumbnails); lifestyle 16:9, hero collage mixed 4:5.
- **Cards:** product on `--color-warm-grey` (or white) with generous negative space; hover = gentle zoom (1.02) + lift to elev-2 + subtle accent line appears.
- **People:** real warmth — smiling recipients, HR teams receiving deliveries. Faces cropped close for emotional connection.
- **Fulfilment section:** show clean logistics imagery (packing, quality checks, tracking) to build "assured & trusting".

---

## 7. Motion & Micro-interactions

| Token | Value |
|---|---|
| Base duration | 200–300ms |
| Hero reveal | 500–700ms, staggered |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Scroll reveals | fade + 16px rise, `IntersectionObserver`, stagger children by 60ms |
| Hover | card lift (elev-2), image zoom 1.02, button fill transitions |
| Special | gift-ribbon stroke draws itself on scroll (SVG `stroke-dashoffset`) |
| Reduced motion | all reveals degrade to opacity-only via `prefers-reduced-motion` |

---

## 8. Component Library

### Buttons
- **Primary & accent CTAs (`primary` / `accent`):** soft linear gradient `#D9532F → #C2410C` (warm terra-cotta → burnt copper), white text, `shadow-sm`, pill, `transition-all duration-300`. Hover shifts the gradient to `#C2410C → #9A3412` and lifts the shadow to `shadow-md`.
- **Hero solid CTA (`solidAccent`):** solid rust `#C85A32`, white text, and pill shape; reserved for the dominant hero "Book a consultation" action.
- **Secondary:** crisp 1px `#1A1A1A` border, near-white fill, `#1A1A1A` text, and `shadow-sm`; hover changes the fill to `#EFE8DC` and adds a soft dark drop shadow.
- **Header outline (`outline`):** transparent fill with a 1px `#1A1A1A` border and dark text; hover fills charcoal and switches to white text.
- **Gold (celebration only):** warm amber gradient `#E3B65C → gold-500`, charcoal text; hover deepens to `gold-500 → #C08A25`.
- **Ghost/text link:** terracotta text + animated underline (ribbon stroke).

### Cards
- **Product card:** image top, padding 24px, title serif, Space Grotesk price/budget tag, "Curated gift set" pill tag, hairline border, elev-1 → elev-2 on hover.
- **Value card ("Why Fulfill Nest"):** icon top (thin-line), serif H3, body small, 1.5px terracotta top stroke on hover.
- **Testimonial card:** oversized serif quote mark in terracotta, serif quote, 5-line star rating (thin), person + role, client logo grayscale.

### Tags, Badges, Filters
- Pills: uppercase 12px, Space Grotesk numbers where relevant (e.g., `24 curated sets`).
- Trust/success micro-badges (e.g. "99% on-time", "Best-seller", compliance tags): brand sage tint (`brand-green-100/50`, `text-brand-green-800`) with a `brand-green-700` dot.
- Filter bar (catalog): pill toggles with counts in Space Grotesk; active pill = brand green fill (`bg-brand-green-700 text-mist`).

### Forms & Inputs
- 1px `--color-sand` border, 12px radius, white fill; focus ring = 2px terracotta offset 2px.
- Labels uppercase caption; helper text taupe; error text + error border terracotta-red.
- Touch targets ≥ 44px.

### Navigation
- Floating centered pill: `max-width: 1100px`, `border-radius: 9999px`, hero-matched `rgba(250,248,245,0.85)` + `backdrop-filter: blur(12px)`, and `0 10px 30px rgba(0,0,0,0.08)`.
- Scroll physics: `top: 36px` at rest → `12px` after 150px of scrolling → `translateY(-120%)` beyond 900px while scrolling down → `translateY(0)` after a deliberate 50px upward movement. Once lifted, the pill stays at `12px` until the page returns above 40px. Transform uses a 700ms premium ease and top uses 600ms with the same curve.
- Logo = ribbon-motif mark + "Fulfill Nest" in Playfair 600.

### Footer (deep slate)
- 4 columns: **About / Solutions / Support / Contact** (uppercase captions in gold, links in warm off-white).
- Trust row: certifications, fulfilment guarantee, security badges.
- Social icons (thin-line), bottom hairline, "Made with care" tagline in italic serif.

---

## 9. Page/Section Layout Blueprints

### 9.1 Home
```
01 Floating pill nav (hero-tinted blur glass; hides/reveals with scroll)
02 HERO — Editorial + Premium
   Eyebrow: CORPORATE REWARDS, GIFTING & RECOGNITION
   Headline (Playfair, 64): “Thoughtful rewards. Delivered with care.”
   Subhead (18px, taupe): “Premium corporate gifting & employee recognition
   solutions — curated with intention, fulfilled with precision.”
   CTA: [Book a Consultation] (solid terracotta)  [Explore Corporate Gifting] (dark outline)
   Visual: 3-card curated collage (4:5) with radial glow + ribbon stroke
   Trust micro-row: “Trusted by 200+ HR & CXO teams” + rating
03 Client logo strip (grayscale, 40% opacity; full-color hover)
04 Value props — asymmetric 5/7: Left personal story? Right: 3 value cards
   (Reliability · Curation · Delight)
05 Product showcase — premium catalog
   Filters: Category | Occasion | Budget (pill toggles with counts)
   Cards: 4 cols desktop / 2 tablet / 1–2 mobile
   CTA: “See all curated sets”
06 How it works — 4 steps (right/left alternating, numbers in Space Grotesk)
07 Dark trust band (deep slate): fulfilment stats, guarantees, certifications
08 Testimonials — 2×2 editorial grid (accent-stroked cards, client logos)
09 CTA band — warm gradient (terracotta glow): “Let’s build a reward program
   your people will remember.” [Book a consultation]
10 Footer (deep slate, 4 col)
```

### 9.2 Sub-pages (consistent shell)
- **Corporate Gifting:** hero → category pills → catalog → bulk/enterprise band → testimonial → consultation CTA.
- **Solutions:** offering blocks (Employee Rewards / Festive Gifting / Channel Incentives / Milestone & Recognition), alternating asymmetric rows, each with its own accent number stats.
- **About Us:** asymmetric split — story left, fulfilment/craft imagery right; values grid; leadership; certifications.
- **Contact:** split card — booking form (Left) + what happens next 3-step (Right), with "Response within 24h" trust note.

---

## 10. Voice & Tone

- **Tone:** warm-professional. Speak like a trusted human partner, not a catalog.
- **Words we use:** curated, thoughtful, delivered with care, recognized, celebrated, seamless, enterprise-grade, human-first.
- **Words we avoid:** "solutions at scale", "optimize engagement", "unlock rewards", jargon, exclamation-heavy sales-y copy, cold transactional lists.
- **Headline pattern:** emotional serif statement + functional sans explanation.
  - "Every gift has a story. We make it unforgettable."

---

## 11. Accessibility & Enterprise Trust

- WCAG 2.1 AA: body 4.5:1, large text 3:1; focus rings visible (terracotta, 2px, offset).
- Semantic landmarks, descriptive alt text, aria states for filters/toggles.
- Motion: `prefers-reduced-motion` respected (opacity-only).
- Trust signals: delivery-time guarantees, client logos, case-study metrics, security/privacy badges, certification strips — each rendered with real structure, not decoration.
- Typography: fluid `clamp()` scaling, no layout shift on font load (system fallbacks = sans-serif stack).

---

## 12. Implementation Tokens (Tailwind v4 — CSS-first)

> Tailwind CSS v4 has **no `tailwind.config.js`** here — tokens live in the
> `@theme` block of `app/globals.css`. The block below is the JS-extend
> equivalent (`colors.brand.green` ↔ `--color-brand-green-*`).

```js
/* @theme in app/globals.css — JS-extend equivalent */
colors: {
  mist:    '#FAF8F5',
  warmgrey:'#F5F5F3',
  linen:   '#EFECE7',
  sand:    '#E8E3DB',
  stone:   '#B8B2A7',
  taupe:   '#857E72',
  walnut:  '#4E4A43',
  charcoal:'#2E2E32',
  ink:     '#232326',
  accent:  { 50:'#FBF1EB', 100:'#F5E4DB', 500:'#CE7C5D', 600:'#C46A4A', 700:'#A95538' },
  copper:  '#C2410C',
  'brand-green': {
    50:'#D0E6D7', 100:'#BCDDC9', 200:'#9FCCB3', 300:'#78B495',
    400:'#539272', 500:'#3A785A', 600:'#316849', 700:'#25553D',
    800:'#204531', 900:'#193A29', 950:'#0D2418',
  },
  gold:    { 100:'#F7EBC9', 500:'#D9A441' },
  darktext:'#EDEAE4',
  success: '#25553D',
},
backgroundImage: {
  'hero-glow':  'radial-gradient(ellipse 70% 55% at 50% 0%, rgb(196 106 74 / 0.07), transparent 65%)',
  'green-glow': 'radial-gradient(ellipse 70% 55% at 50% 0%, color-mix(in srgb, var(--color-brand-green-700) 7%, transparent), transparent 65%)',
  'cta-glow':   'radial-gradient(ellipse 120% 90% at 50% 120%, rgb(217 164 65 / 0.16), transparent 60%)',
},
fontFamily: {
  display: ['"Albert Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  sans:    ['Inter','system-ui','sans-serif'],
  serif:   ['"Playfair Display"', 'Georgia', 'serif'],
  mono:    ['"Space Grotesk"','monospace'],
},
borderRadius: { hairline:'0px', card:'6px', pill:'999px' },
boxShadow: {
  'elev-1':'0 2px 6px rgba(46,46,50,0.05)',
  'elev-2':'0 6px 20px rgba(46,46,50,0.09)',
  'elev-3':'0 16px 48px rgba(35,35,38,0.18)',
},
```