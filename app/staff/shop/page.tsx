"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StaffPage } from "@/components/staff/StaffPage";
import { useStaffQuery } from "@/hooks/useStaffQuery";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/staff/constants";
import { isProductPublished, type Product } from "@/lib/db";

const COLLECTION_LINKS: Record<string, string> = {
  flowers: "/collections/flowers",
  hampers: "/collections/gift-hampers",
  teddy: "/collections/teddy-bears",
  wines: "/collections/wines",
  chocolates: "/collections/chocolates",
  cards: "/collections/cards",
};

export default function StaffShopPreviewPage() {
  const { data } = useStaffQuery<Product[]>("/api/staff/products?summary=1", {
    ttlMs: 60_000,
  });
  const products = data ?? [];
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const published = useMemo(() => products.filter(isProductPublished), [products]);
  const drafts = products.length - published.length;

  const visible = useMemo(() => {
    let list = published;
    if (category) list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      );
    }
    return list;
  }, [published, category, search]);

  return (
    <StaffPage
      title="Shop preview"
      description="Exactly what customers see — published products on the live site"
      actions={
        <Link href="/" target="_blank" className="staff-btn staff-btn-accent text-sm">
          Open homepage ↗
        </Link>
      }
    >
      <div className="staff-panel p-4 mb-5 text-sm text-brand-gray-700">
        <p>
          <strong>{published.length}</strong> published on the shop
          {drafts > 0 ? (
            <>
              {" "}
              · <strong>{drafts}</strong> draft (hidden from customers)
            </>
          ) : null}
        </p>
        <p className="mt-1 text-[var(--staff-muted)]">
          Use &quot;View on shop&quot; to open the live product page. Unpublished items only
          appear under Products → Publish.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="staff-input max-w-xs"
          placeholder="Search…"
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
        <div className="flex flex-wrap gap-2 items-center">
          {Object.entries(COLLECTION_LINKS).map(([key, href]) => (
            <Link
              key={key}
              href={href}
              target="_blank"
              className="staff-btn staff-btn-outline text-xs"
            >
              {CATEGORY_LABELS[key] || key} ↗
            </Link>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-[var(--staff-muted)]">
          {products.length === 0
            ? "Loading catalogue…"
            : "No published products match your filters."}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((p) => (
            <div key={p.id} className="staff-panel overflow-hidden flex flex-col">
              <div className="relative aspect-square bg-brand-gray-100">
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : null}
              </div>
              <div className="p-3 flex flex-col flex-1 gap-2">
                <p className="font-medium text-sm line-clamp-2">{p.title}</p>
                <p className="text-xs text-[var(--staff-muted)]">
                  {CATEGORY_LABELS[p.category] || p.category}
                </p>
                <p className="font-semibold text-sm">{formatCurrency(p.price)}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="staff-btn staff-btn-primary text-xs flex-1 text-center"
                  >
                    View on shop
                  </Link>
                  <Link
                    href={`/staff/products/${p.id}`}
                    className="staff-btn staff-btn-ghost text-xs"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </StaffPage>
  );
}
