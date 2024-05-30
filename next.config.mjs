/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  assetPrefix: "/marketsweb",
  rewrites() {
    return [
      { source: "/marketsweb/_next/:path*", destination: "/_next/:path*" },
      { source: "/marketsweb/:path*", destination: "/:path*" },
    ];
  },
  images: {
    domains: ["img.etimg.com"],
  },
};

export default nextConfig;
