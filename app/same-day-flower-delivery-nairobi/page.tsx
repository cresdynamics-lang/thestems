import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Same Day Flower Delivery Nairobi — Order by 4PM | The Stems Flowers",
  description:
    "Same-day flower delivery anywhere in Nairobi. Order by 4PM for delivery today. Fresh roses, bouquets and gift hampers. Pay with M-Pesa. The Stems Flowers, Nairobi CBD.",
};

export default function SameDayFlowerDeliveryNairobiPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-brand-blush">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Same-Day Flower Delivery in Nairobi — Order by 4PM
        </h1>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          How Same-Day Delivery Works
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Life in Nairobi moves quickly — birthdays get forgotten, last-minute meetings pop up and sometimes you simply decide
          you want to surprise someone today. Our same-day flower delivery service is built exactly for those moments. Place
          your order by 4PM and The Stems Flowers will prepare and dispatch your bouquet, hamper or teddy bear gift for
          delivery the very same day.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          The process is simple: choose your flowers or gift hamper online, add your personalised message, enter the delivery
          details and pay via M-Pesa. Our florists in Nairobi CBD then hand-arrange the bouquet and hand it over to our
          dedicated riders. You&apos;ll receive confirmation once the order is on the way, and the recipient will get a call on
          arrival.
        </p>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          Delivery Areas — All Nairobi Covered
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          From our shop at Delta Hotel, University Way, we deliver same day to Nairobi CBD, Westlands, Karen, Kilimani,
          Lavington, Kileleshwa, South B, South C, Industrial Area, Parklands, Runda, Langata and many more Nairobi estates.
          CBD deliveries are often free or low-cost, while other areas are priced fairly based on distance. If you&apos;re not
          sure whether we cover your location, just reach out on WhatsApp and our team will confirm.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          For orders placed after 4PM, we normally schedule delivery for the next day to keep quality and timing consistent.
          However, if it&apos;s urgent, contact us directly — we can sometimes arrange late same-day deliveries within Nairobi
          depending on rider availability.
        </p>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          Pay with M-Pesa — Instant Confirmation
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          Same-day orders are paid using M-Pesa for speed and security. At checkout you&apos;ll see our Till 4202044 and
          Paybill 880100 (Account 433587) details clearly displayed. Once payment is received, our team gets to work
          immediately on your flowers or gift hamper. You can also pay in-store by card or cash if you prefer to walk into our
          Nairobi CBD florist and book delivery in person.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link href="/collections/flowers" className="btn-primary text-sm md:text-base">
            Order Same-Day Flowers in Nairobi
          </Link>
          <Link href="https://wa.me/254725707143" className="btn-outline text-sm md:text-base">
            WhatsApp for Urgent Delivery
          </Link>
        </div>
      </div>
    </div>
  );
}

