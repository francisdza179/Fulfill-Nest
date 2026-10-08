import Image from "next/image";

type BrandLogoVariant = "header" | "footer";

type BrandLogoProps = {
  className?: string;
  preload?: boolean;
  variant?: BrandLogoVariant;
};

const logoAssets: Record<
  BrandLogoVariant,
  { src: string; width: number; height: number; sizes: string }
> = {
  header: {
    src: "/logo-header.png",
    width: 1238,
    height: 396,
    sizes: "(min-width: 640px) 150px, 132px",
  },
  footer: {
    // Keep this path stable. Renaming it breaks any already-loaded build that
    // still requests the previous filename, which shows up as a missing logo.
    //
    // This asset is a stacked lockup (full-colour icon over a #FAF0E6 wordmark)
    // on a genuinely transparent background, cut for a dark surface. Do not put
    // it on a light plate: the cream wordmark drops to ~1.02:1 against #F7F4EB
    // and disappears. It reads at ~9.2:1 straight on the #36433B footer.
    //
    // REPLACED with the supplied final transparent artwork. The previous
    // `logo-footer-bgr-light.png` is KEPT ON DISK and is no longer referenced:
    // overwriting it in place would have been irreversible in a repository with
    // no version control, so this is a new file and a one-line swap instead. The
    // intrinsic size moved from 660x518 (ratio 1.2741) to 1661x1279 (ratio
    // 1.2987) - still portrait, still stacked, so the call site keeps deriving
    // width from a height cap rather than setting one.
    //
    // IT COSTS 1.26MB MORE PER PAGE LOAD, and that is the one real problem with
    // it. `unoptimized` is set below, so Next serves this file raw with no
    // srcset: every page on the site now ships 1,597,234 bytes of footer logo
    // instead of 339,895. The source is 1661px wide and renders at about 135px,
    // so it is roughly 12x oversampled. Two fixes are available and neither was
    // applied here, because both change the brand asset rather than the code:
    // drop `unoptimized` and let Next generate a srcset, or resample the file
    // down to about 660px wide to match the previous asset. Measured in the
    // note on the footer call site.
    src: "/logo-footer-transparent-final.png",
    width: 1661,
    height: 1279,
    /* Was "163px", accurate for the old 56px-to-128px height cap at the old
       asset's ratio. The new cap is 104px at a ratio of 1.2987, so 135px.

       INERT IN PRACTICE: `unoptimized` means no srcset is emitted and `sizes` has
       nothing to select between. Kept accurate because a stale `sizes` becomes a
       real bug the moment anyone drops `unoptimized`. */
    sizes: "135px",
  },
};

/**
 * Official Fulfill Nest logo assets. The header uses the supplied horizontal
 * artwork; the footer uses a balanced stacked BGR composition that preserves
 * the full-colour icon while enlarging and centering the #FAF0E6 wordmark for
 * a dark footer surface.
 *
 * Both PNGs carry a real alpha channel — transparent pixels at every edge — so
 * neither needs a background plate from CSS. Any wrapper should stay a bare
 * layout/focus container.
 *
 * public/logo-footer-bgr-centered.png is retained as an alias of the footer
 * asset so previously cached builds keep resolving. Do not delete it.
 */
export function BrandLogo({
  className,
  preload = false,
  variant = "header",
}: BrandLogoProps) {
  const asset = logoAssets[variant];

  return (
    <Image
      src={asset.src}
      alt=""
      aria-hidden="true"
      width={asset.width}
      height={asset.height}
      className={className}
      sizes={asset.sizes}
      quality={100}
      preload={preload}
      loading={variant === "footer" ? "eager" : undefined}
      unoptimized={variant === "footer"}
      draggable={false}
    />
  );
}
