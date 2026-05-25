import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { logStaffAction, getClientIp } from "@/lib/staff/audit";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;
    const { data, error } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("id", id)
      .single();
    if (error) return NextResponse.json({ message: error.message }, { status: 404 });
    return NextResponse.json(data);
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
    const staff = requireStaff(request);
    const { id } = await params;
    const body = await request.json();

    const { data: existing } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("status_history, fulfillment_status")
      .eq("id", id)
      .single();

    const history = Array.isArray(existing?.status_history) ? [...existing.status_history] : [];
    if (body.fulfillment_status) {
      history.push({
        status: body.fulfillment_status,
        at: new Date().toISOString(),
        by: staff.email,
      });
      body.status_history = history;
    }

    const { data, error } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ message: error.message }, { status: 400 });

    await logStaffAction({
      staffId: staff.id,
      staffEmail: staff.email,
      action: "order.update",
      entityType: "order",
      entityId: id,
      details: body,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
