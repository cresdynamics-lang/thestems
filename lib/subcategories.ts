// Subcategory definitions for each product category
// Flower occasions + types live in productFilterTags (admin checkboxes / filters).

import {
  FLOWER_TYPE_TAGS,
  OCCASION_TAGS,
  GIFT_TYPE_TAGS,
} from "@/lib/productFilterTags";

export const SUBCATEGORIES = {
  flowers: [...FLOWER_TYPE_TAGS, ...OCCASION_TAGS] as string[],
  hampers: [...GIFT_TYPE_TAGS, ...OCCASION_TAGS] as string[],
  teddy: ["25cm", "50cm", "100cm", "120cm", "160cm", "180cm", "200cm"] as string[],
  wines: [...OCCASION_TAGS] as string[],
  chocolates: [...GIFT_TYPE_TAGS, ...OCCASION_TAGS] as string[],
  cards: [...OCCASION_TAGS] as string[],
} as const;

export type FlowerSubcategory = string;
export type HamperSubcategory = string;
export type TeddySubcategory = (typeof SUBCATEGORIES.teddy)[number];
export type WineSubcategory = string;
export type ChocolateSubcategory = string;

export type Subcategory =
  | FlowerSubcategory
  | HamperSubcategory
  | TeddySubcategory
  | WineSubcategory
  | ChocolateSubcategory;

export function getSubcategoriesForCategory(
  category: "flowers" | "hampers" | "teddy" | "wines" | "chocolates" | "cards"
): readonly string[] {
  return SUBCATEGORIES[category] || [];
}
