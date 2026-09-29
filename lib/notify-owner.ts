import { SHOP_INFO } from "@/lib/constants";

/**
 * Owner phone alerts for The Stems.
 *
 * Channels (first configured wins for each message; all enabled channels fire):
 * 1. Africa's Talking SMS — AT_USERNAME + AT_API_KEY (+ optional AT_SENDER_ID)
 * 2. CallMeBot WhatsApp — CALLMEBOT_API_KEY (owner activates once with CallMeBot)
 *
 * Target phone: OWNER_PHONE env, else SHOP_INFO.phone (254725707143).
 */

export type OwnerAlertKind =
  | "new_order"
  | "payment_paid"
  | "contact"
  | "custom";

function ownerPhone(): string {
  const raw = (process.env.OWNER_PHONE || SHOP_INFO.phone || "").replace(/\D/g, "");
  if (!raw) return "";
  if (raw.startsWith("0")) return `254${raw.slice(1)}`;
  if (raw.startsWith("254")) return raw;
  return raw;
}

function truncateSms(text: string, max = 320): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1)}…`;
}

async function sendAfricaTalkingSms(to: string, message: string): Promise<boolean> {
  const username = process.env.AT_USERNAME || process.env.AFRICASTALKING_USERNAME;
  const apiKey = process.env.AT_API_KEY || process.env.AFRICASTALKING_API_KEY;
  if (!username || !apiKey) return false;

  const senderId = process.env.AT_SENDER_ID || process.env.AFRICASTALKING_FROM || "";
  const body = new URLSearchParams({
    username,
    to,
    message: truncateSms(message),
  });
  if (senderId) body.set("from", senderId);

  const res = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      apiKey,
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("❌ Africa's Talking SMS failed:", res.status, errText.slice(0, 300));
    return false;
  }

  console.log("✅ Owner SMS sent via Africa's Talking to", to);
  return true;
}

async function sendCallMeBotWhatsApp(to: string, message: string): Promise<boolean> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) return false;

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", to);
  url.searchParams.set("text", truncateSms(message, 1000));
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("❌ CallMeBot WhatsApp failed:", res.status, errText.slice(0, 300));
    return false;
  }

  console.log("✅ Owner WhatsApp sent via CallMeBot to", to);
  return true;
}

export async function notifyOwnerPhone(
  message: string,
  kind: OwnerAlertKind = "custom"
): Promise<{ sent: boolean; channels: string[] }> {
  const to = ownerPhone();
  if (!to) {
    console.warn("⚠️ OWNER_PHONE / SHOP_INFO.phone missing — owner phone alert skipped");
    return { sent: false, channels: [] };
  }

  const channels: string[] = [];
  const text = truncateSms(`[The Stems] ${message}`, 1000);

  try {
    if (await sendAfricaTalkingSms(to, text)) channels.push("sms");
  } catch (e) {
    console.error("❌ Owner SMS error:", e);
  }

  try {
    if (await sendCallMeBotWhatsApp(to, text)) channels.push("whatsapp");
  } catch (e) {
    console.error("❌ Owner WhatsApp error:", e);
  }

  if (channels.length === 0) {
    console.warn(
      `⚠️ Owner phone alert not sent (${kind}). Set AT_USERNAME+AT_API_KEY and/or CALLMEBOT_API_KEY.`
    );
  }

  return { sent: channels.length > 0, channels };
}

/** Short SMS for a new pending order. */
export function formatNewOrderSms(order: {
  id: string;
  customer_name?: string | null;
  phone?: string | null;
  total_amount?: number | null;
  total?: number | null;
  payment_method?: string | null;
  delivery_address?: string | null;
  items?: Array<{ name?: string; quantity?: number }> | null;
}): string {
  const shortId = order.id.slice(0, 8);
  const totalKes = ((order.total_amount ?? order.total ?? 0) / 100).toFixed(0);
  const itemCount = Array.isArray(order.items)
    ? order.items.reduce((n, i) => n + (i.quantity || 1), 0)
    : 0;
  const itemsPreview = Array.isArray(order.items)
    ? order.items
        .slice(0, 3)
        .map((i) => `${i.quantity || 1}x ${i.name || "item"}`)
        .join(", ")
    : "";

  return [
    `NEW ORDER #${shortId}`,
    `${order.customer_name || "Customer"} · ${order.phone || "no phone"}`,
    `KES ${totalKes} · ${order.payment_method || "payment"} · ${itemCount} item(s)`,
    itemsPreview ? itemsPreview : "",
    order.delivery_address ? `Deliver: ${order.delivery_address}` : "",
    `https://thestemsflowers.co.ke/staff/orders`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatPaidOrderSms(order: {
  id: string;
  customer_name?: string | null;
  phone?: string | null;
  total_amount?: number | null;
  total?: number | null;
  payment_method?: string | null;
}): string {
  const shortId = order.id.slice(0, 8);
  const totalKes = ((order.total_amount ?? order.total ?? 0) / 100).toFixed(0);
  return [
    `PAID ORDER #${shortId}`,
    `${order.customer_name || "Customer"} · ${order.phone || ""}`,
    `KES ${totalKes} via ${order.payment_method || "Pesapal"}`,
    `Prepare & deliver now.`,
    `https://thestemsflowers.co.ke/staff/orders`,
  ].join("\n");
}

export function formatContactSms(input: {
  name: string;
  phone?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
}): string {
  return [
    `CONTACT: ${input.name}`,
    input.phone ? `Phone: ${input.phone}` : "",
    input.email ? `Email: ${input.email}` : "",
    input.subject ? `Re: ${input.subject}` : "",
    input.message.slice(0, 180),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Fire-and-forget wrapper so callers never block on phone delivery. */
export function notifyOwnerPhoneBackground(
  message: string,
  kind: OwnerAlertKind = "custom"
): void {
  void notifyOwnerPhone(message, kind).catch((err) => {
    console.error("❌ Background owner phone notify failed:", err);
  });
}
