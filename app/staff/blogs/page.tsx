"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffPage } from "@/components/staff/StaffPage";
import { BlogManager } from "@/components/content/BlogManager";
import { getStaffToken } from "@/lib/staff/api-client";

/** Primary staff blog manager (use this URL — not /staff/content/blog) */
export default function StaffBlogsPage() {
  const router = useRouter();

  return (
    <StaffPage
      title="Blog posts"
      description="Write posts, set SEO, and upload featured images"
      actions={
        <Link href="/staff/content" className="staff-btn staff-btn-outline text-sm">
          ← Content
        </Link>
      }
    >
      <BlogManager
        apiBase="/api/staff"
        getToken={getStaffToken}
        onUnauthorized={() => router.replace("/staff/login?next=/staff/blogs")}
        showPageHeader={false}
      />
    </StaffPage>
  );
}
