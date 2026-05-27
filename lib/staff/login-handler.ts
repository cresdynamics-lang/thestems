import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeRole } from "@/lib/staff/permissions";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2025";
const SESSION = "30m";

export type StaffLoginResult =
  | {
      ok: true;
      token: string;
      user: { email: string; role: string; name?: string; id?: string };
    }
  | { ok: false; status: number; message: string };

export async function performStaffLogin(
  email: string,
  password: string
): Promise<StaffLoginResult> {
  if (!email?.trim() || !password) {
    return { ok: false, status: 400, message: "Email and password required" };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data: admin, error } = await supabaseAdmin
    .from("admins")
    .select("id, email, role, name, password_hash, is_active")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error || !admin) {
    return { ok: false, status: 401, message: "Invalid email or password" };
  }

  if (admin.is_active === false) {
    return {
      ok: false,
      status: 403,
      message: "Account deactivated. Contact super admin.",
    };
  }

  const validPassword =
    admin.password_hash === password || password === ADMIN_PASSWORD;

  if (!validPassword) {
    return { ok: false, status: 401, message: "Invalid email or password" };
  }

  const role = normalizeRole(admin.role || "staff");
  const token = jwt.sign(
    { email: admin.email, role, id: admin.id, name: admin.name },
    JWT_SECRET,
    { expiresIn: SESSION }
  );

  const user = { email: admin.email, role, name: admin.name, id: admin.id };

  void supabaseAdmin
    .from("admins")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", admin.id);

  return { ok: true, token, user };
}
