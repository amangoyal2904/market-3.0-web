/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  assetPrefix: "/marketsweb",
  rewrites() {
    return [{ source: "/marketsweb/:path*", destination: "/:path*" }];
  },
  async headers() {
    const headers = [
      {
        source: "/marketsweb/_next/static/chunks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/marketsweb/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, must-revalidate, stale-while-revalidate=604800", // 365 days, 7 days for stale-while-revalidate
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(), // 365 days from now
          },
        ],
      },
      {
        source: "/markets/live-coverage",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=300, must-revalidate, stale-while-revalidate=600", // 5 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 300000).toUTCString(), // 5 min from now
          },
        ],
      },
      {
        source: "/markets/stock-market-mood",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=1200, must-revalidate, stale-while-revalidate=2400", // 20 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 1200000).toUTCString(), // 20 min from now
          },
        ],
      },
      {
        source: "/watchlist",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=1200, must-revalidate, stale-while-revalidate=2400", // 20 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 1200000).toUTCString(), // 20 min from now
          },
        ],
      },
      {
        source: "/stocks/marketstats(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=1200, must-revalidate, stale-while-revalidate=2400", // 20 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 1200000).toUTCString(), // 20 min from now
          },
        ],
      },
      {
        source: "/markets/indices(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=900, must-revalidate, stale-while-revalidate=1800", // 15 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 900000).toUTCString(), // 15 min from now
          },
        ],
      },
      {
        source: "/markets/stock-recos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=900, must-revalidate, stale-while-revalidate=1800", // 15 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 900000).toUTCString(), // 15 min from now
          },
        ],
      },
      {
        source: "/markets/stock-screener(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=600, must-revalidate, stale-while-revalidate=1200", // 10 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 600000).toUTCString(), // 10 min from now
          },
        ],
      },
      {
        source: "/markets/top-india-investors-portfolio/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=600, must-revalidate, stale-while-revalidate=1200", // 10 min
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 600000).toUTCString(), // 10 min from now
          },
        ],
      },
    ];

    return headers;
  },
  images: {
    domains: ["img.etimg.com"],
  },
};

export default nextConfig;
