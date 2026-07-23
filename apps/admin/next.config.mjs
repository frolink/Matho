/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@matho/ui', '@matho/shared', '@matho/types'],
};

export default nextConfig;
