/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  assetPrefix: "/marketsweb",
  rewrites() {
    return [
      { source: "/marketsweb/_next/:path*", destination: "/_next/:path*" },
      {
        source: "/marketsweb/icon_svgs/:path*",
        destination: "/icon_svgs/:path*",
      },
      {
        source: "/marketsweb/img/:path*",
        destination: "/img/:path*",
      },
      {
        source: "/marketsweb/static/:path*",
        destination: "/static/:path*",
      },
      {
        source: "/marketsweb/etfavicon.ico",
        destination: "/etfavicon.ico",
      },
      {
        source: "/marketsweb/icon_pdf.svg",
        destination: "/icon_pdf.svg",
      },
      {
        source: "/marketsweb/prime_icon.svg",
        destination: "/prime_icon.svg",
      },
    ];
  },
  images: {
    domains: ["img.etimg.com"],
  },
};

export default nextConfig;
