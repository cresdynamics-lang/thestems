import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { listOrdersForStaff } from "@/lib/staff/queries";

export const dynamic = "force-dynamic";

const CUSTOMER_COLUMNS =
  "id, name, email, phone, notes, is_blocked, total_orders, total_spend, created_at";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const search = request.nextUrl.searchParams.get("search")?.toLowerCase();

    const { data: dbCustomers } = await supabaseAdmin
      .from("customers")
      .select(CUSTOMER_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(300);

    if (dbCustomers?.length) {
      let list = dbCustomers;
      if (search) {
        list = list.filter(
          (c: { name: string; email?: string; phone: string }) =>
            c.name?.toLowerCase().includes(search) ||
            c.phone?.includes(search) ||
            c.email?.toLowerCase().includes(search)
        );
      }
      return NextResponse.json(list);
    }

    const orders = await listOrdersForStaff({ limit: 200 });
    const map = new Map<string, Record<string, unknown>>();
    for (const o of orders) {
      const key = o.phone;
      const cur = map.get(key) || {
        id: key,
        name: o.customer_name,
        phone: o.phone,
        email: o.email,
        total_orders: 0,
        total_spend: 0,
        created_at: o.created_at,
      };
      cur.total_orders = (cur.total_orders as number) + 1;
      cur.total_spend = (cur.total_spend as number) + (o.total_amount || 0);
      if (new Date(o.created_at) < new Date(cur.created_at as string)) {
        cur.created_at = o.created_at;
      }
      map.set(key, cur);
    }
    let list = Array.from(map.values());
    if (search) {
      list = list.filter(
        (c) =>
          String(c.name).toLowerCase().includes(search) ||
          String(c.phone).includes(search)
      );
    }
    return NextResponse.json(list);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireStaff(request);
    const body = await request.json();
    const { data, error } = await supabaseAdmin.from("customers").insert(body).select().single();
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
