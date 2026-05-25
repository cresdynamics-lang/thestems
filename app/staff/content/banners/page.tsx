"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStaffToken } from "@/lib/staff/api-client";

export default function StaffBannersRedirect() {
  const router = useRouter();
  useEffect(() => {
    const token = getStaffToken();
    if (token) {
      localStorage.setItem("admin_token", token);
    }
    router.replace("/admin/hero");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-brand-gray-600">
      Opening banner manager…
    </div>
  );
}
