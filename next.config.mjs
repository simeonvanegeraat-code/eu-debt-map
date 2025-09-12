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
    const securityHeaders = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Permissions-Policy",
        value:
          "geolocation=(), microphone=(), camera=(), interest-cohort=()",
      },
      // Start eventueel met Report-Only in productie om te testen
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self';",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://consent.cookiebot.com https://static.cloudflareinsights.com;",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: https:;",
          "font-src 'self' data: https:;",
          "frame-src https://*.google.com https://*.googlesyndication.com;",
          "connect-src 'self' https:;",
          "base-uri 'self';",
          "form-action 'self';",
        ].join(" "),
      },
    ];
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
