"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { staffFetch } from "@/lib/staff/api-client";

export default function EditProductPage() {
  const { id } = useParams();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) staffFetch<Record<string, unknown>>(`/api/staff/products/${id}`).then(setForm);
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await staffFetch(`/api/staff/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: form.price,
        stock: form.stock,
        visibility: form.visibility,
        sale_price: form.sale_price,
        sku: form.sku,
        low_stock_threshold: form.low_stock_threshold,
        tags: form.tags,
        images: form.images,
      }),
    });
    setSaving(false);
    alert("Saved");
  }

  return (
    <>
      <StaffHeader title="Edit product" />
      <main className="flex-1 p-4 sm:p-6 max-w-2xl">
        {form.slug && form.visibility !== "draft" ? (
          <Link
            href={`/product/${String(form.slug)}`}
            target="_blank"
            className="staff-btn staff-btn-outline text-sm mb-4 inline-block"
          >
            View on shop ↗
          </Link>
        ) : null}
        <form onSubmit={save} className="card p-6 space-y-4">
          <input className="input-field" value={String(form.title || "")} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="input-field" rows={4} value={String(form.description || "")} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="input-field" type="number" placeholder="Price" value={String(form.price || "")} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value, 10) })} />
          <input className="input-field" type="number" placeholder="Sale price" value={String(form.sale_price || "")} onChange={(e) => setForm({ ...form, sale_price: parseInt(e.target.value, 10) || null })} />
          <input className="input-field" placeholder="SKU" value={String(form.sku || "")} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <input className="input-field" type="number" placeholder="Stock" value={String(form.stock ?? "")} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value, 10) })} />
          <input className="input-field" type="number" placeholder="Low stock alert" value={String(form.low_stock_threshold ?? 5)} onChange={(e) => setForm({ ...form, low_stock_threshold: parseInt(e.target.value, 10) })} />
          <select className="input-field" value={String(form.visibility || "published")} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </form>
      </main>
    </>
  );
}
