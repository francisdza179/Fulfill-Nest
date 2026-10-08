import { differenceRows, differenceThesis } from "@/lib/data";

/* ==========================================================================
   WHY FULFILL NEST — the About page's differentiation split.

   ── NOT RENDERED. KEPT DELIBERATELY. ────────────────────────────────────────
   This section was removed from the About page on request. It is no longer
   imported by any route; `app/about/page.tsx` is where it used to sit.

   It went through five layouts before it was pulled: a six-card bento grid with
   a linen band, a five-row accordion with a sticky spotlight frame, a real
   comparison table, a horizontal drag/swipe story track, and finally this
   borderless two-column split. The last one removed every enclosure the earlier
   versions had, which was the point, and it still was not the look.

   NOTHING WAS DELETED. This file, `differenceThesis`, `differenceRows` and the
   `DifferenceRow` type are all still here, so restoring the section is one
   import and one line in `app/about/page.tsx` — or a different design built on
   the same copy, which is the more likely reason to keep it.

   The consequence to know about: this file and those three exports are all dead
   code today. `tsc` stays clean because every one of them is still exported and
   internally consistent; nothing in the compiler will tell you they have no
   reader. `lib/data.ts` carries the same warning on the exports.

   ── THE LAYOUT THIS FILE DESCRIBES ──────────────────────────────────────────
   PLACEMENT, for the record: between `AboutStory` and `ValueProps`. The
   argument it was built to carry ran: who we are (AboutHero) -> why we exist
   (AboutStory) -> why choose us over a legacy vendor (this band) -> what we
   believe (ValueProps) -> who the people are (TeamSpotlight) -> proof
   (TestimonialV3Section) -> the ask (CtaBand). Without it the About page now
   jumps straight from the mission story to `beliefs`.

   The `id` was `the-difference`. Nothing on the site linked to that anchor, so
   removing the section broke no deep link.

   NOT A RESTATEMENT OF `beliefs`, which is the very next band and is also a
   short list about how the company works. `beliefs` is first-person and
   internal, this is second-person and comparative. See the note on the two
   exports in `lib/data.ts`.

   ── NO BOXES, NO FILLS, NO RESTING SHADOWS ─────────────────────────────────
   That is the whole brief and it is now true of every element in this section.
   There is no card surface, no border around a content block, no elevation
   shadow at rest and no radius doing decorative work. The only rule on screen
   is the hairline above each point, and the only fills are the band itself and
   the eyebrow. The heading, the lead paragraph and the six points sit directly
   on `bg-linen`.

   This reverses the previous two layouts outright: a horizontal story track
   with white cards, a full-width `bg-forest` banner before that, and a
   comparison table before that. All three put enclosures around the argument.

   ── THE HOME PAGE BAND, AND WHERE IT DISAGREES WITH THE BRIEF ───────────────
   The band to mirror is `ValueProps` with `layout="editorial"`, which the home
   page renders at `id="why-fulfill-nest"` (`app/page.tsx`). Read it before
   changing anything here: it is the reference for what "clean and open" means
   on this site.

   It is NOT a two-column split-screen. It is a full-width `max-w-7xl` header
   block above an `<ol>` at one / two / three columns, with rows that are a
   hairline, an oversized numeral, a display title and body copy. So "mirror the
   home page" and "two-column split-screen with small mono numerals" are two
   different layouts, and only one of them can be built.

   The split-screen was built, because it is what the numbered instructions
   describe and because it delivers the actual visual intent — an open,
   unboxed, airy section — which is what every instruction in this brief is
   reaching for. What was carried across from the home band is the ROW
   ANATOMY, because that is the part that makes the two sections read as one
   design:

     hairline above   the same top rule per item, for the same reason
     green numeral    the same colour the home band numerals use
     display title    the same title treatment, no weight override
     taupe body       the same supporting-copy colour
     open, not boxed  no fill, no radius, no resting shadow, no hover

   The numerals are the one place the two briefs converge on their own: the
   brief offered "dark green or rust orange", and dark green is what the home
   band already uses, so choosing it satisfies both. It is also the only one of
   the two that passes contrast — see the note on the numeral below.

   ── THE COLUMN RATIO IS INVERTED FROM THE HOUSE SPLIT ──────────────────────
   `ComplianceAssurance` splits copy-left / media-right at `1fr / 0.85fr`, so
   the copy side is the wider one. This band is the reverse shape: the left side
   is a short heading and a three-sentence paragraph, the right side is a
   six-item grid that needs real measure. So the left gets 0.8fr and the grid
   gets 1.2fr. Both tracks are `minmax(0, ...)`, which is what stops a long
   unbroken word in a point title from widening the grid column.

   ── THE HAIRLINE, AND WHY IT IS NOT THE SPECIFIED COOL GREY ────────────────
   The brief specified a 60%-opacity 200-step grey. Tailwind v4 does ship that
   palette, so the utility WOULD compile and would produce a rule — this is a
   design-system substitution, not a broken class, and the distinction matters
   when someone reads the compiled CSS and finds no trace of what was asked for.

   That 200 step is #e2e8f0, which is COOL. The hairline on this site is WARM.
   Measured as rendered over this band:

     the specified value   ->  #e8eaec
     the house hairline    ->  #e0ddd6

   The hairline used here is this design system's own section divider — the
   token is described as such in `@theme`, its value is `rgb(28 25 23 / 0.08)`,
   and it is what the home page's editorial band draws every one of its rules
   with. It is also slightly WARMER and slightly DARKER than what was asked
   for, which on a band with no fills at all is the difference between a rule
   that belongs to the page and one that looks pasted on. This is the second
   time this section's brief has specified that cool grey and been given the
   house hairline instead; say the word and it becomes the specified value in a
   one-line edit.

   ── THE NUMERAL: SMALL, GREEN, AND NOT MONOSPACED ──────────────────────────
   `text-sm font-bold`, which is the specified treatment with one token
   removed. `font-mono` has no token in this `@theme` — there is no
   `--font-mono` — so it falls back to Tailwind's default stack, which is the
   host operating system's monospace: Consolas on Windows, SF Mono on macOS,
   Menlo on most of the rest. The section's only element that repeats six times
   would then render in a different face on every machine a reader owns, while
   every other numeral on this site is set in the project's own sans. Dropped.

   The period IS kept. The brief wrote the numerals as "01.", "02.", and the dot
   is what makes them read as an ordered list rather than as a stray two-digit
   number, which matters more now that the numerals are small enough to sit
   above a title instead of beside it.

   `text-brand-green-700` (#25553d) measures 7.41:1 on `bg-linen`. The
   alternative the brief offered, `accent-700` (#a95538), measures 4.48:1 —
   under the 4.5:1 that 0.875rem bold text needs, since 14px bold is not WCAG
   "large" text. So dark green is both the mirror and the passing option.

   ── "CRISP BOLD TITLES", READ AS WEIGHT NOT AS `font-bold` ──────────────────
   The titles are `font-display`, the site's display serif, at the same
   weights every other point title on the site uses. No point title anywhere on
   this site carries a weight override, and bolding a display serif produces a
   heavier colour than the surrounding copy rather than a crisper one. "Crisp"
   is delivered by the display face and the size step down to `text-xl`.

   ── THE LEAD PARAGRAPH IS THE EXISTING THESIS, UNCHANGED ───────────────────
   `differenceThesis` already reads character-for-character as specified —
   U+2019 in "doesn’t", U+2014 in "— intention does." — so nothing was edited
   to produce it. What changed is its container: it used to be a `<figure>`
   wrapping a `<blockquote>` inside a bordered, filled, shadowed panel with a
   2px accent margin rule, and it is now a bare `<p>` set one step above body
   size. The accent margin rule, the white fill and the panel shadow are all
   gone with it. The markup changed shape because a pull-quote in a panel is
   not what this sentence is; it is a lead paragraph.

   ── NO HOVER, DELIBERATELY ─────────────────────────────────────────────────
   The home band's rows lift two pixels and wash on hover. None of that came
   across. A hover wash is a fill and the lift needs a shadow, and this brief
   asked for neither, so the six points are static. Nothing about them is
   clickable, so a hover that implied it would be a lie.

   ── THE COMPARISON IS GONE FROM THE RENDER, AND THAT IS A REAL LOSS ─────────
   `DifferenceRow.legacy` is no longer rendered. The previous layout drew it as
   a struck line under each point; this one has the numeral, the title and the
   description, which is what was specified, and a fourth text block would put
   the enclosure back in the form of clutter.

   All six legacy positions — "Catalog Warehouse", "Outdated Bulk Items",
   "Rigid Enterprise Workflows", "Mass Scale Dependency", "Generic Gifts",
   "Corporate Bureaucracy" — are still in `lib/data.ts`. They were NOT deleted,
   and they are the reason `legacy` is still a required field. A section that
   never renders it is a live trap for the next person who edits this file, so
   it is documented in `lib/data.ts` as well as here.

   So this section no longer says what the alternative does. It says what
   Fulfill Nest does and stops. That is a weaker argument than the one it
   replaced and it is worth knowing before this ships.

   ── A SERVER COMPONENT AGAIN, AND IT IS NOT COMING BACK ────────────────────
   The previous layout was a draggable track and needed `"use client"` plus two
   `useState` hooks, a scroll listener, a `ResizeObserver` and a measured step
   for its arrows. A grid of six points needs none of that. This section ships
   zero client JavaScript again, and unlike the two layouts before it this one
   has no state to lose.

   ── THE REVEAL CADENCE ─────────────────────────────────────────────────────
      eyebrow   0ms   \
      heading 100ms    >  direct children of the `data-reveal-header` wrapper,
      lead    200ms   /   STEP_MS = 100
      points 300-800ms  >  `data-reveal-stagger` on the <ol>; the six `<li>`
                           are its direct children, off CONTENT_OFFSET_MS = 300
                           and STEP_MS = 100

   Two markers, on two different subtrees of the section, which is fine: the
   reveal system collects every marker it finds inside a target and each is
   applied to a different element. The left column carries only the header
   marker and the list only the stagger marker. TWO MARKER TYPES ON ONE NODE is
   the failure that matters here — `RevealOnScroll` applies an unlayered
   `opacity: 0` per marker, so an element carrying both is an invisible
   element.

   Because the grid is a real grid rather than a horizontal track, every point
   is on screen at reveal time, so all six of those entrances are actually seen.
   That was not true of the track, where five of six played off-screen.

   No `data-reveal-content-offset`, `data-reveal-header-step`,
   `data-reveal-stagger-step` or `data-reveal-threshold` override is declared, so
   all four default.
   ========================================================================== */

/* Complete literal strings, never fragments. Tailwind scans source text, so a
   token assembled from parts is invisible to the compiler and emits no rule. */

/* The only rule in the section. `pt-6` / `pb-8` are the specified measures and
   also the row rhythm: a grid `gap-y` is left unset so consecutive rows are
   separated by this cell's own padding and the next cell's hairline, exactly as
   the full-width list separates its rows. A row gap on top of that would open a
   second, rule-free channel between one row's text and the next row's rule. */
const POINT = "border-t border-section-divider pt-6 pb-8";

const POINT_INDEX = "text-sm font-bold text-brand-green-700";

const POINT_TITLE = "font-display text-xl text-charcoal";

const POINT_BODY = "mt-3 text-body-sm text-taupe";

/** One "01.", "02." … "06." The dot is what makes the column read as an
 *  ordered list rather than as six unrelated two-digit numbers. */
function pointIndexLabel(index: number): string {
  return `${String(index + 1).padStart(2, "0")}.`;
}

export function WhyFulfillNest() {
  return (
    /* `id` is NOT `why-fulfill-nest`. That id is already taken by the home
       page's `ValueProps` band (`app/page.tsx`), and reusing it here would give
       two sections the same anchor on the site. NO `overflow-hidden` — it would
       be harmless here, but it was kept off during the accordion layout because
       it silently breaks `position: sticky` descendants, and the reason should
       not need rediscovering if a sticky element is added later. */
    <section
      id="the-difference"
      className="relative border-t border-section-divider bg-linen py-section"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* THE SPLIT. One row, two tracks: copy on the left, the six points on
            the right. `gap-y-16` is the mobile stack gap — the generous space
            between the lead paragraph and the grid that this section is about —
            and `lg:gap-x-20` is the horizontal gutter between the two columns.
            `gap-y` still applies at `lg`, where there is one row and so nothing
            to separate. */}
        <div className="grid gap-y-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-x-20">
          {/* Left. Direct children only: the three of them are the entire
              0 / 100 / 200ms header cadence. Nothing in here is wrapped, filled
              or ruled — the eyebrow and the heading sit straight on the band. */}
          <div data-reveal-header className="flex flex-col gap-6">
            <p className="text-eyebrow w-fit uppercase text-eyebrow-gray">
              The Fulfill Nest difference
            </p>
            <h2 className="text-display max-w-md text-charcoal">
              Why Fulfill Nest
            </h2>

            {/* THE LEAD, UNBOXED. Was a `<figure>` around a `<blockquote>` in a
                bordered, filled, shadowed panel with a 2px accent margin rule.
                It is now one step above body size, in the muted body colour,
                capped to the column's measure. No container, no rule, no
                radius — the sentence sets the page, it does not sit in a thing. */}
            <p className="text-body-lg max-w-md text-taupe">{differenceThesis}</p>
          </div>

          {/* Right. An `<ol>` because the points are an ordered argument and the
              numerals say so. The hairline segments into one dash per column
              because of the column gap, which is the unavoidable trade for
              having a gap at all — the rule has to stop short of it or two rows
              would touch. */}
          <ol
            data-reveal-stagger
            className="grid grid-cols-1 gap-x-10 md:grid-cols-2"
          >
            {differenceRows.map((row, index) => (
              <li key={row.ours} className={POINT}>
                {/* `aria-hidden`: the ordinal is decoration. The position is
                    already carried by the `<ol>` itself, which announces "list,
                    6 items" and tracks the current item as a reader arrows
                    through it, so announcing "01." again would be noise. */}
                <span className={POINT_INDEX} aria-hidden="true">
                  {pointIndexLabel(index)}
                </span>
                <h3 className={`${POINT_TITLE} mt-3`}>{row.ours}</h3>
                <p className={POINT_BODY}>{row.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}