import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const [totalRes, pendingRes, paidRes, revenueRes] = await Promise.all([
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>).select("*", {
        count: "exact",
        head: true,
      }),
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("*", { count: "exact", head: true })
        .eq("status", "paid"),
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("total_amount")
        .eq("status", "paid"),
    ]);

    const totalRevenue = ((revenueRes.data ?? []) as { total_amount: number }[]).reduce(
      (sum, o) => sum + (o.total_amount || 0),
      0
    );

    return NextResponse.json({
      totalOrders: totalRes.count ?? 0,
      pendingOrders: pendingRes.count ?? 0,
      paidOrders: paidRes.count ?? 0,
      totalRevenue,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Stats error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
