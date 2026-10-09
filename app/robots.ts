import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/* REQUIRED under `output: "export"` — same reason as `app/sitemap.ts`: a route
   handler cannot be emitted as static output without being declared so, and the
   build fails outright if it is missing. */
export const dynamic = "force-static";

/**
 * Generated robots.txt. Next prerenders this to `/robots.txt` at build time, so
 * it works under `output: "export"` exactly like the sitemap.
 *
 * EVERYTHING IS ALLOWED. This is a marketing site with nothing behind a login,
 * so there is no crawl budget to protect and nothing to disallow.
 *
 * The `Disallow: /` + `noindex` escape hatch below is documented rather than
 * active. It matters at the point the `.com` domain takes over: `fulfillnest.com`
 * and `fulfillnest.netlify.app` are BOTH live right now, and two crawlable
 * copies of the same site split link equity and risk the wrong one ranking.
 *
 * During the transition the single lever is `NEXT_PUBLIC_SITE_URL` in
 * `lib/site.ts`. If you ever want the Netlify deployment to stop being indexed
 * while the `.com` settles, set that variable and uncomment the block below —
 * `robots.ts` then emits a blanket disallow, which Google honours as a
 * noindex for the whole site without touching a single page's metadata.
 *
 * Note the difference from `X-Robots-Tag`, which would be the tool if only SOME
 * routes needed hiding. That belongs in per-page metadata, not here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}