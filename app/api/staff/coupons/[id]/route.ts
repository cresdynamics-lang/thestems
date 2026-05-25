import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await supabaseAdmin.from("coupons").update(body).eq("id", id).select().single();
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const staff = requireStaff(request);
    const { canDelete } = await import("@/lib/staff/permissions");
    if (!canDelete(staff.role)) {
      return NextResponse.json({ message: "Staff cannot delete coupons" }, { status: 403 });
    }
    const { id } = await params;
    await supabaseAdmin.from("coupons").delete().eq("id", id);
    return NextResponse.json({ message: "Deleted" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
