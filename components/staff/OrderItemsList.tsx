import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export type OrderLineItem = {
  name: string;
  quantity: number;
  price: number;
  slug?: string;
  image?: string;
  options?: Record<string, string>;
};

function itemImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `https://thestemsflowers.co.ke${image.startsWith("/") ? image : `/${image}`}`;
}

export function OrderItemsList({
  items,
  compact = false,
}: {
  items: OrderLineItem[];
  compact?: boolean;
}) {
  if (!items.length) {
    return <p className="text-sm text-[var(--staff-muted)]">No items recorded</p>;
  }

  if (compact) {
    return (
      <ul className="space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i}>
            {item.slug ? (
              <Link
                href={`/product/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--staff-accent)" }}
              >
                {item.name}
              </Link>
            ) : (
              <span>{item.name}</span>
            )}
            <span className="text-[var(--staff-muted)]"> × {item.quantity}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const imageUrl = itemImageUrl(item.image);
        const lineTotal = (item.price || 0) * (item.quantity || 1);

        return (
          <li
            key={i}
            className="flex items-start justify-between gap-3 text-sm border-b border-brand-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-3 min-w-0">
              {imageUrl && (
                <div className="w-12 h-12 rounded-md overflow-hidden bg-brand-gray-100 shrink-0">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="min-w-0">
                {item.slug ? (
                  <Link
                    href={`/product/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                    style={{ color: "var(--staff-accent)" }}
                  >
                    {item.name} ↗
                  </Link>
                ) : (
                  <span className="font-medium">{item.name}</span>
                )}
                {item.options && Object.keys(item.options).length > 0 && (
                  <p className="text-xs text-[var(--staff-muted)] mt-0.5">
                    {Object.entries(item.options)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </p>
                )}
                <p className="text-xs text-[var(--staff-muted)] mt-0.5">
                  Qty {item.quantity} · {formatCurrency(item.price)} each
                </p>
              </div>
            </div>
            <span className="font-medium tabular-nums shrink-0">{formatCurrency(lineTotal)}</span>
          </li>
        );
      })}
    </ul>
  );
}
