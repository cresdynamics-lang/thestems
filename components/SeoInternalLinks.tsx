import Link from "next/link";

import { HOMEPAGE_SEO_LINKS } from "@/lib/seoLinkMatrix";
import { GBP_DESTINATION_URLS } from "@/lib/gbpDestinationUrls";

const DEFAULT_LINKS = [
  { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
  { href: "/florist-nairobi", label: "Florist Nairobi" },
  { href: "/flowers-and-gifts-nairobi", label: "Flowers and gifts" },
  { href: "/gift-hampers-nairobi", label: "Gift hampers Nairobi" },
  { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
  { href: "/flower-delivery-westlands-nairobi", label: "Westlands delivery" },
  { href: "/flower-delivery-kilimani-nairobi", label: "Kilimani delivery" },
  { href: "/flower-delivery-lavington-nairobi", label: "Lavington delivery" },
  { href: "/flower-delivery-upper-hill-nairobi", label: "Upper Hill delivery" },
  { href: "/contact", label: "Contact & order" },
];

/** Re-export for consumers that want the canonical homepage / GBP maps */
export { HOMEPAGE_SEO_LINKS, GBP_DESTINATION_URLS };

interface SeoInternalLinksProps {
  title?: string;
  links?: { href: string; label: string }[];
}

export default function SeoInternalLinks({
  title = "Popular services in Nairobi",
  links = DEFAULT_LINKS,
}: SeoInternalLinksProps) {
  return (
    <nav
      aria-label="Related pages"
      className="mt-10 md:mt-14 rounded-xl border border-brand-gray-200 bg-white p-5 md:p-6"
    >
      <h2 className="font-heading font-bold text-lg md:text-xl text-brand-gray-900 mb-3">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block rounded-full border border-brand-gray-200 px-3 py-1.5 text-sm text-brand-gray-800 hover:border-brand-green hover:text-brand-green transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
