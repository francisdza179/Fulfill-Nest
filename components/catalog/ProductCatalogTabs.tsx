"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import {
  CheckIcon,
  GiftIcon,
  PackageIcon,
  ShirtIcon,
  SmartphoneChargingIcon,
} from "@/components/ui/Icons";

function chunkProducts<T>(array: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size) as T[]);
  }
  return chunks;
}

/** Interactive half of the gifting catalog: a `tablist` of the four gift
 *  categories above a 4x4 panel of the selected category's gifts.
 *
 *  A CLIENT component, and that is inherent to the interaction - a
 *  selection-driven panel cannot be a server component. The server half,
 *  `sections/ProductCatalog.tsx`, keeps the heading and the sourcing callout
 *  and renders this; the split is the same one `ProductShowcase` makes with
 *  `ProductShowcaseClient`, for the same reason.
 *
 *  ARIA + KEYBOARD. Same contract as `ComplianceAssurance` and
 *  `IndustriesList`: `role="tablist"`, `role="tab"` + `aria-selected` +
 *  `aria-controls`, `role="tabpanel"` + `aria-labelledby`, a roving tabindex,
 *  and Home/End. Arrow keys follow orientation - this list is horizontal, so
 *  it is Left/Right where those two are Up/Down. Three components sharing one
 *  keyboard contract is the point; if these ever diverge it is a bug.
 *
 *  No auto-advance. `ComplianceAssurance` rotates on a timer; this does not,
 *  because a catalogue is a reference the reader is looking something up in
 *  rather than a pitch being made at them, and a panel that changes under
 *  someone mid-read is worse than one that waits to be asked. Selecting a tab
 *  is the only thing that moves it.
 *
 *  TAB LABEL LEGIBILITY. Reported as disappearing on click, five briefs now.
 *  Each has named a different stock-Tailwind cause. Everything they name has
 *  been checked against the code. Findings, in the order they came:
 *
 *    mutation of the tab array - impossible. `CATEGORIES` is a module-level
 *      `const` of `as const` objects; the only state write is
 *      `setActiveTabId`, and the tablist renders from `CATEGORIES` +
 *      `active.id` alone.
 *    DOM re-mounting - impossible. Keys are what React reconciles on, and
 *      every key here is a constant string (`category.id`, `product.name`,
 *      `spec`) that a click cannot alter. A tab switch reuses the same button
 *      node and updates only `className` and `aria-selected`.
 *    headless-ui hidden states - no such dependency. `package.json` has no
 *      `@radix-ui`, `@headlessui`, `react-aria`, `ariakit` or `downshift`.
 *    global button overrides - none exist. app/globals.css contains ZERO rules
 *      for `[aria-selected]`, `button:active`, `button:focus`, a bare `button`
 *      selector, `color: transparent` or `visibility: hidden`. The only focus
 *      rule in the file is `:focus-visible`.
 *    parent overflow - none to fix. The wrapper in sections/ProductCatalog.tsx
 *      is a bare `<div className="mt-14">`: no fixed height, no `overflow-*`,
 *      nothing that can clip.
 *    opacity-0 / text-white / text-transparent / bg-red-50 / text-red-600 /
 *    border-red-200 / text-gray-600 / `invisible` - zero occurrences on any
 *      code line. The only `hidden` tokens are `overflow-hidden` on the
 *      product CARDS, clipping media corners.
 *
 *  ONE REAL MECHANISM WAS FOUND, and it is not in this file. The tablist
 *  carries `data-reveal-stagger`, so RevealOnScroll adds `reveal-on-scroll`
 *  to these four buttons and app/globals.css:858 gives that class:
 *
 *      .reveal-on-scroll { opacity: 0; transform: translateY(24px) }
 *
 *  Those rules are deliberately UNLAYERED - the file says so at line 854,
 *  "they must win over card-level `transition-all` utilities without needing
 *  !important". Unlayered CSS outranks every @layer, which outranks nothing:
 *
 *    => the `opacity-100` on THIS button is INERT. It is in Tailwind's
 *       utilities layer; `.reveal-on-scroll` is unlayered; unlayered wins.
 *       That is why three rounds of adding `opacity-100` here changed nothing.
 *       The `opacity-100` on the span and the icon is NOT inert - they are
 *       not reveal targets, only direct children of the stagger container are.
 *
 *  The buttons return to opacity 1 only when the section's IntersectionObserver
 *  fires and `is-revealed` / `is-settled` land (globals.css:874,882). Until
 *  then they are genuinely invisible. So there IS a real window here - but it
 *  is the whole BUTTON, icon included, and it is JS-gated rather than
 *  click-gated. Diagnostic: if the 20px icon stayed and only the text went,
 *  this is not the cause; the reveal takes both together.
 *
 *  Colour, for the record. The label rides the pill's own colour: white on
 *  `bg-charcoal` at 17.74:1 active, `text-charcoal/70` on `bg-linen` at 5.87:1
 *  inactive. The `text-red-600` and `text-[#D97757]` asked for in earlier
 *  rounds measure 4.48:1 and 2.94:1 on the fills they would sit on. Both
 *  rejected - recorded here because they have now been asked for four times,
 *  and because the numbers settle it rather than the preference.
 *
 *  The 4x4 PANEL. `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
 *  gap-6`, so a full category of sixteen resolves to 4x4 on desktop and
 *  4 / 3 / 2 / 1 below. The count is no longer uniform: `apparel` holds ELEVEN
 *  after five items were cut, so on desktop it renders as 4 + 4 + 3 and the
 *  last row is short. Nothing breaks - grid cells are equal height, `mt-auto`
 *  keeps spec ticks bottom-aligned, and the empty two cells simply stay empty -
 *  but it is a visible ragged edge on one tab and not the others.
 *  Cards are `aspect-square` media over a title, a line of copy and a short
 *  `CheckIcon` spec list; the spec list is `mt-auto` so the ticks align across a
 *  row of cards of unequal copy length. Every card carries exactly two specs,
 *  so a row of cards differs only in copy length and never in height.
 *  Spec icons are 16px against 12px text, per the house size rule. The card
 *  watermark is `text-accent-700/25`, the
 *  house terracotta. The brief asked for `#D97757`: that is 2.94:1 and is not
 *  a token here, though at 25% it is decorative and carries no meaning, so
 *  1.4.11 does not bite - the token is still the right thing to carry it.
 *
 *  PRODUCT COPY IS ILLUSTRATIVE, AND THIS IS STILL THE LARGEST OPEN RISK ON
 *  THE PAGE. Fifty-nine products in total and the counts are NOT uniform any
 *  more: sixteen in `tech`, eleven in `apparel`, sixteen in `appliances`,
 *  sixteen in `beauty`. `apparel` was cut from sixteen to eleven on
 *  instruction, so any copy or code that assumes sixteen-per-category is now
 *  wrong - see the 4x4 panel note above and the sample disclaimer in
 *  `sections/ProductCatalog.tsx`, both of which were corrected here.
 *
 *  TAB ORDER. `tech`, `apparel`, `appliances`, `beauty`. `beauty` was moved to
 *  fourth on instruction; it was second as `lifestyle`. This is presentation
 *  order only and nothing depends on it beyond reading left to right - but note
 *  that `CATEGORIES[0]` is the fallback for an unresolvable `activeTabId` and
 *  the initial `useState`, so `tech` must stay first or the default tab moves.
 *
 *  PRODUCT ORDER IS ALPHABETICAL, PER CATEGORY. All four `products` arrays are
 *  sorted A-Z by `name` on instruction. Two consequences to know before adding
 *  anything: `"4K Webcam with Ring Light"` sorts FIRST in `tech`, because a
 *  digit precedes a letter; and the comparison is case-insensitive, so
 *  `"Ultrasonic ..."` precedes `"USB ..."` in `appliances` (l before s) even
 *  though raw ASCII would put USB first. Culture-aware collation was rejected
 *  for the sort because it discards the hyphen in "USB-C" and its result can
 *  vary by environment - literal ordinal is deterministic. New products go in
 *  alphabetical position, not appended.
 *
 *  NAMES. Forty-one are the user's own words, supplied verbatim across briefs:
 *  two in `tech` ("Noise-Canceling ANC Headphones", "Precision Wireless Gaming
 *  Mouse"), the seven in `apparel` that were renamed in place on instruction
 *  ("Sports Cap", "Cotton Socks", "Oversized Tee", "Duffel Bag", "Sweatshirt",
 *  "Linen Blend Collar Shirt", "Leather Belt"), and the sixteen each in
 *  `appliances` and `beauty`. The remaining EIGHTEEN were written here to fill a
 *  grid and still need replacing with the real assortment: fourteen in `tech`,
 *  four in `apparel` ("Premium Organic Cotton Hoodie", "Performance Tech
 *  Polo", "Eco-Friendly Canvas Tote", "Embroidered Denim Jacket"). No
 *  assistant-written NAME survives in `appliances` or `beauty`.
 *
 *  The name total has moved 41 -> 33 -> 41 across three rounds, which says
 *  more about how these two tabs are being edited than about copy quality: both
 *  are being restocked wholesale each time, so the count oscillates rather than
 *  trending. The BLURB split has not moved with it - still twenty user-written,
 *  thirty-nine written here.
 *
 *  The `apparel` renames strip the branding qualifier off the name
 * ("Branded Baseball Cap" -> "Sports Cap"). The blurbs survive that intact -
 *  each still carries its material, closure or capacity, and none of them ever
 *  claimed personalisation in the first place. Worth knowing: the category is
 *  titled "Branded Apparel & Swag", and after these renames the SEVEN renamed
 *  cards contain no branding claim at all. The four carried-over cards are what
 *  still carry it - "Embroidered logo", "Print-ready", "Two logo placements".
 *
 *  BEAUTY WAS REPLACED WHOLESALE, AND ITS COPY PROVENANCE CHANGED WITH IT. All
 *  sixteen `beauty` NAMES are still the user's words, but only three of the
 *  sixteen BLURBS are: "Aromatherapy Essential Oil Diffuser", "Facial Roller"
 *  (renamed in place from "Rose Quartz Facial Roller", blurb and specs left as
 *  they were because only the name was asked to change) and "Silk Sleep Eye
 *  Mask". The other thirteen blurbs and all thirty-two specs were written here
 *  from the names alone.
 *
 *  One upside worth recording: the outgoing `beauty` copy was the catalogue's
 *  worst unverified-claims risk, because it asserted ingredients and provenance
 *  on a live page - "Epsom and Himalayan sea salts", "hyaluronic acid", "raw
 *  shea butter and jojoba oil", "kaolin clay", "Pure mulberry silk",
 *  "natural bristles". Those are gone with the items that carried them, so that
 *  risk is now retired rather than outstanding.
 *
 *  Two things the next editor should know about this tab. (1) `"Facial Roller"`
 *  is a generic name sitting above a blurb and a spec that both still say rose
 *  quartz - correct, but a reader may notice the mismatch. (2) The tab is
 *  titled "Beauty & Wellness" and this list is now mostly PERSONAL CARE AND
 *  FITNESS GEAR, not cosmetics: shaver, toothbrush, hair dryer, straightener,
 *  blender, humidifier, dumbbell, kettlebell, exercise ball, weighing scale,
 *  yoga mat. If the title is meant to stay accurate, the tab or the title needs
 *  a decision.
 *
 *  The overlap this tab used to have with `appliances` is now gone: "USB Desk
 *  Humidifier" was removed from `appliances` on instruction, so the bare
 *  "Humidifier" here no longer has a near-twin to be confused with. That was
 *  the last cross-tab name collision in the catalogue.
 *
 *  APPLIANCES HAS NOW BEEN RESTOCKED THREE TIMES IN THREE ROUNDS and has the
 *  highest churn of any tab on the site. Current state: seven items carried over
 *  untouched, two renamed in place ("Compact Food Dehydrator" ->
 *  "Food Dehydrator", "Desktop Vacuum Cleaner" -> "Vacuum Cleaner", both keeping
 *  their original blurbs and specs, and both renamed WITHOUT introducing a
 *  mismatch this time - the blurbs say "countertop dehydrator" and "desk
 *  vacuum", neither of which contradicted the shorter name), and seven written
 *  here from their names alone.
 *
 *  Two things the next editor should know. (1) `"Coffee Maker"` still sits above
 *  a blurb that says "Durable glass cold brew pitcher" - the rename from
 *  "Cold Brew Coffee Maker" was name-only, in the same way `"Facial Roller"` was
 *  in `beauty`. These are the TWO name/blurb mismatches on the catalogue. (2)
 *  The category watermark is still `PackageIcon`, and with a rice cooker, a
 *  waffle maker and an egg cooker on the tab it reads more like shipping than
 *  like a kitchen. Worth revisiting alongside `beauty`, which still wears
 *  `GiftIcon` while `HeartPulseIcon` sits unused in `Icons.tsx`.
 *
 *  Unlike `beauty`, this tab's title now FITS its contents better than it did.
 *  Ten of the sixteen are kitchen appliances and the remaining six are home and
 *  office equipment, so "Home & Office Appliances" is doing real work. The
 *  "Beauty & Wellness" mismatch is still unresolved and is now the only tab
 *  whose title misdescribes it.
 *
 *  `"Electric Iron Box"` is deliberate regional English - "iron box" is how the
 *  appliance is named in India, and plain "Electric Iron" would read strangely
 *  to the audience this catalogue is written for. Not a typo.
 *
 *  SPECS. ALL fifty-nine spec sets are assistant-written. No brief has ever
 *  supplied a spec list; the one time specs were dictated (four on the gaming
 *  mouse) the user asked for them cut back to two. So the two-spec contract on
 *  every card is enforced, but the spec STRINGS are not the user's words. Each
 *  new pair is lifted out of the blurb directly above it rather than invented
 *  alongside it, which keeps the card from asserting anything its own copy does
 *  not already say - it is still unverified copy, just copy with no independent
 *  claim in it.
 *
 *  CATEGORY IDS. Renamed three times, each time to match the title: `wellness`
 *  -> `lifestyle` -> `beauty`, and `desk` -> `appliances`. An id that disagrees
 *  with its own title is a trap for whoever edits this next. Nothing outside
 *  this file reads them: the only consumer is the `gift-tab-` / `gift-panel-`
 *  id pair generated from `category.id` in this same component, and there is no
 *  deep link, stored preference or cross-file reference. Purely internal. The
 *  rename does change those two generated id strings, so any external anchor
 *  ever written against `#gift-tab-lifestyle` would break - there are none.
 *
 *  `beauty` still wears `GiftIcon`, inherited from the `wellness` tab it was
 *  before it was a beauty category. It is generic enough to pass, and
 *  `HeartPulseIcon` is sitting unused in `Icons.tsx` if a wellness-appropriate
 *  mark is ever wanted; not changed here because no brief asked for it.
 *
 *  MEDIA. ALL FOUR categories now carry real photography, one `image` key per
 *  product, under `public/images/catalog/<category>/`. Every one of the 64
 *  products has a key, so the fallback branch below is now dead on the shipped
 *  data and exists only to keep the component type-safe against a future
 *  category that has no media. The `in` check is load-bearing regardless:
 *  `CATEGORIES` is `as const` with no declared type, so a plain
 *  `product.image` would not typecheck.
 *
 *  `tech` WAS REBUILT to match its source folder, and the tab's item list was
 *  previously WRONG about it. For one round the folder and the tab disagreed
 *  eight items deep: eight images had no product, eight products had no image,
 *  and half the tab was wired. The source folder is now authoritative for this
 *  category and the sixteen names below are its filenames verbatim, in its
 *  order, which is already ordinal-ascending. That produced:
 *
 *    renamed  4K Webcam with Ring Light      -> 4K Webcam
 *    renamed  Folding Laptop Riser           -> Aluminum Laptop Stand
 *    renamed  Precision Wireless Gaming Mouse -> Gaming mouse
 *    kept     Ergonomic Vertical Mouse, Noise-Canceling ANC Headphones,
 *             Noise-Isolating Earbuds, Portable Bluetooth Speaker,
 *             Premium Mechanical Keyboard  (5 exact matches, copy untouched)
 *    added    Backpack, Blue Light Blocking Glasses, Desktop Digital Clock,
 *             Fitness band, Lavalier Wireless Microphone, Portable Power Bank,
 *             Tech Organizer Travel Pouch, USB Condenser Microphone
 *    removed  Braided 3-in-1 Charging Cable, Conference Speakerphone,
 *             Pocket Photo Printer, Smart Digital Notebook Set,
 *             Smart Water Bottle, USB-C Docking Station, USB-C Hub 7-in-1,
 *             Wireless Charging Desk Pad
 *
 *  Three consequences of matching the folder exactly, all deliberate:
 *
 *  1. "Fitness band" and "Gaming mouse" keep the folder's LOWERCASE second
 *     word, so the tab is no longer internally consistent in title case. They
 *     read oddly in a grid but the brief asked for exact folder names.
 *  2. "Aluminum" is the American spelling. The inherited blurb used to read
 *     "An aluminium riser" - same card, two spellings - left alone back then
 *     because that brief only authorised renaming. It briefly went away when
 *     the blurb was rewritten to lead on portability, then came BACK when this
 *     round's rewrite had to settle the form factor (below) and "aluminum" was
 *     chosen to match the product name. So the conflict is now resolved in
 *     favour of the American spelling, on the card whose name is fixed. Note
 *     that "A hot-swappable mechanical keyboard in a milled aluminium case."
 *     further down this category still uses the British spelling; that one is
 *     untouched user copy and is the remaining inconsistency here.
 *
 *  2b. THE FORM FACTOR OF "Aluminum Laptop Stand" WAS SET FROM THE IMAGE, not
 *     from copy, because the copy had it backwards twice. It arrived reading
 *     "An aluminium riser that lifts a laptop to eye level and folds flat
 *     after." / ["Folding aluminium", "Folds flat"], was then rewritten to
 *     "Foldable, ultra-slim design that collapses flat for effortless travel
 *     and storage." / ["Collapses flat for travel", "Ultra-slim foldable
 *     profile"], and is now the opposite claim again: a solid one-piece riser.
 *
 *     The evidence is the source PNG's own alpha channel, which is the one
 *     trustworthy measurement available - the published JPEG cannot be used
 *     because its backdrop gradient trips a corner-keyed background test at
 *     the frame edges and yields a nonsense bbox of 1200x685 spanning every
 *     margin. From `Aluminum Laptop Stand.png` (967x978, 72.0% transparent):
 *
 *        bbox 816x467, aspect 1.747, margins L81 R70 T257 B254 (centred)
 *        overall solid-fill 68.8%, rising to 96.7% through the core
 *        per-row width: narrow at the top, widening to ~797 at the upper
 *        middle, pinching to ~336-456 across a waist near y533-578, widening
 *        again to ~774 at y625-647, then narrowing to the foot
 *
 *     That is a deployed wedge in two lobes about a narrow waist, and it is
 *     mostly solid. A stand that collapses COMPLETELY FLAT and is ULTRA-SLIM
 *     photographs as a long thin slab - aspect 3-6:1 at low fill - which this
 *     is not. So the two portability claims were unsupported by the asset and
 *     are gone. Recorded honestly: a waist is also what a hinge looks like, so
 *     silhouette geometry alone cannot prove the absence of a hinge, and no
 *     live-browser or zoomed visual check was possible. What it does settle is
 *     that the card cannot advertise "ultra-slim" or "completely flat" while
 *     showing this form. "Solid one-piece" is the weaker of the two readings -
 *     a hinged stand in deployed position would look the same - so if this
 *     product is in fact foldable, the correct copy is neither of the two
 *     options that were offered.
 *  3. "4K Webcam" drops "with Ring Light" while the blurb keeps "a built-in
 *     ring light". Name-only rename again, so the ring light is now a claim the
 *     title does not make - and unverifiable from the image.
 *
 *  Blurb provenance for this category is now 8 user / 8 assistant and spec
 *  provenance is 2 user / 30 assistant: the eight added items were written here
 *  from their names alone, and their blurbs and specs are unverified claims.
 *  The two long "Precision Tracking"/"Dual-Mode Wireless" specs under Gaming
 *  mouse are the user's own, carried over verbatim.
 *
 *  `apparel` WAS THEN REBUILT the same way, and its source folder had itself
 *  been RENAMED - it was `Wellness & Gourmet Treats 16 Items`, which described
 *  nothing in it, and is now `Branded Apparel & Swag - 16 items`. Its sixteen
 *  filenames are now authoritative for the tab:
 *
 *    kept     Duffel Bag, Eco-Friendly Canvas Tote, Embroidered Denim Jacket,
 *             Leather Belt, Linen Blend Collar Shirt, Performance Tech Polo,
 *             Premium Organic Cotton Hoodie, Sports Cap, Sweatshirt  (9 exact)
 *    renamed  Oversized Tee   -> Bamboo Blend Oversized Tee
 *    renamed  Cotton Socks     -> Organic Cotton Crew Socks
 *             (both kept their original blurbs and specs untouched; the
 *              original copy already said "bamboo-cotton blend" and "combed
 *              organic cotton", so the more specific names did not contradict it)
 *    added    Athleisure Athletic Shorts, Athleisure Jogger Pants,
 *             Canvas Messenger Bag, Leather Crossbody Bag,
 *             Lightweight Travel Vest
 *
 *  Two standing problems with this tab, both flagged before and neither fixed
 *  by matching the folder. (1) The tab is titled "Branded Apparel & Swag" but
 *  only FOUR of its sixteen cards make any branding claim at all - the tote
 *  ("print-ready"), the denim jacket ("two logo placements"), the belt
 *  ("engravable buckle") and the hoodie ("embroidered logo"). The other twelve
 *  are described purely as products, so a tab promising branded swag delivers
 *  mostly blanks. (2) The five items added this round are unbranded too, so
 *  matching the folder made the ratio slightly worse, not better.
 *
 *  Blurb provenance for this category is 11 user / 5 assistant and spec
 *  provenance is 0 user / 32 assistant. All five added items were written here
 *  from their names alone; their specs are unverified claims.
 *
 *  `appliances` was the last tab and the easiest of the four: its sixteen
 *  product names were ALREADY byte-identical to its source folder's sixteen
 *  filenames, in the same order, already ordinal-ascending. So no rename was
 *  required and no copy changed - sixteen `image` keys were inserted and
 *  nothing else was touched. Every other category needed its list rebuilt
 *  first, which is why this one is worth noting as the baseline.
 *
 *  All four image sets were produced from transparent-background PNG cutouts in
 *  the
 *  media folder by compositing each onto a generated studio surface - four
 *  warm-neutral materials on rotation, a three-lobe contact shadow from a
 *  45-degree key, and one shared 4800K grade. Three things about that pipeline
 *  are worth knowing before editing them again. The scale is a MODELED
 *  approximation, not measured: the generating script holds assumed real-world
 *  dimensions, and they only set the ordering of items relative to each other.
 *  The studio tone is unified only around the BACKDROP - the top band of each
 *  frame gives a warmth spread of 8.4 (beauty) and 8.9 (tech), and the four
 *  surfaces land within ~0.5 of each other across both sets so the catalogue
 *  reads as one continuous shoot. But full-frame spread is 58 for beauty and 25
 *  for tech, because each product keeps its own intrinsic colour. That is
 *  deliberate; a blue exercise ball made genuinely warm-neutral would just look
 *  brown. And perspective is NOT unified - it is baked into the cutouts, so the
 *  framing is consistent but the lens and camera angle are not. */

const CATEGORIES = [
  {
    id: "tech",
    title: "Executive Tech & Productivity",
    Icon: SmartphoneChargingIcon,
    /* ALL SIXTEEN PHOTOGRAPHS WERE REPLACED IN ONE PASS, AND EVERY PATH NOW
     * ENDS IN `.png`. The filenames are not a choice: each source file is named
     * after its item title verbatim, and slugging that title reproduces the
     * existing basename exactly - 16 of 16, byte-for-byte, in the same order,
     * with no version token on either side. Two source names have a lowercase
     * second word (`Fitness band`, `Gaming mouse`) and the item titles already
     * carried that casing, so nothing needed normalising. The extension change
     * alone busts the `next/image` cache for all sixteen.
     *
     * SOURCE RESOLUTION IS THE ONE THING TO KNOW ABOUT THIS SET: every file is
     * 288x288. The outgoing set was 1200x1200. The card frame is `aspect-square`
     * at `sizes="25vw"` above `lg`, so a 1440px viewport asks for a 360px box.
     * Measured against the running optimizer: it will NOT upscale, it caps
     * every request above 288 and returns 288x288, so nothing is fabricated -
     * but a 288px source in a 360px box is an upscale the browser performs.
     * DPR 1 gets 288 into 360 (80% coverage), DPR 2 gets 288 into 720 (40%).
     * `object-cover` cannot invent the missing pixels, and nothing in the
     * markup can either. If these read soft on a hi-DPI screen the fix is
     * larger exports from the source shoot, not CSS. Same constraint as the
     * `apparel` and `beauty` tabs, which were replaced the same way.
     *
     * The set is 57.1% lighter (1,722,926 B -> 738,597 B). Weight was never
     * the constraint here; sharpness is.
     *
     * The sixteen outgoing `.jpg` files are still on disk, unreferenced.
     * Deleting them needs explicit approval. */
    products: [
      {
        name: "4K Webcam",
        image: "/images/catalog/tech/4k-webcam.png",
        blurb:
          "A 4K autofocus webcam with a built-in ring light for rooms that lose the afternoon.",
        specs: ["4K autofocus", "Dual microphones"],
      },
      {
        name: "Aluminum Laptop Stand",
        image: "/images/catalog/tech/aluminum-laptop-stand.png",
        blurb:
          "Solid one-piece ergonomic aluminum riser engineered for maximum desk stability and optimal heat dissipation.",
        specs: ["Solid one-piece body", "Passive heat dissipation"],
      },
      {
        name: "Backpack",
        image: "/images/catalog/tech/backpack.png",
        blurb:
          "Padded commuter backpack with a cushioned laptop sleeve and a quick-access top pocket for the daily carry.",
        specs: ["Cushioned laptop sleeve", "Water-resistant shell"],
      },
      {
        name: "Blue Light Blocking Glasses",
        image: "/images/catalog/tech/blue-light-blocking-glasses.png",
        blurb:
          "Slim-framed glasses with amber lenses that cut screen glare through a long spreadsheet session.",
        specs: ["Amber anti-glare lenses", "Slim frame"],
      },
      {
        name: "Desktop Digital Clock",
        image: "/images/catalog/tech/desktop-digital-clock.png",
        blurb:
          "Minimal desk clock with a large readable display and a silent tick that suits an open office.",
        specs: ["Large readable display", "Silent movement"],
      },
      {
        name: "Ergonomic Vertical Mouse",
        image: "/images/catalog/tech/ergonomic-vertical-mouse.png",
        blurb:
          "A vertical mouse that keeps the forearm in line instead of turned sideways.",
        specs: ["Vertical grip", "Silent clicks"],
      },
      {
        name: "Fitness band",
        image: "/images/catalog/tech/fitness-band.png",
        blurb:
          "Everyday activity tracker logging steps, sleep and heart rate, with a week of battery between charges.",
        specs: ["Step and sleep tracking", "7-day battery"],
      },
      {
        name: "Gaming mouse",
        image: "/images/catalog/tech/gaming-mouse.png",
        blurb:
          "High-performance ergonomic wireless mouse engineered for seamless switching between high-stakes focus work and gaming.",
        specs: [
          "Precision Tracking (High-DPI Optical Sensor)",
          "Dual-Mode Wireless & USB-C Fast Charging",
        ],
      },
      {
        name: "Lavalier Wireless Microphone",
        image: "/images/catalog/tech/lavalier-wireless-microphone.png",
        blurb:
          "Clip-on wireless microphone that takes a call hands-free from across the room without a cable in the way.",
        specs: ["Clip-on wireless", "Hands-free calls"],
      },
      {
        name: "Noise-Canceling ANC Headphones",
        image: "/images/catalog/tech/noise-canceling-anc-headphones.png",
        blurb:
          "Over-ear wireless headphones with adaptive noise cancellation and a battery that survives a long-haul.",
        specs: ["Adaptive noise cancelling", "30-hour battery"],
      },
      {
        name: "Noise-Isolating Earbuds",
        image: "/images/catalog/tech/noise-isolating-earbuds.png",
        blurb:
          "Sealed in-ear buds tuned for calls on an open-plan floor.",
        specs: ["Sealed in-ear fit", "4-mic call pickup"],
      },
      {
        name: "Portable Bluetooth Speaker",
        image: "/images/catalog/tech/portable-bluetooth-speaker.png",
        blurb:
          "A palm-sized speaker with all-day playback and a shell that survives a monsoon.",
        specs: ["20-hour playback", "IP67 water resistant"],
      },
      {
        name: "Portable Power Bank",
        image: "/images/catalog/tech/portable-power-bank.png",
        blurb:
          "Slim power bank that tops a phone up twice over and recharges itself over USB-C.",
        specs: ["10,000mAh capacity", "USB-C recharge"],
      },
      {
        name: "Premium Mechanical Keyboard",
        image: "/images/catalog/tech/premium-mechanical-keyboard.png",
        blurb:
          "A hot-swappable mechanical keyboard in a milled aluminium case.",
        specs: ["Hot-swappable switches", "Mac and PC layouts"],
      },
      {
        name: "Tech Organizer Travel Pouch",
        image: "/images/catalog/tech/tech-organizer-travel-pouch.png",
        blurb:
          "Structured zip pouch with elastic loops that keeps cables, adapters and a spare mouse in one place.",
        specs: ["Elastic cable loops", "Zip closure"],
      },
      {
        name: "USB Condenser Microphone",
        image: "/images/catalog/tech/usb-condenser-microphone.png",
        blurb:
          "Studio condenser microphone on a desk stand for clear voice and video calls from home.",
        specs: ["Desk stand included", "Cardioid pickup"],
      },
    ],
  },
  {
    id: "apparel",
    title: "Branded Apparel & Swag",
    Icon: ShirtIcon,
    /* ALL SIXTEEN PHOTOGRAPHS WERE REPLACED IN ONE PASS, AND EVERY PATH NOW
     * ENDS IN `.png`. The filenames are not a choice: each source file is named
     * after its item title verbatim, and slugging that title reproduces the
     * existing basename exactly - 16 of 16, byte-for-byte, in the same order,
     * with no version token on either side. The extension change alone busts
     * the `next/image` cache for all sixteen.
     *
     * SOURCE RESOLUTION IS THE ONE THING TO KNOW ABOUT THIS SET: every file is
     * 288x288. The outgoing set was 1200x1200. The card frame is `aspect-square`
     * at `sizes="25vw"` above `lg`, so a 1440px viewport asks for a 360px box.
     * Measured against the running optimizer: it will NOT upscale, it caps
     * every request above 288 and returns 288x288, so nothing is fabricated -
     * but a 288px source in a 360px box is an upscale the browser performs.
     * DPR 1 gets 288 into 360 (80% coverage), DPR 2 gets 288 into 720 (40%).
     * `object-cover` cannot invent the missing pixels, and nothing in the
     * markup can either. If these read soft on a hi-DPI screen the fix is
     * larger exports from the source shoot, not CSS. Same constraint as the
     * `beauty` tab, which was replaced in the same way.
     *
     * The set is 54.8% lighter (2,388,250 B -> 1,080,526 B). Weight was never
     * the constraint here; sharpness is.
     *
     * `athleisure-jogger-pants-v2.png` is the ONE file in this tab that has
     * been re-cut. The source photograph was replaced in place after the first
     * pass copied it (58,408 B -> 53,728 B), so overwriting
     * `athleisure-jogger-pants.png` would have left every visitor pinned to
     * the old picture by the immutable `next/image` cache described above.
     * Bumping the filename is the fix. The unversioned
     * `athleisure-jogger-pants.png` is therefore now retired too - 17 `.png`
     * files sit in this folder for 16 live cards.
     *
     * The sixteen outgoing `.jpg` files are still on disk, unreferenced.
     * Deleting them needs explicit approval. */
    products: [
      {
        name: "Athleisure Athletic Shorts",
        image: "/images/catalog/apparel/athleisure-athletic-shorts.png",
        blurb:
          "Quick-dry training shorts with a zip pocket and a liner that stays put through squats.",
        specs: ["Quick-dry fabric", "Zip side pocket"],
      },
      {
        name: "Athleisure Jogger Pants",
        image: "/images/catalog/apparel/athleisure-jogger-pants-v2.png",
        blurb:
          "Tapered joggers in a brushed stretch knit with a drawcord waist and a zip ankle cuff.",
        specs: ["Brushed stretch knit", "Zip ankle cuff"],
      },
      {
        name: "Bamboo Blend Oversized Tee",
        image: "/images/catalog/apparel/bamboo-blend-oversized-tee.png",
        blurb:
          "A relaxed-fit tee in a bamboo-cotton blend that drapes instead of clinging.",
        specs: ["Bamboo-cotton blend", "Relaxed fit"],
      },
      {
        name: "Canvas Messenger Bag",
        image: "/images/catalog/apparel/canvas-messenger-bag.png",
        blurb:
          "Waxed-canvas shoulder bag with a flap buckle and a padded divider for a laptop.",
        specs: ["Waxed canvas", "Padded laptop divider"],
      },
      {
        name: "Duffel Bag",
        image: "/images/catalog/apparel/duffel-bag.png",
        blurb: "A 45L canvas duffel sized for a two-night trip.",
        specs: ["45L canvas", "Detachable strap"],
      },
      {
        name: "Eco-Friendly Canvas Tote",
        image: "/images/catalog/apparel/eco-friendly-canvas-tote.png",
        blurb:
          "A 450 GSM heavy-duty organic cotton canvas tote with reinforced handles and a print-ready face.",
        specs: ["450 GSM heavy-duty organic cotton", "Print-ready"],
      },
      {
        name: "Embroidered Denim Jacket",
        image: "/images/catalog/apparel/embroidered-denim-jacket.png",
        blurb:
          "A mid-weight denim jacket, embroidered on the chest and the sleeve.",
        specs: ["Mid-weight denim", "Two logo placements"],
      },
      {
        name: "Leather Belt",
        image: "/images/catalog/apparel/leather-belt.png",
        blurb:
          "A full-grain belt whose buckle can be engraved per person.",
        specs: ["Full-grain leather", "Engravable buckle"],
      },
      {
        name: "Leather Crossbody Bag",
        image: "/images/catalog/apparel/leather-crossbody-bag.png",
        blurb:
          "Compact crossbody in pebbled leather with an adjustable strap for hands-free carry.",
        specs: ["Pebbled leather", "Adjustable strap"],
      },
      {
        name: "Lightweight Travel Vest",
        image: "/images/catalog/apparel/lightweight-travel-vest.png",
        blurb:
          "Packable vest with zip pockets that folds into its own pocket for carry-on trips.",
        specs: ["Packs into itself", "Multiple zip pockets"],
      },
      {
        name: "Linen Blend Collar Shirt",
        image: "/images/catalog/apparel/linen-blend-collar-shirt.png",
        blurb:
          "A relaxed shirt in a breathable linen-cotton blend for the long summer.",
        specs: ["Linen-cotton blend", "Camp collar"],
      },
      {
        name: "Organic Cotton Crew Socks",
        image: "/images/catalog/apparel/organic-cotton-crew-socks.png",
        blurb: "A three-pair crew sock pack in combed organic cotton.",
        specs: ["Combed organic cotton", "3 pairs"],
      },
      {
        name: "Performance Tech Polo",
        image: "/images/catalog/apparel/performance-tech-polo.png",
        blurb:
          "A moisture-wicking polo that still looks right at the end of a long day.",
        specs: ["Moisture-wicking", "3-button placket"],
      },
      {
        name: "Premium Organic Cotton Hoodie",
        image: "/images/catalog/apparel/premium-organic-cotton-hoodie.png",
        blurb:
          "A 400gsm organic-cotton hoodie, embroidered rather than printed.",
        specs: ["400gsm organic cotton", "Embroidered logo"],
      },
      {
        name: "Sports Cap",
        image: "/images/catalog/apparel/sports-cap.png",
        blurb:
          "A six-panel cotton twill cap with an adjustable brass closure.",
        specs: ["Cotton twill", "Adjustable closure"],
      },
      {
        name: "Sweatshirt",
        image: "/images/catalog/apparel/sweatshirt.png",
        blurb:
          "A crewneck that holds its shape through the hundredth wash.",
        specs: ["Loopback cotton", "Ribbed cuffs"],
      },
    ],
  },
  {
    id: "appliances",
    title: "Home & Office Appliances",
    Icon: PackageIcon,
    /* ALL SIXTEEN PHOTOGRAPHS WERE REPLACED IN ONE PASS, AND EVERY PATH NOW
     * ENDS IN `.png`. The filenames are not a choice: each source file is named
     * after its item title verbatim, and slugging that title reproduces the
     * existing basename exactly - 16 of 16, byte-for-byte, in the same order,
     * with no version token on either side. The extension change alone busts
     * the `next/image` cache for all sixteen.
     *
     * SOURCE RESOLUTION IS THE ONE THING TO KNOW ABOUT THIS SET: every file is
     * 288x288. The outgoing set was 1200x1200. The card frame is `aspect-square`
     * at `sizes="25vw"` above `lg`, so a 1440px viewport asks for a 360px box.
     * Measured against the running optimizer: it will NOT upscale, it caps
     * every request above 288 and returns 288x288, so nothing is fabricated -
     * but a 288px source in a 360px box is an upscale the browser performs.
     * DPR 1 gets 288 into 360 (80% coverage), DPR 2 gets 288 into 720 (40%).
     * `object-cover` cannot invent the missing pixels, and nothing in the
     * markup can either. If these read soft on a hi-DPI screen the fix is
     * larger exports from the source shoot, not CSS. Same constraint as the
     * `tech`, `apparel` and `beauty` tabs, all four replaced the same way.
     *
     * The set is 55.8% lighter (1,801,367 B -> 796,583 B). Weight was never
     * the constraint here; sharpness is.
     *
     * The sixteen outgoing `.jpg` files are still on disk, unreferenced.
     * Deleting them needs explicit approval. */
    products: [
      {
        name: "Air Fryer",
        image: "/images/catalog/appliances/air-fryer.png",
        blurb:
          "Countertop air fryer that circulates hot air for crisp, low-oil fries, wings and roasted vegetables.",
        specs: ["Hot-air circulation", "Low-oil cooking"],
      },
      {
        name: "Coffee Maker",
        image: "/images/catalog/appliances/coffee-maker.png",
        blurb:
          "Durable glass cold brew pitcher with an integrated fine-mesh filter for smooth, low-acid iced coffee.",
        specs: ["Glass pitcher", "Fine-mesh filter"],
      },
      {
        name: "Digital Kitchen Scale",
        image: "/images/catalog/appliances/digital-kitchen-scale.png",
        blurb:
          "Backlit digital scale that weighs ingredients in grams and ounces for precise home baking and portioning.",
        specs: ["Grams and ounces", "Backlit display"],
      },
      {
        name: "Egg Cooker",
        image: "/images/catalog/appliances/egg-cooker.png",
        blurb:
          "Countertop egg cooker that steams to a set doneness and holds eggs warm until they are served.",
        specs: ["Set doneness dial", "Warm-hold tray"],
      },
      {
        name: "Electric Food Processor",
        image: "/images/catalog/appliances/electric-food-processor.png",
        blurb:
          "Multi-function processor with interchangeable blades for chopping, shredding, slicing and kneading.",
        specs: ["Interchangeable blades", "Multiple functions"],
      },
      {
        name: "Electric Iron Box",
        image: "/images/catalog/appliances/electric-iron-box.png",
        blurb:
          "Steam iron with adjustable temperature and a water tank for pressing uniforms and everyday creases.",
        specs: ["Adjustable temperature", "Steam reservoir"],
      },
      {
        name: "Electric Kettle",
        image: "/images/catalog/appliances/electric-kettle.png",
        blurb:
          "BPA-free stainless steel quick-boil kettle equipped with precise temperature controls for tea and pour-over coffee.",
        specs: ["BPA-free stainless steel", "Precise temperature control"],
      },
      {
        name: "Electric Milk Frother",
        image: "/images/catalog/appliances/electric-milk-frother.png",
        blurb:
          "Multi-function hot and cold foam maker for crafting lattes, cappuccinos, and hot chocolates effortlessly.",
        specs: ["Hot and cold foam", "Lattes and cappuccinos"],
      },
      {
        name: "Electric Table Fan",
        image: "/images/catalog/appliances/electric-table-fan.png",
        blurb:
          "Three-speed table fan with a tilt-adjustable head for steady airflow across a desk or meeting table.",
        specs: ["Three speed settings", "Tilt-adjustable head"],
      },
      {
        name: "Food Dehydrator",
        image: "/images/catalog/appliances/food-dehydrator.png",
        blurb:
          "Easy-to-use countertop dehydrator for crafting healthy homemade dried fruit snacks and jerky.",
        specs: ["Countertop design", "Dries fruit and jerky"],
      },
      {
        name: "Handheld Garment Steamer",
        image: "/images/catalog/appliances/handheld-garment-steamer.png",
        blurb:
          "Lightweight, fast-heating fabric steamer perfect for quick wrinkle touch-ups before meetings or travel.",
        specs: ["Fast heating", "Travel-friendly"],
      },
      {
        name: "Ice Maker",
        image: "/images/catalog/appliances/ice-maker.png",
        blurb:
          "Fast-producing countertop ice machine that makes soft, chewable ice for iced coffees and refreshing cold drinks.",
        specs: ["Soft chewable ice", "Countertop size"],
      },
      {
        name: "Personal Air Purifier",
        image: "/images/catalog/appliances/personal-air-purifier.png",
        blurb:
          "Compact HEPA air purifier designed to eliminate dust, allergens, and odors from home office workspaces.",
        specs: ["HEPA filtration", "Compact footprint"],
      },
      {
        name: "Rice Cooker",
        image: "/images/catalog/appliances/rice-cooker.png",
        blurb:
          "One-touch rice cooker that switches to warm automatically, with a steam basket for vegetables alongside.",
        specs: ["Keep-warm function", "Steam basket"],
      },
      {
        name: "Vacuum Cleaner",
        image: "/images/catalog/appliances/vacuum-cleaner.png",
        blurb:
          "Mini rechargeable cordless desk vacuum that easily sweeps up crumbs, dust, and eraser shavings.",
        specs: ["Rechargeable cordless", "Mini desk size"],
      },
      {
        name: "Waffle Maker",
        image: "/images/catalog/appliances/waffle-maker.png",
        blurb:
          "Non-stick waffle iron with a temperature dial for crisp sweet and savoury waffles without a café.",
        specs: ["Non-stick plates", "Temperature dial"],
      },
    ],
  },
  {
    id: "beauty",
    title: "Beauty & Wellness",
    Icon: GiftIcon,
    /* ALL SIXTEEN PHOTOGRAPHS WERE REPLACED IN ONE PASS, AND EVERY PATH NOW
     * ENDS IN `.png`. The filenames are not a choice: each source file is named
     * after its item title verbatim, and slugging that title reproduces the
     * existing basename exactly - 15 of 16 byte-for-byte, the sixteenth being
     * `electric-toothbrush-v2.jpg`, which is `-v3.png` here. The extension
     * change alone busts the `next/image` cache for all sixteen.
     *
     * SOURCE RESOLUTION IS THE ONE THING TO KNOW ABOUT THIS SET: every file is
     * 288x288. The outgoing set was 1200x1200. The card frame is `aspect-square`
     * at `sizes="25vw"` above `lg`, so a 1440px viewport asks for a 360px box
     * and `deviceSizes` will hand the browser 384px at DPR 1 and 750px at DPR 2
     * - against a 288px source that is an upscale in both cases. The set is also
     * 49.7% lighter (1,813,967 B -> 912,333 B), which is real, but weight is
     * not the constraint here; sharpness is. Nothing in the markup can fix a
     * 288px original, and `object-cover` cannot invent the missing pixels. If
     * these read soft on a hi-DPI screen, the fix is larger exports, not CSS.
     *
     * The sixteen outgoing `.jpg` files are still on disk, unreferenced.
     * Deleting them needs explicit approval. */
    products: [
      {
        name: "Aromatherapy Essential Oil Diffuser",
        image: "/images/catalog/beauty/aromatherapy-essential-oil-diffuser.png",
        blurb:
          "Ultrasonic mist diffuser featuring soft ambient LED lighting to create a soothing spa atmosphere at home.",
        specs: ["Ultrasonic mist", "Ambient LED lighting"],
      },
      {
        name: "Cosmetics Organizer Bag",
        image: "/images/catalog/beauty/cosmetics-organizer-bag.png",
        blurb:
          "Wipe-clean zippered organizer with separate sleeves for skincare, haircare and daily grooming essentials.",
        specs: ["Separate compartments", "Zippered closure"],
      },
      {
        name: "Dumbbell",
        image: "/images/catalog/beauty/dumbbell.png",
        blurb:
          "Fixed-weight rubber-coated dumbbell for strength work at home, in a hotel room, or in the office gym.",
        specs: ["Rubber-coated grip", "Fixed weight"],
      },
      {
        name: "Electric Shaver",
        image: "/images/catalog/beauty/electric-shaver.png",
        blurb:
          "Cordless foil shaver with a close-cutting head for a comfortable shave that travels well.",
        specs: ["Foil cutting head", "Cordless design"],
      },
      {
        name: "Electric Toothbrush",
        /* `-v3` is NOT decoration and must be bumped on any future re-edit of
         * this photograph. `next/image` serves `/_next/image?url=<path>` with
         * an immutable, year-long cache header in BOTH the browser and
         * `.next/cache/images`, and the cache key is derived from the path
         * alone. Overwriting the bytes behind an unchanged filename therefore
         * leaves every visitor pinned to the previous picture until they clear
         * their cache by hand - which is exactly what happened when this file
         * was re-edited in place: the new photograph was correct on disk and
         * correct at every requested width, and the old one still rendered.
         *
         * Three versions now: `electric-toothbrush.jpg` (the original),
         * `-v2.jpg`, and this one. The extension changed from `.jpg` to `.png`
         * along with every sibling in this tab, which on its own would already
         * have busted the cache, but the token is kept anyway - a file called v2
         * holding the third picture is how the last confusion started.
         *
         * It is `-v3` and NOT plain `electric-toothbrush.png` on purpose: that
         * name is already taken in this folder by a DIFFERENT image, a
         * 703x1200 portrait unrelated to this product, and writing here would
         * silently destroy it. Do not tidy this name back.
         *
         * Sibling files carry no version token, because they had never been
         * re-cut until this pass. */
        image: "/images/catalog/beauty/electric-toothbrush-v3.png",
        blurb:
          "Sonic toothbrush with a two-minute timer and selectable modes for a consistent daily clean.",
        specs: ["Two-minute timer", "Multiple modes"],
      },
      {
        name: "Exercise Ball",
        image: "/images/catalog/beauty/exercise-ball.png",
        blurb:
          "Anti-burst stability ball for posture work, short stretches and seated exercises between meetings.",
        specs: ["Anti-burst", "Posture support"],
      },
      {
        name: "Facial Roller",
        image: "/images/catalog/beauty/facial-roller.png",
        blurb:
          "Dual-ended natural rose quartz roller designed to soothe skin, reduce puffiness, and enhance facial massage routines.",
        specs: ["Dual-ended design", "Natural rose quartz"],
      },
      {
        name: "Hair Dryer",
        image: "/images/catalog/beauty/hair-dryer.png",
        blurb:
          "Compact ionic dryer that shortens drying time and leaves hair smoother through the day.",
        specs: ["Ionic technology", "Compact design"],
      },
      {
        name: "Hair Straightener",
        image: "/images/catalog/beauty/hair-straightener.png",
        blurb:
          "Ceramic-plate straightener with adjustable heat settings for a smooth finish at any temperature.",
        specs: ["Ceramic plates", "Adjustable heat"],
      },
      {
        name: "High-Capacity Blender",
        image: "/images/catalog/beauty/high-capacity-blender.png",
        blurb:
          "Large-jar blender for smoothies, protein shakes and sauces, with preset pulse and blend cycles.",
        specs: ["Large capacity jar", "Preset cycles"],
      },
      {
        name: "Humidifier",
        image: "/images/catalog/beauty/humidifier.png",
        blurb:
          "Quiet cool-mist humidifier that adds moisture to dry rooms and eases throat discomfort.",
        specs: ["Cool-mist output", "Quiet operation"],
      },
      {
        name: "Kettlebell",
        image: "/images/catalog/beauty/kettlebell.png",
        blurb:
          "Cast-iron kettlebell in a matte finish for swings, squats and general conditioning work.",
        specs: ["Cast iron", "Matte finish"],
      },
      {
        name: "RLD Face Mask",
        image: "/images/catalog/beauty/rld-face-mask.png",
        blurb:
          "A targeted facial mask used as the finishing step of an at-home skincare routine.",
        specs: ["At-home routine", "Facial mask"],
      },
      {
        name: "Silk Sleep Eye Mask",
        image: "/images/catalog/beauty/silk-sleep-eye-mask.png",
        blurb:
          "Pure mulberry silk eye cover engineered to block light comfortably while protecting delicate skin around the eyes.",
        specs: ["Pure mulberry silk", "Full light block"],
      },
      {
        name: "Weighing Scale",
        image: "/images/catalog/beauty/weighing-scale.png",
        blurb:
          "Low-profile digital scale with a tempered glass platform and step-on activation.",
        specs: ["Tempered glass", "Step-on activation"],
      },
      {
        name: "Yoga Mat",
        image: "/images/catalog/beauty/yoga-mat.png",
        blurb:
          "Non-slip exercise mat with alignment marks and a carry strap for studio or home practice.",
        specs: ["Non-slip surface", "Carry strap"],
      },
    ],
  },
] as const;

/* Cascade constants for the local per-row grid entrance. These are
 * deliberately shorter than the site-wide `CONTENT_OFFSET_MS` / `STEP_MS` in
 * components/ui/RevealOnScroll.tsx (300ms / 100ms), because that pair is sized
 * for a header plus one grid, while this one runs four times down the page and a
 * 300ms head start before the FIRST row would be felt as lag. `ROW_STAGGER_MS`
 * is the within-row step: cards in one row arrive left-to-right, and the next
 * row is separated by scroll position rather than by a delay. */
const ROW_STAGGER_MS = 55;

/* `lg:grid-cols-4` with `sm:grid-cols-2` beneath it. The observer reads the live
 * column count off the element rather than trusting this, so this is only the
 * first guess used to avoid a flash of wrong grouping before measure. */
const DEFAULT_COLUMNS = 4;

export function ProductCatalogTabs() {
  /* Selection is an ID, not an index, so the state cannot be invalidated by a
   * reorder of `CATEGORIES` and the ARIA id pairs stay stable across renders.
   * The one state write in this component is `setActiveTabId`; nothing writes
   * to `CATEGORIES`, which is a module-level `const` of `as const` objects and
   * so is not mutable by anything. */
  const [activeTabId, setActiveTabId] = useState<string>(CATEGORIES[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* DEEP LINKS SELECT THE TAB, and this effect is the reason the footer links
     into the four catalogue tabs work.

     The tablist is a plain client component: selection happens on `onClick` and
     nothing anywhere read `location.hash`. A link to `#gift-tab-beauty` therefore
     scrolled to the Beauty button and left the EXECUTIVE TECH panel on screen -
     the reader arrives at a tab they have to click themselves, which is the worst
     of both: the scroll says they are there and the panel says otherwise.

     So the hash is honoured once, on mount. `useEffect`, not `useState` lazy
     initialisation, and deliberately so: `window` is not available during SSR, so
     reading the hash in a `useState` initialiser would break the server render
     this component depends on. An effect runs client-side only.

     ONE SHOT, and no `hashchange` listener. The footer link is a full page load
     on a different route, so by the time this mounts the hash is already final.
     Listening for later changes would mean reacting to the browser's back button
     across tab state, which is a behaviour nobody asked for and which would
     fight the scroll animation already on `selectTab`.

     The id is read by STRIPPING the `gift-tab-` prefix rather than by matching a
     known list, so adding a fifth category needs no change here. An id that
     resolves to nothing simply fails the `some()` and the default first category
     stands, which is the same degradation the `?? CATEGORIES[0]` below already
     makes. */
  useEffect(() => {
    const prefix = "gift-tab-";
    if (!window.location.hash.startsWith(`#${prefix}`)) return;

    const requested = window.location.hash.slice(prefix.length + 1);
    const resolves = CATEGORIES.some((category) => category.id === requested);
    if (resolves) setActiveTabId(requested);
  }, []);

  /* Derived, never stored. The `?? CATEGORIES[0]` is deliberate: if an id ever
   * fails to resolve the panel renders the first category rather than throwing
   * on `undefined.products`, so a bad id degrades to a visible catalogue
   * instead of a blank section. */
  const active =
    CATEGORIES.find((category) => category.id === activeTabId) ?? CATEGORIES[0];
  const activeIndex = CATEGORIES.findIndex(
    (category) => category.id === active.id,
  );
  const ActiveIcon = active.Icon;
  const gridRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* The grid is `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, so
   * "which row is this card in" depends on the viewport. Measured rather than
   * read from a media query: `getComputedStyle().gridTemplateColumns` resolves
   * to the used track list (`"212px 212px 212px 212px"`), so counting its
   * entries gives the real column count including at the `md` breakpoint that
   * no single media query in this file accounts for.
   *
   * Observed rather than read once, and deliberately so: the observer only
   * exists to group cards into rows, and a resize that changes the column count
   * changes that grouping. Re-measuring on resize is the whole reason this is a
   * `ResizeObserver` instead of a one-shot read. It fires once immediately on
   * observe, which covers the initial value. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const tracks = window
        .getComputedStyle(grid)
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length;
      if (tracks > 0) setColumns(tracks);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  /* Per-row scroll-triggered cascade for the sixteen cards. See the GRID
   * ENTRANCE note in this file's header for why this is local to the component
   * rather than delegated to RevealOnScroll's `data-reveal-stagger`.
   *
   * The short version: the shared observer staggers by CHILD INDEX off a single
   * boundary, which for a sixteen-card grid means card 15 waits 300ms + 15x100ms
   * = 1.8s behind the first. It also reveals the whole grid the moment the
   * grid's top edge crosses the trigger line, so all four rows animate at once
   * while the reader is still looking at row one. Neither is what was asked for
   * here, and neither can be fixed by tuning the shared constants, because the
   * same constants have to serve every other grid on the site.
   *
   * Instead each ROW is observed separately, so a row animates when that row is
   * actually reached. Rows are not DOM elements — `grid-cols-4` is an auto-flow
   * layout — so the row is derived from the card's index and the column count,
   * and cards are grouped by that. `ResizeObserver` re-reads the live column
   * count, because `lg:grid-cols-4` means the grouping is only correct at the
   * widest breakpoint; at `sm:grid-cols-2` the same sixteen cards are eight rows
   * and a hardcoded 4 would cascade four rows of four with half the grid orphaned.
   *
   * Dependencies are `[activeTabId, columns]` rather than `active`: the effect
   * re-runs when the tab changes, which re-observes the new sixteen nodes, and
   * when the breakpoint changes, which regroups the same nodes. `active` is a
   * derived object and would be a new identity on every render, re-running this
   * on each keystroke-sized state change. */
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-catalog-card]"),
    );
    if (cards.length === 0) return;

    /* Reduced motion is honoured by simply not animating: the cards render in
     * their final state and no observer is created at all. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    /* Grouped by row so one observer callback reveals a whole row together. A
     * card's delay is its position WITHIN its row, which is why the cascade
     * reads left-to-right rather than as sixteen separate arrivals. */
    const rows = new Map<number, HTMLElement[]>();
    cards.forEach((card, index) => {
      const row = Math.floor(index / columns);
      card.dataset.row = String(row);
      const list = rows.get(row);
      if (list) list.push(card);
      else rows.set(row, [card]);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target as HTMLElement;
          observer.unobserve(card);

          const siblings = rows.get(Number(card.dataset.row)) ?? [];
          const position = siblings.indexOf(card);
          const delay = position * ROW_STAGGER_MS;

          card.style.setProperty("--card-enter-delay", `${delay}ms`);
          /* One frame between the un-hidden start state and the revealed one,
           * so the transition has something to transition FROM. Adding both
           * classes in the same task would collapse it and the row would snap
           * in with no animation — the same trap as setting a transition and a
           * changed value together. */
          requestAnimationFrame(() => {
            card.classList.add("is-revealed");
          });
        });
      },
      {
        /* Reveal on contact, with the same 80px bottom inset `RevealOnScroll`
         * uses for every section on the site, so a row that is already on screen
         * at page load animates on arrival and one that is entirely below the
         * fold waits for the scroll that brings it in.
         *
         * This was `"0px 0px -12%"`, which looks like a smaller lead-in than 80px
         * and is not: percentages scale with the viewport, so it demanded 96px on
         * an 800px-tall window but 156px on a 1300px one - and on the taller
         * screens this site is designed for, a row sitting visibly on screen
         * could be told to wait for the reader to scroll further before it moved.
         * A row that is on screen and will not animate until you scroll is the
         * one failure this observer must not have. The negative inset also still
         * sits well under the card's 14px rise, so the start of the entrance is
         * never hidden below the fold. */
        rootMargin: "0px 0px -80px 0px",
        threshold: 0,
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [activeTabId, columns]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;

    setCurrentSlide(0);
    mobileScrollRef.current?.scrollTo({ left: 0 });
  }, [activeTabId]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;

    const container = mobileScrollRef.current;
    if (!container) return;

    const slides = Array.from(
      container.querySelectorAll<HTMLElement>("[data-catalog-slide]"),
    );
    if (slides.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const slide = entry.target as HTMLElement;
          observer.unobserve(slide);

          const cards = slide.querySelectorAll<HTMLElement>(
            "[data-catalog-card]",
          );
          cards.forEach((card, i) => {
            card.style.setProperty("--card-enter-delay", `${i * ROW_STAGGER_MS}ms`);
            requestAnimationFrame(() => {
              card.classList.add("is-revealed");
            });
          });
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0, root: container },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [activeTabId]);

  function selectTab(id: string) {
    setActiveTabId(id);
  }

  function handleScroll() {
    const container = mobileScrollRef.current;
    if (!container) return;
    const slideWidth = container.offsetWidth;
    if (slideWidth === 0) return;
    const index = Math.round(container.scrollLeft / slideWidth);
    setCurrentSlide(index);
  }

  function scrollToSlide(index: number) {
    const container = mobileScrollRef.current;
    if (!container) return;
    const slideWidth = container.offsetWidth;
    container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
  }

  function handleTabKeys(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = CATEGORIES.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;

    event.preventDefault();
    selectTab(CATEGORIES[next].id);
    tabRefs.current[next]?.focus();
  }

  const chunkedProducts = chunkProducts(
    active.products as readonly (typeof active.products)[number][],
    4,
  );

  const renderProductCard = (product: (typeof active.products)[number]) => (
    <article
      key={product.name}
      data-catalog-card
      data-row="0"
      className="catalog-card-enter group flex flex-col overflow-hidden rounded-2xl border border-section-divider bg-surface shadow-elev-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-brand-green-600/40 hover:shadow-elev-2"
    >
      <div className="relative w-full overflow-hidden rounded-t-2xl bg-linen aspect-[4/3] sm:aspect-square">
        {"image" in product && product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        ) : (
          <ActiveIcon className="h-12 w-12 text-accent-700/25 transition-colors duration-300 ease-in-out group-hover:text-accent-700/40" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-5">
        <h3 className="text-sm font-semibold leading-6 text-charcoal line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs leading-5 text-taupe line-clamp-2 sm:text-sm sm:leading-6">{product.blurb}</p>
        <ul className="mt-auto flex flex-col gap-1 pt-2 sm:gap-1.5 sm:pt-3">
          {product.specs.map((spec) => (
            <li
              key={spec}
              className="flex items-start gap-2 text-xs leading-5 text-charcoal/70"
            >
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" />
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );

  return (
    <>
      {/* SEGMENTED PILL CONTROL. This replaced the underline tablist. It is a
          `flex flex-wrap` row of pills rather than a `grid-cols-2 / md:4`
          grid, and that is the whole point: with a wrapping row, a long
          label moves the ROW to the next line instead of overflowing its
          track. That is what finally makes `whitespace-nowrap` safe here. It
          was rejected on the grid version for exactly this reason - there was
          no wrapping mechanism to absorb it, and `min-w-max` was asked for
          instead, which raises the floor rather than removing it.

          `data-reveal-stagger` was REMOVED, deliberately and with the rest of
          this file's history in mind. It made RevealOnScroll add
          `reveal-on-scroll` to these four buttons, and globals.css:858 sets
          that class to `opacity: 0` in UNLAYERED CSS - which outranks every
          Tailwind utility, so the `opacity-100` on the button was inert and
          the controls stayed invisible until the section's Intersection-
          Observer fired. An interactive control should not depend on a scroll
          observer in order to become visible. Nothing else in this section was
          a reveal target, so the rest of it is unaffected.

          THE SIXTEEN PRODUCT CARDS REVEAL ON SCROLL, NOT ON RENDER. This was
          briefly built the other way — a `both`-filled `animate-fade-up` with
          an inline per-row `animation-delay` — and that was wrong: the catalog
          sits below the fold, so the whole cascade played out before the reader
          ever saw the section and they arrived to a grid that had already
          finished animating. The cards now go through the site-wide observer
          instead, with `data-reveal-trigger` on the grid so the CARDS are the
          reveal boundary rather than the enclosing `<section>` (which spans the
          heading, the pill rail, this grid and the callout, and would therefore
          have fired several screens early). The 300ms + 100ms-per-child cadence
          is the observer's own, inherited rather than restated. Tab switches are
          covered by `refreshCompletedTargets` in RevealOnScroll.tsx.

          Do NOT put a keyframe entrance on these cards to achieve this. The two
          mechanisms conflict: `.reveal-on-scroll` is unlayered `opacity: 0`
          (globals.css:858), which outranks utilities, so a card can be held
          invisible by the observer while an `animation` is also running on it,
          and the animation's `both` fill then holds `transform` after finishing
          — the conflict `.is-settled` exists to undo. Pick one. The observer
          is the site's mechanism and it handles the tab-switch case for free.

          The 20px category icons were dropped from the pills. `px-5 py-2.5`
          plus an icon plus a 30-character label makes a pill far too wide to
          wrap tidily on a phone. Category identity is not lost: the same
          icon is the watermark on all sixteen cards in the panel below.

          Colour. ACTIVE IS `bg-brand-primary` (#a83b24, the same token as
          `--color-brick-red`) UNDER WHITE TEXT, and inactive is `text-taupe`
          on `bg-linen`. This is the `SolutionsTabs` pill verbatim, and these two
          pill rails sit on the same page directly above one another, so any
          difference between them read as an accident. Three things were
          different before and are now aligned:

            active fill    `bg-charcoal` (#111827, a cool near-black)
                           -> `bg-brand-primary`. Also its border moved with
                              it, `border-charcoal` -> `border-brand-primary`;
                              leaving a charcoal hairline around a brick fill
                              would have drawn a second colour.
            inactive text  `text-charcoal/70` -> `text-taupe`. The 70% alpha
                              charcoal resolved to roughly #4f5560, which is
                              almost exactly `text-taupe`'s #4b5563 — the same
                              colour the eye was being shown, reached by a
                              different route. `SolutionsTabs` already named it.
            radius         `rounded-full` -> `rounded-pill`, and
                              `transition-all` -> `transition-colors`.

          `rounded-full` vs `rounded-pill` is a pill either way at this height,
          so it is cosmetic rather than structural; it is aligned because the
          two rails are adjacent and a mismatch is visible. `transition-all`
          was the substantive one of the two: it transitions `border-color` too,
          and since the active branch sets a *different* border colour from the
          inactive branch's `border-transparent`, hovering an unselected pill
          would have animated its border toward transparent and then snapped.
          `transition-colors` covers background and text and is what the rest
          of the site's pills use.

          The ARIA tab contract is unchanged and is the reason this is not
          simply the snippet from the brief: `role="tab"`/`tablist`,
          `aria-selected`, `aria-controls`, roving `tabIndex`, and
          Arrow/Home/End all still drive the panel. A styled `<button>` with
          no `role` would have thrown all of that away. */}
      <div
        role="tablist"
        aria-label="Gift categories"
        className="flex w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-none md:flex-wrap md:items-center md:justify-center md:gap-3"
      >
        {CATEGORIES.map((category, index) => {
          const selected = category.id === active.id;

          return (
            <button
              key={category.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`gift-tab-${category.id}`}
              aria-selected={selected}
              aria-controls={`gift-panel-${category.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(category.id)}
              onKeyDown={(event) => handleTabKeys(event, index)}
              className={`whitespace-nowrap rounded-pill border px-4 py-2 shrink-0 text-xs font-medium transition-all opacity-100 visible md:px-5 md:py-2.5 md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                selected
                  ? "border-brand-primary bg-brand-primary text-white shadow-elev-1"
                  : "border-transparent bg-linen text-taupe hover:bg-canvas hover:text-charcoal"
              }`}
            >
              <span
                className={`inline-block whitespace-nowrap opacity-100 visible tracking-tight ${
                  selected ? "font-semibold" : "font-medium"
                }`}
              >
                {category.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`gift-panel-${active.id}`}
        aria-labelledby={`gift-tab-${active.id}`}
        tabIndex={0}
        className="mt-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {/* THE SIXTEEN CARDS CASCADE ONE ROW PER SCROLL, NOT ALL AT ONCE. This
            went through two wrong versions before landing here, both recorded
            because both failure modes are easy to walk back into:

              1. A `both`-filled `animate-fade-up` with an inline per-row delay.
                 Wrong because the catalog is below the fold: the whole cascade
                 played before the reader ever saw the section, so they arrived
                 to a grid that had finished animating.
              2. `data-reveal-trigger` + `data-reveal-stagger`, delegating to the
                 shared observer. Right mechanism, wrong granularity, and the
                 measured symptom was a blank section for ~1s. The observer
                 staggers by CHILD INDEX off one boundary, so card 15 waited
                 300ms + 15x100ms = 1800ms, and it revealed the entire grid the
                 moment the grid's TOP edge crossed the line — all four rows
                 animating while the reader was still looking at row one. Neither
                 part is tunable away: `CONTENT_OFFSET_MS` / `STEP_MS` are shared
                 with every other grid on the site.

            So the grid observes ITSELF. Each card is an intersection target, and
            cards are grouped into rows from their index and the live column
            count, so a row animates when that row is reached rather than when
            the grid first appears. Rows are not DOM elements — `grid-cols-4` is
            an auto-flow layout — which is the whole reason this is local instead
            of three lines of `data-reveal-stagger`. The visual half is
            `.catalog-card-enter` in globals.css.

            `columns` is measured with a `ResizeObserver` rather than hardcoded
            to 4, because the grid is responsive (1 / 2 / 3 / 4) and a fixed 4
            would group sixteen cards into four rows at every breakpoint —
            correct at `lg`, and leaving half the grid uncascaded at `sm`.

            The shared observer must NOT also collect these cards. It is skipped
            because the grid carries no `data-reveal-*` marker at all, and the
            local rule is a different class rather than `.reveal-on-scroll` —
            that rule is unlayered `opacity: 0` and belongs to the other system.
            Do not add `data-reveal-stagger` back here. */}
        <div
          ref={gridRef}
          className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {active.products.map((product) => renderProductCard(product))}
        </div>

        {/* MOBILE SWIPE CONTAINER */}
        <div className="block md:hidden">
          <div
            ref={mobileScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
            onScroll={handleScroll}
          >
            {chunkedProducts.map((chunk, slideIndex) => (
              <div
                key={slideIndex}
                data-catalog-slide
                className="w-full flex-shrink-0 snap-center"
              >
                <div className="grid grid-cols-2 gap-3">
                  {chunk.map((product) => renderProductCard(product))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            {chunkedProducts.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSlide(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentSlide ? "bg-brand-primary" : "bg-charcoal/20"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-taupe mt-2">
            Slide {currentSlide + 1} of {chunkedProducts.length}
          </p>
        </div>

        {/* PER-TAB IMAGE DISCLAIMER. Sits INSIDE the tabpanel rather than
            beside the grid so one node serves all four tabs: the panel renders
            only the active category, so the note is genuinely "at the bottom of
            each tab" instead of four copies stacked outside the panel. It is
            static across categories, so re-mounting it per selection is free.

            `text-caption` (0.75rem / 12px) rather than an arbitrary
            `text-[0.825rem]`: 12px was one of the two sizes asked for and the
            caption token is the house footnote size, so no hand-rolled value is
            needed. `text-charcoal-60` (#717177) measures 4.85:1 on the
            `bg-white` section background this panel inherits and passes WCAG
            AA at 12px. It was 4.57:1 on the `bg-surface-muted` this panel
            used to sit on, so the white change improved it rather than
            costing anything - every other text token in the section gained
            contrast for the same reason.
            Deliberately NOT an extra opacity modifier on top of it - the token
            is already the muted one, and stacking opacity would compound the
            loss and drop the text under AA. */}
        <p className="mt-6 text-caption text-charcoal-60">
          * Images are for representational purposes only. The actual
          commissioned gift may vary in appearance.
        </p>
      </div>
    </>
  );
}
