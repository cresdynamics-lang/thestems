"use client";

import { useState } from "react";
import ProductFilterCheckboxes from "@/components/admin/ProductFilterCheckboxes";
import { getStaffToken } from "@/lib/staff/api-client";
import { CATEGORY_LABELS } from "@/lib/staff/constants";
import { FLOWER_TYPE_TAGS, OCCASION_TAGS, isShopFilterTag } from "@/lib/productFilterTags";
import { SUBCATEGORIES } from "@/lib/subcategories";
import { kesToCents } from "@/lib/utils";

export type ProductEditorValues = {
  title?: string | null;
  slug?: string | null;
  short_description?: string | null;
  description?: string | null;
  price?: number | null;
  sale_price?: number | null;
  category?: string | null;
  tags?: string[] | null;
  teddy_size?: number | null;
  stock?: number | null;
  sku?: string | null;
  low_stock_threshold?: number | null;
  visibility?: string | null;
  images?: string[] | null;
};

type Props = {
  initial?: ProductEditorValues;
  /** Throw to show the message on the form. */
  onSave: (payload: Record<string, unknown>) => Promise<void>;
};

const PRIMARY_SUBCATEGORY_TAGS = new Set<string>([...FLOWER_TYPE_TAGS, ...OCCASION_TAGS]);

function centsToKes(cents?: number | null) {
  return cents ? String(cents / 100) : "";
}

function toInt(value: string) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

export function ProductEditor({ initial = {}, onSave }: Props) {
  const isNew = !initial.slug;
  const [title, setTitle] = useState(initial.title ?? "");
  const [shortDescription, setShortDescription] = useState(initial.short_description ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [price, setPrice] = useState(centsToKes(initial.price));
  const [salePrice, setSalePrice] = useState(centsToKes(initial.sale_price));
  const [category, setCategory] = useState(initial.category ?? "flowers");
  const [teddySize, setTeddySize] = useState(initial.teddy_size ? String(initial.teddy_size) : "");
  const [stock, setStock] = useState(initial.stock != null ? String(initial.stock) : "");
  const [sku, setSku] = useState(initial.sku ?? "");
  const [lowStock, setLowStock] = useState(String(initial.low_stock_threshold ?? 5));
  const [visibility, setVisibility] = useState(initial.visibility ?? "published");
  const [images, setImages] = useState<string[]>(initial.images ?? []);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    (initial.tags ?? []).filter(isShopFilterTag)
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    setError("");
    const token = getStaffToken();
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", category);
      try {
        const res = await fetch("/api/staff/upload", {
          method: "POST",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.url) throw new Error(data.message || "Upload failed");
        setImages((current) => [...current, data.url]);
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : "Upload failed"}`);
      }
    }
    setUploading(false);
  }

  function makeMain(index: number) {
    setImages((current) => [current[index], ...current.filter((_, i) => i !== index)]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const priceCents = kesToCents(price);
    if (!priceCents) {
      setError("Enter a price in KES, for example 4500.");
      return;
    }
    if (visibility === "published" && images.length === 0) {
      setError("Add at least one product image before publishing, or save it as a draft.");
      return;
    }

    const isTeddy = category === "teddy";
    const otherTags = (initial.tags ?? []).filter((t) => !isShopFilterTag(t));
    const payload: Record<string, unknown> = {
      title,
      short_description: shortDescription,
      description,
      price: priceCents,
      sale_price: kesToCents(salePrice) || null,
      category,
      subcategory: isTeddy
        ? teddySize ? `${teddySize}cm` : null
        : selectedTags.find((t) => PRIMARY_SUBCATEGORY_TAGS.has(t)) ?? null,
      teddy_size: isTeddy ? toInt(teddySize) : null,
      tags: [...selectedTags, ...otherTags],
      stock: toInt(stock),
      sku: sku || null,
      low_stock_threshold: toInt(lowStock) ?? 5,
      visibility,
      images,
    };
    if (isNew) {
      payload.slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    setSaving(true);
    try {
      await onSave(payload);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <input className="input-field" placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="input-field" placeholder="Short description (shown on product cards)" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
      <textarea className="input-field" placeholder="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />

      <input className="input-field" placeholder="Price (KES, e.g. 4500)" inputMode="decimal" required value={price} onChange={(e) => setPrice(e.target.value)} />
      <input className="input-field" placeholder="Sale price (KES, optional)" inputMode="decimal" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />

      <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      {category === "teddy" && (
        <select className="input-field" value={teddySize} onChange={(e) => setTeddySize(e.target.value)}>
          <option value="">Teddy size</option>
          {SUBCATEGORIES.teddy.map((size) => (
            <option key={size} value={parseInt(size, 10)}>{size}</option>
          ))}
        </select>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Product images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {uploading && <p className="text-sm">Uploading…</p>}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {images.map((src, index) => (
              <div key={src} className="space-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full aspect-square object-cover rounded" />
                <div className="flex justify-between text-xs">
                  {index === 0 ? (
                    <span>Main image</span>
                  ) : (
                    <button type="button" className="underline" onClick={() => makeMain(index)}>Make main</button>
                  )}
                  <button type="button" className="underline text-red-700" onClick={() => setImages(images.filter((_, i) => i !== index))}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductFilterCheckboxes
        selected={selectedTags}
        showFlowerTypes={category === "flowers"}
        onToggle={(tag) =>
          setSelectedTags((current) =>
            current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
          )
        }
      />

      <input className="input-field" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
      <input className="input-field" type="number" placeholder="Stock qty" value={stock} onChange={(e) => setStock(e.target.value)} />
      <input className="input-field" type="number" placeholder="Low stock alert" value={lowStock} onChange={(e) => setLowStock(e.target.value)} />
      <select className="input-field" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {saved && <p role="status" className="text-sm text-green-700">Saved. The shop is updated.</p>}

      <button type="submit" className="btn-primary" disabled={saving || uploading}>
        {saving ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
