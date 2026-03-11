import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wedding Car Decor Nairobi — Bridal Car Flower Decoration | The Stems Flowers",
  description:
    "Wedding car decoration with fresh flowers in Nairobi. Elegant bridal car decor from KSh 6,000. Professional setup. The Stems Flowers at Delta Hotel, University Way, Nairobi.",
};

export default function WeddingCarDecorNairobiPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Wedding Car Decor in Nairobi — Fresh Flower Bridal Car Decoration
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Your bridal car is one of the most photographed parts of your wedding day in Nairobi. Elegant wedding car decor makes
          every arrival and departure feel special, and it ties your photos together beautifully. The Stems Flowers offers
          professional wedding car flower decoration, designed and installed from our Nairobi CBD base at Delta Hotel,
          University Way.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          A typical bridal car decor package starts from around KSh 6,000 and includes fresh flower arrangements across the
          bonnet, door handles and sometimes the rear of the car, depending on your preferred style. We work with roses and
          complementary blooms in colours that match your wedding theme — from classic white and green to soft blush, pink or
          deeper romantic tones.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Booking is simple: share your wedding date, time, venue and preferred car model with us in advance. On the wedding
          day, you can bring the car to our Nairobi CBD shop or we can travel to an agreed central location for on-site setup.
          Our team handles installation and removal so you don&apos;t have to worry about logistics while you&apos;re getting
          ready.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          Payment can be made via M-Pesa and confirmed over WhatsApp, making it easy to finalise your booking even if you&apos;re
          planning from outside Nairobi. With almost no dedicated competition for “wedding car decor Nairobi”, this specialised
          service from The Stems Flowers helps your wedding stand out in the city.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link
            href="/product/wedding-car-decor"
            className="btn-primary text-sm md:text-base"
          >
            View Wedding Car Decor Product
          </Link>
          <Link
            href="https://wa.me/254725707143"
            className="btn-outline text-sm md:text-base"
          >
            Book Wedding Car Decor on WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}

