import Link from "next/link";
import { HERO_GIFT_AUDIENCES } from "@/lib/navTaxonomy";

/**
 * Magenta product-categories card — left of hero (gift-shop style filter panel).
 * Women's / Girlfriend / Men's gifts first, then overlapping shop filters.
 */
export default function HeroGiftAudience() {
  return (
    <nav
      aria-label="Product categories"
      className="w-full max-w-[240px] shrink-0 overflow-hidden rounded-xl bg-brand-rose-deep text-white shadow-[0_12px_40px_-12px_rgba(190,24,93,0.55)]"
    >
      <div className="px-4 py-3.5 border-b border-dashed border-amber-300/70">
        <h2 className="font-heading text-sm sm:text-base font-bold tracking-wide text-white">
          Product Categories
        </h2>
      </div>
      <ul className="py-1">
        {HERO_GIFT_AUDIENCES.map((item) => (
          <li key={item.label} className="border-b border-dashed border-amber-300/50 last:border-b-0">
            <Link
              href={item.href}
              className="block px-4 py-2.5 text-[13px] sm:text-sm font-medium text-white/95 transition-colors hover:bg-white/15 hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
