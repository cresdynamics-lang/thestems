import type { Metadata } from "next";
import Link from "next/link";
import { GIFTS_NAV } from "@/lib/navTaxonomy";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gifts Nairobi | Teddy Bears, Hampers, Chocolates & More | The Stems",
  description:
    "Shop gifts in Nairobi: teddy bears, gift hampers, chocolates, wines and flower combos. Same-day delivery from The Stems Flowers CBD.",
  alternates: { canonical: `${SITE_URL}/gifts` },
};

export default function GiftsHubPage() {
  return (
    <div className="bg-brand-blush py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-3">
          Gifts in Nairobi
        </h1>
        <p className="text-brand-gray-700 mb-8 text-base md:text-lg">
          Flowers, teddy bears, gift hampers, chocolates and more — curated gifts with same-day
          delivery across Nairobi from The Stems Flowers.
        </p>
        <ul className="flex flex-col gap-2">
          {GIFTS_NAV.filter((l) => l.label !== "All Gifts").map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-brand-gray-200 bg-white px-4 py-3 text-brand-gray-900 font-medium hover:border-brand-rose-deep hover:text-brand-rose-deep transition-colors"
              >
                {item.label}
                <span className="text-brand-gray-400 text-sm">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
