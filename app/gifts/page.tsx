import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { GIFTS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Gifts Nairobi | Teddy Bears, Hampers, Chocolates & More | The Stems",
  "Shop gifts in Nairobi: teddy bears, gift hampers, chocolates, wines and flower combos. Same-day delivery from The Stems Flowers CBD.",
  "/gifts"
);

export default function GiftsHubPage() {
  return (
    <CategoryHubView
      title="Gifts"
      description=""
      h1="Gifts in Nairobi"
      intro="Flowers, teddy bears, gift hampers, chocolates and more — curated gifts with same-day delivery across Nairobi from The Stems Flowers."
      leaves={GIFTS_NAV}
      skipLabels={["All Gifts"]}
      shopHref="/collections/gift-hampers"
      shopLabel="Shop gift hampers"
    />
  );
}
