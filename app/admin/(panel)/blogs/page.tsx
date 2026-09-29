"use client";

import { useRouter } from "next/navigation";
import { BlogManager } from "@/components/content/BlogManager";
import { getAdminToken } from "@/lib/admin/session";

/** Admin blog manager — SEO-focused create/edit against local Postgres */
export default function AdminBlogsPage() {
  const router = useRouter();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <BlogManager
        apiBase="/api/admin"
        getToken={getAdminToken}
        onUnauthorized={() => router.replace("/admin/login?next=/admin/blogs")}
        backHref="/admin"
        backLabel="← Admin"
        showPageHeader
      />
    </div>
  );
}
