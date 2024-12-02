import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname, origin, search: searchParam } = url;

  // List of paths where dynamic segments like page-<number> or .cms are invalid
  const invalidPaths = ["/screens/scrid-"];

  // Construct custom headers
  const customHeaders = {
    "x-url": pathname + searchParam,
    "x-origin": origin,
    "x-pathname": pathname,
    "x-searchparam": searchParam,
  };

  // Create new headers object and add custom headers
  const requestHeaders = new Headers(request.headers);
  Object.entries(customHeaders).forEach(([key, value]) =>
    requestHeaders.set(key, value),
  );

  // Cache control configurations (unchanged)
  const cacheControlConfig = [
    {
      paths: ["/marketsweb/_next/static/chunks"],
      cacheControl: "public, max-age=31536000, s-maxage=31536000, immutable",
      expires: 31536000000,
    },
    {
      paths: ["/marketsweb/static/"],
      cacheControl:
        "public, max-age=31536000, s-maxage=31536000, must-revalidate, stale-while-revalidate=604800",
      expires: 31536000000,
    },
    {
      paths: [
        "/markets/stock-market-mood",
        "/watchlist",
        "/stocks/marketstats",
      ],
      cacheControl:
        "public, max-age=1200, s-maxage=1200, must-revalidate, stale-while-revalidate=2400",
      expires: 1200000,
    },
    {
      paths: ["/markets/indices", "/markets/live-coverage"],
      cacheControl:
        "public, max-age=300, s-maxage=300, must-revalidate, stale-while-revalidate=600",
      expires: 300000,
    },
    {
      paths: ["/markets/stock-recos/", "/markets/indices/"],
      cacheControl:
        "public, max-age=900, s-maxage=900, must-revalidate, stale-while-revalidate=1800",
      expires: 900000,
    },
    {
      paths: [
        "/markets/stock-screener",
        "/markets/top-india-investors-portfolio/",
      ],
      cacheControl:
        "public, max-age=600, s-maxage=600, must-revalidate, stale-while-revalidate=1200",
      expires: 600000,
    },
    {
      paths: [
        "/markets/fii-dii-activity",
        "/markets/fii-dii-activity/",
        "/markets/corporate-actions",
        "/markets/corporate-announcements",
        "/stocks/sectors",
        "/markets/etlearn",
      ],
      cacheControl:
        "public, max-age=10800, s-maxage=10800, must-revalidate, stale-while-revalidate=21600",
      expires: 10800000,
    },
  ];

  // Redirect for invalid URLs if the pathname contains /markets/stock-screener/ or /screens/scrid-
  const invalidUrlRegex = /page-\d+|\.cms$/;
  if (
    invalidPaths.some((path) => pathname.includes(path)) &&
    invalidUrlRegex.test(pathname)
  ) {
    // Remove 'page-<number>' or '.cms' from the URL
    const validUrl = pathname.replace(/,?page-\d+|,?\.cms$/, "");
    const redirectUrl = `${origin}${validUrl}${searchParam}`;
    return NextResponse.redirect(redirectUrl, 301); // Permanent redirect
  }

  // Find matching cache control settings
  const matchedConfig = cacheControlConfig.find(({ paths }) =>
    paths.some((path) => pathname.startsWith(path)),
  );

  // Create response with cache control headers if matched
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (matchedConfig) {
    response.headers.set("Cache-Control", matchedConfig.cacheControl);
    response.headers.set(
      "Expires",
      new Date(Date.now() + matchedConfig.expires).toUTCString(),
    );
  }

  return response;
}
