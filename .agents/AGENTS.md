# Fulfill Nest — Agent Architecture Guide

This file defines the architectural boundaries of the Fulfill Nest website.
Future agents MUST respect these rules unless explicitly directed otherwise by the user.

## Project Stack

- **Next.js 16 (App Router)** + **TypeScript** (strict) + **Tailwind CSS v4**
- Tailwind v4 is configured **CSS-first** via `@theme` inside `app/globals.css`.
  There is **no `tailwind.config.js`** — do not create one.
- Design tokens live in `app/globals.css` (`@theme`). Colors/shadows/radii follow the
  "Modern Editorial Warmth" system: warm neutrals (mist, warm-grey, linen, sand),
  charcoal slate anchors, terracotta accent (`accent-600`), amber gold for celebration moments only.
- Fonts are loaded with `next/font/google` in `app/layout.tsx` and mapped to
  `--font-sans`, `--font-display`, `--font-grotesk` via `@theme inline`.

## Directory Structure & Import Rules

```
app/          Next.js App Router pages & route stubs (page.tsx, layout.tsx, not-found.tsx)
components/   Small reusable UI primitives (Button, Card, Input, ...)
sections/     Large layout blocks (Hero, Features, Footer, Navigation, ...)
public/       Static assets (favicon.png, og-preview.jpg, ...)
```

- **Import direction is strictly one-way:**
  `components/` → `sections/` → `app/` pages.
  - `components/` must never import from `sections/` or `app/`.
  - `sections/` may import from `components/` only (never from `app/`).
  - `app/` may import from both `sections/` and `components/`.
- **Absolute imports only.** Use the `@/*` alias (root → e.g. `@/components/ui/Button`,
  `@/sections/Hero`, `@/app/...`). No relative imports outside the same folder
  where avoidable (share via `@/`).
- Keep components single-purpose and named exports. No default exports for components.

## Server vs. Client Components

- **Server Components are the default.** Pages and most sections must stay server-side
  for performance and SEO.
- Interactive elements (state, event handlers, hooks) MUST be marked `"use client"`
  at the top of the file. Never sprinkle `"use client"` on a file that has no
  interactivity — keep the client boundary as small as possible.
- Pass props (not children closures over client state) across the boundary where possible.

## TypeScript

- Strict mode is enforced (`strict: true`, `noImplicitAny: true`) in `tsconfig.json`.
- Use TypeScript only files (`*.tsx` / `*.ts`). No `any`, no unused variables
  (`noUnusedLocals`/`noUnusedParameters` are on), no `@ts-ignore`.
- Type props/interfaces explicitly; prefer `React.ReactNode` / `HTMLAttributes` extensions.

## Code Quality

- Follow the Fulfill Nest design tokens in `app/globals.css` — do not invent ad-hoc
  hex colors or sizes outside the token system.
- Use Tailwind utility classes; keep bespoke CSS in `globals.css` only when necessary
  (textures, keyframes, focus rings).
- Maintain hairlines (1px `border-sand`), soft shadows (`shadow-elev-1/2/3`),
  pill buttons, and rounded-card (6px) surfaces per the design system.
- Prefer semantic HTML and accessible patterns: real `<button>`, `<label>` for inputs,
  `aria-*` where needed, focus-visible rings.
- Run `npm run typecheck` after changes; the build must pass (`npm run build`).

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (verification gate)
- `npm run start` — serve the production build
- `npm run typecheck` — TypeScript check only (fast)