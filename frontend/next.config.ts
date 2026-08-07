import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '0' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-ancestors 'none'",
  },
];

const noCacheHeader = {
  key: 'Cache-Control',
  value: 'private, no-cache, no-store, max-age=0, must-revalidate',
};

const nextConfig: NextConfig = {
  // Add image domains and other config as needed
  transpilePackages: ['@react-pdf/renderer'],
  poweredByHeader: false,

  // Prevent CDN (Google Frontend) from caching HTML pages.
  // Without this, s-maxage=31536000 causes stale HTML to be served
  // after deploys, the CDN serves old HTML referencing old JS chunks.
  headers: async () => [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      headers: [...securityHeaders, noCacheHeader],
    },
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ],

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
};

export default nextConfig;
