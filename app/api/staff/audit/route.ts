import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const email = request.nextUrl.searchParams.get("email");
    const action = request.nextUrl.searchParams.get("action");
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");

    let query = supabaseAdmin
      .from("staff_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (email) query = query.eq("staff_email", email);
    if (action) query = query.ilike("action", `%${action}%`);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data: logs } = await query;
    const { data: logins } = await supabaseAdmin
      .from("staff_login_audit")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ logs: logs || [], logins: logins || [] });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
