import { AdminShell } from "@/features/admin/components";
import { requireAdminPageUser } from "@/lib/auth/page-guard";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPageUser();

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
