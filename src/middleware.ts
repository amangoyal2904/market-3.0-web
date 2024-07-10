import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const url = new URL(request.url);
  const pathAndQuery = url.pathname + url.search;
  const origin = url.origin;
  const pathname = url.pathname;
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-url", pathAndQuery);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
