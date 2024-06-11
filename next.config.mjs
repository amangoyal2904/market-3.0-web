/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  assetPrefix: "/marketsweb",
  rewrites() {
    return [{ source: "/marketsweb/:path*", destination: "/:path*" }];
  },
  async headers() {
    return [
      {
        source: "/marketsweb/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=31536000, must-revalidate, stale-while-revalidate=6,30,72,000", // 365 days
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: "/markets/live-coverage",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=300, must-revalidate, stale-while-revalidate=600", // 5 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 300000).toUTCString(),
          },
        ],
      },
      {
        source: "/markets/stock-market-mood",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=1200, must-revalidate, stale-while-revalidate=2400", // 20 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 1200000).toUTCString(),
          },
        ],
      },
      {
        source: "/watchlist",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=1200, must-revalidate, stale-while-revalidate=2400", // 20 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 1200000).toUTCString(),
          },
        ],
      },
      {
        source: "/stocks/marketstats(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=1200, must-revalidate, stale-while-revalidate=2400", // 20 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 1200000).toUTCString(),
          },
        ],
      },
      {
        source: "/markets/indices(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=900, must-revalidate, stale-while-revalidate=1800", // 15 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 900000).toUTCString(),
          },
        ],
      },
      {
        source: "/markets/stock-recos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=900, must-revalidate, stale-while-revalidate=1800", // 15 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 900000).toUTCString(),
          },
        ],
      },
      {
        source: "/markets/stock-screener(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=600, must-revalidate, stale-while-revalidate=1200", // 10 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 600000).toUTCString(),
          },
        ],
      },
      {
        source: "/markets/top-india-investors-portfolio/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=600, must-revalidate, stale-while-revalidate=1200", // 10 min
          },
          {
            key: "Expires",
            value: new Date(new Date().getTime() + 600000).toUTCString(),
          },
        ],
      },
    ];
  },
  images: {
    domains: ["img.etimg.com"],
  },
};

export default nextConfig;
