"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StaffPage } from "@/components/staff/StaffPage";
import { Badge } from "@/components/staff/ui/Badge";
import { staffFetch } from "@/lib/staff/api-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS, ORDER_FULFILLMENT_STATUSES } from "@/lib/staff/constants";
import type { Order } from "@/lib/db";

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");

  useEffect(() => {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (payment) q.set("payment_method", payment);
    staffFetch<Order[]>(`/api/staff/orders?${q}`).then(setOrders);
  }, [status, payment]);

  return (
    <StaffPage title="Orders" description={`${orders.length} orders`}>
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          className="staff-input max-w-[180px]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {ORDER_FULFILLMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          className="staff-input max-w-[180px]"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="">All payments</option>
          <option value="mpesa">M-PESA</option>
          <option value="card">Card</option>
          <option value="mpesa_till">Till</option>
        </select>
      </div>
      <div className="staff-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="staff-table min-w-[800px]">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs text-[var(--staff-muted)]">
                    {o.id.slice(0, 8)}
                  </td>
                  <td>
                    <Link
                      href={`/staff/orders/${o.id}`}
                      className="font-medium hover:underline"
                      style={{ color: "var(--staff-accent)" }}
                    >
                      {o.customer_name}
                    </Link>
                  </td>
                  <td className="tabular-nums font-medium">
                    {formatCurrency(o.total_amount || 0)}
                  </td>
                  <td className="text-[var(--staff-muted)]">
                    {PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method}
                  </td>
                  <td>
                    <Badge
                      status={
                        (o as Order & { fulfillment_status?: string }).fulfillment_status ||
                        o.status
                      }
                    />
                  </td>
                  <td className="text-xs text-[var(--staff-muted)] whitespace-nowrap">
                    {formatDateTime(o.delivery_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaffPage>
  );
}
