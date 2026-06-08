"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { Badge } from "@/components/staff/ui/Badge";
import { OrderItemsList, type OrderLineItem } from "@/components/staff/OrderItemsList";
import { OrderDeliveryDetailsPanel } from "@/components/staff/OrderDeliveryDetails";
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

  const items = (order.items as OrderLineItem[]) || [];

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
          <p className="text-sm"><strong>Delivery:</strong> {formatDateTime(String(order.delivery_date))}</p>
          <p className="text-sm"><strong>Payment:</strong> {PAYMENT_METHOD_LABELS[String(order.payment_method)] || String(order.payment_method)}</p>
        </div>

        <div className="card p-6 mb-4">
          <h3 className="font-semibold mb-3">Delivery &amp; messages</h3>
          <OrderDeliveryDetailsPanel
            order={{
              delivery_location: order.delivery_location as string | null,
              delivery_address: order.delivery_address as string | null,
              delivery_city: order.delivery_city as string | null,
              gift_message: order.gift_message as string | null,
              special_instructions: order.special_instructions as string | null,
              recipient_name: order.recipient_name as string | null,
              recipient_phone: order.recipient_phone as string | null,
              notes: order.notes as string | null,
            }}
          />
          {order.notes ? (
            <p className="text-sm mt-4 pt-3 border-t border-brand-gray-100">
              <strong>Internal notes:</strong> {String(order.notes)}
            </p>
          ) : null}
        </div>

        <div className="card p-6 mb-4">
          <h3 className="font-semibold mb-3">Items</h3>
          <OrderItemsList items={items} />
          <p className="font-bold mt-4 text-right border-t border-brand-gray-100 pt-3">
            {formatCurrency(Number(order.total_amount || 0))}
          </p>
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
