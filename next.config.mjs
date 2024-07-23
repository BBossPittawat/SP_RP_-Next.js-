/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["oracledb"]
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'mt200svr',
        port: '8078',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig