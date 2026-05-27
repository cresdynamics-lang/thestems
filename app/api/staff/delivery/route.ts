import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { listOrdersForStaff } from "@/lib/staff/queries";
import { DELIVERY_LOCATIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);

    const { data: zones } = await supabaseAdmin
      .from("delivery_zones")
      .select("id, name, area, delivery_fee, is_active")
      .order("name");
    const { data: personnel } = await supabaseAdmin
      .from("delivery_personnel")
      .select("id, name, phone, is_active")
      .eq("is_active", true);

    const pending = await listOrdersForStaff({
      limit: 80,
      pendingDeliveryOnly: true,
    });

    const defaultZones = DELIVERY_LOCATIONS.slice(0, 20).map((z, i) => ({
      id: `default-${i}`,
      name: z.name,
      area: z.name,
      delivery_fee: z.fee,
      is_active: true,
    }));

    return NextResponse.json({
      zones: zones?.length ? zones : defaultZones,
      personnel: personnel || [],
      pendingDeliveries: pending,
    });
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
    const table = body.type === "personnel" ? "delivery_personnel" : "delivery_zones";
    const { data, error } = await supabaseAdmin.from(table).insert(body.data).select().single();
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
