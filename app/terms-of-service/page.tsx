import type { Metadata } from "next";

const siteName = "The Stems Flowers";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Terms & Conditions | The Stems Flowers Nairobi",
  description:
    "Terms and conditions for using The Stems Flowers website and purchasing flowers, gift hampers, wines, chocolates and teddy bears in Nairobi, Kenya.",
  alternates: {
    canonical: `${baseUrl}/terms-of-service`,
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-brand-blush">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-6">
          Terms &amp; Conditions
        </h1>
        <p className="text-brand-gray-600 text-sm md:text-base mb-6">
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the {siteName} website
          ({baseUrl}) and any order you place with us for flowers, gifts, hampers, wines, chocolates and
          related services. By accessing the site or placing an order, you agree to be bound by these Terms.
        </p>

        <section className="space-y-4 text-sm md:text-base text-brand-gray-700">
          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              1. About The Stems Flowers
            </h2>
            <p>
              This website is operated by {siteName} in Nairobi, Kenya. Throughout the site, &quot;we&quot;,
              &quot;us&quot; and &quot;our&quot; refer to {siteName}. We provide this website, our
              information, products and delivery services subject to your acceptance of these Terms and our
              other policies referenced here (including our Refund Policy and Privacy Policy).
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              2. Eligibility &amp; Account Details
            </h2>
            <p>
              By using our website or placing an order, you confirm that you are at least 18 years old (or
              the age of majority in your jurisdiction) and that you have capacity to enter into a binding
              contract. You agree to provide current, complete and accurate information when creating an
              order, including your name, phone number, email, delivery address and any recipient details.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              3. Use of Our Website
            </h2>
            <p>
              You agree not to use our website or services for any unlawful purpose, to violate any Kenyan
              law or regulation, or to transmit any malicious code. You may not copy, resell or exploit any
              part of the Service without our prior written consent. We reserve the right to refuse service
              or cancel orders where we reasonably suspect fraud, abuse or misuse of the site.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              4. Product Information &amp; Availability
            </h2>
            <p>
              We make every effort to display our products and prices accurately. Because flowers and gifts
              are perishable and seasonal, actual arrangements may vary slightly from the photos shown.
              Substitutions of flowers, packaging or accessories may be necessary to ensure freshness,
              quality or timely delivery. All products and prices are subject to change without notice and
              may be limited by stock or delivery area.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              5. Orders, Pricing &amp; Payment
            </h2>
            <p>
              All prices are listed in Kenyan Shillings (KES) and include VAT where applicable. Delivery fees
              are shown at checkout based on your delivery location. An order is only confirmed once payment
              has been successfully received via M-Pesa, card, bank, or any other method we may support.
              We reserve the right to cancel or refuse any order (for example due to stock issues, incorrect
              pricing, or suspected fraud). If we cancel an order after payment, we will notify you and offer
              an alternative or a refund in line with our Refund Policy.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              6. Delivery &amp; Recipient Information
            </h2>
            <p>
              You are responsible for providing a complete and accurate delivery address, contact phone
              number and delivery date. We will deliver within the agreed delivery window but cannot guarantee
              an exact time. If the recipient is unavailable, we may:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Leave the order with a receptionist, security guard, neighbor or colleague where reasonable;</li>
              <li>Attempt to contact you or the recipient to rearrange delivery; or</li>
              <li>Return the order to our shop for collection where no suitable alternative is available.</li>
            </ul>
            <p className="mt-2">
              Additional delivery attempts or address changes may incur extra charges. We are not responsible
              for delays caused by incorrect addresses, unreachable phone numbers, severe weather or other
              events beyond our control.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              7. Flowers, Perishables &amp; Alcohol
            </h2>
            <p>
              Our products may include fresh flowers, food items, chocolates, wines and other perishable
              goods. These should be handled and stored according to our care instructions. Where baskets or
              hampers include alcoholic beverages, you confirm that you and the recipient are of legal
              drinking age in Kenya. We reserve the right to refuse delivery of alcohol where proof of age
              is not available.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              8. Cancellations, Returns &amp; Refunds
            </h2>
            <p>
              Because most of our products are made-to-order and perishable, cancellations, returns and
              refunds are handled strictly in line with our{" "}
              <a
                href="/refund-policy"
                className="text-brand-green hover:text-brand-red underline decoration-dotted"
              >
                Refund Policy
              </a>
              . Please review it carefully before placing an order.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              9. Third‑Party Services &amp; Links
            </h2>
            <p>
              Our website may link to third‑party payment providers, maps, social media or other websites.
              We are not responsible for the content, policies or practices of those third‑party sites. Any
              use of third‑party services is at your own risk and subject to the terms and policies of those
              providers.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              10. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by Kenyan law, {siteName} and its directors, employees and
              agents will not be liable for any indirect, incidental, special or consequential loss arising
              from your use of our website or services, including but not limited to loss of profits, loss of
              data, or delays in delivery, except where directly caused by our gross negligence or willful
              misconduct. Our total liability in any claim will be limited to the value of the order in
              question.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              11. Governing Law
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of Kenya. Any disputes
              arising from or relating to these Terms or your use of our services shall be subject to the
              exclusive jurisdiction of the Kenyan courts.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. The latest version will always be available on
              this page. Your continued use of the website or our services after any changes are posted
              constitutes your acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
              13. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms &amp; Conditions, please contact us using the
              details on our{" "}
              <a href="/contact" className="text-brand-green hover:text-brand-red underline decoration-dotted">
                Contact page
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

