import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "accent"
  | "solidAccent"
  | "secondary"
  | "outline"
  | "forest"
  | "gold";

/** Premium brick-red gradient shared by conversion actions site-wide. */
const brickRedSurface =
  "border border-[#A83B24] bg-[linear-gradient(135deg,#A83B24_0%,#C84B31_100%)] text-white shadow-[0_8px_20px_rgb(168_59_36/0.18)] hover:border-[#8F301C] hover:text-white hover:shadow-[0_4px_14px_rgb(168_59_36/0.35)]";

/** Opt-in deep-forest surface remains available for non-primary actions. */
const forestSurface = "border border-[#36433B] bg-[#36433B] text-white shadow-[0_8px_20px_rgb(54_67_59/0.18)] hover:border-[#29352E] hover:bg-[#29352E] hover:text-white hover:shadow-[0_12px_28px_rgb(54_67_59/0.24)]";

const variantClasses: Record<ButtonVariant, string> = {
  primary: brickRedSurface,
  accent: brickRedSurface,
  solidAccent: brickRedSurface,
  secondary:
    "border border-charcoal/10 bg-white text-[#36433B] shadow-[0_8px_20px_rgb(28_25_23/0.08)] hover:border-[#36433B] hover:bg-[#36433B] hover:text-white hover:shadow-[0_12px_28px_rgb(54_67_59/0.20)]",
  outline:
    "border border-[#36433B]/70 bg-transparent text-[#36433B] shadow-none hover:border-[#36433B] hover:bg-[#36433B] hover:text-white",
  forest: forestSurface,
  gold: "border border-gold-500 bg-gold-500 text-charcoal shadow-sm hover:border-[#C08A25] hover:bg-[#C08A25] hover:text-white",
};

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Set by callers rendering a nav CTA so the current route is announced. */
  ariaCurrent?: "page" | undefined;
}

/** Link styled as the shared Fulfill Nest action. */
export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  ariaLabel,
  ariaCurrent,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={`inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-pill px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
