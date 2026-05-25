"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StaffPage } from "@/components/staff/StaffPage";
import { Badge } from "@/components/staff/ui/Badge";
import { Modal } from "@/components/staff/ui/Modal";
import { staffFetch } from "@/lib/staff/api-client";
import { useStaff } from "@/components/staff/StaffAuthGuard";
import { canDelete } from "@/lib/staff/permissions";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/staff/constants";
import type { Product } from "@/lib/db";

export default function StaffProductsPage() {
  const { user } = useStaff();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkPrice, setBulkPrice] = useState("");

  const load = () => {
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (search) q.set("search", search);
    staffFetch<Product[]>(`/api/staff/products?${q}`).then(setProducts);
  };

  useEffect(() => {
    load();
  }, [category, search]);

  async function bulkAction(action: string) {
    await staffFetch("/api/staff/products", {
      method: "PATCH",
      body: JSON.stringify({
        ids: selected,
        action,
        price: bulkPrice ? parseInt(bulkPrice, 10) : undefined,
      }),
    });
    setSelected([]);
    setBulkOpen(false);
    load();
  }

  async function deleteOne(id: string) {
    if (!confirm("Remove this product from the catalogue?")) return;
    await staffFetch(`/api/staff/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <StaffPage
      title="Products"
      description={`${products.length} items in catalogue`}
      actions={
        <Link href="/staff/products/new" className="staff-btn staff-btn-accent text-sm">
          Add product
        </Link>
      }
    >
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="staff-input max-w-xs"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="staff-input max-w-[200px]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {selected.length > 0 && (
        <div
          className="staff-panel px-4 py-3 mb-4 flex flex-wrap gap-2 items-center text-sm"
          style={{ color: "var(--staff-muted)" }}
        >
          <span className="font-medium text-[var(--staff-text)]">{selected.length} selected</span>
          <button type="button" className="staff-btn staff-btn-ghost text-xs" onClick={() => bulkAction("publish")}>
            Publish
          </button>
          <button type="button" className="staff-btn staff-btn-ghost text-xs" onClick={() => bulkAction("unpublish")}>
            Unpublish
          </button>
          <button type="button" className="staff-btn staff-btn-ghost text-xs" onClick={() => setBulkOpen(true)}>
            Set price
          </button>
          {canDelete(user.role) && (
            <button
              type="button"
              className="staff-btn text-xs text-red-700 border-red-200 hover:bg-red-50"
              onClick={() => bulkAction("delete")}
            >
              Delete
            </button>
          )}
        </div>
      )}

      <div className="staff-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="staff-table min-w-[720px]">
            <thead>
              <tr>
                <th className="w-10" />
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={(e) =>
                        setSelected((s) =>
                          e.target.checked ? [...s, p.id] : s.filter((x) => x !== p.id)
                        )
                      }
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <Image
                          src={p.images[0]}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-md object-cover w-10 h-10"
                        />
                      )}
                      <Link
                        href={`/staff/products/${p.id}`}
                        className="font-medium hover:underline"
                        style={{ color: "var(--staff-accent)" }}
                      >
                        {p.title}
                      </Link>
                    </div>
                  </td>
                  <td className="text-[var(--staff-muted)]">
                    {CATEGORY_LABELS[p.category] || p.category}
                  </td>
                  <td className="tabular-nums font-medium">{formatCurrency(p.price)}</td>
                  <td>{p.stock ?? "—"}</td>
                  <td>
                    <Badge
                      status={(p as Product & { visibility?: string }).visibility || "published"}
                    />
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <Link
                      href={`/staff/products/${p.id}`}
                      className="text-xs font-medium mr-3 hover:underline"
                      style={{ color: "var(--staff-muted)" }}
                    >
                      Edit
                    </Link>
                    {canDelete(user.role) && (
                      <button
                        type="button"
                        className="text-xs text-red-700 hover:underline"
                        onClick={() => deleteOne(p.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={bulkOpen} onClose={() => setBulkOpen(false)} title="Bulk price update">
        <label className="staff-label">Price (smallest unit, e.g. cents)</label>
        <input
          className="staff-input mb-4"
          value={bulkPrice}
          onChange={(e) => setBulkPrice(e.target.value)}
        />
        <button type="button" className="staff-btn staff-btn-primary" onClick={() => bulkAction("update_price")}>
          Apply to selected
        </button>
      </Modal>
    </StaffPage>
  );
}
