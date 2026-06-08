"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StaffPage } from "@/components/staff/StaffPage";
import { Badge } from "@/components/staff/ui/Badge";
import { OrderItemsList, type OrderLineItem } from "@/components/staff/OrderItemsList";
import { useStaffQuery } from "@/hooks/useStaffQuery";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { getOrderDeliveryLocation } from "@/lib/orderDisplay";
import { PAYMENT_METHOD_LABELS, ORDER_STATUS_FILTERS } from "@/lib/staff/constants";
import type { Order } from "@/lib/db";

export default function StaffOrdersPage() {
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");

  const ordersUrl = useMemo(() => {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (payment) q.set("payment_method", payment);
    const qs = q.toString();
    return `/api/staff/orders${qs ? `?${qs}` : ""}`;
  }, [status, payment]);

  const { data, loading, error } = useStaffQuery<Order[]>(ordersUrl, { ttlMs: 30_000 });
  const orders = data ?? [];

  return (
    <StaffPage title="Orders" description={`${orders.length} orders`}>
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          className="staff-input max-w-[180px]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {ORDER_STATUS_FILTERS.map((s) => (
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

      {loading && !orders.length ? (
        <div className="staff-panel p-10 text-center text-[var(--staff-muted)]">Loading orders…</div>
      ) : error && !orders.length ? (
        <div className="staff-panel p-10 text-center text-red-600">{error}</div>
      ) : (
        <div className="staff-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="staff-table min-w-[960px]">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[var(--staff-muted)]">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const lineItems = (o.items || []) as OrderLineItem[];

                    return (
                      <tr key={o.id}>
                        <td className="font-mono text-xs">
                          <Link
                            href={`/staff/orders/${o.id}`}
                            className="hover:underline"
                            style={{ color: "var(--staff-accent)" }}
                          >
                            {o.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td>
                          <Link
                            href={`/staff/orders/${o.id}`}
                            className="font-medium hover:underline"
                            style={{ color: "var(--staff-accent)" }}
                          >
                            {o.customer_name}
                          </Link>
                          <p className="text-xs text-[var(--staff-muted)]">{o.phone}</p>
                        </td>
                        <td className="max-w-[220px]">
                          <OrderItemsList items={lineItems.slice(0, 3)} compact />
                          {lineItems.length > 3 && (
                            <Link
                              href={`/staff/orders/${o.id}`}
                              className="text-xs hover:underline mt-1 inline-block"
                              style={{ color: "var(--staff-accent)" }}
                            >
                              +{lineItems.length - 3} more
                            </Link>
                          )}
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
                          <div>{getOrderDeliveryLocation(o as Order) || "—"}</div>
                          <div>{formatDateTime(o.delivery_date)}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </StaffPage>
  );
}
