import { NextResponse } from "next/server";
import { clearStaffCookie } from "@/lib/staff/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  clearStaffCookie(response);
  return response;
}
