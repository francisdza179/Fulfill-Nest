"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";

const brickRedSurface =
  "border border-[#A83B24] bg-[linear-gradient(135deg,#A83B24_0%,#C84B31_100%)] text-white shadow-[0_8px_20px_rgb(168_59_36/0.18)] hover:border-[#8F301C] hover:text-white hover:shadow-[0_4px_14px_rgb(168_59_36/0.35)]";

const variantClasses: Record<ButtonVariant, string> = {
  primary: brickRedSurface,
  accent: brickRedSurface,
  secondary:
    "border border-charcoal/10 bg-white text-[#36433B] shadow-sm hover:border-[#36433B] hover:bg-[#36433B] hover:text-white",
  ghost: "text-accent-600 hover:text-accent-700",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/** Shared form/submit action. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", className = "", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-pill px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  },
);
