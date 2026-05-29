"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { StaffNavProvider } from "./StaffNavContext";

const StaffNavDrawer = dynamic(
  () => import("./StaffNavDrawer").then((m) => ({ default: m.StaffNavDrawer })),
  { ssr: false }
);

const AUTH_PATHS = ["/staff/login", "/staff/forgot-password", "/staff/reset-password"];

export function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.some((p) => pathname?.startsWith(p));

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <StaffNavProvider>
      <div className="staff-app min-h-screen flex flex-col bg-brand-blush">
        <StaffNavDrawer />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </StaffNavProvider>
  );
}
