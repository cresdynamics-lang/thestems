"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StaffPage } from "@/components/staff/StaffPage";
import { StatCard } from "@/components/staff/ui/StatCard";
import { Badge } from "@/components/staff/ui/Badge";
import { staffFetch } from "@/lib/staff/api-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/lib/staff/constants";
import type { Order } from "@/lib/db";

interface DashboardData {
  summary: {
    ordersToday: number;
    revenueToday: number | null;
    pendingOrders: number;
    lowStockItems: number;
    newCustomers: number;
  };
  recentOrders: Order[];
  chartDays: { date: string; revenue: number; orders: number }[];
}

export default function StaffDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    staffFetch<DashboardData>("/api/staff/dashboard").then(setData).catch(console.error);
  }, []);

  const chart = data?.chartDays || [];
  const slice =
    chartPeriod === "daily" ? 7 : chartPeriod === "weekly" ? 4 : chart.length;
  const chartSlice = chart.slice(-slice);
  const maxRev = Math.max(...chartSlice.map((d) => d.revenue), 1);

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <StaffPage
      title="Dashboard"
      description={today}
      actions={
        <Link href="/staff/orders" className="staff-btn staff-btn-accent text-sm">
          View orders
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
        <StatCard label="Orders today" value={data?.summary.ordersToday ?? "—"} tone="accent" />
        <StatCard
          label="Revenue today"
          value={
            data?.summary.revenueToday != null
              ? formatCurrency(data.summary.revenueToday)
              : "—"
          }
        />
        <StatCard
          label="Pending"
          value={data?.summary.pendingOrders ?? "—"}
          tone="warn"
          hint="Needs action"
        />
        <StatCard label="Low stock" value={data?.summary.lowStockItems ?? "—"} />
        <StatCard label="New customers" value={data?.summary.newCustomers ?? "—"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="staff-panel lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-[15px]">Sales</h2>
            <div className="staff-segment">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  data-active={chartPeriod === p}
                  onClick={() => setChartPeriod(p)}
                  className="capitalize"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-36 pt-2">
            {chartSlice.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(8, (d.revenue / maxRev) * 100)}%`,
                    background: "var(--staff-sage)",
                  }}
                  title={formatCurrency(d.revenue)}
                />
                <span className="text-[10px] text-[var(--staff-muted)] tabular-nums">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="staff-panel p-5">
          <h2 className="font-heading font-semibold text-[15px] mb-4">Quick actions</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/staff/products/new"
                className="staff-btn staff-btn-primary w-full text-sm"
              >
                New product
              </Link>
            </li>
            <li>
              <Link href="/staff/orders" className="staff-btn staff-btn-ghost w-full text-sm">
                Process orders
              </Link>
            </li>
            <li>
              <Link href="/staff/coupons" className="staff-btn staff-btn-ghost w-full text-sm">
                Create coupon
              </Link>
            </li>
            <li>
              <Link href="/staff/messages" className="staff-btn staff-btn-ghost w-full text-sm">
                Customer enquiries
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="staff-panel overflow-hidden">
        <div className="staff-panel-head flex items-center justify-between">
          <span>Recent orders</span>
          <Link
            href="/staff/orders"
            className="text-xs font-medium hover:underline"
            style={{ color: "var(--staff-accent)" }}
          >
            See all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders || []).slice(0, 10).map((o) => (
                <tr key={o.id}>
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
                    <Badge status={o.status} />
                  </td>
                  <td className="text-[var(--staff-muted)] text-xs whitespace-nowrap">
                    {formatDateTime(o.created_at)}
                  </td>
                </tr>
              ))}
              {!data?.recentOrders?.length && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[var(--staff-muted)]">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StaffPage>
  );
}
