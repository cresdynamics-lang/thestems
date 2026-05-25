import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { logStaffAction, getClientIp } from "@/lib/staff/audit";
import { canDelete } from "@/lib/staff/permissions";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;
    const { data, error } = await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("id", id)
      .single();
    if (error) return NextResponse.json({ message: error.message }, { status: 404 });

    const { data: variants } = await (supabaseAdmin.from("product_variants") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("product_id", id);

    return NextResponse.json({ ...data, variants: variants || [] });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const staff = requireStaff(request);
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ message: error.message }, { status: 400 });

    await logStaffAction({
      staffId: staff.id,
      staffEmail: staff.email,
      action: "product.update",
      entityType: "product",
      entityId: id,
      ipAddress: getClientIp(request),
    });

    revalidateTag("products", "max");
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const staff = requireStaff(request);
    if (!canDelete(staff.role)) {
      return NextResponse.json({ message: "Staff role cannot delete products" }, { status: 403 });
    }
    const { id } = await params;
    const { error } = await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .delete()
      .eq("id", id);
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });

    await logStaffAction({
      staffId: staff.id,
      staffEmail: staff.email,
      action: "product.delete",
      entityType: "product",
      entityId: id,
      ipAddress: getClientIp(request),
    });

    revalidateTag("products", "max");
    return NextResponse.json({ message: "Deleted" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
