// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  eslint: { ignoreDuringBuilds: true },
  i18n: {
    locales: ["en", "nl", "de", "fr"],
    defaultLocale: "en",
    localeDetection: false, // ✅ zet detectie uit
  },
};

export default nextConfig;

