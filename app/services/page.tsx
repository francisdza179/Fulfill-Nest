import { permanentRedirect } from "next/navigation";

/** `/services` -> `/gifts`, permanently.
 *
 *  The page this used to hold is now at `/gifts`, renamed so the nav label,
 *  the URL and the page title all say the same thing. The old path is kept
 *  alive as a 308 rather than 404ing, because inbound links to it predate the
 *  rename: every hero CTA on the site pointed here, and any of them already
 *  shared in a deck, a bio or an email would otherwise break.
 *
 *  `permanentRedirect` rather than `redirect` so search engines treat it as
 *  the move it is and fold the old URL's equity into the new one. In a Server
 *  Component the `type` argument has no effect, and the call throws
 *  `NEXT_REDIRECT` to end the segment, so it must not be `return`ed or
 *  wrapped in a `try`.
 */
export default function LegacyServicesRedirect() {
  permanentRedirect("/gifts");
}
