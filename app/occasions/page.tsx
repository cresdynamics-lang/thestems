import type { Metadata } from "next";
import Link from "next/link";
import { OCCASIONS_NAV } from "@/lib/navTaxonomy";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Flower Occasions Nairobi | Birthday, Anniversary & More | The Stems",
  description:
    "Shop flowers and gifts by occasion in Nairobi: birthday, anniversary, apology, Valentine’s, get well soon and more. Same-day delivery.",
  alternates: { canonical: `${SITE_URL}/occasions` },
};

export default function OccasionsHubPage() {
  return (
    <div className="bg-brand-blush py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-3">
          Flowers & Gifts by Occasion
        </h1>
        <p className="text-brand-gray-700 mb-8 text-base md:text-lg">
          Find the right arrangement for every moment — birthday, anniversary, apology, get well
          soon, and more. Same-day flower delivery across Nairobi.
        </p>
        <ul className="flex flex-col gap-2">
          {OCCASIONS_NAV.filter((l) => l.label !== "All Occasions").map((item) => (
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
