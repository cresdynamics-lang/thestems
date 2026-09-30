import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { GRADUATION_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Graduation Gifts Nairobi | Bouquets, Teddy & Hampers | The Stems",
  "Graduation flowers and gifts in Nairobi for PP2, Grade 3, 6 and 9. Bouquets, snack hampers and teddy bears with same-day delivery.",
  "/graduation"
);

export default function GraduationHubPage() {
  return (
    <CategoryHubView
      title="Graduation"
      description=""
      h1="Graduation Flowers & Gifts Nairobi"
      intro="Celebrate PP2, Grade 3, Grade 6, Grade 9 and campus graduations with fresh bouquets, teddy bears and gift hampers. Same-day delivery across Nairobi."
      leaves={GRADUATION_NAV}
      shopHref="/graduation-bouquets-nairobi"
      shopLabel="Graduation bouquets Nairobi"
    />
  );
}
