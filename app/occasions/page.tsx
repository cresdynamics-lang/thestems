import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { OCCASIONS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Flower Occasions Nairobi | Birthday, Anniversary & More | The Stems",
  "Shop flowers and gifts by occasion in Nairobi: birthday, anniversary, apology, Valentine’s, get well soon and more. Same-day delivery.",
  "/occasions"
);

export default function OccasionsHubPage() {
  return (
    <CategoryHubView
      title="Occasions"
      description=""
      h1="Flowers & Gifts by Occasion"
      intro="Find the right arrangement for every moment — birthday, anniversary, apology, get well soon, sympathy and more. Same-day flower delivery across Nairobi."
      leaves={OCCASIONS_NAV}
      skipLabels={["All Occasions"]}
      shopHref="/collections/flowers"
      shopLabel="Shop flowers"
    />
  );
}
