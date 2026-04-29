import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/components";
import { getSessionUser } from "@/lib/auth/session";
import { isAllowedAdminEmail } from "@/lib/auth/admin";

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user && isAllowedAdminEmail(user.email)) {
    redirect("/admin");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
