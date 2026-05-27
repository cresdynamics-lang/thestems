import { NextRequest, NextResponse } from "next/server";
import { performStaffLogin } from "@/lib/staff/login-handler";
import { setStaffCookie } from "@/lib/staff/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const result = await performStaffLogin(email, password);

    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }

    const response = NextResponse.json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
    setStaffCookie(response, result.token);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("[Staff login]", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
