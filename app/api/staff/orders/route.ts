import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { listOrdersForStaff } from "@/lib/staff/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const paymentMethod = request.nextUrl.searchParams.get("payment_method") || undefined;
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");

    let orders = await listOrdersForStaff({ status, limit: 150 });

    if (paymentMethod) {
      orders = orders.filter((o) => o.payment_method === paymentMethod);
    }
    if (from) {
      const fromDate = new Date(from);
      orders = orders.filter((o) => new Date(o.created_at) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      orders = orders.filter((o) => new Date(o.created_at) <= toDate);
    }

    return NextResponse.json(orders);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
