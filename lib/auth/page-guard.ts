import { redirect } from "next/navigation";
import { APP_ENV } from "@/lib/constants/env";
import { getSessionUser } from "@/lib/auth/session";

export async function requireAdminPageUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  if (!APP_ENV.adminEmails.includes(user.email.toLowerCase())) {
    redirect("/admin/login?error=forbidden");
  }

  return user;
}
