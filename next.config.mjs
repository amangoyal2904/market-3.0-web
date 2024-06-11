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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=()",
          },
        ],
      },
      {
        source: "/marketsweb/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
        ],
      },
      {
        source: "/markets/live-coverage",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, must-revalidate", // 5 min
          },
        ],
      },
      {
        source: "/markets/stock-market-mood",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1200, must-revalidate", // 20 min
          },
        ],
      },
      {
        source: "/watchlist",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1200, must-revalidate", // 20 min
          },
        ],
      },
      {
        source: "/stocks/marketstats(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1200, must-revalidate", // 20 min
          },
        ],
      },
      {
        source: "/markets/indices(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=900, must-revalidate", // 15 min
          },
        ],
      },
      {
        source: "/markets/stock-recos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=900, must-revalidate", // 15 min
          },
        ],
      },
      {
        source: "/markets/stock-screener(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=600, must-revalidate", // 10 min
          },
        ],
      },
      {
        source: "/markets/top-india-investors-portfolio/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=600, must-revalidate", // 10 min
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
