import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pink Roses Nairobi — Fresh Pink Rose Bouquets Delivered | The Stems Flowers",
  description:
    "Order pink roses in Nairobi same day. Baby pink, hot pink and blush rose bouquets for birthdays, Women's Day and Mother's Day. The Stems Flowers at Delta Hotel, Nairobi CBD.",
};

export default function PinkRosesNairobiPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Pink Roses in Nairobi — Same-Day Delivery
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Pink roses carry a softer message than red: admiration, gratitude, sweetness and appreciation. They are the perfect
          choice when you want to say “thank you”, “I appreciate you” or “you mean a lot to me” to someone in Nairobi. Pink
          rose bouquets are especially popular for birthdays, Women&apos;s Day in March and Mother&apos;s Day in May.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          At The Stems Flowers Nairobi, we design baby pink, blush and hot pink rose arrangements that feel feminine,
          uplifting and celebratory. Our Blush and Bloom Dreams bouquet highlights soft baby pink tones, while collections like
          Radiant Love blend pink and red roses for a romantic, yet cheerful, look. Each bouquet is hand-arranged at our Delta
          Hotel, University Way shop and wrapped beautifully for delivery.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Same-day delivery is available across Nairobi when you order pink roses by 4PM. Whether you&apos;re sending flowers
          to Westlands, Karen, Kilimani, Lavington, South B, Parklands or within Nairobi CBD, our team ensures every stem is
          fresh and every bouquet arrives looking just like the photos. You can also add chocolates, teddy bears or a gift
          hamper to turn your bouquet into a complete surprise.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          Payment is simple and secure via M-Pesa, and our customer service team is available on WhatsApp to help you choose
          the right pink rose bouquet for any Nairobi occasion.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link
            href="/collections/flowers?tags=pink%20roses"
            className="btn-primary text-sm md:text-base"
          >
            Shop Pink Rose Bouquets in Nairobi
          </Link>
          <Link
            href="https://wa.me/254725707143"
            className="btn-outline text-sm md:text-base"
          >
            Chat on WhatsApp for Pink Roses
          </Link>
        </div>
      </div>
    </div>
  );
}

