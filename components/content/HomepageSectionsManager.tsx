"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { staffFetch } from "@/lib/staff/api-client";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/staff/constants";
import type { Product } from "@/lib/db";
import type { HomepageSectionConfig } from "@/lib/homepage-sections";

type LoadResponse = {
  sections: HomepageSectionConfig[];
  setupRequired?: boolean;
  message?: string;
};

export function HomepageSectionsManager() {
  const [sections, setSections] = useState<HomepageSectionConfig[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [previewTs, setPreviewTs] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    if (products.length > 0) return;
    setProductsLoading(true);
    try {
      const productData = await staffFetch<Product[]>("/api/staff/products?summary=1");
      setProducts(productData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  }, [products.length]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sectionRes = await staffFetch<LoadResponse>("/api/staff/homepage-sections");
      setSections(sectionRes.sections || []);
      setSetupRequired(Boolean(sectionRes.setupRequired));
      if (sectionRes.setupRequired && sectionRes.message) {
        setError(sectionRes.message);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load homepage sections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (expandedId) loadProducts();
  }, [expandedId, loadProducts]);

  const updateSection = (id: string, patch: Partial<HomepageSectionConfig>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const toggleProduct = (sectionId: string, productId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const has = s.product_ids.some((id) => String(id) === String(productId));
        return {
          ...s,
          product_ids: has
            ? s.product_ids.filter((id) => id !== productId)
            : [...s.product_ids, productId],
        };
      })
    );
  };

  const moveProduct = (sectionId: string, productId: string, direction: -1 | 1) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const idx = s.product_ids.findIndex((id) => String(id) === String(productId));
        if (idx < 0) return s;
        const next = idx + direction;
        if (next < 0 || next >= s.product_ids.length) return s;
        const ids = [...s.product_ids];
        const [item] = ids.splice(idx, 1);
        ids.splice(next, 0, item);
        return { ...s, product_ids: ids };
      })
    );
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= sections.length) return;
    const copy = [...sections];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    setSections(copy.map((s, i) => ({ ...s, sort_order: i + 1 })));
  };

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await staffFetch<{
        sections: HomepageSectionConfig[];
        message?: string;
      }>("/api/staff/homepage-sections", {
        method: "PUT",
        body: JSON.stringify({ sections }),
      });
      setSections(result.sections);
      setSetupRequired(false);
      setPreviewTs(Date.now());
      setSuccess(
        "Saved. Open the homepage to see your changes — picked products and titles update the shop front."
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (CATEGORY_LABELS[p.category] || p.category).toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-brand-gray-600">
        Loading homepage sections…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="staff-panel p-4 text-sm text-brand-gray-700">
        <p>
          Control the product rows on your shop homepage. Pick products, edit titles, reorder
          sections, then save.
        </p>
        <p className="mt-1 text-[var(--staff-muted)]">
          Leave a section empty to auto-fill from your catalogue. Only published products appear
          on the live site.
        </p>
      </div>

      {setupRequired ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Database setup needed</p>
          <p className="mt-1">
            Run <code className="text-xs">supabase/RUN_IN_SQL_EDITOR.sql</code> in Supabase → SQL
            Editor. You can still save below — settings are stored as a backup until the table
            exists.
          </p>
        </div>
      ) : null}

      {error && !setupRequired ? <div className="staff-auth-error">{error}</div> : null}
      {success ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 space-y-2">
          <p>{success}</p>
          {previewTs ? (
            <Link
              href={`/?preview=${previewTs}`}
              target="_blank"
              className="inline-flex staff-btn staff-btn-outline text-xs"
            >
              View homepage now ↗
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saving || sections.length === 0}
          className="staff-btn staff-btn-primary text-sm"
        >
          {saving ? "Saving…" : "Save homepage sections"}
        </button>
        <button type="button" onClick={load} className="staff-btn staff-btn-outline text-sm">
          Reload
        </button>
        <Link href="/" target="_blank" className="staff-btn staff-btn-ghost text-sm">
          Open shop ↗
        </Link>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-[var(--staff-muted)] py-8 text-center">
          No sections loaded. Run the SQL setup file, then click Reload.
        </p>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isOpen = expandedId === section.id;
            const selectedProducts = section.product_ids
              .map((id) => products.find((p) => String(p.id) === String(id)))
              .filter((p): p is Product => Boolean(p));

            return (
              <div key={section.id} className="staff-panel overflow-hidden">
                <div className="staff-panel-head flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="text-left flex-1 min-w-0"
                    onClick={() => {
                      const next = isOpen ? null : section.id;
                      setExpandedId(next);
                      if (next) loadProducts();
                    }}
                  >
                    <span className="font-medium">{section.title || section.key}</span>
                    <span className="ml-2 text-xs text-[var(--staff-muted)]">
                      ({selectedProducts.length} on homepage
                      {section.product_ids.length > selectedProducts.length
                        ? ` · ${section.product_ids.length - selectedProducts.length} draft/missing`
                        : ""}
                      )
                    </span>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="staff-btn staff-btn-ghost px-2 py-1 text-xs"
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0}
                      aria-label="Move section up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="staff-btn staff-btn-ghost px-2 py-1 text-xs"
                      onClick={() => moveSection(index, 1)}
                      disabled={index === sections.length - 1}
                      aria-label="Move section down"
                    >
                      ↓
                    </button>
                    <label className="flex items-center gap-1 text-xs px-2">
                      <input
                        type="checkbox"
                        checked={section.is_active}
                        onChange={(e) =>
                          updateSection(section.id, { is_active: e.target.checked })
                        }
                      />
                      Active
                    </label>
                  </div>
                </div>

                {isOpen ? (
                  <div className="p-4 space-y-4 border-t border-[#e5e7eb]">
                    <div>
                      <label className="staff-label">Section title (shown on homepage)</label>
                      <input
                        className="staff-input"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      />
                    </div>

                    {section.link_href ? (
                      <p className="text-xs text-[var(--staff-muted)]">
                        &quot;View all&quot; link:{" "}
                        <a
                          href={section.link_href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--staff-accent)] hover:underline"
                        >
                          {section.link_href}
                        </a>
                      </p>
                    ) : null}

                    {selectedProducts.length > 0 ? (
                      <div>
                        <p className="text-xs font-medium text-brand-gray-700 mb-2">
                          Products on homepage (in this order)
                        </p>
                        <ul className="space-y-2">
                          {selectedProducts.map((p, pi) => (
                            <li
                              key={p.id}
                              className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] p-2 bg-pink-50/50"
                            >
                              <span className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                                <Image
                                  src={p.images[0] || "/images/products/hampers/GiftAmper3.jpg"}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </span>
                              <span className="flex-1 min-w-0 text-sm truncate">{p.title}</span>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  type="button"
                                  className="staff-btn staff-btn-ghost px-1.5 py-0.5 text-xs"
                                  disabled={pi === 0}
                                  onClick={() => moveProduct(section.id, p.id, -1)}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="staff-btn staff-btn-ghost px-1.5 py-0.5 text-xs"
                                  disabled={pi === selectedProducts.length - 1}
                                  onClick={() => moveProduct(section.id, p.id, 1)}
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  className="text-xs text-red-700 px-1"
                                  onClick={() => toggleProduct(section.id, p.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--staff-muted)]">
                        No products selected — we will auto-pick up to 8 from your catalogue for
                        this section type.
                      </p>
                    )}

                    <div>
                      <label className="staff-label">Add products</label>
                      <input
                        className="staff-input mb-2"
                        placeholder="Search products…"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        disabled={productsLoading}
                      />
                      {productsLoading ? (
                        <p className="text-sm text-[var(--staff-muted)] py-4">Loading products…</p>
                      ) : (
                      <div className="max-h-56 overflow-y-auto border border-[#e5e7eb] rounded-lg divide-y divide-[#f3f4f6]">
                        {filteredProducts.slice(0, 80).map((p) => {
                          const selected = section.product_ids.some(
                            (id) => String(id) === String(p.id)
                          );
                          const isDraft =
                            (p as Product & { visibility?: string }).visibility === "draft";
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => toggleProduct(section.id, p.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-brand-blush ${
                                selected ? "bg-pink-50" : ""
                              }`}
                            >
                              <span className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-brand-gray-100">
                                <Image
                                  src={p.images[0] || "/images/products/hampers/GiftAmper3.jpg"}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block truncate font-medium">{p.title}</span>
                                <span className="text-xs text-[var(--staff-muted)]">
                                  {CATEGORY_LABELS[p.category] || p.category} ·{" "}
                                  {formatCurrency(p.price)}
                                  {isDraft ? " · draft" : ""}
                                </span>
                              </span>
                              <span
                                className={`text-xs font-medium shrink-0 ${
                                  selected ? "text-[var(--staff-accent)]" : "text-brand-gray-400"
                                }`}
                              >
                                {selected ? "Added" : "Add"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
