"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseJsonResponse } from "@/lib/http";
import { Button } from "@/lib/ui";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onLogout() {
    setPending(true);
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      const payload = await parseJsonResponse<{ redirectTo?: string }>(response);
      router.push(payload.redirectTo ?? "/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={onLogout} disabled={pending}>
      {pending ? "Saliendo..." : "Cerrar sesión"}
    </Button>
  );
}
