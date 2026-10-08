"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckIcon } from "@/components/ui/Icons";

interface ContactFormProps {
  className?: string;
}

/** Booking form — client-managed state, safe fallback when no backend exists. */
export function ContactForm({ className = "" }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        className={`flex h-full flex-col items-center justify-center rounded-card border border-sand bg-warm-grey p-10 text-center shadow-elev-1 ${className}`}
        role="status"
      >
        <CheckIcon className="h-7 w-7 text-accent-700" />
        <h3 className="mt-6 font-display text-3xl text-charcoal">
          Thank you — we&apos;ll be in touch.
        </h3>
        <p className="mt-3 max-w-sm text-body text-taupe">
          A gifting specialist will reach out within 24 hours with a few
          questions to start your curation.
        </p>
      </div>
    );
  }

  return (
    <form
      className={`flex min-w-0 flex-col gap-5 ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {/* Name and email go two-up only when there is genuinely room for them.
          The old `sm:grid-cols-2` keyed off the VIEWPORT, which is wrong for a
          form that lives inside a hero column: at 768-1023px the viewport is
          wide enough to trip `sm:` while the card is only ~352px across, so the
          two inputs shared ~124px each and the "priya@company.com" placeholder
          had nowhere to go.

          `@max-[400px]` queries the nearest `@container` ancestor's content box
          instead, and the default stays `grid-cols-2` rather than inverting to
          one column — so a browser without container-query support renders
          exactly what it rendered before, rather than losing the two-up layout
          on desktop. The card in `ContactVisual` carries that `@container`. */}
      <div className="grid grid-cols-2 gap-5 @max-[400px]:grid-cols-1">
        <Input
          label="Full name"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Priya Sharma"
          required
        />
        <Input
          label="Work email"
          name="workEmail"
          type="email"
          autoComplete="email"
          placeholder="priya@company.com"
          required
        />
      </div>
      <Input
        label="Company"
        name="company"
        type="text"
        autoComplete="organization"
        placeholder="Acme Corp"
        required
      />
      <label htmlFor="message" className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-taupe">
          What would you like to celebrate?
        </span>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="e.g. Diwali gifting for 300 employees, or a channel incentive for 40 partners…"
          className="min-w-0 w-full rounded-card border border-sand bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone transition-colors focus:border-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="accent" className="w-full sm:w-auto">
          Book a consultation
        </Button>
        <p className="text-xs leading-5 text-taupe">
          Response within 24 hours · No obligation, no clutter.
        </p>
      </div>
    </form>
  );
}
