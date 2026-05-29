"use client";

import { useState } from "react";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { Modal } from "@/components/staff/ui/Modal";
import { Badge } from "@/components/staff/ui/Badge";
import { staffFetch } from "@/lib/staff/api-client";
import { invalidateStaffCache } from "@/lib/staff/staff-cache";
import { useStaffQuery } from "@/hooks/useStaffQuery";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  usage_limit?: number;
  times_used: number;
  total_discount_given: number;
  is_active: boolean;
  expires_at?: string;
}

export default function CouponsPage() {
  const { data, refetch } = useStaffQuery<Coupon[]>("/api/staff/coupons", {
    ttlMs: 45_000,
  });
  const coupons = data ?? [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    min_order_value: 0,
    usage_limit: 100,
    expires_at: "",
  });

  const reload = () => {
    invalidateStaffCache("/api/staff/coupons");
    void refetch(false);
  };

  async function create() {
    await staffFetch("/api/staff/coupons", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        expires_at: form.expires_at || null,
        is_active: true,
      }),
    });
    setOpen(false);
    reload();
  }

  async function toggle(id: string, is_active: boolean) {
    await staffFetch(`/api/staff/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: !is_active }),
    });
    reload();
  }

  return (
    <>
      <StaffHeader title="Coupons" />
      <main className="flex-1 p-4 sm:p-6">
        <button type="button" className="btn-primary text-sm mb-4" onClick={() => setOpen(true)}>Create coupon</button>
        <div className="card divide-y">
          {coupons.map((c) => (
            <div key={c.id} className="p-4 flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-mono font-bold">{c.code}</p>
                <p className="text-sm text-brand-gray-600">
                  {c.discount_type === "free_delivery" ? "Free delivery" : `${c.discount_value}${c.discount_type === "percentage" ? "%" : " KES off"}`}
                  {" · "}Used {c.times_used}{c.usage_limit ? `/${c.usage_limit}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={c.is_active ? "published" : "draft"} />
                <button type="button" className="text-xs btn-outline py-1" onClick={() => toggle(c.id, c.is_active)}>
                  {c.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <Modal open={open} onClose={() => setOpen(false)} title="New coupon">
          <div className="space-y-3">
            <input className="input-field" placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            <select className="input-field" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount (KES)</option>
              <option value="free_delivery">Free delivery</option>
            </select>
            <input className="input-field" type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: parseInt(e.target.value, 10) })} />
            <input className="input-field" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
            <button type="button" className="btn-primary w-full" onClick={create}>Create</button>
          </div>
        </Modal>
      </main>
    </>
  );
}
