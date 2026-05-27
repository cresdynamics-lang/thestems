"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { StaffPage } from "@/components/staff/StaffPage";

const LiveVisitorsPanel = dynamic(
  () =>
    import("@/components/staff/LiveVisitorsPanel").then((m) => ({
      default: m.LiveVisitorsPanel,
    })),
  {
    loading: () => (
      <p className="text-sm text-[var(--staff-muted)] py-4">Loading live feed…</p>
    ),
    ssr: false,
  }
);

export default function StaffLiveVisitorsPage() {
  return (
    <StaffPage
      title="Live visitors"
      description="Real-time shop activity from the last 5 minutes"
      actions={
        <Link href="/" target="_blank" className="staff-btn staff-btn-outline text-sm">
          Open shop ↗
        </Link>
      }
    >
      <LiveVisitorsPanel />
    </StaffPage>
  );
}
