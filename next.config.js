/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'x.com',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  // If you're deploying to a custom domain, you can remove these
  basePath: process.env.NODE_ENV === 'production' ? '/twitter' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/twitter/' : '',
};

module.exports = nextConfig;