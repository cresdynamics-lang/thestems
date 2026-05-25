"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { staffFetch } from "@/lib/staff/api-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<{ customer: Record<string, unknown>; orders: Array<Record<string, unknown>> } | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (id)
      staffFetch<{ customer: Record<string, unknown>; orders: Array<Record<string, unknown>> }>(
        `/api/staff/customers/${id}`
      ).then(setData);
  }, [id]);

  async function saveNote() {
    await staffFetch(`/api/staff/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ notes: note }),
    });
    alert("Note saved");
  }

  async function toggleBlock() {
    const blocked = !data?.customer?.is_blocked;
    await staffFetch(`/api/staff/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_blocked: blocked }),
    });
    staffFetch<{ customer: Record<string, unknown>; orders: Array<Record<string, unknown>> }>(
      `/api/staff/customers/${id}`
    ).then(setData);
  }

  if (!data) return <StaffHeader title="Customer" />;

  const c = data.customer;

  return (
    <>
      <StaffHeader title={String(c.name || "Customer")} />
      <main className="flex-1 p-4 sm:p-6 max-w-3xl">
        <div className="card p-6 mb-4">
          <p><strong>Phone:</strong> {String(c.phone)}</p>
          <p><strong>Email:</strong> {String(c.email || "—")}</p>
          <p><strong>Orders:</strong> {String(c.total_orders || data.orders.length)}</p>
          <button type="button" className="btn-outline text-sm mt-3" onClick={toggleBlock}>
            {c.is_blocked ? "Unblock" : "Block"} customer
          </button>
        </div>
        <div className="card p-6 mb-4">
          <label className="text-sm font-medium">Staff note (VIP, instructions…)</label>
          <textarea className="input-field mt-1" rows={3} value={note || String(c.notes || "")} onChange={(e) => setNote(e.target.value)} />
          <button type="button" className="btn-primary text-sm mt-2" onClick={saveNote}>Save note</button>
        </div>
        <h2 className="font-heading font-semibold mb-2">Order history</h2>
        <ul className="space-y-2">
          {data.orders.map((o) => (
            <li key={String(o.id)} className="card p-3 flex justify-between text-sm">
              <Link href={`/staff/orders/${o.id}`} className="text-brand-rose-deep">{formatDateTime(String(o.created_at))}</Link>
              <span>{formatCurrency(Number(o.total_amount || 0))}</span>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
