"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { ProductEditor, type ProductEditorValues } from "@/components/staff/ProductEditor";
import { staffFetch } from "@/lib/staff/api-client";
import { invalidateStaffCache } from "@/lib/staff/staff-cache";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductEditorValues | null>(null);

  useEffect(() => {
    if (id) staffFetch<ProductEditorValues>(`/api/staff/products/${id}`).then(setProduct);
  }, [id]);

  async function save(payload: Record<string, unknown>) {
    const updated = await staffFetch<ProductEditorValues>(`/api/staff/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    invalidateStaffCache("/api/staff/products");
    setProduct((current) => ({ ...current, visibility: updated.visibility }));
  }

  return (
    <>
      <StaffHeader title="Edit product" />
      <main className="flex-1 p-4 sm:p-6 max-w-2xl">
        {product?.slug && product.visibility !== "draft" ? (
          <Link
            href={`/product/${String(product.slug)}`}
            target="_blank"
            className="staff-btn staff-btn-outline text-sm mb-4 inline-block"
          >
            View on shop ↗
          </Link>
        ) : null}
        {product ? <ProductEditor initial={product} onSave={save} /> : <p className="text-sm">Loading…</p>}
      </main>
    </>
  );
}
