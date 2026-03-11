import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anniversary Flowers Nairobi — Roses & Hampers Delivered Same Day | The Stems Flowers",
  description:
    "Anniversary flowers delivered in Nairobi same day. Red roses, luxury hampers and romantic bouquets. From KSh 3,000. The Stems Flowers, Nairobi CBD. Pay with M-Pesa.",
};

export default function AnniversaryFlowersNairobiPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-brand-blush">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Anniversary Flowers in Nairobi — Delivered Same Day
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Anniversaries deserve more than a quick text or last-minute gesture. Fresh flowers and thoughtfully chosen gifts show
          that you remember, care and are willing to put in effort. In Nairobi, red roses remain the number one choice for
          anniversaries, but many couples now pair flowers with luxury hampers, chocolates and teddy bears to make the moment
          unforgettable.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          At The Stems Flowers, we create anniversary bouquets ranging from compact romantic arrangements to grand multi-dozen
          rose displays. Our 80-rose Sunset Romance and 60-rose Sweet Whisper style bouquets are ideal for milestone years —
          they fill a room and photograph beautifully. You can also add Ferrero Rocher chocolates, wine or a curated gift
          hamper to turn a bouquet into a complete anniversary surprise delivered anywhere in Nairobi.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Same-day delivery is available when you order by 4PM. From our Nairobi CBD base at Delta Hotel, University Way, we
          deliver anniversary flowers to Westlands, Karen, Lavington, Kilimani, South B, Parklands, Runda and most Nairobi
          estates. Every bouquet is hand-arranged just before dispatch to keep the roses fresh and vibrant on arrival.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          Payment is fast and secure via M-Pesa, and you can include a personal message card with every order. Whether it&apos;s
          your first year together or your 25th wedding anniversary, The Stems Flowers helps Nairobi couples mark the occasion
          in a way that feels special.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link
            href="/collections/flowers?tags=anniversary"
            className="btn-primary text-sm md:text-base"
          >
            Shop Anniversary Flowers in Nairobi
          </Link>
          <Link
            href="/collections/gift-hampers?tags=anniversary"
            className="btn-outline text-sm md:text-base"
          >
            View Anniversary Gift Hampers
          </Link>
        </div>
      </div>
    </div>
  );
}

