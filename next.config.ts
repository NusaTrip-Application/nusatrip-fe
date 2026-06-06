import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nusatrip-be.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
