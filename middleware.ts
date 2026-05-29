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

  const pathname = request.nextUrl.pathname;

  // Legacy admin content URLs → staff panel
  if (pathname === "/admin/blogs" || pathname === "/staff/content/blog") {
    return NextResponse.redirect(new URL("/staff/blogs", request.url));
  }
  if (pathname === "/admin/hero") {
    return NextResponse.redirect(new URL("/staff/content/banners", request.url));
  }
  if (pathname === "/admin/live-visitors") {
    return NextResponse.redirect(new URL("/staff/live-visitors", request.url));
  }
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/staff", request.url));
  }
  if (pathname === "/admin/login") {
    const next = request.nextUrl.searchParams.get("next");
    const url = new URL("/staff/login", request.url);
    if (next && (next.startsWith("/staff") || next.startsWith("/admin"))) {
      url.searchParams.set("next", next);
    }
    return NextResponse.redirect(url);
  }

  // Legacy admin panel → staff (faster, unified panel)
  if (pathname === "/admin/orders" || pathname.startsWith("/admin/orders/")) {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/admin/, "/staff"), request.url)
    );
  }
  if (pathname === "/admin/products" || pathname.startsWith("/admin/products/")) {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/admin/, "/staff"), request.url)
    );
  }

  // Staff auth is handled client-side (StaffAuthGuard) and on /api/staff/* routes.
  // Do not redirect here — httpOnly cookie timing caused login → blog redirect loops.

  const response = NextResponse.next();

  if (pathname.startsWith("/staff")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  } else if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=600"
    );
  }

  // Add CORS headers for Chrome compatibility (only for API routes)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
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

