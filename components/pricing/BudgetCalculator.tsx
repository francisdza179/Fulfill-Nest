"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion, useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { formatPrice } from "@/lib/data";
import { GiftIcon, NoteIcon, RibbonBowIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";

/* ------------------------------------------------------------------ */
/*  Live budget estimator — an enterprise calculator panel.            */
/*                                                                     */
/*  Previously a hand-drawn SVG gift box that filled as the recipient   */
/*  slider moved, ringed by an endlessly pulsing glow and three chips  */
/*  bobbing up and down forever. None of that carried information a     */
/*  buyer could act on, and all of it animated permanently — the exact  */
/*  opposite of the precision this section is trying to project. It is  */
/*  gone. What is here now is a form and a line-item estimate.         */
/* ------------------------------------------------------------------ */

const MIN_RECIPIENTS = 50;
const MAX_RECIPIENTS = 5000;
const QUICK_POINTS = [50, 250, 1000, 5000];

const SPRING = { stiffness: 110, damping: 26, mass: 0.6 };

/** Renders a number that springs smoothly toward `value` on every change. */
function MotionNumber({
  value,
  prefix,
  suffix,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const spring = useSpring(value, SPRING);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduce) {
      spring.jump(value);
    } else {
      spring.set(value);
    }
  }, [value, spring, reduce]);

  useMotionValueEvent(spring, "change", (v) => setDisplay(Math.round(v)));

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

interface Zone {
  id: string;
  label: string;
  note: string;
  /**
   * Multiplier on the SHIPPING line only.
   *
   * Curation and packaging do not get more expensive because a parcel travels
   * further — the same curated box and the same branded note leave our studio
   * either way. Only the carriage cost scales with distance and spread, so this
   * touches `delivery` alone. Applying it to the whole per-recipient total
   * would have overstated the effect of going multi-region.
   */
  shipping: number;
}

const ZONES: Zone[] = [
  { id: "single", label: "Single city", note: "One hub, one metro", shipping: 1 },
  { id: "multi-city", label: "Multi-city", note: "Up to 10 cities", shipping: 1.15 },
  { id: "nationwide", label: "Nationwide", note: "All serviced pin codes", shipping: 1.35 },
  {
    id: "multi-region",
    label: "Multi-region",
    note: "40+ countries, customs handled",
    shipping: 1.7,
  },
];

interface AddOn {
  id: string;
  label: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
  /**
   * Per-recipient rate at the LOW end of the volume range, tapering to
   * `* 0.7` at the top — the same shape the three base components already use.
   *
   * These two rates are NEW to this component and are not published anywhere
   * else on the site, so they are illustrative of the programme structure
   * rather than a quote. Both describe capabilities the site already claims
   * (custom kitting, "SLA guarantees on delivery windows & damage"), but the
   * numbers attached to them need sign-off before this is treated as a price
   * list. See the note on `addOns` below.
   */
  rate: number;
}

const addOns: AddOn[] = [
  {
    id: "kitting",
    label: "Custom kitting",
    note: "Multi-item assembly, packed to spec",
    icon: GiftIcon,
    rate: 180,
  },
  {
    id: "sla",
    label: "Guaranteed SLA windows",
    note: "Contractual delivery windows & remedies",
    icon: ShieldIcon,
    rate: 140,
  },
];

interface LineItem {
  id: string;
  label: string;
  note: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export function BudgetCalculator() {
  const [recipients, setRecipients] = useState(750);
  const [zoneId, setZoneId] = useState(ZONES[1].id);
  const [enabled, setEnabled] = useState<ReadonlySet<string>>(new Set());

  const progress = (recipients - MIN_RECIPIENTS) / (MAX_RECIPIENTS - MIN_RECIPIENTS);
  const zone = ZONES.find((z) => z.id === zoneId) ?? ZONES[0];

  /* Base per-recipient components. UNCHANGED from the previous implementation
     — these three figures and their scale curve are the established model and
     are not something to retune while restyling. */
  const curation = Math.round(1100 - progress * 250);
  const packaging = Math.round(220 - progress * 40);
  const delivery = Math.round((180 - progress * 60) * zone.shipping);

  const activeAddOns = addOns.filter((addOn) => enabled.has(addOn.id));
  const addOnRates = activeAddOns.map(
    (addOn) => Math.round(addOn.rate - progress * addOn.rate * 0.3),
  );

  const perRecipient =
    curation + packaging + delivery + addOnRates.reduce((a, b) => a + b, 0);
  const programmeTotal = perRecipient * recipients;

  const reduce = useReducedMotion() ?? false;
  const springProgress = useSpring(progress, SPRING);
  const [fillPct, setFillPct] = useState(progress * 100);

  useEffect(() => {
    if (reduce) {
      springProgress.jump(progress);
    } else {
      springProgress.set(progress);
    }
  }, [progress, springProgress, reduce]);

  useMotionValueEvent(springProgress, "change", (v) => setFillPct(v * 100));

  function toggleAddOn(id: string) {
    setEnabled((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const items: LineItem[] = [
    {
      id: "curation",
      label: "Base fulfilment & curation",
      note: "Hand-picked by our studio",
      value: curation,
      icon: GiftIcon,
    },
    {
      id: "packaging",
      label: "Branded packaging & note",
      note: "Personalised, printed to your brand",
      value: packaging,
      icon: NoteIcon,
    },
    {
      id: "delivery",
      label: "Shipping & delivery",
      note: `${zone.label} · ${zone.note}`,
      value: delivery,
      icon: TruckIcon,
    },
    ...activeAddOns.map((addOn, index) => ({
      id: addOn.id,
      label: addOn.label,
      note: addOn.note,
      value: addOnRates[index],
      icon: addOn.icon,
    })),
    {
      id: "fees",
      label: "Platform & handling fees",
      note: "Locked at ₹0 — always",
      value: 0,
      icon: RibbonBowIcon,
      highlight: true,
    },
  ];

  const quickChipBase =
    "rounded-pill px-3.5 py-1.5 text-xs font-semibold tracking-[0.04em] transition-all duration-200";

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-hidden rounded-3xl border border-section-divider bg-surface p-6 shadow-elev-1 sm:p-10">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Controls */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {/* Recipients */}
            <div className="rounded-2xl border border-section-divider bg-surface p-5 shadow-elev-1 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="budget-recipients"
                  className="text-sm font-semibold text-charcoal"
                >
                  Number of recipients
                </label>
                <span className="stat-numeral rounded-pill bg-accent-100 px-2.5 py-0.5 text-sm text-copper">
                  <MotionNumber value={recipients} />
                </span>
              </div>

              <div className="relative mt-9">
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 z-0 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper/15"
                  style={{ left: `${fillPct}%` }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-7 z-20 -translate-x-1/2 whitespace-nowrap rounded-pill bg-copper px-3 py-1 text-[11px] font-semibold leading-none text-white shadow-elev-2"
                  style={{ left: `${fillPct}%` }}
                >
                  {recipients.toLocaleString("en-IN")} recipients
                </motion.div>
                <input
                  id="budget-recipients"
                  type="range"
                  min={MIN_RECIPIENTS}
                  max={MAX_RECIPIENTS}
                  step={10}
                  value={recipients}
                  onChange={(event) => setRecipients(Number(event.target.value))}
                  className="budget-range relative z-10"
                  style={{
                    background: `linear-gradient(to right, var(--color-copper) ${progress * 100}%, var(--color-sand) ${progress * 100}%)`,
                  }}
                  aria-valuetext={`${recipients.toLocaleString("en-IN")} recipients`}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-stone">
                <span>{MIN_RECIPIENTS.toLocaleString("en-IN")}</span>
                <span>{MAX_RECIPIENTS.toLocaleString("en-IN")}</span>
              </div>

              <div
                className="mt-4 flex flex-wrap gap-2"
                role="group"
                aria-label="Preset recipient counts"
              >
                {QUICK_POINTS.map((point) => {
                  const active = recipients === point;
                  return (
                    <button
                      key={point}
                      type="button"
                      onClick={() => setRecipients(point)}
                      aria-pressed={active}
                      className={`${quickChipBase} ${
                        active
                          ? "bg-copper text-white shadow-elev-1"
                          : "border border-section-divider bg-surface text-walnut hover:border-copper/50 hover:text-copper"
                      }`}
                    >
                      {point.toLocaleString("en-IN")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery footprint — a real grouped select rather than a row of
                pills, so the four options carry their own sub-label and the
                control reads as a form field. */}
            <div className="rounded-2xl border border-section-divider bg-surface p-5 shadow-elev-1 sm:p-6">
              <label
                htmlFor="budget-zone"
                className="text-sm font-semibold text-charcoal"
              >
                Delivery footprint
              </label>
              <div className="relative mt-3">
                <select
                  id="budget-zone"
                  value={zoneId}
                  onChange={(event) => setZoneId(event.target.value)}
                  className="w-full appearance-none rounded-pill border border-section-divider bg-surface py-3 pl-4 pr-10 text-sm font-medium text-charcoal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  {ZONES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label} — {option.note}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-taupe"
                >
                  ▼
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-4 text-taupe">
                Applies to the shipping line only. Curation and packaging do not
                change with distance.
              </p>
            </div>

            {/* Add-ons */}
            <div className="rounded-2xl border border-section-divider bg-surface p-5 shadow-elev-1 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                Add-ons
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {addOns.map((addOn) => {
                  const on = enabled.has(addOn.id);
                  return (
                    <li key={addOn.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors duration-200 ${
                          on
                            ? "border-copper/50 bg-accent-50"
                            : "border-section-divider bg-surface hover:bg-canvas"
                        }`}
                      >
                        {/* Native checkbox, visually replaced. `sr-only` rather
                            than `hidden` so the input keeps its place in the tab
                            order and stays keyboard-operable; the styled span
                            carries the state. */}
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleAddOn(addOn.id)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-600 peer-focus-visible:ring-offset-2 ${
                            on
                              ? "border-copper bg-copper text-white"
                              : "border-sand bg-surface"
                          }`}
                        >
                          {on ? <CheckMark /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-charcoal">
                            {addOn.label}
                          </span>
                          <span className="block text-xs leading-4 text-taupe">
                            {addOn.note}
                          </span>
                        </span>
                        <span className="stat-numeral shrink-0 text-sm text-copper">
                          +{formatPrice(addOn.rate)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Estimate */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            {/* Warehouse photograph, in place of the removed illustration. The
                brief asked for "an authentic, crisp photograph of warehouse
                operations" and this is the one such image the project actually
                has — the fulfilment-floor shot already used on /services. It is
                a real photograph of the operation rather than artwork of it. */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-section-divider bg-warm-grey">
              <Image
                src="/images/services/proven-impact-logistics-team.png"
                alt="Logistics team packing gift boxes for despatch"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 45%" }}
              />
            </div>

            {/* Line items */}
            <div className="rounded-2xl border border-section-divider bg-surface p-5 shadow-elev-1 sm:p-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                  Estimated cost per recipient
                </p>
                <p className="text-xs text-stone">
                  {recipients.toLocaleString("en-IN")} × {zone.label}
                </p>
              </div>
              <ul className="mt-4 flex flex-col">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className="animate-line-item grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-section-divider py-3 last:border-b-0"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-pill ${
                        item.highlight
                          ? "bg-brand-green-50 text-brand-green-700"
                          : "bg-accent-100 text-accent-600"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span
                        className={`block text-sm leading-5 ${
                          item.highlight
                            ? "font-semibold text-brand-green-700"
                            : "font-medium text-charcoal"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="block text-xs leading-4 text-taupe">
                        {item.note}
                      </span>
                    </span>

                    <span
                      className={`stat-numeral justify-self-end text-base ${
                        item.highlight ? "text-brand-green-700" : "text-charcoal"
                      }`}
                    >
                      <MotionNumber prefix="₹" value={item.value} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total */}
            <div className="rounded-2xl border border-copper/25 bg-canvas p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                    Estimated programme total
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    {recipients.toLocaleString("en-IN")} recipients ·{" "}
                    {zone.label}
                    {activeAddOns.length > 0
                      ? ` · ${activeAddOns.length} add-on${activeAddOns.length > 1 ? "s" : ""}`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="stat-numeral text-4xl leading-none text-copper sm:text-5xl"
                    aria-live="polite"
                  >
                    <MotionNumber prefix="₹" value={programmeTotal} />
                  </p>
                  <p className="stat-numeral mt-2 text-xs text-copper">
                    <MotionNumber prefix="₹" value={perRecipient} />
                    <span className="ml-1 font-sans font-medium normal-case tracking-normal text-stone">
                      per recipient
                    </span>
                  </p>
                </div>
              </div>

              <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-surface px-4 py-3 text-xs font-medium leading-5 text-taupe">
                <RibbonBowIcon
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-700"
                />
                Locks when you approve — before a single box ships. No hidden
                lines, ever.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-pill bg-charcoal px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  Get a firm quote
                </Link>
                <p className="text-xs leading-4 text-taupe">
                  This is an estimate, not a quote. We confirm every line
                  against your brief before anything is locked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

/** Tick for the styled add-on checkbox. Inline rather than `CheckIcon` so it
 *  inherits `currentColor` and strokes to the box at any size. */
function CheckMark() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 6.2 5 8.6 9.5 3.6" />
    </svg>
  );
}
