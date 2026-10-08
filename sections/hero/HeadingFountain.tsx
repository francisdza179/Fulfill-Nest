"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/* ── The exit phase, and why it is the only thing React owns here ─────────
   The reveal is one stylesheet state change. `.hero-heading-fountain` gains
   `:hover`, and a 760ms overshoot curve carries each cutout out from the
   headline's centre to its own `--burst-*` coordinates. Nothing in JavaScript
   takes part in that, and nothing below is allowed to change it.

   The exit cannot be a second stylesheet state change on its own, because it
   needs a state to be parked in once the return leg has finished. A selector
   match resolves to one target value, and a rule can only be told "match" or
   "stop matching" — not both at once, which is what holding the cutouts at the
   origin and invisible needs. Three phases, and the timer drives the step
   between the last two:

     idle     At rest, and for the whole time the trigger is hovered — the
              stylesheet does everything and this phase does nothing.
     exiting  The transform is the entry vector walked back and stopped at the
              headline's bounding box — see `exitFactor` on the type. The fade
              is not state-driven at all: `globals.css` keys opacity off
              `:not(:hover)`, so it starts the frame the pointer leaves rather
              than the frame this state lands. Both legs are 250ms on the same
              curve, so each cutout reaches `opacity: 0` and `scale(0.2)` on
              the same frame, at the perimeter — which means it cannot be seen
              over a letter, by construction rather than by tuning.
     reset    `transition` dropped and the cutouts put back on the origin,
              which the exit no longer does for itself since it stops at the
              boundary. The return lands there on its own; this is a settling
              state rather than a rescue, and it is invisible either way.

   `reset` is where the component then rests, not a phase it passes through:
   the next reveal needs the origin, and only the next `onMouseEnter` should
   hand control back to the stylesheet.

   `GIFT_EXIT_MS` is how long the return leg is given before `reset` takes
   over. The exit is now 250ms with no `--burst-delay` on either leg, so the
   constant is over-provisioned by a wide margin — but `reset` is what puts the
   cutouts back on the origin, since the exit stops at the headline's
   perimeter, and firing that early would cut the return short and leave the
   next reveal starting from a stale transform. The margin costs nothing: it
   is spent at opacity 0, and the only thing visible during it is the live
   transition that `reset` then drops. The leg is a stylesheet value, so this
   constant has to be kept in step with it by hand. */
const GIFT_EXIT_MS = 710;

type GiftPhase = "idle" | "exiting" | "reset";

/* Phase the idle loops so the cutouts do not breathe in unison. The loop's
   0% frame is neutral, so each delayed start matches the hover reveal exactly.
   This cycles by `index % 3`, which is why the two back-layer items pin an
   explicit `floatDelay` instead — see the `HeroGift` notes. */
const HERO_GIFT_FLOAT_DELAYS = ["0s", "0.5s", "1.2s"] as const;

/* ── Reveal normalization: one scale, one rotation, one start time ────────
   Each cutout used to carry its own `burstScale`, `burstRotation` and
   `burstDelay`. Together those three are what made the expansion read as
   directional rather than as a centred bloom, and each failed in its own way:

     · Rotation was sign-locked to the offset. Every cutout on the left tilted
       negative and every one on the right tilted positive, across a -12deg to
       +12deg range — a fan that pointed each item's top edge along its own
       direction of travel. Two items placed symmetrically about the headline
       came out visibly asymmetric, and because tilt scaled with travel, the
       peripheral items — the ones furthest from the centre — were also the
       ones tilted hardest. Hovering near an edge therefore read very
       differently from hovering over the middle, even though `:hover` is
       binary and the two are the same state.
     · Scale spanned 0.8 to 1.05 with nothing behind it. The back layer was
       0.8 on one entry and 1.04 on the other, so the pair that separation was
       supposed to establish was scaling in opposite directions at once.
     · Delay ran 0 / 40 / … / 360ms, so the last cutout did not begin moving
       until a third of a second after the first. That is a 360ms velocity
       difference inside a single hover, and it is what made ten simultaneous
       cutouts read as a sequence rather than as one expansion.

   All three are now single values shared by every item. The ten differ only in
   the direction they travel; the motion itself is identical for all of them —
   same scale, same rotation, same duration, same delay, same curve, from the
   same origin. The reveal is therefore the same smooth, centred expansion
   wherever the pointer enters the trigger, because there is no longer anything
   in the motion for entry position to vary.

   `globals.css` keeps declaring `scale()` and `rotate()` in the reveal's
   transform list, and keeps its six-function parity with the exit. The
   functions stay; only their arguments are unified. That parity is what makes
   the two legs literal time-reverses, so removing them would cost the exit its
   direct component interpolation — hence `rotate(0deg)` below rather than a
   shorter transform list. */

/**
 * Uniform scale at the end of the reveal.
 *
 * The one value in the set rather than ten, so no item arrives larger or
 * smaller than another and the radial spread stays even. The back layer
 * separates on `z-index` and on its own Y offset instead; see the
 * Mechanical Wireless Keyboard notes for what that costs.
 */
const BURST_SCALE = "1";

/**
 * Uniform rotation at the end of the reveal: zero.
 *
 * The old fan ran to ±12deg, and ±3deg was the most it could be damped to
 * without reading as a table sliding sideways — ten items all leaning the
 * same way is a different kind of direction, not the absence of one. So the
 * limit here is zero rather than a survivor of the fan, and centred is what
 * zero reads as.
 *
 * It also makes the exit's own comment exactly true: `burst-rotation` runs
 * down from 0deg to 0deg, so that leg is a genuine no-op rather than a claim.
 * The `rotate()` itself is still declared in `globals.css` — see the note
 * above on why it has to stay.
 */
const BURST_ROTATION = "0deg";

/**
 * Single shared start delay for every cutout: none.
 *
 * Removing the cascade is the whole of the velocity damping. Ten cutouts that
 * all leave the centre on the same frame travel as one body, and the shape
 * they describe is the burst vector itself — which is radial, and so is what
 * it now looks like.
 *
 * The delay was never visible on the return: the exit declares `0ms` on both
 * its legs directly, so `--burst-delay` was only ever read on the way in. It
 * stays declared rather than being dropped from the cascade, so the reveal's
 * start time is one named value in both the stylesheet and here instead of an
 * absent property the stylesheet has to default.
 */
const BURST_DELAY = "0ms";

type HeroGift = {
  name: string;
  src: string;
  width: string;
  height: string;
  burstX: string;
  burstY: string;
  /**
   * Where on its burst vector this cutout stops on the way home, as a
   * fraction of the full offset. `0` is the headline's centre, `1` is the
   * burst position it would otherwise return all the way to.
   *
   * This is what stops the exit at the headline's bounding box instead of
   * inside it, and it is per item because the crossing point is: the two
   * cutouts on the horizontal axis already sit within a box-width of the text
   * edge and barely travel, while the two on the back layer come in almost to
   * the centre. Deriving it as `min(|burst-x| / 448, |burst-y| / 112)` — the
   * first of the two axes to reach the h1's half-extents, measured against
   * the 896x224 box the title occupies inside the fountain's padding.
   *
   * A number, not a length, because it multiplies a `clamp()` of lengths that
   * is itself re-pinned by the responsive blocks in `globals.css`. The values
   * below are exact at the widths where the inline clamps govern; in the
   * 640-1023px band and below 360px the offsets are overridden, so the landing
   * point drifts. The drift is cosmetic only — the fade reaches 0 on the same
   * frame the path ends, so a factor that is out still dissolves the cutout
   * rather than leaving it parked over the copy.
   */
  exitFactor: number;
  /**
   * Opt a cutout into the back depth layer (`z-index: -1`).
   *
   * Every cutout is an absolutely positioned sibling sitting at `z-index: 0`, so
   * paint order is DOM order and the last entry would otherwise sit in front of
   * everything. A negative z-index is the only way to reach the back layer
   * without reordering the array.
   *
   * Reordering is deliberately *not* the mechanism. `app/globals.css` pins
   * `--burst-x` / `--burst-y` for `:nth-child(1..8)` with `!important` across
   * three responsive blocks (max-width 639px, 640-1023px, and max-width 360px),
   * and those tablet/small-screen rules outrank the inline styles outright. They
   * are therefore *positional* selectors: inserting an item at the front would
   * silently hand every existing cutout a neighbour's coordinates, and the
   * damage would only appear between 640px and 1023px where the overrides apply.
   * New items append; the back layer is expressed with this flag.
   */
  layer?: "back";
  /**
   * Explicit idle-float phase, overriding `HERO_GIFT_FLOAT_DELAYS[index % 3]`.
   *
   * The modulo cycle only avoids a visible unison while the array length and
   * the phase count keep indices from folding onto a neighbour's phase. At eight
   * items over three phases nothing repeats adjacently, but index 9 would fold
   * back onto index 0's `0s` — putting a back-layer item in unison with the
   * front-most one, on the same side of the spread. Naming the phase outright
   * leaves the existing eight untouched and gives the new pair their own.
   */
  floatDelay?: string;
};

/**
 * The cutouts begin hidden at the headline's center and fan into ten
 * directions only while the heading trigger is hovered or keyboard-focused.
 * The clamp() offsets keep the burst close on phones while allowing it to
 * travel farther on wide screens.
 *
 * The offset is the only per-item value left in the motion. Scale, rotation
 * and start time are each one shared constant, so all ten leave the centre
 * together on the same curve at the same size and arrive untitled — the burst
 * reads as a single radial expansion rather than as ten differently-timed
 * and differently-tilted arcs. See `BURST_SCALE` above for what that fixes.
 *
 * Five items per side, in two depth layers. The first eight form the front
 * layer; the E-Ink Reader and the Mechanical Wireless Keyboard sit below them
 * in the back layer, each on the outer edge of the lower band so the spread
 * reads as two rows rather than a single arc.
 *
 * ── Why these append rather than slot in by hand ────────────────────────
 * The array order is load-bearing in a way that is easy to miss. Cutouts are
 * absolutely positioned siblings at the same `z-index`, so DOM order *is* paint
 * order — but it is also the index that `HERO_GIFT_FLOAT_DELAYS` keys off, and,
 * more importantly, the index that the `:nth-child(1..8)` `!important` rules in
 * globals.css key off. Those rules override the `burstX` / `burstY` values
 * declared right here, at every width from 640px to 1023px and again below
 * 360px. Reordering or inserting here silently reassigns coordinates, and the
 * breakage would only surface in those two viewport bands.
 *
 * The consequence to remember: the array's tail is the *only* place a new
 * cutout can be added, and it must be given a `:nth-child` entry in each
 * responsive block to be pulled back inside a phone viewport. The first eight
 * are not positional by accident — they are positional by contract.
 */
const heroGiftBurst: readonly HeroGift[] = [
  {
    name: "Bluetooth Speaker",
    src: "/images/corporate-gifts/bluetooth-speaker.png",
    width: "clamp(7.5rem, 22vw, 10rem)",
    height: "clamp(3.75rem, 11vw, 5rem)",
    burstX: "clamp(-38rem, -45vw, -9rem)",
    burstY: "clamp(-13rem, -19vw, -6rem)",
    /* 208px up, 608px left. The top edge governs: 112/208. */
    exitFactor: 0.54,
  },
  {
    name: "Chocolate Box",
    src: "/images/corporate-gifts/chocolate-box.png",
    width: "clamp(7.25rem, 24vw, 10.5rem)",
    height: "clamp(7.25rem, 24vw, 10.5rem)",
    burstX: "clamp(7.5rem, 38vw, 38rem)",
    burstY: "clamp(-11rem, -18vw, -5rem)",
    /* 176px up, 547px right. The top edge governs: 112/176 — the X is not
       anywhere near its own. */
    exitFactor: 0.64,
  },
  {
    name: "Hoodie",
    src: "/images/corporate-gifts/hoodie.png",
    width: "clamp(7.25rem, 22vw, 10rem)",
    height: "clamp(9.5rem, 29vw, 13.125rem)",
    burstX: "clamp(-35rem, -38vw, -10rem)",
    burstY: "clamp(-0.75rem, -1.5vw, 0rem)",
    /* 22px up, 547px left. The left edge is already close: 448/547, so this
       one dissolves almost where it stands. */
    exitFactor: 0.82,
  },
  {
    name: "Mug",
    src: "/images/corporate-gifts/mug.png",
    width: "clamp(5rem, 18vw, 7rem)",
    height: "clamp(4.5rem, 16vw, 6.25rem)",
    burstX: "clamp(10rem, 40vw, 36rem)",
    burstY: "clamp(-0.75rem, -1.5vw, 0rem)",
    /* 22px up, 576px right. The right edge governs: 448/576. */
    exitFactor: 0.78,
  },
  {
    name: "Notebook",
    src: "/images/corporate-gifts/notebook.png",
    width: "clamp(6.25rem, 20vw, 8.5rem)",
    height: "clamp(7.5rem, 24vw, 10.5rem)",
    burstX: "clamp(-28rem, -36vw, -7rem)",
    burstY: "clamp(7rem, 18vw, 12rem)",
    /* 192px down, and its X is already pinned inside the edge, so the bottom
       edge governs: 112/192. */
    exitFactor: 0.58,
  },
  {
    name: "Tote Bag",
    src: "/images/corporate-gifts/tote-bag.png",
    width: "clamp(7.5rem, 24vw, 11.25rem)",
    height: "clamp(9.5rem, 31vw, 14.25rem)",
    burstX: "clamp(9rem, 39vw, 30rem)",
    burstY: "clamp(7rem, 18vw, 12rem)",
    /* 192px down, 480px right. The bottom edge governs: 112/192. */
    exitFactor: 0.58,
  },
  {
    name: "Water Bottle",
    src: "/images/corporate-gifts/water-bottle.png",
    width: "clamp(5rem, 20vw, 7.5rem)",
    height: "clamp(10.75rem, 35vw, 15.625rem)",
    burstX: "clamp(-44rem, -48vw, -9rem)",
    burstY: "clamp(4rem, 8vw, 10rem)",
    /* 115px down, 691px left. The Y is inside the box before it starts, so
       the left edge governs: 448/691. */
    exitFactor: 0.65,
  },
  {
    name: "Wireless Headphones",
    src: "/images/corporate-gifts/wireless-headphones.png",
    width: "clamp(7rem, 21vw, 9.5rem)",
    height: "clamp(5.5rem, 18vw, 7.5rem)",
    burstX: "clamp(9rem, 50vw, 40rem)",
    burstY: "clamp(11rem, 24vw, 18rem)",
    /* 288px down, 640px right. The bottom edge governs: 112/288. */
    exitFactor: 0.39,
  },
  {
    /* Back layer, lower-left — the outermost item in the spread, and the only
       one that reaches clear of the subheadline rather than over it.

       Anchored below the Water Bottle and the Notebook, and centred on the gap
       BETWEEN them rather than under either one. The X is the mean of the two
       neighbours' X clamps — and because clamp() averages the way the two do,
       the mean of theirs IS this: the Notebook's clamp(-28rem, -36vw, -7rem) and
       the Water Bottle's clamp(-44rem, -48vw, -9rem) average out to
       clamp(-36rem, -42vw, -8rem). Not a retyped approximation — the same value
       by one fewer step, and it tracks both neighbours at every width instead of
       only at the widths where two of the three happen to be clamped.

       That midpoint also puts the cutout well clear of the left edge, which is
       the job the +34px offset it replaces was doing. At 1025px the old clamp
       resolved to -437px and left 11px of margin; the midpoint leaves 18px. At
       1920px it is -576px against the old -734px, so 320px of margin where there
       used to be 162px. The offset is gone because there is nothing left to pull
       back from.

       The Y floor is 22.4rem, not the 18rem the vw term alone implied. 28vw only
       catches 22.4rem at 1280px exactly, so from 1025px up to 1280px the floor
       is what resolves: at the old 18rem this cutout sat 50-70px higher than the
       Notebook it exists to clear, and the two shared 1363px of ink at 1025px.
       Pinning the floor holds the whole 1025-1280px band at 358px — the same
       value 28vw reaches at 1280px — so the band is continuous with the layout
       above it and the Notebook keeps a 26.9px ink gap the entire way.

       Moving inboard costs horizontal room against the Notebook in the
       1244-1371px band, where both X clamps are pinned to their floors and both
       widths are capped, so their bounding boxes begin to graze — about 57px of
       box against a vertical overlap that is already ~20px. The ink still
       clears: the two are separated by their own transparent margins and by the
       float loop, and this one is on the back layer regardless. Worth knowing,
       though, that the old "0 ink collisions" claim was always about ink.

       `:nth-child(9)` in globals.css re-pins both axes at tablet and phone
       widths, the same way the first eight are handled. Its X there is this same
       midpoint, recomputed against each band's own pinned values. */
    name: "E-Ink Reader",
    src: "/images/corporate-gifts/e-ink-reader.png",
    width: "clamp(5.5rem, 20vw, 8rem)",
    height: "clamp(8rem, 29vw, 11.5rem)",
    burstX: "clamp(-36rem, -42vw, -8rem)",
    burstY: "clamp(22.4rem, 28vw, 23rem)",
    /* 368px down, 576px left. The bottom edge governs: 112/368 — one of the
       two that come in almost to the centre. */
    exitFactor: 0.3,
    layer: "back",
    floatDelay: "0.8s",
  },
  {
    /* Back layer, lower-right — the lowest item in the spread.
       Anchored below the Tote Bag and the Wireless Headphones.

       ── What this entry used to carry, and where it went ────────────────
       It previously held the largest burst scale in the set at 1.04, set
       against the 0.8 on the E-Ink above, on the theory that the pair
       separates on scale and tilt. Both cues are gone: scale and rotation are
       now single shared values, so this cutout arrives at 1 and at 0deg like
       the other nine. Uniform scale is the point of the change — a
       directional tilt is exactly what made edge hovers read differently from
       centre hovers — so the separation has to come from somewhere else.

       Two things still carry it. It is on the back layer (`z-index: -1`), and
       it is the furthest item from the centre, so it reads as the far side of
       the spread by position and paint order rather than by size. Those are
       also the cues that cannot vary with cursor position, which is the
       property worth having. The Y floor below is what keeps the two rows
       legible, and it is unchanged — it was set for the larger box and is now
       sized for a smaller one, so it is conservative by about 24px rather than
       tight.

       ── Why the Y floor is 24.8rem ──────────────────────────────────────
       The Headphones sit 12px above at the old 31vw position, and this
       cutout's box is tall enough that the two overlap by 10px between 1025px
       and 1200px. The floor exists to remove that: 31vw equals 24.8rem at
       1280px precisely, so 1025-1280px resolves flat at 397px and hands over
       to the vw term without a step. That lands the ink at y738-838 across
       the whole band, the same span it occupies at 1280px, leaving clear ink
       under the Headphones and over the Tote Bag.

       At the shared scale of 1 the box is 83px tall and 192px wide rather than
       104px and 203px, so those clearances grew — the floor is now
       over-provisioned rather than minimal. That is the cheap direction to be
       wrong in, and lowering it would be a layout change with nothing to gain.

       This is the widest cutout in the set at 12rem, so its X deliberately stops
       at the 32rem cap rather than tracking further out the way the Headphones
       do. 42vw would put the centre at 1152px on a 1280px viewport, hanging the
       right-hand end off-screen — the very thing the existing 42vw Headphones
       tablet rule already does, and the reason this one is pulled back. Its
       right-hand end still carries past the viewport edge between roughly 640px
       and 1210px, which is the same deliberate bleed the Tote Bag and the
       Headphones already make at those widths. */
    name: "Mechanical Wireless Keyboard",
    src: "/images/corporate-gifts/mechanical-keyboard.png",
    width: "clamp(8.5rem, 27vw, 12rem)",
    height: "clamp(3.7rem, 11.7vw, 5.2rem)",
    burstX: "clamp(12rem, 42vw, 32rem)",
    burstY: "clamp(24.8rem, 31vw, 26rem)",
    /* 416px down, 512px right. The bottom edge governs: 112/416 — the
       steepest in the set, and the cutout that travels furthest. */
    exitFactor: 0.27,
    layer: "back",
    floatDelay: "1.7s",
  },
];

/**
 * The hover trigger for the gift fountain.
 *
 * This owns the `.hero-heading-fountain` wrapper because that element — not the
 * cutouts, and not the headline — is what `:hover` is tested against, and
 * because it is the only box here that reliably receives pointer events:
 * `.hero-gift-fountain` is `pointer-events: none` and so never sees the cursor
 * itself, and the cutouts only opt back in once they are already revealed.
 *
 * `children` is the `<h1>`, passed down from the server component so that the
 * rest of the hero stays outside the client boundary.
 */
export function HeadingFountain({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GiftPhase>("idle");
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (exitTimer.current !== null) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    /* Safe to arrive from either exit phase, and safe to arrive before the
       browser has caught up: the exit rules are barred from matching while the
       trigger is hovered, so the reveal is taken from the stylesheet alone
       whichever phase the state was in a moment ago. */
    setPhase("idle");
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPhase("exiting");
    if (exitTimer.current !== null) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      exitTimer.current = null;
      setPhase("reset");
    }, GIFT_EXIT_MS);
  }, []);

  /* The inline half of the exit, applied in the same commit as the phase
     change. `globals.css` already forces `opacity: 0 !important` on the
     unhovered trigger, so this is belt-and-braces — and it loses to that
     stylesheet declaration either way, an `!important` rule outranking an
     inline style. The two agree rather than fight, which is the point: the
     component states the intent where the interaction lives, and the
     stylesheet is what actually enforces it.

     Note what is deliberately *not* here. The exit's endpoint is
     `--exit-factor` along the burst vector, and it can only come from the
     phase-gated rule, because the perimeter target is wrong at rest. So the
     trajectory still waits on this state by a frame, and the path it takes
     once it gets there is never seen — the fade has already finished. */
  const isExiting = phase === "exiting";

  return (
    <div
      className="hero-heading-fountain relative isolate z-0 mx-auto mt-0 w-full max-w-[60rem] px-5 py-0 sm:px-8"
      /* `min-height: 0` overrides `.hero-heading-fountain`'s layered
         `min-height: 16rem/20.5rem` — that reservation was the invisible
         buffer pushing the description away from the headline. The cutouts
         are absolutely positioned and `overflow: visible`, so the burst
         still renders from the heading's centre without the box. */
      style={{ minHeight: 0 }}
      data-gift-phase={phase}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero-gift-fountain" aria-hidden="true">
        {heroGiftBurst.map((gift, index) => {
          const cutoutStyle = {
            width: gift.width,
            height: gift.height,
            "--burst-x": gift.burstX,
            "--burst-y": gift.burstY,
            /* The three shared reveal values, identical on every cutout. Set
               here rather than in the stylesheet so the uniformity is stated
               once, in the place that owns the array — the reason all ten match
               is that there is one value, not that ten values happen to agree.
               `globals.css` still reads all three. */
            "--burst-scale": BURST_SCALE,
            "--burst-rotation": BURST_ROTATION,
            /* Read only by the exit rule, and as a unitless multiplier it has
               to survive `calc()` against a `clamp()` of lengths — a number
               rather than a percentage for the same reason. */
            "--exit-factor": gift.exitFactor,
            /* Once `isExiting ? "0ms" : gift.burstDelay` over a 0/40/…/360ms
               cascade, and now a single shared `0ms`. The exit declares its
               own `0ms` delay on both legs directly, so this never governed
               the return in any version — it is read only by the reveal, and
               the reveal wants no delay at all. It stays declared so the
               reveal's start time is explicit and identical for all ten
               rather than an absent value the stylesheet has to default. */
            "--burst-delay": BURST_DELAY,
            /* `undefined` is dropped by React rather than serialised, so at
               rest and on reveal this entry does not exist and the stylesheet
               owns opacity outright. The 250ms fade itself is declared in
               `globals.css`; setting the property here only moves the target
               value, it does not restate the timing. */
            opacity: isExiting ? 0 : undefined,
            "--float-delay":
              gift.floatDelay ??
              HERO_GIFT_FLOAT_DELAYS[index % HERO_GIFT_FLOAT_DELAYS.length],
            /* Only the back layer opts out of the shared `z-index: 0`. React drops
               an `undefined` style entry instead of serialising it, so the other
               eight keep inheriting `0` from the stylesheet and this stays a
               no-op for every caller that never sets `layer`.

               A negative index still paints inside `.hero-gift-fountain`'s own
               stacking context (it is `z-index: 1` under an `isolate`d wrapper),
               so it drops behind the other cutouts without escaping to the page
               and slipping under the hero's own backdrop. The h1 sits at `z-10`
               within that same isolated wrapper, so the copy stays on top of all
               ten either way. */
            zIndex: gift.layer === "back" ? "-1" : undefined,
          } as CSSProperties;

          return (
            <span className="hero-gift-cutout" key={gift.name} style={cutoutStyle}>
              <span className="hero-gift-float" aria-hidden="true">
                <Image
                  src={gift.src}
                  alt=""
                  fill
                  draggable={false}
                  sizes="200px"
                  quality={90}
                  className="select-none object-contain"
                />
              </span>
            </span>
          );
        })}
      </div>
      {children}
    </div>
  );
}
