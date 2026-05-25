import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { getOrders } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;

    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    const orders = await getOrders({});
    const phone = customer?.phone || id;
    const orderHistory = orders.filter((o) => o.phone === phone);

    return NextResponse.json({
      customer: customer || {
        id,
        phone,
        name: orderHistory[0]?.customer_name,
        email: orderHistory[0]?.email,
      },
      orders: orderHistory,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("customers")
      .update(body)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
