import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { canViewFinancials } from "@/lib/staff/permissions";
import { getOrders, getProducts } from "@/lib/db";
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
    const orders = await getOrders({});
    const products = await getProducts({});
    const todayStart = startOfDay();

    type OrderExt = (typeof orders)[0] & { payment_status?: string; fulfillment_status?: string };
    const ordersToday = orders.filter((o) => new Date(o.created_at) >= todayStart);
    const paidToday = ordersToday.filter((o) => {
      const x = o as OrderExt;
      return x.status === "paid" || x.payment_status === "paid";
    });
    const pendingOrders = orders.filter((o) => {
      const x = o as OrderExt;
      return x.status === "pending" || x.fulfillment_status === "pending";
    }).length;

    const lowStock = products.filter(
      (p) => p.stock != null && p.stock <= 5
    ).length;

    const customerPhones = new Set(orders.map((o) => o.phone));
    const { count: newCustomers } = await supabaseAdmin
      .from("customers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString());

    const revenueToday = paidToday.reduce(
      (s, o) => s + (o.total_amount || o.total || 0),
      0
    );

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    // Revenue chart data – last 30 days
    const chartDays: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = startOfDay(d);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const dayOrders = orders.filter((o) => {
        const t = new Date(o.created_at);
        return t >= dayStart && t < dayEnd && (o.status === "paid" || o.status === "shipped");
      });
      chartDays.push({
        date: dayStart.toISOString().slice(0, 10),
        revenue: dayOrders.reduce((s, o) => s + (o.total_amount || 0), 0),
        orders: dayOrders.length,
      });
    }

    return NextResponse.json({
      summary: {
        ordersToday: ordersToday.length,
        revenueToday: canViewFinancials(staff.role) ? revenueToday : null,
        pendingOrders,
        lowStockItems: lowStock,
        newCustomers: newCustomers ?? customerPhones.size,
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
