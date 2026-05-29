"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyWhatsAppButton from "@/components/LazyWhatsAppButton";

/** Store header/footer only — staff admin is full-screen without shop chrome */
export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStaffOrAdmin =
    pathname?.startsWith("/staff") || pathname?.startsWith("/admin");

  if (isStaffOrAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <LazyWhatsAppButton />
    </>
  );
}
