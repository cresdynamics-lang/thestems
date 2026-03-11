import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florist Nairobi CBD — Fresh Flowers at Delta Hotel, University Way | The Stems Flowers",
  description:
    "Nairobi CBD florist at Delta Hotel, University Way. Fresh roses, bouquets and gift hampers. Walk in or order online with same-day delivery. Pay M-Pesa. Mon–Sat 8AM–8PM.",
};

export default function FloristNairobiCBDPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Florist in Nairobi CBD — The Stems Flowers, Delta Hotel, University Way
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          The Stems Flowers is a Nairobi CBD florist located at Delta Hotel, University Way — right in the heart of the city.
          From this central location we serve walk-in customers and online orders for fresh roses, mixed flower bouquets, gift
          hampers and teddy bears. Whether you work in town, are visiting the CBD or simply want a trusted florist in the
          centre of Nairobi, The Stems Flowers is designed to be your go-to flower shop.
        </p>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          Walk In or Order Online — Nairobi CBD Flower Shop
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          When you visit our shop at Delta Hotel, University Way, you&apos;ll find a full range of ready-made bouquets and
          custom arrangements. Our florists can quickly build a bouquet while you wait, or help you select a gift hamper and
          teddy bear combination for birthdays, anniversaries and apologies. If you prefer to order online, our website lets
          you browse flowers, hampers and teddy bears from anywhere in Nairobi and checkout securely with M-Pesa.
        </p>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          Same-Day Delivery Across Nairobi from University Way
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Orders placed before 4PM can be delivered the same day across Nairobi. From our Nairobi CBD base we send drivers to
          Westlands, Karen, Kilimani, Lavington, South B, Runda, Parklands and many more estates every day. Every bouquet and
          hamper leaves our shop freshly prepared so it arrives looking just as good as it does in our displays. If you&apos;re
          in the CBD, we can also prepare orders for quick collection from Delta Hotel.
        </p>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          Fresh Roses, Hampers and Teddy Bears — Nairobi City Centre
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Our Nairobi florist range includes red roses, pink roses, white roses, mixed bouquets, money bouquets, luxury gift
          hampers and soft teddy bears in multiple sizes. You can combine flowers with chocolates, wine or teddy bears to build
          a complete surprise for birthdays, anniversaries, apologies or just-because moments. Payment is simple via M-Pesa
          Till 4202044 or Paybill 880100, and we&apos;re open Monday to Saturday from 8AM to 8PM to serve both walk-in and
          online customers.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          If you&apos;re searching for a “florist Nairobi CBD” with reliable service and same-day delivery, The Stems Flowers
          at Delta Hotel, University Way is ready to help you send the perfect gift anywhere in Nairobi.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link href="/collections/flowers" className="btn-primary text-sm md:text-base">
            Shop Flowers from Nairobi CBD
          </Link>
          <Link href="https://wa.me/254725707143" className="btn-outline text-sm md:text-base">
            WhatsApp The Stems Flowers Nairobi CBD
          </Link>
        </div>
      </div>
    </div>
  );
}

