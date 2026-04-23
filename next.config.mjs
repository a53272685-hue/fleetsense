/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Root path redirect — `/` → `/utilization/overview`.
   *
   * IMPORTANT: this MUST live in `redirects()` (server-level), NOT in
   * `app/page.tsx` via `redirect()` from next/navigation. The latter
   * emits a 307 RSC soft redirect with NO `Location` header, which
   * iframes (Framer embeds in particular) refuse to follow with a
   * "refused to connect" error.
   *
   * `permanent: true` returns HTTP 308 with a real `Location` header,
   * which iframes follow correctly and which also carries SEO weight
   * for the canonical home.
   */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/utilization/overview",
        permanent: true,
      },
    ];
  },

  /**
   * Allow this app to be embedded in an <iframe> from Framer properties
   * (portfolio embeds, Framer canvas previews, etc.).
   *
   * We use CSP `frame-ancestors` instead of `X-Frame-Options`:
   *  - X-Frame-Options only supports a single origin or DENY/SAMEORIGIN.
   *  - CSP frame-ancestors accepts a list of origins with wildcards and
   *    takes precedence in modern browsers when both are set, so we leave
   *    X-Frame-Options unset to avoid conflicting directives.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://framer.com https://*.framer.app https://*.framer.website https://*.framercanvas.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
