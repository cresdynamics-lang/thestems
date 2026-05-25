"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { staffFetch } from "@/lib/staff/api-client";
import { CATEGORY_LABELS } from "@/lib/staff/constants";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    category: "flowers",
    stock: "",
    visibility: "published",
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", form.category);
    const token = localStorage.getItem("staff_token");
    const res = await fetch("/api/staff/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, images: [...f.images, data.url] }));
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await staffFetch("/api/staff/products", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        slug,
        price: parseInt(form.price, 10),
        stock: form.stock ? parseInt(form.stock, 10) : null,
      }),
    });
    router.push("/staff/products");
  }

  return (
    <>
      <StaffHeader title="Add product" />
      <main className="flex-1 p-4 sm:p-6 max-w-2xl">
        <form onSubmit={submit} className="card p-6 space-y-4">
          <input className="input-field" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="input-field" placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="input-field" placeholder="Price (KES, e.g. 4500)" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input className="input-field" placeholder="Stock qty" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <select className="input-field" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
          {uploading && <p className="text-sm">Uploading…</p>}
          {form.images.length > 0 && <p className="text-sm text-green-700">{form.images.length} image(s)</p>}
          <button type="submit" className="btn-primary">Save product</button>
        </form>
      </main>
    </>
  );
}
