"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown> & {
      onLoad?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "";
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "";

/**
 * Tawk.to live chat — owner gets push notifications on the Tawk mobile app
 * when visitors message. Set NEXT_PUBLIC_TAWK_PROPERTY_ID + NEXT_PUBLIC_TAWK_WIDGET_ID.
 */
export default function TawkToChat() {
  const pathname = usePathname();
  const isPrivate =
    pathname?.startsWith("/staff") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/api");

  useEffect(() => {
    if (isPrivate || !PROPERTY_ID || !WIDGET_ID) return;
    if (typeof window === "undefined") return;
    if (document.getElementById("tawk-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      // Keep widget across client navigations; only remove on full unmount of storefront
    };
  }, [isPrivate]);

  if (isPrivate || !PROPERTY_ID || !WIDGET_ID) return null;
  return null;
}
