import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    return NextResponse.json(staff);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
