import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { FLOWERS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Flowers Nairobi | Bouquets, Roses & Same-Day Delivery | The Stems",
  "Shop flowers in Nairobi — roses, mixed bouquets, flower boxes and premium arrangements with same-day delivery from The Stems Flowers CBD.",
  "/flowers"
);

export default function FlowersHubPage() {
  return (
    <CategoryHubView
      title="Flowers"
      description=""
      h1="Flowers in Nairobi"
      intro="Browse roses, mixed bouquets, flower boxes and premium arrangements. Same-day flower delivery across Nairobi from The Stems Flowers at Delta Hotel, University Way."
      leaves={FLOWERS_NAV}
      skipLabels={["All Flowers"]}
      shopHref="/collections/flowers"
      shopLabel="Shop all flowers"
    />
  );
}
