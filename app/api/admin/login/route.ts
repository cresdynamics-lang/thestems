import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ALLOWED_EMAIL = (process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com")
  .trim()
  .toLowerCase();
const ALLOWED_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2025";

function successResponse(email: string, role: string, id?: string) {
  const token = jwt.sign({ email, role, id }, JWT_SECRET, { expiresIn: "7d" });
  return NextResponse.json({ message: "Login successful", token });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedEmail !== ALLOWED_EMAIL) {
      return NextResponse.json(
        { message: "Access denied. Only authorized administrators can access this dashboard." },
        { status: 403 }
      );
    }

    if (password === ALLOWED_PASSWORD) {
      return successResponse(ALLOWED_EMAIL, "admin");
    }

    const { data: admin } = await supabaseAdmin
      .from("admins")
      .select("id, email, role, password_hash, is_active")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (admin?.is_active === false) {
      return NextResponse.json({ message: "Account deactivated." }, { status: 403 });
    }

    if (admin && (admin.password_hash === password || password === ALLOWED_PASSWORD)) {
      return successResponse(
        admin.email,
        admin.role || "admin",
        admin.id
      );
    }

    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
