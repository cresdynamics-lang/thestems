import type { Metadata } from "next";
import AreaLandingPage from "@/components/AreaLandingPage";
import { getAreaLandingBySlug } from "@/lib/areaLandings";
import { absoluteUrl } from "@/lib/seo";

const config = getAreaLandingBySlug("flower-delivery-nairobi-cbd")!;

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: absoluteUrl(`/${config.slug}`) },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: absoluteUrl(`/${config.slug}`),
    type: "website",
  },
};

export default function Page() {
  return <AreaLandingPage config={config} />;
}
