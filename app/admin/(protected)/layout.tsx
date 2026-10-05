import { AdminShell } from "@/components/admin/AdminShell";
import { guardAdmin } from "@/lib/admin/guard";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardAdmin();
  return <AdminShell>{children}</AdminShell>;
}
