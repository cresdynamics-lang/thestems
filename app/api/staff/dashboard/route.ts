import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { canViewFinancials } from "@/lib/staff/permissions";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function GET(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const todayStart = startOfDay();
    const chartStart = new Date();
    chartStart.setDate(chartStart.getDate() - 13);
    chartStart.setHours(0, 0, 0, 0);

    const [
      recentRes,
      chartRes,
      ordersTodayRes,
      pendingRes,
      lowStockRes,
      newCustomersRes,
      revenueTodayRes,
    ] = await Promise.all([
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("id, customer_name, total_amount, payment_method, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("created_at, total_amount, status")
        .gte("created_at", chartStart.toISOString())
        .in("status", ["paid", "shipped", "delivered"]),
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString()),
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
        .select("*", { count: "exact", head: true })
        .lte("stock", 5)
        .not("stock", "is", null),
      (supabaseAdmin.from("customers") as ReturnType<typeof supabaseAdmin.from>)
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString()),
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("total_amount")
        .gte("created_at", todayStart.toISOString())
        .in("status", ["paid", "shipped", "delivered"]),
    ]);

    const recentOrders = (recentRes.data ?? []).map((o: Record<string, unknown>) => ({
      ...o,
      total_amount: o.total_amount,
    }));

    const chartOrders = chartRes.data ?? [];
    const chartDays: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = startOfDay(d);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const dayOrders = (chartOrders as { created_at: string; total_amount: number }[]).filter(
        (o) => {
          const t = new Date(o.created_at);
          return t >= dayStart && t < dayEnd;
        }
      );
      chartDays.push({
        date: dayStart.toISOString().slice(0, 10),
        revenue: dayOrders.reduce((s, o) => s + (o.total_amount || 0), 0),
        orders: dayOrders.length,
      });
    }

    const revenueToday = canViewFinancials(staff.role)
      ? ((revenueTodayRes.data ?? []) as { total_amount: number }[]).reduce(
          (s, o) => s + (o.total_amount || 0),
          0
        )
      : null;

    return NextResponse.json({
      summary: {
        ordersToday: ordersTodayRes.count ?? 0,
        revenueToday,
        pendingOrders: pendingRes.count ?? 0,
        lowStockItems: lowStockRes.count ?? 0,
        newCustomers: newCustomersRes.count ?? 0,
      },
      recentOrders,
      chartDays,
      role: staff.role,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to load dashboard" }, { status: 500 });
  }
}
