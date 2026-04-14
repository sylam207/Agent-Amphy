import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'covers.openlibrary.org' }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    proxyClientMaxBodySize: '100mb',
  },
  async rewrites() {
    return [
      {
        source: '/vapi-proxy/:path*',
        destination: 'https://api.vapi.ai/:path*',
      },
    ];
  },
};

export default nextConfig;
