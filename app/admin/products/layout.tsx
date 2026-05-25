import { AdminPanelShell } from "@/components/admin/AdminPanelShell";

export default function AdminProductsLayout({ children }: { children: React.ReactNode }) {
  return <AdminPanelShell>{children}</AdminPanelShell>;
}
