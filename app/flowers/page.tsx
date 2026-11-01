import Link from "next/link";
import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { FLOWERS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Flowers Nairobi | Bouquets & Roses",
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
    >
        <h2>Choosing flowers in Nairobi</h2>
        <p>
          Roses are our most requested flower: <Link href="/red-roses-nairobi">red</Link> for romance,{" "}
          <Link href="/pink-roses-nairobi">pink</Link> for admiration and{" "}
          <Link href="/white-roses-nairobi">white</Link> for weddings and sympathy. If you are unsure of colours, a{" "}
          <Link href="/mixed-bouquets-nairobi">mixed bouquet</Link> suits most occasions, and a{" "}
          <Link href="/flower-boxes-nairobi">flower box</Link> needs no vase, which helps for offices and hospitals.
        </p>
        <h2>Prices and delivery</h2>
        <p>
          Bouquets start from KSh 3,000. Our <Link href="/blog/flower-prices-nairobi">flower price guide</Link> shows
          what each budget buys. Order by 4PM for <Link href="/same-day-flower-delivery-nairobi">same-day delivery</Link>.
          Delivery is free within Nairobi CBD, KSh 300 to Westlands and Kilimani, and KSh 600 to Karen. You can pay
          with M-Pesa or card, or walk in to our shop at Delta Hotel Building, University Way.
        </p>
    </CategoryHubView>
  );
}
