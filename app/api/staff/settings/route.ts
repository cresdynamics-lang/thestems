import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { canManageStaff } from "@/lib/staff/permissions";
import { supabaseAdmin } from "@/lib/supabase";
import { SHOP_INFO } from "@/lib/constants";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS: Record<string, string> = {
  store_name: "Floral Whispers Gifts",
  store_address: SHOP_INFO.address,
  store_phone: SHOP_INFO.phone,
  store_email: SHOP_INFO.email,
  store_whatsapp: SHOP_INFO.whatsapp,
  mpesa_till: SHOP_INFO.mpesa.till,
  mpesa_paybill: SHOP_INFO.mpesa.paybill,
  mpesa_account: SHOP_INFO.mpesa.account,
  tax_vat_rate: "16",
  notify_new_order: "true",
  notify_low_stock: "true",
};

export async function GET(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const { data: settings } = await supabaseAdmin.from("site_settings").select("*");
    const map: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const s of settings || []) {
      map[s.key] = s.value;
    }

    let staffUsers: unknown[] = [];
    if (canManageStaff(staff.role)) {
      const { data } = await supabaseAdmin.from("admins").select("id, email, name, role, is_active, last_login_at, created_at");
      staffUsers = data || [];
    }

    return NextResponse.json({ settings: map, staffUsers });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const body = await request.json();

    if (body.settings) {
      for (const [key, value] of Object.entries(body.settings)) {
        await supabaseAdmin.from("site_settings").upsert(
          { key, value: String(value), updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
      }
    }

    if (body.staffUser && canManageStaff(staff.role)) {
      const { id, ...updates } = body.staffUser;
      if (id) {
        await supabaseAdmin.from("admins").update(updates).eq("id", id);
      } else {
        await supabaseAdmin.from("admins").insert({
          email: updates.email,
          password_hash: updates.password,
          name: updates.name,
          role: updates.role || "staff",
          is_active: true,
        });
      }
    }

    return NextResponse.json({ message: "Settings saved" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
