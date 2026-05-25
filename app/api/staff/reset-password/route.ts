import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();
    if (!email || !token || !password || password.length < 6) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const { data: admin } = await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .eq("reset_token", token)
      .maybeSingle();

    if (!admin || !admin.reset_token_expires_at) {
      return NextResponse.json({ message: "Invalid or expired reset link" }, { status: 400 });
    }

    if (new Date(admin.reset_token_expires_at) < new Date()) {
      return NextResponse.json({ message: "Reset link expired" }, { status: 400 });
    }

    await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .update({
        password_hash: password,
        reset_token: null,
        reset_token_expires_at: null,
      })
      .eq("id", admin.id);

    return NextResponse.json({ message: "Password updated. You can sign in now." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reset failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
