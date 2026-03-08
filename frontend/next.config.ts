import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add image domains and other config as needed
  transpilePackages: ['@react-pdf/renderer'],
  output: 'standalone',
};

export default nextConfig;
