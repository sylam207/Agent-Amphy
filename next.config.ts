import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'covers.openlibrary.org' }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Allow up to 100MB for server actions
    },
  },
};

export default nextConfig;
