/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/marketsweb",
  rewrites() {
    return [
      { source: '/marketsweb/_next/:path*', destination: '/_next/:path*' }
    ]
  },
  images: {
    domains: ["img.etimg.com"],
  },
};

export default nextConfig;
