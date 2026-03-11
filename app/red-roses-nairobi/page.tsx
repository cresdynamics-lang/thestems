import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Red Roses Nairobi — Fresh Red Rose Bouquets Delivered Same Day | The Stems Flowers",
  description:
    "Order fresh red roses in Nairobi with same-day delivery. Red rose bouquets from KSh 2,500. Perfect for anniversaries, birthdays and romance. The Stems Flowers, Nairobi CBD.",
};

export default function RedRosesNairobiPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-brand-blush">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Red Roses in Nairobi — Delivered Same Day
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Red roses are the classic symbol of love, passion and deep romance. In Nairobi, they remain the most requested flower
          for anniversaries, proposals, birthdays and just-because surprises. Kenya is one of the world&apos;s top rose
          growers, which means The Stems Flowers can source fresh, high-quality red roses every day for delivery across
          Nairobi.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          At The Stems Flowers in Nairobi CBD, we create red rose bouquets in different stem counts — from thoughtful 20-stem
          bunches to grand 80-stem arrangements for milestone anniversaries. Each bouquet is hand-tied and finished with
          elegant wrapping so it looks impressive the moment it arrives. Whether you&apos;re sending a romantic surprise to
          your partner in Westlands, Karen, Kilimani, Lavington, South B, Parklands or within Nairobi CBD, our team makes sure
          every rose arrives fresh and vibrant.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Same-day delivery is available across Nairobi when you order by 4PM. Pay securely with M-Pesa and we&apos;ll take
          care of the rest from our Delta Hotel, University Way shop. For the best experience, include a short heartfelt
          message and choose the stem count that matches the occasion — 20–30 stems for a sweet surprise, 40–60 stems for
          anniversaries and 80 stems for big romantic gestures.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          Ready to send red roses in Nairobi today? Browse our red rose bouquets and place your order online — we&apos;ll
          deliver straight to their home, office or venue.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link
            href="/collections/flowers?tags=red%20roses"
            className="btn-primary text-sm md:text-base"
          >
            Shop Red Rose Bouquets in Nairobi
          </Link>
          <Link
            href="https://wa.me/254725707143"
            className="btn-outline text-sm md:text-base"
          >
            WhatsApp The Stems Flowers Nairobi
          </Link>
        </div>
      </div>
    </div>
  );
}

