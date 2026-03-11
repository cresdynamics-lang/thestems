import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White Roses Nairobi — Wedding & Sympathy White Rose Bouquets | The Stems Flowers",
  description:
    "White roses delivered in Nairobi for weddings, funerals, sympathy and new beginnings. Fresh white rose bouquets from The Stems Flowers, University Way CBD. M-Pesa accepted.",
};

export default function WhiteRosesNairobiPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-brand-blush">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          White Roses in Nairobi — Weddings, Sympathy &amp; Celebration
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          White roses represent purity, new beginnings, peace and remembrance. In Nairobi, they are frequently chosen for
          weddings, church ceremonies, christenings and sympathy occasions such as funerals and condolence visits. Their calm,
          elegant colour makes them suitable when you want to express respect, support and quiet strength.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          The Stems Flowers designs white rose bouquets and arrangements for both joyful and sensitive moments. For weddings in
          Nairobi, we create bridal bouquets, reception flowers and car decor that combine white roses with greenery and soft
          accent blooms. For sympathy occasions, we prepare simple, dignified white rose arrangements that can be delivered to
          homes, churches or funeral venues across Nairobi.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          From our shop at Delta Hotel, University Way in Nairobi CBD, we offer same-day delivery of white rose bouquets to
          Westlands, Karen, Lavington, Kilimani, South B, Parklands and all surrounding neighbourhoods. You can also combine
          white roses with our wedding car decor service to create a complete bridal car look for your big day.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          Payment is available via M-Pesa and card, and our team is on WhatsApp to help you choose the right white rose
          arrangement for any Nairobi occasion — whether it&apos;s a wedding celebration or a moment of condolence.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link
            href="/collections/flowers?tags=white%20roses"
            className="btn-primary text-sm md:text-base"
          >
            Shop White Rose Bouquets in Nairobi
          </Link>
          <Link
            href="/wedding-car-decor-nairobi"
            className="btn-outline text-sm md:text-base"
          >
            View Wedding Car Decor in Nairobi
          </Link>
        </div>
      </div>
    </div>
  );
}

