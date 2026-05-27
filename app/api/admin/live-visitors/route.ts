import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLiveVisitorsDashboard } from "@/lib/analytics-server";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const compact = request.nextUrl.searchParams.get("compact") === "1";
    const data = await getLiveVisitorsDashboard({ compact });
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const message = e instanceof Error ? e.message : "Failed to fetch live visitors";
    return NextResponse.json({ message }, { status: 500 });
  }
}
