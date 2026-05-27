import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAnalyticsSummary } from "@/lib/analytics-server";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to load analytics" }, { status: 500 });
  }
}
