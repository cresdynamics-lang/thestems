import type { Metadata } from "next";
import { StaffAuthGuard } from "@/components/staff/StaffAuthGuard";
import { StaffShell } from "@/components/staff/StaffShell";
import { STAFF_BRAND } from "@/lib/staff/constants";
import "./staff.css";

export const metadata: Metadata = {
  title: `Staff | ${STAFF_BRAND.name}`,
  robots: { index: false, follow: false },
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffAuthGuard>
      <StaffShell>{children}</StaffShell>
    </StaffAuthGuard>
  );
}
