import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ];
  },
  
  // Webpack configuration for better security
  webpack: (config, { dev }) => {
    if (!dev) {
      // Production optimizations
      config.optimization.minimize = true;
    }
    return config;
  },
  
  // Image optimization
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile images
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable strict mode
  reactStrictMode: true,
};

export default nextConfig;
