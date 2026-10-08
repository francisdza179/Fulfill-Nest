"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ButtonLink } from "@/components/ui/ButtonLink";

/* Five links.
 *
 * The brief asked for a strict three - Products, Pricing, About - and that
 * is what shipped first. Home and Industries were dropped along with the
 * "Resources" dropdown and then restored here on request. They go back in
 * their original relative positions, so the brief's three still sit in the
 * order the brief gave them: Products, Pricing, About. That first label has
 * since been renamed twice along with the route it points at: "Products" ->
 * "Gifts" when `/services` became `/gifts`, then "Gifts" -> "Explore Gifts" as
 * a plain action-word label. Only the label moved on the last pass; the href
 * has been `/gifts` throughout, and so has the page's own metadata title.
 *
 * "Explore Gifts" points at `/gifts`. The page was `/services` and has been
 * renamed,
 * so the label, the URL and the page's own metadata title all say the same
 * thing now. The old path survives as a 308 to `/gifts` (see
 * `app/services/page.tsx`) rather than 404ing, because every hero CTA on the
 * site used to point at it and any of those links may already be shared
 * somewhere this codebase cannot see.
 *
 * `Industries` used to carry an `lgOnly` flag that hid it between the `md`
 * and `lg` breakpoints, back when the nav was crowded. It is not flagged now
 * and that is deliberate. The footer edit that ran alongside the trim also
 * removed the footer's Industries entry (see Footer.tsx), so this nav link
 * is now the only route to `/industries` anywhere on the site. Restoring the
 * flag would leave that route unreachable on tablet-width screens, which is
 * the opposite of what restoring the item was for. It fits at `md` with
 * room to spare: five short labels plus the logo come to roughly 560px
 * against the 736px the pill has at that breakpoint.
 *
 * THAT 560px FIGURE IS NOW STALE, and this label is why. "Gifts" -> "Explore
 * Gifts" adds eight characters to one item in the list, at `text-sm font-medium
 * tracking-wide` (14px / 500 / +0.025em). Estimated at a 0.55em average
 * advance that is about +50px of glyphs plus ~5px of tracking, so ~610-620px
 * against the same 736px. It still fits at `md`; the slack drops from roughly
 * 176px to roughly 120px.
 *
 * `md` is the breakpoint that matters, because the Contact CTA is
 * `hidden lg:block` - it is the only width where the label list has the whole
 * pill to itself and the `lg:gap-7` bump on the ul's `gap-6` has not yet bought
 * any room back. Both other widths are fine by a wide margin: the mobile drawer
 * is a stacked full-width row on `justify-between`, so a longer label costs it
 * nothing at all.
 *
 * If a sixth link or another longer label ever lands, this is what breaks
 * first, and the fix is to shorten a label rather than to drop `Industries` -
 * that link is the only route to `/industries` anywhere on the site, per the
 * note above.
 *
 * `/journal` is still unreachable - the header and the footer both dropped it
 * and nothing else on the site links to it. That one is a live page with no
 * inbound links, and removing the page is the fix, not adding a nav item.
 *
 * `/blog` and `/resources` were on the removal list and never existed: zero
 * references to either anywhere in the codebase, so nothing needed taking
 * out. */
const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/gifts", label: "Explore Gifts" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const SCROLL_LIFT_THRESHOLD = 150;
const SCROLL_REST_THRESHOLD = 40;
const SCROLL_HIDE_THRESHOLD = 900;
const SCROLL_UP_REVEAL_DELTA = 50;

/**
 * Floating glass-pill navigation with compact-on-scroll physics: it rests at
 * 36px from the viewport top, lifts to 12px after 150px of scrolling, hides
 * beyond 900px while moving down, and reveals after a deliberate 50px upward
 * movement. Once lifted, it remains at 12px until scrolling returns above 40px.
 * Brand mark + conversion CTA.
 *
 * FIVE links. The brief asked for three; Home and Industries came back after
 * the first pass. The "Resources" dropdown, its submenu component and the
 * `resourceLinks` array are still gone, and so are the `ArrowRightIcon` and
 * `ChevronDownIcon` imports, which only that submenu used. Case Studies lost
 * its nav entries in both passes and is still linked from four body sections
 * outside this file; Journal and FAQs lost theirs in the first pass, and FAQs
 * keeps a footer entry while /journal is now unreachable site-wide.
 */
export function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();
  const lastY = useRef(0);
  const hideOriginY = useRef(0);
  const ticking = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  /* Close the mobile menu when the route changes (covers link taps). */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* While the mobile menu is open: Escape closes it, tapping outside closes
     it, and body scroll locks so the page stays put behind the panel. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node | null)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  /* "page" for the exact home route, else prefix match for sections. */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY.current;
        const shouldRest = y < SCROLL_REST_THRESHOLD;
        const shouldLift = y >= SCROLL_LIFT_THRESHOLD;

        /* Hysteresis keeps a lifted pill compact throughout the 40–149px band,
           preventing small upward corrections from snapping it to rest. */
        setCompact((previous) => {
          if (shouldRest) return false;
          if (shouldLift) return true;
          return previous;
        });

        if (shouldRest) {
          hideOriginY.current = 0;
          setHidden(false);
        } else if (delta < 0) {
          /* Require a deliberate net upward movement from the deepest hidden
             position before restoring the pill at its compact offset. */
          if (
            hideOriginY.current > 0 &&
            y <= hideOriginY.current - SCROLL_UP_REVEAL_DELTA
          ) {
            hideOriginY.current = 0;
            setHidden(false);
          }
        } else if (delta > 0 && y > SCROLL_HIDE_THRESHOLD) {
          hideOriginY.current = y;
          setHidden(true);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const navigationHidden = hidden && !menuOpen;

  return (
    <>
      <div
        data-nav-state={
          navigationHidden ? "hidden" : compact ? "compact" : "rest"
        }
        aria-hidden={navigationHidden ? true : undefined}
        inert={navigationHidden ? true : undefined}
        style={{
          transform: `translate3d(-50%, ${
            navigationHidden ? "-120%" : "0"
          }, 0)`,
        }}
        className={`floating-nav-motion fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-[1100px] will-change-[top,transform] ${
          compact ? "top-3" : "top-9"
        }`}
      >
        <header
          ref={headerRef}
          className={`hero-entrance glass-nav transition-[border-radius,background-color,box-shadow] duration-300 ${
            menuOpen ? "rounded-[2rem]" : "rounded-pill"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <nav
            aria-label="Primary"
            className="flex items-center justify-between gap-3 py-2 pl-4 pr-3 sm:pl-5 sm:pr-3 lg:gap-4"
          >
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label="Fulfill Nest — home"
            >
              <BrandLogo
                className="h-[42px] w-auto transition-opacity duration-300 group-hover:opacity-80 sm:h-12"
                preload
              />
            </Link>

            <div className="hidden items-center gap-5 md:flex">
              <ul className="flex items-center gap-6 lg:gap-7">
                {primaryLinks.map((link) => (
                  <li key={link.href}>
                    <NavLink href={link.href} active={isActive(link.href)}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="hidden lg:block">
                <ButtonLink
                  href="/contact"
                  variant="primary"
                  ariaCurrent={isActive("/contact") ? "page" : undefined}
                >
                  Contact
                </ButtonLink>
              </div>
            </div>

            {/* Mobile menu toggle — below md the primary nav is hidden here */}
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-pill text-walnut transition-colors duration-200 hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 md:hidden"
            >
              <span className="relative block h-3.5 w-5" aria-hidden="true">
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] rounded-full bg-current transition-transform duration-300 ${
                    menuOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current transition-opacity duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-current transition-transform duration-300 ${
                    menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </nav>

        {/* Mobile menu panel */}
        {menuOpen ? (
          <div
            id="mobile-nav"
            className="max-h-[calc(100dvh-7rem)] animate-fade-in overflow-y-auto overscroll-contain rounded-b-[2rem] border-t border-charcoal/10 bg-white/90 backdrop-blur-md md:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto max-w-7xl px-6 py-6">
              <ul className="flex flex-col">
                {primaryLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`nav-link flex items-center justify-between gap-4 py-3 text-base font-medium ${
                        isActive(link.href) ? "active" : "text-charcoal"
                      }`}
                    >
                      {link.label}
                      {isActive(link.href) ? (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-brand-primary"
                        />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/contact"
                variant="primary"
                className="mt-6 w-full justify-center"
              >
                Contact
              </ButtonLink>
            </nav>
          </div>
        ) : null}
        </header>
      </div>

      {/* Preserve the navigation's original document footprint while its
          visual bar is fixed to the viewport. */}
      <div aria-hidden="true" className="h-[3.75rem] sm:h-[4.75rem]" />
    </>
  );
}

/** Primary nav link — accent underline grows on hover, stays when active.
 *
 *  `active` comes from `usePathname()` in the parent, so the class and
 *  `aria-current` are both derived from the real route rather than set by
 *  hand. Colour and weight for both states live in globals.css under
 *  `.nav-link`, which is why no text-colour utility is set here. */
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`nav-link group/nav relative inline-block py-1.5 text-sm font-medium tracking-wide ${
        active ? "active" : ""
      } text-walnut`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`nav-link-underline absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 [transition-timing-function:var(--ease-premium)] ${
          active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
        }`}
      />
    </Link>
  );
}
