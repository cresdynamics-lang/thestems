import Link from "next/link";

const DEFAULT_LINKS = [
  { href: "/collections/flowers", label: "Flower delivery Nairobi" },
  { href: "/collections/gift-hampers", label: "Gift hampers Nairobi" },
  { href: "/flower-delivery-westlands-nairobi", label: "Westlands delivery" },
  { href: "/flower-delivery-kilimani-nairobi", label: "Kilimani delivery" },
  { href: "/flower-delivery-karen-nairobi", label: "Karen delivery" },
  { href: "/flower-delivery-nairobi-cbd", label: "Nairobi CBD delivery" },
  { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
  { href: "/contact", label: "Contact & order" },
];

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
