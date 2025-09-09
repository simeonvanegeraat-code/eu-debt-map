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

  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/about",
        permanent: true, // 308 redirect voor SEO + AdSense
      },
    ];
  },
};

export default nextConfig;
