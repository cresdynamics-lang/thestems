import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const status = request.nextUrl.searchParams.get("status");
    let query = supabaseAdmin.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (status) query = query.eq("status", status);
    const { data } = await query;
    const { data: waLogs } = await supabaseAdmin
      .from("whatsapp_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return NextResponse.json({ messages: data || [], whatsappLogs: waLogs || [] });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireStaff(request);
    const { id, status, reply, email } = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (reply) updates.staff_reply = reply;

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });

    if (reply && email && resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Re: Your enquiry – Floral Whispers Gifts",
        html: `<p>${reply.replace(/\n/g, "<br>")}</p><p>— Floral Whispers Gifts Team</p>`,
      });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
