"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DISPLAY_CURRENCIES,
  FALLBACK_RATES_FROM_KES,
  currencyFromCountry,
  currencyFromLocale,
  type CurrencyPreferenceSource,
  type CurrencyRates,
  type DisplayCurrency,
} from "@/lib/currency";

type CurrencyStore = {
  currency: DisplayCurrency;
  rates: Record<DisplayCurrency, number>;
  ratesFetchedAt: string | null;
  ratesSource: string;
  preferenceSource: CurrencyPreferenceSource;
  manualOverride: boolean;
  geoCountry: string | null;
  geoDetectedAt: string | null;
  hydrated: boolean;
  setCurrency: (code: DisplayCurrency, source?: CurrencyPreferenceSource) => void;
  setRates: (payload: CurrencyRates) => void;
  setGeo: (country: string | null) => void;
  applyDetectedCurrency: (code: DisplayCurrency, source: CurrencyPreferenceSource) => void;
  setHydrated: (v: boolean) => void;
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: "KES",
      rates: { ...FALLBACK_RATES_FROM_KES },
      ratesFetchedAt: null,
      ratesSource: "fallback",
      preferenceSource: "default",
      manualOverride: false,
      geoCountry: null,
      geoDetectedAt: null,
      hydrated: false,
      setCurrency: (code, source = "manual") => {
        if (!DISPLAY_CURRENCIES.includes(code)) return;
        set({
          currency: code,
          preferenceSource: source,
          manualOverride: source === "manual",
        });
      },
      setRates: (payload) =>
        set({
          rates: payload.rates,
          ratesFetchedAt: payload.fetchedAt,
          ratesSource: payload.source,
        }),
      setGeo: (country) =>
        set({
          geoCountry: country,
          geoDetectedAt: country ? new Date().toISOString() : get().geoDetectedAt,
        }),
      applyDetectedCurrency: (code, source) => {
        if (get().manualOverride) return;
        set({ currency: code, preferenceSource: source });
      },
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "the-stems-currency",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currency: s.currency,
        manualOverride: s.manualOverride,
        preferenceSource: s.preferenceSource,
        geoCountry: s.geoCountry,
        geoDetectedAt: s.geoDetectedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.manualOverride) {
          state.currency = "KES";
          state.preferenceSource = "default";
        }
        state?.setHydrated(true);
      },
    }
  )
);

export function detectCurrencyFromBrowser(): {
  currency: DisplayCurrency;
  source: CurrencyPreferenceSource;
} {
  if (typeof navigator === "undefined") {
    return { currency: "KES", source: "default" };
  }
  const locale = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage;
  return { currency: currencyFromLocale(locale), source: "locale" };
}

export { currencyFromCountry };
