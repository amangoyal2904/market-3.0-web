const nextConfig = {
  assetPrefix: "/marketsweb",
  rewrites() {
    return [{ source: "/marketsweb/:path*", destination: "/:path*" }];
  },
  async redirects() {
    return [
      {
        source: "/markets/stock-screener/:scrid*.cms",
        destination: "/markets/stock-screener/:scrid*",
        permanent: true,
      },
    ];
  },
  compress: false,
  images: {
    domains: ["img.etimg.com", "marketcharts.indiatimes.com"],
  },
};

export default nextConfig;
