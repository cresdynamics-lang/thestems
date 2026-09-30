import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import type { NavLeaf } from "@/lib/navTaxonomy";
import { whatsappUrl } from "@/lib/contact";

type HubPageProps = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  leaves: NavLeaf[];
  skipLabels?: string[];
  shopHref?: string;
  shopLabel?: string;
};

export function hubMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { title, description, url: `${SITE_URL}${path}` },
  };
}

export default function CategoryHubView({
  h1,
  intro,
  leaves,
  skipLabels = [],
  shopHref,
  shopLabel = "Shop collection",
}: HubPageProps) {
  const items = leaves.filter((l) => !skipLabels.includes(l.label));
  const wa = whatsappUrl(`Hello! I'm browsing ${h1} and need help choosing.`);

  return (
    <div className="bg-brand-blush py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-3">
          {h1}
        </h1>
        <p className="text-brand-gray-700 mb-6 text-base md:text-lg">{intro}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {shopHref ? (
            <Link href={shopHref} className="btn-primary text-sm">
              {shopLabel}
            </Link>
          ) : null}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#20BA5A]"
          >
            WhatsApp order
          </a>
        </div>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-brand-gray-200 bg-white px-4 py-3 text-brand-gray-900 font-medium hover:border-brand-rose-deep hover:text-brand-rose-deep transition-colors"
              >
                {item.label}
                <span className="text-brand-gray-400 text-sm">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
