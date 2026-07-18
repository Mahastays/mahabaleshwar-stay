import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['coletta-nonaffective-erline.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.mahastays.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Proxy to backend to bypass browser mixed-content (HTTPS -> HTTP) blocks
        destination: `${process.env.BACKEND_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
