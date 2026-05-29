"use client";

import Link from "next/link";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { staffFetch } from "@/lib/staff/api-client";
import { invalidateStaffCache } from "@/lib/staff/staff-cache";
import { useStaffQuery } from "@/hooks/useStaffQuery";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/db";

type DeliveryData = {
  zones: { id: string; name: string; delivery_fee: number }[];
  personnel: { id: string; name: string; phone: string }[];
  pendingDeliveries: Order[];
};

export default function DeliveryPage() {
  const { data, refetch } = useStaffQuery<DeliveryData>("/api/staff/delivery", {
    ttlMs: 30_000,
  });
  const zones = data?.zones ?? [];
  const personnel = data?.personnel ?? [];
  const pending = data?.pendingDeliveries ?? [];

  async function assignOrder(orderId: string, assigned_to: string) {
    await staffFetch(`/api/staff/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ assigned_to, fulfillment_status: "out_for_delivery" }),
    });
    invalidateStaffCache("/api/staff/delivery");
    void refetch(false);
  }

  return (
    <>
      <StaffHeader title="Delivery" />
      <main className="flex-1 p-4 sm:p-6 overflow-auto space-y-6">
        <section>
          <h2 className="font-heading font-semibold mb-2">Pending deliveries</h2>
          <div className="card divide-y">
            {pending.map((o) => (
              <div key={o.id} className="p-4 flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-medium">{o.customer_name}</p>
                  <p className="text-xs text-brand-gray-600">{o.delivery_address}</p>
                  <p className="text-sm">{formatCurrency(o.total_amount || 0)}</p>
                </div>
                <select
                  className="input-field max-w-[180px] text-sm"
                  onChange={(e) => e.target.value && assignOrder(o.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Assign driver…</option>
                  {personnel.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            ))}
            {!pending.length && <p className="p-4 text-sm text-brand-gray-500">No pending deliveries</p>}
          </div>
        </section>
        <section>
          <h2 className="font-heading font-semibold mb-2">Delivery zones (Nairobi)</h2>
          <div className="card max-h-64 overflow-y-auto divide-y text-sm">
            {zones.map((z) => (
              <div key={z.id} className="p-3 flex justify-between">
                <span>{z.name}</span>
                <span>{formatCurrency(z.delivery_fee)}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-heading font-semibold mb-2">Delivery team</h2>
          <ul className="card divide-y text-sm">
            {personnel.map((p) => (
              <li key={p.id} className="p-3">{p.name} — {p.phone}</li>
            ))}
            {!personnel.length && <li className="p-3 text-brand-gray-500">Add personnel in Settings</li>}
          </ul>
        </section>
        <Link href="/staff/settings" className="text-sm text-brand-rose-deep">Manage zones & team in Settings →</Link>
      </main>
    </>
  );
}
