/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ethglobal-taipei-4xxj9.ondigitalocean.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
