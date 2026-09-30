import { SITE_URL } from "@/lib/seo";
import {
  buildOrderCurrencyNotes,
  kesCentsToDisplay,
  type CurrencySnapshot,
  type DisplayCurrency,
  type OrderLineCurrencyDetail,
  type CurrencyPreferenceSource,
} from "@/lib/currency";

export type CheckoutLineInput = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  slug?: string;
  image?: string;
  options?: Record<string, string>;
};

export type BuildCurrencyOrderPayloadInput = {
  items: CheckoutLineInput[];
  subtotalKesCents: number;
  deliveryKesCents: number;
  tipKesCents: number;
  totalKesCents: number;
  currency: DisplayCurrency;
  rates: Record<DisplayCurrency, number>;
  ratesFetchedAt: string | null;
  ratesSource: string;
  preferenceSource: CurrencyPreferenceSource;
  geoCountry: string | null;
  geoDetectedAt: string | null;
  paymentNote?: string;
};

export function buildCurrencyOrderPayload(input: BuildCurrencyOrderPayloadInput) {
  const selectedAt = new Date().toISOString();
  const rate = input.rates[input.currency] ?? 1;

  const lines: OrderLineCurrencyDetail[] = input.items.map((item) => {
    const unit = item.price;
    const line = unit * item.quantity;
    return {
      productId: item.id,
      name: item.name,
      slug: item.slug,
      productUrl: item.slug ? `${SITE_URL}/product/${item.slug}` : undefined,
      quantity: item.quantity,
      unit_price_kes_cents: unit,
      line_total_kes_cents: line,
      unit_price_display: kesCentsToDisplay(unit, input.currency, input.rates),
      line_total_display: kesCentsToDisplay(line, input.currency, input.rates),
      display_currency: input.currency,
    };
  });

  const snapshot: CurrencySnapshot = {
    code: input.currency,
    rate_from_kes: rate,
    rates_fetched_at: input.ratesFetchedAt || selectedAt,
    rates_source: input.ratesSource || "fallback",
    preference_source: input.preferenceSource,
    selected_at: selectedAt,
    geo_country: input.geoCountry,
    geo_detected_at: input.geoDetectedAt,
    display: {
      subtotal: kesCentsToDisplay(input.subtotalKesCents, input.currency, input.rates),
      delivery: kesCentsToDisplay(input.deliveryKesCents, input.currency, input.rates),
      tip: kesCentsToDisplay(input.tipKesCents, input.currency, input.rates),
      total: kesCentsToDisplay(input.totalKesCents, input.currency, input.rates),
    },
    kes: {
      subtotal: input.subtotalKesCents,
      delivery: input.deliveryKesCents,
      tip: input.tipKesCents,
      total: input.totalKesCents,
    },
  };

  const enrichedItems = input.items.map((item, idx) => {
    const detail = lines[idx];
    return {
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      slug: item.slug,
      options: {
        ...(item.options || {}),
        product_url: detail.productUrl || "",
        display_currency: input.currency,
        unit_display: String(detail.unit_price_display),
        line_display: String(detail.line_total_display),
        currency_selected_at: selectedAt,
      },
    };
  });

  const currencyNotes = buildOrderCurrencyNotes(snapshot, lines);
  const notes = [input.paymentNote, currencyNotes].filter(Boolean).join("\n\n");

  return {
    snapshot,
    lines,
    items: enrichedItems,
    notes,
    currency_meta: snapshot,
  };
}
