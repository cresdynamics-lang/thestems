import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") || "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttp = forwardedProto ? forwardedProto !== "https" : request.nextUrl.protocol === "http:";
  const canonicalHost = "thestemsflowers.co.ke";
  const isCanonicalHost = host === canonicalHost;
  const isWwwHost = host === `www.${canonicalHost}`;
  const isCanonicalVariant = isCanonicalHost || isWwwHost;

  // Force one canonical origin for SEO signal consolidation.
  if (isCanonicalVariant && (!isCanonicalHost || isHttp)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https:";
    redirectUrl.host = canonicalHost;
    return NextResponse.redirect(redirectUrl, 301);
  }

  const response = NextResponse.next();

  // Add CORS headers for Chrome compatibility (only for API routes)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  // Cache static assets aggressively
  if (
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/images/") ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)$/i)
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // Cache API responses for products (short cache)
  if (request.nextUrl.pathname.startsWith("/api/products")) {
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

