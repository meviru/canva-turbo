/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Bundle optimization
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size
    if (!isServer && !dev) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        fabric: {
          name: 'fabric',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]fabric[\\/]/,
          priority: 20,
        },
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
      };
    }

    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  // Compression and performance
  compress: true,
  poweredByHeader: false,
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  }),
};

export default nextConfig;
