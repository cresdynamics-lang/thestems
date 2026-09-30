"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  CURRENCY_META,
  DISPLAY_CURRENCIES,
  formatDisplayAmount,
  type DisplayCurrency,
} from "@/lib/currency";
import { useCurrencyStore } from "@/lib/store/currency";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type PriceDisplayProps = {
  /** Amount in KES cents */
  amountCents: number;
  className?: string;
  /** Show interactive currency switcher (default true) */
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  showCodeHint?: boolean;
};

const sizeClass = {
  sm: "text-sm sm:text-base",
  md: "text-[15px] sm:text-[17px] md:text-[19px]",
  lg: "text-2xl md:text-3xl",
};

export default function PriceDisplay({
  amountCents,
  className = "",
  interactive = true,
  size = "md",
  showCodeHint = false,
}: PriceDisplayProps) {
  const currency = useCurrencyStore((s) => s.currency);
  const rates = useCurrencyStore((s) => s.rates);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const formatted = formatDisplayAmount(amountCents, currency, rates);
  const meta = CURRENCY_META[currency];

  if (!interactive) {
    return (
      <span className={`font-price font-bold tabular-nums tracking-tight text-brand-rose-deep ${sizeClass[size]} ${className}`}>
        {formatted}
        {showCodeHint && currency !== "KES" ? (
          <span className="ml-1 text-xs font-medium text-brand-gray-500">({meta.symbol})</span>
        ) : null}
      </span>
    );
  }

  return (
    <div ref={rootRef} className={`relative inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-0.5 rounded-md px-1 -mx-1 py-0.5 font-price font-bold tabular-nums tracking-tight text-brand-rose-deep hover:bg-brand-blush/80 transition-colors ${sizeClass[size]}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        title="Change display currency"
      >
        <span>{formatted}</span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-brand-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Display currency"
          className="absolute left-0 top-full z-40 mt-1 min-w-[9.5rem] overflow-hidden rounded-lg border border-brand-gray-200 bg-white py-1 shadow-lg"
        >
          {DISPLAY_CURRENCIES.map((code) => {
            const active = code === currency;
            const preview = formatDisplayAmount(amountCents, code, rates);
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-brand-blush text-brand-gray-900"
                      : "text-brand-gray-800 hover:bg-brand-gray-50"
                  }`}
                  onClick={() => {
                    setCurrency(code, "manual");
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{code}</span>
                  <span className="tabular-nums text-brand-gray-600 text-xs">{preview}</span>
                </button>
              </li>
            );
          })}
          <li className="border-t border-brand-gray-100 px-3 py-1.5 text-[10px] text-brand-gray-500 leading-snug">
            Prices charged in KES at checkout
          </li>
        </ul>
      )}
    </div>
  );
}

/** Compact header/nav currency selector (no amount) */
export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const geoCountry = useCurrencyStore((s) => s.geoCountry);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md border border-brand-gray-200 bg-white px-2 py-1 text-xs font-semibold text-brand-gray-800 hover:border-brand-green hover:text-brand-green"
        aria-label="Select currency"
        title={geoCountry ? `Detected region: ${geoCountry}` : "Select currency"}
      >
        {currency}
        <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-50 mt-1 min-w-[7rem] rounded-lg border border-brand-gray-200 bg-white py-1 shadow-lg">
          {DISPLAY_CURRENCIES.map((code) => (
            <li key={code}>
              <button
                type="button"
                className={`block w-full px-3 py-1.5 text-left text-sm ${
                  code === currency ? "bg-brand-blush font-semibold" : "hover:bg-brand-gray-50"
                }`}
                onClick={() => {
                  setCurrency(code, "manual");
                  setOpen(false);
                }}
              >
                {code} · {CURRENCY_META[code].symbol}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
