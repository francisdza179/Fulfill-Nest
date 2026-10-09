import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/* REQUIRED under `output: "export"`. A route handler has no static rendering
   mode of its own, so the exporter refuses to emit it without this — the build
   fails with "export const dynamic = force-static not configured on route
   /sitemap.xml". `app/layout.tsx` already carries the same declaration for the
   same reason. Without it there is no `sitemap.xml` at all. */
export const dynamic = "force-static";

/**
 * Generated sitemap. Next prerenders this to `/sitemap.xml` at build time, so it
 * works identically under `output: "export"` — no runtime, no server.
 *
 * There is no `generateSitemaps`/`generateStaticParams` here because the route
 * set is small and fixed: enumerating it by hand is more readable than a
 * dynamic walk, and it means a page cannot silently fall out of the sitemap the
 * way it can when the list is derived.
 *
 * PRIORITIES are a rough commercial ordering, not a claim about crawl
 * frequency — Google ignores `priority` and `changefreq` outright and uses
 * `lastModified`. They are kept because they document intent for whoever reads
 * the file next.
 *
 * `lastModified` is the build timestamp. Under static export that is the only
 * date available without a content pipeline, and it is the honest answer: the
 * deployment IS the last modification.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number }[] = [
    // Commercial pages — the ones the business is ranked for.
    { path: "/", priority: 1 },
    { path: "/gifts", priority: 0.9 },
    { path: "/industries", priority: 0.9 },
    { path: "/pricing", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },

    // Reference / editorial.
    { path: "/faq", priority: 0.6 },
    { path: "/journal", priority: 0.6 },

    // Policy pages. Low priority is correct: these should rank for their own
    // names at most, and none of them is a landing target.
    { path: "/terms", priority: 0.3 },
    { path: "/privacy", priority: 0.3 },
    { path: "/ethical-sourcing-policy", priority: 0.3 },
  ];

  /* `/services` is deliberately ABSENT. It used to 308 to `/gifts`, but
     `permanentRedirect()` cannot be expressed in a static export — the build
     emitted an `__next_error__` shell served at HTTP 200, which is a soft-404
     that Google can index. The redirect is now a Netlify rule in
     `netlify.toml`, and listing a redirecting URL in the sitemap would be
     pointing crawlers straight at the thing we are redirecting away from. */

  return routes.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}