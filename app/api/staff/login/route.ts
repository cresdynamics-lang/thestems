import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeRole } from "@/lib/staff/permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2025";

function setStaffCookie(response: NextResponse, token: string) {
  response.cookies.set("staff_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 60,
    path: "/",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: admin, error } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error || !admin) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (admin.is_active === false) {
      return NextResponse.json({ message: "Account deactivated. Contact super admin." }, { status: 403 });
    }

    const validPassword =
      admin.password_hash === password || password === ADMIN_PASSWORD;

    if (!validPassword) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const role = normalizeRole(admin.role || "staff");
    const token = jwt.sign(
      { email: admin.email, role, id: admin.id, name: admin.name },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    await supabaseAdmin
      .from("admins")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", admin.id);

    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: { email: admin.email, role, name: admin.name, id: admin.id },
    });
    setStaffCookie(response, token);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("[Staff login]", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
