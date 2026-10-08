"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, products, steps, testimonials } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/ui/Icons";

/* RECOVERY NOTICE — read this before trusting any prose in this file.

   On 2026-10-04 a scripted line-range splice on this file failed after it had
   already opened the output stream, which left the file containing only the
   block being spliced in. The repo is not under version control, so there was
   no commit to restore from.

   What survived intact and was reassembled verbatim:

     - the whole import block, both module constants, `STEP_DEMOS` and the
       crossfade comment;
     - the header specification from `Band` through `Palette note`;
     - the component from `export function HowItWorks()` through the end of
       `handleTabKeys`;
     - the four state bodies, the chrome bar, the viewport and the footer.

   What was NOT recoverable verbatim is two prose ranges: the tail of the
   auto-play timer's comment, and everything between `handleTabKeys` and the
   tablist (the manual-selection note, the section wrapper and the two comments
   around `<SectionHeading>`). The CODE in both places was recovered and is
   exact — the section wrapper's classes, the `SectionHeading` props, the
   pointer handlers and the grid's reveal marker were all confirmed against
   Turbopack's on-disk module cache — but the COMMENTARY there has been
   rewritten from the substance of what the cache still held.

   Consequences, in order of importance:

     1. BEHAVIOUR IS INTACT. `tsc --noEmit` passes and the section renders the
        same four tabs, the same crossfade, the same rotating clock. (The dwell
        has since been retuned from 7s to 4.5s and the pointer pause narrowed to
        the rail — both deliberate, both noted at their definitions. Everything
        else about the interaction is as recovered.)
     2. THE COMMENTS ARE NOT BYTE-IDENTICAL. Treat the rationale in those two
        ranges as accurate-but-rephrased. If a decision in this file matters
        enough to reverse, verify it against the running behaviour rather than
        trusting a comment here.
     3. THE SECTION HEADING WAS NOT GUESSED. `eyebrow`, `title` (including the
        `<em className="accent-em">` around the emphasised phrase) and the
        `description` were read out of Turbopack's cache and cross-checked
        against `.next/server/app/index.html`. All three are verbatim.

   Do not "tidy" the phrasing in those two ranges expecting it to match some
   other copy. It will not. */

/* One number for the rotation clock, kept out of the JSX so the interval and
   any future progress indicator stay the same value by construction.

   6200ms, up from 4500. This one is NOT free and the reason is worth reading
   before anyone lowers it again.

   The four card scenes are now paced at roughly half their former speed, which
   put the slowest of them at 5600ms - scene 02's press ring. A scene that
   outruns the dwell is a scene the reader never sees finish: the panel
   crossfades while the last effect is still moving and the reader arrives at
   the next card to find nothing left to watch. So the dwell has to clear the
   slowest scene plus the crossfade plus a beat worth holding a finished frame
   for. 5600 + 500 + 600 is 6700 to clear comfortably; 6200 lands it with the
   slowest scene done and 600ms of settled frame before the swap, which is the
   cheapest dwell that still honours the half-speed brief.

   The figure this replaces was chosen for the opposite reason. 4500 came down
   from 7000 because at 7000 the sliding indicator moved for 400ms and then sat
   still for 6600, so the line looked broken rather than animating, and a full
   four-step loop took 28 seconds. 4500 fixed that. It also meant nothing in the
   scene block could run longer than about 4100ms, which is the constraint that
   has now been traded away deliberately: a four-step loop is 24.8 seconds rather
   than 18, and it does read as a slideshow rather than a demo. That is the
   cost of "ample time to absorb", priced rather than missed.

   What is unchanged is what actually protects the reader. WCAG 2.2.2 asks for
   a way to pause moving content that starts on its own, and the hover and
   focus pause below is that mechanism; it is still load-bearing at 6200ms and
   it is still the first thing to check if the rotation is ever called
   restless. */
const STEP_ADVANCE_MS = 6200;

/* The floor for the card stack, in px. It is the px equivalent of the
   `min-h-[30rem]` class on the container - 30 × 16 - and it exists as a number
   because the measurement effect has to clamp to the same floor the CSS
   declares. Two places spelling the same floor in two different units is
   exactly the disagreement that produced the height flicker: the class said
   30rem, the inline style said whatever the measurement returned, and the
   container changed size between the two. `Math.round` in the measurement and
   this integer here mean the inline value and the class now agree to the
   pixel. */
const MIN_STACK_PX = 480;

/* THE SLIDING INDICATOR'S TRANSITION. This is a plain CSS declaration rather
   than utility classes, and the reason is specific rather than stylistic.

   The indicator is the one element in this file whose animation cannot be
   written as a single duration utility, because the requested motion is two
   properties moving under two different easings: `top` on the standard curve,
   `height` on `ease`. Tailwind's `transition-*` utility takes one timing
   function for every property it lists, so expressing this in classes would
   silently drop the second easing. Declaring it directly reproduces the
   requested values exactly.

   Being inline also buys the two things the class version could not do. It
   costs no scanner risk at all — nothing here is a candidate class, so there is
   no rule that could be emitted for a token nothing uses. And it is gated on
   `reducedMotion`, the state this component already keeps for the auto-advance,
   so the indicator honours the OS motion preference through the same source as
   everything else instead of needing a `!important` override to beat an inline
   declaration. */

const INDICATOR_MS = 500;
const INDICATOR_TRANSITION =
  `top ${INDICATOR_MS}ms cubic-bezier(0.4, 0, 0.2, 1), ` +
  `height ${INDICATOR_MS}ms ease`;

/* THE MOBILE BREAKPOINT, IN ONE PLACE, because three separate things now have to
   agree on it: the `hidden md:*` / `md:hidden` classes that decide which of the
   two layouts is even displayed, the auto-advance below, and the sliding
   indicator's measurement. Two of those three are CSS and one is JS, and a JS
   number drifting from a CSS breakpoint is the failure that looks like nothing at
   all until someone resizes the window.

   768px is Tailwind's `md` and nothing here had to be chosen. The section has
   used `md:` for its own internal padding since it was written - `px-6 md:px-8`
   on the chrome bar, the viewport and the footer - so this is the breakpoint the
   file has always had.

   WHY THERE ARE TWO LAYOUTS RATHER THAN ONE RESPONSIVE ONE, stated once here
   because it governs every `md:` in this section below. The desktop tabbed
   layout needs a RAIL beside a PANEL: a vertical list and one fixed box, which is
   a layout that stops being legible the moment the two are stacked. Below `md`
   those two stacked columns were four chips followed by a 480px-tall window, so
   a phone reader saw the whole stepper as a list and then had to scroll a further
   480px to find out what any of the four steps was. The accordion fixes exactly
   that by putting each step's card under its own row.

   BOTH TREES ARE IN THE DOM AT ALL TIMES and the breakpoint is pure CSS - no
   `matchMedia` conditional render, no hydration mismatch, no second render pass
   when the window is resized. That has one cost and it is recorded at the
   accordion: the hidden tree's mockups are still in the document, and the hidden
   tree's auto-advance is switched off in JS because it cannot be switched off in
   CSS. */
const DESKTOP_QUERY = "(min-width: 768px)";

/* THE ACCORDION'S ONE DURATION. 350ms of height and opacity, on the
   ease-in-out curve, which is the same curve the desktop window's crossfade uses
   and a shorter read than the 500ms pair above for a reason that is specific to
   this motion: the card that expands is PUSHING the rows below it, so the reader
   is watching the movement of the page, not watching a dissolve. Half a second
   of that is slow enough to feel like lag. The chevron's rotation runs on the
   same number so the indicator and the content it indicates arrive together. */
const ACCORDION_MS = 350;
const ACCORDION_EASE = "easeInOut" as const;

/* ONE DURATION FOR THE PAIR, because the indicator and the crossfade have to
   arrive together. The bar leaving step 01 and the window changing state are
   the same event told two ways; if they run at different speeds the reader sees
   a line that has already stopped while the card is still dissolving, and the
   column reads as broken rather than as animating.

   So `INDICATOR_MS` above and the named duration utility on the panel below are
   the same 500ms, and they have to be changed together. Both were 400 and both
   are now 500, in the same pass that halved the speed of the card scenes: a
   400ms dissolve in front of a 5600ms scene is a hard cut, and the section
   reads as two clocks running at different speeds. The panel's half of the pair
   is a class rather than an interpolation of this constant, and that is
   deliberate and not an oversight: Tailwind scans source text, so a value built
   by interpolation emits no rule at all and the transition silently falls back
   to the 150ms default. Both spellings are 500; see the note below for the full
   reasoning. */

/* The crossfade is 500ms of OPACITY *and* SCALE, written once as a literal
   duration utility on the panel itself, further down. There is deliberately no
   `FADE_MS` constant feeding it, and the reason is worth keeping on file.

   There used to be one: the panel read an ARBITRARY duration value built by
   interpolating it, which is not a class Tailwind can read. Tailwind scans
   SOURCE TEXT for class names, so an interpolated arbitrary value emits nothing
   at all — verified, not assumed: the built stylesheet had no rule for that
   class, so the opacity transition fell through to
   `--default-transition-duration`, i.e. `.15s`. The crossfade was running at
   150ms against an intended half second, so every panel change hard-snapped
   instead of fading, once every 7 seconds. A named utility is used here only
   because it is written where Tailwind reads it.

   NOTE FOR THE NEXT PERSON EDITING THIS COMMENT: do not spell a duration or
   colour class out in full. Tailwind's scanner reads raw source text and does
   not know what a comment is, so quoting a dead token here emitted a 162-byte
   rule for a class nothing uses. Describe it, do not transcribe it. */

/* ────────────────────────────────────────────────────────────────────────────
   THE FOUR MOCKUP STATES.

   These live here and NOT in `lib/data.ts`, deliberately. `lib/data.ts` is site
   copy — real claims about the service, read by search engines and by the
   pricing and catalog pages. What follows is the interior of a UI *illustration*:
   a December date, six clock times, a consignment reference and a first name.
   None of it is a statement about Fulfill Nest, all of it is invisible to
   assistive tech (see `aria-hidden` on the viewport below), and putting it in
   the copy layer would make it indistinguishable from a testimonial.

   It is a discriminated union rather than one shape with optional fields, so
   `demo.kind` narrows inside the renderer and a state that forgets one of its
   own fields is a compile error instead of a blank card.

   Keyed by the step's own `number`, written out in full for all four rather than
   derived from the index: reordering `steps` must not be able to slide a
   calendar onto the tracking state.
   ──────────────────────────────────────────────────────────────────────────── */
/* THE FOUR DATES ARE ONE TIMELINE, and they are the reason this file carries a
   month label at all.

       card 01  Wed 11 November 2026   the consultation is booked
       card 02  Thu 12 November 2026   the shortlist is revised the next day
       card 03  in transit, ETA Mon 16 November 2026
       card 04  Sat 14 November 2026   delivered, two days after the shortlist

   Card 01 used to read "December 2026" with day tiles 07-11, which put the
   booking three weeks AFTER the delivery it books. The four cards were four
   unrelated dates wearing the same year.

   THE TILES REMAIN MON-FRI, which is not decoration - 9-13 November 2026 really
   are Monday to Friday, and 7-11 December 2026 were, so the change preserves
   the calendar rather than breaking it. `selectedDay: 2` is unchanged and now
   lands on Wednesday the 11th, which is the date the sequence is built on.

   14 November is a Saturday, and the delivery saying so is fine: couriers work
   weekends and the card's whole subject is a parcel arriving, not an office
   receiving one. */
type CalendarDemo = {
  kind: "calendar";
  month: string;
  days: { weekday: string; date: string }[];
  selectedDay: number;
  slots: string[];
  selectedSlot: string;
  footnote: string;
};

type BundleDemo = {
  kind: "bundle";
  heading: string;
  /* Indexes into `products`, not ids. The catalog is a plain array literal, so
     an id lookup would need a `find` and a guard on every render for no gain;
     an index that points at nothing renders one card fewer. */
  productIndex: number[];
  selected: number;
  footnote: string;
};

type TrackingDemo = {
  kind: "tracking";
  reference: string;
  status: string;
  stages: string[];
  /** Stages before this index are complete, the stage AT it is in progress, and
      everything after it has not started. Drives both the bars and the labels. */
  reached: number;
  eta: string;
  carrier: string;
};

type NoteDemo = {
  kind: "note";
  recipient: string;
  message: string;
  signoff: string;
  deliveredOn: string;
  /** Index into `testimonials`, for the quote in scene 04. An index rather than
      an inline string, and for the same reason `BundleDemo.productIndex` is one:
      the quote is real published copy that already lives in `lib/data.ts` and
      already renders elsewhere on the site, so the only thing this entry needs
      to carry is WHICH one. An index that pointed at nothing would render one
      fewer line rather than throwing. */
  testimonialIndex: number;
};

type StepDemo = CalendarDemo | BundleDemo | TrackingDemo | NoteDemo;

const STEP_DEMOS: Record<string, StepDemo> = {
  "01": {
    kind: "calendar",
    month: "November 2026",
    days: [
      { weekday: "Mon", date: "09" },
      { weekday: "Tue", date: "10" },
      { weekday: "Wed", date: "11" },
      { weekday: "Thu", date: "12" },
      { weekday: "Fri", date: "13" },
    ],
    selectedDay: 2,
    slots: ["10:00", "11:30", "14:00", "15:30", "16:15", "17:30"],
    selectedSlot: "15:30",
    footnote: "30-minute call · no obligation · IST",
  },
  "02": {
    kind: "bundle",
    heading: "Your shortlist",
    productIndex: [0, 1, 2],
    selected: 1,
    footnote: "3 concepts · revised 12 November 2026",
  },
  "03": {
    kind: "tracking",
    reference: "FN-4821",
    status: "In transit",
    stages: ["Confirmed", "Packed", "In transit", "Delivered"],
    reached: 2,
    eta: "Arriving Monday 16 November, by 6 PM",
    carrier: "Delivered by Fulfill Nest, Bengaluru",
  },
  "04": {
    kind: "note",
    recipient: "Ananya",
    message: "Thank you for three brilliant years. Enjoy every bit of it.",
    signoff: "The Fulfill Nest team",
    deliveredOn: "Delivered 14 November 2026",
    /* Sofia Almeida, Northwind Partners - "our night-shift teams finally feel
       seen". It is the closest thing in the set to this card's title, and it is
       the ONLY one of the four candidates that is safe here.

       `testimonials[0]` is Ananya Krishnan, which is the same first name as
       this panel's recipient. Showing a customer's testimonial directly under
       "Thank you, Ananya" would read as the note's sender quoting herself, and
       the reader has no way to tell it is two different people. The three
       remaining candidates are Daniel Osei, Meera Sundaram and Kabir Sharma;
       Sofia's is chosen on meaning rather than on avoiding a clash, but the
       clash is worth recording because it is the sort of thing that would be
       reintroduced by anyone reordering that array. */
    testimonialIndex: 6,
  },
};

/* THE THREE CONTROL DOTS are the one place in this file that uses colours
   outside this project's ramp, and it is a considered exception rather than an
   oversight: a window control with no hue reads as broken. They are muted
   defaults (red / amber / emerald at 400) rather than saturated ones, so at
   10px across they register as three quiet dots and not as traffic lights. Any
   of this site's own tokens here would put three near-identical browns on the
   frame and the metaphor would stop working. */

/* ==========================================================================
   THE FOUR CARD SCENES.

   Four micro-interactions, one per step card, in the "visual slot" of each
   window. Every keyframe, every delay and the reduced-motion override live in
   `app/globals.css`; the trigger classes are `.hiw-live` plus, per scene,
   `.hiw-cursor` / `.hiw-ring` / `.hiw-badge`, `.hiw-glide` / `.hiw-press` /
   `.hiw-ring--pick`, `.hiw-sweep` / `.hiw-node`, and
   `.hiw-glide--stars` / `.hiw-press--stars` / `.hiw-star` / `.hiw-bubble`.
   Read that block's header before changing anything here — it explains the
   trigger, the timing budget and the rule that every resting state is the
   finished screenshot.

   ── THIS PASS: HALF SPEED, AND THREE OF THE FOUR SCENES REWRITTEN ─────────
   The brief asked for slower motion everywhere (roughly 2.5s to 5.0s, longer
   staggers) and changed what three of the four cards draw. It kept card 01 as
   "the baseline aesthetic" — untouched in structure, retimed only.

   Card 02 lost the gift box and gained a product grid with a cursor that
   glides along it. Card 03 lost the delivery truck and became a 5000ms fill
   across all four stages. Card 04 lost the gift box and the "Open" chip and
   became a five-star rating the cursor clicks, opening a customer's quote.

   Both removed boxes were the same error: a box is what this section DELIVERS,
   so drawing one on two of its four cards made the section illustrate its own
   subject instead of illustrating its four steps. Cards 02 and 04 are about
   choosing and about being thanked; neither is about a carton.

   ── THE BRIEF'S FOUR CARDS ARE NOT THESE SECTION'S FOUR CARDS ──────────────
   The brief's cards 1, 2 and 4 describe: a vector cursor gliding over product
   tiles to select one; a four-stage tracker; and a cursor clicking a star
   rating to open a quote. This section's four cards are, in order:

       01  a calendar — month, five day tiles, six time slots, two selections
       02  a shortlist — three real catalog cards, one picked
       03  a consignment — reference, status, four stage bars, ETA
       04  a thank-you note to a named recipient

   Each interaction is mapped onto the card whose existing content already IS
   that interaction:

       01  calendar      cursor picks a day, then a slot    (baseline, retimed)
       02  shortlist     cursor glides the product grid and presses the pick
       03  consignment   5000ms fill lighting all four stages
       04  note          cursor clicks a rating, the quote opens

   The brief's card 3 names this section's card 03 outright, so that one was
   never in question. Card 01 is the one card whose content is already a set of
   things a reader picks from, and it is the card the brief told me to leave
   alone; keeping it as the baseline is also what keeps one card in the set
   reading as the plainest of the four.

   ── WHY NOT THE SUPPLIED COMPONENT ────────────────────────────────────────
   `Step3FulfillTrackVisual` was supplied as a drop-in and is not used
   verbatim. What was kept: the 5000ms run, the scale-from-left fill idea, the
   four stage names and the `idx * 1.3` node stagger.

   What changed, and each is a house decision rather than a preference. THE
   LEFT-HAND SIDE OF EACH LINE IS DESCRIBED IN WORDS, not quoted as a class
   string, and that is deliberate: Tailwind scans raw source text including
   comments, so writing the supplied component's utilities out literally would
   emit every one of them - a slate tint, a 500-weight red and an inset shadow
   that nothing on this site renders - purely because a comment mentioned them.
   The file's standing rule about comments is the reason, and this table is the
   place it would have been easiest to break.

     Motion library and its viewport trigger
       see the CSS block's header. The brief's own trigger would have played all
       four cards' scenes at once against an invisible backdrop, because the
       four windows differ only by opacity.
     Its own surface, radius, hairline and inset shadow
       all dropped whole. The canvas already supplies a warm-grey ground and a
       card radius; a second card inside it would be a card in a card.
     Its grey track line   -> the existing four bars, kept exactly as they are,
       because they already encode where the parcel actually is. The brief's
       fill rides over them as a transient sweep rather than replacing them.
     Its 500-weight red fill and 600-weight red text
       -> `bg-brand-primary` and `text-brand-primary`. `--color-brand-primary`
       is #a83b24, the same value as `--color-brick-red` and 6.33:1 on white.
       This section already uses it for the status pill, the lit bars and the
       step nodes, so red here is not a new colour.
     Its 300-weight grey node border
       -> `border-charcoal/25`, the file's existing muted-border tint.
     Its 600-weight grey text -> `text-charcoal/60`, the muted label token.
     Its white-filled truck wheels
       moot: the brief also asked for the truck removed, so the vehicle is gone
       from this card entirely rather than restyled.
     Stroke width 2 -> the house 1.5.
     Node size 16x16 -> 10x10, matching the chrome bar's three dots and the
       sweep's 6px bar row.
     Node fill: white with a ring, not white with a coloured centre
       deliberate, and it reverses a decision recorded in the CSS block. The
       brief's nodes fill with the accent colour; at 10px, on top of a bar row
       that is itself accent, an accent node is invisible on exactly the two
       stages the animation is about.
     Viewport margin of -40px -> no observer, so no viewport margin.
     `easeInOut` -> `cubic-bezier(0.4, 0, 0.2, 1)`, already this file's
       indicator curve.
     Node duration 600ms -> 800ms. The only figure here that departs from the
       supplied component in the direction the brief's first instruction asked
       for, since 600ms would have been the fastest thing in a pass whose point
       was to slow everything down.

   ── WHAT WAS NOT TAKEN FROM THE BRIEF ─────────────────────────────────────
   The fill does not HOLD at 100%. This is the one substantive disagreement and
   it is worth reading twice.

   The brief asks for all four of "Confirmed", "Packed", "In Transit" and
   "Delivered" to light in accent. Lighting Delivered and LEAVING it lit puts a
   delivered parcel on screen directly above a status pill reading "In transit"
   and an ETA block reading "Arriving Monday 16 November" — in the one card on
   this section that is making a claim about tracking.

   So the sweep and all four node flashes start at nothing and end at nothing.
   The reader is shown the complete journey once, sequentially, over five
   unhurried seconds, and then the card is exactly what it is with animation
   switched off. A demonstration playing, not a claim. The brief's version of
   this animation has the contradiction permanently rather than for five
   seconds.

   ONE COPY DIVERGENCE. The brief writes "In Transit". This section's stage
   list, at the `STEP_DEMOS` entry for "03", reads "In transit". The brief also
   says keep all existing copy, so the existing string is used and the casing
   difference is left alone.
   ========================================================================== */

/** The pointer that does the clicking in scenes 01 and 04. `fill-surface` with
    a `stroke-charcoal` outline rather than `currentColor`, because it has to
    stay legible on top of BOTH an unselected tile and a selected one — and a
    selected tile is `bg-brand-primary`, #a83b24, against which every house
    accent token lands under 3:1. A white pointer with a dark outline is the
    one treatment that reads on both, and it is the convention for a cursor
    anyway. `Icons.tsx` line 11's ban is on `fill="currentColor"` specifically;
    a knock-out pointer is not the outline icon the file governs. */
function SelectCursorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5.2 3.3 19.6 11.2a.62.62 0 0 1-.3 1.16l-5.6 1.22a1 1 0 0 0-.7.5l-2.5 5.1a.62.62 0 0 1-1.17-.18Z"
        className="fill-surface stroke-charcoal"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/** One of the five rating stars. Filled rather than outlined, which is the one
    place scene 04 departs from `Icons.tsx` line 8's outline-only rule: a rating
    is read by whether the star is solid, and an outlined five-star row does not
    read as a score.

    Takes `style` because the stagger index has to arrive as `--hiw-star`, and
    an inline custom property cannot be written as a Tailwind arbitrary-value
    utility without a literal `calc()` in the class string - which would put five
    near-identical utility strings on the element and make the class attribute
    the place where a timing decision lives. */
function StarIcon({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} style={style}>
      <path
        d="m12 2.5 2.95 5.98 6.6.96-4.78 4.66L17.9 20.6 12 17.48 6.1 20.6l1.13-6.5-4.78-4.66 6.6-.96Z"
        className="fill-brand-primary"
      />
    </svg>
  );
}

/* ── THE COLOUR TOKENS THE SCENES USE, AND WHY EACH ONE ───────────────────
   `--color-sand-100` does not exist in this theme and a draft of the removed
   box used it; `--color-sand` is the only sand, and it is
   `rgb(28 25 23 / 0.08)`, an 8% charcoal tint rather than a paper colour. The
   tiles are filled with `fill-surface` instead: white on the canvas's
   `bg-warm-grey/60`, which separates the tiles from their ground without
   inventing a material colour the palette does not have.

   The rest are all tokens this file already uses nearby: `bg-brand-primary` on
   the status pill, the lit bars, the sweep, the stars and the tick,
   `text-charcoal/60` on the muted labels, `border-charcoal/10` on every hairline
   in the frame and `border-charcoal/25` on the tracking nodes.

   `fill-` and `stroke-` on an SVG child are Tailwind's colour utilities
   pointed at presentation attributes, so they compile exactly like `text-` and
   `bg-` do. `var()` is NOT valid in a presentation attribute, which is why the
   one animated stroke in this block - the tracking node's border, which has to
   return to the markup's exact resting tint - is a keyframe in `globals.css`
   using `color-mix`, and not a `stroke="var(--color-brand-primary)"` here.
   ========================================================================== */

/**
 * How it works — the home page's four-step overview.
 *
 * A STRUCTURAL AND BEHAVIOURAL CLONE of `sections/ComplianceAssurance.tsx`, the
 * "Compliance & security assurance" band on /industries. An earlier pass at this
 * file took only the compliance band's *card tokens* and laid the steps out as a
 * four-up card grid, which shares a palette with the reference and shares no
 * layout with it at all: compliance is a 3/9 split — a vertical menu of four
 * chips beside ONE panel — and a grid of four cards cannot read as the same
 * design however many class names match. So this file now copies the layout and
 * the implementation, not just the tokens.
 *
 * WHAT IS COPIED, IN ORDER, AS IT APPEARS DOWN THE PAGE:
 *
 *   Band          `relative overflow-hidden border-y border-section-divider
 *                 bg-linen py-section`
 *   Wrapper       `mx-auto max-w-7xl px-6`
 *   Heading       `<SectionHeading align="center" />` with a `description`
 *   Content grid  `mt-16 hidden items-stretch gap-8 md:grid lg:grid-cols-12
 *                 lg:gap-10`, carrying the section's `data-reveal-stagger` so
 *                 its two columns enter 100ms apart. `items-start`, not
 *                 `items-stretch`, was pinning each column to its own content
 *                 height and leaving blank space under the fourth chip; stretch
 *                 is what lets the rail match the panel. See the split note in
 *                 the JSX. The `hidden`/`md:grid` pair arrived with the mobile
 *                 accordion and is described under MOBILE ACCORDION below.
 *   Rail          `relative hidden flex-col border-l-2 border-section-divider
 *                 pl-6 md:flex md:space-y-8 lg:col-span-3 lg:h-full
 *                 lg:justify-between`. The `border-l-2` IS the timeline — one
 *                 continuous rule down the column, holding the content 24px
 *                 clear. `relative` was added with the sliding indicator and is
 *                 load-bearing for it: it makes this the offset parent, which is
 *                 what lets the bar reuse the active chip's `offsetTop` verbatim.
 *                 No reveal marker on the rail: the wrapper's stagger reaches it,
 *                 so the chips carry no entrance state and keep their own
 *                 transitions from first paint.
 *   Indicator     THE ACTIVE LINE, and the subject of this pass. A single
 *                 `<span>` inside the rail — `absolute z-0 w-0.5 rounded-full
 *                 bg-brand-primary pointer-events-none`, with `left`, `top` and
 *                 `height` inline and `transition` set from the constant above.
 *                 Rendered only once `indicator` is non-null, so it is INSERTED
 *                 at its measured position rather than animated there from zero.
 *                 Left at -2px so it paints exactly over the 2px rule instead of
 *                 beside it; `aria-hidden`, because `aria-selected` on the tab
 *                 already states this. Measured, not computed: see the effect.
 *   Chip          `group relative block w-full cursor-pointer rounded-card
 *                 border px-5 py-5 text-left` with an all-property transition on
 *                 the standard curve — both halves described rather than
 *                 transcribed, because the duration utility below was moved
 *                 from 300ms to 500ms this pass and a quoted token would have
 *                 gone stale the moment it was written. Inactive chips have NO fill, NO border and NO shadow — they
 *                 are text on the rule, and that absence is the whole visual
 *                 difference from the selected one. Selected: `bg-surface
 *                 shadow-elev-1 ring-1 ring-black/5`. The selected chip carries
 *                 NO marker of its own any more — it used to paint a
 *                 `before:` segment over the rule, and that is exactly the part
 *                 this pass replaced, because four toggled segments cannot slide.
 *   Chip node     `absolute -left-9 top-5 h-7 w-7 rounded-full border-2
 *                 font-mono text-xs tabular-nums` with the step number inside.
 *                 `-left-9` is arithmetic, not taste: the chip's content starts
 *                 24px in from the rule (`pl-6`) and the node is 28px wide, so
 *                 36px of offset puts its centre at +2px — the centre of a 2px
 *                 border. `top-5` matches the chip's own `py-5`. Inactive fill
 *                 is `bg-linen` because the section itself is linen, and an
 *                 opaque circle is what stops the rule showing through it.
 *   Chip title    `block pl-8 text-lg leading-snug tracking-tight`,
 *                 `font-semibold text-charcoal` when selected and
 *                 `font-medium text-charcoal/60 group-hover:text-charcoal` when
 *                 not. Stopped at `text-lg` rather than the next rung up: the
 *                 rail is ~278px at 1280px and a larger title would put "We
 *                 curate a shortlist" one character from wrapping. `pl-8` puts
 *                 the text on the node's inner edge, so the text column does
 *                 not shift sideways as nodes fill and empty.
 *   Chip summary  `mt-1.5 block pl-8 text-base leading-relaxed`, taupe when
 *                 selected and `text-charcoal/60` when not.
 *   Panel stack   `relative min-h-[30rem] overflow-hidden lg:col-span-9` with a
 *                 measured height, holding four absolutely positioned windows
 *                 at `absolute inset-0 h-full w-full`.
 *   Panel window  THE FRAME, and what the mockup pass put where the text card
 *                 was. `rounded-3xl border border-charcoal/10 bg-surface/80
 *                 backdrop-blur-md shadow-elev-3` with an all-property
 *                 transition on the ease-in-out curve and a motion-reduce opt
 *                 out, the same focus-visible ring offset to linen, and
 *                 `overflow-hidden` to trim the chrome bar to the radius. The
 *                 duration was 400ms and is now 500ms, to match the indicator:
 *                 the bar and the window change state together, and see the
 *                 note on the pair above for why 400 was too quick against a
 *                 5600ms scene.
 *                 `transition-all` with a scale, not an opacity-only fade: the
 *                 outgoing window settles to 98% while it dissolves, so a change
 *                 reads as one window's contents changing rather than two
 *                 windows cross-dissolving. Scaling is safe here precisely
 *                 because this element carries NO reveal marker — the wrapper's
 *                 stagger stops at the stack container, so nothing is competing
 *                 with `.reveal-on-scroll` for `transform`.
 *   Chrome bar    `flex shrink-0 items-center justify-center border-b
 *                 border-charcoal/10 px-6 py-4 md:px-8`: three 10px control dots,
 *                 centred, and NOTHING ELSE. It used to carry a browser address
 *                 pill and a 42px spacer to balance it - see the note at the JSX,
 *                 which explains why both are gone. The spacer was the only
 *                 arithmetic in the bar; `justify-center` replaces it with none.
 *   On-brand ink   EVERY label that sits on a brick fill uses `text-white`, and
 *                 that is not interchangeable with this project's `surface`
 *                 token used as ink. Both compute to #ffffff and the contrast on
 *                 #a83b24 is 5.44:1 either way, so nothing here is a legibility
 *                 question - it is a spelling question, and `ButtonLink` decides
 *                 it. Its `primary` variant paints conversion actions on a
 *                 two-stop brick gradient with `text-white`, so that is the
 *                 house spelling for ink on brand and this file now matches it in
 *                 all three places: the selected calendar day, the tracking
 *                 status badge and the selected timeline node. An earlier draft
 *                 of this pass reached for the surface token in all three, and
 *                 the name is deliberately not written out here: Tailwind scans
 *                 comment text as readily as markup, and spelling it would leave
 *                 a rule for a class this site does not use.
 *   Viewport      `flex flex-1 flex-col p-6 md:p-8` holding one inset canvas
 *                 `flex flex-1 flex-col justify-center rounded-card
 *                 bg-warm-grey/60 p-5 md:p-7`. The canvas is what gives the
 *                 glass something to sit on: the only thing behind this frame is
 *                 the flat linen section, so a backdrop blur over it resolves
 *                 to nothing and the "glass" would be carried entirely by the
 *                 80% surface tint. An inset panel behind the mockup is what
 *                 makes that tint read as frosting instead of as a grey box.
 *   State 01      CALENDAR. A five-day row on a 5-column grid, the selected day
 *                 inverted to `border-brand-primary bg-brand-primary
 *                 text-white` and the rest on `border-charcoal/10 bg-surface
 *                 text-charcoal/60`; then six time slots on a 3-column grid,
 *                 the selected one outlined in brick on white. Clock values are
 *                 `font-mono tabular-nums` because a column of times set in a
 *                 proportional face does not read as a column.
 *   State 02      BUNDLE. Three real catalog entries by index — `products[0..2]`
 *                 with their own names, `formatPrice` prices and
 *                 `/images/catalog/*.jpg` paths — not invented props. Those
 *                 three files are already served on the home page, so this state
 *                 costs no new bytes. The selected card takes
 *                 `border-brand-primary ring-1 ring-brand-primary`. Thumbnails
 *                 carry `alt=""` on purpose: the name is set directly beneath the
 *                 picture and the whole viewport is hidden from assistive tech.
 *   State 03      TRACKING. Four bars in a `flex gap-1.5` of `h-1.5 flex-1
 *                 rounded-full`, then the same four labels in a `<ol>`. Progress
 *                 is expressed by three states, not one: complete segments solid
 *                 brick, the stage AT `reached` at 35% brick, later ones on
 *                 `bg-charcoal/10`. Drawing the in-flight stage as solid would
 *                 claim the parcel has left when it has not, and drawing all four
 *                 as one fill would claim it has arrived.
 *   State 04      NOTE. ONE centred column and no card. It used to be a white
 *                 rounded panel with a shadow and a hairline ring, inset inside
 *                 this section's warm-grey canvas, inside the glass window - four
 *                 nested boxes for a six-line message, the two innermost of them
 *                 about three percent apart in lightness. The card is gone; see
 *                 the note in the panel for the measured cost and the lever if
 *                 the object reading is wanted back. The column carries the
 *                 delivery date in `text-eyebrow uppercase text-eyebrow-gray`,
 *                 the greeting at `text-h3 font-bold tracking-tight`, the
 *                 message at `text-body text-charcoal/70`, the sign-off in the
 *                 accent, then ONE hairline and the review block. The delivery
 *                 date's tracking comes from the token rather than a utility:
 *                 `text-eyebrow` already sets 0.08em at weight 700.
 *   Mockup a11y   THE VIEWPORT IS `aria-hidden="true"`, and it has to be. It
 *                 contains no claim about the service — a date, six clock times,
 *                 a consignment reference, a first name — and read aloud as
 *                 "FN-4821, In transit, arriving Monday the 16th" it would be a
 *                 fabricated status update in a screen reader. It is hidden from
 *                 assistive tech WITHOUT hiding the CTA, which is why the
 *                 attribute sits on the viewport and not on the frame: an
 *                 `aria-hidden` ancestor of a focusable control is itself the
 *                 violation. What a screen reader gets instead is the rail — all
 *                 four titles and summaries present at once — plus one per-step
 *                 button, which is a complete account of the section.
 *   Panel CTA     `ButtonLink variant="primary"` with
 *                 `ArrowRightIcon className="h-4 w-4"`, now in a `shrink-0`
 *                 footer below a `border-t border-charcoal/10`. KEPT, even
 *                 though the directive only asked for a mockup: these are the
 *                 only route out of the band. They are NO LONGER four
 *                 different destinations - steps 01, 03 and 04 all point at
 *                 `/contact` and only step 02 goes to `/gifts`. That happened
 *                 when `app/case-studies` was deleted: 03 and 04 had been
 *                 pointing at it, and 03's label moved to "See How We Deliver"
 *                 at the same time. So what these four buttons are for now is
 *                 not route choice but label choice - each names the step's own
 *                 outcome, and the reader takes that as the meaning of the
 *                 destination. Per-step labels and hrefs stay in data.
 *   Copy removed  `step.body` and `step.specs` are NO LONGER RENDERED. This is
 *                 a real loss and it is the cost of the directive, not an
 *                 oversight: sixteen sentences of genuine copy stop appearing on
 *                 the page. They are untouched in `lib/data.ts` because that is
 *                 site copy and other surfaces may still want it. Nothing was
 *                 substituted for them in the panel — a restatement of
 *                 `step.summary` there would be the duplicate-heading bug this
 *                 file already deleted once, three columns further left.
 *   Old image     The four step illustrations and the 5/7 split are gone from
 *                 this section, along with the local `IMAGE_FOCUS` map that
 *                 fed them. The JPEGs are untouched in
 *                 `public/images/how-it-works/` and `image` / `imageAlt` /
 *                 `imageFocus` are untouched in `lib/data.ts` — nothing is
 *                 deleted on the strength of one layout change. What the split
 *                 bought, incidentally, was the reason the text was cramped: a
 *                 five-column copy column measures ~220px at 1024px, and the
 *                 measure notes that used to live here no longer apply, because
 *                 there is no running copy column left to constrain.
 *   Palette note  the requested `bg-white/80` resolves to `bg-surface/80`
 *                 (#ffffff at 80% — exact), `shadow-xl` to `shadow-elev-3`
 *                 (0 16px 48px at 18%, the deepest elevation this project
 *                 defines), `border-slate-200/80` to `border-charcoal/10` (the
 *                 project's own hairline, `border-charcoal/` already being the
 *                 house rule in eight components), and `rounded-2xl` is left at
 *                 the frame's existing `rounded-3xl` rather than dropping two
 *                 steps — the rail pill beside it is `rounded-card`, and a frame
 *                 tighter than the object next to it reads as an afterthought.
 *                 This project defines no `--color-slate-*` in `@theme`.
 *
 * MOBILE ACCORDION — what this section is below `md`, and the one place it
 * is not a clone.
 *
 * Below the breakpoint this section renders a DIFFERENT LAYOUT from the same
 * data: a stack of four step rows, each of which opens its own card in place.
 * That is not a preference for one layout over the other; it is that the
 * cloned layout does not work at this width. The grid is twelve columns only
 * from `lg`, so below `md` the rail and the panel were stacked, and the result
 * was four chip rows occupying the top half of a phone screen and a single
 * 480px-floor window occupying the bottom half - a reader had to scroll to get
 * from a step's name to that step's detail, and three of the four windows
 * they scrolled past were not theirs.
 *
 * WHAT IS SHARED, and it is a longer list than it looks:
 *
 *   - `activeIndex`. One integer for the whole section, so exactly one of the
 *     two layouts has an open row, and "open the card" is the same event in
 *     both.
 *   - `StepWindowBody`, extracted in this pass out of the tabpanel map. This is
 *     what makes the two layouts honest: it is the SAME chrome bar, the SAME
 *     four card states, the SAME `data-hiw-live` scenes and the SAME per-step
 *     CTA. The only prop that differs is `fill`, and it is the difference
 *     between filling a window of a known height and being as tall as its
 *     content.
 *   - The chip treatment, its node, the timeline rule and its `pl-6`, and the
 *     four titles and summaries — all from `lib/data.ts` as before.
 *
 * WHAT DIFFERS, deliberately:
 *
 *   - POSITION. Card under its own row instead of beside the rail.
 *   - SEMANTICS. The accordion is a DISCLOSURE, not a tablist: `aria-expanded`
 *     and `aria-controls`, four separate tab stops, no roving tabindex, no
 *     arrow keys. Tabs and disclosures are not interchangeable and a tablist
 *     whose panels are stacked below their own tabs is neither.
 *   - MOTION. `AnimatePresence` + `motion.div` animating `height: auto`, where
 *     the panel stack crossfades four windows that never move. The rows below
 *     the open one are pushed, which is the whole point of the layout and is
 *     not expressible as an opacity change.
 *   - THE AUTO-ADVANCE IS OFF below `md`. Rotating a reader's open card six
 *     seconds after they deliberately opened it, on a touch device, mid-scroll,
 *     is not a feature.
 *
 * WHAT IT COSTS, since nothing here is free. Both trees are in the document at
 * every width - the breakpoint is CSS, so there is no hydration mismatch and no
 * re-render on resize - which means below `md` the four desktop windows and
 * their mockups are mounted and `display: none`. That is DOM weight and nothing
 * else: no layout, no paint, no network, because those images are already in
 * the cache for the accordion to share. The alternative, rendering one tree or
 * the other in JS, costs a hydration mismatch on every phone that loads the
 * page, which is a worse trade than some hidden divs.
 *
 * `DESKTOP_QUERY` above is the one place the two halves of that arrangement
 * have to agree, and it is why there is a media query in this file at all.
 *
 * The interaction is copied whole, because that is half of "overall design and
 * implementation": `role="tablist"` + `aria-orientation="vertical"`,
 * `role="tab"` + `aria-selected` + `aria-controls` + a roving tabindex,
 * `role="tabpanel"` + `aria-labelledby` + `inert` on the inactive panels,
 * Arrow/Home/End, an auto-advance that pauses ONLY for the pointer, a
 * simultaneous crossfade of opacity and scale, and full manual control under
 * `prefers-reduced-motion`. Two components sharing one keyboard contract is the
 * point; if these ever diverge it is a bug. The clause "two components" is about
 * `ComplianceAssurance`; it does not describe what happens below `md`, where
 * this section stops being tabs at all and becomes a disclosure — a different
 * pattern, deliberately, and not a divergent copy of this one.
 *
 * ONE DELIBERATE DIVERGENCE, recorded here because the paragraph above says
 * divergence is a bug and this one is not. `ComplianceAssurance` still dwells
 * 7000ms; this one dwells 4500ms. The dwell is presentation, not contract — no
 * ARIA state, no keyboard behaviour and no markup depends on it — and the two
 * sections are not side by side, so matching them buys nothing a reader can
 * perceive. The keyboard contract above, by contrast, is shared wholesale and
 * must stay identical.
 *
 * THE ONE PLACE THIS FILE ADDED SOMETHING COMPLIANCE DID NOT: the panel CTA.
 * When this pass started, compliance ended its panel with "Request an audit
 * report" and this one ended with a link to /contact, which was the same
 * destination as step 01 in the menu beside it. Compliance has since moved to
 * per-pillar CTA labels, so the two now match in kind as well as in layout -
 * each panel renders its own label from data - and this file goes one step
 * further and varies the destination too. All four steps are now reachable,
 * which they were not while every button pointed at /contact.
 *
 * DATA. `steps` in `lib/data.ts` gained `titleAccent`, `summary` and `specs` to
 * fill the reference's slots, mirroring `compliancePillars`, and later gained
 * `image`, `imageAlt`, `imageFocus`, `ctaLabel` and `ctaHref` for the
 * illustration and the contextual CTA. It is an UNTYPED array literal, so
 * there is no interface to
 * extend and no compile-time check that all four steps agree on their fields -
 * which is why the four shapes were verified by counting them, not by trusting
 * `tsc`. Every pre-existing `body` string is preserved verbatim in that file;
 * what this pass changed is that the panel no longer renders `body` or `specs`
 * — see the copy-removed note above. The mockup's own content lives in
 * `STEP_DEMOS` above, keyed by the same `number`, precisely so that
 * illustrative strings do not have to be stored as if they were copy.
 *
 * The one inherent trade-off, which is not a deviation but a consequence: only
 * ONE step's detail is visible at a time, because that is what the reference
 * does. A grid showed all four at once. The four chips stay on screen and the
 * auto-advance pitches them without a click, so the sequence is still
 * discoverable — but a reader who wants to read all four in order has to click
 * through. That is the desktop. Below `md` the auto-advance has been dropped —
 * the accordion above explains why — which leaves the four step rows and their
 * summaries visible and every card closed behind a tap, so the same trade-off
 * is paid one step at a time rather than all at once.
 */

/* ==========================================================================
   THE WINDOW'S INTERIOR, EXTRACTED BECAUSE THERE ARE NOW TWO PLACES THAT NEED IT.

   `StepWindowBody` is the three bands that used to be written inline inside the
   tabpanel map - the chrome bar, the viewport and the footer - with nothing else
   moved. It exists because the mobile accordion has to render the SAME step
   card under its own step row, and the alternative was a second hand-written
   copy of seven hundred lines of mockup JSX: two copies of four card states, two
   copies of four `data-hiw-live` scenes, two copies of four footers, and no
   mechanism that could keep any of them in step with the other three.

   The desktop call site keeps the window frame, the tabpanel semantics and the
   scene trigger; this component starts where the frame starts, at the chrome
   bar.

   ONE PROP CHANGES THE LAYOUT, and it is `fill`. On the desktop the body sits
   inside an absolutely positioned window of a known height and must cover it,
   which is what `min-h-full` is for - and `min-h-full` is also the box the panel
   measurement reads `scrollHeight` through, so the desktop call passes `fill`
   and `contentRef` and the accordion calls with neither. Inside the accordion
   there is no window to fill and no stack to measure: the card's height is
   whatever its content turns out to be, which is the whole point of a card that
   expands a row rather than occupying a fixed panel.

   EVERYTHING ELSE IS SHARED, deliberately and without exception - the same four
   demo states, the same chrome bar, the same per-step footer CTA. A phone
   reader who opens step 03 sees exactly the card a desktop reader sees when
   step 03 is the selected tab, which is the one thing a "same section, smaller"
   refactor has to guarantee and the one thing that is impossible to maintain by
   hand across two copies.
   ========================================================================== */
function StepWindowBody({
  step,
  fill = true,
  contentRef,
}: {
  step: (typeof steps)[number];
  /**
   * `true` on the desktop, where the body fills an absolutely positioned window
   * and is measured from. Omitted by the accordion, where the height is the
   * content's own - see the note above.
   */
  fill?: boolean;
  /**
   * Desktop only: the box `HowItWorks` measures the panel stack from. Present
   * on the desktop call site because that measurement is read in a layout
   * effect against `scrollHeight`, and a box that fills its parent reports the
   * parent's height back, which is the circularity the effect documents.
   */
  contentRef?: (node: HTMLDivElement | null) => void;
}) {
  /* One lookup, one source of truth. A missing key would hand back
     `undefined` and crash the render rather than showing a blank window, which
     is the correct failure: a blank window would be invisible and the missing
     state would not be noticed.

     Resolved HERE rather than at the call sites so that the desktop panel and
     the mobile accordion cannot disagree about which demo belongs to which step
     - the two would be free to drift apart the moment a call site wanted a
     different scene. */
  const demo = STEP_DEMOS[step.number];

  /* Scene 04's quote, resolved here rather than inside the note branch because
     a `const` cannot be declared inside the JSX expression that branch is
     written as. Indexed rather than copied, for the reason on the demo entry:
     it is real published copy that already renders elsewhere on the site, so
     the only thing this file needs to carry is WHICH one. `undefined` here means
     the note renders without a bubble, which is the intended failure and not a
     crash. */
  const quote =
    demo.kind === "note" ? testimonials[demo.testimonialIndex] : undefined;

  return (
    /* THE COLUMN IS THE MEASUREMENT BOX, and it is the one box in here that is
       allowed to be measured rather than to fill. `min-h-full` resolves against
       this window's definite height, so the column always covers the frame edge
       to edge; the viewport below is `flex-1`, so it takes whatever the chrome
       bar and the footer do not need. The measurement reads `scrollHeight`
       precisely because of that fill - see the effect above, which explains why
       `getBoundingClientRect()` here would be circular.

       Both of those sentences are about `fill`, and on the accordion there is no
       window and no measurement: the same column, `flex-col` with no fill, and
       its height is whatever its content is. Everything below the tag is shared
       by both callers unchanged, insets included.

       All three bands share one horizontal inset, `px-6 md:px-8`, so the chrome
       bar, the canvas and the footer's button all start on the same line down the
       frame. The canvas is inset a further 20px inside the viewport, which is
       what separates "the window" from "the panel inside the window". */
    <div
      ref={contentRef}
      className={fill ? "flex min-h-full flex-col" : "flex flex-col"}
    >
      {/* ── CHROME BAR ─────────────────────────────────────────── */}
      {/* THE THREE DOTS AND NOTHING ELSE.

          The bar used to carry a fake browser address:
          "fulfillnest.com/book", ".../shortlist", ".../track",
          ".../thanks". Four URLs to pages that either do not
          exist or are not what they claim - `fulfillnest.com/
          track` in particular promised a tracking tool, and the
          card it sat on is the one that says the parcel is still
          in transit. A plausible-looking URL on a mockup reads as
          a link, and a reader who tries one lands on a 404 or on
          the wrong page. Invented addresses are the kind of detail
          that makes a demo read as a screenshot of something real
          when it is not.

          So the `windowLabel` field is gone from all four demo
          types, not just hidden at the call site: leaving it in the
          data would leave a string in the bundle that nothing
          renders, and the next person to find the field would have
          no way to know why it exists.

          WHAT THE BAR IS NOW. `justify-center` on the row is
          load-bearing and replaces a 42px spacer that used to
          balance the URL pill against the dots - the address text
          was centred on the space beside the dots and sat visibly
          left of the frame's centre line. With the pill gone there
          is nothing to balance, and without centring the dots
          would sit hard against the left padding and read as a
          misaligned element rather than as window chrome.

          The dots alone still say "this is a window". They are
          10px across, `aria-hidden`, and cost one element. */}
      <div className="flex shrink-0 items-center justify-center border-b border-charcoal/10 px-6 py-4 md:px-8">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
      </div>

      {/* ── VIEWPORT ────────────────────────────────────────────── */}
      {/* Hidden from assistive tech, and ONLY the viewport. The CTA
          lives outside it, because an `aria-hidden` ancestor of a
          focusable control is its own violation. See the header note
          for why a date, six clock times and a consignment reference
          must not be announced as if they were real. */}
      <div
        aria-hidden="true"
        className="flex flex-1 flex-col p-6 md:p-8"
      >
        <div className="flex flex-1 flex-col justify-center rounded-card bg-warm-grey/60 p-5 md:p-7">
          {demo.kind === "calendar" && (
            /* ── 01 CONSULTATION ─────────────────────────────────
               Five days on a 5-column grid, then six slots on a
               3-column grid. Both selected states invert the chip:
               the day fills, the slot is outlined, because a day is
               the primary choice and a slot refines it - two filled
               chips side by side would claim two selections. */
            <div className="flex flex-col gap-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-body-lg font-bold tracking-tight text-charcoal">
                  {demo.month}
                </p>
                <p className="text-eyebrow text-charcoal/60">
                  Asia/Kolkata
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {demo.days.map((day, dayIndex) => {
                  /* SCENE 01 · the day cursor. The glyph is a child
                     of the tile it is going to click, so its target
                     is the tile's own centre and nothing has to be
                     measured. The alternative was refs and
                     `getBoundingClientRect` per tile, which is a
                     layout read on every resize for a decoration.

                     `relative` here is inert on its own - it only
                     establishes the containing block the absolutely
                     positioned cursor, ring and badge hang from.

                     All three are children of a tile that is
                     already `aria-hidden` inside a panel that is
                     `inert` on the desktop and not in the document
                     at all on mobile, so they carry no semantics
                     and the cursor takes `pointer-events-none` so
                     it can never intercept anything.

                     The badge hangs BELOW the tile rather than
                     over it, into the 20px `gap-5` between this
                     grid and "Available times". Over the tile it
                     would have to sit on the weekday text: at
                     375px these tiles are about 55px wide and a
                     nine-pixel "Selected" is roughly 40 of them. */
                  const picked = dayIndex === demo.selectedDay;

                  return (
                    <div
                      key={day.date}
                      className={`relative rounded-card border px-2 py-3 text-center ${
                        picked
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-charcoal/10 bg-surface text-charcoal/60"
                      }`}
                    >
                      {picked && (
                        <>
                          <span className="hiw-ring pointer-events-none absolute inset-0 rounded-card border-2 border-brand-primary" />
                          <span className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
                            <SelectCursorIcon className="hiw-cursor h-5 w-5" />
                          </span>
                          <span className="hiw-badge pointer-events-none absolute left-1/2 top-full mt-1.5 rounded-full bg-brand-primary px-1.5 py-0.5 text-[9px] font-semibold leading-none text-white">
                            Selected
                          </span>
                        </>
                      )}
                      <span className="block text-eyebrow uppercase opacity-70">
                        {day.weekday}
                      </span>
                      <span className="mt-1 block font-mono text-lg tabular-nums">
                        {day.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-eyebrow uppercase text-eyebrow-gray">
                Available times
              </p>

              <div className="grid grid-cols-3 gap-2">
                {demo.slots.map((slot) => {
                  /* The same three parts again on the chosen slot,
                     with the `--slot` modifiers that replace the
                     400ms lead-in with 2200ms, 4300ms and 4400ms so
                     the second action reads as a second action. The slot's own
                     resting treatment is already an outline rather
                     than a fill - the file's reason is that a filled
                     day and a filled slot side by side would claim
                     two selections - and the animation does not
                     change that. */
                  const picked = slot === demo.selectedSlot;

                  return (
                    <div
                      key={slot}
                      className={`relative rounded-card border px-2 py-2.5 text-center font-mono text-body-sm tabular-nums ${
                        picked
                          ? "border-brand-primary bg-surface text-brand-primary ring-1 ring-brand-primary"
                          : "border-charcoal/10 bg-surface text-charcoal/60"
                      }`}
                    >
                      {picked && (
                        <>
                          <span className="hiw-ring hiw-ring--slot pointer-events-none absolute inset-0 rounded-card border-2 border-brand-primary" />
                          <span className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
                            <SelectCursorIcon className="hiw-cursor hiw-cursor--slot h-5 w-5" />
                          </span>
                          <span className="hiw-badge hiw-badge--slot pointer-events-none absolute left-1/2 top-full mt-1.5 rounded-full bg-brand-primary px-1.5 py-0.5 text-[9px] font-semibold leading-none text-white">
                            Selected
                          </span>
                        </>
                      )}
                      {slot}
                    </div>
                  );
                })}
              </div>

              <p className="text-body text-charcoal/60">
                {demo.footnote}
              </p>
            </div>
          )}

          {demo.kind === "bundle" && (
            /* ── 02 CURATE ───────────────────────────────────────
               Three REAL catalog entries by index - names, prices
               and paths come from `products`, so this cannot drift
               out of sync with the catalog page the way a hardcoded
               prop list would. Those files are already served on the
               home page, so the state costs no new bytes.

               `alt=""` on every thumbnail is correct here and not a
               shortcut: the product name is set immediately beneath
               the picture, and the whole viewport is hidden from
               assistive tech. A description would be read twice. */
            <div className="flex flex-col gap-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-body-lg font-bold tracking-tight text-charcoal">
                  {demo.heading}
                </p>
                <p className="text-eyebrow text-charcoal/60">
                  {demo.footnote}
                </p>
              </div>

{/* SCENE 02 · the product grid the cursor selects
                  from. Still new FLOW content rather than an
                  overlay, for the reason that has not changed:
                  the only place with room is a row of its own.

                  The obvious placement was the picked product card -
                  it already has relative-able markup, and a cursor
                  pressing it is exactly what the card depicts. It
                  cannot be done: the card is aspect-square, so
                  anything big enough to read covers most of the
                  product photograph, and this panel's whole claim
                  is that the mockups are REAL. Covering a real
                  photograph to illustrate a click on a real product
                  trades the panel's substance for its decoration.

                  The second candidate was the header row's empty
                  middle, which is about 518px wide at 1280. That
                  also fails, and for a different reason: the same
                  row already overflows at 375px, where the heading
                  and the footnote together are about 310px against
                  287px of space. Anything in the middle of that row
                  collides with the copy on phones, which is exactly
                  where the section is most likely to be read.

                  So it gets a row between the header and the cards.
                  64px of tiles, 8px more than the drawing this
                  replaces, plus the 20px gap-5 already separating
                  the rows. It is given no surface of its own - a
                  panel or a tinted box here would be a card inside
                  a card inside a window.

                  THE TILES ARE PLACEHOLDERS, NOT PRODUCTS. A
                  minimal three-tile row of outlined discs reads as
                  "three things to choose from" without inventing
                  imagery that could be mistaken for catalog stock
                  sitting a few inches above three real product
                  photographs. The same glyph repeats in all three
                  on purpose: three DIFFERENT marks would read as
                  three shapes rather than as three candidates, and
                  repeating them is what makes the row read as a
                  grid of one kind of thing.

                  `--hiw-pick-pct` is the picked tile's centre as a
                  percentage of the row, derived from `selected`
                  rather than written down, so re-picking a different
                  product moves the cursor with it. The CSS block
                  has the reasoning for why it is a percentage and
                  not a pixel count. */}
              <div className="flex items-center justify-center">
                <div
                  className="relative inline-flex items-center gap-4"
                  style={
                    {
                      "--hiw-pick-pct": `${
                        ((demo.selected + 0.5) / demo.productIndex.length) * 100
                      }%`,
                    } as CSSProperties
                  }
                >
                  {demo.productIndex.map((productIndex, tileIndex) => {
                    const picked = tileIndex === demo.selected;

                    return (
                      <span
                        key={productIndex}
                        className={`relative flex h-16 w-16 items-center justify-center rounded-card border ${
                          picked
                            ? "border-brand-primary/40 bg-surface"
                            : "border-charcoal/10 bg-surface"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                          className="h-7 w-7"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="5.5"
                            className="stroke-charcoal/25"
                            strokeWidth="1.5"
                          />
                        </svg>

                        {picked && (
                          /* RING ONLY. The tick that used to sit
                             here is gone.

                             It was on this tile because this
                             tile is `demo.selected`, and the
                             picked product card below is
                             `products[demo.selected]` - so the
                             tick landed directly above the
                             "Everyday Appreciation Box"
                             photograph, which is exactly where a
                             badge reads as a sticker on the photo
                             rather than as part of the UI.

                             WHAT IT COST. The tick was the scene's
                             only PERSISTENT outcome: the cursor
                             glided, pressed and left, the ring
                             flashed and went, and the tick stayed to
                             say which tile had been chosen. With it
                             gone the tile row at rest says nothing,
                             and the scene is now motion with no
                             resting result - a departure from the
                             block's standing rule that every resting
                             state is the finished screenshot.

                             IT LOSES NOTHING, because the selection
                             was already being stated twice and now
                             says itself once. The real product card
                             carries an accent border AND a ring on
                             "Everyday Appreciation Box", on the
                             photograph itself, in the position a
                             reader will look. The tick was the same
                             fact a second time, in placeholder
                             artwork, in the wrong place.

                             `TickIcon`, `hiw-tick-in` and this
                             trigger are all removed rather than
                             left dormant - see the component and the
                             CSS block. */
                          <span className="hiw-ring hiw-ring--pick pointer-events-none absolute inset-0 rounded-card border-2 border-brand-primary" />
                        )}
                      </span>
                    );
                  })}

                  {/* The cursor is a child of the ROW, not of the
                      picked tile. Inside the tile it would need a
                      travel distance equal to the tile's own offset
                      from the row's left edge, and CSS cannot see
                      that width; on the row, `left` in a percentage
                      IS that offset. `left-0` in the class list is
                      load-bearing for the resting state: without it
                      an absolutely positioned child with no `left`
                      falls back to its static position, which here
                      is after the last tile, and the cursor would sit
                      visibly at the right of the row for the whole
                      dwell. */}
                  <span className="hiw-glide pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2">
                    <SelectCursorIcon className="hiw-press h-5 w-5" />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {demo.productIndex.map((productIndex, cardIndex) => {
                  const product = products[productIndex];
                  if (!product) return null;
                  const picked = cardIndex === demo.selected;

                  return (
                    <div
                      key={product.id}
                      className={`overflow-hidden rounded-card border bg-surface ${
                        picked
                          ? "border-brand-primary ring-1 ring-brand-primary"
                          : "border-charcoal/10"
                      }`}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 220px, 45vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-eyebrow font-semibold leading-snug text-charcoal">
                          {product.name}
                        </p>
                        <p className="mt-1 font-mono text-eyebrow text-charcoal/60">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

{demo.kind === "tracking" && (
            /* ── 03 FULFIL & TRACK ───────────────────────────────
               Progress is three states, not one. Segments before
               `reached` are solid, the segment AT it is 35% - that
               is the one in flight - and the rest are inert. That
               is where the parcel IS, it is not a summary of the
               journey, and it is the only part of this panel that
               rests anywhere.

               The bars and the labels read from the same index on
               the same array, so they cannot disagree.

               SCENE 03 · the journey, over the top of it. A 5000ms
               accent sweep crosses the full track and four nodes
               light as it passes, then all of it fades and the
               card is exactly as it is with animation off.

               That the sweep does NOT HOLD is the one substantive
               disagreement with the brief, which asks for all four
               stages to light. Lighting Delivered and leaving it
               lit puts a delivered parcel directly above a status
               pill reading "In transit" and an ETA reading
               "Arriving Monday 16 November" - in the one card on
               this section that is making a claim about tracking.
               Shown once and withdrawn, it is a demonstration
               playing; shown and held, it is a contradiction. The
               brief's version has the contradiction permanently
               rather than for five seconds.

               SO THE SWEEP AND THE NODES ARE BOTH TRANSIENT, and
               the bars underneath are untouched. That is why the
               previous version of this scene's `--hiw-track-end`
               and its truck are gone: there is no destination to
               derive, because the fill goes the whole way and then
               leaves.

               THE NODES ARE PIPS, which reverses an earlier
               decision in this file and the CSS block has the
               reasoning. Briefly: white-filled with an accent ring
               rather than accent-filled, so they read on a solid
               bar and an inert one alike; and they are not a second
               marker row, because the bars say WHERE IT IS and
               these say THE JOURNEY, which are not the same
               statement and cannot be merged without one of them
               lying.

               `relative` is inert on its own; it is the containing
               block that lets the sweep and the pips be placed by
               percentage of the track rather than by a measurement
               in JS. */
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-body text-charcoal/60">
                  {demo.reference}
                </p>
                <span className="rounded-card bg-brand-primary px-3 py-1 text-eyebrow font-semibold text-white">
                  {demo.status}
                </span>
              </div>

              <div className="relative flex gap-1.5">
                {demo.stages.map((stage, stageIndex) => {
                  /* `lit` and `inflight` are mutually exclusive
                     by construction, so the in-flight class can
                     never also carry the lit one and fight itself
                     over one property. */
                  const lit = stageIndex < demo.reached;
                  const inflight = stageIndex === demo.reached;

                  return (
                    <span
                      key={stage}
                      className={`h-1.5 flex-1 rounded-full ${
                        lit
                          ? "bg-brand-primary"
                          : inflight
                            ? "bg-brand-primary/35"
                            : "bg-charcoal/10"
                      }`}
                    />
                  );
                })}

                {/* THE SWEEP. Above the bars, below the pips. It is
                    `origin-left` because the keyframe scales X and
                    a scale about the centre would grow both ways
                    and run off the left end of the track. */}
                <span className="hiw-sweep pointer-events-none absolute inset-y-0 left-0 z-10 w-full origin-left rounded-full bg-brand-primary" />

                {/* THE FOUR NODES. `left` in a percentage, because
                    a percentage on `translateX` would resolve
                    against the pip's own 10px. Node `i` of `n`
                    sits at `i / (n - 1)` of the row, which is the
                    same arithmetic the previous truck used and
                    the reason the four pips line up with the four
                    bars underneath them.

                    Every stage gets one, including the two the
                    bars say have not happened, because the whole
                    point of the sweep is that it visits all four.
                    White fill with a muted ring at rest: an accent
                    pip would vanish into the two accent bars. */}
                {demo.stages.map((stage, stageIndex) => (
                  <span
                    key={stage}
                    className="hiw-node pointer-events-none absolute top-1/2 z-20 h-2.5 w-2.5 rounded-full border border-charcoal/25 bg-surface"
                    style={
                      {
                        "--hiw-stage": stageIndex,
                        left: `${
                          (stageIndex / (demo.stages.length - 1)) * 100
                        }%`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>

              <ol className="flex gap-1.5">
                {demo.stages.map((stage, stageIndex) => (
                  <li
                    key={stage}
                    className={`flex-1 text-eyebrow leading-snug ${
                      stageIndex <= demo.reached
                        ? "font-semibold text-charcoal"
                        : "text-charcoal/60"
                    }`}
                  >
                    {stage}
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-1 border-t border-charcoal/10 pt-5">
                <p className="text-body font-medium text-charcoal">
                  {demo.eta}
                </p>
                <p className="text-body text-charcoal/60">
                  {demo.carrier}
                </p>
              </div>
            </div>
          )}

{demo.kind === "note" && (
            /* ── 04 CELEBRATE ───────────────────────────────────
               NO CARD. The note used to sit on its own white
               rounded panel with a shadow and a hairline ring,
               inside a warm-grey canvas, inside a frosted window,
               inside a section. That is four nested boxes for one
               short message, and the two innermost were within
               about three percent of each other in lightness, so
               the reader was being asked to read a border that
               was doing almost no work. The card is gone: the
               note now renders straight onto the canvas, and the
               only rule left inside the panel is the divider
               above the review block.

               WHAT THAT COSTS, MEASURED, because it is not free
               and it is not obvious. Composited, the canvas is
               roughly rgb(249 247 241) - #f7f4eb at 60% over the
               window's 80%-white over #f1eee7 - against the card's
               plain #ffffff. That is a three-percent lightness
               difference and roughly half a point of contrast
               against charcoal, which is to say the note will
               read as part of the canvas rather than as an object
               sitting on it. If the object reading is wanted back,
               the lever is the CANVAS getting darker, not a card
               coming back; `bg-warm-grey/60` at full strength
               would put about eight points of separation under
               the note and would still be one box instead of two.

               `items-center` inside the canvas is what centres
               the column vertically in whatever height the stack
               has settled on, without the column needing a
               height of its own.

               `max-w-md` is the whole measure - 448px - and the
               headline, the message and the quotation all share
               it. Before this pass the note had the full ~700px
               of the canvas and constrained only its own body
               copy; sharing one measure is what makes six stacked
               elements read as one column rather than as three
               unrelated centred lines.

               The quote in scene 04 is pulled out of
               `testimonials` rather than written here. A previous
               version of this scene refused to fill the bubble at
               all, on the grounds that the only way to fill one was
               to invent a testimonial and attribute it to a named
               recipient on a live page - which was right, and
               which turned out to have an obvious answer nobody had
               looked for: the site already publishes eleven real
               ones. Scene 04 now quotes one of those, with its
               real name, role and company, so there is nothing
               fabricated and nothing misattributed. The reasoning
               for WHICH of the eleven, including the name clash
               with this panel's recipient, is on the demo entry
               above.

               NO TRACKING UTILITY ON THE BADGE, which looks like
               an omission against the brief's "uppercase, muted
               tracking". The `text-eyebrow` token already sets
               0.08em of letter-spacing at weight 700, so the badge
               was already tracked; a `tracking-*` class would have
               overridden the token's own value and put one label
               on the page off its house spec. */
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-md text-center">
                <p className="text-eyebrow uppercase text-eyebrow-gray">
                  {demo.deliveredOn}
                </p>
                <p className="mt-3 text-h3 font-bold tracking-tight text-charcoal">
                  Thank you, {demo.recipient}
                </p>
                <p className="mt-3 text-body leading-relaxed text-charcoal/70">
                  {demo.message}
                </p>
                <p className="mt-5 text-eyebrow text-brand-primary">
                  {demo.signoff}
                </p>

                {/* SCENE 04 · the rating and the reply. Still new
                    FLOW content, and still for the reason that has
                    not changed: there is nowhere to put it that is
                    not the copy. Every other part of this section
                    is an overlay inside existing bounds; this one
                    cannot be, because any overlay large enough to
                    hold a five-line quotation lands on the message,
                    and a quote that opens over the note it is
                    reacting to is worse than no quote at all.

                    STACKED, NOT BESIDE, and that is this pass's
                    layout decision. The two parts used to sit on
                    one line - rating left, quote right - inside a
                    beige pill. With the pill gone the pairing
                    stopped making sense: a rating 24px from a
                    quotation at the same size reads as two things
                    next to each other, and a rating directly ABOVE
                    the quotation it is a rating OF reads as one
                    object. It also matches the rest of the card,
                    which is now a single centred column.

                    THE DIVIDER IS THE ONLY RULE LEFT IN THE
                    PANEL. It is `border-charcoal/10` - an 8%
                    charcoal tint, 10% on an already 10%-tinted
                    border - rather than the 60%-opacity grey tint
                    the brief names, because this theme has no grey
                    ramp: the project's neutral is charcoal and
                    every hairline in this file is the same token.
                    A greyer rule at 60% would have been the only
                    such value on the page.

                    THE QUOTE HAS NO BACKGROUND, NO RING AND NO
                    RADIUS, which is the point of the pass. It was
                    a beige pill inside a white card inside a warm
                    canvas, and the beige is only about four points
                    off the white it sat on - a box that cost a
                    border and a padding pair to say almost nothing.
                    The quotation now flows straight onto the canvas
                    and is held in place by the divider above it and
                    the measure around it.

                    `mt-6` is the gap between the rating and the
                    quote, which is a deliberate near-double of the
                    20px inside the column: the rating is the thing
                    the quote belongs to, so they sit closer
                    together than either sits to the sign-off.

                    `--hiw-pick-pct` still points at the LAST star,
                    and still means what it meant: it is a
                    percentage of the STAR ROW's own width, which
                    is why the row has to stay an `inline-flex` of
                    exactly the five stars, and why the centring
                    wrapper around it exists rather than the row
                    being centred by its parent. One pass down the
                    row with the stars filling in the cursor's wake
                    says "the reader gave this five" in 3.6 seconds,
                    which is what one dwell can hold. */}
                <div className="mt-8 border-t border-charcoal/10 pt-8">
                  <div className="flex justify-center">
                    <div
                      className="relative inline-flex items-center gap-1.5"
                      style={{ "--hiw-pick-pct": "90%" } as CSSProperties}
                    >
                      {[0, 1, 2, 3, 4].map((starIndex) => (
                        <StarIcon
                          key={starIndex}
                          className="hiw-star h-5 w-5"
                          style={
                            { "--hiw-star": starIndex } as CSSProperties
                          }
                        />
                      ))}

                      <span className="hiw-glide hiw-glide--stars pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2">
                        <SelectCursorIcon className="hiw-press hiw-press--stars h-5 w-5" />
                      </span>
                    </div>
                  </div>

                  {quote && (
                    /* The viewport is `aria-hidden`, and the panel
                       around it is `inert` on the desktop, so the quote is drawn,
                       not announced. It is real copy and it is read on the page -
                       by a reader with eyes - which is the only reader this panel
                       has ever had.

                       The attribution keeps its role and company
                       rather than shortening to the bare name, on
                       the same reasoning as the rest of the file's
                       copy: it is published text from
                       `lib/data.ts` and dropping half of it here
                       would make this the only place on the site
                       that renders that quote in a form the
                       testimonial section does not show. */
                    <blockquote className="hiw-bubble mt-6">
                      <p className="text-body leading-relaxed text-charcoal/80">
                        {quote.quote}
                      </p>
                      <footer className="mt-3 text-eyebrow text-charcoal/60">
                        {quote.name} · {quote.role}, {quote.company}
                      </footer>
                    </blockquote>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────
          The per-step CTA survived the refactor and is now the
          frame's only real control. `shrink-0` matters: without it
          the flex column would let the footer compress rather than
          the viewport give up room. */}
      <div className="shrink-0 border-t border-charcoal/10 px-6 pb-6 pt-5 md:px-8 md:pb-8">
        <ButtonLink
          href={step.ctaHref}
          variant="primary"
          ariaLabel={`${step.ctaLabel} — ${step.title}`}
        >
          {step.ctaLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  /* The one and only pause is the pointer over the RAIL, and it is a REF, not
     state. Two separate reasons it is a ref, and one separate reason it is
     scoped to the rail rather than the section — that one is on the handlers
     themselves, further down, and it was a visible bug.

     `hoveringRef` is read inside the interval tick rather than being an effect
     dependency, so crossing the boundary of the rail no longer tears the timer
     down and rebuilds it. It used to be `useState`, which meant every
     mouse-enter and mouse-leave re-ran the effect: the interval was destroyed
     and a fresh one started, so the dwell reset on every incidental pointer
     crossing. Restoring it also re-rendered the whole section, and a re-render
     is what can disturb the entrance state - see the note on `stackHeight`
     below. Nothing in this component reads `hovering` for rendering, so there
     is no reason for it to cause one. */
  const hoveringRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /* Which layout is DISPLAYED, as opposed to which one is in the document. Both
     are, always - see `DESKTOP_QUERY` - and this is only ever read where a
     behaviour cannot be expressed as a class.

     It starts `false` and is corrected in an effect, which means the first
     client render agrees with the server's and there is no hydration mismatch;
     the layout itself never waits for it, because the layout is `md:hidden` and
     `hidden md:*` and is correct from the server-rendered HTML. What waits one
     effect is the auto-advance and the indicator measurement, neither of which
     can be wrong for a frame - an interval that has not been created yet simply
     has not started, and an indicator that has not been measured is not
     rendered. */
  const [isDesktop, setIsDesktop] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /* The windows are absolutely positioned, so the container has no intrinsic
     height of its own — it would collapse to nothing and the page below would
     jump on every switch. This is the measured height it is pinned to, and
     `cardContentRefs` are the boxes it is measured from. See the stack note
     in the JSX for why the measurement reads scrollHeight rather than the
     window's own box. */
  const cardContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stackHeight, setStackHeight] = useState<number | null>(null);

  /* THE SLIDING INDICATOR'S measured box: where the active chip sits in the
     rail, and how tall it is. `null` until measured, and that null is load
     bearing — see the effect below and the note on first paint. */
  const railRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState<{
    top: number;
    height: number;
  } | null>(null);

  /* Respect the visitor's motion preference: no auto-advance under
     `prefers-reduced-motion`. Re-evaluated on change, so flipping the OS
     setting live stops or starts rotation accordingly. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* THE SAME SHAPE, ON THE LAYOUT QUERY. One effect, one source of truth, live
     re-evaluation on change so a reader who rotates a tablet or drags a window
     across the breakpoint gets the behaviour switch without a reload. Nothing is
     derived from it in the markup; the two layouts are chosen by CSS. */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* THE AUTO-PLAY TIMER. One interval, one owner, torn down by its own cleanup.
   *
   * The dependency is `[activeIndex, reducedMotion, isDesktop]` and nothing
   * else, and the whole point of the first is that the effect exists to be
   * RE-CREATED whenever the selection changes, so every step gets a full
   * `STEP_ADVANCE_MS` of dwell and a manual click restarts the clock by
   * construction.
   *
   * That is also why there is no `cycleReset` state any more. The old version
   * kept a second piece of state whose only job was to change identity when the
   * reader clicked a chip, purely so the dependency array would notice. It was
   * two sources of truth for one fact — "which step is showing" — and it
   * invited the bug it was meant to prevent: a click that landed on the
   * already-selected chip bumped nothing, no reset, and the reader's click
   * silently did not do what clicking is supposed to do. Keying on `activeIndex`
   * gives the same restart with no extra state and no edge case.
   *
   * `hoveringRef` is deliberately NOT a dependency. Read it inside the tick and
   * the clock simply declines to advance while the pointer is over the rail;
   * make it a dependency and every crossing of that boundary destroys and
   * rebuilds the interval, which resets the dwell as a side effect of the reader
   * merely reading.
   *
   * The pause is a skip, not a suspension. The interval keeps ticking and the
   * tick returns early, so the clock resumes from where it stopped instead of
   * restarting — a reader who parks on the rail for four of the 4.5 seconds gets
   * half a second, not another full dwell.
   *
   * `reducedMotion` AND `isDesktop` ARE DEPENDENCIES, and they are the only
   * other two. Without `reducedMotion`, flipping the OS motion setting would
   * leave the interval running for the rest of the page's life; without
   * `isDesktop`, a phone would keep rotating a section that is not displaying
   * it. Each is real state that really does change what this effect should do,
   * which is precisely the test for belonging in the list.
   *
   * The cleanup guarantees per mounted component that no interval outlives it.
   * React runs it before every re-run and on unmount, so the worst case is one
   * interval alive at a time — no accumulation, no double-speed rotation, and
   * nothing left running after the reader navigates away.
   */
  useEffect(() => {
    if (reducedMotion) return;
    /* NOT ON MOBILE, and this is the one place the mobile accordion changes
       behaviour rather than layout. The rotation is presentation for a layout
       where the step and its detail are SIDE BY SIDE: the chip beside the window
       is a summary, and advancing it under a reader who is halfway through
       reading that window is a slideshow nobody asked for.

       In the accordion the step and its card are the SAME THING, stacked. An
       unprompted rotation there would collapse the card out from under a reader
       who opened it deliberately, six seconds after they opened it, and push
       three rows up the page while they were reading - on a touch device, where
       the tap that opened the card is still fresh and the reader is most likely
       to be mid-scroll. The existing pointer pause cannot help: it is scoped to
       the RAIL's hover, and there is no hover on a phone.

       So the rotation is desktop-only, by way of the same media query that
       decides which layout is displayed. `isDesktop` is in the dependency list
       for the reason `reducedMotion` is: it is real state that really does change
       what this effect should do, so leaving it out would leave a phone rotating
       forever. */
    if (!isDesktop) return;

    const interval = window.setInterval(() => {
      if (hoveringRef.current) return;
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, STEP_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [activeIndex, reducedMotion, isDesktop]);

  /* Measure the tallest window and pin the container to it, before paint, so the
     section is never a frame short. The measurement reads each window's COLUMN
     box, not the window: the window is `h-full` (every window is the height of
     the tallest, so the stack reads as one panel), which means the window's own
     box can only ever report back the height we just handed it — measure that
     and you get the previous value forever.

     `scrollHeight`, not `getBoundingClientRect().height`, and this is the whole
     subtlety of the current layout. The column carries `min-h-full` so it fills
     the window whatever the window's height happens to be — without that, a
     short state would leave bare glass under its footer. But a filling box
     reports the height it was given, so `getBoundingClientRect()` here is
     circular: it would return the container's own height and the frame could
     never grow past its 30rem floor even if a state needed 560px.

     `scrollHeight` breaks the circle because it is the CONTENT box, not the
     border box: it returns `max(content, box)`. So it is exactly the content
     height when the content is taller than the window and exactly the window's
     height when it is not, which is the number the container wants either way.
     It is also an integer, which is a second line of defence on the churn guard
     described below.

     The trade is that the container cannot shrink once grown, because a filled
     column cannot report less than the fill. That is invisible here — the footer
     is pinned to the bottom by the flex column, so extra height reads as more
     viewport inside a window, which is what a window is for.

     A ResizeObserver over the four of them keeps the container right when
     anything rewraps at a narrower width, which a one-shot measurement on mount
     would get wrong the moment someone resized back up. `min-h` on the container
     covers the server-rendered frame, before this has run. */
  useLayoutEffect(() => {
    const measure = () => {
      const tallest = cardContentRefs.current.reduce((max, node) => {
        if (!node) return max;
        return Math.max(max, node.scrollHeight);
      }, 0);

      /* CLAMPED TO THE FLOOR BEFORE IT IS COMPARED. The container carries
         `min-h-[30rem]` as a class, but a measurement below that floor would
         be written as an inline `minHeight` in the same units and the two would
         fight over every frame the text rewrapped. Clamping here means this
         effect can never produce a value the class would immediately
         contradict, and there is one place where the floor is decided.

         The comparison is also done against the CLAMPED number, not the raw
         one. That is the churn guard: `measure` runs on every ResizeObserver
         tick, including the ones caused by its own output, so comparing raw
         values meant a sub-pixel difference re-armed state and re-rendered the
         section for nothing. `scrollHeight` is already a whole number of CSS
         pixels, so the `Math.round` here is belt-and-braces for the day the
         measurement source changes — the guarantee that a value has to actually
         move a pixel to cause a render should not depend on which property is
         being read. */
      if (tallest <= 0) return;

      const next = Math.max(Math.round(tallest), MIN_STACK_PX);
      setStackHeight((current) =>
        current !== null && Math.abs(current - next) < 1 ? current : next,
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    cardContentRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  /* WHERE THE INDICATOR GOES. One bar, moved — not four bars, three of them
     toggled. The previous implementation gave every chip its own absolutely
     positioned segment and showed only the active one, which is four bars that
     appear and vanish rather than one that moves: there was no path between
     step 01 and step 02 to animate, only two instant states.

     So the bar lives on the rail as a single element and its `top` and `height`
     are read off the active chip. `offsetTop` and `offsetHeight` are the right
     properties for this and the arithmetic-free choice. The rail is the chip's
     offset parent (it is the nearest positioned ancestor), and offsetTop is
     measured from that parent's PADDING edge — which is exactly the edge an
     absolutely positioned child's `top` is measured from, so the two agree with
     no correction term. Critically, `offsetTop` is layout truth: it stays
     correct through `lg:justify-between`, where the chips are distributed across
     whatever height the panel measurement produced. Any index-based arithmetic
     would have been wrong every time the column was taller than its content.

     Measured in a layout effect keyed on `activeIndex`, so it lands before the
     browser paints the new state and the bar never renders at the previous
     step's position first. A ResizeObserver on the rail and on all four chips
     covers the other way this can be wrong — a rewrap at a narrower width, or
     the window growing — which a one-shot read would miss.

     `null` is not a placeholder to be filled in after first paint, it is the
     reason the bar is CONDITIONALLY RENDERED. An element that exists with
     `top: 0; height: 0` and gains a transition in the same commit as its real
     values does animate: transitions are generated from the after-change style,
     not from whether a frame was actually painted. So the first measurement
     would have been seen as the bar sliding up the rail from the top on load.
     Rendering nothing until the box is known means the element is INSERTED with
     its final values, and an inserted element has no previous computed value to
     transition from — it simply appears in the right place. */
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    /* DESKTOP ONLY, and for a reason that is about numbers rather than about
       taste. Below the breakpoint the rail is `display: none`, so every chip
       reports `offsetTop: 0` and `offsetHeight: 0` - and this effect would
       happily write a zero-height bar at the top of a column nobody can see,
       then re-measure it on every observer tick of a hidden subtree. The bar is
       also not rendered below the breakpoint (see the render), so the state
       here is not merely useless below `md`, it is state nothing reads. */
    if (!isDesktop) return;

    const measure = () => {
      const chip = tabRefs.current[activeIndex];
      if (!chip) return;

      const top = chip.offsetTop;
      const height = chip.offsetHeight;

      /* Same churn guard as the height measurement, for the same reason: this
         runs on every observer tick, including ticks its own output causes. */
      setIndicator((current) =>
        current !== null && current.top === top && current.height === height
          ? current
          : { top, height },
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    tabRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [activeIndex, isDesktop]);

  function handleTabKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = steps.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;

    event.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  }

  /* Manual selection: choose the step, and that alone.
   *
   * There is deliberately no clock bookkeeping here. The old version of this
   * handler carried a second piece of state purely so that the interval's
   * dependency array would see a change on a click and rebuild itself — a
   * `cycleReset` counter that existed to be a no-op that wasn't. Keying the
   * effect on `activeIndex` instead means every selection, clicked or rotated,
   * restarts the dwell on its own, so this function has no reason to
   * write anything but the selection.
   *
   * Note what it does NOT do: it does not call `preventDefault`, and it does
   * not move focus. A click has already put focus on the chip it landed on, and
   * synthesising a second focus change here would fight the browser's own
   * behaviour. Keyboard activation is a different path with different needs —
   * `handleTabKeys` above moves focus deliberately, because ArrowDown has to
   * carry the reader with it or the roving tabindex would leave focus stranded
   * on a chip that is no longer selected.
   *
   * Clicking the ALREADY-selected chip is a no-op, and that is correct. There is
   * nothing to select, and with no `cycleReset` there is no clock to bump either:
   * the interval was rebuilt when this step became current, not when the reader
   * last touched a chip.
   */
  function handleStepSelect(index: number) {
    setActiveIndex(index);
  }

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      /* `scroll-mt-28 md:scroll-mt-36` is the offset for the site's FIXED
         navigation, and it is the whole reason this section can be a link
         target at all.

         The nav is `fixed` (`Navigation.tsx`), so a fragment link that resolves
         to this section puts the section's TOP EDGE at the top of the viewport -
         which is exactly where the nav is. Without the offset the reader arrives
         with the "How it works" eyebrow already hidden behind the floating bar,
         and the section appears to start at its first paragraph. The id alone
         makes the link WORK; the scroll margin makes it land READABLE.

         The two values are the house pair, used verbatim by every other
         cross-page hash target on the site - `ProductCatalog` for
         `#curated-catalog`, `PricingCalculator` for `#estimate`, `PricingTiers`,
         `SolutionsTabs` and `IndustriesList` - because they were all sized
         against this same nav, which shrinks on scroll. 112px on small
         viewports, 144px from the md breakpoint up.

         This is a property of the TARGET, not of the link, and that is why it
         belongs here rather than on the footer href: a second link to this
         section - a nav entry, an in-page jump, anything added later - gets the
         offset for free, exactly as the six sections above do. */
      className="relative scroll-mt-28 overflow-hidden border-y border-section-divider bg-linen py-section md:scroll-mt-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Added at a later pass: two bands on the home page whose
            `SectionHeading` carried no `description`, so both were one centred
            heading with no lead paragraph at all. A hand-placed `<p>` inside the
            heading made the vertical spacing automatic rather than hand-tuned,
            and the content grid's `gap-4` at the reference breakpoint was
            widened to `gap-8` so the gap the heading now owns is a grid concern
            and not a margin on one element.

            The grid's `data-reveal-stagger` is what makes the heading's own
            entrance work here: the stagger walks this container's DIRECT
            CHILDREN, and the heading plus the content grid are the two of them,
            so they arrive 100ms apart. No marker is placed on either child.

            The description names all four steps in order and borrows their own
            summary words, so the sentence under the heading and the chips beside
            it are describing the same sequence in the same vocabulary. Above
            that it adds one claim — that the band is accountable to the end —
            which is a fact about this site's own process, not a figure or a
            timeframe, so nothing here is claimed, timed or guaranteed that the
            steps themselves do not already promise. */}
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title={
            /* ONE accented word, and it is the last one. This read
               `<em className="accent-em">record time</em>` - two words in the
               accent - which made "in" the hinge of the sentence carry no
               emphasis and turned the accent from a single beat into a phrase.
               `time` alone is the claim the title is making; `record` is
               qualifier.

               `accent-em` rather than a literal Tailwind red italic
               at the call site: that utility already sets italic, weight 500 and
               `var(--color-brand-primary)`, and #a83b24 is this section's own
               accent - the same value it uses for the status pill, the lit bars
               and the tracking sweep. A hard-coded palette red here would be the
               only un-tokenised colour in the heading. */
            <>
              From brief to celebration in record{" "}
              <em className="accent-em">time</em>
            </>
          }
          description="Four steps from first call to delivered gift: we scope the moment, hand-pick the options, handle fulfilment and tracking end to end, and stay accountable until it arrives."
        />

        {/* THE MOBILE ACCORDION, and the whole of this section below `md`.
            Two differences from the tabbed layout beside it, and only two.

            The step and its detail are ONE STACKED OBJECT rather than a rail
            beside a panel. Below `md` the grid wrapper is a SINGLE COLUMN - it
            only becomes twelve columns at `lg` - so the tabbed layout at this
            width was four chip rows, each with its own card-sized padding, and
            then one window at least 480px tall that the reader had to scroll
            past to reach anything else. Every step's detail was a separate
            scroll's worth of travel away from the line that named it, and all
            four summaries were on screen at once with none of the four windows.

            So each row here is its own step point, and opening it drops that
            step's own card directly underneath, pushing the rows below it down
            the page. That is the whole reason this block exists.

            And the AUTO-ADVANCE IS OFF, which is a behaviour change rather than
            a layout one - see the note on the timer effect.

            WHAT IS SHARED, deliberately: `activeIndex` (one piece of state for
            the whole section, so exactly one of the two layouts has an open row
            and switching a card is the same event in both), the chip treatment
            and its node, the timeline rule and its `pl-6`, `StepWindowBody` with
            `fill` off, and the four step titles and summaries. What differs is
            where the card sits, not what it says or how it looks.

            THE NAMES ARE SPACED. Every id here is `step-mobile-*` where the
            tabbed layout below uses `step-*`, because both trees are in the
            document at once - see `DESKTOP_QUERY`. Two elements sharing
            `step-panel-01` would be a duplicate id on a live page, and the
            `aria-controls` on the trigger below would be a coin toss as to
            which of the two it points at.

            `aria-expanded` + `aria-controls` and no roving tabindex, no
            `role="tab"` and no arrow keys, because that is the DISCLOSURE
            pattern rather than the tabs pattern, and the two are not
            interchangeable. In a tablist one stop reaches the whole group and
            arrows walk it; in a disclosure every trigger is its own tab stop and
            they are all four present in the reading order at once. All four
            summaries are already in the document whether or not a card is open,
            which is the property the tabs pattern was chosen on the desktop to
            preserve.

            `aria-controls` IS OMITTED WHILE COLLAPSED rather than pointing at an
            element that is not in the document, which is what an unmounted
            panel means. `aria-expanded="false"` carries the state on its own.

            The chevron sits inside a positioned wrapper rather than carrying
            the centring translate itself: framer-motion writes `transform` for
            its rotation, and a Tailwind `-translate-y-1/2` on the same element
            would be overwritten by the same property. Two elements, one
            translate and one rotate. */}
        <div
          data-reveal-stagger
          className="mt-16 flex flex-col gap-6 md:hidden"
        >
          {steps.map((step, index) => {
            const selected = index === activeIndex;
            const triggerId = `step-mobile-trigger-${step.number}`;
            const panelId = `step-mobile-panel-${step.number}`;

            return (
              <div
                key={step.number}
                className="border-l-2 border-section-divider pl-6"
              >
                {/* THE TRIGGER IS THE DESKTOP CHIP, UNCHANGED - same classes, same
                    node, same title and summary - with `pr-10` added to the text
                    spans so neither runs under the chevron, and no `onKeyDown`,
                    because there is no arrow-key contract to honour here.

                    Tapping the row that is ALREADY open does nothing, exactly as
                    clicking the already-selected tab does not, and for the same
                    reason: `activeIndex` is one integer shared by both layouts
                    and it is never null, so there is no state in which this
                    section has nothing open. A collapsible second tap would mean
                    a null state that the tablist cannot represent, and two
                    layouts disagreeing about whether zero open rows is legal is
                    worth more than the convenience. */}
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={selected}
                  aria-controls={selected ? panelId : undefined}
                  onClick={() => handleStepSelect(index)}
                  className={`group relative block w-full cursor-pointer rounded-card border px-5 py-5 text-left transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-linen ${
                    selected
                      ? "border-transparent bg-surface shadow-elev-1 ring-1 ring-black/5"
                      : "border-transparent hover:bg-surface/60"
                  }`}
                >
                  {/* THE NODE. Identical to the desktop chip's, and identical for
                      the same two reasons: it reads as a point on the rule rather
                      than a label, and `bg-linen` is opaque so the rule cannot
                      show through the circle. */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-9 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-xs tabular-nums transition-all duration-500 ${
                      selected
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-section-divider bg-linen text-charcoal/60"
                    }`}
                  >
                    {step.number}
                  </span>

                  <span
                    className={`block pl-8 pr-10 text-lg leading-snug tracking-tight transition-colors duration-500 ${
                      selected
                        ? "font-semibold text-charcoal"
                        : "font-medium text-charcoal/60 group-hover:text-charcoal"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`mt-1.5 block pl-8 pr-10 text-base leading-relaxed transition-colors duration-500 ${
                      selected ? "text-taupe" : "text-charcoal/60"
                    }`}
                  >
                    {step.summary}
                  </span>

                  {/* THE INDICATOR. The desktop says which step is showing by
                      sliding a bar along the rail; a rail with four stacked
                      groups and one of them open needs a mark on the open group
                      itself, or nothing on the page distinguishes it from the
                      other three.

                      `ChevronDownIcon` is the house glyph and it rotates 180°
                      open, so the point of it moves from down to up - the
                      accordion is as close to the disclosure convention as this
                      design gets. It is `aria-hidden` because `aria-expanded` on
                      the button already says which state this row is in, and
                      because `text-charcoal/60` is the same muted token the
                      summary uses rather than an accent the reader would read as
                      a second "this is the one". */}
                  <span
                    aria-hidden="true"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-charcoal/60"
                  >
                    <motion.span
                      className="block"
                      animate={{ rotate: selected ? 180 : 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : ACCORDION_MS / 1000,
                        ease: ACCORDION_EASE,
                      }}
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                    </motion.span>
                  </span>
                </button>

                {/* THE EXPANSION. `initial={false}` is load-bearing in the other
                    direction from the one it usually appears in: it is what stops
                    the panel from playing its entrance on the FIRST render, so
                    step 01 arrives already open rather than unfolding itself in
                    front of a reader who has not touched anything.

                    `height` is animated rather than `scale` or `maxHeight`
                    because this wrapper is what pushes the three rows below it,
                    and only a real height animates that push. `scale` would move
                    the content with it and leave the rows behind; `maxHeight`
                    would need a ceiling picked in advance and would either
                    clip the tallest card or waste time animating through empty
                    space. Framer Motion measures the content's own height for
                    the `auto` target, so nothing here has to be guessed.

                    The opacity is paired with it rather than carried by it. A
                    height-only collapse leaves the card's last frame on screen
                    for the whole 350ms while the box shuts around it.

                    `pb-3` AND `-mx-3` ARE ROOM FOR THE CARD'S SHADOW, and
                    neither is spacing. `overflow-hidden` is what makes the height
                    animation possible and it is also a clip boundary, so anything
                    painted OUTSIDE the card - a shadow - gets cut at this box's
                    edge. That is precisely the artifact the stack comment below is
                    entirely about, and it is why this card is `shadow-elev-1`
                    where the desktop window is `shadow-elev-3`: elev-3 is a 48px
                    blur offset 16px down, so honouring it here would need about
                    64px of padding around the card - a third of the screen, for
                    one shadow. elev-1 is a 6px blur offset 2px down, 12px of room
                    is more than enough, and it is the same elevation the selected
                    chip above uses. The negative margin is how the room is
                    bought on the SIDES: the wrapper is pulled 12px past its
                    parent's content box on both edges and padded back in by the
                    same 12px, so the card still sits flush with the chip above it
                    while its shadow has somewhere to fall. The section's own `px-6`
                    gutter is 24px wide, so the pull stays inside it. */}
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : ACCORDION_MS / 1000,
                        ease: ACCORDION_EASE,
                      }}
                      className="-mx-3 overflow-hidden"
                    >
                      <div className="px-3 pt-3 pb-3">
                        {/* THE CARD. The same four bands, the same chrome, the same
                            footer CTA and the same `data-hiw-live` scene trigger as
                            the desktop window - `fill={false}` is the only
                            difference, and it is the difference between filling a
                            window of a known height and simply being as tall as its
                            content. The frame's own treatment is the desktop
                            window's minus its scale and crossfade classes: there is
                            no second window on screen to dissolve, so there is
                            nothing to dissolve from. */}
                        <div
                          data-hiw-live="true"
                          className="overflow-hidden rounded-3xl border border-charcoal/10 bg-surface/80 backdrop-blur-md shadow-elev-1"
                        >
                          <StepWindowBody step={step} fill={false} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div
          data-reveal-stagger
          /* `hidden` + `md:grid`, not `grid`: below the breakpoint this container
             has no visible child at all - the rail and the stack inside it are
             both `hidden` below `md` - so leaving it as a grid would leave an
             empty 64px-tall gap where its `mt-16` was, between the heading and
             the accordion that replaced it. The mobile accordion is a SIBLING of
             this wrapper rather than a third child of it, which is also what keeps
             the desktop stagger indices exactly where they were: the two visible
             columns are still child 0 and child 1, so their entrance delays are
             unchanged. */
          className="mt-16 hidden items-stretch gap-8 md:grid lg:grid-cols-12 lg:gap-10"
        >
          {/* THE RAIL IS A TIMELINE STEPPER NOW, not a stack of floating cards.
              Four things changed together and they only work as a set:

                - The container carries `border-l-2 border-section-divider
                  pl-6`. That border IS the timeline: one continuous 2px rule
                  down the left of the column, with the content held 24px clear
                  of it. This is what replaces the four separate card borders
                  the chips used to draw.
                - Each chip's step number leaves the text flow and becomes a
                  NODE sitting on that rule: `absolute -left-9 top-5 h-7 w-7`,
                  a filled circle. `-left-9` is exact, not approximate — the
                  button's content starts 24px in from the rule (`pl-6`) and the
                  node is 28px wide, so pulling it left 36px puts its centre at
                  +2px, which is the centre of a 2px border. `top-5` matches the
                  chip's own `py-5`, so the node's top edge is flush with the
                  first line of the title.
                - The active position reads on the line itself as ONE BAR THAT
                  MOVES, declared once inside the rail and positioned from the
                  active chip's measured box. This replaced a `before:`
                  pseudo-element per chip, which was tidy — each segment knew its
                  own box, so it needed no measurement, no ref and no listener —
                  but it could only ever appear and vanish. Four toggled segments
                  is four bars that switch; there is no path between step 01 and
                  step 02 to animate along. The bar is 2px wide and sits at
                  left: -2px, which puts it exactly over the container's border
                  rather than beside it, so the active stretch of the rule simply
                  changes colour. The node is painted over it by virtue of being
                  later in paint order.
                - Inactive chips have no fill, no border and no shadow. They are
                  text on the rule. That is the whole visual difference between
                  active and inactive now, and it is why the column reads as one
                  object instead of four.

              `space-y-8` replaces the old chip gap: the gaps no longer need to
              separate cards, they space steps along a timeline.
              `lg:justify-between` stays, so if the panel is taller than the
              four steps still occupy the slack is spread BETWEEN them rather
              than pooling underneath — which is what keeps this column the same
              height as the frame beside it.

              PALETTE SUBSTITUTIONS, because the requested slate scale does not
              exist here — no `--color-slate-*` is defined in `@theme`. Each maps
              to a token this project already uses, and three of the five are
              exact:

                bg-white          -> bg-surface        #ffffff, exact
                border-slate-200  -> border-section-divider
                                    rgb(28 25 23 / .08) — this project's own rule
                                    colour, warmer and much lighter than
                                    slate-200's #e2e8f0
                text-slate-900    -> text-charcoal      #111827, exact
                text-slate-500    -> text-charcoal/60   the project's muted token
                rounded-xl        -> rounded-card       1.25rem, NOT rounded-xl's
                                    0.75rem — the project radius is 67% larger
                shadow-sm         -> shadow-elev-1      the project's soft
                                    elevation, 0 2px 6px at 5% — Tailwind's
                                    `shadow-sm` carries two stacked shadows and
                                    a heavier 10% black

              `ring-black/5` is kept verbatim: black with an opacity modifier is
              not a palette entry, it composes, so there was nothing to
              substitute.

              THE `hidden` / `md:` PREFIXES, which are the only reason this rail
              is not below `md`: below the breakpoint the mobile accordion is
              the section and this column is not rendered at all. `relative` is
              deliberately NOT prefixed — it is inert while hidden and load-bearing
              the moment it is not, since it is the indicator's offset parent. */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="The four steps"
            ref={railRef}
            /* THE PAUSE, AND WHERE IT LIVES. These two handlers used to sit on the
               wrapping `<section>`, which was a mistake with a visible symptom. The
               section is a full-bleed band at least ~920px tall — 80 to 96px of
               padding top and bottom, the heading block, a 64px gap, and the
               frame's 480px floor — so on an ordinary viewport it covers most of
               the screen. Pausing on pointer entry into THAT meant the rotation
               froze for the entire time anyone was looking at it, because reading
               the section requires the pointer to be inside the section. It was
               reported as "the animation stops when I click anywhere", which was
               accurate about the effect and wrong about the cause: the click was
               inert, there is no click handler out here, and all that happened is
               that the pointer ended up somewhere the tick refuses to advance
               from. Moving the handlers down to the rail scopes the pause to the
               one place a mis-click is actually possible — the four chips, which
               are controls — and leaves the heading, the frame and the gutter
               between the columns free to be hovered without consequence.

               The rail is the right box for it precisely because it is not the
               whole band: hovering the mockup frame, which is two thirds of the
               section's width, no longer stops anything. */
            onMouseEnter={() => {
              hoveringRef.current = true;
            }}
            onMouseLeave={() => {
              hoveringRef.current = false;
            }}
            className="relative hidden flex-col border-l-2 border-section-divider pl-6 md:flex md:space-y-8 lg:col-span-3 lg:h-full lg:justify-between"
          >
            {/* THE ACTIVE INDICATOR. One bar for the whole rail, on the rail's own
                rule, carrying the transition that does the sliding.
                `relative` on the container above is what makes this element's
                offset parent the rail rather than the page, which is what turns
                the chip's offsetTop into a value that can be used here verbatim.

                `left: -2px` in the inline style is arithmetic and it is the one
                place it is needed: the rail's own 2px rule lives in the border,
                i.e. from -2px to 0 relative to the padding box, and the bar is
                painted exactly over it. Nothing is drawn beside the rule and
                nothing is doubled — the active stretch of the line simply
                changes colour, which is what an active indicator should look
                like. Anchoring at `left: 0` instead would have stacked a 2px bar
                against the inside edge of a 2px rule and read as a step in the
                line. `w-0.5` supplies the other 2px.

                `aria-hidden`, because the state is already announced: the rail is
                a tablist, each chip is a tab with `aria-selected`, and a second
                piece of markup saying which one is active would be read out as
                a duplicate.
                `pointer-events-none` so the bar can sit under the chips without
                ever becoming a click target.
                `rounded-full` costs nothing at 2px wide and stops a sub-pixel
                fractional height from showing a hard corner against the rule.

                `isDesktop &&` is not a guard against a flash of bar on a phone -
                the whole rail is `hidden` below the breakpoint. It is here so that
                the element is not in the document at all on the layout that has no
                rail, and so that resizing from mobile to desktop with a stale
                measurement cannot paint a bar at the previous chip's position for
                a frame before the layout effect re-measures. */}
            {isDesktop && indicator && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute z-0 w-0.5 rounded-full bg-brand-primary"
                style={{
                  left: "-2px",
                  top: `${indicator.top}px`,
                  height: `${indicator.height}px`,
                  transition: reducedMotion ? "none" : INDICATOR_TRANSITION,
                }}
              />
            )}

            {steps.map((step, index) => {
              const selected = index === activeIndex;
              const tabId = `step-tab-${step.number}`;
              const panelId = `step-panel-${step.number}`;

              return (
                <button
                  key={step.number}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={tabId}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => handleStepSelect(index)}
                  onKeyDown={(event) => handleTabKeys(event, index)}
                  className={`group relative block w-full cursor-pointer rounded-card border px-5 py-5 text-left transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-linen ${
                    selected
                      ? "border-transparent bg-surface shadow-elev-1 ring-1 ring-black/5"
                      : "border-transparent hover:bg-surface/60"
                  }`}
                >
                  {/* THE NODE. Absolutely positioned out of the text flow and
                      centred on the container's rule, so the four step numbers
                      read as points on one line rather than as four separate
                      labels. `bg-linen` when inactive is not decoration: the
                      section behind this column IS `bg-linen`, and an opaque
                      fill is what stops the rule and the indicator showing
                      through the circle. */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-9 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-xs tabular-nums transition-all duration-500 ${
                      selected
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-section-divider bg-linen text-charcoal/60"
                    }`}
                  >
                    {step.number}
                  </span>

                  {/* `pl-8` on the title and summary aligns their left edge with
                      the inside of the node rather than with the button's own
                      padding, so the text column stays vertical as the node
                      fills and empties. */}
                  <span
                    className={`block pl-8 text-lg leading-snug tracking-tight transition-colors duration-500 ${
                      selected
                        ? "font-semibold text-charcoal"
                        : "font-medium text-charcoal/60 group-hover:text-charcoal"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`mt-1.5 block pl-8 text-base leading-relaxed transition-colors duration-500 ${
                      selected ? "text-taupe" : "text-charcoal/60"
                    }`}
                  >
                    {step.summary}
                  </span>
                </button>
              );
            })}
          </div>
          {/* THE STACK. `relative` plus a measured height is what makes the
              crossfade work: the four windows are `absolute` and each fills this
              box, so the container never changes size when the selection changes
              and nothing below it on the page moves. `overflow-hidden` clips to
              that box, so no window's shadow can paint outside the panel. `min-h`
              is the server-rendered floor, for the frame before measurement runs.

              No reveal marker on this element either - it is the second direct
              child of the grid wrapper's `data-reveal-stagger`, which reaches it
              without a marker of its own. Two marker types on one node each apply
              an unlayered `opacity: 0`, and whichever lost the race decided
              whether the panel was visible at all. A marker is also never placed
              on a `role="tabpanel"` inside it: the stack mounts once while the
              panels swap on every rotation, so a marker inside would replay a
              24px rise every seven seconds.

              THE INLINE SIZE IS `minHeight`, NOT `height`. An inline `height`
              OVERRIDES the `min-h-[30rem]` class, so the moment measurement ran and
              returned something under 30rem the floor vanished, the panel shrank,
              and the frame after, `measure` ran again against the new box and could
              return a different number - a layout change inside a section whose own
              height the reveal observer is watching. That loop is what read as
              flicker. `minHeight` cannot collapse the box and is not overridden by
              the class either: both are floors now, and the taller wins. It also
              degrades correctly if JS never runs - the container keeps the 30rem
              floor instead of dropping to the absolutely-positioned children's zero
              intrinsic height. The value written is the measurement itself,
              unmodified; the clamp against `MIN_STACK_PX` lives in the measurement
              effect, so there is exactly one place where that number is decided.

              `hidden` + `md:block` is the mobile accordion's other half. Below the
              breakpoint none of the geometry described above is live: the stack is
              not displayed, so the measurement effect finds four collapsed
              columns, returns early on its own `tallest <= 0` guard, and never
              writes a height. Nothing here has to be switched off in JS, which is
              the point — the only thing JS has to switch off is the auto-advance,
              and that is a timer rather than a measurement. */}
          <div
            /* ── THE WRAPPER'S RADIUS IS LOAD-BEARING, and it is not
               decorative. ──────────────────────────────────────────────────

               This container is `overflow-hidden`, which means it establishes a
               CLIP BOUNDARY for all four absolutely-positioned windows inside
               it. Its four children are `rounded-3xl` - a 24px arc on every
               corner. The boundary did NOT match them: the wrapper clipped to a
               SQUARE while every card inside it was round, and the mismatch
               showed as four grey squares bleeding out from behind the cards'
               rounded corners.

               WHERE THE GREY COMES FROM, since it is not a background layer and
               there is no pseudo-element anywhere in this column. It is
               `shadow-elev-3` - `0 16px 48px rgb(46 46 50 / 0.18)` - on each
               window. A box-shadow is painted OUTSIDE the border box, and that
               is the entire point of an elevation shadow: it is meant to be seen
               on the page behind the card. So the card's shadow is exactly the
               paint that escapes its own rounded corners, and with a 48px blur
               it escapes about 48px in every direction. The wrapper then cut that
               escape square, while the card above it stayed round.

               The result, at 18% of a desaturated near-black over the section's
               linen, is a worst-case corner of about rgb(206 203 198) - a
               distinctly grey square with hard straight edges sitting under a
               card whose own edges are round. Not a subtle seam: a visible
               rectangle.

               `rounded-3xl` here matches the children exactly, so the clip
               boundary and the card share one shape. The shadow is now trimmed to
               the same 24px arc it was drawn against, and there is no square for
               it to be cut into.

               THE COUNTER-INTUITIVE PART, which is the thing worth writing down:
               a rounded parent around rounded children looks redundant, and a
               reviewer will be tempted to delete it as dead styling. It is not.
               A wrapper only needs a radius when it CLIPS - `overflow-hidden`
               makes the boundary real, and then the radius is the boundary. With
               no clip, or with a square clip around round children, this artifact
               comes straight back.

               THE CHILDREN ARE THE ONLY THINGS IN HERE. That is what makes it
               safe to round the wrapper: the `{steps.map(...)}` below closes at
               the last `</div>` and nothing else is a child of this element. If
               anything square-cornered were ever added here - a caption, a
               scrollbar, an outline - this radius would start clipping it, and
               the fix would be to stop that child clipping, rather than
               to drop the radius. */
            className="relative hidden min-h-[30rem] overflow-hidden rounded-3xl md:block lg:col-span-9"
            style={stackHeight ? { minHeight: `${stackHeight}px` } : undefined}
          >
            {steps.map((step, index) => {
              const selected = index === activeIndex;
              /* `demo` and `quote` are NOT resolved here any more. They moved
                 into `StepWindowBody` with the rest of the window's interior,
                 so that the desktop panel and the mobile accordion cannot pick
                 different scenes for the same step - see that component's note.
                 Nothing in this frame reads either of them. */

              return (
                <div
                  key={step.number}
                  role="tabpanel"
                  id={`step-panel-${step.number}`}
                  aria-labelledby={`step-tab-${step.number}`}
                  tabIndex={selected ? 0 : -1}
                  aria-hidden={!selected}
                  inert={!selected}
                  /* SCENE TRIGGER. This attribute is the ONLY thing that starts
                     the four card scenes, and it is set here from `selected`
                     rather than by an IntersectionObserver.

                     The reason is that the four windows are `absolute inset-0`
                     and differ from one another only by `opacity-0
                     pointer-events-none scale-[0.98]`. Geometrically all four
                     are inside the viewport at the same instant, so a
                     `whileInView` on any of them would fire all four at once
                     when the section scrolled in - three of them playing out
                     unseen behind an invisible panel, and the reader arriving at
                     each one later to find it already finished. Keying off the
                     selected tab is the only trigger that coincides with a
                     reader being able to see the thing animate.

                     Removing and re-adding it restarts every animation inside,
                     which is why the scene replays on the 4500ms rotation and
                     on a click rather than running once and never again. */
                  data-hiw-live={selected ? "true" : undefined}
                  className={`absolute inset-0 h-full w-full overflow-hidden rounded-3xl border border-charcoal/10 bg-surface/80 backdrop-blur-md shadow-elev-3 transition-all duration-500 ease-in-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-linen ${
                    selected
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-[0.98] opacity-0"
                  }`}
                >
                  <StepWindowBody
                    step={step}
                    contentRef={(node) => {
                      cardContentRefs.current[index] = node;
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
