"use client";

import { useEffect, useState } from "react";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { staffFetch } from "@/lib/staff/api-client";
import { Modal } from "@/components/staff/ui/Modal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; db_category: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", db_category: "flowers" });

  const load = () => staffFetch<typeof categories>("/api/staff/categories").then(setCategories);
  useEffect(() => { load(); }, []);

  async function add() {
    await staffFetch("/api/staff/categories", { method: "POST", body: JSON.stringify(form) });
    setOpen(false);
    load();
  }

  return (
    <>
      <StaffHeader title="Categories" />
      <main className="flex-1 p-4 sm:p-6">
        <button type="button" className="btn-primary text-sm mb-4" onClick={() => setOpen(true)}>Add category</button>
        <div className="card divide-y">
          {categories.map((c) => (
            <div key={c.id} className="p-4 flex justify-between">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-brand-gray-500">{c.db_category} · {c.slug}</p>
              </div>
            </div>
          ))}
        </div>
        <Modal open={open} onClose={() => setOpen(false)} title="New category">
          <input className="input-field mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-field mb-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <button type="button" className="btn-primary" onClick={add}>Save</button>
        </Modal>
      </main>
    </>
  );
}
