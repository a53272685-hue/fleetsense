/** @type {import('next').NextConfig} */
const nextConfig = {
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
