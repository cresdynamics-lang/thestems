import type { StaffRole } from "./constants";

export function normalizeRole(role: string): StaffRole {
  if (role === "super_admin" || role === "admin") return "super_admin";
  return "staff";
}

export function isSuperAdmin(role: string): boolean {
  return normalizeRole(role) === "super_admin";
}

export function canDelete(role: string): boolean {
  return isSuperAdmin(role);
}

export function canViewFinancials(role: string): boolean {
  return isSuperAdmin(role);
}

export function canManageStaff(role: string): boolean {
  return isSuperAdmin(role);
}
