/**
 * The one place the production origin is written.
 *
 * WHY THIS EXISTS. The site's origin was previously hardcoded in four
 * unrelated places — `metadataBase` in `app/layout.tsx`, and `url` / `logo` /
 * the breadcrumb builder in `lib/schema.tsx` — and the two sets had drifted.
 * `metadataBase` said `https://fulfillnest.netlify.app` while the JSON-LD said
 * `https://fulfillnest.com`, so Google was told two different canonical
 * identities for the same pages: `<link rel="canonical">` on one host, and
 * every breadcrumb / Organization `url` on another. Contradictory identity
 * signals are exactly the thing a knowledge graph should never emit.
 *
 * HOW TO USE IT. Never write the origin as a literal again. Import `SITE_URL`
 * or `absoluteUrl()` from here instead — they are what `sitemap.ts`,
 * `robots.ts`, the Metadata API and every JSON-LD builder now read.
 *
 * ── THE DOMAIN MIGRATION ──────────────────────────────────────────────────
 * Both `fulfillnest.netlify.app` (where this is deployed and being worked on)
 * and `fulfillnest.com` (live, transfer pending) currently resolve. The origin
 * below is the DEPLOYED one, because that is the host Google can actually
 * crawl and index today.
 *
 * When the `.com` transfer completes, set `NEXT_PUBLIC_SITE_URL` in the Netlify
 * UI and redeploy. That single variable moves the canonical tags, the JSON-LD,
 * the sitemap and robots.txt together — do NOT edit them individually, because
 * that is how the two sets drifted in the first place.
 */

/**
 * The deployed production origin, with any trailing slash removed so that
 * `absoluteUrl("/")` and `absoluteUrl("")` both yield a bare origin rather
 * than a double-slashed one.
 *
 * Read from the environment so the domain migration is a deploy-time change,
 * not a code change. The literal below is the fallback for local builds where
 * the variable is not set.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fulfillnest.netlify.app"
).replace(/\/+$/, "");

/**
 * Build an absolute URL from a site-relative path.
 *
 * Absolute URLs are mandatory for `og:image` and `twitter:image`: WhatsApp and
 * LinkedIn resolve a relative value against the shared page URL unreliably, and
 * WhatsApp in particular will often refuse to fetch the preview at all rather
 * than resolve it. Relative paths still work for `og:image` in most desktop
 * crawlers, which is exactly why this only shows up as a bug in production.
 *
 * A path with no leading slash is tolerated rather than producing `//path`.
 */
export function absoluteUrl(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalised}`;
}