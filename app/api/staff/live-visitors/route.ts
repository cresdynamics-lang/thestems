import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { getLiveVisitorsDashboard } from "@/lib/analytics-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
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
