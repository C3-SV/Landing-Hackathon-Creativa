import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/ui/cn";

const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg disabled:pointer-events-none disabled:opacity-60",
  variants: {
    primary:
      "bg-brand-orange text-brand-white shadow-[0_6px_0_0_rgba(230,81,0,0.8)] hover:bg-brand-orange-soft",
    secondary:
      "border border-brand-electric/70 bg-brand-surface text-brand-white hover:bg-brand-electric/15",
    ghost: "text-brand-muted hover:bg-brand-surface/70 hover:text-brand-white",
    danger: "bg-status-rejected text-brand-white hover:bg-red-700",
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
