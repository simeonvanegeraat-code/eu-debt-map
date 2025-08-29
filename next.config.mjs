/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  // Laat builds doorlopen ook als ESLint moppert (kan je later verwijderen)
  eslint: { ignoreDuringBuilds: true }
};
export default nextConfig;
