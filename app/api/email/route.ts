import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const RECIPIENT_EMAIL = process.env.ADMIN_EMAIL || "thestemsflowers.ke@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR";
// Use onboarding@resend.dev as default (always verified by Resend)
// For production, verify your own domain in Resend dashboard and use that
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, subject, message, html, name, email, phone } = body;

    if (type === "contact" && name && message) {
      try {
        await supabaseAdmin.from("contact_messages").insert({
          name,
          email: email || null,
          phone: phone || null,
          subject: subject || "Contact form",
          message,
          status: "unread",
        });
      } catch (dbErr) {
        console.error("contact_messages insert:", dbErr);
      }
    }

    if (!subject || (!message && !html)) {
      return NextResponse.json(
        { message: "Subject and message are required" },
        { status: 400 }
      );
    }

    if (!resend) {
      console.log("Resend not configured. Would send:", {
        to: RECIPIENT_EMAIL,
        subject,
        message: message || html,
      });
      return NextResponse.json(
        { 
          message: "Email service not configured. Please set RESEND_API_KEY environment variable.",
          sent: false 
        },
        { status: 200 }
      );
    }

    console.log("Sending email via Resend:", {
      from: FROM_EMAIL,
      to: RECIPIENT_EMAIL,
      subject: subject,
    });

    const emailData = await resend.emails.send({
      from: FROM_EMAIL,
      to: RECIPIENT_EMAIL,
      subject: subject,
      html: html || message?.replace(/\n/g, "<br>") || `<p>${message}</p>`,
    });

    console.log("Resend response:", JSON.stringify(emailData, null, 2));

    if (emailData.error) {
      console.error("Resend error:", emailData.error);
      throw new Error(emailData.error.message || "Failed to send email");
    }

    return NextResponse.json({ 
      message: "Email sent successfully",
      sent: true,
      id: emailData.data?.id,
      from: FROM_EMAIL,
      to: RECIPIENT_EMAIL,
    });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { 
        message: error.message || "Failed to send email",
        sent: false 
      },
      { status: 500 }
    );
  }
}

