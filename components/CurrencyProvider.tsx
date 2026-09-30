"use client";

import { useEffect } from "react";
import {
  detectCurrencyFromBrowser,
  useCurrencyStore,
} from "@/lib/store/currency";
import type { CurrencyRates, DisplayCurrency } from "@/lib/currency";

/**
 * Loads live FX rates + geolocation currency default once per session.
 * Manual currency choice always wins over geo/locale.
 */
export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const setRates = useCurrencyStore((s) => s.setRates);
  const setGeo = useCurrencyStore((s) => s.setGeo);
  const applyDetectedCurrency = useCurrencyStore((s) => s.applyDetectedCurrency);
  const manualOverride = useCurrencyStore((s) => s.manualOverride);
  const hydrated = useCurrencyStore((s) => s.hydrated);

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      try {
        const res = await fetch("/api/currency/rates", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as CurrencyRates;
        if (!cancelled) setRates(data);
      } catch {
        // keep fallback rates
      }
    }

    async function loadGeo() {
      if (manualOverride) return;
      try {
        const res = await fetch("/api/currency/geo", { cache: "no-store" });
        if (!res.ok) {
          const { currency, source } = detectCurrencyFromBrowser();
          if (!cancelled) applyDetectedCurrency(currency, source);
          return;
        }
        const data = (await res.json()) as {
          country: string | null;
          currency: DisplayCurrency;
          source: string;
        };
        if (cancelled) return;
        if (data.country) setGeo(data.country);
        if (data.country) {
          applyDetectedCurrency(data.currency, "geolocation");
        } else {
          const { currency, source } = detectCurrencyFromBrowser();
          applyDetectedCurrency(currency, source);
        }
      } catch {
        const { currency, source } = detectCurrencyFromBrowser();
        if (!cancelled) applyDetectedCurrency(currency, source);
      }
    }

    loadRates();
    if (hydrated) {
      loadGeo();
    } else {
      // Wait briefly for persist rehydrate so we don't overwrite a saved manual choice
      const t = setTimeout(() => {
        const state = useCurrencyStore.getState();
        if (!state.manualOverride) loadGeo();
      }, 80);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [hydrated, manualOverride, setRates, setGeo, applyDetectedCurrency]);

  return <>{children}</>;
}
