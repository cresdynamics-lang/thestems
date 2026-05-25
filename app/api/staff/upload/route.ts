import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";

export const dynamic = "force-dynamic";

/** Proxies to existing admin upload – reuses same handler logic */
export async function POST(request: NextRequest) {
  try {
    requireStaff(request);
    const adminUrl = new URL("/api/admin/upload", request.url);
    const formData = await request.formData();
    const res = await fetch(adminUrl, {
      method: "POST",
      headers: { Authorization: request.headers.get("authorization") || "" },
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
