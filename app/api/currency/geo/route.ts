import { NextRequest, NextResponse } from "next/server";
import { currencyFromCountry, type DisplayCurrency } from "@/lib/currency";

/**
 * Infer visitor country for currency defaults.
 * Prefers edge headers; falls back to ipapi.co when available.
 */
export async function GET(request: NextRequest) {
  const headerCountry =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    request.headers.get("cloudfront-viewer-country");

  let country = headerCountry && headerCountry !== "XX" ? headerCountry.toUpperCase() : null;
  let source = country ? "header" : "unknown";

  if (!country) {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "";
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country_code/`, {
          signal: AbortSignal.timeout(2500),
        });
        if (res.ok) {
          const text = (await res.text()).trim().toUpperCase();
          if (/^[A-Z]{2}$/.test(text)) {
            country = text;
            source = "ipapi";
          }
        }
      } catch {
        // ignore — fall through
      }
    }
  }

  const currency: DisplayCurrency = currencyFromCountry(country);
  return NextResponse.json({
    country,
    currency,
    source,
    detectedAt: new Date().toISOString(),
  });
}
