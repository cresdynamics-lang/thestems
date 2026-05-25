import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { canViewFinancials } from "@/lib/staff/permissions";
import { getOrders, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    if (!canViewFinancials(staff.role)) {
      return NextResponse.json({ message: "Financials restricted to Super Admin" }, { status: 403 });
    }

    const period = request.nextUrl.searchParams.get("period") || "month";
    const orders = await getOrders({});
    const products = await getProducts({});

    const paid = orders.filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered");
    const now = new Date();
    const cutoff = new Date();
    if (period === "day") cutoff.setDate(cutoff.getDate() - 1);
    else if (period === "week") cutoff.setDate(cutoff.getDate() - 7);
    else cutoff.setMonth(cutoff.getMonth() - 1);

    const periodOrders = paid.filter((o) => new Date(o.created_at) >= cutoff);
    const totalRevenue = periodOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
    const avgOrderValue = periodOrders.length ? Math.round(totalRevenue / periodOrders.length) : 0;

    const byPayment: Record<string, number> = {};
    for (const o of periodOrders) {
      byPayment[o.payment_method] = (byPayment[o.payment_method] || 0) + (o.total_amount || 0);
    }

    const byCategory: Record<string, number> = {};
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const o of periodOrders) {
      for (const item of o.items || []) {
        const cat = productMap.get(item.productId)?.category || "other";
        byCategory[cat] = (byCategory[cat] || 0) + item.price * item.quantity;
      }
    }

    const productSales: Record<string, { units: number; revenue: number; name: string }> = {};
    for (const o of periodOrders) {
      for (const item of o.items || []) {
        const key = item.productId || item.name;
        if (!productSales[key]) {
          productSales[key] = { units: 0, revenue: 0, name: item.name };
        }
        productSales[key].units += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      }
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const vatRate = 16;
    const vatAmount = Math.round(totalRevenue * (vatRate / (100 + vatRate)));

    return NextResponse.json({
      period,
      totalRevenue,
      orderCount: periodOrders.length,
      avgOrderValue,
      byPayment,
      byCategory,
      topProducts,
      vat: { rate: vatRate, amount: vatAmount },
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
