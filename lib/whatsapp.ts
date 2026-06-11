import { SHOP_INFO } from "./constants";
import { formatCurrency, formatDateTime } from "./utils";

export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, string>;
}

export interface WhatsAppOrderData {
  items: WhatsAppOrderItem[];
  total: number;
  customerName?: string;
  phone?: string;
  address?: string;
  deliveryDate?: string;
  notes?: string;
}

export function generateWhatsAppLink(data: WhatsAppOrderData): string {
  const items = data.items
    .map(
      (item) =>
        `${item.quantity}x ${item.name} ${item.options ? `(${Object.values(item.options).join(", ")})` : ""} - ${formatCurrency(item.price * item.quantity)}`
    )
    .join("\n");

  let message = `Hello! I'd like to place an order:\n\n`;
  message += `*Items:*\n${items}\n\n`;
  message += `*Total: ${formatCurrency(data.total)}*\n\n`;

  if (data.customerName) {
    message += `*Name:* ${data.customerName}\n`;
  }
  if (data.phone) {
    message += `*Phone:* ${data.phone}\n`;
  }
  if (data.address) {
    message += `*Delivery Address:* ${data.address}\n`;
  }
  if (data.deliveryDate) {
    message += `*Delivery Date:* ${data.deliveryDate}\n`;
  }
  if (data.notes) {
    message += `*Notes:* ${data.notes}\n`;
  }

  message += `\nPlease confirm availability and delivery time. Thank you!`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encoded}`;
}

export function generateProductWhatsAppLink(
  productName: string,
  price: number,
  quantity: number = 1
): string {
  const message = `Hello! I'm interested in:\n\n*${productName}*\nQuantity: ${quantity}\nPrice: ${formatCurrency(price)}\n\nPlease let me know availability and delivery options.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encoded}`;
}

export type PaidOrderWhatsAppInput = {
  id: string;
  total_amount?: number;
  total?: number;
  items?: Array<{ name: string; quantity?: number }>;
  customer_name?: string;
};

/** Message sent after online payment is confirmed (Pesapal / card). */
export function buildPaidOrderWhatsAppMessage(order: PaidOrderWhatsAppInput): string {
  const shortId = order.id.slice(0, 8);
  const total = order.total_amount || order.total || 0;
  const itemLines = (order.items || [])
    .map((item) => `• ${item.quantity || 1}x ${item.name}`)
    .join("\n");

  return `🌸 Hello! I just completed payment for order #${shortId}.

📦 Order Details:
${itemLines || `• ${(order.items || []).length} product(s)`}
• Total: ${formatCurrency(total)}
• Payment: ✅ Confirmed
${order.customer_name ? `• Name: ${order.customer_name}` : ""}

Please confirm receipt and delivery details. Thank you! 🌺`;
}

export function getPaidOrderWhatsAppUrl(order: PaidOrderWhatsAppInput): string {
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(buildPaidOrderWhatsAppMessage(order))}`;
}

/** Navigate to WhatsApp (more reliable than window.open after payment). */
export function redirectToWhatsApp(url: string): void {
  window.location.assign(url);
}

const WHATSAPP_REDIRECT_KEY = "whatsapp_redirected_";
const WHATSAPP_TIMER_KEY = "whatsapp_timer_started_";

export function hasWhatsAppRedirectScheduled(orderId: string): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    sessionStorage.getItem(`${WHATSAPP_REDIRECT_KEY}${orderId}`) ||
      sessionStorage.getItem(`${WHATSAPP_TIMER_KEY}${orderId}`)
  );
}

export function markWhatsAppRedirectScheduled(orderId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${WHATSAPP_TIMER_KEY}${orderId}`, "true");
}

export function markWhatsAppRedirectDone(orderId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${WHATSAPP_REDIRECT_KEY}${orderId}`, "true");
}

/** Schedule redirect after successful payment; returns false if already scheduled. */
export function schedulePaidOrderWhatsAppRedirect(
  order: PaidOrderWhatsAppInput,
  options?: { delayMs?: number; onScheduled?: () => void }
): boolean {
  if (typeof window === "undefined") return false;
  if (hasWhatsAppRedirectScheduled(order.id)) return false;

  markWhatsAppRedirectScheduled(order.id);
  options?.onScheduled?.();

  const delayMs = options?.delayMs ?? 5000;
  window.setTimeout(() => {
    markWhatsAppRedirectDone(order.id);
    redirectToWhatsApp(getPaidOrderWhatsAppUrl(order));
  }, delayMs);

  return true;
}

