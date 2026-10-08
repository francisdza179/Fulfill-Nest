import type { ReactNode } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import {
  HeroBadge,
  HeroCanvas,
  HeroStatsBar,
  type HeroStat,
} from "@/sections/hero/HeroFramework";

export type ChildHeroAction =
  | {
      href: string;
      label: string;
      variant?: "primary" | "secondary" | "outline";
    }
  | {
      href: string;
      label: string;
      /** Renders a quiet text link instead of a button. */
      quiet: true;
    };

interface ChildHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  visual?: ReactNode;
  actions?: ChildHeroAction[];
  /** Small supporting cards or proof points beneath the hero copy. */
  children?: ReactNode;
  stats?: HeroStat[];
  /**
   * A quiet line between the lead and the CTAs — a revision date, a document
   * reference, a reading time. Rendered at the eyebrow's own size and colour
   * (`text-sm text-eyebrow-gray`) so it reads as metadata rather than as a
   * sixth headline element, and deliberately *not* uppercase: the eyebrows are
   * uppercased by `HeroBadge`, and a second shouty line under the lead would
   * compete with the H1 it is annotating.
   *
   * Added for the legal pages, whose "Last updated" line used to live inside a
   * floating card in the visual slot. When that card was deleted the date had
   * nowhere to go, and putting it in the copy column is where a revision date
   * belongs anyway.
   *
   * THE LEGAL PAGES NO LONGER USE IT. `LegalDoc` stopped passing a revision
   * date - the prop is gone from its interface - so this slot is currently empty
   * everywhere on the site. The comment is kept rather than deleted because the
   * slot is still live API for a future caller, and because the reason the slot
   * exists at all is worth recording: it is a generic metadata line for any
   * hero that needs one, not a date slot.
   *
   * Checked before removing it, in case the slot was the only thing keeping a
   * hero from feeling bare on those three pages. It was not. Each keeps its
   * eyebrow, title and description, and the document body opens with a numbered
   * index immediately below.
   */
  meta?: ReactNode;
  /**
   * Centred stack instead of the copy/visual split.
   *
   * First used by `/terms` and `/privacy`, which are prose pages with no
   * photograph to pair against a statement: a 1.05/0.95 split would leave one
   * of its two columns permanently empty, and an 800px centred measure is the
   * right read for a legal document's opening statement.
   *
   * It was retained while unused rather than deleted, which is why retuning it
   * to the specified geometry below was free — `/pricing` was the last route to
   * pass it before moving to `columns="even"`, so the branch had no readers and
   * no blast radius.
   */
  layout?: "split" | "center";
  /**
   * `"flat"` drops the shared canvas decoration (paper grain, wash, sage
   * bloom, blurred copper pool, ribbons) so the hero is a plain `bg-canvas`
   * panel. Defaults to `"decorated"`, which is the look the other interior
   * routes are built around.
   */
  canvas?: "decorated" | "flat";
  /**
   * Which warm canvas token the hero is painted with. `"canvas"` is `bg-canvas`
   * (#f7f4eb), which every other route uses; `"light"` is `bg-bg-canvas`
   * (#fbf9f5). Threaded straight to `HeroCanvas`.
   */
  surface?: "canvas" | "light";
  /**
   * Selects the copy/visual column ratio, and everything that ratio forces:
   * the lead measure, the stacked gap, the split breakpoint, and the vertical
   * rhythm.
   *
   * `"editorial"` (default) is `1.05fr 0.95fr` at `lg` with a 640px lead. That
   * ratio is not decorative: at `max-w-7xl` an exact 6/6 cut leaves a 592px
   * copy column, which cannot hold a 640px measure, so the 6/6 version was tried
   * and reverted once already.
   *
   * `"even"` is the true `1fr 1fr` split, and it therefore *has* to narrow the
   * lead to 520px — which is what makes it a coherent option rather than a
   * regression. It also opens the stacked gap to 2rem below `md` and splits at
   * `md` (768px) rather than `lg`, per the standardised architecture: below that
   * it is one column, and above it, one column and one column with a 3rem gap.
   * The 768px split is new — it was `lg:grid-cols-2` (1024px) until the contact
   * round pinned it. That is the one place the split is now visibly tighter
   * than the `editorial` default, and it is worth knowing: between 768 and
   * 1023px a `1fr` column of the 7xl box is ~352px, which the 520px lead wraps
   * inside happily but which is cramped for anything laid out in two columns.
   * `/contact` is where that bites, because its visual slot is a form whose
   * own two-up field grid breaks on a *viewport* `sm:` (640px) rather than on
   * its container. And it takes the standardised 5rem top / 4rem bottom padding,
   * which is the one thing here that is a preference rather than a
   * consequence: revert `pb-16 pt-20` to `pb-10 pt-12 md:pb-12 md:pt-20` in
   * the container to put the old rhythm back without touching the ratio.
   *
   * Note that the 5rem/4rem rhythm is keyed on `even || centered`, not on
   * `even` alone: `centered` used to fall through to the decorated default's
   * 3rem-mobile / 5rem-top / 3rem-bottom rhythm, which was a latent bug the
   * moment any route opted into it. `/terms` and `/privacy` are those routes,
   * and they are specified at 5rem/4rem, so both non-split layouts now share
   * the flat rhythm.
   */
  columns?: "editorial" | "even";
  className?: string;
}

/**
 * The shared "child" hero for every interior route — About, Services,
 * Industries, Pricing, Contact, and PageHero (Case Studies, FAQs, Journal,
 * legal pages and the 404).
 *
 * Because all eleven interior routes mount this one component, the layout
 * contract below is the whole subpage hero system; there is no per-page hero
 * chrome to drift. Five have a dedicated hero file (About, Contact, Industries,
 * Pricing, Services); PageHero covers the remaining six.
 *
 * Two references, deliberately not collapsed into one:
 *
 *   Contact is the STRUCTURAL reference. It renders through this component, so
 *   it defines the split 2-column architecture — statement left, framed visual
 *   right — and the plain token-driven H1. That is the shape every interior
 *   route uses. It is now on the `columns="even"` split like the other four
 *   standardised heroes, so it no longer distinguishes the two column ratios;
 *   what still makes it the reference is that it is the only hero whose
 *   `visual` slot holds something functional rather than decorative. See
 *   `ContactHero`'s own comment for why that slot cannot be a photograph.
 *
 *   Home (`sections/hero/HeroFlanked.tsx`, imported as `Hero`) is a CENTRED
 *   hero with a bespoke animated 3-line "fountain" H1 whose size is set in CSS
 *   by `.hero-heading-title` (per-breakpoint clamps plus `min-height`
 *   reservations for the line animation). It cannot be reduced to a plain
 *   heading without dismantling that animation, so it keeps its own treatment
 *   and is not a candidate for unification. What Home and the child heroes
 *   now DO share is the part that can be shared: the `bg-canvas` token, the
 *   eyebrow, the lead paragraph, and the CTA pattern.
 *
 * Pinned values:
 *   canvas   `bg-canvas` via HeroCanvas — a token. Home, the child canvas and
 *            the translucent hero chips each repeated the literal #F7F4EB.
 *   rhythm   Two rhythms, not one. The decorated default keeps 3rem vertical
 *            padding on mobile and 5rem top / 3rem bottom from md up. The old
 *            `pt-20 md:pt-28 pb-16 md:pb-20` gave 7rem of top space at desktop —
 *            the "floating in empty space" failure mode. The `columns="even"`
 *            branch instead takes the flat 5rem top / 4rem bottom of the
 *            standardised split-column architecture, at every width. Note the
 *            mobile consequence: 5rem of top padding below `md`, where the
 *            default branch uses 3rem. If that reads as too much air on a
 *            phone, the change is one term — `pb-16 pt-20` becomes
 *            `pb-10 pt-12 md:pb-16 md:pt-20` — and it affects only the five
 *            `even` routes. The `even` branch also carries an explicit
 *            `min-h-[520px]` floor — the height lock: copy columns sit on top
 *            of a 2-line H1 (pinned by the `/gifts`-style reserved flipper
 *            box), a fixed `aspect-[3/2]` photo column, and this shared
 *            minimum, so no short column can pull a hero's bottom edge off the
 *            grid the four marketing split heroes share.
 *   columns  the `editorial` default is `lg:grid-cols-[1.05fr_0.95fr]`. At
 *            max-w-7xl that yields a 646px copy column, which is what makes the
 *            640px lead measure below achievable; the previous exact 6/6 cut
 *            capped it at 592px. The `even` branch is instead
 *            `md:grid-cols-2` — an exact 1fr/1fr opening at 768px with a 2rem
 *            gap below that and 3rem above.
 *   h1       the `text-display-xl` token, replacing the local
 *            `text-[clamp(2.25rem,5vw,4rem)]`. Same rendered size, but one
 *            definition. Weight, tracking, leading and colour all come from
 *            the h1-h6 base rule and are deliberately NOT repeated here.
 *   lead     `text-body-lg text-taupe max-w-xl md:text-xl` — now character
 *            for character the home hero's lead.
 *   actions  every hero gets a brick-red primary (`variant: "primary"`) and,
 *            where a second route is genuinely useful, a `secondary` pair.
 *            About, Services, Industries, Case Studies, FAQs and Journal had
 *            only a quiet text link, or a dead in-page anchor.
 *
 * It stays quieter than the home hero: no floating product choreography and no
 * independent animation. The visual slot is a single composed sibling that
 * sits beside (or beneath) the statement rather than competing with it.
 *
 * One deliberate divergence: `/services`, `/industries`, `/pricing`, `/about`
 * and `/contact` pass `canvas="flat"`, `surface="light"` and `columns="even"`
 * together, so their heroes are bare `#fbf9f5` panels split into an exact
 * `1fr 1fr` with no canvas decoration behind the copy.
 *
 * `/terms` and `/privacy` are flat `#fbf9f5` too, but on the third axis:
 * `layout="center"` with no `visual` at all, because a prose page has no
 * photograph to set beside a statement. `columns` is left at its default
 * because `centered` short-circuits ahead of it in the container ternary, and
 * saying `"even"` there would be a lie about which branch is rendering.
 *
 * The reference pages (/terms, /privacy, /faq and /journal) all take
 * `layout="center"` with no `visual` at all - /case-studies did too, and was
 * the fifth, until the route was deleted. The decision is the same in every
 * case and is worth stating once, because it is the rule the next hero should
 * follow: a page whose content is TEXT (a legal document, a question set, a
 * reading list) has no photograph that adds to it, and a split hero would
 * leave one of its two columns permanently empty. Reference pages take the
 * centred treatment; marketing
 * pages take the split. Do not give a `visual` to a `centered` hero, because
 * the branch renders it below the statement at a wider cap, which is a third
 * layout nobody has asked for.
 *
 * All of these are per-page opt-ins with shared defaults, so none of them can
 * leak. `surface` and `decorative` are genuinely independent axes and are not
 * bundled: `surface` decides how pale the base is, `decorative` decides how
 * loud the field is. `columns` is the exception — it is the layout axis, and
 * it also selects the layout's vertical rhythm, because a 50/50 column wants
 * more air above it than a 1.05/0.95 one and the two should not be specified
 * independently. `surface="light"` with no `columns="even"` and no
 * `layout="center"` is therefore a valid but untested combination; nothing
 * passes it.
 *
 * `centered` went a long stretch with no user at all — `/pricing` was the last
 * route to pass it, and the fact that its geometry could be retuned to a
 * centred 800px column for free is the only reason that retune was possible.
 * It now has five users. A component that looks like it has a feature nobody
 * wants is usually a component whose removal is deferred, not a component that
 * is dead.
 *
 * The stats row below the grid is *not* on the standardised split, and on an
 * `even` hero its own padding is zeroed so the container's `pb-16` is the
 * section's entire bottom padding.
 *
 * As of the contact clean-up, NO route renders a stats row: `/contact` was the
 * last one passing `stats`, and its bar was deleted. `PageHero` still declares a
 * `stats` prop and forwards it, but none of the six routes using it supply one,
 * and the other four `even` heroes all deliberately pass nothing. So both
 * branches below are currently unreachable, and `HeroStatsBar` has no live call
 * site. The prop and the component are kept deliberately: a hero that later
 * grows a proof bar should not have to re-derive the padding rule, and
 * `HeroStatsBar` is the only stat renderer the site has. Deleting either is a
 * separate decision, not a side effect of this one.
 */
export function ChildHero({
  eyebrow,
  title,
  description,
  visual,
  actions = [],
  children,
  stats,
  meta,
  layout = "split",
  canvas = "decorated",
  surface = "canvas",
  columns = "editorial",
  className = "",
}: ChildHeroProps) {
  const centered = layout === "center";
  const hasVisual = Boolean(visual);
  const even = columns === "even";

  return (
    <HeroCanvas
      className={className}
      decorative={canvas !== "flat"}
      surface={surface}
    >
      <div
        className={`mx-auto max-w-7xl px-5 md:px-6 ${
          even || centered ? "pb-16 pt-20" : "pb-10 pt-12 md:pb-12 md:pt-20"
        } ${even ? "min-h-[520px]" : ""} ${
          centered
            ? "flex flex-col items-center text-center"
            : hasVisual
              ? even
                ? "grid min-w-0 items-center gap-8 md:grid-cols-2 md:gap-12"
                : "grid min-w-0 items-center gap-10 md:gap-12 lg:grid-cols-[1.05fr_0.95fr]"
              : "max-w-5xl"
        }`}
      >
        <div
          className={
            centered
              ? "flex w-full min-w-0 max-w-[800px] flex-col items-center"
              : hasVisual
                ? "flex min-w-0 flex-col items-start"
                : "flex min-w-0 max-w-4xl flex-col items-start"
          }
        >
          <HeroBadge>{eyebrow}</HeroBadge>

          <h1 className="mt-6 max-w-full break-words text-display-xl text-charcoal">
            {title}
          </h1>

          {/* Identical to the home hero's lead: `text-body-lg` supplies 18px on
              the 1.6 body leading, `md:text-xl` lifts it to 20px while leaving
              that leading intact, `max-w-xl` is the 640px measure, and
              `text-taupe` is the #4b5563 body token. The old pair was
              `text-lg leading-8 text-walnut md:text-xl` — a 1.78 leading that
              the site-wide typography pass had already retired, in a different
              grey (#4e4a43), at 672px.

              Under `columns="even"` the desktop size lift is dropped and the
              measure narrows to 520px, because a true 50/50 column of a 7xl box
              is 592px wide and cannot hold the 640px measure — 520px sits
              comfortably inside it at the same 18px body size.

              Under `layout="center"` the lift is dropped too, but for the
              opposite reason, and the measure goes the other way: 18px at every
              width, filling the 800px column. That is the specified legal-page
              treatment (1.125rem / 1.6 / #4b5563), and `max-w-full` rather than
              a narrower cap is deliberate — the container is what bounds the
              measure, so a second cap here would only be a number to keep in
              sync with it. It does mean an 800px measure at 18px on a legal
              page's opening sentence, which is longer than the 640px the other
              heroes use; tightening it, if wanted, is one term on this line. */}
          <p
            className={
              centered
                ? "mt-6 max-w-full text-body-lg text-taupe"
                : even
                  ? "mt-6 max-w-[520px] text-body-lg text-taupe"
                  : "mt-6 max-w-xl text-body-lg text-taupe md:text-xl"
            }
          >
            {description}
          </p>

          {meta ? (
            <p className="mt-4 text-sm text-eyebrow-gray">{meta}</p>
          ) : null}

          {actions.length > 0 ? (
            <div
              className={`mt-8 flex flex-col items-stretch gap-4 sm:flex-row ${
                centered ? "justify-center" : "items-start"
              }`}
            >
              {actions.map((action) => {
                if ("quiet" in action) {
                  return (
                    <Link
                      key={`${action.href}-${action.label}`}
                      href={action.href}
                      className="link-ribbon inline-flex min-h-11 items-center justify-center gap-2 px-2 text-sm font-semibold text-brand-primary sm:justify-start"
                    >
                      {action.label}
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  );
                }

                return (
                  <ButtonLink
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    variant={action.variant ?? "primary"}
                  >
                    {action.label}
                    <ArrowRightIcon className="h-4 w-4" />
                  </ButtonLink>
                );
              })}
            </div>
          ) : null}

          {children ? (
            <div className={centered ? "mt-8 w-full" : "mt-8 w-full"}>
              {children}
            </div>
          ) : null}
        </div>

        {visual ? (
          <div
            className={
              centered
                ? "relative mt-14 w-full max-w-5xl"
                : "relative min-w-0 w-full"
            }
          >
            {visual}
          </div>
        ) : null}
      </div>

      {stats && stats.length > 0 ? (
        <div
          className={`mx-auto max-w-7xl px-5 md:px-6 ${
            even ? "pb-0" : "pb-10 md:pb-12"
          }`}
        >
          <HeroStatsBar stats={stats} />
        </div>
      ) : null}
    </HeroCanvas>
  );
}
