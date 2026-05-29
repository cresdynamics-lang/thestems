"use client";

import { useMemo, useState } from "react";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { StatCard } from "@/components/staff/ui/StatCard";
import { useStaffQuery } from "@/hooks/useStaffQuery";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/staff/constants";

export default function FinancePage() {
  const [period, setPeriod] = useState("month");
  const financeUrl = useMemo(() => `/api/staff/finance?period=${period}`, [period]);
  const { data, error: queryError } = useStaffQuery<Record<string, unknown>>(financeUrl, {
    ttlMs: 60_000,
  });

  const displayError =
    queryError?.includes("Super Admin") || queryError?.includes("403")
      ? "Financial reports are available to Super Admin only."
      : queryError || "";

  function exportCsv() {
    if (!data) return;
    const lines = [
      `Revenue,${data.totalRevenue}`,
      `Orders,${data.orderCount}`,
      `AOV,${data.avgOrderValue}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `revenue-${period}.csv`;
    a.click();
  }

  return (
    <>
      <StaffHeader title="Finance & Revenue" />
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        {displayError ? (
          <div className="card p-6 text-brand-gray-700">{displayError}</div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              {["day", "week", "month"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-full text-sm capitalize ${period === p ? "bg-brand-rose-deep text-white" : "bg-white border"}`}
                >
                  {p}
                </button>
              ))}
              <button type="button" className="btn-outline text-sm ml-auto" onClick={exportCsv}>Export CSV</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <StatCard label="Total revenue" value={data ? formatCurrency(Number(data.totalRevenue)) : "—"} />
              <StatCard label="Orders" value={String(data?.orderCount ?? "—")} />
              <StatCard label="Avg order value" value={data ? formatCurrency(Number(data.avgOrderValue)) : "—"} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-4">
                <h3 className="font-semibold mb-2">By payment method</h3>
                {Object.entries((data?.byPayment as Record<string, number>) || {}).map(([k, v]) => (
                  <p key={k} className="text-sm flex justify-between py-1">
                    <span>{PAYMENT_METHOD_LABELS[k] || k}</span>
                    <span>{formatCurrency(v)}</span>
                  </p>
                ))}
              </div>
              <div className="card p-4">
                <h3 className="font-semibold mb-2">By category</h3>
                {Object.entries((data?.byCategory as Record<string, number>) || {}).map(([k, v]) => (
                  <p key={k} className="text-sm flex justify-between py-1">
                    <span>{CATEGORY_LABELS[k] || k}</span>
                    <span>{formatCurrency(v)}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="card p-4 mt-4">
              <h3 className="font-semibold mb-2">VAT summary</h3>
              <p className="text-sm">Rate: {(data?.vat as { rate?: number })?.rate}% — Est. VAT: {formatCurrency(Number((data?.vat as { amount?: number })?.amount || 0))}</p>
            </div>
            <div className="card p-4 mt-4">
              <h3 className="font-semibold mb-2">Top products</h3>
              {((data?.topProducts as { name: string; units: number; revenue: number }[]) || []).map((p, i) => (
                <p key={i} className="text-sm flex justify-between py-1">
                  <span>{p.name} ({p.units} units)</span>
                  <span>{formatCurrency(p.revenue)}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
