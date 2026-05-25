import { supabaseAdmin } from "@/lib/supabase";

export async function logStaffAction(params: {
  staffId?: string;
  staffEmail: string;
  staffName?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  try {
    await (supabaseAdmin.from("staff_audit_logs") as ReturnType<typeof supabaseAdmin.from>).insert({
      staff_id: params.staffId || null,
      staff_email: params.staffEmail,
      staff_name: params.staffName || null,
      action: params.action,
      entity_type: params.entityType || null,
      entity_id: params.entityId || null,
      details: params.details || null,
      ip_address: params.ipAddress || null,
    });
  } catch (e) {
    console.error("[Audit] Failed to log action:", e);
  }
}

export async function logStaffLogin(params: {
  staffId?: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}) {
  try {
    await (supabaseAdmin.from("staff_login_audit") as ReturnType<typeof supabaseAdmin.from>).insert({
      staff_id: params.staffId || null,
      email: params.email,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
      success: params.success,
    });
  } catch (e) {
    console.error("[Audit] Failed to log login:", e);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
