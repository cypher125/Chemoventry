import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning instead of error during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignoring type checking errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
