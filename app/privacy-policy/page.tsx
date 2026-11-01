import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import { SHOP_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How The Stems Flowers collects, uses and protects your personal data when you order flowers and gifts, chat with us or browse our website.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. What we collect",
    body: (
      <ul className="list-disc list-inside space-y-1">
        <li>Your name, phone number and email address when you order, subscribe or contact us</li>
        <li>Recipient details you give us for delivery: name, phone number, address and gift message</li>
        <li>Order details: items, amounts, delivery date and payment status</li>
        <li>Messages you send through our chat, WhatsApp, email or contact form</li>
        <li>Browsing data such as pages viewed, device type, approximate location and referring website</li>
      </ul>
    ),
  },
  {
    heading: "2. How we use it",
    body: (
      <ul className="list-disc list-inside space-y-1">
        <li>To prepare and deliver your order and to contact you or the recipient about it</li>
        <li>To confirm payments and send order updates</li>
        <li>To answer your questions and handle complaints or refund requests</li>
        <li>To send offers, only if you subscribed; you can unsubscribe at any time</li>
        <li>To understand how our website is used, improve it and measure our advertising</li>
      </ul>
    ),
  },
  {
    heading: "3. Who we share it with",
    body: (
      <>
        <p>We do not sell your personal data. We share it only as needed with:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Our delivery riders, who receive what they need to complete the delivery</li>
          <li>Payment providers, including Pesapal and M-Pesa, who process your payment</li>
          <li>Email and chat providers, including Resend and Tawk.to, and WhatsApp when you message us there</li>
          <li>Google Analytics and Meta (Facebook Pixel), who help us measure site use and advertising</li>
          <li>Authorities, where the law requires it</li>
        </ul>
      </>
    ),
  },
  {
    heading: "4. Cookies and similar tools",
    body: (
      <p>
        We use cookies and browser storage to keep your cart and currency choice, and to run analytics and
        advertising measurement. You can block or delete cookies in your browser settings, though parts of
        the site such as the cart may stop working properly.
      </p>
    ),
  },
  {
    heading: "5. How long we keep it",
    body: (
      <p>
        We keep order records for as long as we need them to serve you and to meet tax, accounting and legal
        requirements. We keep other data only as long as it is useful for the purpose it was collected for.
      </p>
    ),
  },
  {
    heading: "6. Your rights",
    body: (
      <p>
        Under Kenya&apos;s Data Protection Act, 2019, you can ask to see the personal data we hold about you,
        correct it, ask us to delete it, or object to its use, including for marketing. You may also complain
        to the Office of the Data Protection Commissioner.
      </p>
    ),
  },
  {
    heading: "7. Sending a gift to someone else",
    body: (
      <p>
        When you order for another person, you give us their details so we can deliver the gift. Please only
        share details you are entitled to share.
      </p>
    ),
  },
  {
    heading: "8. Changes and contact",
    body: (
      <p>
        We may update this policy, and the latest version will always be on this page. For any privacy
        question, email <a href={`mailto:${SHOP_INFO.email}`} className="underline">{SHOP_INFO.email}</a>, call{" "}
        <a href={`tel:+${SHOP_INFO.phone}`} className="underline">+{SHOP_INFO.phone}</a> or visit us at{" "}
        {SHOP_INFO.address}. See also our <Link href="/terms-of-service" className="underline">terms</Link> and{" "}
        <Link href="/refund-policy" className="underline">refund policy</Link>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-blush">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-brand-gray-600 text-sm md:text-base mb-6">
          This policy explains how {SHOP_INFO.name} handles personal data when you use our website, place an
          order or contact us.
        </p>
        <section className="space-y-5 text-sm md:text-base text-brand-gray-700">
          {SECTIONS.map((s) => (
            <div key={s.heading}>
              <h2 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">{s.heading}</h2>
              {s.body}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
