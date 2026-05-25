"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStaffToken } from "@/lib/staff/api-client";

/** Blog management uses the existing admin UI with staff auth on uploads */
export default function StaffBlogRedirect() {
  const router = useRouter();
  useEffect(() => {
    const token = getStaffToken();
    if (token) {
      localStorage.setItem("admin_token", token);
    }
    router.replace("/admin/blogs");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-brand-gray-600">
      Opening blog manager…
    </div>
  );
}
