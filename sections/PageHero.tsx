import Image from "next/image";
import { ChildHero } from "@/sections/hero/ChildHero";
import type { HeroStat } from "@/sections/hero/HeroFramework";

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  ctaHref?: string;
  ctaLabel?: string;
  /**
   * Surface for `ctaHref`/`ctaLabel`. Defaults to the brick-red primary so
   * every commercial route presents the same conversion action. The legal
   * pages override it with `secondary`, because a "Book a consultation" brick
   * button on a privacy policy is the wrong genre — but "where appropriate"
   * still means *some* action, so they get a neutral way back.
   */
  ctaVariant?: "primary" | "secondary" | "outline";
  tag?: string;
  tagValue?: string;
  /** Optional label override; otherwise `eyebrow` is used. */
  badge?: string;
  stats?: HeroStat[];
  visual?: React.ReactNode;
  variant?: "default" | "wide";
  /**
   * Forwarded straight to `ChildHero`. `PageHero` is a thin wrapper over the
   * shared hero, and these props used to be the gap in that wrapper: a route
   * could only reach the flat canvas, the centred layout, the even column split
   * or the metadata line by bypassing `PageHero` and mounting `ChildHero`
   * itself.
   *
   * All of them default to the same values `ChildHero` defaults to, so any
   * caller that passes none of them is byte-for-byte unchanged. `layout` also
   * has to interact correctly with `visual`: `centered` renders the visual
   * *below* the statement at a 5.6xl cap rather than beside it, so a centred
   * hero with a visual is a valid but so-far unused combination.
   *
   * `columns` is the one that had to be added for the three resource heroes.
   * `ChildHero` reads its container class from a ternary chain in which
   * `even || centered` short-circuits to the `pb-16 pt-20` rhythm and the
   * `columns === "even"` branch is what selects `md:grid-cols-2` over the
   * `lg:grid-cols-[1.05fr_0.95fr]` editorial default — and `even` is also what
   * selects the `max-w-[520px]` lead. Without forwarding it here, those three
   * routes could take the flat canvas and still render on the 1.05/0.95 grid
   * with the 576px lead, i.e. half a redesign.
   */
  layout?: "split" | "center";
  canvas?: "decorated" | "flat";
  surface?: "canvas" | "light";
  columns?: "editorial" | "even";
  meta?: React.ReactNode;
}

/**
 * Resource-page hero. The layout, type scale and canvas are delegated to the
 * shared ChildHero framework; this wrapper only curates the page-specific
 * image and proof caption.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imagePosition = "50% 40%",
  ctaHref,
  ctaLabel,
  ctaVariant = "primary",
  tag,
  tagValue,
  badge,
  stats,
  visual,
  variant = "default",
  layout,
  canvas,
  surface,
  columns,
  meta,
}: PageHeroProps) {
  const imageVisual =
    image ? (
      <div className="relative mx-auto w-full max-w-xl pb-9 pl-7 sm:pl-10">
        <div className="relative overflow-hidden rounded-panel border border-charcoal/10 bg-white/85 p-2 shadow-[0_24px_70px_rgb(54_67_59/0.11)]">
          <div
            className={`relative overflow-hidden rounded-[1.125rem] ${
              variant === "wide" ? "aspect-[4/3] min-h-[360px]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 44vw"
              className="object-cover"
              style={{ objectPosition: imagePosition }}
            />
          </div>
          {tag ? (
            <div className="flex items-center justify-between gap-4 px-4 pb-3 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-walnut">
                {tag}
              </p>
              <span className="stat-numeral text-sm font-bold text-brand-green-700">
                {tagValue}
              </span>
            </div>
          ) : null}
        </div>

        <div className="absolute -bottom-1 left-0 rounded-pill border border-charcoal/10 bg-canvas px-4 py-2.5 text-xs font-semibold text-brand-green-700 shadow-elev-2">
          {badge ?? eyebrow}
        </div>
      </div>
    ) : null;

  return (
    <ChildHero
      eyebrow={badge ?? eyebrow}
      title={title}
      description={description}
      visual={visual ?? imageVisual}
      actions={
        ctaHref && ctaLabel
          ? /* Promoted from `quiet: true` to the brick-red primary surface, so
               every `PageHero` route presents the same high-contrast conversion
               action as the bespoke heroes instead of a bare text link. Legal
               pages pass `ctaVariant="secondary"`. */
            [{ href: ctaHref, label: ctaLabel, variant: ctaVariant }]
          : undefined
      }
      stats={stats}
      layout={layout}
      canvas={canvas}
      surface={surface}
      columns={columns}
      meta={meta}
    />
  );
}
