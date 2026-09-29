"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown> & {
      onLoad?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      customStyle?: {
        visibility?: {
          desktop?: { position?: string; xOffset?: number; yOffset?: number };
          mobile?: { position?: string; xOffset?: number; yOffset?: number };
        };
      };
    };
    Tawk_LoadStart?: Date;
  }
}

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "";
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "";

/**
 * Tawk.to live chat — pinned bottom-left so WhatsApp can stay bottom-right.
 * Owner gets push notifications on the Tawk mobile app when visitors message.
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
    // bl = bottom-left (WhatsApp button stays bottom-right)
    window.Tawk_API.customStyle = {
      visibility: {
        desktop: { position: "bl", xOffset: 24, yOffset: 24 },
        mobile: { position: "bl", xOffset: 16, yOffset: 16 },
      },
    };

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, [isPrivate]);

  if (isPrivate || !PROPERTY_ID || !WIDGET_ID) return null;
  return null;
}
