import Link from "next/link";
import { BRANDING } from "@/lib/constants/branding";
import { LogoutButton } from "@/features/admin/components/logout-button";

type AdminShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/registrations", label: "Equipos" },
  { href: "/admin/challenges", label: "Retos" },
];

export function AdminShell({ userEmail, children }: AdminShellProps) {
  return (
    <div className="min-h-full">
      <header className="border-b border-brand-electric/30 bg-brand-surface/65 backdrop-blur">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-display text-xs uppercase text-brand-white">
              Admin {BRANDING.eventName}
            </Link>
            <nav className="flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-brand-muted transition hover:bg-brand-bg/65 hover:text-brand-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">
              {userEmail}
            </p>
            <LogoutButton />
          </div>
        </div>
        <div className="container-shell pb-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-electric">
            {BRANDING.conceptUpper} · {BRANDING.eventSubtitle} · {BRANDING.thematicLine}
          </p>
        </div>
      </header>
      <main className="container-shell py-6">{children}</main>
    </div>
  );
}
