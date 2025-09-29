// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    const securityHeaders = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" }, // voorkomt dat JOUW site wordt ingebed
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Permissions-Policy",
        value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          // Basis
          "default-src 'self'",

          // Scripts (Consent Mode, CookieScript, GTM/GA4, AdSense/DoubleClick, Funding Choices)
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
            "https://cdn.cookie-script.com " +
            "https://report.cookie-script.com " +
            "https://www.googletagmanager.com " +
            "https://www.google-analytics.com " +
            "https://pagead2.googlesyndication.com " +
            "https://securepubads.g.doubleclick.net " +
            "https://googleads.g.doubleclick.net " +
            "https://www.googletagservices.com " +
            "https://fundingchoicesmessages.google.com",

          // Styles (CookieScript + inline)
          "style-src 'self' 'unsafe-inline' https://cdn.cookie-script.com",

          // Afbeeldingen (ruim genoeg voor ads/trackers)
          "img-src 'self' data: blob: https://*.googlesyndication.com https://*.doubleclick.net https://www.google-analytics.com",

          // Fonts
          "font-src 'self' data: https:",

          // Iframes (ads, GTM, Funding Choices)
          "frame-src https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://*.googlesyndication.com https://www.googletagmanager.com https://fundingchoicesmessages.google.com",

          // Netwerkverkeer (XHR/fetch/beacons)
          "connect-src 'self' https: wss: " +
            "https://*.doubleclick.net " +
            "https://*.googlesyndication.com " +
            "https://adservice.google.com " +         // soms gebruikt
            "https://adservice.google.nl " +          // lokale variant (voeg meer TLD's toe indien nodig)
            "https://www.google-analytics.com " +
            "https://region1.google-analytics.com " +
            "https://www.googletagmanager.com " +
            "https://cdn.cookie-script.com " +
            "https://report.cookie-script.com " +
            "https://fundingchoicesmessages.google.com",

          // Overige
          "manifest-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
    ];

    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
