"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional visible label rendered above the input. */
  label?: string;
}

/**
 * Fulfill Nest text input. Client component — `"use client"` required.
 * Design: 1px hairline border, terracotta focus ring, uppercase caption label.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className = "", id, name, ...props },
  ref,
) {
  const inputId = id ?? name;

  return (
    <label htmlFor={inputId} className="flex min-w-0 flex-col gap-2">
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-taupe">
          {label}
        </span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={`min-w-0 w-full rounded-card border border-sand bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone transition-colors focus:border-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-100 ${className}`}
        {...props}
      />
    </label>
  );
});