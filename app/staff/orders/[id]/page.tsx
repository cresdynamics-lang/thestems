"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { Badge } from "@/components/staff/ui/Badge";
import { staffFetch } from "@/lib/staff/api-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ORDER_FULFILLMENT_STATUSES, PAYMENT_METHOD_LABELS } from "@/lib/staff/constants";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [refundNotes, setRefundNotes] = useState("");

  const load = () => id && staffFetch<Record<string, unknown>>(`/api/staff/orders/${id}`).then((o) => {
    setOrder(o);
    setStatus(String(o.fulfillment_status || o.status || "pending"));
  });

  useEffect(() => { load(); }, [id]);

  async function updateStatus() {
    await staffFetch(`/api/staff/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        fulfillment_status: status,
        cancel_reason: status === "cancelled" ? cancelReason : undefined,
        refund_notes: refundNotes || undefined,
      }),
    });
    load();
  }

  function printReceipt() {
    window.print();
  }

  if (!order) return <StaffHeader title="Order" />;

  const items = (order.items as Array<{ name: string; quantity: number; price: number }>) || [];

  return (
    <>
      <StaffHeader title={`Order ${String(id).slice(0, 8)}`} />
      <main className="flex-1 p-4 sm:p-6 max-w-3xl print:p-0">
        <div className="card p-6 space-y-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-heading font-bold text-lg">{String(order.customer_name)}</h2>
              <p className="text-sm">{String(order.phone)}</p>
              <p className="text-sm text-brand-gray-600">{String(order.email || "")}</p>
            </div>
            <Badge status={String(order.fulfillment_status || order.status)} />
          </div>
          <p className="text-sm"><strong>Address:</strong> {String(order.delivery_address)}</p>
          <p className="text-sm"><strong>Delivery:</strong> {formatDateTime(String(order.delivery_date))}</p>
          <p className="text-sm"><strong>Payment:</strong> {PAYMENT_METHOD_LABELS[String(order.payment_method)] || String(order.payment_method)}</p>
          {order.special_instructions ? (
            <p className="text-sm"><strong>Instructions:</strong> {String(order.special_instructions)}</p>
          ) : null}
          {order.notes ? (
            <p className="text-sm"><strong>Notes:</strong> {String(order.notes)}</p>
          ) : null}
        </div>

        <div className="card p-6 mb-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <ul className="space-y-2 text-sm">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold mt-3 text-right">{formatCurrency(Number(order.total_amount || 0))}</p>
        </div>

        <div className="card p-6 space-y-3 no-print">
          <label className="block text-sm font-medium">Update status</label>
          <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
            {ORDER_FULFILLMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          {status === "cancelled" && (
            <input className="input-field" placeholder="Cancel reason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
          )}
          <input className="input-field" placeholder="Refund notes" value={refundNotes} onChange={(e) => setRefundNotes(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" className="btn-primary" onClick={updateStatus}>Save status</button>
            <button type="button" className="btn-outline" onClick={printReceipt}>Print receipt</button>
          </div>
        </div>

        {Array.isArray(order.status_history) && (order.status_history as { status: string; at: string }[]).length > 0 && (
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">Status history</h3>
            <ul className="text-xs space-y-1">
              {(order.status_history as { status: string; at: string; by?: string }[]).map((h, i) => (
                <li key={i}>{h.status} — {formatDateTime(h.at)} {h.by && `(${h.by})`}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
