import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://floralwhispersgifts.co.ke";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { data: admin } = await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    // Always return success to avoid email enumeration
    if (!admin) {
      return NextResponse.json({ message: "If that email exists, a reset link was sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .update({ reset_token: token, reset_token_expires_at: expires })
      .eq("id", admin.id);

    const resetUrl = `${SITE_URL}/staff/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: admin.email,
        subject: "The Stems – Staff password reset",
        html: `<p>Click to reset your staff password (valid 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    } else {
      console.log("[Staff reset]", resetUrl);
    }

    return NextResponse.json({ message: "If that email exists, a reset link was sent." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
