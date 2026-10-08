import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Hostnames permitted to request dev-only assets and endpoints.
   *
   * Next blocks `/_next/*` and the HMR websocket from unlisted origins. That
   * is what breaks the site on a phone or a second machine: the document itself
   * still returns 200, so you get a blank, hydration-dead page rather than an
   * obvious error, because every script chunk comes back 403 `Unauthorized`.
   *
   * Only the `Origin` hostname is matched — no scheme, no port, no path — and
   * `*` stands for exactly one dot-separated label. So for a 4-octet IPv4
   * origin the pattern needs 4 labels too: `192.168.1.*` matches
   * `192.168.1.9`, while `192.168.*` cannot, since three labels never match
   * four. Partial labels (`192.168.1-*`) are unsupported, and `**` is only
   * valid at the start of a pattern.
   *
   * `192.168.1.*` rather than the two literal addresses because this machine
   * holds both a Wi-Fi (192.168.1.8) and an Ethernet (192.168.1.9) interface and
   * the router reassigns leases. Scoping to one /24 keeps the dev server shut
   * against hosts that merely share the network; `*.*.*.*` would open it to
   * every routable IPv4 host, and a bare `*` is rejected outright.
   *
   * `localhost` and `127.0.0.1` are spelled out even though Next already
   * allows `localhost` and `*.localhost` by default, so the intent survives a
   * change to that default.
   */
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.1.*"],
  images: {
    // 90 is the quality eight call sites actually pass to next/image; while it
    // was missing from this allow-list Next warned about every one of them on
    // every single request.
    qualities: [75, 90, 100],
  },
};

export default nextConfig;