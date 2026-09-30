"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/lib/store/currency";
import type { CurrencyRates } from "@/lib/currency";

/**
 * Loads live FX rates for optional display conversion.
 * Default shop currency stays KES — no geo/locale auto-switch.
 * Users can still change currency manually via PriceDisplay / CurrencySwitcher (desktop).
 */
export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const setRates = useCurrencyStore((s) => s.setRates);
  const setGeo = useCurrencyStore((s) => s.setGeo);

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

    async function loadGeoCountryOnly() {
      try {
        const res = await fetch("/api/currency/geo", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { country: string | null };
        if (!cancelled && data.country) setGeo(data.country);
      } catch {
        // ignore
      }
    }

    loadRates();
    loadGeoCountryOnly();

    return () => {
      cancelled = true;
    };
  }, [setRates, setGeo]);

  return <>{children}</>;
}
