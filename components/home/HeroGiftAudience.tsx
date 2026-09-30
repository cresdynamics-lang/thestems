import Link from "next/link";
import { HERO_GIFT_AUDIENCES } from "@/lib/navTaxonomy";

/** Gift-audience links stacked vertically — mapped to Occasions / Gifts hubs. */
export default function HeroGiftAudience() {
  return (
    <div className="mb-4 sm:mb-5 flex flex-col items-start gap-2 max-w-xs">
      {HERO_GIFT_AUDIENCES.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start rounded-full border border-brand-rose-deep/35 bg-white/85 px-3.5 py-2 text-[12px] sm:text-sm font-medium text-brand-rose-deep shadow-sm backdrop-blur-sm transition hover:bg-brand-rose-deep hover:text-white hover:border-brand-rose-deep"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
