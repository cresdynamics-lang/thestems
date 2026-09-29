"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const MetaPixel = dynamic(() => import("@/components/MetaPixel"), {
  ssr: false,
  loading: () => null,
});

export default function ClientMetaPixel() {
  const pathname = usePathname();
  const isPrivate =
    pathname?.startsWith("/staff") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/api");

  if (isPrivate) return null;

  return <MetaPixel />;
}
