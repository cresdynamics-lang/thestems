import { NextResponse } from "next/server";
import {
  FALLBACK_RATES_FROM_KES,
  type CurrencyRates,
  type DisplayCurrency,
} from "@/lib/currency";

export const revalidate = 3600;

async function fetchRatesFromCdn(): Promise<CurrencyRates | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/kes.json",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { date?: string; kes?: Record<string, number> };
    const kes = data.kes || {};
    const rates: Record<DisplayCurrency, number> = {
      KES: 1,
      USD: Number(kes.usd) || FALLBACK_RATES_FROM_KES.USD,
      GBP: Number(kes.gbp) || FALLBACK_RATES_FROM_KES.GBP,
      EUR: Number(kes.eur) || FALLBACK_RATES_FROM_KES.EUR,
    };
    return {
      base: "KES",
      rates,
      fetchedAt: data.date ? `${data.date}T00:00:00.000Z` : new Date().toISOString(),
      source: "fawazahmed0/currency-api",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const live = await fetchRatesFromCdn();
  const payload: CurrencyRates =
    live ||
    ({
      base: "KES",
      rates: { ...FALLBACK_RATES_FROM_KES },
      fetchedAt: new Date().toISOString(),
      source: "fallback",
    } satisfies CurrencyRates);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export async function POST() {
  return GET();
}
