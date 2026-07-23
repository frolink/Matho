/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Transpile internal workspace packages that ship raw TS/TSX (no build step).
  transpilePackages: ['@matho/ui', '@matho/shared', '@matho/types', '@matho/sdk'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
