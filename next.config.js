/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In development, we want longer timeouts for API routes
  serverRuntimeConfig: {
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
      // Extended timeout in development for debugging
      responseTimeout: process.env.NODE_ENV === 'development' ? 60000 : 10000,
    },
  },
  // Enable more verbose logging in development
  logging: process.env.NODE_ENV === 'development' ? {
    fetches: {
      fullUrl: true,
    },
  } : undefined,
};

module.exports = nextConfig;
