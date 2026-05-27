"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@/lib/analytics";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/staff") || pathname.startsWith("/admin")) {
      return;
    }
    Analytics.trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/staff") || pathname.startsWith("/admin")) {
      return;
    }
    const tick = () => Analytics.trackHeartbeat(pathname);
    tick();
    const interval = setInterval(tick, 15_000);
    return () => clearInterval(interval);
  }, [pathname]);

  return <>{children}</>;
}

