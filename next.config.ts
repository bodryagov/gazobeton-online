import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
    localPatterns: [
      {
        pathname: '/products/**',
      },
      {
        pathname: '/products/**',
        search: 'v=*',
      },
      {
        pathname: '/brands/**',
      },
    ],
  },
};

export default nextConfig;

