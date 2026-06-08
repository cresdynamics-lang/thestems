import { supabase, supabaseAdmin } from "./supabase";
import { normalizeProduct } from "./productDisplay";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  isSupabaseServiceRoleConfigured,
  warnIfSupabaseNotConfigured,
} from "./supabaseConfig";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  category: "flowers" | "hampers" | "teddy" | "wines" | "chocolates" | "cards";
  subcategory?: string | null;
  tags: string[];
  teddy_size?: number | null;
  teddy_color?: string | null;
  images: string[];
  included_items?: Array<{ name: string; qty: number; note?: string }> | null;
  upsells?: string[] | null;
  stock?: number | null;
  visibility?: "published" | "draft" | string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    options?: Record<string, string>;
    image?: string;
    slug?: string;
  }>;
  total?: number; // alias for total_amount (for backward compatibility)
  total_amount: number;
  customer_name: string;
  phone: string;
  email?: string | null;
  delivery_address: string;
  delivery_city?: string | null;
  delivery_location?: string | null;
  gift_message?: string | null;
  special_instructions?: string | null;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  delivery_date: string;
  payment_method: "mpesa" | "mpesa_till" | "mpesa_paybill" | "card" | "whatsapp";
  mpesa_checkout_request_id?: string | null;
  mpesa_result_code?: number | null;
  mpesa_receipt_number?: string | null;
  pesapal_order_tracking_id?: string | null;
  pesapal_payment_method?: string | null;
  pesapal_confirmation_code?: string | null;
  status: "pending" | "paid" | "failed" | "cancelled" | "shipped" | "delivered";
  notes?: string | null;
  created_at: string;
  updated_at: string;
  paid_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
}

export function isProductPublished(product: { visibility?: string | null }): boolean {
  const v = product.visibility;
  return !v || v === "published";
}

/** Columns for catalogue/list views — smaller payload than select("*"). */
export const PUBLIC_PRODUCT_COLUMNS =
  "id, slug, title, description, short_description, price, category, subcategory, tags, teddy_size, teddy_color, images, visibility, created_at, updated_at";

export async function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  tags?: string[];
  teddy_size?: number[];
  teddy_color?: string[];
  /** Staff catalogue: include draft/unpublished rows */
  includeDrafts?: boolean;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured("getProducts");
    return [];
  }

  try {
    let query = supabase
      .from("products")
      .select(PUBLIC_PRODUCT_COLUMNS)
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.subcategory) {
      query = query.eq("subcategory", filters.subcategory);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains("tags", filters.tags);
    }

    if (filters?.teddy_size && filters.teddy_size.length > 0) {
      query = query.in("teddy_size", filters.teddy_size);
    }

    if (filters?.teddy_color && filters.teddy_color.length > 0) {
      query = query.in("teddy_color", filters.teddy_color);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", formatSupabaseError(error));
      return [];
    }

    const mapped = (data || []).map((row: any) =>
      normalizeProduct({
        ...row,
        visibility: row.visibility ?? "published",
        tags: row.tags || [],
        images: row.images || [],
        included_items: row.included_items || null,
        upsells: row.upsells || null,
        subcategory: row.subcategory || null,
      } as Product)
    );

    if (filters?.includeDrafts) return mapped;
    return mapped.filter(isProductPublished);
  } catch (error) {
    console.error("Error fetching products:", formatSupabaseError(error));
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured("getProductBySlug");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching product:", formatSupabaseError(error));
      return null;
    }

    if (!data) return null;

    const product = normalizeProduct({
      ...(data as any),
      visibility: (data as any).visibility ?? "published",
      tags: (data as any).tags || [],
      images: (data as any).images || [],
      included_items: (data as any).included_items || null,
      upsells: (data as any).upsells || null,
      subcategory: (data as any).subcategory || null,
    } as Product);

    return isProductPublished(product) ? product : null;
  } catch (error) {
    console.error("Error fetching product:", formatSupabaseError(error));
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured("getProductById");
    return null;
  }

  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching product:", formatSupabaseError(error));
      return null;
    }

    if (!data) return null;

    return normalizeProduct({
      ...(data as any),
      tags: (data as any).tags || [],
      images: (data as any).images || [],
      included_items: (data as any).included_items || null,
      upsells: (data as any).upsells || null,
      subcategory: (data as any).subcategory || null,
    } as Product);
  } catch (error) {
    console.error("Error fetching product:", formatSupabaseError(error));
    return null;
  }
}

export async function createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Database is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server."
    );
  }

  if (!isSupabaseServiceRoleConfigured()) {
    throw new Error(
      "Cannot save orders: SUPABASE_SERVICE_ROLE_KEY is missing from .env.local. Copy it from Supabase → Project Settings → API → service_role key."
    );
  }

  try {
    const insertData: any = {
      items: order.items,
      total_amount: order.total_amount || order.total || 0,
      customer_name: order.customer_name,
      phone: order.phone,
      email: order.email || null,
      delivery_city: order.delivery_city || order.delivery_location || null,
      delivery_location: order.delivery_location || order.delivery_city || null,
      delivery_date: order.delivery_date,
      payment_method: order.payment_method,
      status: order.status || "pending",
      mpesa_checkout_request_id: order.mpesa_checkout_request_id || null,
      notes: order.notes || null,
      gift_message: order.gift_message || null,
      special_instructions: order.special_instructions || null,
      recipient_name: order.recipient_name || null,
      recipient_phone: order.recipient_phone || null,
    };
    
    // Use delivery_address - the database column has been renamed
    insertData.delivery_address = order.delivery_address;

    const { data, error } = await (supabaseAdmin
      .from("orders") as any)
      .insert(insertData)
      .select()
      .single();

    if (error) {
      const message = formatSupabaseError(error);
      console.error("Error creating order:", message);
      throw new Error(message);
    }

    if (!data) {
      throw new Error("Order was not created — no data returned from database.");
    }

    (data as any).total = data.total_amount;
    return data as Order;
  } catch (error) {
    if (error instanceof Error) throw error;
    console.error("Error creating order:", formatSupabaseError(error));
    throw new Error(formatSupabaseError(error));
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await (supabaseAdmin.from("orders") as any).select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching order:", error);
      return null;
    }

    if (data) {
      // Add total alias for backward compatibility
      (data as any).total = data.total_amount;
      // Map 'delivery_address' from DB (or 'address' if migration not run yet)
      if (!data.delivery_address && data.address) {
        data.delivery_address = data.address;
      }
    }

    return data as Order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  try {
    const updateData: any = {};

    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.mpesa_result_code !== undefined) updateData.mpesa_result_code = updates.mpesa_result_code;
    if (updates.mpesa_receipt_number !== undefined) updateData.mpesa_receipt_number = updates.mpesa_receipt_number;
    if (updates.mpesa_checkout_request_id !== undefined) updateData.mpesa_checkout_request_id = updates.mpesa_checkout_request_id;
    if (updates.delivery_city !== undefined) updateData.delivery_city = updates.delivery_city;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    // Pesapal-specific fields
    if (updates.pesapal_order_tracking_id !== undefined) updateData.pesapal_order_tracking_id = updates.pesapal_order_tracking_id;
    if (updates.pesapal_payment_method !== undefined) updateData.pesapal_payment_method = updates.pesapal_payment_method;
    if (updates.pesapal_confirmation_code !== undefined) updateData.pesapal_confirmation_code = updates.pesapal_confirmation_code;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await (supabaseAdmin
      .from("orders") as any)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return null;
    }

    return data as Order;
  } catch (error) {
    console.error("Error updating order:", error);
    return null;
  }
}

export async function getOrders(filters?: {
  status?: string;
}): Promise<Order[]> {
  try {
    // If no status filter, return all orders
    if (!filters?.status) {
      const { data, error } = await (supabaseAdmin.from("orders") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all orders:", error);
        return [];
      }
      
      return (data || []).map((order: any) => ({
        ...order,
        total: order.total_amount,
        delivery_address: order.address || order.delivery_address,
      })) as Order[];
    }
    
    const { data, error } = await (supabaseAdmin.from("orders") as any)
      .select("*")
      .eq("status", filters.status)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error(`Error fetching ${filters.status} orders:`, error);
      return [];
    }
    
    const processedOrders = (data || []).map((order: any) => ({
      ...order,
      total: order.total_amount,
      delivery_address: order.address || order.delivery_address,
    })) as Order[];
    
    return processedOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
