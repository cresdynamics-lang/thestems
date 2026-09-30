/**
 * Multi-currency display helpers.
 * Catalogue prices are always stored in KES cents. Display converts for UX;
 * checkout / Pesapal / M-Pesa remain charged in KES.
 */

export type DisplayCurrency = "KES" | "USD" | "GBP" | "EUR";

export const DISPLAY_CURRENCIES: DisplayCurrency[] = ["KES", "USD", "GBP", "EUR"];

export const CURRENCY_META: Record<
  DisplayCurrency,
  { label: string; symbol: string; locale: string }
> = {
  KES: { label: "Kenyan Shilling", symbol: "KSh", locale: "en-KE" },
  USD: { label: "US Dollar", symbol: "$", locale: "en-US" },
  GBP: { label: "British Pound", symbol: "£", locale: "en-GB" },
  EUR: { label: "Euro", symbol: "€", locale: "en-IE" },
};

/** Approx fallback: 1 KES → foreign (updated periodically via API) */
export const FALLBACK_RATES_FROM_KES: Record<DisplayCurrency, number> = {
  KES: 1,
  USD: 0.00775,
  GBP: 0.0061,
  EUR: 0.00715,
};

/** Country ISO2 → preferred display currency */
export const COUNTRY_CURRENCY: Record<string, DisplayCurrency> = {
  KE: "KES",
  US: "USD",
  GB: "GBP",
  UK: "GBP",
  IE: "EUR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  CA: "USD",
  AU: "USD",
  NZ: "USD",
  ZA: "USD",
  UG: "KES",
  TZ: "KES",
  RW: "KES",
};

export type CurrencyRates = {
  base: "KES";
  rates: Record<DisplayCurrency, number>;
  fetchedAt: string;
  source: string;
};

export type CurrencyPreferenceSource =
  | "manual"
  | "geolocation"
  | "locale"
  | "default";

export type CurrencySnapshot = {
  code: DisplayCurrency;
  rate_from_kes: number;
  rates_fetched_at: string;
  rates_source: string;
  preference_source: CurrencyPreferenceSource;
  selected_at: string;
  geo_country: string | null;
  geo_detected_at: string | null;
  /** Amounts in display currency major units (not cents) */
  display: {
    subtotal: number;
    delivery: number;
    tip: number;
    total: number;
  };
  /** Amounts in KES cents (charge currency) */
  kes: {
    subtotal: number;
    delivery: number;
    tip: number;
    total: number;
  };
};

export type OrderLineCurrencyDetail = {
  productId: string;
  name: string;
  slug?: string;
  productUrl?: string;
  quantity: number;
  unit_price_kes_cents: number;
  line_total_kes_cents: number;
  unit_price_display: number;
  line_total_display: number;
  display_currency: DisplayCurrency;
};

export function currencyFromLocale(locale?: string | null): DisplayCurrency {
  if (!locale) return "KES";
  const lower = locale.toLowerCase();
  if (lower.includes("GB") || lower.startsWith("en-gb")) return "GBP";
  if (
    lower.includes("-us") ||
    lower.startsWith("en-us") ||
    lower.includes("-ca") ||
    lower.includes("-au")
  ) {
    return "USD";
  }
  if (
    lower.startsWith("de") ||
    lower.startsWith("fr") ||
    lower.startsWith("es") ||
    lower.startsWith("it") ||
    lower.startsWith("nl") ||
    lower.includes("-ie") ||
    lower.includes("eu")
  ) {
    return "EUR";
  }
  if (lower.includes("-ke") || lower.startsWith("sw")) return "KES";
  return "KES";
}

export function currencyFromCountry(countryCode?: string | null): DisplayCurrency {
  if (!countryCode) return "KES";
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] || "USD";
}

/** Convert KES cents → major units in target currency */
export function kesCentsToDisplay(
  kesCents: number,
  currency: DisplayCurrency,
  rates: Record<DisplayCurrency, number>
): number {
  const rate = rates[currency] ?? FALLBACK_RATES_FROM_KES[currency];
  return (kesCents / 100) * rate;
}

export function formatDisplayAmount(
  kesCents: number,
  currency: DisplayCurrency,
  rates: Record<DisplayCurrency, number>
): string {
  const major = kesCentsToDisplay(kesCents, currency, rates);
  const meta = CURRENCY_META[currency];
  if (currency === "KES") {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(major);
  }
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major);
}

export function formatMajor(amountMajor: number, currency: DisplayCurrency): string {
  const meta = CURRENCY_META[currency];
  if (currency === "KES") {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountMajor);
  }
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMajor);
}

export function buildOrderCurrencyNotes(snapshot: CurrencySnapshot, lines: OrderLineCurrencyDetail[]): string {
  const linesText = lines
    .map((l, i) => {
      const url = l.productUrl || (l.slug ? `https://thestemsflowers.co.ke/product/${l.slug}` : "");
      return [
        `${i + 1}. ${l.name} × ${l.quantity}`,
        `   Unit: KES ${(l.unit_price_kes_cents / 100).toFixed(0)} (= ${formatMajor(l.unit_price_display, l.display_currency)})`,
        `   Line: KES ${(l.line_total_kes_cents / 100).toFixed(0)} (= ${formatMajor(l.line_total_display, l.display_currency)})`,
        url ? `   Link: ${url}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    "—— CURRENCY & ORDER BREAKDOWN ——",
    `Display currency: ${snapshot.code}`,
    `Preference: ${snapshot.preference_source}`,
    `Selected at: ${snapshot.selected_at}`,
    `Rate: 1 KES = ${snapshot.rate_from_kes} ${snapshot.code} (as of ${snapshot.rates_fetched_at}, ${snapshot.rates_source})`,
    snapshot.geo_country
      ? `Geo country: ${snapshot.geo_country} (detected ${snapshot.geo_detected_at || "—"})`
      : "Geo country: not detected",
    "",
    "Line items:",
    linesText || "(none)",
    "",
    `Subtotal: KES ${(snapshot.kes.subtotal / 100).toFixed(0)} ≈ ${formatMajor(snapshot.display.subtotal, snapshot.code)}`,
    `Delivery: KES ${(snapshot.kes.delivery / 100).toFixed(0)} ≈ ${formatMajor(snapshot.display.delivery, snapshot.code)}`,
    `Tip: KES ${(snapshot.kes.tip / 100).toFixed(0)} ≈ ${formatMajor(snapshot.display.tip, snapshot.code)}`,
    `TOTAL CHARGED (KES): KES ${(snapshot.kes.total / 100).toFixed(0)}`,
    `TOTAL DISPLAYED: ${formatMajor(snapshot.display.total, snapshot.code)}`,
    "Payment gateway charges in KES.",
    "—— END CURRENCY ——",
  ].join("\n");
}

export function parseCurrencyNotes(notes?: string | null): CurrencySnapshot | null {
  if (!notes || !notes.includes("CURRENCY & ORDER BREAKDOWN")) return null;
  try {
    const codeMatch = notes.match(/Display currency:\s*([A-Z]{3})/);
    const rateMatch = notes.match(/1 KES = ([0-9.]+)/);
    const selectedMatch = notes.match(/Selected at:\s*(.+)/);
    const geoMatch = notes.match(/Geo country:\s*([A-Z]{2}|not detected)/);
    const prefMatch = notes.match(/Preference:\s*(\w+)/);
    const totalKesMatch = notes.match(/TOTAL CHARGED \(KES\):\s*KES\s*([0-9.]+)/);
    if (!codeMatch) return null;
    const code = codeMatch[1] as DisplayCurrency;
    return {
      code,
      rate_from_kes: rateMatch ? Number(rateMatch[1]) : FALLBACK_RATES_FROM_KES[code],
      rates_fetched_at: "",
      rates_source: "notes",
      preference_source: (prefMatch?.[1] as CurrencyPreferenceSource) || "manual",
      selected_at: selectedMatch?.[1]?.trim() || "",
      geo_country: geoMatch && geoMatch[1] !== "not detected" ? geoMatch[1] : null,
      geo_detected_at: null,
      display: { subtotal: 0, delivery: 0, tip: 0, total: 0 },
      kes: {
        subtotal: 0,
        delivery: 0,
        tip: 0,
        total: totalKesMatch ? Math.round(Number(totalKesMatch[1]) * 100) : 0,
      },
    };
  } catch {
    return null;
  }
}
