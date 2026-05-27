"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffPage } from "@/components/staff/StaffPage";
import { HeroManager } from "@/components/content/HeroManager";
import { getStaffToken } from "@/lib/staff/api-client";

export default function StaffBannersPage() {
  const router = useRouter();

  return (
    <StaffPage
      title="Homepage banners"
      description="Update the hero carousel and promotional slides"
      actions={
        <Link href="/staff/content" className="staff-btn staff-btn-outline text-sm">
          ← Content
        </Link>
      }
    >
      <HeroManager
        getToken={getStaffToken}
        onUnauthorized={() => router.replace("/staff/login")}
        showPageHeader={false}
      />
    </StaffPage>
  );
}
