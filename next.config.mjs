// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },

  // ✅ i18n alleen voor locale-detectie/hreflang; géén /en/ prefix gebruiken
  i18n: {
    locales: ["en", "nl", "fr", "de"],
    defaultLocale: "en",
  },

  images: { formats: ["image/avif", "image/webp"] },

  // ✅ Vang per ongeluk /en/... en stuur terug naar root-equivalent
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      // niets anders redirecten — /nl, /fr, /de blijven zoals ze zijn
    ];
  },

  async headers() {
    const securityHeaders = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Permissions-Policy",
        value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
            "https://cdn.cookie-script.com " +
            "https://report.cookie-script.com " +
            "https://www.googletagmanager.com " +
            "https://www.google-analytics.com " +
            "https://pagead2.googlesyndication.com " +
            "https://securepubads.g.doubleclick.net " +
            "https://googleads.g.doubleclick.net " +
            "https://www.googletagservices.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://ep2.adtrafficquality.google",
          "style-src 'self' 'unsafe-inline' " +
            "https://cdn.cookie-script.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://tpc.googlesyndication.com " +
            "https://fonts.googleapis.com",
          "style-src-elem 'self' 'unsafe-inline' " +
            "https://cdn.cookie-script.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://tpc.googlesyndication.com " +
            "https://fonts.googleapis.com",
          "img-src 'self' data: blob: " +
            "https://*.googlesyndication.com " +
            "https://*.doubleclick.net " +
            "https://www.google-analytics.com " +
            "https://*.adtrafficquality.google",
          "font-src 'self' data: https://fonts.gstatic.com",
          "frame-src " +
            "https://tpc.googlesyndication.com " +
            "https://googleads.g.doubleclick.net " +
            "https://*.googlesyndication.com " +
            "https://www.googletagmanager.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://ep2.adtrafficquality.google " +
            "https://www.google.com",
          "connect-src 'self' https: wss: " +
            "https://*.doubleclick.net " +
            "https://*.googlesyndication.com " +
            "https://adservice.google.com " +
            "https://adservice.google.nl " +
            "https://www.google-analytics.com " +
            "https://region1.google-analytics.com " +
            "https://www.googletagmanager.com " +
            "https://cdn.cookie-script.com " +
            "https://report.cookie-script.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://ep2.adtrafficquality.google",
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
