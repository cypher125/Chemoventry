/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning instead of error during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignoring type checking errors during builds
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 