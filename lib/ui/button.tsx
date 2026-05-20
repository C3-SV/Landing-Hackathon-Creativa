import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/ui/cn";

const buttonStyles = {
  base: "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.08em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55",
  variants: {
    primary:
      "bg-brand-orange-soft text-brand-bg shadow-[0_6px_0_0_var(--brand-action)] hover:-translate-y-0.5 hover:bg-brand-orange hover:shadow-[0_8px_16px_rgba(255,107,0,0.28)]",
    secondary:
      "border border-brand-orange bg-transparent text-brand-orange-soft hover:-translate-y-0.5 hover:bg-brand-orange/12 hover:text-brand-orange",
    ghost: "text-brand-muted hover:bg-brand-surface/70 hover:text-brand-white",
    danger:
      "border border-brand-action/60 bg-brand-action text-brand-white hover:-translate-y-0.5 hover:bg-brand-action/90",
  },
} as const;

type Variant = keyof typeof buttonStyles.variants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonStyles.base, buttonStyles.variants[variant], className)}
      {...props}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function ButtonLink({
  href,
  className,
  variant = "primary",
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonStyles.base, buttonStyles.variants[variant], className)}
      {...props}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </Link>
  );
}
