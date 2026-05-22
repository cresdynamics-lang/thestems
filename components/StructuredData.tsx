import {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  buildServicesItemListJsonLd,
  buildSitewideFaqJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";

const schemas = [
  buildOrganizationJsonLd(),
  buildLocalBusinessJsonLd(),
  buildWebsiteJsonLd(),
  buildServicesItemListJsonLd(),
  buildSitewideFaqJsonLd(),
];

export default function StructuredData() {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
