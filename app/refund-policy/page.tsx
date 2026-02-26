import type { Metadata } from "next";

const siteName = "The Stems Flowers";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Refund Policy | The Stems Flowers Nairobi",
  description:
    "Refund and returns policy for The Stems Flowers orders, including flowers, chocolates, wines, teddy bears and gift hampers delivered in Nairobi, Kenya.",
  alternates: {
    canonical: `${baseUrl}/refund-policy`,
  },
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-brand-blush">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-6">
          Refund &amp; Returns Policy
        </h1>
        <p className="text-brand-gray-600 text-sm md:text-base mb-6">
          Because our products are fresh, made-to-order and often perishable, we handle refunds and returns
          carefully to protect product quality while still doing our best to make things right if something
          goes wrong. Please read this policy before placing an order with {siteName}.
        </p>

        <section className="space-y-5 text-sm md:text-base text-brand-gray-700">
          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              1. General Policy
            </h2>
            <p>
              All purchases made from {siteName} are considered final sale. We do not offer cash refunds or
              returns for change of mind, late changes to orders, or where the product was delivered in good
              condition to the address and contact details you provided.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              2. Wrong Item or Major Error in Order
            </h2>
            <p>
              If you receive a significantly wrong item (for example, a completely different product from
              what was ordered), please contact us within <strong>1 hour</strong> of delivery with clear
              photos of the item and the order reference. We will investigate and, where we agree there has
              been a genuine mistake on our side, we will:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Arrange a replacement, correction or partial remake where practical; or</li>
              <li>Offer store credit or a partial refund, at our discretion, depending on the situation.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              3. Freshness, Damage &amp; Quality Concerns
            </h2>
            <p>
              We take great care to ensure flowers and gifts leave our shop in excellent condition. If you
              believe your order is damaged or not fresh on arrival, please:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Contact us within <strong>1 hour</strong> of delivery; and</li>
              <li>Share clear photos of the product (including packaging, if possible).</li>
            </ul>
            <p className="mt-2">
              We will assess the situation and, if we agree that the product was faulty on arrival, we will
              arrange a replacement or store credit. Because flowers and many gift items are perishable, we
              cannot accept returns once they have been used, unwrapped for display, or kept for an extended
              period after delivery.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              4. Non‑Returnable &amp; Non‑Refundable Items
            </h2>
            <p>The following items and situations are generally not eligible for return or refund:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Fresh flowers, bouquets, plants and other perishable arrangements;</li>
              <li>Chocolates, wines and food items once delivered in good condition;</li>
              <li>
                Custom or personalised gifts (for example, custom messages, engraved items or bespoke designs);
              </li>
              <li>Orders delivered to the correct address where the recipient is unavailable or refuses delivery;</li>
              <li>Sale items, discounted promotions or gift cards/vouchers.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              5. Delivery Issues &amp; Incorrect Details
            </h2>
            <p>
              We rely on the delivery address, phone number and delivery date you provide at checkout. We
              cannot be held responsible for failed or delayed deliveries caused by:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Incorrect, incomplete or unclear delivery addresses;</li>
              <li>Incorrect or unreachable recipient phone numbers;</li>
              <li>Recipient not available at the address within the delivery window;</li>
              <li>Events beyond our control (for example, extreme weather or major traffic disruptions).</li>
            </ul>
            <p className="mt-2">
              In such cases, we will do our best to assist (for example, by arranging a re‑delivery at an
              additional fee), but we are not obliged to offer a refund.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              6. How to Contact Us About an Issue
            </h2>
            <p>
              If you experience a problem with your order, please contact us as soon as possible with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your full name and phone number;</li>
              <li>Order number or M-Pesa/transaction reference;</li>
              <li>Clear photos of the item and packaging (where relevant);</li>
              <li>A short description of the issue.</li>
            </ul>
            <p className="mt-2">
              You can reach us using the details on our{" "}
              <a href="/contact" className="text-brand-green hover:text-brand-red underline decoration-dotted">
                Contact page
              </a>
              . This helps us investigate quickly and decide the most appropriate solution.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Refund &amp; Returns Policy from time to time. The latest version will
              always be available on this page. Your continued use of our website or services after any
              updates means you accept the revised policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

