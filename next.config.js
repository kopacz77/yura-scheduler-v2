/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
