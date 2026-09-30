/**
 * Thumbnail images for nav leaf hover previews.
 * Uses existing catalogue imagery (no new assets required).
 */

const F3 = "/images/products/flowers/BouquetFlowers3.jpg";
const F4 = "/images/products/flowers/BouquetFlowers4.jpg";
const F5 = "/images/products/flowers/BouquetFlowers5.jpg";
const H3 = "/images/products/hampers/GiftAmper3.jpg";
const H6 = "/images/products/hampers/GiftAmper6.jpg";
const T1 = "/images/products/teddies/Teddybear1.jpg";
const T2 = "/images/products/teddies/TeddyBears1.jpg";
const C1 = "/images/products/Chocolates/Chocolates1.jpg";
const W1 = "/images/products/wines/Wines1.jpg";

/** label → image path */
export const NAV_LEAF_IMAGES: Record<string, string> = {
  "All Flowers": F3,
  Roses: F3,
  "Pink Roses": F4,
  "White Roses": F5,
  "Mixed Flower Bouquets": F5,
  Lilies: F4,
  Sunflowers: F5,
  "Gypsophila / Baby's Breath": F4,
  "Flower Boxes": F3,
  "Hat Boxes": F5,
  "Premium & Luxury Flowers": F3,
  "All Gifts": H3,
  "Teddy Bears": T1,
  "Gift Hampers": H3,
  "Chocolates & Sweet Gifts": C1,
  Wines: W1,
  "Gift Cards": H6,
  "Flowers + Chocolate": C1,
  "Flowers + Teddy Bear": T2,
  "Fruit Baskets": H6,
  "Corporate Gifts": H3,
  "All Occasions": F3,
  Birthday: F5,
  Anniversary: F3,
  "Get Well Soon": F4,
  Congratulations: F5,
  "Thank You": F4,
  Apology: F3,
  "New Baby": T1,
  "Just Because": F5,
  "Valentine's Day": F3,
  "Mother's Day": F4,
  "International Women's Day": F5,
  Sympathy: F4,
  "Graduation Bouquets": F5,
  "PP2 Graduation": F5,
  "Grade 3 Graduation": F4,
  "Grade 6 Graduation": F3,
  "Grade 9 Graduation": F5,
  "Graduation Snack Bouquets": H6,
  "Graduation Teddy Bears": T2,
  "Graduation Gift Hampers": H3,
  "Wedding Flowers Nairobi": F4,
  "Bridal Bouquets": F3,
  "Bridesmaid Bouquets": F5,
  "Wedding Car Flowers": F4,
  "Wedding Centrepieces": F5,
  "Reception Décor": F3,
  "Wedding Arches": F4,
  "All Gift Hampers": H3,
  "Luxury Gift Hampers": H6,
  "Chocolate Hampers": C1,
  "Flower Hampers": H3,
  "Corporate Hampers": H6,
  "Custom Gift Hampers": H3,
  "Women's Gifts": F4,
  "Girlfriend Gifts": F3,
  "Men's Gifts": H3,
  Flowers: F3,
  Graduation: F5,
  "Same-Day Delivery": F3,
};

export function navLeafImage(label: string): string {
  return NAV_LEAF_IMAGES[label] || F3;
}
