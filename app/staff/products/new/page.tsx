"use client";

import { useRouter } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { ProductEditor } from "@/components/staff/ProductEditor";
import { staffFetch } from "@/lib/staff/api-client";
import { invalidateStaffCache } from "@/lib/staff/staff-cache";

export default function NewProductPage() {
  const router = useRouter();

  async function save(payload: Record<string, unknown>) {
    await staffFetch("/api/staff/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    invalidateStaffCache("/api/staff/products");
    router.push("/staff/products");
  }

  return (
    <>
      <StaffHeader title="Add product" />
      <main className="flex-1 p-4 sm:p-6 max-w-2xl">
        <ProductEditor onSave={save} />
      </main>
    </>
  );
}
