import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const baseUrl = "https://thestemsflowers.co.ke";
const pageUrl = `${baseUrl}/send-gifts-to-kenya`;

export const metadata: Metadata = {
  title: "Send Gifts to Kenya | Flowers and Hampers Nairobi | The Stems",
  description:
    "Send flowers, gift hampers, wines and teddy bears to loved ones in Kenya. The Stems offers secure online ordering and same-day delivery in Nairobi for diaspora buyers in UK, USA, Canada and Europe.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Send Gifts to Kenya | Nairobi Flower and Gift Delivery",
    description:
      "Order gifts online for delivery in Nairobi and across Kenya. Perfect for diaspora families sending flowers and hampers home.",
    url: pageUrl,
    type: "website",
  },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Send Gifts to Kenya",
  description:
    "Send flowers, gift hampers, wines and teddy bears to loved ones in Kenya.",
  url: pageUrl,
};

export default function SendGiftsToKenyaPage() {
  return (
    <>
      <JsonLd data={pageJsonLd} />
      <div className="bg-brand-blush py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
            Send Gifts to Kenya from Abroad
          </h1>
          <p className="text-brand-gray-700 text-base md:text-lg mb-6">
            If you are in the UK, USA, Canada, Belgium or elsewhere and want to send a meaningful gift home,
            The Stems helps you deliver fresh flowers, curated gift hampers, wines and teddy bears in Nairobi.
            Secure online ordering and fast local delivery make it easy to celebrate birthdays, anniversaries and
            family milestones from anywhere.
          </p>

          <div className="rounded-xl bg-white p-5 md:p-6 border border-brand-gray-200 mb-6">
            <h2 className="font-heading font-semibold text-xl text-brand-gray-900 mb-3">Why diaspora buyers use The Stems</h2>
            <ul className="list-disc pl-5 text-brand-gray-700 space-y-2">
              <li>Easy online ordering with local Nairobi fulfillment</li>
              <li>Same-day delivery options in Nairobi</li>
              <li>Gift options for birthdays, anniversaries and corporate occasions</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/collections" className="inline-flex w-full sm:w-auto justify-center items-center rounded-md bg-brand-green px-4 py-3 text-sm font-medium text-white hover:bg-brand-green/90">
              Browse Collections
            </Link>
            <Link href="/collections/gift-hampers" className="inline-flex w-full sm:w-auto justify-center items-center rounded-md border border-brand-gray-300 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:bg-brand-gray-100">
              Gift Hampers
            </Link>
            <a
              href="https://wa.me/254113700549"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto justify-center items-center rounded-md border border-brand-gray-300 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:bg-brand-gray-100"
            >
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
