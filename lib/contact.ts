import { SHOP_INFO } from "@/lib/constants";

export const WHATSAPP_DISPLAY = `+${SHOP_INFO.whatsapp}`;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${SHOP_INFO.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
