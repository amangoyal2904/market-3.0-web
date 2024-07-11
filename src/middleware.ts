import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathAndQuery = url.pathname + url.search;
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

  // Check for vary headers appended
  const varyKeys = [
    "RSC",
    "Next-Router-State-Tree",
    "Next-Router-Prefetch",
    "Accept-Encoding",
  ];

  let varyFound = false;

  // Remove these headers from the URL
  for (const key of varyKeys) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      varyFound = true;
    }
  }

  if (varyFound) {
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // exclude api, images & static paths (_next/static & _next/image)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
