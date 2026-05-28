import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/ui/cn";

const fieldBase =
  "w-full rounded-xl border border-brand-electric/45 bg-brand-bg px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-muted/75 shadow-[inset_0_0_0_1px_rgba(26,130,255,0.08)] transition focus-visible:border-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/45";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "font-mono text-xs uppercase tracking-[0.08em] text-brand-white",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-28", className)} {...props} />;
}

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export function Checkbox({
  className,
  label,
  description,
  ...props
}: CheckboxProps) {
  return (
    <label className="relative flex cursor-pointer items-start gap-3 overflow-hidden rounded-2xl border border-brand-electric/45 bg-brand-bg/55 p-3.5 transition hover:border-brand-electric/70">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-white/65"
      />
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 rounded border-brand-electric/55 bg-brand-bg accent-brand-orange focus-visible:ring-brand-orange",
          className,
        )}
        {...props}
      />
      <span>
        <span className="block font-mono text-sm font-medium text-brand-white">{label}</span>
        {description ? (
          <span className="mt-1 block font-mono text-xs leading-relaxed text-brand-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p role="alert" className="mt-1 font-mono text-xs text-brand-action">
      {message}
    </p>
  );
}
