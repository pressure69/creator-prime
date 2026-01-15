/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,
  },
  output: 'standalone',
  distDir: '.next'
};

module.exports = nextConfig;
