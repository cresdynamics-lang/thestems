import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { normalizeRole } from "./permissions";
import type { StaffRole } from "./constants";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const STAFF_SESSION = "30m";

export interface StaffTokenPayload {
  email: string;
  role: StaffRole;
  id?: string;
  name?: string;
}

export function signStaffToken(payload: StaffTokenPayload): string {
  return jwt.sign(
    {
      ...payload,
      role: normalizeRole(payload.role),
    },
    JWT_SECRET,
    { expiresIn: STAFF_SESSION }
  );
}

export function extractStaffToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  return (
    authHeader?.replace("Bearer ", "") ||
    request.cookies.get("staff_token")?.value ||
    request.cookies.get("admin_token")?.value ||
    request.nextUrl.searchParams.get("token") ||
    null
  );
}

export function verifyStaffToken(request: NextRequest): StaffTokenPayload | null {
  try {
    const token = extractStaffToken(request);

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as StaffTokenPayload;
    return {
      ...decoded,
      role: normalizeRole(decoded.role),
    };
  } catch {
    return null;
  }
}

export function requireStaff(request: NextRequest): StaffTokenPayload {
  const payload = verifyStaffToken(request);
  if (!payload) throw new Error("Unauthorized");
  return payload;
}

export function setStaffCookie(response: NextResponse, token: string) {
  response.cookies.set("staff_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 60,
    path: "/",
  });
}

export function clearStaffCookie(response: NextResponse) {
  response.cookies.set("staff_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
