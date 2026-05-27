import { supabaseAdmin } from "@/lib/supabase";

export const ORDER_LIST_COLUMNS =
  "id, customer_name, phone, email, delivery_address, delivery_city, delivery_date, payment_method, status, fulfillment_status, total_amount, items, created_at, updated_at";

export type StaffOrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  delivery_address: string;
  delivery_city?: string | null;
  delivery_date: string;
  payment_method: string;
  status: string;
  fulfillment_status?: string | null;
  total_amount: number;
  items?: unknown[];
  created_at: string;
  updated_at?: string;
  total?: number;
};

export async function listOrdersForStaff(options?: {
  status?: string;
  limit?: number;
  from?: string;
  pendingDeliveryOnly?: boolean;
}): Promise<StaffOrderRow[]> {
  const limit = options?.limit ?? 150;

  let query = (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
    .select(ORDER_LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.from) {
    query = query.gte("created_at", options.from);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Staff] listOrdersForStaff:", error.message);
    return [];
  }

  let rows = (data ?? []) as StaffOrderRow[];

  if (options?.pendingDeliveryOnly) {
    rows = rows.filter(
      (o) =>
        ["pending", "confirmed", "packed", "out_for_delivery", "paid"].includes(
          o.fulfillment_status || o.status
        ) && o.status !== "cancelled"
    );
  }

  return rows.map((o) => ({
    ...o,
    total: o.total_amount,
    delivery_address:
      (o as StaffOrderRow & { address?: string }).delivery_address ||
      (o as StaffOrderRow & { address?: string }).address ||
      "",
  }));
}

export const PRODUCT_SUMMARY_COLUMNS =
  "id, slug, title, price, category, images, visibility, stock, tags";

export async function listProductsSummary(category?: string) {
  let query = (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
    .select(PRODUCT_SUMMARY_COLUMNS)
    .order("title", { ascending: true });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((p) => ({
    ...p,
    images: Array.isArray((p as { images?: unknown }).images)
      ? (p as { images: string[] }).images
      : [],
    tags: Array.isArray((p as { tags?: unknown }).tags) ? (p as { tags: string[] }).tags : [],
    description: "",
    short_description: "",
  }));
}
