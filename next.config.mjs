// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Laat build falen op lint issues zodra haalbaar
  eslint: { ignoreDuringBuilds: false },

  // Als je externe afbeeldingen gebruikt, voeg domeinen hier toe
  images: {
    formats: ["image/avif", "image/webp"],
    // domains: ["cdn.yoursite.com"],
  },

  async headers() {
    // ⚠️ Let op: we gebruiken inline scripts (Consent Mode + gtag config),
    // daarom staat 'unsafe-inline' aan bij script-src en style-src.
    // Wil je strenger? Ga dan met nonces/sha256 werken.
    const securityHeaders = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Permissions-Policy",
        value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
      },
      // 👉 Tijdens testen kun je "Content-Security-Policy-Report-Only" gebruiken (zie toelichting).
      {
        key: "Content-Security-Policy",
        value: [
          // Basis
          "default-src 'self';",

          // Scripts die we nodig hebben:
          // - CookieScript (CMP) + optional report
          // - Google Tag (gtag.js), GA4, Consent Mode endpoints
          // - AdSense / Googlesyndication / DoubleClick
          // - (optioneel) Cloudflare Insights als je dat gebruikt
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
            "https://cdn.cookie-script.com " +
            "https://report.cookie-script.com " +
            "https://www.googletagmanager.com " +
            "https://www.google-analytics.com " +
            "https://pagead2.googlesyndication.com " +
            "https://www.googletagservices.com " +
            "https://googleads.g.doubleclick.net " +
            "https://static.cloudflareinsights.com;",

          // CookieScript kan eigen stylesheet laden; we hebben ook inline styles
          "style-src 'self' 'unsafe-inline' https://cdn.cookie-script.com;",

          // Afbeeldingen van eigen site + Google ads/analytics (https), data-URI's en blob (voor veiligheid ruim)
          "img-src 'self' data: blob: https:;",

          // Fonts lokaal of extern (https) + data URI
          "font-src 'self' data: https:;",

          // Frames/iframes voor GTM, Google (reCAPTCHA/consent surfaces), Ads
          "frame-src https://www.googletagmanager.com https://*.google.com https://*.googlesyndication.com https://googleads.g.doubleclick.net;",

          // Connect endpoints (XHR/fetch/beacons) voor GA4, GTM, Ads, CookieScript
          "connect-src 'self' https: wss: " +
            "https://www.google-analytics.com " +
            "https://region1.google-analytics.com " +
            "https://www.googletagmanager.com " +
            "https://pagead2.googlesyndication.com " +
            "https://googleads.g.doubleclick.net " +
            "https://cdn.cookie-script.com " +
            "https://report.cookie-script.com;",

          // Manifest en base/form
          "manifest-src 'self';",
          "base-uri 'self';",
          "form-action 'self';",

          // (Optioneel) afdwingen dat alles via https gaat
          "upgrade-insecure-requests;",
        ].join(" "),
      },
    ];

    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
