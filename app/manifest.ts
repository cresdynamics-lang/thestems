import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Stems Flowers Nairobi",
    short_name: "The Stems",
    description:
      "Fresh flowers, gift hampers and teddy bears with same-day delivery across Nairobi.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8C8DC",
    theme_color: "#E75480",
    lang: "en-KE",
    icons: [
      {
        src: "/images/logo/thestemslogo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    scope: SITE_URL,
  };
}
