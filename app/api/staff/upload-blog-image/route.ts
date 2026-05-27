import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";

export const dynamic = "force-dynamic";

/** Staff upload for blog images – forwards to admin handler with auth */
export async function POST(request: NextRequest) {
  try {
    requireStaff(request);
    const formData = await request.formData();

    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("staff_token")?.value;

    const adminUrl = new URL("/api/admin/upload-blog-image", request.url);
    const res = await fetch(adminUrl, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json() : null;
    return NextResponse.json(data ?? { message: "Upload failed" }, { status: res.status });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
