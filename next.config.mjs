/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  eslint: { ignoreDuringBuilds: true }
};
export default {
  i18n: {
    locales: ["en", "nl", "de", "fr"],
    defaultLocale: "en",
  },
};

