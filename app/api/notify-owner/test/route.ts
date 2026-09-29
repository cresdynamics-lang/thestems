import { NextRequest, NextResponse } from "next/server";
import { notifyOwnerPhone } from "@/lib/notify-owner";

/**
 * POST /api/notify-owner/test
 * Body: { secret?: string, message?: string }
 * Requires NOTIFY_TEST_SECRET env (or ADMIN password match) to avoid abuse.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = String(body.secret || "");
    const expected =
      process.env.NOTIFY_TEST_SECRET ||
      process.env.ADMIN_PASSWORD ||
      "";

    if (!expected || secret !== expected) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const message =
      body.message ||
      `Test alert from The Stems website at ${new Date().toISOString()}`;

    const result = await notifyOwnerPhone(String(message), "custom");
    return NextResponse.json({
      ok: result.sent,
      channels: result.channels,
      hint: result.sent
        ? "Alert delivered"
        : "No SMS/WhatsApp channel configured. Set AT_USERNAME+AT_API_KEY and/or CALLMEBOT_API_KEY on the server.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
