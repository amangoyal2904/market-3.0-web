import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const searchparam = url.search;
  const pathAndQuery = url.pathname + searchparam;
  const origin = url.origin;
  const pathname = url.pathname;

  // Create a new Headers object and copy existing headers
  const requestHeaders = new Headers();
  request.headers.forEach((value, key) => {
    requestHeaders.set(key, value);
  });

  // Add custom headers
  requestHeaders.set("x-url", pathAndQuery);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-searchparam", searchparam);

  // Create the initial response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  if (pathname === "/health") {
    return new NextResponse("OK!", {
      status: 200,
    });
  }
  // Set cache control headers based on the request path
  if (pathname.startsWith("/marketsweb/_next/static/chunks")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, s-maxage=31536000, immutable",
    );
  } else if (pathname.startsWith("/marketsweb/static/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, s-maxage=31536000, must-revalidate, stale-while-revalidate=604800",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 31536000000).toUTCString(),
    );
  } else if (pathname === "/markets/live-coverage") {
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=300, must-revalidate, stale-while-revalidate=600",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 300000).toUTCString(),
    );
  } else if (
    pathname === "/markets/stock-market-mood" ||
    pathname === "/watchlist"
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=1200, s-maxage=1200, must-revalidate, stale-while-revalidate=2400",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 1200000).toUTCString(),
    );
  } else if (pathname.startsWith("/stocks/marketstats")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=1200, s-maxage=1200, must-revalidate, stale-while-revalidate=2400",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 1200000).toUTCString(),
    );
  } else if (pathname === "/markets/indices") {
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=300, must-revalidate, stale-while-revalidate=600",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 300000).toUTCString(),
    );
  } else if (pathname.startsWith("/markets/indices/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=900, s-maxage=900, must-revalidate, stale-while-revalidate=1800",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 900000).toUTCString(),
    );
  } else if (pathname.startsWith("/markets/stock-recos/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=900, s-maxage=900, must-revalidate, stale-while-revalidate=1800",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 900000).toUTCString(),
    );
  } else if (pathname.startsWith("/markets/stock-screener")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=600, s-maxage=600, must-revalidate, stale-while-revalidate=1200",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 600000).toUTCString(),
    );
  } else if (pathname.startsWith("/markets/top-india-investors-portfolio/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=600, s-maxage=600, must-revalidate, stale-while-revalidate=1200",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 600000).toUTCString(),
    );
  } else if (
    pathname === "/markets/fii-dii-activity" ||
    pathname.startsWith("/markets/fii-dii-activity/")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=10800, s-maxage=10800, must-revalidate, stale-while-revalidate=21600",
    );
    response.headers.set(
      "Expires",
      new Date(Date.now() + 10800000).toUTCString(),
    );
  }

  return response;
}
