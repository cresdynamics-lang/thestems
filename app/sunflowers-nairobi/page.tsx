import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryLandingPage from "@/components/CategoryLandingPage";
import { getCategoryLanding } from "@/lib/categoryLandings";
import { SITE_URL } from "@/lib/seo";

const SLUG = "sunflowers-nairobi";
const config = getCategoryLanding(SLUG);

export const metadata: Metadata = config
  ? {
      title: config.metaTitle,
      description: config.metaDescription,
      alternates: { canonical: `${SITE_URL}/${SLUG}` },
      openGraph: {
        title: config.metaTitle,
        description: config.metaDescription,
        url: `${SITE_URL}/${SLUG}`,
      },
    }
  : {};

export default function Page() {
  if (!config) notFound();
  return <CategoryLandingPage config={config} />;
}
