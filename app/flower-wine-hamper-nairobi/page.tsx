import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const baseUrl = "https://thestemsflowers.co.ke";
const pageUrl = `${baseUrl}/flower-wine-hamper-nairobi`;

export const metadata: Metadata = {
  title: "Flower and Wine Hamper Nairobi | Same-Day Delivery | The Stems",
  description:
    "Send a flower and wine hamper in Nairobi with same-day delivery. Premium roses, curated wine gifts and luxury hamper options for birthdays, anniversaries and romantic surprises.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Flower and Wine Hamper Nairobi | Same-Day Delivery",
    description:
      "Shop flower and wine hampers in Nairobi for birthdays, anniversaries and romantic gifting. Same-day delivery from The Stems.",
    url: pageUrl,
    type: "website",
  },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Flower and Wine Hamper Nairobi",
  description:
    "Send a flower and wine hamper in Nairobi with same-day delivery.",
  url: pageUrl,
};

export default function FlowerWineHamperNairobiPage() {
  return (
    <>
      <JsonLd data={pageJsonLd} />
      <div className="bg-brand-blush py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
            Flower and Wine Hampers in Nairobi
          </h1>
          <p className="text-brand-gray-700 text-base md:text-lg mb-6">
            Looking for a premium flower and wine hamper in Nairobi? The Stems creates curated gift bundles
            with fresh roses, quality wines and luxury add-ons for anniversaries, birthdays, apologies and
            romantic surprises. We offer same-day delivery in Nairobi CBD and fast delivery to major neighborhoods.
          </p>

          <div className="rounded-xl bg-white p-5 md:p-6 border border-brand-gray-200 mb-6">
            <h2 className="font-heading font-semibold text-xl text-brand-gray-900 mb-3">Popular options</h2>
            <ul className="list-disc pl-5 text-brand-gray-700 space-y-2">
              <li>Rose bouquet + red wine gift hamper</li>
              <li>Anniversary flower and wine hamper sets</li>
              <li>Corporate flower and wine gifting packages</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/collections/gift-hampers" className="inline-flex w-full sm:w-auto justify-center items-center rounded-md bg-brand-green px-4 py-3 text-sm font-medium text-white hover:bg-brand-green/90">
              Shop Gift Hampers
            </Link>
            <Link href="/collections/wines" className="inline-flex w-full sm:w-auto justify-center items-center rounded-md border border-brand-gray-300 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:bg-brand-gray-100">
              Shop Wines
            </Link>
            <a
              href="https://wa.me/254113700549"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto justify-center items-center rounded-md border border-brand-gray-300 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:bg-brand-gray-100"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
