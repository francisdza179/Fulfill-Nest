"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* ==========================================================================
   ABOUT — editorial narrative: a 7-track reading column beside a 5-track
   rail of three numbered foundation points.

   WHAT CHANGED IN THE MOST RECENT PASS
   0. The three foundation icons are no longer the shared static exports. They
      are now bespoke local components with one-shot SVG motion, so this
      section is the first on the site with animated iconography. Everything
      moving is a `@keyframes` rule in `app/globals.css`; there is no library,
      no state and no `"use client"` here. Full reasoning in the mark block
      below.
   1. The layout went back to a 12-track two-column split after one pass as a
      single centred column: narrative on 7 tracks, the three pillars on 5,
      stacked vertically inside a 2px left rule instead of side by side in a
      three-column grid.
   2. The heading was replaced. It read "Gifting is emotion. We built the
      logistics to protect it" and now reads "Re-imagining corporate gifting",
      with the last word accented. See the note on that below — the words
      themselves argue with paragraph two, and were specified, so they were
      applied.
   3. The pillars are numbered 01, 02, 03.
   4. The per-pillar top hairline was dropped, because the rail now separates
      them. Measured reasoning is in the const block above the pillar styles.
   5. The paragraph gap went from a 6-step flex gap to a 5-step space stack,
      24px to 20px.
   6. Paragraph size is now 16px below the md breakpoint and 18px above,
      stepping out of the flat 18px body token the section used before.
7. The rail is vertically centred against the narrative instead of
      top-aligned, so the two columns read as one band rather than two
      blocks that both happen to start at the same y.

   ── THE ICON ANIMATION, AND WHY THERE IS NO LIBRARY ────────────────────────
   Specified: animated micro-interactions on the three foundation icons,
   triggered on scroll, Framer Motion or Lottie, honouring
   `prefers-reduced-motion`. Delivered: all three concepts, on scroll,
   honouring reduced motion — by a different mechanism.

   framer-motion is not unavailable. It is a declared dependency at ^13.4.2
   and it is genuinely imported by `sections/BudgetCalculator.tsx` and
   `sections/RotatingCubeText.tsx`. It was still declined here because
   `sections/AutomationFlow.tsx` line 85 governs a section exactly like this
   one and says so in as many words:

       "PURE CSS AND SVG, no library. There is no framer-motion here (none is
        permitted in-section) and `lucide-react` is still not a dependency, so
        the glyphs are the house set in `components/ui/Icons.tsx` and
        everything moving is a `@keyframes` rule in `app/globals.css`."

   Lottie is further away still: neither `@dotlottie/react-player` nor
   `@lottiefiles/dotlottie-react` is a dependency, neither is in
   `node_modules`, and there is no animation JSON anywhere in the repo. Either
   would have meant new packages, new binary assets shipped to the client, and
   a client component wrapping three 24px decorative glyphs.

   ── THE TRIGGER COST NOTHING, WHICH IS THE REAL ARGUMENT ───────────────────
   The rail already carries `data-reveal-stagger`, and `RevealOnScroll` already
   adds `.is-revealed` to each of the three pillars as they arrive. So the
   motion is descendant-keyed off that class in `globals.css` and fires on the
   same frame as the entrance that reveals it, once, with the same
   unobserve-then-forget semantics. No second observer, no new hook, no state,
   no client boundary.

   The practical win is that these three marks render identically with
   scripting disabled. A `whileInView` wrapper would have made three
   decorative marks unrenderable without JS in order to read four paragraphs.

   ── THE THREE CONCEPTS, MAPPED BY MEANING NOT BY INDEX ──────────────────────
   Specified order: gift box that opens, truck on an animating dashed road,
   wand/hands with a sparkle pop. On screen the pillars are curation,
   presentation, logistics — so the brief's truck points at position two and
   its hand-picked sparkle at position three, while the pillar those actually
   describe is position one. A lorry on "Editorial Presentation" would be
   plainly wrong, so:

       01 Human-Centric Curation  <-  sparkle pop     (specified as point 3)
       02 Editorial Presentation   <-  lid unclasps    (specified as point 1)
       03 Effortless Logistics     <-  road and truck  (specified as point 2)

   Every concept is delivered; only the numbering moved. The specified
   alternative of a "gentle floating" mark was declined — a float is a loop,
   and a permanently looping mark in the corner of a reading column is exactly
   what the reduced-motion rule should not have to defend.

   ── EVERY KEYFRAME RETURNS TO REST, AND THAT IS LOAD-BEARING ────────────────
   All four animations are `rest -> peak -> rest`, not `rest -> open end state`.
   The resting appearance has to be correct with the animation not running, and
   three common cases depend on it: scripting disabled (no `.is-revealed` is
   ever added), reduced motion (cancelled outright in `globals.css`), and print.
   An open-ended lid would render permanently open in all three, and the gift
   box would only look like a gift box for the second before it settled.

   ── THE SPARKLE PUTS BACK SOMETHING AN EARLIER PASS DELIBERATELY AVOIDED ────
   Worth stating plainly, because it contradicts a note further down this file.
   The static-icon pass chose these three glyphs specifically because `beliefs`,
   built from the same data, already uses sparkle, shield and heart — and
   avoided sparkle here precisely to avoid a repeat. Point 01 now carries a
   four-point sparkle, because that is what was asked for.

   It is a weaker collision than the one that note warned about, not a false
   one: `beliefs`' second item is a sparkle as its entire glyph, in the same
   position in a three-item list; this is one 2.2-unit sparkle in empty space
   beside a person-and-check, in a different band, and only on screen for about
   a second. But it is the same shape in the same slot, and if it reads as an
   echo in place, the alternative is to animate the check's own draw — a
   `stroke-dashoffset` sweep on `m14.5 17 2.5 2.5 5-5` — which is a much less
   obvious effect and was not what was asked for.

   ── THE ICON MARKUP IS UNCHANGED IN SIZE, AND THAT MAY BE TOO SUBTLE ────────
   The marks stay at the house icon size, so nothing about the rail's layout
   or the icons' alignment moves. The consequence is that the motion is small
   in absolute terms: the lid lifts 2.4px on a 24px box and the truck travels
   2.1px, about 8.75% of its width. Those are the smallest displacements that
   still read as movement rather than as a repaint, but on a mark this small
   they will be felt more than they are watched. Stepping `PILLAR_ICON` up one
   size in each axis would buy 33% more travel for 8px of extra icon height,
   if it turns out too quiet. Not done unasked — and named here in words
   rather than as a class string, because Tailwind scans raw source text and
   would compile that pair into the stylesheet on the strength of a comment.

   ── THE HEADING IS ACCENTED ON THE SUBJECT, AND NOTHING NEW WAS INVENTED ─────
   The heading sets as: "Re-imagining corporate" + italic red "gifting".

   "Gifting" carries the house `accent-em` utility, which is the same single
   class the other four headings on this page use. It was worth checking what
   that utility actually paints before reaching for anything else, because it
   turned out to be exactly the treatment asked for already:

       font-style: italic
       font-weight: 500
       font-family: inherit
       color: var(--color-brand-primary)

   and `--color-brand-primary` is `#a83b24` — the SAME value as
   `--color-brick-red`. So the house accent utility is already red and already
   italic, and a new variant class or a hand-rolled `italic font-medium
   text-brick-red` at this call site would both have been wrong. `globals.css`
   states the rule in as many words: the accent word is one class, never a
   hand-rolled set of properties at a call site.

   Contrast on this section's white surface: `#a83b24` on white is 6.33:1,
   against the charcoal heading's 17.74:1. Comfortably past AA for body text
   and far past the 3:1 that display size needs.

   This also closes the flag raised when the heading first went in flat, which
   is that it was the only h2 on the page with no accented phrase. It is not
   any more. The subject was accented rather than the verb ("Re-imagining"),
   which was one of the two options offered and the better one here: the verb
   is already carried by the second paragraph's "re-imagine", so accenting it
   would have put the same emphasis on the word twice.

   ── THE HEADING STILL REPEATS THE SECOND PARAGRAPH ──────────────────────────
   This is unchanged by the accent and is a content problem, not a styling one.
   Paragraph two opens:

       "We founded Fulfill Nest to RE-IMAGE gifting as a modern cultural
        touchpoint."

   and the heading over it is now "Re-imagining corporate gifting". The same
   idea, in the same words, eleven lines apart, with the heading arriving first
   and the paragraph then restating what the reader has just been told. Colouring
   one word does not fix that. The previous heading did not have the problem —
   it made a claim ("gifting is emotion") that none of the four paragraphs
   repeat.

   Applied as specified and flagged rather than changed, because the words are
   the user's. Worth a look before this ships.

   ── THE RAIL IS VERTICALLY CENTRED, NOT TOP-ALIGNED ────────────────────────
   The grid is `items-start`, and the right column overrides that for itself
   with `lg:self-center`, so it sits centred in a row whose height is set by the
   taller narrative column. Scoped to the lg breakpoint because below it there
   is one column and self-alignment has nothing to centre inside.

   The alternative was a top margin, and it was rejected on measurement. The
   offset is not a constant: roughly 85px at a 1280px viewport, where the
   narrative is 615px and the rail 444px, but roughly 124px at the 1024px
   breakpoint, where the narrative grows to about 717px and the rail shrinks to
   about 468px. A fixed number would be wrong at one width or the other, and
   would drift again the next time a paragraph is edited. This is recorded
   because the two numbers together are the reason.

   Note that the "The Foundation" label rides up with the rail rather than
   staying pinned to the section top. Centring the pair is deliberate — a label
   left behind at the top with its list 85px below it would read as two
   separate things.

   ── PILLAR 3 LOST ITS RECIPIENT ───────────────────────────────────────────
   Specified text: "From custom kits to distributed hybrid workforces globally,
   we handle 100% of the fulfillment burden." It replaces:

       "From single custom kits to distributed hybrid workforces across the
        globe, we take 100% of the fulfillment burden OFF HR AND CULTURE
        TEAMS."

   "Off HR and culture teams" was the point of the sentence — it said who the
   burden lands on, which is the whole reason an HR reader cares. As specified
   the clause says only that the burden is handled, by us, for anyone. It is a
   shorter sentence that promises less. Applied verbatim; noted so the loss is
   a choice and not an accident.

   ── `border-slate-200` -> `border-section-divider`, FOURTH TIME ────────────
   The rail's rule colour is the house hairline token, which is the same value
   as the sand token this file used to spell its pillars with — both are
   rgb(28 25 23 / 0.08) in this theme, so nothing shifts visually. This is also
   not the first time the repo has made this swap: `HowItWorks.tsx` records the
   identical substitution in its own doc block, and line 910 of that file uses
   this precise rail — 2px rule, section-divider tint, 6-step padding, 8-step
   gaps, no per-item rules. This rail is built to that shape.

   A 2px left rule is not a new weight here either: `border-l-2` already has
   six call sites, including `TeamSpotlight` and `LegalDoc`.

   ── `text-slate-600` -> the house body token, FOURTH TIME ─────────────────
   Same substitution as the three previous passes on this section. The house
   neutral is what these four paragraphs already carried.

   ── `text-base md:text-lg` STEPS OUTSIDE THE TYPE SCALE ───────────────────
   The section used the 18px body token, flat, at every width. The
   specification is 16px below the md breakpoint and 18px above it, which is a
   real improvement on a 375px phone — 18px in a 327px measure is about 36
   characters a line, and 16px brings that to about 40 — but it is the only
   paragraph block on the site not on a named size from the scale.

   At the md breakpoint and above this is identical to what it replaced: 18px.
   So the change is confined to small screens and nothing above 768px moves.

   ── `py-16 md:py-24` STILL NOT APPLIED, AND THIS TIME IT IS CORRECT ────────
   Three previous passes asked to "increase" vertical padding and named this
   pair, which cannot increase anything: `py-section` already resolves as
   clamp(5rem, 8vw, 6rem) = 80px below 1000px and 96px above, so the pair is a
   16px mobile reduction and a desktop no-op.

   This brief says "MAINTAIN generous section vertical padding", not increase.
   The token does exactly that, so the token stays and this is no longer a
   judgement call against the instruction — it is the instruction.

   ── A NEW ADJACENCY, AND IT IS WORSE THAN THE OLD ONE ──────────────────────
   The section now ends with a two-column grid at 7/5 and the band below it,
   `ValueProps`, opens with a three-column grid. The previous pass ended on a
   full-width three-column row, which repeated `ValueProps` almost exactly —
   three columns, three columns. This is a different shape rather than the same
   one twice, so that specific complaint is answered.

   What replaces it: the rail's 2px left rule runs the full height of the right
   column and carries three short entries, and `ValueProps` immediately below
   runs a single hairline above three items with a disclosure chevron on each.
   Both are rule-led and both are three-item lists about what the company
   believes. Different geometry, same argument. Five layouts of the
   differentiation section on this page have already been tried and removed;
   that history is recorded in `lib/data.ts` next to the copy it consumed.

   ── THE FOUR PARAGRAPHS ────────────────────────────────────────────────────
   All four are verbatim, including the two em dashes in the fourth, which are
   real em dashes set tight against "lifecycle" and "delivery" with no spaces
   on either side. The two added last pass are also the two most operational
   paragraphs on the page — sourcing and artisans, then lifecycle and scale —
   and they follow the origin story, so the column reads problem, response,
   craft, scale.

   ── WHY THE PILLARS ARE FULL-WIDTH AND NOT BESIDE THE NARRATIVE ─────────────
   The narrative column is 768px, and 768px divided into three columns is about
   229px each. These pillar bodies are 95 to 115 characters, which at 0.875rem
   in a 229px measure sets as six or seven lines. Full width they are about
   370px each and the bodies set as three lines. For reference, when the
   pillars were first placed the narrative column was 686px and the figure was
   195px; narrowing it made the case stronger, not weaker.

   The alternative was a two-column grid with a third pillar orphaned onto a
   second row, which is the asymmetry this file already had once and which
   reads as an accident rather than a rhythm.

   ── TWO SPECIFICATIONS NOT APPLIED VERBATIM ───────────────────────────────
   Paragraph spacing of 5 or 6 steps: the wrapper is a flex column whose gap is
   already 6, so the spacing on offer is the spacing in effect. Adding the
   space-utility form of the same value beside a flex gap would double it to
   48px, because that utility adds a top margin to every child after the first
   and cannot see the gap.

   A 600-step cool grey for the paragraph colour: the house body token is kept,
   which is what these paragraphs already carried. Third time this section's
   briefs have specified a slate and been given the house neutral.

   ── `py-section` WAS NOT REPLACED BY THE TWO SPECIFIED VALUES ──────────────
   Two explicit vertical-padding values were specified, 4rem and then 6rem at
   the md breakpoint. What this section uses is the site's own section token,
   which resolves as:

       clamp(5rem, 8vw, 6rem)   ->   80px below 1000px wide, 96px above

   Measured against the specification: 64px on mobile against this section's
   80px, so the token is 16px MORE generous on the smallest screens, which is
   the opposite of what two static steps would do; identical 96px from 1200px
   up; and 80px rather than 96px in the 768-to-1000px tablet band, which is
   the one place the specification is larger. Net: the token is larger on
   phones, the same on desktop, 16px smaller on tablets, and it keeps this
   section on the same vertical rhythm as every other band instead of being
   the one with its own numbers. Say the word and it becomes 64px / 96px in
   a one-line edit.

   ── REPLACEMENT 1: THE TWO NARRATIVE PARAGRAPHS ────────────────────────────
   The previous pair argued that reward programmes fail when they feel
   transactional, and that Fulfill Nest answered with enterprise discipline.
   The new pair argues that gifting lost its soul and that Fulfill Nest
   re-imaged it as a cultural touchpoint. Same argument, better told: the old
   second paragraph opened with "So we built the other half", which only
   means anything if you have read the first one, and the new one states the
   founding premise outright and stands alone.

   Both new paragraphs are specified copy and are verbatim. The em dash in
   the second pillar's body is a real em dash with no spaces either side of
   it, which is how it was supplied, and it is left that way.

   `leading-relaxed` was specified and was applied — to the two narrative
   paragraphs only, not to the pillar bodies. Worth knowing that it is a
   0.025 change: this token already sets 1.6, and the relaxed step is 1.625.
   It is here because it was asked for, not because it is visible.

   ── REPLACEMENT 2: THE OLD TWO-ITEM GRID IS GONE ───────────────────────────
   It held "Human curation" and "99% on-time". The first is superseded by
   pillar one, which makes the same claim with a longer title and a sentence
   of support — keeping both would put the same idea on screen twice inside
   200px. The second is a metric rather than a pillar, and that claim is
   carried by five other sections already: the hero stats, the flanked hero,
   the second hero variant, the testimonial carousel and the case-study
   teaser. Losing it here loses no number the site stops making.

   `ChatIcon` went with it and its import was removed rather than left
   dangling. The export still has eight call sites elsewhere, so the icon
   itself is untouched.

   ── THE ADJACENCY YOU SHOULD KNOW ABOUT BEFORE APPROVING ───────────────────
   `beliefs` is exactly three items, and the band directly below this one is
   `ValueProps` at its "grid" layout — also three columns, also `gap-x-10`,
   also `font-display` titles over muted body copy. So this section now ends
   with a three-item grid and the next section opens with a three-item grid.

   Four things were done to keep them from reading as one repeated module,
   and they are deliberate rather than incidental:

     this block   three columns of INDIVIDUAL top rules, one per pillar
     ValueGrid    a SINGLE rule above the whole grid, none per item
     this block   titles at 1.25rem, bare icons, static, nothing to click
     ValueGrid    titles at 1.5rem, and a per-item disclosure toggle that
                  opens a further paragraph behind a chevron
     this band    flat white, no texture, no outer rules
     that band    linen texture over a warm grey, with a rule above and below

   The three icons here were also chosen to avoid the three in `beliefs`.
   That band uses sparkle, shield and heart; this one uses a person with a
   check, a box, and a lorry. Same icon, same position, in both bands would
   read as a repeated pattern rather than as two arguments.

   That reasoning is now partly undone, deliberately. The curation mark gained
   a four-point sparkle when it was animated, because a sparkle pop is what
   was specified for it. The glyphs themselves are still a person-and-check, a
   box and a lorry, so the shape argument holds; the ornament on the first one
   now echoes `beliefs`' second item. See the sparkle note near the top of this
   block for how far that goes and what the fallback would be.

   If it still looks repetitive in place, the fix is to move or drop one of
   the two blocks, not to restyle a third time — five layouts of the
   differentiation section have already been tried and removed, and that
   history is recorded in `lib/data.ts` next to the copy it consumed.

   ── HISTORY: THE IMAGE THAT WAS HERE, AND TWO ERRORS ABOUT IT ───────────────
   Kept as a record, because the corrections matter more than the decisions.
   The source was `Our Story feature image.jpg`, 207,682 bytes, 1792 x 1344 —
   exactly 4:3 — copied to `public/our-story-feature.jpg`. The original in
   `Media & Others` was never moved or altered.

   Two notes in this file were wrong while the image was present, and both are
   recorded rather than deleted:

   The `alt` was the specified string "Our Story - Fulfill Nest", which
   replaced a sentence describing the photograph. An alt echoing the filename
   tells a screen reader nothing the filename did not.

   `about-craft.jpg` was not deleted after being swapped out here, because
   `components/testimonials/TestimonialsCarousel.tsx` still renders it. An
   earlier note claimed `sections/AboutHero.tsx` also rendered it and cited two
   consumers; that was wrong — `AboutHero.tsx` only NAMES the file in a comment
   at line 89, explaining why it did not choose it for the hero. One real
   consumer, not two. The count was wrong and the file was still kept, so
   nothing broke either way.

   The whole crop question, the 40% width loss against a 4:5 box, is now moot:
   there is no box and no crop. If the image ever comes back it should come back
   with a 4:3 box, which was the zero-crop option all along.

   ── WHAT DID NOT CHANGE ────────────────────────────────────────────────────
   The one 7xl shell for the whole section, the section's own border, tint,
   section-padding token and `overflow-hidden` clip, the blurred decorative
   wash, the four narrative paragraphs, and the rail's own 24px-to-32px
   responsive padding. The `overflow-hidden` is what clips that wash to the
   section, and there are no sticky descendants here for it to break.

   The pillars are `<h4>` and not `<h3>`. `SectionHeading` renders this
   section's `<h2>` and these titles sit directly beneath it with nothing
   between, so promoting them would change the document outline rather than
   the styling.

   The icons keep `text-accent-700`, the house icon colour. A 1.5px stroke
   needs 3:1 against non-text content and that token clears it on white. That
   stroke is now written out on each local mark — `strokeWidth={1.5}`, round
   caps and joins, `fill="none"`, `stroke="currentColor"` — rather than
   inherited from the `base` object `Icons.tsx` spreads onto its own exports.
   Same four values, and `Icons.tsx` lines 8-9 confirm that is exactly what
   `base` sets.

   THE MAINTENANCE COST OF THAT, STATED PLAINLY. `Icons.tsx` line 60 says "TO
   ADD A GLYPH: extend `base`, not a call site. A per-call-site `fill`,
   `stroke-width` or `stroke` attribute is a deviation." These three marks are
   not call sites inside that file, so the rule does not formally reach them —
   but they now restate `base` by hand, and if `base` ever changes weight or
   caps, these three will silently keep the old values while every other glyph
   on the site moves. That is the price of animating them without touching a
   shared export, and it is a real one: a future change to the house stroke has
   to remember this file. The alternative — extending `base` with an opt-in
   animation slot — would put three decorative, section-local marks into the
   file that every other icon on the site depends on, which is the larger
   cost.

   The soft title hover is `group-hover:text-brick-red`, which is the
   `WhoWeAre` reference's own treatment for these pillars and the one this
   file already used. It is a colour shift, not a lift, so it implies
   emphasis rather than clickability.

   ── REVEAL CADENCE ─────────────────────────────────────────────────────────
      eyebrow, title      `SectionHeading` carries its own header marker
      paragraphs 1-4      `data-reveal-stagger` on the paragraph stack
      pillars 1, 2, 3     `data-reveal-stagger` on the rail
      icon marks 1, 2, 3  no marker of their own — keyed off the rail's

   Three markers on three different subtrees, so nothing carries two. The four
   paragraphs are staggered because a run of them arriving together reads as a
   block rather than as a sequence; the three pillars are staggered because
   they are a set being enumerated. No marker step, offset or threshold
   override is declared, so all four default.

   The rail's marker sits on the rail, not on "The Foundation" above it, so the
   label arrives with the heading's own reveal and is not left stranded while
   the list it introduces is still transparent.

   The icon marks are the fourth thing on that cadence and they declare
   nothing. A pillar already receives `.is-revealed` when it arrives, and each
   mark is a descendant of the pillar, so `.fn-mark .is-revealed .fn-*` in
   `globals.css` picks them up from a marker that already existed. Their
   240-260ms delays are not stagger either — a pillar enters at `opacity: 0`
   over 0.6s behind a 300ms offset, so motion starting at frame zero would
   spend its opening beats under a transparent parent. Each mark waits until
   the pillar is roughly half-faded, and its peak lands in the second half of
   the entrance.
   ========================================================================== */

/* Complete literal strings, never fragments — Tailwind scans raw source text,
   so a class assembled from parts is invisible to the compiler.

   THE PER-PILLAR HAIRLINE IS GONE, deliberately. This shell used to carry
   `border-t border-sand pt-6` on every pillar, which was load-bearing while the
   three sat side by side in a 370px column where nothing else separated them.
   They are now a vertical stack inside a 2px left rule, so the rule that was
   doing the separating is gone and the 32px gaps between entries do it instead.
   Keeping both would have put three horizontal hairlines inside one vertical
   one, which is rule-on-rule rather than a hierarchy.

   `HowItWorks.tsx` line 910 uses this same rail — a 2px left rule in the
   section-divider tint with a 6-step padding and 8-step gaps, no per-item
   rules — so the stack is built to that shape rather than invented here. That
   file's doc block also records the same substitution this one needed. */

const PILLAR = "group";

const PILLAR_ICON = "mt-0.5 h-6 w-6 shrink-0 text-accent-700";

const PILLAR_TITLE =
  "mt-3 font-display text-xl text-charcoal transition-colors duration-300 ease-in-out group-hover:text-brick-red";

const PILLAR_BODY = "mt-2 text-body-sm text-taupe";

/* ==========================================================================
   THE THREE ANIMATED FOUNDATION MARKS

   Bespoke, section-local, and animated entirely by CSS. No library, no state,
   no hook, no `"use client"` on this file — all three are plain server
   components that render the same markup whether or not JavaScript ever runs.
   The keyframes and the trigger selectors live in `app/globals.css`; the four
   animated parts are `.fn-sparkle`, `.fn-lid`, `.fn-truck` and `.fn-road`.

   ── WHY LOCAL, AND NOT THREE EDITS TO `Icons.tsx` ─────────────────────────
   Because these three exports are shared. Counting real call sites with
   comments stripped, so the mentions in this file's own prose do not inflate
   the number: `UserCheckIcon` is used in 2 other files, `GiftIcon` in 3,
   `TruckIcon` in 5. Putting motion inside those exports would have animated
   every other icon of that shape across the site, in sections with no
   observer watching them, for no reason. These copies cannot reach anything
   else.

   The imports are therefore removed rather than left dangling, which is what
   the previous pass did with `ChatIcon` for the same reason.

   ── THE GLYPHS ARE THE OLD GLYPHS, GROUPED ─────────────────────────────────
   Each mark reuses the existing path data verbatim, so the rail still reads as
   the same icon family as the rest of the site — same 24×24 box, same 1.5
   stroke, same round caps and joins. Only the grouping changed, and only where
   a group is what makes something movable:

     presentation  the old single `rect` held both the lid and the body. It is
                   now the body, plus a `<g className="fn-lid">` for the top
                   4.5 units and the two bow loops, so the lid can hinge.
     logistics     body, cab and both wheels are wrapped in one `<g>` so they
                   travel as a single vehicle, and a dashed road is added at
                   y=21 underneath, 1.2 units below the wheels' lowest edge.
     curation      unchanged, plus one four-point sparkle in the quadrant the
                   glyph leaves empty.

   Two of the old `GiftIcon` paths were re-cut rather than dropped. The old
   `M3.5 12.5h17` was the seam, and the seam is now the body's own top edge; the
   old `M12 8v11.5` was one ribbon running the whole height, and it is now two
   halves — `M12 8v4.5` inside the lid group, `M12 12.5v7` on the body — so the
   ribbon lifts with the lid instead of being left hanging in mid-air.

   ── THE BRIEF'S THREE POINTS DO NOT MATCH THE THREE PILLARS ────────────────
   The brief lists gift box, truck, and wand-with-sparkle as points 1, 2 and 3.
   The pillars on screen are curation, presentation, logistics. So the brief's
   truck is aimed at position two and its hand-picked sparkle at position three,
   while the pillar those actually describe is position one. A lorry on
   "Editorial Presentation" would be plainly wrong, so the three concepts were
   mapped by meaning rather than by index:

       01 Human-Centric Curation  <-  sparkle pop     (brief point 3)
       02 Editorial Presentation   <-  lid unclasps    (brief point 1)
       03 Effortless Logistics     <-  road and truck  (brief point 2)

   All three concepts are delivered. Only the numbering moved. The brief's
   alternative for point 3 — "gentle floating" — was not taken; a continuous
   float is a loop, and a looping decorative mark in the corner of a reading
   column is the thing this file's `prefers-reduced-motion` rule exists to
   avoid having to defend.

   ── ON THE LIBRARY, HONESTLY ───────────────────────────────────────────────
   framer-motion IS a declared dependency and IS imported by
   `BudgetCalculator` and `RotatingCubeText`, so this was not unavailable. It
   was still not used, for three reasons, and the strongest one is not purity.
   `AutomationFlow.tsx` line 85 states the rule that governs a section like
   this: "PURE CSS AND SVG, no library. There is no framer-motion here (none is
   permitted in-section)". Lottie is not a dependency at all, and there is no
   animation JSON anywhere in the repo, so either route meant new packages and
   new binary assets for three 24px glyphs. Most of all, the trigger needed
   nothing: the rail already carries `data-reveal-stagger`, so `RevealOnScroll`
   adds `.is-revealed` to each pillar as it arrives, and the keyframes are
   descendant-keyed off it. A `whileInView` wrapper would have been a second
   motion system in a page whose whole entrance language is the one
   RevealOnScroll owns, and would have made these three marks unrenderable
   without JS.

   A NOTE ON WHAT `Icons.tsx` ACTUALLY SAYS, because an earlier draft of this
   comment misquoted it. Line 391 is not a no-animation rule. It reads: "No
   icon package is installed (the only runtime dependencies are
   next/react/react-dom/framer-motion), so these are drawn in place rather
   than pulled in". That is about not depending on lucide or similar, and it
   names framer-motion as an installed runtime dependency — which cuts the
   other way. The rule that actually governs this change is
   `AutomationFlow.tsx` line 85, quoted above, and nothing in `Icons.tsx`
   forbids animation.

   ── HOW THE TRIGGER AND REDUCED MOTION ACTUALLY RESOLVE ─────────────────────
   The animation rules live in `globals.css`, not in this file. They are keyed
   `.fn-mark .is-revealed .fn-*`, and the order is not interchangeable:
   `data-reveal-stagger` collects a container's CHILDREN, so `.is-revealed`
   lands on the pillars and `.fn-mark` is their parent. Under
   `prefers-reduced-motion: reduce` all four animations are cancelled outright,
   and since every keyframe is authored to end at the resting markup state, a
   cancelled mark is a correct static icon — as it also is with JS off, and in
   print.
   ========================================================================== */

type MarkProps = { className?: string };

/** Pillar 01. The person-and-check mark as it was, plus one sparkle that pops
    in the empty top-right quadrant. Head circle ends at x=12.25 and the check
    begins at x=14.5, so a 2.2-unit sparkle centred at (18.8, 5) clears both. */
function CurationMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="9" cy="7.5" r="3.25" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="m14.5 17 2.5 2.5 5-5" />
      <path
        className="fn-sparkle"
        d="M18.8 2.8 19.5 4.3 21 5 19.5 5.7 18.8 7.2 18.1 5.7 16.6 5 18.1 4.3Z"
      />
    </svg>
  );
}

/** Pillar 02. The gift box, with the lid and both bow loops grouped so they
    hinge on the seam at y=12.5. The body path is the old rect's lower half with
    its two bottom corners rounded to match the original 1.5 radius. */
function PresentationMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 12.5h17v5.5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M12 12.5v7" />
      <g className="fn-lid">
        <rect x="3.5" y="8" width="17" height="4.5" rx="1.5" />
        <path d="M12 8v4.5" />
        <path d="M12 8h3.6c1.8 0 3-1 3-2.3C18.6 4.2 17 3.6 16 4.2c-.9.5-2.5 2-4 3.8z" />
        <path d="M12 8H8.4c-1.8 0-3-1-3-2.3C5.4 4.2 7 3.6 8 4.2c.9.5 2.5 2 4 3.8z" />
      </g>
    </svg>
  );
}

/** Pillar 03. The lorry as it was, grouped so it travels as one vehicle, on a
    dashed road laid at y=21. The road is drawn first so the wheels paint over
    it where they overlap, which at this size is the only depth cue available
    without introducing a shadow the rest of the icon set does not have. */
function LogisticsMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path className="fn-road" d="M2 21h20" strokeDasharray="2.2 2.2" />
      <g className="fn-truck">
        <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
      </g>
    </svg>
  );
}

export function AboutStory() {
  const reducedMotion = useReducedMotion();
  const [iconsRevealed, setIconsRevealed] = useState(reducedMotion ?? false);

  useEffect(() => {
    if (reducedMotion) setIconsRevealed(true);
  }, [reducedMotion]);

  return (
    <section className="relative overflow-hidden border-t border-section-divider bg-surface py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-brand-green-900/[0.04] blur-3xl"
      />

      {/* One 7xl container for the whole section, so both columns resolve their
          widths against the same 1232px and the rail lines up with the copy. */}
      <div className="mx-auto max-w-7xl px-6">
        {/* THE SPLIT. 7 tracks of narrative, 5 of foundation. What each column
            measures, from the container down: 1280px shell, less 24px of
            padding each side = 1232px, less a 64px column gap = 1168px to
            divide, so

                narrative  7/12 of 1168px  =  681px
                foundation 5/12 of 1168px  =  487px  ->  453px inside the rail

            That is the second time this section has been a 12-track split. It
            was one before the photograph was removed, with the image on the
            wide side; this is the inverse, and the reason the reading column
            gets the extra two tracks is that it holds four paragraphs where
            the rail holds three short ones.

            `items-start` so the rail does not stretch to the height of the
            copy. The two columns come out at roughly 615px and 444px, so
            without it the rail would carry 171px of nothing below its last
            entry. A shorter sidebar against a longer narrative is the ordinary
            shape for this layout; it is named so it reads as a decision.

            `grid-cols-1` is what the grid already does by default and is
            written out only because the brief asked for it and it costs
            nothing. Single column below the lg breakpoint, which is where the
            rail's 24px padding keeps its entries off the screen edge. */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          {/* THE NARRATIVE, left. Heading is left-aligned per the house rule.
              The measure is the `max-w-2xl` cap, which at 18px is about 71
              characters a line. It is now within 9px of the column width, so it
              is close to inert — kept because a fixed cap is deterministic
              where a grid fraction is arithmetic. */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Our story"
              title={
              <>
                Re-imagining corporate{" "}
                <em className="accent-em">gifting</em>
              </>
            }
            />

            {/* All four narrative paragraphs, retained verbatim. Spacing is now
                a 5-step space-utility stack rather than a 6-step flex gap,
                which is 20px between paragraphs instead of 24px — the first
                time one of this section's briefs has named a paragraph gap and
                had it applied literally, because the last one named 6 and the
                flex gap already was 6. `leading-relaxed` nudges this file's
                1.6 to 1.625.

                NO entrance animation on this stack: the left-hand narrative is
                static so the reader can start reading immediately, while the
                right-hand foundation pillars animate in on scroll. */}
            <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-taupe md:text-lg">
              <p>
                Fulfill Nest began with a simple observation: corporate gifting
                had lost its soul. What should have been a powerful moment of
                appreciation had devolved into generic catalog orders,
                uninspired swag, and logistical headaches.
              </p>
              <p>
                We founded Fulfill Nest to re-imagine gifting as a modern
                cultural touchpoint. By combining boutique design, human
                curation, and seamless tech-driven fulfillment, we bridge the
                gap between genuine sentiment and flawless execution.
              </p>
              <p>
                Behind every curated box is a commitment to intentionality. We
                partner directly with independent artisans, sustainable brands,
                and ethical creators, ensuring that every item included carries a
                story of quality, craft, and care.
              </p>
              <p>
                By streamlining the entire lifecycle—from concept discovery and
                branded packaging to automated doorstep delivery—we empower
                organizations to scale their employee appreciation seamlessly
                without losing the personal, high-touch feel.
              </p>
            </div>
          </div>

          {/* THE FOUNDATION, right. Vertically centred against the narrative
              beside it rather than top-aligned, which is what
              `lg:self-center` buys: the grid is `items-start`, so this column
              overrides that for itself only and sits centred in a row whose
              height is set by the taller narrative column.

              A top margin was the other way to do this and was rejected: the
              offset it would need is not a constant. The narrative column runs
              roughly 615px against this rail's 444px at a 1280px viewport,
              which is an 85px shift, but at the 1024px breakpoint the
              narrative grows to about 717px and this rail shrinks to about
              468px, which is 124px. A fixed margin would be wrong at one width
              or the other and would drift again the next time a paragraph is
              edited. Centring asks the browser to keep solving it.

              Scoped to the lg breakpoint because below it there is only one
              column: each row is its own height, so self-alignment has nothing
              to centre inside and the utility is inert there.

              A rail, not a box: no fill, no radius, no outline, one 2px rule
              down the leading edge with 24px of padding, widening to 32px at
              the lg breakpoint. That rule is the whole container treatment.

              The label sits OUTSIDE the rail rather than inside it. Inside, the
              8-step gap would have held "The Foundation" 32px away from its
              first entry, which is a gap between a heading and its list rather
              than between two list items; above the rule it reads as a title
              for the rail, which is what it is. It rides up with the rail, so
              centring the pair is what keeps them together. */}
          <div className="lg:col-span-5 lg:self-center">
            <p className="text-eyebrow uppercase text-eyebrow-gray">
              The Foundation
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onViewportEnter={() => setIconsRevealed(true)}
              className="fn-mark mt-6 space-y-8 border-l-2 border-section-divider pl-6 lg:pl-8"
            >
              <div className={`${PILLAR} ${iconsRevealed ? "is-revealed" : ""}`}>
                <CurationMark className={PILLAR_ICON} />
                <h4 className={PILLAR_TITLE}>01. Human-Centric Curation</h4>
                <p className={PILLAR_BODY}>
                  We hand-pick products from design-led, eco-conscious brands that
                  recipients actually keep and cherish.
                </p>
              </div>

              <div className={`${PILLAR} ${iconsRevealed ? "is-revealed" : ""}`}>
                <PresentationMark className={PILLAR_ICON} />
                <h4 className={PILLAR_TITLE}>02. Editorial Presentation</h4>
                <p className={PILLAR_BODY}>
                  Every box is treated like a canvas—unboxing experiences crafted
                  with tactile materials and custom branding.
                </p>
              </div>

              {/* CARRIES THE `fulfilment` ANCHOR. This pillar is where that id
                  moved when the photograph was removed. `Footer.tsx` links to
                  `/about#fulfilment` under the label "How we fulfil", and its
                  own doc block names this as one of only two `/about` anchors
                  that resolve. Deleting the image took the anchor with it, so
                  the link would have scrolled nowhere.

                  Landing here rather than on the section is a better match than
                  what it used to point at: the old target was a stock
                  photograph of a fulfilment floor with no words on it, while
                  this pillar is literally the section's answer to how
                  fulfilment is handled. */}
              <div className={`${PILLAR} ${iconsRevealed ? "is-revealed" : ""}`} id="fulfilment">
                <LogisticsMark className={PILLAR_ICON} />
                <h4 className={PILLAR_TITLE}>03. Effortless Logistics</h4>
                <p className={PILLAR_BODY}>
                  From custom kits to distributed hybrid workforces globally, we
                  handle 100% of the fulfillment burden.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}