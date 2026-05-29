"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useStaffQuery } from "@/hooks/useStaffQuery";
import { formatCurrency } from "@/lib/utils";

interface CustomerRow {
  id: string;
  name: string;
  email?: string;
  phone: string;
  total_orders: number;
  total_spend: number;
  is_blocked?: boolean;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const customersUrl = useMemo(() => {
    const q = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
    return `/api/staff/customers${q}`;
  }, [debouncedSearch]);

  const { data } = useStaffQuery<CustomerRow[]>(customersUrl, {
    ttlMs: 45_000,
  });
  const customers = data ?? [];

  function exportCsv() {
    const headers = ["name", "email", "phone", "orders", "spend"];
    const rows = customers.map((c) =>
      [c.name, c.email || "", c.phone, c.total_orders, c.total_spend].join(",")
    );
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  }

  return (
    <>
      <StaffHeader title="Customers" />
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="flex gap-2 mb-4">
          <input className="input-field max-w-xs" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className="btn-outline text-sm" onClick={exportCsv}>Export CSV</button>
        </div>
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-gray-50">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Orders</th>
                <th className="p-2 text-left">Spend</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="p-2">{c.name} {c.is_blocked && <span className="text-red-600 text-xs">(blocked)</span>}</td>
                  <td className="p-2">{c.phone}</td>
                  <td className="p-2">{c.total_orders}</td>
                  <td className="p-2">{formatCurrency(c.total_spend || 0)}</td>
                  <td className="p-2">
                    <Link href={`/staff/customers/${c.id}`} className="text-brand-rose-deep text-xs">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
