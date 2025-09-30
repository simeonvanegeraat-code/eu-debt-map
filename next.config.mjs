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

          // Scripts (Consent Mode, CMP, GTM/GA4, AdSense/DoubleClick, Funding Choices, ATQ/Sodar)
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

          // Styles (CMP + Google consent/Fonts)
          "style-src 'self' 'unsafe-inline' " +
            "https://cdn.cookie-script.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://tpc.googlesyndication.com " +
            "https://fonts.googleapis.com",

          // Sommige browsers checken expliciet style-src-elem
          "style-src-elem 'self' 'unsafe-inline' " +
            "https://cdn.cookie-script.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://tpc.googlesyndication.com " +
            "https://fonts.googleapis.com",

          // Afbeeldingen (voeg hier ATQ image host toe)
          "img-src 'self' data: blob: " +
            "https://*.googlesyndication.com " +
            "https://*.doubleclick.net " +
            "https://www.google-analytics.com " +
            "https://*.adtrafficquality.google",   // ⬅️ nieuw (de fout was ep1.adtrafficquality.google)

          // Fonts (Google Fonts)
          "font-src 'self' data: https://fonts.gstatic.com",

          // Iframes (ads, GTM, Funding Choices, ATQ & google.com containers)
          "frame-src " +
            "https://tpc.googlesyndication.com " +
            "https://googleads.g.doubleclick.net " +
            "https://*.googlesyndication.com " +
            "https://www.googletagmanager.com " +
            "https://fundingchoicesmessages.google.com " +
            "https://ep2.adtrafficquality.google " +
            "https://www.google.com",

          // Netwerkverkeer (XHR/fetch/beacons)
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
