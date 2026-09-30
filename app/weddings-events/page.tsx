import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { WEDDINGS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Weddings & Events Nairobi | Bridal Flowers & Décor | The Stems",
  "Wedding flowers and event décor in Nairobi — bridal bouquets, centrepieces, car flowers and reception arrangements from The Stems.",
  "/weddings-events"
);

export default function WeddingsEventsHubPage() {
  return (
    <CategoryHubView
      title="Weddings"
      description=""
      h1="Weddings & Events Nairobi"
      intro="Bridal bouquets, bridesmaid flowers, centrepieces, arches and wedding car décor — planned with you for ceremonies across Nairobi."
      leaves={WEDDINGS_NAV}
      shopHref="/wedding-flowers-nairobi"
      shopLabel="Wedding flowers Nairobi"
    />
  );
}
