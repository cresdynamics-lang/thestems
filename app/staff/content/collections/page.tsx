"use client";

import Link from "next/link";
import { StaffPage } from "@/components/staff/StaffPage";
import { HomepageSectionsManager } from "@/components/content/HomepageSectionsManager";

export default function CollectionsPage() {
  return (
    <StaffPage
      title="Homepage collections"
      description="Featured product sections on the shop homepage"
      actions={
        <Link href="/staff/content" className="staff-btn staff-btn-outline text-sm">
          ← Content
        </Link>
      }
    >
      <HomepageSectionsManager />
    </StaffPage>
  );
}
