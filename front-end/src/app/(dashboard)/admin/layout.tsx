// src/app/(dashboard)/admin/layout.tsx
import RoleGate from "@/components/role-gate";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate require={["ADMIN"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGate>
  );
}
