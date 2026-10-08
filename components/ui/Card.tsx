import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Semantic element to render. Defaults to a plain div. */
  as?: "div" | "article" | "section";
}

/** Editorial card surface: warm background, hairline border, soft elevation. */
export function Card({
  as: Component = "div",
  className = "",
  ...props
}: CardProps) {
  return (
    <Component
      className={`rounded-card border border-charcoal/10 bg-surface shadow-elev-1 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green-700/30 hover:shadow-card-hover ${className}`}
      {...props}
    />
  );
}