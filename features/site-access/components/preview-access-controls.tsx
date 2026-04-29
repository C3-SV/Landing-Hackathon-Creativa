"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/lib/ui";

type PreviewAccessControlsProps = {
  userEmail: string;
};

export function PreviewAccessControls({ userEmail }: PreviewAccessControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  async function onLogout() {
    setPending(true);
    try {
      await fetch("/api/preview/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed right-4 top-4 z-50 hidden items-center gap-2 rounded-full border border-brand-electric/50 bg-brand-surface/95 px-3 py-2 shadow-lg backdrop-blur md:flex">
      <span className="font-mono text-[10px] uppercase tracking-wide text-brand-muted">
        Vista privada · {userEmail}
      </span>
      <Button
        type="button"
        variant="secondary"
        className="rounded-full px-3 py-1 text-xs"
        onClick={onLogout}
        disabled={pending}
      >
        {pending ? "Saliendo..." : "Salir"}
      </Button>
    </div>
  );
}
