import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";

export async function guardAdmin() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");
  return session;
}
