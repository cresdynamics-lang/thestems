"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), {
  ssr: false,
  loading: () => null,
});

export default function ClientGoogleAnalytics() {
  const pathname = usePathname();
  const isPrivate =
    pathname?.startsWith("/staff") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/api");

  if (isPrivate) return null;

  return <GoogleAnalytics />;
}
