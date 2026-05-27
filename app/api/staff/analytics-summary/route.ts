import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { getLiveVisitorsDashboard } from "@/lib/analytics-server";

export const dynamic = "force-dynamic";

/** @deprecated Prefer GET /api/staff/live-visitors (includes summary) */
export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { summary } = await getLiveVisitorsDashboard();
    return NextResponse.json(summary);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to load analytics" }, { status: 500 });
  }
}
