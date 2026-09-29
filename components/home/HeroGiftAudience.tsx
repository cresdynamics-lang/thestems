import Link from "next/link";

const AUDIENCES = [
  { label: "Women's Gifts", href: "/collections/flowers?tags=romantic" },
  { label: "Girlfriend Gifts", href: "/collections/flowers?tags=anniversary" },
  { label: "Men's Gifts", href: "/collections/gift-hampers" },
] as const;

/** Compact gift-audience chips for the hero (top-left beside content). */
export default function HeroGiftAudience() {
  return (
    <div className="mb-4 sm:mb-5 flex flex-wrap gap-2 max-w-md">
      {AUDIENCES.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="inline-flex items-center rounded-full border border-brand-rose-deep/35 bg-white/85 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-brand-rose-deep shadow-sm backdrop-blur-sm transition hover:bg-brand-rose-deep hover:text-white hover:border-brand-rose-deep"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
